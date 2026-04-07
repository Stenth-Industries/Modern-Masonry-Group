import { useEffect, useRef } from "react";

// Confirmed brand logos from public/images/
const brands = [
  { file: "Logo-01png.png",   name: "Brampton Brick" },
  { file: "Logo-03.png",      name: "Canada Brick" },
  { file: "Logo-04.png",      name: "CSI" },
  { file: "Logo-05.png",      name: "Arriscraft" },
  { file: "Logo-06.png",      name: "Permacon" },
  { file: "Logo-07.png",      name: "Ontario Stone Veneers" },
  { file: "Logo-08.png",      name: "Rinox" },
  { file: "Logo-09.png",      name: "Stonerox" },
  { file: "Logo-10.png",      name: "Pialux" },
  { file: "Untitled-1.png",   name: "Stonepark" },
  { file: "Santerra_black-lettering-gold-star-with-white-background.png", name: "Santerra" },
  { file: "200x55-1.png",     name: "STONEarch" },
];

// Duplicate for seamless loop
const loopItems = [...brands, ...brands];

export function BrandCarousel() {
  const isPaused = useRef(false);

  return (
    <div
      style={{
        // width: "100%",
        overflow: "hidden",
        position: "relative",
        background: "#fff",
        borderTop: "1px solid rgba(0,0,0,0.07)",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
        padding: "44px 0",
        /* Full viewport width regardless of parent container */
        width: "100vw",
        marginLeft: "calc(50% - 50vw)",
      }}
    >
      {/* ── CSS keyframe injected inline ────────────────────── */}
      <style>{`
        @keyframes ticker-ltr {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .brand-track {
          display: flex;
          align-items: center;
          /* two sets side-by-side = 100% of track width */
          width: max-content;
          animation: ticker-ltr 36s linear infinite;
          will-change: transform;
        }
        .brand-track:hover {
          animation-play-state: paused;
        }
        .brand-logo {
          height: 64px;
          width: auto;
          max-width: 190px;
          object-fit: contain;
          display: block;
          filter: grayscale(1) opacity(0.55);
          transition: filter 0.3s ease, transform 0.3s ease;
          user-select: none;
          pointer-events: none;
        }
        .brand-item:hover .brand-logo {
          filter: grayscale(0) opacity(1);
          transform: scale(1.1);
        }
      `}</style>

      {/* Left fade */}
      <div style={{
        position: "absolute", top: 0, left: 0, bottom: 0, width: 120,
        background: "linear-gradient(to right, #fff 5%, transparent)",
        zIndex: 2, pointerEvents: "none",
      }} />
      {/* Right fade */}
      <div style={{
        position: "absolute", top: 0, right: 0, bottom: 0, width: 120,
        background: "linear-gradient(to left, #fff 5%, transparent)",
        zIndex: 2, pointerEvents: "none",
      }} />

      {/* Scrolling track — left-to-right: starts at -50% (left) and slide to 0 (right) */}
      <div className="brand-track">
        {loopItems.map((brand, i) => (
          <div
            key={i}
            className="brand-item"
            title={brand.name}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 64px",
              flexShrink: 0,
              height: 96,
              cursor: "default",
            }}
          >
            <img
              className="brand-logo"
              src={`/images/${brand.file}`}
              alt={brand.name}
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
