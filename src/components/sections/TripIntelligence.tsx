import { useEffect, useRef, useState } from 'react';
import { cn } from '@/utils/cn';
import { SectionHeading } from '@/components/ui';
import { useScrollReveal, useCountUp } from '@/hooks/useScrollReveal';
import {
  Wallet,
  Hotel,
  UtensilsCrossed,
  Car,
  Camera,
  TrendingUp,
  Star,
  MapPin,
  Award,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Sunrise,
  Sunset,
  CloudSun,
  Moon,
} from 'lucide-react';

// ── Budget Dashboard ─────────────────────────────────────────────────

const budgetCategories = [
  { label: 'Hotel', amount: 1600, color: 'bg-terracotta', icon: Hotel },
  { label: 'Food', amount: 800, color: 'bg-gold-500', icon: UtensilsCrossed },
  { label: 'Transport', amount: 950, color: 'bg-charcoal-700', icon: Car },
  { label: 'Activities', amount: 600, color: 'bg-green-600', icon: Camera },
];

const totalBudget = 5000;
const totalEstimated = budgetCategories.reduce((s, c) => s + c.amount, 0);

function BudgetDashboard() {
  const { ref, visible } = useScrollReveal();
  const remaining = totalBudget - totalEstimated;
  const animatedTotal = useCountUp(totalEstimated, 1500, visible);
  const animatedRemaining = useCountUp(remaining, 1500, visible);

  const circumference = 2 * Math.PI * 80;
  const dashOffset = circumference - (totalEstimated / totalBudget) * circumference;

  return (
    <div ref={ref} className={cn('rounded-3xl bg-white p-6 shadow-xl border border-charcoal-100 transition-all duration-700', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-terracotta/10">
          <Wallet className="h-5 w-5 text-terracotta" />
        </div>
        <div>
          <h3 className="font-serif text-xl font-bold text-charcoal-900">Budget Dashboard</h3>
          <p className="text-xs text-charcoal-400">2-day Agra cultural trip</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row">
        {/* Circular progress */}
        <div className="relative h-44 w-44 shrink-0">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 176 176">
            <circle cx="88" cy="88" r="80" fill="none" stroke="#F5EFE2" strokeWidth="12" />
            <circle
              cx="88" cy="88" r="80" fill="none" stroke="#B85C38" strokeWidth="12" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={visible ? dashOffset : circumference}
              style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.16,1,0.3,1)' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-charcoal-400">Spent</span>
            <span className="font-serif text-2xl font-bold text-charcoal-900">₹{animatedTotal}</span>
            <span className="text-xs text-charcoal-400">of ₹{totalBudget.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Category bars */}
        <div className="w-full space-y-4">
          {budgetCategories.map((cat, i) => {
            const pct = (cat.amount / totalBudget) * 100;
            const Icon = cat.icon;
            return (
              <div key={cat.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium text-charcoal-700">
                    <Icon className="h-4 w-4 text-charcoal-400" />
                    {cat.label}
                  </span>
                  <span className="font-semibold text-charcoal-900">₹{cat.amount}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-cream-200">
                  <div
                    className={cn('h-full rounded-full', cat.color)}
                    style={{
                      width: visible ? `${pct}%` : '0%',
                      transition: `width 1s cubic-bezier(0.16,1,0.3,1) ${i * 0.15}s`,
                    }}
                  />
                </div>
              </div>
            );
          })}

          <div className="flex items-center justify-between border-t border-charcoal-100 pt-3">
            <span className="flex items-center gap-2 text-sm font-semibold text-green-600">
              <TrendingUp className="h-4 w-4" /> Remaining
            </span>
            <span className="font-serif text-lg font-bold text-green-600">₹{animatedRemaining}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Hotel Cards ───────────────────────────────────────────────────────

const hotels = [
  {
    name: 'Heritage Homestay',
    image: 'https://images.pexels.com/photos/8134775/pexels-photo-8134775.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.6,
    price: 800,
    distance: '0.8 km to Taj',
    amenities: ['Free WiFi', 'Breakfast', 'Rooftop View'],
    badges: ['Best Value'],
    note: '₹200 less/night, walk to Taj at sunrise.',
  },
  {
    name: 'Fort View Boutique',
    image: 'https://images.pexels.com/photos/33803745/pexels-photo-33803745.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.8,
    price: 1000,
    distance: '2.1 km to Taj',
    amenities: ['Pool', 'Restaurant', 'Heritage Decor'],
    badges: ['Closest to Attractions'],
    note: '₹200 more/night but saves ~₹400 in local transport.',
  },
];

function HotelCards() {
  const { ref, visible } = useScrollReveal();

  return (
    <div ref={ref} className={cn('transition-all duration-700', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/10">
          <Hotel className="h-5 w-5 text-gold-600" />
        </div>
        <h3 className="font-serif text-xl font-bold text-charcoal-900">Smart Stay Comparison</h3>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {hotels.map((h) => (
          <div key={h.name} className="group overflow-hidden rounded-2xl border border-charcoal-100 bg-white card-hover">
            <div className="relative h-44 overflow-hidden">
              <img src={h.image} alt={h.name} className="img-zoom h-full w-full object-cover" />
              <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                {h.badges.map((b) => (
                  <span key={b} className="inline-flex items-center gap-1 rounded-full bg-terracotta px-2.5 py-1 text-xs font-bold text-white shadow-lg">
                    <Award className="h-3 w-3" /> {b}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-serif text-lg font-bold text-charcoal-900">{h.name}</h4>
                  <p className="flex items-center gap-1 text-xs text-charcoal-500">
                    <MapPin className="h-3 w-3" /> {h.distance}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-xl font-bold text-charcoal-900">₹{h.price}</p>
                  <p className="text-xs text-charcoal-400">/night</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1">
                <Star className="h-4 w-4 fill-gold-400 text-gold-400" />
                <span className="text-sm font-semibold text-charcoal-700">{h.rating}</span>
                <span className="ml-2 flex flex-wrap gap-1">
                  {h.amenities.map((a) => (
                    <span key={a} className="rounded-full bg-cream-100 px-2 py-0.5 text-xs text-charcoal-500">{a}</span>
                  ))}
                </span>
              </div>
              <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-xs text-green-700">
                {h.note}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Weather + Crowd ──────────────────────────────────────────────────

const hourlyWeather = [
  { time: '6 AM', temp: 22, icon: Sunrise },
  { time: '9 AM', temp: 26, icon: Sun },
  { time: '12 PM', temp: 31, icon: CloudSun },
  { time: '3 PM', temp: 33, icon: Sun },
  { time: '6 PM', temp: 28, icon: Sunset },
  { time: '9 PM', temp: 24, icon: Moon },
];

const weeklyCrowd = [
  { day: 'Mon', level: 25 },
  { day: 'Tue', level: 20 },
  { day: 'Wed', level: 30 },
  { day: 'Thu', level: 35 },
  { day: 'Fri', level: 55 },
  { day: 'Sat', level: 90 },
  { day: 'Sun', level: 80 },
];

function WeatherCrowd() {
  const { ref, visible } = useScrollReveal();

  return (
    <div ref={ref} className={cn('grid gap-5 transition-all duration-700 lg:grid-cols-2', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
      {/* Weather */}
      <div className="rounded-3xl bg-gradient-to-br from-charcoal-900 to-charcoal-800 p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <CloudSun className="h-5 w-5 text-gold-300" />
            </div>
            <h3 className="font-serif text-xl font-bold">Weather</h3>
          </div>
          <span className="text-xs text-ivory/50">Agra · Today</span>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <span className="font-serif text-5xl font-bold">28°C</span>
          <div className="space-y-1 text-sm text-ivory/70">
            <p className="flex items-center gap-1.5"><Sun className="h-4 w-4 text-gold-300" /> Sunny</p>
            <p className="flex items-center gap-1.5"><CloudRain className="h-4 w-4" /> 15% rain</p>
            <p className="flex items-center gap-1.5"><Wind className="h-4 w-4" /> 8 km/h wind</p>
            <p className="flex items-center gap-1.5"><Droplets className="h-4 w-4" /> 45% humidity</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-5 grid grid-cols-6 gap-1">
          {hourlyWeather.map((h, i) => {
            const Icon = h.icon;
            return (
              <div key={h.time} className="flex flex-col items-center gap-1.5 rounded-xl bg-white/5 py-3" style={{ animationDelay: `${i * 0.1}s` }}>
                <span className="text-xs text-ivory/50">{h.time}</span>
                <Icon className="h-5 w-5 text-gold-300" />
                <span className="text-xs font-semibold">{h.temp}°</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Crowd */}
      <div className="rounded-3xl bg-white p-6 shadow-xl border border-charcoal-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse-soft" />
            </div>
            <h3 className="font-serif text-xl font-bold text-charcoal-900">Crowd Forecast</h3>
          </div>
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600">Low–Moderate</span>
        </div>

        <div className="mt-5 space-y-2.5">
          {weeklyCrowd.map((d, i) => (
            <div key={d.day} className="flex items-center gap-3">
              <span className="w-8 text-xs font-medium text-charcoal-500">{d.day}</span>
              <div className="flex-1 h-6 overflow-hidden rounded-lg bg-cream-200">
                <div
                  className={cn(
                    'h-full rounded-lg transition-all duration-700',
                    d.level < 40 ? 'bg-green-500' : d.level < 70 ? 'bg-yellow-500' : 'bg-red-500'
                  )}
                  style={{ width: visible ? `${d.level}%` : '0%', transitionDelay: `${i * 0.08}s` }}
                />
              </div>
              <span className="w-8 text-right text-xs font-semibold text-charcoal-600">{d.level}%</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-4 border-t border-charcoal-100 pt-3 text-xs">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-green-500" /> Low</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-yellow-500" /> Moderate</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-500" /> High</span>
        </div>
      </div>
    </div>
  );
}

// ── Combined Section ──────────────────────────────────────────────────

export function TripIntelligence() {
  return (
    <section className="bg-ivory py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Trip Intelligence"
          title={<>Everything you need, <span className="italic text-terracotta">before you go</span></>}
          subtitle="Budget breakdowns, smart hotel comparisons, weather forecasts, and crowd intelligence — all in one place, updated in real time."
          center
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <BudgetDashboard />
          <div className="space-y-6">
            <WeatherCrowd />
          </div>
        </div>

        <div className="mt-6">
          <HotelCards />
        </div>
      </div>
    </section>
  );
}
