import { motion, useScroll } from "motion/react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <>
      {/* Top progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[var(--accent)] origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Circular scroll indicator */}
      <motion.div
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full border-2 border-[var(--accent)] flex items-center justify-center z-40 cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <svg className="w-6 h-6 -rotate-90" viewBox="0 0 24 24">
          <motion.circle
            cx="12"
            cy="12"
            r="10"
            stroke="var(--accent)"
            strokeWidth="2"
            fill="none"
            style={{
              pathLength: scrollYProgress,
            }}
          />
        </svg>
      </motion.div>
    </>
  );
}
