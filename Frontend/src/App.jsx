import { useState, useEffect } from 'react';
import Homepage from './components/Homepage';
import BrickCatalogue from './components/BrickCatalogue';

export default function App() {
  const [view, setView] = useState('home');

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#brick') {
        setView('brick');
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

  if (view === 'brick') {
    return <BrickCatalogue navigate={navigate} />;
  }

  return <Homepage navigate={navigate} />;
}
