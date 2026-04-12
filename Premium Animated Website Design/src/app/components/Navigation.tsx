import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Search, ChevronDown, ArrowRight, User } from "lucide-react";

const navItems = [
  { id: "products", name: "Products", path: "/products", hasDropdown: true },
  { id: "services", name: "Services", path: "/services", hasDropdown: false },
  { id: "about", name: "About", path: "/about", hasDropdown: false },
  { id: "contact", name: "Contact Us", path: "/contact", hasDropdown: false },
];

const productCategories = [
  {
    id: "brick",
    name: "Premium Brick",
    description: "Classic and architectural brick varieties for timeless design.",
    image: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=400&q=80",
  },
  {
    id: "stone",
    name: "Natural Stone",
    description: "Elegant stone veneers and block masonry solutions.",
    image: "https://images.unsplash.com/photo-1590483736622-398bc43be4f0?w=400&q=80",
  },
  {
    id: "precast",
    name: "Precast Concrete",
    description: "Durable structural and aesthetic concrete components.",
    image: "https://images.unsplash.com/photo-1518242007639-6b5832a4e98f?w=400&q=80",
  },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const cur = window.scrollY;
      setIsScrolled(cur > 20);
      setIsHidden(cur > lastScrollY && cur > 120);
      setLastScrollY(cur);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveMenu(null);
    setSearchOpen(false);
  }, [location]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const navBg = isScrolled
    ? "rgba(30,25,20,0.92)"
    : "rgba(18,14,10,0.72)";

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50"
      animate={{ y: isHidden ? -100 : 0 }}
      transition={{ type: "spring", stiffness: 380, damping: 38 }}
      style={{
        background: navBg,
        backdropFilter: "blur(20px)",
        borderBottom: isScrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
        boxShadow: isScrolled ? "0 4px 32px rgba(0,0,0,0.35)" : "none",
        transition: "background 0.3s, border-color 0.3s, box-shadow 0.3s",
        height: isScrolled ? 68 : 84,
      }}
    >
      <div style={{
        maxWidth: 1280, margin: "0 auto",
        padding: "0 32px",
        height: "100%",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 32,
      }}>

        {/* ── Logo ────────────────────────────────── */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", flexShrink: 0 }}>
          {/* Gold M mark — matches reference screenshots */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            style={{
              width: 48, height: 48,
              border: "2px solid #C9A84C",
              borderRadius: 4,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              background: "rgba(201,168,76,0.12)",
            }}
          >
            <span style={{
              color: "#C9A84C",
              fontWeight: 900,
              fontSize: 26,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              fontFamily: "inherit",
            }}>M</span>
          </motion.div>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ color: "#C9A84C", fontWeight: 800, fontSize: 14, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Modern Masonry
            </div>
            <div style={{ color: "rgba(201,168,76,0.6)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", marginTop: 2 }}>
              Group
            </div>
          </div>
        </Link>

        {/* ── Desktop Nav Links ────────────────────── */}
        <div className="hidden lg:flex" style={{ flex: 1, justifyContent: "center", height: "100%", alignItems: "stretch" }}>
          <div style={{ display: "flex", alignItems: "stretch", gap: 4 }}>
            {navItems.map((item) => (
              <div
                key={item.id}
                style={{ position: "relative", display: "flex", alignItems: "center" }}
                onMouseEnter={() => setActiveMenu(item.id)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <Link
                  to={item.path}
                  style={{
                    display: "flex", alignItems: "center", gap: 4,
                    padding: "0 14px",
                    color: location.pathname.startsWith(item.path) ? "#C8A96E" : "rgba(255,255,255,0.82)",
                    fontSize: 14,
                    fontWeight: 600,
                    textDecoration: "none",
                    letterSpacing: "0.01em",
                    transition: "color 0.2s",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={e => { if (!location.pathname.startsWith(item.path)) (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                  onMouseLeave={e => { if (!location.pathname.startsWith(item.path)) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.82)"; }}
                >
                  {item.name}
                  {item.hasDropdown && (
                    <ChevronDown
                      size={14}
                      style={{
                        transition: "transform 0.25s",
                        transform: activeMenu === item.id ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    />
                  )}
                </Link>

                {/* Mega dropdown — flush with nav bottom, transparent bridge covers the gap */}
                {item.hasDropdown && (
                  <AnimatePresence>
                    {activeMenu === item.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 500, damping: 36 }}
                        style={{
                          position: "absolute",
                          top: "100%",          /* flush with nav — no gap */
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: 740,
                          background: "rgba(18,14,10,0.98)",
                          backdropFilter: "blur(24px)",
                          borderRadius: "0 0 16px 16px",
                          border: "1px solid rgba(255,255,255,0.09)",
                          borderTop: "2px solid #C9A84C",
                          boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
                          overflow: "hidden",
                          zIndex: 100,
                        }}
                      >
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0 }}>
                          {productCategories.map((cat, idx) => (
                            <motion.div
                              key={cat.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.05 }}
                            >
                              <Link
                                to={`/categories/${cat.id}`}
                                style={{ display: "flex", flexDirection: "column", gap: 10, padding: 20, textDecoration: "none", borderRight: idx < 2 ? "1px solid rgba(255,255,255,0.07)" : "none" }}
                                className="nav-dropdown-item"
                              >
                                <div style={{ height: 110, borderRadius: 8, overflow: "hidden", position: "relative" }}>
                                  <img
                                    src={cat.image}
                                    alt={cat.name}
                                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }}
                                    className="nav-dropdown-img"
                                  />
                                </div>
                                <div>
                                  <div style={{ color: "#fff", fontWeight: 700, fontSize: 13, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    {cat.name}
                                    <ArrowRight size={13} style={{ color: "#C8A96E", opacity: 0.7 }} />
                                  </div>
                                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 4, lineHeight: 1.5 }}>
                                    {cat.description}
                                  </div>
                                </div>
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                        <div style={{
                          borderTop: "1px solid rgba(255,255,255,0.07)",
                          padding: "12px 20px",
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                        }}>
                          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Looking for a custom solution?</span>
                          <Link to="/contact" style={{ fontSize: 12, color: "#C8A96E", fontWeight: 700, textDecoration: "none" }}>
                            Get in touch →
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Right side actions ───────────────────── */}
        <div className="hidden lg:flex" style={{ alignItems: "center", gap: 8, flexShrink: 0 }}>
          {/* Search */}
          <AnimatePresence mode="wait">
            {searchOpen ? (
              <motion.div
                key="search-open"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 220, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 360, damping: 30 }}
                style={{
                  display: "flex", alignItems: "center",
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  borderRadius: 8,
                  padding: "6px 12px",
                  overflow: "hidden",
                }}
              >
                <Search size={14} style={{ color: "rgba(255,255,255,0.5)", flexShrink: 0 }} />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search materials…"
                  style={{
                    flex: 1, background: "transparent", border: "none",
                    outline: "none", color: "#fff", fontSize: 13,
                    marginLeft: 8,
                  }}
                  onBlur={() => setSearchOpen(false)}
                />
                <button onClick={() => setSearchOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  <X size={14} style={{ color: "rgba(255,255,255,0.5)" }} />
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="search-icon"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setSearchOpen(true)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  padding: 8, borderRadius: 8, color: "rgba(255,255,255,0.7)",
                  transition: "color 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
              >
                <Search size={18} />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Login */}
          <Link
            to="/login"
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 16px",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 8,
              color: "rgba(255,255,255,0.82)",
              fontSize: 13, fontWeight: 600,
              textDecoration: "none",
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.5)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.82)"; }}
          >
            <User size={14} />
            Login
          </Link>

          {/* Free Quote CTA */}
          <Link
            to="/estimate"
            style={{
              padding: "9px 20px",
              background: "linear-gradient(135deg,#C9A84C,#9A7830)",
              color: "#fff",
              borderRadius: 8,
              fontSize: 13, fontWeight: 700,
              textDecoration: "none",
              letterSpacing: "0.03em",
              boxShadow: "0 2px 12px rgba(200,169,110,0.35)",
              transition: "transform 0.15s, box-shadow 0.15s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(201,168,76,0.55)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(201,168,76,0.35)"; (e.currentTarget as HTMLElement).style.transform = ""; }}
          >
            FREE QUOTE!
          </Link>
        </div>

        {/* ── Mobile burger ───────────────────────── */}
        <button
          className="lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", padding: 6 }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* ── Mobile menu ─────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            style={{
              overflow: "hidden",
              background: "rgba(18,14,10,0.97)",
              backdropFilter: "blur(24px)",
              borderTop: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div style={{ padding: "24px 24px 32px" }}>
              {/* Mobile search */}
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10, padding: "10px 16px", marginBottom: 24,
              }}>
                <Search size={16} style={{ color: "rgba(255,255,255,0.5)" }} />
                <input
                  type="text"
                  placeholder="Search materials…"
                  style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: 14 }}
                />
              </div>

              {/* Nav links */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 24 }}>
                {navItems.map(item => (
                  <Link
                    key={item.id}
                    to={item.path}
                    style={{
                      color: "rgba(255,255,255,0.85)", fontSize: 18, fontWeight: 700,
                      padding: "10px 0", textDecoration: "none",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Products mini-grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
                {productCategories.map(cat => (
                  <Link key={cat.id} to={`/categories/${cat.id}`} style={{ textDecoration: "none" }}>
                    <div style={{ height: 70, borderRadius: 8, overflow: "hidden", marginBottom: 6 }}>
                      <img src={cat.image} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>{cat.name}</div>
                  </Link>
                ))}
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <Link to="/login" style={{
                  flex: 1, padding: "12px 0", textAlign: "center",
                  border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10,
                  color: "#fff", fontWeight: 600, fontSize: 14, textDecoration: "none",
                }}>
                  Login
                </Link>
                <Link to="/estimate" style={{
                  flex: 1, padding: "12px 0", textAlign: "center",
                  background: "linear-gradient(135deg,#C9A84C,#9A7830)",
                  borderRadius: 10,
                  color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none",
                }}>
                  FREE QUOTE!
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dropdown hover styles */}
      <style>{`
        .nav-dropdown-item:hover .nav-dropdown-img { transform: scale(1.08); }
        .nav-dropdown-item:hover { background: rgba(255,255,255,0.04); }
      `}</style>
    </motion.nav>
  );
}
