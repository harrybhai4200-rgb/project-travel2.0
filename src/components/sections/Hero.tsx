import { useState } from 'react';
import { destinations } from '@/data/destinations';
import { ArrowRight, MapPin, Search, Star } from 'lucide-react';
import { CrowdIndicator } from '@/components/ui';

export function Hero({ onNavigate }: { onNavigate: (id: string) => void }) {
  const featured = destinations[0]; // Chunar Fort
  const [query, setQuery] = useState('');

  return (
    <section id="hero" className="relative min-h-screen w-full overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={featured.image}
          alt="Indian heritage fort at golden hour"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950/50 via-charcoal-950/30 to-charcoal-950/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-5 pt-24 pb-16 lg:px-8">
        <div className="max-w-2xl">
          <div className="mb-5 flex items-center gap-2 animate-fade-in-down">
            <span className="flex h-2 w-2 animate-pulse-soft rounded-full bg-terracotta" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-ivory/70">
              Discover the Unseen
            </span>
          </div>

          <h1 className="font-serif text-5xl font-bold leading-[1.05] text-white sm:text-6xl lg:text-7xl animate-fade-in-up">
            Discover India
            <br />
            <span className="italic text-gold-300">Beyond the Famous</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ivory/80 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            Explore hidden heritage, living culture, and authentic experiences — guided by AI intelligence that knows the roads less traveled.
          </p>

          {/* Floating glass search bar */}
          <div className="mt-8 max-w-xl animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="glass-dark flex items-center gap-2 rounded-2xl p-2">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <Search className="h-5 w-5 text-white" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search destinations, culture, food trails…"
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/50 focus:outline-none"
              />
              <button
                onClick={() => onNavigate('destinations')}
                className="group flex items-center gap-2 rounded-xl bg-terracotta px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-terracotta-600"
              >
                Explore
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 animate-fade-in-up" style={{ animationDelay: '0.45s' }}>
            <span className="text-xs font-medium text-ivory/50">Trending:</span>
            {['Hidden Forts', 'Living Crafts', 'Food Trails', 'Low-Crowd Gems'].map((tag) => (
              <button
                key={tag}
                onClick={() => onNavigate('destinations')}
                className="rounded-full border border-white/20 px-3 py-1 text-xs font-medium text-ivory/80 transition-all duration-300 hover:border-white/40 hover:bg-white/10"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Floating destination info card */}
        <div className="mt-12 max-w-sm animate-fade-in-up lg:absolute lg:bottom-16 lg:right-8 lg:mt-0" style={{ animationDelay: '0.6s' }}>
          <div className="glass-dark rounded-2xl p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <MapPin className="h-5 w-5 text-terracotta" />
                  <span className="absolute -top-0.5 -right-0.5 h-2 w-2 animate-ping rounded-full bg-terracotta" />
                  <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-terracotta" />
                </div>
                <span className="text-xs font-medium uppercase tracking-wider text-ivory/60">Featured Gem</span>
              </div>
              <span className="rounded-full bg-terracotta/20 px-2.5 py-0.5 text-xs font-semibold text-gold-300">
                Hidden
              </span>
            </div>
            <h3 className="mt-3 font-serif text-2xl font-bold text-white">{featured.name}</h3>
            <p className="text-sm text-ivory/60">{featured.state}</p>
            <div className="mt-4 flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-300">
                <Star className="h-4 w-4 fill-gold-300 text-gold-300" />
                {featured.rating}
              </span>
              <CrowdIndicator level={featured.crowd} className="text-ivory/90" />
            </div>
            <div className="mt-4 border-t border-white/10 pt-3">
              <p className="text-xs leading-relaxed text-ivory/70">{featured.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 animate-bounce-soft">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-ivory/40">Scroll</span>
          <div className="h-12 w-6 rounded-full border-2 border-ivory/20 p-1">
            <div className="h-2 w-1.5 mx-auto rounded-full bg-ivory/40 animate-bounce-soft" />
          </div>
        </div>
      </div>
    </section>
  );
}
