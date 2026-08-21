import { categoryConfig, type Category } from '@/data/destinations';
import { SectionHeading } from '@/components/ui';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { cn } from '@/utils/cn';
import * as Icons from 'lucide-react';

const categoryImages: Record<Category, string> = {
  heritage: 'https://images.pexels.com/photos/33361416/pexels-photo-33361416.jpeg?auto=compress&cs=tinysrgb&w=800',
  art: 'https://images.pexels.com/photos/30969805/pexels-photo-30969805.jpeg?auto=compress&cs=tinysrgb&w=800',
  food: 'https://images.pexels.com/photos/618491/pexels-photo-618491.jpeg?auto=compress&cs=tinysrgb&w=800',
  culture: 'https://images.pexels.com/photos/8566097/pexels-photo-8566097.jpeg?auto=compress&cs=tinysrgb&w=800',
  nature: 'https://images.pexels.com/photos/34588372/pexels-photo-34588372.jpeg?auto=compress&cs=tinysrgb&w=800',
  spiritual: 'https://images.pexels.com/photos/38857186/pexels-photo-38857186.jpeg?auto=compress&cs=tinysrgb&w=800',
};

const categories = Object.keys(categoryConfig) as Category[];

// Bento layout classes — each card gets a specific grid placement
const bentoLayout: Record<Category, string> = {
  heritage: 'lg:col-span-2 lg:row-span-2',
  art: 'lg:col-span-1 lg:row-span-1',
  food: 'lg:col-span-1 lg:row-span-1',
  culture: 'lg:col-span-2 lg:row-span-1',
  nature: 'lg:col-span-1 lg:row-span-2',
  spiritual: 'lg:col-span-1 lg:row-span-1',
};

export function Categories() {
  const { ref, visible } = useScrollReveal();

  return (
    <section id="categories" className="bg-cream-100 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Ways to Explore"
          title={<>Six lenses on <span className="italic text-terracotta">a vast land</span></>}
          subtitle="India isn't one story — it's thousands. Choose your lens and discover a side most travelers never see."
        />

        <div
          ref={ref}
          className={cn(
            'mt-12 grid auto-rows-[200px] gap-4 transition-all duration-700 lg:grid-cols-4',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          {categories.map((cat, i) => {
            const cfg = categoryConfig[cat];
            const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[cfg.icon] ?? Icons.Landmark;
            const isLarge = bentoLayout[cat].includes('row-span-2');

            return (
              <article
                key={cat}
                className={cn(
                  'group relative overflow-hidden rounded-3xl card-hover cursor-pointer',
                  bentoLayout[cat]
                )}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <img
                  src={categoryImages[cat]}
                  alt={cfg.label}
                  className="img-zoom absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/85 via-charcoal-950/25 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <div
                    className={cn(
                      'mb-3 flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300',
                      'bg-white/15 backdrop-blur-md group-hover:bg-terracotta',
                      isLarge && 'h-14 w-14'
                    )}
                  >
                    <Icon className={cn('text-white', isLarge ? 'h-7 w-7' : 'h-5 w-5')} />
                  </div>
                  <h3 className={cn('font-serif font-bold text-white', isLarge ? 'text-2xl' : 'text-lg')}>
                    {cfg.label}
                  </h3>
                  <p className={cn(
                    'mt-1 text-ivory/70 transition-all duration-500',
                    isLarge ? 'text-sm leading-relaxed opacity-100 max-h-20' : 'text-xs max-h-0 overflow-hidden opacity-0 group-hover:max-h-20 group-hover:opacity-100'
                  )}>
                    {cfg.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
