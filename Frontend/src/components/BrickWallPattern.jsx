import React, { useMemo } from "react";

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [128, 128, 128];
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ];
}

function clamp(val) {
  return Math.max(0, Math.min(255, val));
}

function generateVariants(hex) {
  const [r, g, b] = hexToRgb(hex);
  return [
    `rgb(${clamp(r - 18)},${clamp(g - 16)},${clamp(b - 12)})`,
    `rgb(${r},${g},${b})`,
    `rgb(${clamp(r + 14)},${clamp(g + 12)},${clamp(b + 10)})`,
    `rgb(${clamp(r - 8)},${clamp(g - 10)},${clamp(b - 6)})`,
    `rgb(${clamp(r + 22)},${clamp(g + 18)},${clamp(b + 14)})`,
    `rgb(${clamp(r - 24)},${clamp(g - 20)},${clamp(b - 16)})`,
    `rgb(${clamp(r + 8)},${clamp(g + 6)},${clamp(b + 4)})`,
  ];
}

export function BrickWallPattern({
  colorHex,
  rows = 5,
  className = "",
  animated = false,
}) {
  const variants = useMemo(() => generateVariants(colorHex), [colorHex]);

  const getVariant = (seed) => variants[Math.abs(seed) % variants.length];

  return (
    <div
      className={`w-full h-full ${className}`}
      style={{
        background: "var(--obsidian)",
        padding: "4px",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        boxSizing: "border-box",
      }}
    >
      {Array.from({ length: rows }).map((_, rowIdx) => {
        const isOffset = rowIdx % 2 === 1;
        return (
          <div
            key={rowIdx}
            style={{
              display: "flex",
              gap: "4px",
              flex: 1,
            }}
          >
            {isOffset ? (
              <>
                <div
                  style={{
                    flex: 0.5,
                    background: getVariant(rowIdx * 7 + 1),
                    borderRadius: "2px",
                    transition: animated ? "background 0.3s ease" : undefined,
                  }}
                />
                <div
                  style={{
                    flex: 1,
                    background: getVariant(rowIdx * 7 + 2),
                    borderRadius: "2px",
                    transition: animated ? "background 0.3s ease" : undefined,
                  }}
                />
                <div
                  style={{
                    flex: 1,
                    background: getVariant(rowIdx * 7 + 3),
                    borderRadius: "2px",
                    transition: animated ? "background 0.3s ease" : undefined,
                  }}
                />
                <div
                  style={{
                    flex: 0.5,
                    background: getVariant(rowIdx * 7 + 4),
                    borderRadius: "2px",
                    transition: animated ? "background 0.3s ease" : undefined,
                  }}
                />
              </>
            ) : (
              <>
                <div
                  style={{
                    flex: 1,
                    background: getVariant(rowIdx * 7),
                    borderRadius: "2px",
                    transition: animated ? "background 0.3s ease" : undefined,
                  }}
                />
                <div
                  style={{
                    flex: 1,
                    background: getVariant(rowIdx * 7 + 5),
                    borderRadius: "2px",
                    transition: animated ? "background 0.3s ease" : undefined,
                  }}
                />
                <div
                  style={{
                    flex: 1,
                    background: getVariant(rowIdx * 7 + 6),
                    borderRadius: "2px",
                    transition: animated ? "background 0.3s ease" : undefined,
                  }}
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
