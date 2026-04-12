import { useRef } from "react";
import { Link } from "react-router";
import { ArrowDown, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CategoryGrid } from "../components/CategoryGrid";
import { FeaturedProducts } from "../components/FeaturedProducts";
import { ServicesGrid } from "../components/ServicesGrid";
import { BrandCarousel } from "../components/BrandCarousel";
import { CTABand } from "../components/CTABand";

gsap.registerPlugin(ScrollTrigger);

export function HomePage() {
  const container = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // ─── Hero entrance: staggered, power4.out for crisp snap ────────────────
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.fromTo(
      ".hero-title",
      { opacity: 0, y: 60, filter: "blur(8px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 1 }
    )
      .fromTo(
        ".hero-desc",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9 },
        "-=0.65"
      )
      .fromTo(
        ".hero-btn",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 },
        "-=0.55"
      )
      .fromTo(
        ".hero-arrow",
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.3"
      );

    // ─── Parallax: GPU-only (use transform, not yPercent) ───────────────────
    // scrub:1.2 gives smooth rubber-band feel without jank
    gsap.to(bgRef.current, {
      y: "22%",          // smaller range = less repaint area
      ease: "none",
      force3D: true,     // force GPU compositing
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1.2,       // silky smooth, not instant
        invalidateOnRefresh: true,
      },
    });

    // Content fades & drifts up as user scrolls away
    gsap.to(contentRef.current, {
      y: "18%",
      opacity: 0,
      ease: "none",
      force3D: true,
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "60% top",
        scrub: 1.2,
        invalidateOnRefresh: true,
      },
    });

    // Arrow bounce — infinite, light
    gsap.to(".hero-arrow", {
      y: 8,
      duration: 1.4,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    // ─── Section reveals: subtle fade + translate, toggleActions for reverse ─
    const reveals = gsap.utils.toArray<HTMLElement>(".reveal-up");
    reveals.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: "power3.out",
          force3D: true,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }, { scope: container });

  return (
    <div ref={container} style={{ background: "var(--white)" }}>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative h-screen overflow-hidden"
        style={{ isolation: "isolate" }}
      >
        {/* BG — separate layer so parallax is composited by GPU */}
        <div
          ref={bgRef}
          className="absolute inset-0 will-change-transform"
          style={{
            top: "-15%",
            height: "130%",
            backgroundImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(15,10,8,0.68) 100%), url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            // grain overlay via CSS — no extra DOM element
            backgroundColor: "#1a1510",
          }}
        />

        {/* Content */}
        <div
          ref={contentRef}
          className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 will-change-transform"
        >
          <h1
            className="hero-title opacity-0 text-white will-change-transform"
            style={{
              fontSize: "clamp(42px, 8vw, 112px)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              textShadow: "0 2px 24px rgba(0,0,0,0.4)",
            }}
          >
            Premium Masonry
            <br />
            <span style={{ color: "var(--beige)" }}>Crafted to Last</span>
          </h1>

          <p
            className="hero-desc opacity-0 will-change-transform"
            style={{
              color: "rgba(255,255,255,0.78)",
              fontSize: "clamp(16px, 2vw, 22px)",
              marginTop: "1.5rem",
              marginBottom: "3rem",
              maxWidth: "600px",
              lineHeight: 1.7,
            }}
          >
            Transform your outdoor spaces with expert craftsmanship and
            time-tested materials.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Link
              to="/estimate"
              className="hero-btn opacity-0 will-change-transform flex items-center gap-2 group"
              style={{
                padding: "14px 32px",
                background: "var(--brick)",
                color: "#fff",
                borderRadius: "9999px",
                fontWeight: 700,
                fontSize: "15px",
                letterSpacing: "0.02em",
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.5)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.4)"; }}
            >
              Get Free Estimate
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/categories/pavers"
              className="hero-btn opacity-0 will-change-transform"
              style={{
                padding: "14px 32px",
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
                color: "#fff",
                border: "1.5px solid rgba(255,255,255,0.25)",
                borderRadius: "9999px",
                fontWeight: 600,
                fontSize: "15px",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.14)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
            >
              Explore Products
            </Link>
          </div>

          <div className="hero-arrow opacity-0 will-change-transform absolute bottom-10 left-1/2 -translate-x-1/2">
            <ArrowDown style={{ width: 28, height: 28, color: "rgba(255,255,255,0.5)" }} />
          </div>
        </div>
      </section>

      {/* ── Categories ──────────────────────────────────────────── */}
      <section style={{ padding: "96px 24px", background: "var(--off-white)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="reveal-up text-center mb-16 opacity-0">
            <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 700, color: "var(--charcoal)" }}>
              Browse by Category
            </h2>
            <p style={{ color: "var(--slate)", fontSize: 18, marginTop: 12 }}>
              Find the perfect materials for your project
            </p>
          </div>
          <CategoryGrid />
        </div>
      </section>

      {/* ── Featured Products ────────────────────────────────────── */}
      <section style={{ padding: "96px 24px", background: "var(--white)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="reveal-up mb-16 opacity-0">
            <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 700, color: "var(--charcoal)" }}>
              Featured Products
            </h2>
            <p style={{ color: "var(--slate)", fontSize: 18, marginTop: 12 }}>
              Handpicked selections for exceptional projects
            </p>
          </div>
          <FeaturedProducts />
        </div>
      </section>

      {/* ── Services ────────────────────────────────────────────── */}
      <section style={{ padding: "96px 24px", background: "var(--off-white)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="reveal-up text-center mb-16 opacity-0">
            <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 700, color: "var(--charcoal)" }}>
              Our Services
            </h2>
            <p style={{ color: "var(--slate)", fontSize: 18, marginTop: 12 }}>
              Comprehensive solutions for every masonry need
            </p>
          </div>
          <ServicesGrid />
        </div>
      </section>

      {/* ── Brand Carousel ──────────────────────────────────────── */}
      <section style={{ padding: "96px 24px", background: "var(--white)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="reveal-up text-center mb-16 opacity-0">
            <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 700, color: "var(--charcoal)" }}>
              Trusted Brands
            </h2>
            <p style={{ color: "var(--slate)", fontSize: 18, marginTop: 12 }}>
              We partner with industry-leading manufacturers
            </p>
          </div>
          <BrandCarousel />
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <CTABand
        title="Ready to transform your outdoor space?"
        description="Schedule your free consultation today"
        buttonText="Get Free Estimate"
        buttonLink="/estimate"
        variant="charcoal"
      />
    </div>
  );
}
