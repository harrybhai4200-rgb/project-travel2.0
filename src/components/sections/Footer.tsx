import { Compass, Github, Twitter, Instagram, Mail, ArrowUpRight } from 'lucide-react';
import { navSections } from '@/data/destinations';

export function Footer({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <footer className="bg-charcoal-950 py-16 text-ivory">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-terracotta">
                <Compass className="h-5 w-5 text-white" />
              </div>
              <span className="font-serif text-xl font-bold">HeritageLens</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory/50">
              Discover India beyond the famous — hidden heritage, living culture, and intelligent trip planning powered by AI.
            </p>
            <div className="mt-5 flex gap-3">
              {[Twitter, Instagram, Github, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-ivory/60 transition-all duration-300 hover:bg-terracotta hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-ivory/40">Explore</h4>
            <ul className="mt-4 space-y-2.5">
              {navSections.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => onNavigate(s.id)}
                    className="text-sm text-ivory/60 transition-colors hover:text-gold-300"
                  >
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-ivory/40">Company</h4>
            <ul className="mt-4 space-y-2.5">
              {['About Us', 'Our Mission', 'Partnerships', 'Press Kit', 'Careers'].map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-ivory/60 transition-colors hover:text-gold-300">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-ivory/40">Support</h4>
            <ul className="mt-4 space-y-2.5">
              {['Help Center', 'Safety Guide', 'Travel Insurance', 'Contact Us', 'Privacy Policy'].map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-ivory/60 transition-colors hover:text-gold-300">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-ivory/40">© 2026 HeritageLens. Made with respect for India's living heritage.</p>
          <button
            onClick={() => onNavigate('hero')}
            className="group inline-flex items-center gap-1.5 text-xs font-medium text-ivory/60 transition-colors hover:text-gold-300"
          >
            Back to top
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
