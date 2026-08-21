import { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { SectionHeading } from '@/components/ui';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import {
  Sparkles,
  Send,
  Wallet,
  Hotel,
  CloudRain,
  Users,
  Calendar,
  MapPin,
  TrendingDown,
} from 'lucide-react';

interface Message {
  role: 'user' | 'ai';
  content: string;
  cards?: AIResponseCard[];
}

interface AIResponseCard {
  type: 'budget' | 'hotel' | 'weather' | 'crowd' | 'itinerary';
  data: Record<string, string | number>;
}

const suggestedPrompts = [
  'Plan a ₹5,000 cultural trip to Agra',
  'Hidden heritage near Varanasi',
  '3-day food trail in Rajasthan',
  'Low-crowd forts in Karnataka',
];

const aiResponses: Record<string, Message> = {
  default: {
    role: 'ai',
    content: "I'd love to help you discover India beyond the usual tourist trail. Try one of the suggested prompts above, or ask me about any destination, budget, or cultural experience.",
  },
  agra: {
    role: 'ai',
    content: "Here's a smart 2-day cultural itinerary for Agra that stays within your ₹5,000 budget. I've prioritized sunrise visits to avoid crowds and included a hidden gem most travelers miss.",
    cards: [
      { type: 'budget', data: { total: '5000', estimated: '3950', remaining: '1050' } },
      { type: 'weather', data: { temp: '28°C', rain: '15%', wind: '8 km/h', condition: 'Sunny' } },
      { type: 'crowd', data: { level: 'Low–Moderate', best: 'Sunrise & weekdays' } },
      { type: 'hotel', data: { name: 'Heritage Homestay', price: '800', rating: '4.6', note: 'Walking distance to Taj' } },
    ],
  },
  varanasi: {
    role: 'ai',
    content: "Varanasi is extraordinary, and the area around it holds incredible hidden heritage. Here are three off-the-radar gems within 80 km, plus what to expect.",
    cards: [
      { type: 'crowd', data: { level: 'Low at hidden sites', best: 'Oct–Mar, early morning' } },
      { type: 'budget', data: { total: '3000', estimated: '2200', remaining: '800' } },
      { type: 'weather', data: { temp: '25°C', rain: '5%', wind: '6 km/h', condition: 'Clear' } },
    ],
  },
  rajasthan: {
    role: 'ai',
    content: "A 3-day food trail through Rajasthan is a sensory journey — from royal kitchens in Jaipur to street food in Jodhpur. Here's your optimized route with budget and crowd intelligence.",
    cards: [
      { type: 'budget', data: { total: '8000', estimated: '6200', remaining: '1800' } },
      { type: 'hotel', data: { name: 'Fort View Hotel', price: '1200', rating: '4.5', note: 'Closest to food markets' } },
      { type: 'weather', data: { temp: '32°C', rain: '2%', wind: '10 km/h', condition: 'Dry' } },
    ],
  },
  karnataka: {
    role: 'ai',
    content: "Karnataka has some of India's most spectacular yet least-visited forts and temples. Hampi is popular, but Belavadi, Chitradurga, and Bidar are practically empty. Here's the intel.",
    cards: [
      { type: 'crowd', data: { level: 'Very Low', best: 'Weekdays, year-round' } },
      { type: 'budget', data: { total: '6000', estimated: '3500', remaining: '2500' } },
      { type: 'hotel', data: { name: 'Hampi Boulders Resort', price: '1500', rating: '4.7', note: 'Riverside, 2 km from ruins' } },
    ],
  },
};

function matchResponse(prompt: string): Message {
  const p = prompt.toLowerCase();
  if (p.includes('agra') || p.includes('5000') || p.includes('5,000')) return aiResponses.agra;
  if (p.includes('varanasi')) return aiResponses.varanasi;
  if (p.includes('rajasthan') || p.includes('food')) return aiResponses.rajasthan;
  if (p.includes('karnataka') || p.includes('fort')) return aiResponses.karnataka;
  return aiResponses.default;
}

function ResponseCard({ card }: { card: AIResponseCard }) {
  if (card.type === 'budget') {
    return (
      <div className="rounded-2xl border border-charcoal-200 bg-cream-50 p-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-terracotta">
          <Wallet className="h-4 w-4" /> Budget Intelligence
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3">
          <div>
            <p className="text-xs text-charcoal-400">Estimated</p>
            <p className="text-lg font-bold text-charcoal-900">₹{card.data.estimated}</p>
          </div>
          <div>
            <p className="text-xs text-charcoal-400">Remaining</p>
            <p className="text-lg font-bold text-green-600">₹{card.data.remaining}</p>
          </div>
          <div>
            <p className="text-xs text-charcoal-400">Total</p>
            <p className="text-lg font-bold text-charcoal-500">₹{card.data.total}</p>
          </div>
        </div>
      </div>
    );
  }
  if (card.type === 'weather') {
    return (
      <div className="rounded-2xl border border-charcoal-200 bg-cream-50 p-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold-600">
          <CloudRain className="h-4 w-4" /> Weather Forecast
        </div>
        <div className="mt-3 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-charcoal-900">{card.data.temp}</span>
          </div>
          <div className="space-y-1 text-sm text-charcoal-500">
            <p>Rain: {card.data.rain}</p>
            <p>Wind: {card.data.wind}</p>
            <p className="font-medium text-charcoal-700">{card.data.condition}</p>
          </div>
        </div>
      </div>
    );
  }
  if (card.type === 'crowd') {
    return (
      <div className="rounded-2xl border border-charcoal-200 bg-cream-50 p-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-green-600">
          <Users className="h-4 w-4" /> Crowd Intelligence
        </div>
        <div className="mt-3 space-y-2">
          <p className="text-sm font-semibold text-charcoal-900">{card.data.level}</p>
          <p className="flex items-center gap-1.5 text-xs text-charcoal-500">
            <Calendar className="h-3.5 w-3.5" /> Best time: {card.data.best}
          </p>
        </div>
      </div>
    );
  }
  if (card.type === 'hotel') {
    return (
      <div className="rounded-2xl border border-charcoal-200 bg-cream-50 p-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-terracotta">
          <Hotel className="h-4 w-4" /> Recommended Stay
        </div>
        <div className="mt-3 flex items-start justify-between">
          <div>
            <p className="font-semibold text-charcoal-900">{card.data.name}</p>
            <p className="text-xs text-charcoal-500">{card.data.note}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-charcoal-900">₹{card.data.price}</p>
            <p className="text-xs text-gold-600">★ {card.data.rating}</p>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export function AIGuide() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: "I'm HeritageLens AI — your intelligent travel companion for discovering India beyond the famous. Ask me to plan a trip, find hidden gems, or get crowd and budget intelligence." },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { ref, visible } = useScrollReveal();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const response = matchResponse(text);
      setMessages((prev) => [...prev, response]);
      setTyping(false);
    }, 1400);
  };

  return (
    <section id="ai-guide" className="bg-ivory py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="HeritageLens AI"
          title={<>Your intelligent <span className="gradient-text">travel companion</span></>}
          subtitle="Ask in plain language. Get back itineraries with real budget estimates, crowd forecasts, weather, and hotel recommendations — all in one response."
          center
        />

        <div
          ref={ref}
          className={cn(
            'mt-10 overflow-hidden rounded-3xl border border-charcoal-200/60 bg-white shadow-2xl transition-all duration-700',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-charcoal-100 bg-gradient-to-r from-charcoal-900 to-charcoal-800 p-4">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-terracotta to-gold-500">
              <Sparkles className="h-6 w-6 text-white" />
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-charcoal-800 bg-green-400" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">HeritageLens AI</h3>
              <p className="text-xs text-ivory/50">Your intelligent travel companion · Online</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="h-[400px] space-y-4 overflow-y-auto bg-cream-50 p-5">
            {messages.map((msg, i) => (
              <div key={i} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div className={cn(
                  'max-w-[85%] animate-fade-in-up',
                  msg.role === 'user'
                    ? 'rounded-2xl rounded-br-md bg-charcoal-900 px-4 py-3 text-sm text-ivory'
                    : 'rounded-2xl rounded-bl-md bg-white px-4 py-3 text-sm text-charcoal-800 shadow-sm border border-charcoal-100'
                )}>
                  <p className="leading-relaxed">{msg.content}</p>
                  {msg.cards && (
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {msg.cards.map((card, ci) => (
                        <ResponseCard key={ci} card={card} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm border border-charcoal-100">
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-terracotta animate-typing" style={{ animationDelay: '0s' }} />
                    <span className="h-2 w-2 rounded-full bg-terracotta animate-typing" style={{ animationDelay: '0.2s' }} />
                    <span className="h-2 w-2 rounded-full bg-terracotta animate-typing" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Suggested prompts */}
          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-2 border-t border-charcoal-100 bg-cream-50 p-4">
              {suggestedPrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="rounded-full border border-charcoal-200 bg-white px-3.5 py-2 text-xs font-medium text-charcoal-600 transition-all duration-300 hover:border-terracotta hover:bg-terracotta/5 hover:text-terracotta"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-charcoal-100 bg-white p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send(input)}
              placeholder="Ask about destinations, budgets, hidden gems…"
              className="flex-1 rounded-xl bg-cream-100 px-4 py-3 text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-terracotta/30"
            />
            <button
              onClick={() => send(input)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-terracotta text-white transition-all duration-300 hover:bg-terracotta-600 hover:scale-105"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
