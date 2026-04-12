import { Link } from "react-router";
import { ArrowRight, Instagram, Twitter, Linkedin, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer style={{
      position: "relative",
      overflow: "hidden",
      /* Brick texture directly on the element — most reliable approach */
      backgroundImage: "url('/images/modern_stone_brick_footer_v2.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}>
      {/* Warm semi-transparent overlay — reduced opacity so texture shows through */}
      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(248, 245, 240, 0.78)",
        zIndex: 0,
      }} />

      {/* ── Main content grid ──────────────────────────────────────── */}
      <div
        className="footer-grid"
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1280,
          margin: "0 auto",
          padding: "72px 48px 56px",
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr 1fr 1.4fr",
          gap: "48px 40px",
        }}
      >
        {/* Brand */}
        <div>
          <Link to="/" style={{ display: "inline-block", marginBottom: 20 }}>
            <img
              src="/images/Logo-PNG.png"
              alt="Modern Masonry Group"
              style={{ height: 60, width: "auto", objectFit: "contain" }}
            />
          </Link>
          <p style={{
            fontSize: 14, color: "var(--slate)", lineHeight: 1.8,
            maxWidth: 230, marginBottom: 24,
          }}>
            Defining the landscape of contemporary architecture through curated masonry selections and technical excellence.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            {[Instagram, Twitter, Linkedin, Facebook].map((Icon, i) => (
              <a
                key={i}
                href="#"
                style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "rgba(0,0,0,0.06)",
                  border: "1px solid rgba(0,0,0,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--charcoal)",
                  transition: "background 0.2s, transform 0.2s",
                  textDecoration: "none",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = "var(--charcoal)";
                  (e.currentTarget as HTMLElement).style.color = "#C9A84C";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.06)";
                  (e.currentTarget as HTMLElement).style.color = "var(--charcoal)";
                  (e.currentTarget as HTMLElement).style.transform = "";
                }}
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* Collections */}
        <div>
          <h4 style={{
            fontSize: 11, fontWeight: 800, letterSpacing: "0.12em",
            textTransform: "uppercase", color: "var(--charcoal)",
            marginBottom: 20, marginTop: 4,
          }}>
            Collections
          </h4>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 13 }}>
            {["Brick Collection", "Stone Veneer", "Precast Elements", "Siding Solutions"].map(item => (
              <li key={item}>
                <Link
                  to="#"
                  style={{ fontSize: 14, color: "var(--slate)", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#C9A84C")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--slate)")}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 style={{
            fontSize: 11, fontWeight: 800, letterSpacing: "0.12em",
            textTransform: "uppercase", color: "var(--charcoal)",
            marginBottom: 20, marginTop: 4,
          }}>
            Resources
          </h4>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 13 }}>
            {["Technical Data", "Architectural Specs", "Installation Guides", "Sustainability"].map(item => (
              <li key={item}>
                <Link
                  to="#"
                  style={{ fontSize: 14, color: "var(--slate)", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#C9A84C")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--slate)")}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 style={{
            fontSize: 11, fontWeight: 800, letterSpacing: "0.12em",
            textTransform: "uppercase", color: "var(--charcoal)",
            marginBottom: 16, marginTop: 4,
          }}>
            Stay Inspired
          </h4>
          <p style={{ fontSize: 14, color: "var(--slate)", lineHeight: 1.75, marginBottom: 20 }}>
            Join our architecture briefing for monthly project highlights.
          </p>
          <div style={{
            display: "flex",
            border: "1.5px solid rgba(0,0,0,0.14)",
            borderRadius: 6,
            overflow: "hidden",
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(8px)",
          }}>
            <input
              type="email"
              placeholder="Email..."
              style={{
                flex: 1, padding: "11px 14px",
                background: "transparent",
                border: "none", outline: "none",
                fontSize: 14, color: "var(--charcoal)",
              }}
            />
            <button
              style={{
                background: "#C9A84C",
                border: "none", padding: "0 18px",
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "var(--charcoal)")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "#C9A84C")}
            >
              <ArrowRight size={16} color="#fff" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ──────────────────────────────────────────────── */}
      <div style={{
        position: "relative", zIndex: 2,
        maxWidth: 1280, margin: "0 auto",
        padding: "18px 48px",
        borderTop: "1px solid rgba(0,0,0,0.09)",
        display: "flex", justifyContent: "space-between",
        alignItems: "center", flexWrap: "wrap", gap: 12,
      }}>
        <p style={{ fontSize: 12, color: "var(--slate)", margin: 0 }}>
          © 2026 Modern Masonry Group. Crafted for The Digital Architect.
        </p>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy Policy", "Terms of Service"].map(label => (
            <Link
              key={label}
              to="#"
              style={{ fontSize: 12, color: "var(--slate)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#C9A84C")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--slate)")}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            padding: 48px 24px 40px !important;
          }
          .footer-grid > div:first-child { grid-column: span 2; }
        }
        @media (max-width: 520px) {
          .footer-grid { grid-template-columns: 1fr !important; }
          .footer-grid > div:first-child { grid-column: span 1; }
        }
      `}</style>
    </footer>
  );
}
