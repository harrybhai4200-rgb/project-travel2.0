import { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';
import { navSections } from '@/data/destinations';
import { Compass, Menu, X } from 'lucide-react';

export function Navbar({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (id: string) => {
    setMenuOpen(false);
    onNavigate(id);
  };

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500',
          scrolled ? 'glass shadow-lg' : 'bg-transparent'
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <button
            onClick={() => handleNav('hero')}
            className="flex items-center gap-2.5 transition-transform hover:scale-[1.02]"
          >
            <div className={cn(
              'flex h-9 w-9 items-center justify-center rounded-xl transition-colors',
              scrolled ? 'bg-charcoal-900' : 'bg-white/15 backdrop-blur-md'
            )}>
              <Compass className={cn('h-5 w-5', scrolled ? 'text-gold-400' : 'text-white')} />
            </div>
            <span className={cn(
              'font-serif text-xl font-bold tracking-tight transition-colors',
              scrolled ? 'text-charcoal-900' : 'text-white'
            )}>
              HeritageLens
            </span>
          </button>

          <div className="hidden items-center gap-1 lg:flex">
            {navSections.map((s) => (
              <button
                key={s.id}
                onClick={() => handleNav(s.id)}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-all duration-300',
                  scrolled
                    ? 'text-charcoal-600 hover:bg-charcoal-100 hover:text-charcoal-900'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                )}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="hidden lg:block">
            <button
              onClick={() => handleNav('planner')}
              className={cn(
                'rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300',
                scrolled
                  ? 'bg-terracotta text-white hover:bg-terracotta-600'
                  : 'bg-white text-charcoal-900 hover:bg-ivory'
              )}
            >
              Plan a Trip
            </button>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-xl transition-colors lg:hidden',
              scrolled ? 'text-charcoal-900 hover:bg-charcoal-100' : 'text-white hover:bg-white/10'
            )}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-charcoal-950/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-ivory p-6 pt-24 shadow-2xl animate-fade-in">
            <div className="flex flex-col gap-1">
              {navSections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleNav(s.id)}
                  className="rounded-xl px-4 py-3 text-left text-base font-medium text-charcoal-700 transition-colors hover:bg-cream-200"
                >
                  {s.label}
                </button>
              ))}
              <button
                onClick={() => handleNav('planner')}
                className="mt-4 rounded-xl bg-terracotta px-4 py-3 text-center text-base font-semibold text-white"
              >
                Plan a Trip
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
