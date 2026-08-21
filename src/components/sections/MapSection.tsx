import { useState } from 'react';
import { destinations, categoryConfig, type Destination } from '@/data/destinations';
import { SectionHeading, RatingStars, CrowdIndicator, CostBadge } from '@/components/ui';
import { cn } from '@/utils/cn';
import * as Icons from 'lucide-react';

// Normalized coordinates for India map (lat 8-37, lng 68-89)
function normalize(lat: number, lng: number) {
  const x = ((lng - 68) / (89 - 68)) * 100;
  const y = ((37 - lat) / (37 - 8)) * 100;
  return { x, y };
}

export function MapSection() {
  const [selected, setSelected] = useState<Destination | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const markers = destinations.filter((d) => !activeFilter || d.category === activeFilter);

  const filterTypes = [
    { cat: 'heritage', icon: 'Landmark', label: 'Heritage' },
    { cat: 'art', icon: 'Palette', label: 'Art' },
    { cat: 'food', icon: 'UtensilsCrossed', label: 'Food' },
    { cat: 'culture', icon: 'Drama', label: 'Culture' },
    { cat: 'nature', icon: 'Trees', label: 'Nature' },
    { cat: 'spiritual', icon: 'Sparkles', label: 'Spiritual' },
  ];

  return (
    <section id="map" className="relative overflow-hidden bg-charcoal-900 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Interactive Atlas"
          title={<>Where the <span className="text-gold-300">stories live</span></>}
          subtitle="Pan across India and discover heritage gems by type. Click any marker to reveal what's waiting there."
          className="text-white [&_h2]:text-white [&_p]:text-ivory/60"
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Map area */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 bg-charcoal-800 sm:aspect-[16/10]">
            {/* Stylized India silhouette */}
            <svg
              viewBox="0 0 100 120"
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
                  <path d="M 5 0 L 0 0 0 5" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" />
                </pattern>
                <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(184,92,56,0.15)" />
                  <stop offset="100%" stopColor="rgba(184,92,56,0)" />
                </radialGradient>
              </defs>
              <rect width="100" height="120" fill="url(#grid)" />
              <rect width="100" height="120" fill="url(#glow)" />
              {/* Simplified India outline */}
              <path
                d="M30 15 L38 12 L45 14 L52 10 L58 14 L62 18 L65 25 L68 30 L72 35 L75 40 L78 48 L80 55 L76 60 L72 65 L68 70 L65 78 L62 85 L60 92 L55 98 L50 100 L42 95 L38 88 L35 80 L32 72 L28 65 L25 58 L22 50 L20 42 L22 35 L26 25 L30 15 Z"
                fill="rgba(196,154,90,0.06)"
                stroke="rgba(196,154,90,0.25)"
                strokeWidth="0.4"
                strokeDasharray="0.5 0.5"
              />
            </svg>

            {/* Markers */}
            {markers.map((d) => {
              const pos = normalize(d.lat, d.lng);
              const catCfg = categoryConfig[d.category];
              const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[catCfg.icon] ?? Icons.Landmark;
              const isSelected = selected?.id === d.id;

              return (
                <button
                  key={d.id}
                  onClick={() => setSelected(d)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 hover:scale-125"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                >
                  <div className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300',
                    isSelected
                      ? 'border-gold-300 bg-terracotta scale-125 shadow-lg shadow-terracotta/50'
                      : 'border-white/30 bg-charcoal-900/80 backdrop-blur-sm hover:border-gold-300'
                  )}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  {isSelected && (
                    <span className="absolute inset-0 -z-10 animate-ping rounded-full border-2 border-terracotta" />
                  )}
                </button>
              );
            })}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 glass-dark rounded-xl p-3">
              <div className="flex flex-wrap gap-2">
                {filterTypes.map((f) => {
                  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[f.icon];
                  const active = activeFilter === f.cat;
                  return (
                    <button
                      key={f.cat}
                      onClick={() => setActiveFilter(active ? null : f.cat)}
                      className={cn(
                        'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all',
                        active ? 'bg-terracotta text-white' : 'text-ivory/70 hover:bg-white/10'
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Side panel — floating destination card */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            {selected ? (
              <div key={selected.id} className="animate-fade-in-up overflow-hidden rounded-3xl border border-white/10 bg-charcoal-800">
                <div className="relative h-48 overflow-hidden">
                  <img src={selected.image} alt={selected.name} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-800 to-transparent" />
                  <div className="absolute right-3 top-3">
                    <CostBadge cost={selected.cost} />
                  </div>
                </div>
                <div className="p-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-gold-300">
                    {categoryConfig[selected.category].label}
                  </span>
                  <h3 className="mt-1 font-serif text-2xl font-bold text-white">{selected.name}</h3>
                  <p className="mt-1 flex items-center gap-1 text-sm text-ivory/60">
                    <Icons.MapPin className="h-3.5 w-3.5" /> {selected.state}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-ivory/70">{selected.description}</p>
                  <div className="mt-4 flex items-center gap-4">
                    <RatingStars rating={selected.rating} className="text-gold-300" />
                    <CrowdIndicator level={selected.crowd} className="text-ivory/90" />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {selected.tags.map((t) => (
                      <span key={t} className="rounded-full border border-white/15 px-2.5 py-0.5 text-xs text-ivory/60">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                    <span className="text-xs text-ivory/50">Best time: {selected.bestTime}</span>
                    <button className="text-sm font-semibold text-terracotta hover:text-gold-300">
                      Add to trip →
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-white/10 bg-charcoal-800 p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
                  <Icons.MapPin className="h-8 w-8 text-gold-300" />
                </div>
                <h3 className="font-serif text-xl font-bold text-white">Pick a marker</h3>
                <p className="mt-2 text-sm text-ivory/50">
                  Click any marker on the map to see destination details, crowd levels, and travel intelligence.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
