import { motion } from "motion/react";
import { Link } from "react-router";
import { Home, Search } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="pt-32 pb-24 px-6 bg-[var(--off-white)] min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center">
        {/* Brick-style 404 */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
            {/* First row - 4 */}
            <div className="col-span-1 space-y-2">
              <motion.div
                className="h-16 bg-[var(--brick)] rounded-lg"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              />
              <motion.div
                className="h-16 bg-[var(--brick)] rounded-lg"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              />
              <motion.div
                className="h-16 bg-[var(--brick)] rounded-lg"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              />
            </div>

            {/* Middle - 0 */}
            <div className="col-span-1">
              <motion.div
                className="h-full bg-transparent border-8 border-[var(--brick)] rounded-full"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
              />
            </div>

            {/* Last - 4 */}
            <div className="col-span-1 space-y-2">
              <motion.div
                className="h-16 bg-[var(--brick)] rounded-lg"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              />
              <motion.div
                className="h-16 bg-[var(--brick)] rounded-lg"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              />
              <motion.div
                className="h-16 bg-[var(--brick)] rounded-lg"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h1 className="text-5xl mb-6">Page Not Found</h1>
          <p className="text-[var(--slate)] text-xl mb-12">
            Looks like this page has been... paved over. Let's get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <motion.button
                className="px-8 py-4 bg-[var(--accent)] text-white rounded-full flex items-center gap-2 hover:shadow-xl transition-all"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Home className="w-5 h-5" />
                Back to Home
              </motion.button>
            </Link>

            <Link to="/search">
              <motion.button
                className="px-8 py-4 bg-white border-2 border-[var(--charcoal)] text-[var(--charcoal)] rounded-full flex items-center gap-2 hover:bg-[var(--charcoal)] hover:text-white transition-all"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search className="w-5 h-5" />
                Search Products
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
