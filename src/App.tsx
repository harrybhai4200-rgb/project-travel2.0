import { useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/sections/Hero';
import { Destinations } from '@/components/sections/Destinations';
import { Categories } from '@/components/sections/Categories';
import { MapSection } from '@/components/sections/MapSection';
import { AIGuide } from '@/components/sections/AIGuide';
import { TripPlanner } from '@/components/sections/TripPlanner';
import { TripIntelligence } from '@/components/sections/TripIntelligence';
import { Itinerary } from '@/components/sections/Itinerary';
import { Culture } from '@/components/sections/Culture';
import { ResponsibleTourism } from '@/components/sections/ResponsibleTourism';
import { ScamShield } from '@/components/sections/ScamShield';
import { Footer } from '@/components/sections/Footer';

export default function App() {
  const handleNavigate = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <div className="min-h-screen bg-ivory">
      <Navbar onNavigate={handleNavigate} />
      <main>
        <Hero onNavigate={handleNavigate} />
        <Destinations />
        <Categories />
        <MapSection />
        <AIGuide />
        <TripPlanner onComplete={() => handleNavigate('itinerary')} />
        <ScamShield />
        <TripIntelligence />
        <Itinerary />
        <Culture />
        <ResponsibleTourism />
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
