import { cn } from '@/utils/cn';
import { SectionHeading } from '@/components/ui';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { ArrowUpRight, Quote } from 'lucide-react';

const stories = [
  {
    title: 'The Living Brush of Kumartuli',
    category: 'Art & Crafts',
    location: 'Kolkata, West Bengal',
    image: 'https://images.pexels.com/photos/30969805/pexels-photo-30969805.jpeg?auto=compress&cs=tinysrgb&w=1000',
    excerpt: 'In a narrow lane by the Ganges, third-generation sculptors shape clay into gods. Each year, they build thousands of idols for Durga Puja — then dissolve them in the same river that gave them form.',
    readTime: '4 min read',
    large: true,
  },
  {
    title: 'Colors of the Kathakali Stage',
    category: 'Culture',
    location: 'Kerala',
    image: 'https://images.pexels.com/photos/8566097/pexels-photo-8566097.jpeg?auto=compress&cs=tinysrgb&w=800',
    excerpt: 'It takes three hours to apply the chutti — the elaborate facial makeup that transforms a man into a demon king. The performance tells the Ramayana, but through 24 hand gestures and 9 facial expressions.',
    readTime: '3 min read',
    large: false,
  },
  {
    title: 'The Spice Bazaar that Never Sleeps',
    category: 'Food',
    location: 'Delhi',
    image: 'https://images.pexels.com/photos/17870116/pexels-photo-17870116.jpeg?auto=compress&cs=tinysrgb&w=800',
    excerpt: 'Khari Baori has traded spices for four centuries. Walk in and your eyes water before your brain catches up — cardamom, dried red chili, and saffron hang in the air like weather.',
    readTime: '5 min read',
    large: false,
  },
  {
    title: 'Songs on the Ghats',
    category: 'Spiritual',
    location: 'Varanasi',
    image: 'https://images.pexels.com/photos/8112524/pexels-photo-8112524.jpeg?auto=compress&cs=tinysrgb&w=800',
    excerpt: 'Every evening at Dashashwamedh Ghat, priests perform the Ganga Aarti with towering lamps. The ceremony is ancient, the river is ancient, and for a moment you forget which century you are in.',
    readTime: '4 min read',
    large: false,
  },
];

export function Culture() {
  const { ref, visible } = useScrollReveal();

  return (
    <section id="culture" className="bg-ivory py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Culture & Stories"
          title={<>Stories that <span className="italic text-terracotta">live in places</span></>}
          subtitle="Beyond monuments, India is its people — artisans, dancers, cooks, and priests keeping ancient traditions alive. These are their stories."
        />

        {/* Quote */}
        <div className="mt-10 rounded-3xl bg-gradient-to-br from-charcoal-900 to-charcoal-800 p-8 text-center lg:p-12">
          <Quote className="mx-auto h-8 w-8 text-gold-300/50" />
          <p className="mt-4 font-serif text-2xl font-medium italic leading-relaxed text-ivory lg:text-3xl">
            "India is not a country of monuments. It is a country of living traditions —
            <span className="text-gold-300"> where every craft, every recipe, every dance is a line in a story still being written.</span>"
          </p>
        </div>

        {/* Editorial layout */}
        <div
          ref={ref}
          className={cn(
            'mt-10 grid gap-6 transition-all duration-700 lg:grid-cols-3',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          {/* Large feature */}
          <article className="group relative overflow-hidden rounded-3xl lg:col-span-2 lg:row-span-2 card-hover cursor-pointer">
            <img src={stories[0].image} alt={stories[0].title} className="img-zoom h-full min-h-[500px] w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-charcoal-950/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-7">
              <div className="flex items-center gap-3 text-xs">
                <span className="rounded-full bg-terracotta px-3 py-1 font-semibold text-white">{stories[0].category}</span>
                <span className="text-ivory/60">{stories[0].location}</span>
                <span className="text-ivory/40">· {stories[0].readTime}</span>
              </div>
              <h3 className="mt-3 font-serif text-3xl font-bold text-white">{stories[0].title}</h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-ivory/70">{stories[0].excerpt}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold-300">
                Read story <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </article>

          {/* Smaller stories */}
          {stories.slice(1).map((s, i) => (
            <article
              key={s.title}
              className="group relative overflow-hidden rounded-3xl card-hover cursor-pointer"
              style={{ transitionDelay: `${(i + 1) * 0.1}s` }}
            >
              <img src={s.image} alt={s.title} className="img-zoom h-full min-h-[240px] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-charcoal-950/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-gold-500/90 px-2.5 py-0.5 font-semibold text-charcoal-900">{s.category}</span>
                  <span className="text-ivory/50">{s.readTime}</span>
                </div>
                <h3 className="mt-2 font-serif text-xl font-bold text-white">{s.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-ivory/60 line-clamp-2">{s.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
