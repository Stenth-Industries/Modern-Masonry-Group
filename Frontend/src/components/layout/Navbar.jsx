import { Link, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Brick', path: '/masonry/brick' },
    { name: 'Stone', path: '/masonry/stone' },
    { name: 'Precast', path: '/masonry/precast' },
    { name: 'Siding', path: '/masonry/siding' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl shadow-[0_40px_60px_-15px_rgba(28,27,27,0.06)] flex justify-between items-center px-8 py-4 max-w-full">
      <Link to="/" className="text-xl font-bold tracking-tighter text-stone-900 dark:text-stone-100 font-headline uppercase">
        Modern Masonry
      </Link>
      
      <div className="hidden md:flex items-center space-x-8 font-headline tracking-tight font-bold">
        {navLinks.map((link) => {
          const isActive = location.pathname.startsWith(link.path);
          return (
            <Link
              key={link.name}
              to={link.path}
              className={clsx(
                "relative transition-all hover:text-stone-900 dark:hover:text-stone-100 pb-1",
                isActive ? "text-[#8E352E]" : "text-stone-600 dark:text-stone-400"
              )}
            >
              {link.name}
              {isActive && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8E352E]"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden lg:block group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search materials..." 
            className="bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 w-64 transition-all"
          />
        </div>
        
        <Link 
          to="/estimation"
          className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all"
        >
          Request a Quote
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
