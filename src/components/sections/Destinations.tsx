import { useState } from 'react';
import { destinations, categoryConfig, type Category, type Destination } from '@/data/destinations';
import { CrowdIndicator, RatingStars, CostBadge, SectionHeading } from '@/components/ui';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { cn } from '@/utils/cn';
import * as Icons from 'lucide-react';

const filters: { id: Category | 'all'; label: string }[] = [
  { id: 'all', label: 'All Destinations' },
  { id: 'heritage', label: 'Heritage' },
  { id: 'culture', label: 'Culture' },
  { id: 'nature', label: 'Nature' },
  { id: 'food', label: 'Food' },
  { id: 'art', label: 'Art & Crafts' },
  { id: 'spiritual', label: 'Spiritual' },
];

function DestinationCard({ d, large = false }: { d: Destination; large?: boolean }) {
  const catCfg = categoryConfig[d.category];
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[catCfg.icon] ?? Icons.Landmark;

  return (
    <article
      className={cn(
        'group relative overflow-hidden rounded-3xl bg-charcoal-900 card-hover cursor-pointer',
        large ? 'h-[480px] sm:h-[560px]' : 'h-[420px]'
      )}
    >
      <img
        src={d.image}
        alt={d.name}
        className="img-zoom absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-charcoal-950/20 to-transparent" />

      {/* Top badges */}
      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-charcoal-800 backdrop-blur-sm">
          <Icon className="h-3.5 w-3.5 text-terracotta" />
          {catCfg.label}
        </span>
        <CostBadge cost={d.cost} />
      </div>

      {d.hidden && (
        <div className="absolute left-5 top-20">
          <span className="inline-flex items-center gap-1 rounded-full bg-terracotta px-2.5 py-1 text-xs font-bold text-white shadow-lg">
            <Icons.Sparkles className="h-3 w-3" /> Hidden Gem
          </span>
        </div>
      )}

      {/* Bottom content */}
      <div className="absolute inset-x-0 bottom-0 p-5 lg:p-6">
        <h3 className={cn('font-serif font-bold text-white', large ? 'text-3xl' : 'text-2xl')}>
          {d.name}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-ivory/70">
          <Icons.MapPin className="h-3.5 w-3.5" />
          {d.state}
        </p>

        <div className="mt-3 flex items-center gap-4">
          <RatingStars rating={d.rating} className="text-gold-300" />
          <CrowdIndicator level={d.crowd} className="text-ivory/90" />
        </div>

        {large && (
          <p className="mt-3 max-w-md text-sm leading-relaxed text-ivory/70">{d.description}</p>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {d.tags.slice(0, large ? 3 : 2).map((tag) => (
              <span key={tag} className="rounded-full border border-white/20 px-2.5 py-0.5 text-xs text-ivory/70">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm transition-all duration-300 group-hover:bg-terracotta group-hover:scale-110">
            <Icons.ArrowUpRight className="h-4 w-4 text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </div>
    </article>
  );
}

export function Destinations() {
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const { ref, visible } = useScrollReveal();

  const filtered = filter === 'all' ? destinations : destinations.filter((d) => d.category === filter);
  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <section id="destinations" className="bg-ivory py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Curated Destinations"
          title={<>Places that <span className="gradient-text">tell stories</span></>}
          subtitle="From forgotten forts to living craft traditions — each destination is chosen for its depth, not its popularity."
          center
        />

        {/* Filters */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-all duration-300',
                filter === f.id
                  ? 'bg-charcoal-900 text-ivory shadow-md'
                  : 'bg-cream-200 text-charcoal-600 hover:bg-cream-100'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Bento-style grid */}
        <div
          ref={ref}
          className={cn(
            'mt-12 grid gap-5 transition-all duration-700',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
            'lg:grid-cols-3'
          )}
        >
          {featured && (
            <div className="lg:col-span-2 lg:row-span-2">
              <DestinationCard d={featured} large />
            </div>
          )}
          {rest.slice(0, 4).map((d) => (
            <DestinationCard key={d.id} d={d} />
          ))}
        </div>

        {/* Horizontal scroll row */}
        {rest.length > 4 && (
          <div className="mt-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal-400">More to explore</h3>
              <span className="text-xs text-charcoal-400">← Swipe →</span>
            </div>
            <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
              {rest.slice(4).map((d) => (
                <div key={d.id} className="w-72 shrink-0">
                  <DestinationCard d={d} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
