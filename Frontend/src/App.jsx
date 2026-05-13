import { useState, useEffect } from 'react';
import Homepage from './components/Homepage';
import BrickCatalogue from './components/BrickCatalogue';
import BrickDetail from './components/BrickDetail';
import StoneCatalogue from './components/StoneCatalogue';
import StoneDetail from './components/StoneDetail';
import Services from './components/Services';
import Navbar, { UtilityBar } from './components/Navbar';
import QuotePage from './components/QuotePage';
import AboutPage from './components/AboutPage';
import FloatingCTA from './components/FloatingCTA';
import Gallery from './components/Gallery';
import UnderConstruction from './components/UnderConstruction';

// Flip to false when the page is ready to go live
const UNDER_CONSTRUCTION = {
  about: true,
  services: true,
};

export default function App() {
  const [view, setView] = useState('home');
  const [brickId, setBrickId] = useState(null);
  const [stoneId, setStoneId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [view]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#home';
      const [path, queryString] = hash.split('?');
      const params = new URLSearchParams(queryString || '');
      setSearchQuery(params.get('search') || '');

      if (path.startsWith('#brick-detail/')) {
        const id = path.replace('#brick-detail/', '');
        setBrickId(id);
        setView('brick-detail');
      } else if (path.startsWith('#stone-detail/')) {
        const id = path.replace('#stone-detail/', '');
        setStoneId(id);
        setView('stone-detail');
      } else if (path === '#brick' || path === '#products') {
        setView('brick');
      } else if (path === '#stone') {
        setView('stone');
      } else if (path === '#services-page') {
        setView('services');
      } else if (path === '#about') {
        setView('about');
      } else if (path === '#gallery') {
        setView('gallery');
      } else if (path === '#under-construction') {
        setView('under-construction');
      } else if (path === '#contact' || path === '#quote') {
        setView('quote');
      } else {
        setView('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (to) => {
    window.location.hash = to;
  };

  return (
    <>
      <UtilityBar />
      <div className="overflow-x-hidden" style={{ zoom: 0.9 }}>
        <Navbar navigate={navigate} />
        <FloatingCTA />
        {view === 'brick-detail' && <BrickDetail brickId={brickId} navigate={navigate} />}
        {(view === 'brick' || view === 'brick-detail') && (
          <div style={{ display: view === 'brick' ? 'block' : 'none' }}>
            <BrickCatalogue navigate={navigate} initialQuery={searchQuery} />
          </div>
        )}
        {(view === 'stone' || view === 'stone-detail') && (
          <div style={{ display: view === 'stone' ? 'block' : 'none' }}>
            <StoneCatalogue navigate={navigate} initialQuery={searchQuery} />
          </div>
        )}
        {view === 'stone-detail' && <StoneDetail stoneId={stoneId} navigate={navigate} />}
        {view === 'services' && (UNDER_CONSTRUCTION.services ? <UnderConstruction navigate={navigate} /> : <Services navigate={navigate} />)}
        {view === 'gallery' && <Gallery navigate={navigate} />}
        {view === 'about' && (UNDER_CONSTRUCTION.about ? <UnderConstruction navigate={navigate} /> : <AboutPage navigate={navigate} />)}
        {view === 'quote' && <QuotePage navigate={navigate} />}
        {view === 'under-construction' && <UnderConstruction navigate={navigate} />}
        {view === 'home' && <Homepage navigate={navigate} />}
      </div>
    </>
  );
}
