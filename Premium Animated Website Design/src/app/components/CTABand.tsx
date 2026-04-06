import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

interface CTABandProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  variant?: 'brick' | 'charcoal';
}

export function CTABand({ title, description, buttonText, buttonLink, variant = 'brick' }: CTABandProps) {
  const bgColor = variant === 'brick' ? 'var(--brick)' : 'var(--charcoal)';

  return (
    <section className="py-24 px-6" style={{ backgroundColor: bgColor }}>
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          className="text-white text-5xl mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {title}
        </motion.h2>
        <motion.p
          className="text-white/90 text-xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          {description}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Link to={buttonLink}>
            <motion.button
              className="px-10 py-5 bg-white text-[var(--charcoal)] rounded-full text-lg flex items-center gap-2 mx-auto group border-4 border-white hover:border-[var(--sand)] transition-all shadow-xl"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: ["0 10px 30px rgba(0,0,0,0.2)", "0 15px 40px rgba(0,0,0,0.3)", "0 10px 30px rgba(0,0,0,0.2)"],
              }}
              transition={{
                boxShadow: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            >
              {buttonText}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
