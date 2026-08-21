import { useState } from 'react';
import { cn } from '@/utils/cn';
import { SectionHeading } from '@/components/ui';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import {
  MapPin,
  Users,
  Wallet,
  Hotel,
  Heart,
  Sparkles,
  Check,
  ChevronRight,
} from 'lucide-react';

const steps = [
  { id: 0, label: 'Destination', icon: MapPin, desc: 'Where do you want to go?' },
  { id: 1, label: 'Travelers', icon: Users, desc: 'How many people?' },
  { id: 2, label: 'Budget', icon: Wallet, desc: 'What\'s your budget?' },
  { id: 3, label: 'Stay', icon: Hotel, desc: 'Preferred accommodation?' },
  { id: 4, label: 'Interests', icon: Heart, desc: 'What excites you?' },
  { id: 5, label: 'Generate', icon: Sparkles, desc: 'Get your smart itinerary' },
];

const destinations = ['Agra', 'Varanasi', 'Jaipur', 'Hampi', 'Kerala', 'Rajasthan', 'Custom'];
const stayOptions = ['Budget Homestay', 'Heritage Hotel', 'Boutique Stay', 'Luxury Palace'];
const interests = ['Heritage & Forts', 'Food Trails', 'Classical Arts', 'Nature & Wildlife', 'Spiritual Sites', 'Local Crafts'];

export function TripPlanner({ onComplete }: { onComplete?: () => void }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    destination: '',
    travelers: 2,
    budget: 10000,
    stay: '',
    interests: [] as string[],
  });
  const { ref, visible } = useScrollReveal();

  const toggleInterest = (i: string) => {
    setData((d) => ({
      ...d,
      interests: d.interests.includes(i)
        ? d.interests.filter((x) => x !== i)
        : [...d.interests, i],
    }));
  };

  const canProceed = () => {
    if (step === 0) return !!data.destination;
    if (step === 3) return !!data.stay;
    return true;
  };

  const next = () => {
    if (step < 5) setStep(step + 1);
    else onComplete?.();
  };

  const progress = ((step + 1) / steps.length) * 100;

  return (
    <section id="planner" className="bg-cream-100 py-24 lg:py-32">
      <div className="mx-auto max-w-4xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Smart Trip Planner"
          title={<>Plan your journey <span className="italic text-terracotta">step by step</span></>}
          subtitle="Tell us what you want. We'll build an intelligent itinerary with budget breakdown, stay recommendations, and crowd-optimized timing."
          center
        />

        <div
          ref={ref}
          className={cn(
            'mt-10 overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-700',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          {/* Stepper */}
          <div className="border-b border-charcoal-100 p-5 lg:p-6">
            <div className="flex items-center justify-between gap-1">
              {steps.map((s, i) => {
                const Icon = s.icon;
                const done = i < step;
                const active = i === step;
                return (
                  <div key={s.id} className="flex flex-1 items-center">
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300',
                          done ? 'bg-terracotta text-white' : '',
                          active ? 'bg-charcoal-900 text-white ring-4 ring-charcoal-900/10' : '',
                          !done && !active ? 'bg-cream-200 text-charcoal-400' : ''
                        )}
                      >
                        {done ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                      </div>
                      <span className={cn(
                        'hidden text-xs font-medium sm:block',
                        active ? 'text-charcoal-900' : done ? 'text-terracotta' : 'text-charcoal-400'
                      )}>
                        {s.label}
                      </span>
                    </div>
                    {i < steps.length - 1 && (
                      <div className="mx-2 h-0.5 flex-1 rounded-full bg-cream-200">
                        <div
                          className={cn('h-full rounded-full bg-terracotta transition-all duration-500', i < step ? 'w-full' : 'w-0')}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-cream-200">
            <div className="h-full bg-gradient-to-r from-terracotta to-gold-400 transition-all duration-700" style={{ width: `${progress}%` }} />
          </div>

          {/* Content */}
          <div className="p-6 lg:p-10 min-h-[320px] flex flex-col justify-center">
            {step === 0 && (
              <div className="animate-fade-in">
                <h3 className="font-serif text-2xl font-bold text-charcoal-900">Where do you want to go?</h3>
                <p className="mt-1 text-sm text-charcoal-500">Pick a region or let us surprise you.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {destinations.map((d) => (
                    <button
                      key={d}
                      onClick={() => setData((prev) => ({ ...prev, destination: d }))}
                      className={cn(
                        'rounded-2xl border-2 px-5 py-3 text-sm font-semibold transition-all duration-300',
                        data.destination === d
                          ? 'border-terracotta bg-terracotta/5 text-terracotta'
                          : 'border-cream-200 text-charcoal-600 hover:border-charcoal-300'
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="animate-fade-in">
                <h3 className="font-serif text-2xl font-bold text-charcoal-900">How many travelers?</h3>
                <p className="mt-1 text-sm text-charcoal-500">We'll optimize the budget accordingly.</p>
                <div className="mt-8 flex items-center justify-center gap-6">
                  <button
                    onClick={() => setData((p) => ({ ...p, travelers: Math.max(1, p.travelers - 1) }))}
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-cream-200 text-xl font-bold text-charcoal-700 hover:bg-cream-100"
                  >
                    −
                  </button>
                  <div className="text-center">
                    <span className="font-serif text-5xl font-bold text-charcoal-900">{data.travelers}</span>
                    <p className="mt-1 text-sm text-charcoal-500">{data.travelers === 1 ? 'Traveler' : 'Travelers'}</p>
                  </div>
                  <button
                    onClick={() => setData((p) => ({ ...p, travelers: Math.min(10, p.travelers + 1) }))}
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-cream-200 text-xl font-bold text-charcoal-700 hover:bg-cream-100"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-fade-in">
                <h3 className="font-serif text-2xl font-bold text-charcoal-900">What's your total budget?</h3>
                <p className="mt-1 text-sm text-charcoal-500">All-inclusive for {data.travelers} {data.travelers === 1 ? 'traveler' : 'travelers'}.</p>
                <div className="mt-8 text-center">
                  <span className="font-serif text-6xl font-bold gradient-text">
                    ₹{data.budget.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="50000"
                  step="500"
                  value={data.budget}
                  onChange={(e) => setData((p) => ({ ...p, budget: Number(e.target.value) }))}
                  className="mt-8 w-full accent-terracotta"
                />
                <div className="mt-2 flex justify-between text-xs text-charcoal-400">
                  <span>₹2,000</span>
                  <span>₹50,000</span>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-fade-in">
                <h3 className="font-serif text-2xl font-bold text-charcoal-900">Where would you like to stay?</h3>
                <p className="mt-1 text-sm text-charcoal-500">We'll find the best options within your budget.</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {stayOptions.map((s) => (
                    <button
                      key={s}
                      onClick={() => setData((p) => ({ ...p, stay: s }))}
                      className={cn(
                        'flex items-center justify-between rounded-2xl border-2 p-4 text-sm font-semibold transition-all duration-300',
                        data.stay === s
                          ? 'border-terracotta bg-terracotta/5 text-terracotta'
                          : 'border-cream-200 text-charcoal-600 hover:border-charcoal-300'
                      )}
                    >
                      {s}
                      {data.stay === s && <Check className="h-4 w-4" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="animate-fade-in">
                <h3 className="font-serif text-2xl font-bold text-charcoal-900">What excites you?</h3>
                <p className="mt-1 text-sm text-charcoal-500">Select all that apply — we'll tailor your itinerary.</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {interests.map((i) => (
                    <button
                      key={i}
                      onClick={() => toggleInterest(i)}
                      className={cn(
                        'flex items-center justify-between rounded-2xl border-2 p-4 text-sm font-semibold transition-all duration-300',
                        data.interests.includes(i)
                          ? 'border-terracotta bg-terracotta/5 text-terracotta'
                          : 'border-cream-200 text-charcoal-600 hover:border-charcoal-300'
                      )}
                    >
                      {i}
                      {data.interests.includes(i) && <Check className="h-4 w-4" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="animate-fade-in text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-terracotta to-gold-500">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="mt-4 font-serif text-2xl font-bold text-charcoal-900">Ready to generate!</h3>
                <p className="mt-2 text-sm text-charcoal-500">Here's your trip summary:</p>
                <div className="mx-auto mt-6 max-w-md rounded-2xl bg-cream-50 p-5 text-left">
                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between"><span className="text-charcoal-400">Destination</span><span className="font-semibold text-charcoal-900">{data.destination}</span></p>
                    <p className="flex justify-between"><span className="text-charcoal-400">Travelers</span><span className="font-semibold text-charcoal-900">{data.travelers}</span></p>
                    <p className="flex justify-between"><span className="text-charcoal-400">Budget</span><span className="font-semibold text-charcoal-900">₹{data.budget.toLocaleString('en-IN')}</span></p>
                    <p className="flex justify-between"><span className="text-charcoal-400">Stay</span><span className="font-semibold text-charcoal-900">{data.stay}</span></p>
                    <p className="flex justify-between"><span className="text-charcoal-400">Interests</span><span className="font-semibold text-charcoal-900 text-right">{data.interests.join(', ') || '—'}</span></p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between border-t border-charcoal-100 p-5">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className={cn(
                'rounded-xl px-4 py-2.5 text-sm font-semibold transition-all',
                step === 0 ? 'text-charcoal-300' : 'text-charcoal-600 hover:bg-cream-100'
              )}
            >
              Back
            </button>
            <button
              onClick={next}
              disabled={!canProceed()}
              className={cn(
                'group flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all duration-300',
                canProceed()
                  ? 'bg-terracotta text-white hover:bg-terracotta-600'
                  : 'bg-cream-200 text-charcoal-300'
              )}
            >
              {step === 5 ? 'Generate Itinerary' : 'Continue'}
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
