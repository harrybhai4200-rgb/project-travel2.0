import { cn } from '@/utils/cn';
import { SectionHeading } from '@/components/ui';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Heart, HandPlatter, Leaf, BookOpen } from 'lucide-react';

const principles = [
  {
    icon: Heart,
    title: 'Respect',
    description: 'Ask before photographing people. Dress modestly at sacred sites. Learn three words in the local language — it opens doors no guidebook can.',
    color: 'bg-terracotta/10 text-terracotta',
  },
  {
    icon: Leaf,
    title: 'Preserve',
    description: 'Carry a reusable bottle. Don\'t touch ancient carvings. Leave heritage sites as you found them — they have stood for centuries, let them stand for more.',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: HandPlatter,
    title: 'Support',
    description: 'Buy directly from artisans, not mass-produced copies. Eat at family-run kitchens. Stay at homestays where your money reaches the family, not a chain.',
    color: 'bg-gold-500/10 text-gold-600',
  },
  {
    icon: BookOpen,
    title: 'Learn',
    description: 'Every region has its own history, food, and customs. Talk to locals, ask questions, and come back with more than photos — come back with understanding.',
    color: 'bg-charcoal-100 text-charcoal-700',
  },
];

export function ResponsibleTourism() {
  const { ref, visible } = useScrollReveal();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-charcoal-900 to-charcoal-950 py-24 lg:py-32">
      {/* Decorative gradient */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-terracotta blur-[100px]" />
        <div className="absolute -right-20 bottom-1/4 h-72 w-72 rounded-full bg-gold-500 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-5 lg:px-8">
        {/* Statement */}
        <div className="text-center">
          <h2 className="font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Travel with curiosity.
            <br />
            <span className="italic text-gold-300">Leave with respect.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ivory/60">
            India\'s heritage is not a museum — it's a living, breathing culture. These four principles help you experience it deeply while keeping it alive for the next traveler.
          </p>
        </div>

        {/* Principles */}
        <div
          ref={ref}
          className={cn(
            'mt-14 grid gap-5 transition-all duration-700 sm:grid-cols-2 lg:grid-cols-4',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          {principles.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className={cn(
                  'group rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-500 hover:bg-white/10 hover:-translate-y-1'
                )}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className={cn('flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110', p.color)}>
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-4 font-serif text-2xl font-bold text-white">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ivory/60">{p.description}</p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <button className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-charcoal-900 transition-all duration-300 hover:bg-gold-300">
            Join the Responsible Travel Movement
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
