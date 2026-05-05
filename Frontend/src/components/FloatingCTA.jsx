import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function FloatingCTA() {
  const { scrollY } = useScroll();
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const u = scrollY.on("change", (v) => setVis(v > window.innerHeight * 0.8));
    return () => u();
  }, [scrollY]);

  return (
    <AnimatePresence>
      {vis && (
        <motion.a
          href="#quote"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-8 right-8 z-50 flex items-center gap-2 bg-[var(--brass)] text-black px-5 py-3 rounded-full font-bold text-sm uppercase tracking-wider shadow-2xl hover:bg-[var(--brass-light)] transition-colors"
        >
          Free Estimate <ArrowUpRight size={14} />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
