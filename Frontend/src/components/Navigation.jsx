import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlass, List, X } from '@phosphor-icons/react';

const productCategories = [
  { name: 'Brick', path: '/products/brick' },
  { name: 'Stone', path: '/products/stone' },
  { name: 'Precast', path: '/products/precast' },
  { name: 'Siding', path: '/products/siding' },
  { name: 'Aggregates', path: '/products/aggregates' },
  { name: 'Hardscape', path: '/products/hardscape' },
  { name: 'Landscape Materials', path: '/products/landscape-materials' },
  { name: 'Accessories', path: '/products/accessories' }
];

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setShowMobileMenu(false);
    setShowMegaMenu(false);
  }, [location]);

  return (
    <>
      <motion.nav
        data-testid="main-nav"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-sm'
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="px-6 md:px-12 lg:px-24">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <motion.div
                className="text-2xl font-medium tracking-tight text-[#1E1C1B]"
                whileHover={{ scale: 1.02 }}
              >
                Modern <span className="text-[#A84232]">Masonry</span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <div
                className="relative"
                onMouseEnter={() => setShowMegaMenu(true)}
                onMouseLeave={() => setShowMegaMenu(false)}
              >
                <button
                  className="text-sm font-medium tracking-wide uppercase text-[#1E1C1B] hover:text-[#A84232] transition-colors"
                  data-testid="products-menu-trigger"
                >
                  Products
                </button>

                <AnimatePresence>
                  {showMegaMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[600px]"
                    >
                      <div className="glass-effect p-6 shadow-xl">
                        <div className="grid grid-cols-2 gap-3">
                          {productCategories.map((category) => (
                            <Link
                              key={category.path}
                              to={category.path}
                              className="px-4 py-3 hover:bg-[#A84232]/5 transition-colors group"
                              data-testid={`category-${category.name.toLowerCase().replace(/\s/g, '-')}`}
                            >
                              <span className="text-sm font-medium text-[#1E1C1B] group-hover:text-[#A84232] transition-colors">
                                {category.name}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                to="/services"
                className="text-sm font-medium tracking-wide uppercase text-[#1E1C1B] hover:text-[#A84232] transition-colors"
                data-testid="services-link"
              >
                Services
              </Link>
              <Link
                to="/brands"
                className="text-sm font-medium tracking-wide uppercase text-[#1E1C1B] hover:text-[#A84232] transition-colors"
                data-testid="brands-link"
              >
                Brands
              </Link>
              <Link
                to="/about"
                className="text-sm font-medium tracking-wide uppercase text-[#1E1C1B] hover:text-[#A84232] transition-colors"
                data-testid="about-link"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-sm font-medium tracking-wide uppercase text-[#1E1C1B] hover:text-[#A84232] transition-colors"
                data-testid="contact-link"
              >
                Contact
              </Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 hover:bg-[#E2DFD9] transition-colors"
                data-testid="search-toggle"
              >
                <MagnifyingGlass size={20} weight="bold" className="text-[#1E1C1B]" />
              </button>

              <Link
                to="/estimate"
                className="hidden md:block px-6 py-3 bg-[#A84232] text-white text-sm font-medium tracking-wide uppercase hover:bg-[#8A3325] transition-all"
                data-testid="request-quote-btn"
              >
                Request a Quote
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 hover:bg-[#E2DFD9] transition-colors"
                data-testid="mobile-menu-toggle"
              >
                {showMobileMenu ? (
                  <X size={24} weight="bold" className="text-[#1E1C1B]" />
                ) : (
                  <List size={24} weight="bold" className="text-[#1E1C1B]" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-[#E2DFD9] bg-white/95 backdrop-blur-xl overflow-hidden"
            >
              <div className="px-6 md:px-12 lg:px-24 py-6">
                <input
                  type="text"
                  placeholder="Search products, brands, services..."
                  className="w-full px-6 py-4 bg-[#F9F8F6] border-2 border-[#E2DFD9] focus:border-[#A84232] outline-none text-[#1E1C1B] placeholder:text-[#4A4643]/50"
                  autoFocus
                  data-testid="search-input"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 right-0 z-40 w-full max-w-sm bg-white shadow-2xl lg:hidden overflow-y-auto"
            data-testid="mobile-menu"
          >
            <div className="p-6 space-y-6">
              <div className="pt-16">
                <h3 className="text-xs tracking-[0.2em] uppercase font-bold text-[#A84232] mb-4">
                  Products
                </h3>
                <div className="space-y-2">
                  {productCategories.map((category) => (
                    <Link
                      key={category.path}
                      to={category.path}
                      className="block px-4 py-3 text-[#1E1C1B] hover:bg-[#E2DFD9] transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Link
                  to="/services"
                  className="block px-4 py-3 text-[#1E1C1B] hover:bg-[#E2DFD9] transition-colors"
                >
                  Services
                </Link>
                <Link
                  to="/brands"
                  className="block px-4 py-3 text-[#1E1C1B] hover:bg-[#E2DFD9] transition-colors"
                >
                  Brands
                </Link>
                <Link
                  to="/about"
                  className="block px-4 py-3 text-[#1E1C1B] hover:bg-[#E2DFD9] transition-colors"
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="block px-4 py-3 text-[#1E1C1B] hover:bg-[#E2DFD9] transition-colors"
                >
                  Contact
                </Link>
              </div>

              <Link
                to="/estimate"
                className="block w-full px-6 py-4 bg-[#A84232] text-white text-sm font-medium tracking-wide uppercase hover:bg-[#8A3325] transition-all text-center"
              >
                Request a Quote
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      {showMobileMenu && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowMobileMenu(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}
    </>
  );
};

export default Navigation;