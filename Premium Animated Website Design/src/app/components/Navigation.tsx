import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Search, ChevronDown } from "lucide-react";

const categories = [
  { id: "brick", name: "Brick" },
  { id: "stone", name: "Stone" },
  { id: "precast", name: "Precast" },
  { id: "siding", name: "Siding" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveMenu(null);
  }, [location]);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      initial={{ y: 0 }}
      animate={{
        y: isHidden ? -100 : 0,
        height: isScrolled ? 70 : 90,
      }}
      style={{
        background: isScrolled
          ? 'rgba(255, 255, 255, 0.9)'
          : 'rgba(255, 255, 255, 1)',
        backdropFilter: isScrolled ? 'blur(12px)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(0, 0, 0, 0.05)' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <motion.div
            className="text-xl font-bold tracking-tight text-foreground"
            whileHover={{ scale: 1.02 }}
          >
            Modern Masonry
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-center flex-1 mx-12">
          <div className="flex items-center gap-8">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="relative"
                onMouseEnter={() => setActiveMenu(cat.id)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <Link
                  to={`/categories/${cat.id}`}
                  className={`text-sm font-medium transition-colors hover:text-[var(--accent)] ${
                    location.pathname.includes(cat.id) ? "text-[var(--accent)] border-b-2 border-[var(--accent)] pb-1" : "text-foreground/80"
                  }`}
                >
                  {cat.name}
                </Link>

                <AnimatePresence>
                  {activeMenu === cat.id && (
                    <motion.div
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-xl p-3 border border-black/5"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className="flex flex-col gap-1">
                        <Link to={`/categories/${cat.id}?type=architectural`} className="px-3 py-2 text-sm rounded-lg hover:bg-[var(--off-white)] transition-colors">Architectural</Link>
                        <Link to={`/categories/${cat.id}?type=residential`} className="px-3 py-2 text-sm rounded-lg hover:bg-[var(--off-white)] transition-colors">Residential</Link>
                        <Link to={`/categories/${cat.id}?type=commercial`} className="px-3 py-2 text-sm rounded-lg hover:bg-[var(--off-white)] transition-colors">Commercial</Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <div className="flex items-center bg-[var(--off-white)] rounded-md px-3 py-2 w-64 border border-transparent focus-within:border-[var(--accent)]/30 transition-all">
              <Search className="w-4 h-4 text-muted-foreground mr-2" />
              <input
                type="text"
                placeholder="Search materials..."
                className="bg-transparent border-none outline-none text-sm w-full"
              />
            </div>
          </div>

          {/* CTA */}
          <Link
            to="/estimate"
            className="px-5 py-2.5 bg-[var(--accent)] text-white text-sm font-medium rounded-md hover:bg-[var(--accent)]/90 transition-all"
          >
            Request a Quote
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-t border-black/5"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="p-6 space-y-4">
              {categories.map((cat) => (
                <Link key={cat.id} to={`/categories/${cat.id}`} className="block py-2 text-lg font-medium">
                  {cat.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-black/10">
                <Link
                  to="/estimate"
                  className="block w-full px-6 py-3 bg-[var(--accent)] text-white rounded-md text-center font-medium"
                >
                  Request a Quote
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
