import { useState, useEffect } from 'react';
import Homepage from './components/Homepage';
import BrickCatalogue from './components/BrickCatalogue';
import BrickDetail from './components/BrickDetail';

export default function App() {
  const [view, setView] = useState('home');
  const [brickId, setBrickId] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#brick-detail/')) {
        const id = hash.replace('#brick-detail/', '');
        setBrickId(id);
        setView('brick-detail');
      } else if (hash === '#brick') {
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

  if (view === 'brick-detail') {
    return <BrickDetail brickId={brickId} navigate={navigate} />;
  }

  if (view === 'brick') {
    return <BrickCatalogue navigate={navigate} />;
  }

  return <Homepage navigate={navigate} />;
}
