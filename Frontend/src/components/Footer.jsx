import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { TextHoverEffect, FooterBackgroundGradient } from "./ui/hover-footer";

export default function Footer() {
  return (
    <footer
      className="bg-[#07070a] relative overflow-hidden text-[#6B6B6B]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Top gold rule */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#C9A449] to-transparent opacity-40" />

      {/* NEWSLETTER BAND */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-8 lg:px-16 py-16 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="lg:max-w-sm">
            <p className="text-[#C9A449] text-[10px] font-semibold tracking-[0.35em] uppercase mb-3">
              Exclusive Intelligence
            </p>
            <h3
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              className="text-white text-3xl font-light tracking-wide leading-snug"
            >
              Ontario's Premier
              <br />
              Masonry Supplier
            </h3>
            <p className="text-sm mt-3 leading-relaxed text-white/40">
              Trade offers, new arrivals, and project inspiration — delivered
              with discretion.
            </p>
          </div>
          <div className="flex w-full lg:w-auto lg:min-w-[380px]">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-white/[0.03] border border-white/10 border-r-0 text-white/80 px-5 py-4 text-sm w-full outline-none placeholder:text-white/20 focus:border-[#C9A449]/50 transition-colors duration-300"
            />
            <button className="bg-[#C9A449] hover:bg-[#DDB95A] transition-colors duration-200 text-black px-8 font-semibold uppercase text-[10px] tracking-[0.25em] shrink-0 whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Thin gold divider */}
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
      </div>

      {/* MAIN GRID */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-16 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 items-start">
          {/* Brand */}
          <div className="lg:col-span-4 flex flex-col">
            {/* Fine-tuned negative margins to align the visible left edge and top edge */}
            <div className="-mt-16 -mb-12 -ml-6 lg:-ml-4">
              <img
                src="/Logo-PNG.png"
                alt="Modern Masonry Group"
                className="block w-[260px] md:w-[320px] max-w-none h-auto object-contain object-left"
              />
            </div>
            <p className="mt-0 text-sm leading-relaxed text-white/40 max-w-[260px]">
              Redefining masonry supply in Ontario through curated materials,
              expert insight, and a commitment to architectural excellence.
              Built for those who demand precision, performance, and lasting
              impact.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="h-px w-8 bg-[#C9A449] opacity-60" />
              <p className="text-[#C9A449] text-[12px] tracking-[0.3em] uppercase opacity-80">
                Est. 1994
              </p>
            </div>
            <div className="flex gap-3 mt-5">
              {[
                {
                  label: "Instagram",
                  svg: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle
                        cx="17.5"
                        cy="6.5"
                        r="1"
                        fill="currentColor"
                        stroke="none"
                      />
                    </svg>
                  ),
                },
                {
                  label: "Facebook",
                  svg: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  ),
                },
                {
                  label: "LinkedIn",
                  svg: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  ),
                },
              ].map(({ label, svg }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-8 h-8 border border-white/[0.08] flex items-center justify-center text-white/30 hover:border-[#C9A449]/50 hover:text-[#C9A449] transition-all duration-300"
                >
                  {svg}
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div className="mt-24 lg:mt-8 lg:col-span-2 lg:col-start-6">
            <p className="text-white/90 text-[12px] font-semibold tracking-[0.25em] uppercase mb-6 flex items-center gap-2">
              {/* <span className="h-px w-4 bg-[#C9A449] inline-block opacity-70" /> */}
              Products
            </p>
            <ul className="space-y-3.5 text-sm text-white/40">
              {[
                "Brick",
                "Natural Stone",
                "Landscaping",
                "Accessories",
                "Rialux Siding",
              ].map((p) => (
                <li key={p}>
                  <a
                    href="#"
                    className="relative hover:text-[#C9A449] transition-colors duration-200 group flex items-center"
                  >
                    <span className="absolute -left-5 h-px w-0 bg-[#C9A449] group-hover:w-3 transition-all duration-300 opacity-70" />
                    {p}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="mt-8 lg:mt-8 lg:col-span-2">
            <p className="text-white/90 text-[12px] font-semibold tracking-[0.25em] uppercase mb-6 flex items-center gap-2">
              {/* <span className="h-px w-4 bg-[#C9A449] inline-block opacity-70" /> */}
              Company
            </p>
            <ul className="space-y-3.5 text-sm text-white/40">
              {[
                { label: "About Us", href: "#about" },
                { label: "Project Gallery", href: "#gallery" },
                { label: "Trade Program", href: "#" },
                { label: "FAQs", href: "#faq" },
                { label: "Get a Quote", href: "#quote" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="relative hover:text-[#C9A449] transition-colors duration-200 group flex items-center"
                  >
                    <span className="absolute -left-5 h-px w-0 bg-[#C9A449] group-hover:w-3 transition-all duration-300 opacity-70" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="mt-8 lg:mt-8 lg:col-span-3">
            <p className="text-white/90 text-[12px] font-semibold tracking-[0.25em] uppercase mb-6 flex items-center gap-2">
              {/* <span className="h-px w-4 bg-[#C9A449] inline-block opacity-70" /> */}
              Contact
            </p>
            <ul className="space-y-5 text-sm">
              {[
                {
                  icon: <Mail size={13} />,
                  text: "info@modernmasonrygroup.ca",
                  href: "mailto:info@modernmasonrygroup.ca",
                },
                {
                  icon: <Phone size={13} />,
                  text: "+1 905-939-0695",
                  href: "tel:+19059390695",
                },
                {
                  icon: <MapPin size={13} />,
                  text: "7195 Highway 9, Schomberg, ON L0G 1T0",
                },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-white/40">
                  <span className="text-[#C9A449] mt-0.5 shrink-0 opacity-80">
                    {item.icon}
                  </span>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="hover:text-[#C9A449] transition-colors duration-200 leading-snug"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="leading-snug">{item.text}</span>
                  )}
                </li>
              ))}
              <li className="pt-1 border-t border-white/[0.06]">
                <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] mb-2">
                  Studio Hours
                </p>
                <p className="text-white/40 text-sm">
                  Mon – Fri &nbsp;7:30 am – 5:00 pm
                </p>
                <p className="text-white/40 text-sm">
                  Saturday &nbsp;&nbsp;8:00 am – 1:00 pm
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-16 pb-6">
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-8" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-white/20">
          <p className="tracking-wide">
            &copy; {new Date().getFullYear()} Modern Masonry Group Inc. All
            rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service"].map(
              (l) => (
                <a
                  key={l}
                  href="#"
                  className="hover:text-white/50 transition-colors duration-200 tracking-wide"
                >
                  {l}
                </a>
              ),
            )}
          </div>
        </div>
      </div>

      {/* SVG brand watermark */}
      <div
        className="relative z-10 w-full"
        style={{ height: "240px", marginTop: "-20px" }}
      >
        <TextHoverEffect text="Modern Masonry" />
      </div>

      <FooterBackgroundGradient />
    </footer>
  );
}
