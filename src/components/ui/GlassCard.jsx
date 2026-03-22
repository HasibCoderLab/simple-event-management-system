import { motion } from "framer-motion";

/**
 * Glassmorphism card with animated hover glow.
 *
 * Props:
 *   glow      — hex color for box-shadow accent
 *   className — extra Tailwind classes
 *   onClick   — optional click handler
 */
export default function GlassCard({ children, className = "", glow = "#14b8a6", onClick }) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{
        y: -5,
        boxShadow: `0 24px 64px ${glow}28, 0 0 0 1px ${glow}18`,
      }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
      className={`relative overflow-hidden rounded-2xl ${className} ${onClick ? "cursor-pointer" : ""}`}
      style={{
        background: "rgba(15,23,42,0.72)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: `0 4px 24px ${glow}10`,
      }}
    >
      {/* Inner shimmer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%)",
        }}
      />
      {children}
    </motion.div>
  );
}
