import { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { SectionHeading } from '@/components/ui';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import {
  findMatchingRate,
  extractPrice,
  detectService,
  calculateDifference,
  verifiedRates,
  negotiationPhrases,
  type VerifiedRate,
  type ServiceType,
} from '@/data/verifiedRates';
import { supabase } from '@/lib/supabase';
import {
  Shield,
  Mic,
  MicOff,
  AlertTriangle,
  CheckCircle2,
  Volume2,
  Flag,
  ArrowRight,
  MapPin,
  Car,
  Languages,
  Sparkles,
  Loader2,
  X,
  Waves,
} from 'lucide-react';

type Phase = 'idle' | 'listening' | 'analyzed' | 'reported';

interface AnalysisResult {
  transcript: string;
  service: ServiceType | null;
  matchedRate: VerifiedRate | null;
  askedPrice: number | null;
  standardPrice: number | null;
  differencePercent: number;
  isOvercharging: boolean;
  severity: 'low' | 'moderate' | 'high' | 'safe';
}

export function ScamShield() {
  const { ref, visible } = useScrollReveal();
  const [phase, setPhase] = useState<Phase>('idle');
  const [selectedCity, setSelectedCity] = useState('Agra');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [reportStatus, setReportStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportNote, setReportNote] = useState('');
  const [showLangPanel, setShowLangPanel] = useState(false);
  const [manualPrice, setManualPrice] = useState('');
  const analysisTimerRef = useRef<number | null>(null);

  const {
    transcript,
    interimTranscript,
    status,
    errorMessage,
    isSupported,
    start,
    stop,
    reset,
  } = useSpeechRecognition('en-IN');

  const fullTranscript = (transcript + ' ' + interimTranscript).trim();

  const runAnalysis = useCallback((text: string, city: string, askedOverride?: number) => {
    if (!text.trim() && askedOverride === undefined) return;

    const service = detectService(text);
    const matchedRate = findMatchingRate(text, city);
    const askedPrice = askedOverride ?? extractPrice(text);
    const standardPrice = matchedRate?.standardFare ?? null;

    let diff = 0;
    let isOver = false;
    let severity: AnalysisResult['severity'] = 'safe';

    if (askedPrice !== null && standardPrice !== null) {
      const result = calculateDifference(standardPrice, askedPrice);
      diff = result.percent;
      isOver = result.isOvercharging;
      if (!result.isOvercharging) {
        severity = 'safe';
      } else {
        severity = result.severity;
      }
    }

    setAnalysis({
      transcript: text,
      service,
      matchedRate,
      askedPrice,
      standardPrice,
      differencePercent: diff,
      isOvercharging: isOver,
      severity,
    });
    setPhase('analyzed');
  }, []);

  // Auto-analyze when transcript stops coming in
  useEffect(() => {
    if (status !== 'listening') return;
    if (analysisTimerRef.current) {
      clearTimeout(analysisTimerRef.current);
    }
    analysisTimerRef.current = window.setTimeout(() => {
      if (fullTranscript.length > 3) {
        stop();
        runAnalysis(fullTranscript, selectedCity);
      }
    }, 2000);

    return () => {
      if (analysisTimerRef.current) clearTimeout(analysisTimerRef.current);
    };
  }, [transcript, interimTranscript, status, fullTranscript, selectedCity, stop, runAnalysis]);

  const handleStartCheck = () => {
    reset();
    setAnalysis(null);
    setPhase('idle');
    start();
    setPhase('listening');
  };

  const handleStop = () => {
    stop();
    if (fullTranscript.length > 3) {
      runAnalysis(fullTranscript, selectedCity);
    } else {
      setPhase('idle');
    }
  };

  const handleManualCheck = () => {
    const price = parseInt(manualPrice, 10);
    if (isNaN(price) || price <= 0) return;
    runAnalysis(`price ${price} rupees ${selectedCity}`, selectedCity, price);
    setManualPrice('');
  };

  const speakAlert = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleSpeakAlert = () => {
    if (!analysis || !analysis.matchedRate || analysis.askedPrice === null) return;
    const text = analysis.isOvercharging
      ? `Warning! Possible overcharging detected. Standard fare for this route is ${analysis.standardPrice} rupees. Requested fare is ${analysis.askedPrice} rupees. The requested amount is significantly higher than the verified rate.`
      : `The fare looks reasonable. Standard rate is ${analysis.standardPrice} rupees and you are being asked for ${analysis.askedPrice} rupees.`;
    speakAlert(text);
  };

  const handleNegotiate = () => {
    if (!analysis || !analysis.matchedRate) return;
    const fare = analysis.standardPrice ?? 0;
    const phrase = negotiationPhrases[String(fare)] ?? negotiationPhrases['50'];
    speakAlert(phrase.phrase);
  };

  const handleReport = async () => {
    if (!analysis) return;
    setReportStatus('submitting');
    try {
      const { error } = await supabase.from('scam_reports').insert({
        service_type: analysis.service ?? 'auto-rickshaw',
        location: selectedCity,
        route: analysis.matchedRate?.route ?? 'Unknown',
        standard_fare: analysis.standardPrice ?? 0,
        asked_fare: analysis.askedPrice ?? 0,
        difference_percent: analysis.differencePercent,
        conversation_transcript: analysis.transcript,
        reporter_note: reportNote || null,
      });
      if (error) throw error;
      setReportStatus('success');
      setPhase('reported');
      setShowReportModal(false);
      setReportNote('');
    } catch {
      setReportStatus('error');
    }
  };

  const severityConfig = {
    high: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700', icon: 'bg-red-500', label: 'SEVERE OVERCHARGING', pulse: true },
    moderate: { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-700', icon: 'bg-orange-500', label: 'POSSIBLE OVERCHARGING', pulse: true },
    low: { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-700', icon: 'bg-yellow-500', label: 'MINOR OVERCHARGING', pulse: false },
    safe: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-700', icon: 'bg-green-500', label: 'FAIR PRICE', pulse: false },
  };

  const cities = [...new Set(verifiedRates.map((r) => r.city))];

  return (
    <section id="scam-shield" className="relative overflow-hidden bg-gradient-to-b from-charcoal-950 to-charcoal-900 py-24 lg:py-32">
      {/* Decorative glow */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute left-1/4 top-1/3 h-64 w-64 rounded-full bg-terracotta blur-[120px]" />
        <div className="absolute right-1/4 bottom-1/3 h-64 w-64 rounded-full bg-gold-500 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-5 lg:px-8">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-terracotta/20 px-4 py-2">
            <Shield className="h-4 w-4 text-terracotta" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold-300">Scam Shield</span>
          </div>
          <h2 className="font-serif text-4xl font-bold leading-tight text-white sm:text-5xl">
            Don't get overcharged.
            <br />
            <span className="italic text-gold-300">Let your phone listen.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ivory/60">
            Tap the button, speak your conversation with the driver, guide, or seller. We compare the price against verified government rates and warn you instantly — in your language.
          </p>
        </div>

        <div
          ref={ref}
          className={cn(
            'mt-10 overflow-hidden rounded-3xl border border-white/10 bg-charcoal-800/80 shadow-2xl backdrop-blur-xl transition-all duration-700',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          {/* City selector */}
          <div className="flex items-center gap-3 border-b border-white/10 p-4">
            <MapPin className="h-4 w-4 text-gold-300" />
            <span className="text-xs font-medium text-ivory/50">Your location:</span>
            <div className="flex flex-wrap gap-1.5">
              {cities.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCity(c)}
                  className={cn(
                    'rounded-full px-3 py-1 text-xs font-medium transition-all',
                    selectedCity === c
                      ? 'bg-terracotta text-white'
                      : 'bg-white/5 text-ivory/60 hover:bg-white/10'
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Main check area */}
          <div className="p-6 lg:p-10">
            {/* IDLE / LISTENING state */}
            {phase === 'idle' && (
              <div className="flex flex-col items-center text-center">
                <button
                  onClick={handleStartCheck}
                  disabled={!isSupported}
                  className={cn(
                    'group relative flex h-28 w-28 items-center justify-center rounded-full transition-all duration-500',
                    isSupported
                      ? 'bg-gradient-to-br from-terracotta to-terracotta-600 hover:scale-105 shadow-2xl shadow-terracotta/30'
                      : 'bg-charcoal-700 cursor-not-allowed opacity-50'
                  )}
                >
                  {isSupported ? (
                    <Mic className="h-12 w-12 text-white" />
                  ) : (
                    <MicOff className="h-10 w-10 text-ivory/40" />
                  )}
                  {isSupported && (
                    <span className="absolute inset-0 -z-10 animate-ping rounded-full border-2 border-terracotta opacity-40" />
                  )}
                </button>
                <h3 className="mt-6 font-serif text-2xl font-bold text-white">
                  {isSupported ? 'Start Price Check' : 'Voice Not Supported'}
                </h3>
                <p className="mt-2 max-w-sm text-sm text-ivory/50">
                  {isSupported
                    ? 'Tap and speak your conversation. We\'ll detect the price and compare it to verified rates.'
                    : 'Your browser doesn\'t support voice recognition. Use the manual price check below.'}
                </p>

                {/* Manual price fallback */}
                {!isSupported && (
                  <div className="mt-6 flex items-center gap-2 rounded-2xl bg-white/5 p-2">
                    <span className="px-3 text-lg font-bold text-gold-300">₹</span>
                    <input
                      type="number"
                      value={manualPrice}
                      onChange={(e) => setManualPrice(e.target.value)}
                      placeholder="Enter asked price"
                      className="w-40 bg-transparent text-sm text-white placeholder:text-ivory/30 focus:outline-none"
                    />
                    <button
                      onClick={handleManualCheck}
                      className="rounded-xl bg-terracotta px-4 py-2 text-sm font-semibold text-white hover:bg-terracotta-600"
                    >
                      Check
                    </button>
                  </div>
                )}

                {/* Feature badges */}
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  {[
                    { icon: Languages, label: 'Multilingual' },
                    { icon: MapPin, label: 'Location-based' },
                    { icon: Shield, label: 'Verified rates' },
                    { icon: Sparkles, label: 'Offline fallback' },
                  ].map((f) => (
                    <span key={f.label} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-ivory/60">
                      <f.icon className="h-3.5 w-3.5 text-gold-300" />
                      {f.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* LISTENING state */}
            {phase === 'listening' && (
              <div className="flex flex-col items-center text-center">
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-terracotta to-terracotta-600 shadow-2xl shadow-terracotta/40">
                  <Mic className="h-12 w-12 text-white" />
                  {/* Animated rings */}
                  <span className="absolute inset-0 -z-10 animate-ping rounded-full border-2 border-terracotta opacity-60" />
                  <span className="absolute -inset-2 -z-10 animate-pulse rounded-full border border-terracotta/40" />
                </div>
                <h3 className="mt-6 font-serif text-2xl font-bold text-white animate-pulse-soft">Listening…</h3>
                <p className="mt-2 text-sm text-ivory/50">Speak naturally. We're transcribing in real time.</p>

                {/* Live waveform animation */}
                <div className="mt-6 flex items-center gap-1">
                  {[...Array(20)].map((_, i) => (
                    <span
                      key={i}
                      className="w-1 rounded-full bg-gold-300"
                      style={{
                        height: `${8 + Math.random() * 24}px`,
                        animation: `pulseSoft 0.${4 + (i % 4)}s ease-in-out infinite`,
                        animationDelay: `${i * 0.05}s`,
                      }}
                    />
                  ))}
                </div>

                {/* Live transcript */}
                {(transcript || interimTranscript) && (
                  <div className="mt-6 w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
                    <span className="text-xs font-bold uppercase tracking-wider text-gold-300/70">Live transcript</span>
                    <p className="mt-2 text-sm leading-relaxed text-ivory/80">
                      {transcript} <span className="text-ivory/40">{interimTranscript}</span>
                    </p>
                  </div>
                )}

                <button
                  onClick={handleStop}
                  className="mt-6 flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/15"
                >
                  <MicOff className="h-4 w-4" /> Stop & Analyze
                </button>

                {errorMessage && (
                  <p className="mt-4 text-sm text-red-400">{errorMessage}</p>
                )}
              </div>
            )}

            {/* ANALYZED state */}
            {phase === 'analyzed' && analysis && (
              <div className="animate-fade-in-up">
                {/* Severity alert */}
                {analysis.severity !== 'safe' && analysis.askedPrice !== null && analysis.standardPrice !== null ? (
                  <div className={cn(
                    'rounded-2xl border-2 p-5',
                    severityConfig[analysis.severity].bg,
                    severityConfig[analysis.severity].border
                  )}>
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
                        severityConfig[analysis.severity].icon
                      )}>
                        <AlertTriangle className={cn('h-6 w-6 text-white', severityConfig[analysis.severity].pulse && 'animate-pulse-soft')} />
                      </div>
                      <div className="flex-1">
                        <p className={cn('text-lg font-bold', severityConfig[analysis.severity].text)}>
                          {severityConfig[analysis.severity].label}
                        </p>
                        <p className={cn('mt-1 text-sm', severityConfig[analysis.severity].text)}>
                          The requested amount is <strong>{Math.abs(analysis.differencePercent)}% higher</strong> than the verified rate.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : analysis.askedPrice !== null && analysis.standardPrice !== null ? (
                  <div className="rounded-2xl border-2 border-green-300 bg-green-50 p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-500">
                        <CheckCircle2 className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-green-700">FAIR PRICE</p>
                        <p className="mt-1 text-sm text-green-700">The requested fare is within the verified rate range.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border-2 border-yellow-300 bg-yellow-50 p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yellow-500">
                        <AlertTriangle className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-yellow-700">Couldn't detect price</p>
                        <p className="mt-1 text-sm text-yellow-700">We heard the conversation but couldn't extract a price. Try again or enter it manually.</p>
                        <div className="mt-3 flex items-center gap-2">
                          <input
                            type="number"
                            value={manualPrice}
                            onChange={(e) => setManualPrice(e.target.value)}
                            placeholder="Enter asked price"
                            className="w-36 rounded-lg border border-yellow-300 bg-white px-3 py-1.5 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-yellow-400/30"
                          />
                          <button
                            onClick={handleManualCheck}
                            className="rounded-lg bg-yellow-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-yellow-600"
                          >
                            Check
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Price comparison breakdown */}
                {analysis.matchedRate && (
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold-300/70">
                        <Car className="h-3.5 w-3.5" /> Detected
                      </span>
                      <p className="mt-2 text-lg font-bold text-white capitalize">
                        {analysis.service?.replace('-', ' ') ?? 'Unknown'}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-green-400/70">Standard</span>
                      <p className="mt-2 font-serif text-2xl font-bold text-green-400">
                        ₹{analysis.standardPrice}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <span className={cn('text-xs font-bold uppercase tracking-wider', analysis.isOvercharging ? 'text-red-400/70' : 'text-gold-300/70')}>
                        Asked
                      </span>
                      <p className={cn('mt-2 font-serif text-2xl font-bold', analysis.isOvercharging ? 'text-red-400' : 'text-white')}>
                        ₹{analysis.askedPrice}
                      </p>
                    </div>
                  </div>
                )}

                {/* Route details */}
                {analysis.matchedRate && (
                  <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-2 text-xs text-ivory/50">
                      <MapPin className="h-3.5 w-3.5 text-gold-300" />
                      <span className="font-medium">{analysis.matchedRate.city}</span>
                      <span>·</span>
                      <span>{analysis.matchedRate.route}</span>
                    </div>
                    <p className="mt-2 text-sm text-ivory/60">{analysis.matchedRate.notes}</p>
                  </div>
                )}

                {/* Transcript */}
                {analysis.transcript && (
                  <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-ivory/40">Conversation transcript</span>
                    <p className="mt-2 text-sm italic leading-relaxed text-ivory/60">"{analysis.transcript.trim()}"</p>
                  </div>
                )}

                {/* Action buttons */}
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <button
                    onClick={handleSpeakAlert}
                    disabled={!analysis.matchedRate}
                    className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 p-4 text-center transition-all hover:bg-white/10 disabled:opacity-40"
                  >
                    <Volume2 className="h-5 w-5 text-gold-300" />
                    <span className="text-xs font-semibold text-ivory/80">Speak Alert</span>
                  </button>
                  <button
                    onClick={handleNegotiate}
                    disabled={!analysis.matchedRate}
                    className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 p-4 text-center transition-all hover:bg-white/10 disabled:opacity-40"
                  >
                    <Languages className="h-5 w-5 text-gold-300" />
                    <span className="text-xs font-semibold text-ivory/80">Negotiate (Hindi)</span>
                  </button>
                  <button
                    onClick={() => setShowReportModal(true)}
                    className="flex flex-col items-center gap-1.5 rounded-2xl border border-terracotta/30 bg-terracotta/10 p-4 text-center transition-all hover:bg-terracotta/20"
                  >
                    <Flag className="h-5 w-5 text-terracotta" />
                    <span className="text-xs font-semibold text-terracotta">Report Scam</span>
                  </button>
                  <button
                    onClick={() => { reset(); setAnalysis(null); setPhase('idle'); }}
                    className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 p-4 text-center transition-all hover:bg-white/10"
                  >
                    <ArrowRight className="h-5 w-5 text-ivory/60" />
                    <span className="text-xs font-semibold text-ivory/80">New Check</span>
                  </button>
                </div>
              </div>
            )}

            {/* REPORTED state */}
            {phase === 'reported' && (
              <div className="flex flex-col items-center text-center animate-fade-in-up py-8">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500">
                  <CheckCircle2 className="h-10 w-10 text-white" />
                </div>
                <h3 className="mt-6 font-serif text-2xl font-bold text-white">Report Submitted</h3>
                <p className="mt-2 max-w-sm text-sm text-ivory/50">
                  Thank you for helping protect other travelers. Your report has been recorded and will help the community identify scam hotspots.
                </p>
                <button
                  onClick={() => { reset(); setAnalysis(null); setPhase('idle'); setReportStatus('idle'); }}
                  className="mt-6 rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/15"
                >
                  Run Another Check
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Offline rate preview */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-2">
            <Waves className="h-4 w-4 text-gold-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-ivory/50">Offline verified rates — {selectedCity}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {verifiedRates
              .filter((r) => r.city === selectedCity)
              .slice(0, 6)
              .map((r) => (
                <span key={r.id} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-ivory/60">
                  <span className="capitalize text-gold-300/80">{r.service.replace('-', ' ')}</span>
                  · {r.route} · <strong className="text-green-400">₹{r.standardFare}</strong>
                </span>
              ))}
          </div>
        </div>
      </div>

      {/* Report modal */}
      {showReportModal && analysis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-charcoal-950/70 backdrop-blur-sm" onClick={() => setShowReportModal(false)} />
          <div className="relative w-full max-w-md animate-fade-in-up rounded-3xl bg-ivory p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-terracotta">
                  <Flag className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-serif text-xl font-bold text-charcoal-900">Report Scam</h3>
              </div>
              <button onClick={() => setShowReportModal(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-charcoal-400 hover:bg-cream-200">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 space-y-3 rounded-2xl bg-cream-100 p-4">
              <div className="flex justify-between text-sm">
                <span className="text-charcoal-400">Service</span>
                <span className="font-semibold capitalize text-charcoal-900">{analysis.service?.replace('-', ' ') ?? 'Unknown'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-charcoal-400">Location</span>
                <span className="font-semibold text-charcoal-900">{selectedCity}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-charcoal-400">Standard fare</span>
                <span className="font-semibold text-green-600">₹{analysis.standardPrice ?? '—'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-charcoal-400">Asked fare</span>
                <span className="font-semibold text-red-500">₹{analysis.askedPrice ?? '—'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-charcoal-400">Overcharge</span>
                <span className="font-semibold text-red-500">{analysis.differencePercent}%</span>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-xs font-bold uppercase tracking-wider text-charcoal-400">Additional note (optional)</label>
              <textarea
                value={reportNote}
                onChange={(e) => setReportNote(e.target.value)}
                rows={3}
                placeholder="Describe the driver/guide/shop, vehicle number, or any other details…"
                className="mt-2 w-full rounded-xl border border-charcoal-200 bg-white px-4 py-3 text-sm text-charcoal-900 placeholder:text-charcoal-300 focus:outline-none focus:ring-2 focus:ring-terracotta/30"
              />
            </div>

            <p className="mt-3 text-xs text-charcoal-400">
              The conversation transcript and price details will be attached as evidence.
            </p>

            {reportStatus === 'error' && (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">Failed to submit. Please check your connection and try again.</p>
            )}

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 rounded-xl border border-charcoal-200 px-4 py-3 text-sm font-semibold text-charcoal-600 transition-all hover:bg-cream-100"
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                disabled={reportStatus === 'submitting'}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-terracotta px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-terracotta-600 disabled:opacity-60"
              >
                {reportStatus === 'submitting' ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</>
                ) : (
                  <><Flag className="h-4 w-4" /> Submit Report</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
