import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  const [isHovering, setIsHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const move = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const over = (e) => {
      const t = e.target;
      const interactive =
        t.tagName === "BUTTON" ||
        t.tagName === "A" ||
        t.closest("button") ||
        t.closest("a") ||
        t.classList.contains("cursor-pointer");
      setIsHovering(!!interactive);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [cursorX, cursorY, visible]);

  if (!visible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 border border-[var(--brass)] rounded-full pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center"
      style={{ translateX: cursorXSpring, translateY: cursorYSpring, left: -16, top: -16 }}
      animate={{
        scale: isHovering ? 2.5 : 1,
        backgroundColor: isHovering ? "rgba(201,164,73,0.2)" : "rgba(201,164,73,0)",
      }}
      transition={{ duration: 0.15 }}
    >
      <div className="w-1 h-1 bg-[var(--brass)] rounded-full" />
    </motion.div>
  );
}
