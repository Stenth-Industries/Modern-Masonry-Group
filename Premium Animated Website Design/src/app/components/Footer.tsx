import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowRight, Instagram, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#fcfaf9] border-t border-black/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
        {/* Brand */}
        <div className="md:col-span-4 space-y-6">
          <Link to="/" className="inline-block">
            <span className="text-xl font-bold tracking-tight text-foreground">
              Modern Masonry
            </span>
          </Link>
          <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
            Defining the landscape of contemporary architecture through curated masonry selections and technical excellence.
          </p>
          <div className="flex gap-4 pt-2">
            <a href="#" className="w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center hover:-translate-y-1 transition-transform">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center hover:-translate-y-1 transition-transform">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center hover:-translate-y-1 transition-transform">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Links */}
        <div className="md:col-span-2 space-y-6">
          <h4 className="text-xs font-semibold tracking-wider uppercase text-foreground">Collections</h4>
          <ul className="space-y-4">
            <li><Link to="/categories/brick" className="text-sm text-muted-foreground hover:text-[var(--accent)] transition-colors">Brick Collection</Link></li>
            <li><Link to="/categories/stone" className="text-sm text-muted-foreground hover:text-[var(--accent)] transition-colors">Stone Veneer</Link></li>
            <li><Link to="/categories/precast" className="text-sm text-muted-foreground hover:text-[var(--accent)] transition-colors">Precast Elements</Link></li>
            <li><Link to="/categories/siding" className="text-sm text-muted-foreground hover:text-[var(--accent)] transition-colors">Siding Solutions</Link></li>
          </ul>
        </div>

        <div className="md:col-span-2 space-y-6">
          <h4 className="text-xs font-semibold tracking-wider uppercase text-foreground">Resources</h4>
          <ul className="space-y-4">
            <li><Link to="#" className="text-sm text-muted-foreground hover:text-[var(--accent)] transition-colors">Technical Data</Link></li>
            <li><Link to="#" className="text-sm text-muted-foreground hover:text-[var(--accent)] transition-colors">Architectural Specs</Link></li>
            <li><Link to="#" className="text-sm text-muted-foreground hover:text-[var(--accent)] transition-colors">Installation Guides</Link></li>
            <li><Link to="#" className="text-sm text-muted-foreground hover:text-[var(--accent)] transition-colors">Sustainability</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="md:col-span-4 space-y-6">
          <h4 className="text-xs font-semibold tracking-wider uppercase text-foreground">Stay Inspired</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Join our architecture briefing for monthly project highlights.
          </p>
          <div className="flex bg-white border border-black/10 rounded-md overflow-hidden focus-within:border-[var(--accent)]/50 transition-colors">
            <input 
              type="email" 
              placeholder="Email..." 
              className="flex-1 bg-transparent px-4 py-2 outline-none text-sm"
            />
            <button className="bg-[var(--accent)] text-white px-4 py-2 flex items-center justify-center hover:bg-[var(--accent)]/90 transition-colors">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-muted-foreground">
          © 2026 Modern Masonry. Crafted for The Digital Architect.
        </p>
        <div className="flex gap-6">
          <Link to="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
          <Link to="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
