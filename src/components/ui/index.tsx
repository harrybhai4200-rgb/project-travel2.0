import { type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import type { CrowdLevel } from '@/data/destinations';
import { crowdConfig } from '@/data/destinations';
import {
  Star,
  MapPin,
  ArrowUpRight,
  Clock,
  Sparkles,
} from 'lucide-react';

export function GlassCard({
  children,
  className,
  dark = false,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl shadow-xl',
        dark ? 'glass-dark text-white' : 'glass text-charcoal-900',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CrowdIndicator({ level, className }: { level: CrowdLevel; className?: string }) {
  const cfg = crowdConfig[level];
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium', cfg.color, className)}>
      <span className={cn('h-2 w-2 rounded-full', cfg.dot, level === 'low' && 'animate-pulse-soft')} />
      {cfg.label}
    </span>
  );
}

export function RatingStars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 text-sm font-semibold text-gold-700', className)}>
      <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />
      {rating.toFixed(1)}
    </span>
  );
}

export function CostBadge({ cost, className }: { cost: number; className?: string }) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full bg-charcoal-900/90 px-3 py-1.5 text-sm font-bold text-ivory',
        className
      )}
    >
      {cost === 0 ? 'Free' : `\u20B9${cost.toLocaleString('en-IN')}`}
    </div>
  );
}

export function CategoryBadge({ label, icon: Icon }: { label: string; icon: typeof MapPin }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-charcoal-800 backdrop-blur-sm">
      <Icon className="h-3.5 w-3.5 text-terracotta" />
      {label}
    </span>
  );
}

export function ArrowButton({
  children,
  onClick,
  variant = 'solid',
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'solid' | 'outline' | 'glass';
  className?: string;
}) {
  const variants = {
    solid: 'bg-charcoal-900 text-ivory hover:bg-charcoal-800',
    outline: 'border border-charcoal-300 text-charcoal-900 hover:border-charcoal-900 hover:bg-charcoal-900 hover:text-ivory',
    glass: 'glass text-charcoal-900 hover:bg-white',
  };
  return (
    <button
      onClick={onClick}
      className={cn(
        'group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300',
        variants[variant],
        className
      )}
    >
      {children}
      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </button>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = false,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  center?: boolean;
  className?: string;
}) {
  return (
    <div className={cn(center && 'mx-auto text-center', 'max-w-2xl', className)}>
      {eyebrow && (
        <div className={cn('mb-3 flex items-center gap-2', center && 'justify-center')}>
          <Sparkles className="h-4 w-4 text-terracotta" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-terracotta">{eyebrow}</span>
        </div>
      )}
      <h2 className="font-serif text-4xl font-bold leading-[1.1] text-charcoal-900 sm:text-5xl">{title}</h2>
      {subtitle && <p className="mt-4 text-base leading-relaxed text-charcoal-500">{subtitle}</p>}
    </div>
  );
}

export function LocationPin({ className }: { className?: string }) {
  return (
    <div className={cn('relative', className)}>
      <MapPin className="h-5 w-5 text-terracotta" />
      <span className="absolute -top-0.5 -right-0.5 h-2 w-2 animate-ping rounded-full bg-terracotta" />
      <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-terracotta" />
    </div>
  );
}

export function TimeTag({ time }: { time: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-charcoal-500">
      <Clock className="h-3.5 w-3.5" />
      {time}
    </span>
  );
}

export { MapPin, ArrowUpRight };
