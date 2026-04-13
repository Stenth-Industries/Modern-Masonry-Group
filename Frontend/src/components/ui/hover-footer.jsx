import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

export const TextHoverEffect = ({ text, duration, className = "" }) => {
  const svgRef = useRef(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  useEffect(() => {
    if (svgRef.current) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({ cx: `${cxPercentage}%`, cy: `${cyPercentage}%` });
    }
  }, [cursor]);

  const sharedTextProps = {
    textAnchor: "middle",
    fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
    fontSize: "120",
    fontWeight: "300",
    letterSpacing: "8",
  };

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 1200 240"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className={`select-none uppercase cursor-pointer ${className}`}
    >
      <defs>
        <linearGradient
          id="textGradient"
          gradientUnits="userSpaceOnUse"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          {hovered && (
            <>
              <stop offset="0%"   stopColor="#C9A449" />
              <stop offset="25%"  stopColor="#f5e6b8" />
              <stop offset="55%"  stopColor="#e8c567" />
              <stop offset="85%"  stopColor="#C9A449" />
              <stop offset="100%" stopColor="#DDB95A" />
            </>
          )}
        </linearGradient>

        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="30%"
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
          transition={{ duration: duration ?? 0, ease: "easeOut" }}
        >
          <stop offset="0%"   stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>

        <mask id="textMask">
          <rect x="0" y="0" width="100%" height="100%" fill="url(#revealMask)" />
        </mask>
      </defs>

      {/* Ghost layer — faint outline visible on hover for depth */}
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        {...sharedTextProps}
        fill="transparent"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="0.6"
        style={{ opacity: hovered ? 1 : 0, transition: "opacity 0.4s ease" }}
      >
        {text}
      </text>

      {/* Animated draw-on layer — strokes in on load */}
      <motion.text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        {...sharedTextProps}
        fill="transparent"
        stroke="rgba(201,164,73,0.55)"
        strokeWidth="0.5"
        initial={{ strokeDashoffset: 2400, strokeDasharray: 2400 }}
        animate={{ strokeDashoffset: 0, strokeDasharray: 2400 }}
        transition={{ duration: 6, ease: "easeInOut" }}
      >
        {text}
      </motion.text>

      {/* Hover gradient reveal layer */}
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        {...sharedTextProps}
        fill="transparent"
        stroke="url(#textGradient)"
        strokeWidth="0.5"
        mask="url(#textMask)"
      >
        {text}
      </text>
    </svg>
  );
};

export const FooterBackgroundGradient = () => (
  <div
    className="absolute inset-0 z-0 pointer-events-none"
    style={{
      background:
        "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(201,164,73,0.07) 0%, transparent 65%)",
    }}
  />
);
