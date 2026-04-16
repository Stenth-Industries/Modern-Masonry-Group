import { useState, useEffect } from 'react';
import Homepage from './components/Homepage';
import BrickCatalogue from './components/BrickCatalogue';
import BrickDetail from './components/BrickDetail';
import Services from './components/Services';
import Navbar from './components/Navbar';
import QuotePage from './components/QuotePage';
import AboutPage from './components/AboutPage';

export default function App() {
  const [view, setView] = useState('home');
  const [brickId, setBrickId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleHashChange = () => {
      const hash = window.location.hash || '#home';
      const [path, queryString] = hash.split('?');
      const params = new URLSearchParams(queryString || '');
      setSearchQuery(params.get('search') || '');

      if (path.startsWith('#brick-detail/')) {
        const id = path.replace('#brick-detail/', '');
        setBrickId(id);
        setView('brick-detail');
      } else if (path === '#brick' || path === '#products') {
        setView('brick');
      } else if (path === '#services-page') {
        setView('services');
      } else if (path === '#about') {
        setView('about');
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
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Navbar navigate={navigate} />
      {view === 'brick-detail' && <BrickDetail brickId={brickId} navigate={navigate} />}
      {view === 'brick' && <BrickCatalogue navigate={navigate} initialQuery={searchQuery} />}
      {view === 'services' && <Services navigate={navigate} />}
      {view === 'about' && <AboutPage navigate={navigate} />}
      {view === 'quote' && <QuotePage navigate={navigate} />}
      {view === 'home' && <Homepage navigate={navigate} />}
    </>
  );
}
