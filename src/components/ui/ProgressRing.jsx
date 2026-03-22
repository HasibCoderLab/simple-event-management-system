import { motion } from "framer-motion";

/**
 * Animated SVG donut progress ring.
 *
 * Props:
 *   value  — current count
 *   total  — max count
 *   color  — stroke color (default "#f1a92a")
 *   size   — svg size px  (default 110)
 *   label  — center label (default shows %)
 */
export default function ProgressRing({
  value = 0,
  total = 1,
  color = "#f1a92a",
  size  = 110,
  label,
}) {
  const r     = (size / 2) * 0.72;
  const circ  = 2 * Math.PI * r;
  const pct   = total > 0 ? Math.min(value / total, 1) : 0;
  const offset = circ * (1 - pct);
  const cx    = size / 2;
  const cy    = size / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Track */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={size * 0.09}
      />

      {/* Filled arc */}
      <motion.circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke={color}
        strokeWidth={size * 0.09}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        style={{ transformOrigin: "50% 50%", transform: "rotate(-90deg)" }}
      />

      {/* Glow layer */}
      <motion.circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke={color}
        strokeWidth={size * 0.04}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeOpacity={0.25}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        style={{
          transformOrigin: "50% 50%",
          transform: "rotate(-90deg)",
          filter: "blur(4px)",
        }}
      />

      {/* Center text */}
      <text
        x={cx} y={cy + size * 0.06}
        textAnchor="middle"
        fill={color}
        fontSize={size * 0.18}
        fontWeight="900"
        fontFamily="'Hind Siliguri', sans-serif"
      >
        {label ?? `${Math.round(pct * 100)}%`}
      </text>
    </svg>
  );
}
