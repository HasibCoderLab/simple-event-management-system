import { motion } from "framer-motion";
import { useAnimNum } from "../../hooks/useAnimNum";

/**
 * Animated stat card with progress bar.
 *
 * Props:
 *   emoji  — emoji string
 *   value  — numeric value
 *   label  — description text
 *   color  — hex accent color
 *   glow   — hex for shadow (defaults to color)
 *   delay  — animation stagger delay (s)
 *   total  — optional total for progress bar
 */
export default function StatChip({
  emoji,
  value,
  label,
  color = "#f1a92a",
  glow,
  delay = 0,
  total = 0,
}) {
  const displayVal = useAnimNum(value);
  const actualGlow = glow || color;
  const pct        = total > 0 ? (value / total) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: 24 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ delay, type: "spring", stiffness: 180, damping: 18 }}
      whileHover={{ y: -6, scale: 1.04 }}
      className="relative overflow-hidden rounded-2xl p-5"
      style={{
        background: "rgba(15,23,42,0.75)",
        backdropFilter: "blur(20px)",
        border: `1px solid ${actualGlow}22`,
        boxShadow: `0 4px 28px ${actualGlow}12`,
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 h-[2px] w-12 rounded-full"
        style={{ background: color }}
      />

      <motion.div
        className="text-3xl mb-2"
        animate={{ scale: [1, 1.18, 1] }}
        transition={{ duration: 2.8, repeat: Infinity, delay }}
      >
        {emoji}
      </motion.div>

      <div
        className="text-3xl font-black leading-none mb-1"
        style={{ color, textShadow: `0 0 20px ${actualGlow}55` }}
      >
        {displayVal}
      </div>

      <div className="text-xs text-gray-400 font-semibold">{label}</div>

      {/* Progress bar */}
      {total > 0 && (
        <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: color }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(pct, 100)}%` }}
            transition={{ duration: 1.2, delay: delay + 0.2, ease: "easeOut" }}
          />
        </div>
      )}
    </motion.div>
  );
}
