import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function FloatingCTA() {
  return (
    <motion.a
      href="#quote"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-8 right-8 z-50 flex items-center gap-2 bg-[var(--brass)] text-black px-5 py-3 rounded-full font-bold text-sm uppercase tracking-wider shadow-2xl hover:bg-[var(--brass-light)] transition-colors"
    >
      Free Estimate <ArrowUpRight size={14} />
    </motion.a>
  );
}
