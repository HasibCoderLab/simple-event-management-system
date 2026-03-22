import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import GlassCard from "./GlassCard";

/**
 * Animated modal with spring entry + backdrop blur.
 *
 * Props:
 *   open    — boolean
 *   onClose — handler
 *   title   — heading string
 *   glow    — accent color
 */
export default function Modal({ open, onClose, title, glow = "#f1a92a", children }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/65 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.75, y: 50, opacity: 0 }}
            animate={{ scale: 1,    y: 0,  opacity: 1 }}
            exit={{    scale: 0.75, y: 50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
          >
            <GlassCard className="p-6" glow={glow}>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3
                  className="text-xl font-black text-white"
                  style={{ textShadow: `0 0 20px ${glow}55` }}
                >
                  {title}
                </h3>
                <motion.button
                  onClick={onClose}
                  whileHover={{ rotate: 90, scale: 1.2 }}
                  whileTap={{ scale: 0.85 }}
                  className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                  <X size={16} />
                </motion.button>
              </div>

              {children}
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
