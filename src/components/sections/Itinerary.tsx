import { cn } from '@/utils/cn';
import { SectionHeading } from '@/components/ui';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { MapPin, Clock } from 'lucide-react';

const itinerary = [
  {
    time: '06:00',
    title: 'Taj Mahal at Sunrise',
    location: 'Taj Mahal, Agra',
    crowd: 'low' as const,
    cost: '₹1,300',
    duration: '2 hrs',
    note: 'Arrive before 6 AM. The marble glows pink, and crowds are at their thinnest. East gate entrance.',
    tags: ['UNESCO', 'Sunrise', 'Must-see'],
  },
  {
    time: '09:00',
    title: 'Breakfast at Local Dhaba',
    location: 'Fatehabad Road',
    crowd: 'low' as const,
    cost: '₹150',
    duration: '45 min',
    note: 'Try bedai with aloo sabzi and jalebi — a classic Agra breakfast. Ask for the extra crispy jalebi.',
    tags: ['Food', 'Local'],
  },
  {
    time: '10:30',
    title: 'Agra Fort Exploration',
    location: 'Agra Fort, Agra',
    crowd: 'moderate' as const,
    cost: '₹650',
    duration: '2 hrs',
    note: 'The fort where Shah Jahan was imprisoned by his son — with a view of the Taj from the Musamman Burj.',
    tags: ['Mughal', 'Heritage'],
  },
  {
    time: '13:00',
    title: 'Mughlai Lunch',
    location: 'Sad Market',
    crowd: 'moderate' as const,
    cost: '₹350',
    duration: '1 hr',
    note: 'Authentic Mughlai thali at a local institution. Try the mutton biryani and paneer tikka.',
    tags: ['Food', 'Mughlai'],
  },
  {
    time: '15:00',
    title: 'Itmad-ud-Daulah (Baby Taj)',
    location: 'Bank of Yamuna',
    crowd: 'low' as const,
    cost: '₹310',
    duration: '1 hr',
    note: 'The "Baby Taj" — a jewel-box mausoleum that inspired the Taj Mahal. Often nearly empty in the afternoon.',
    tags: ['Hidden Gem', 'Heritage'],
  },
  {
    time: '16:30',
    title: 'Marble Inlay Workshop',
    location: 'Gokulpura',
    crowd: 'low' as const,
    cost: 'Free',
    duration: '45 min',
    note: 'Watch artisans practice the same pietra dura inlay technique used on the Taj — a 400-year-old living craft.',
    tags: ['Craft', 'Free', 'Artisan'],
  },
  {
    time: '18:00',
    title: 'Sunset at Mehtab Bagh',
    location: 'Across Yamuna River',
    crowd: 'low' as const,
    cost: '₹250',
    duration: '1 hr',
    note: 'The perfect sunset view of the Taj from across the river — without the crowds. Bring a camera.',
    tags: ['Sunset', 'Garden', 'Photo Spot'],
  },
];

const crowdStyles = {
  low: { dot: 'bg-green-500', text: 'text-green-600', label: 'Low Crowd' },
  moderate: { dot: 'bg-yellow-500', text: 'text-yellow-600', label: 'Moderate' },
  high: { dot: 'bg-red-500', text: 'text-red-500', label: 'High Crowd' },
};

export function Itinerary() {
  const { ref, visible } = useScrollReveal();

  return (
    <section id="itinerary" className="relative overflow-hidden bg-cream-100 py-24 lg:py-32">
      <div className="mx-auto max-w-4xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Smart Itinerary"
          title={<>Your day, <span className="italic text-terracotta">perfectly timed</span></>}
          subtitle="A crowd-optimized timeline that takes you from sunrise at the Taj to a hidden craft workshop — every hour thoughtfully planned."
          center
        />

        <div ref={ref} className="mt-14">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-terracotta via-gold-300 to-charcoal-200 md:left-1/2 md:-translate-x-1/2" />

            {itinerary.map((item, i) => {
              const cs = crowdStyles[item.crowd];
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={i}
                  className={cn(
                    'relative flex items-start gap-6 pb-10 transition-all duration-700',
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse',
                    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  )}
                  style={{ transitionDelay: `${i * 0.12}s` }}
                >
                  {/* Time + dot */}
                  <div className="relative z-10 flex shrink-0 flex-col items-center md:w-1/2 md:flex-row md:items-start">
                    <div className="flex flex-col items-center md:hidden">
                      <div className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full border-4 border-cream-100 text-xs font-bold text-white',
                        cs.dot
                      )}>
                        {item.time.split(':')[0]}
                      </div>
                    </div>
                    <div className={cn('hidden md:block md:flex-1', isLeft ? 'text-right pr-12' : 'text-left pl-12')}>
                      <span className="font-serif text-3xl font-bold text-charcoal-900">{item.time}</span>
                    </div>
                  </div>

                  {/* Center dot (desktop) */}
                  <div className={cn(
                    'absolute left-[15px] top-1.5 z-20 hidden md:block',
                    'md:left-1/2 md:-translate-x-1/2'
                  )}>
                    <div className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full border-4 border-cream-100',
                      cs.dot
                    )}>
                      <span className="h-2 w-2 rounded-full bg-white" />
                    </div>
                  </div>

                  {/* Card */}
                  <div className="flex-1 md:w-1/2 md:px-12">
                    <div className="group rounded-2xl border border-charcoal-100 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg card-hover">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-serif text-lg font-bold text-charcoal-900">{item.title}</h3>
                        <span className="shrink-0 rounded-full bg-charcoal-900 px-2.5 py-1 text-xs font-bold text-ivory">
                          {item.cost}
                        </span>
                      </div>
                      <p className="mt-1 flex items-center gap-1 text-xs text-charcoal-500">
                        <MapPin className="h-3.5 w-3.5" /> {item.location}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-charcoal-600">{item.note}</p>
                      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-charcoal-50 pt-3">
                        <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium', cs.text)}>
                          <span className={cn('h-2 w-2 rounded-full', cs.dot, item.crowd === 'low' && 'animate-pulse-soft')} />
                          {cs.label}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-charcoal-400">
                          <Clock className="h-3.5 w-3.5" /> {item.duration}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {item.tags.map((t) => (
                            <span key={t} className="rounded-full bg-cream-100 px-2 py-0.5 text-xs text-charcoal-500">{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="mt-4 flex items-center justify-center gap-6 rounded-2xl bg-charcoal-900 p-5 text-center text-ivory">
            <div>
              <p className="text-xs text-ivory/50">Total Duration</p>
              <p className="font-serif text-xl font-bold">12 Hours</p>
            </div>
            <div className="h-8 w-px bg-ivory/10" />
            <div>
              <p className="text-xs text-ivory/50">Total Cost</p>
              <p className="font-serif text-xl font-bold">₹3,010</p>
            </div>
            <div className="h-8 w-px bg-ivory/10" />
            <div>
              <p className="text-xs text-ivory/50">Stops</p>
              <p className="font-serif text-xl font-bold">7</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
