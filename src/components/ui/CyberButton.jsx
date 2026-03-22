import { motion } from "framer-motion";

const VARIANTS = {
  gold:   { bg: "#f1a92a",    text: "text-black",    border: "#f1a92a", shimmer: "via-white/30"      },
  teal:   { bg: "transparent", text: "text-teal-400", border: "#14b8a6", shimmer: "via-teal-400/20"  },
  rose:   { bg: "transparent", text: "text-rose-400", border: "#f472b6", shimmer: "via-rose-400/20"  },
  purple: { bg: "transparent", text: "text-purple-400", border: "#a78bfa", shimmer: "via-purple-400/20" },
  sky:    { bg: "transparent", text: "text-sky-400",  border: "#38bdf8", shimmer: "via-sky-400/20"   },
};

/**
 * Polygon-clipped cyber button.
 *
 * Props:
 *   variant  — "gold" | "teal" | "rose" | "purple" | "sky"
 *   small    — compact size
 *   disabled — grayed out
 *   onClick
 */
export default function CyberButton({
  children,
  onClick,
  variant = "gold",
  small = false,
  disabled = false,
}) {
  const v    = VARIANTS[variant] || VARIANTS.gold;
  const size = small ? "px-4 py-2 text-[11px]" : "px-7 py-3 text-sm";

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.05, y: -3 }}
      whileTap={disabled ? {}  : { scale: 0.96 }}
      className={`relative ${size} font-black cursor-pointer overflow-hidden border-2 ${v.text} ${
        disabled ? "opacity-40 cursor-not-allowed" : ""
      }`}
      style={{
        backgroundColor: v.bg,
        borderColor: v.border,
        clipPath:
          "polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))",
      }}
    >
      {/* Shimmer sweep */}
      {!disabled && (
        <motion.span
          className={`absolute inset-0 bg-gradient-to-r from-transparent ${v.shimmer} to-transparent`}
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 2 }}
        />
      )}

      {/* Corner accents */}
      <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-white/30" />
      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-white/30" />

      <span className="relative z-10 flex items-center justify-center gap-2 whitespace-nowrap">
        {children}
      </span>
    </motion.button>
  );
}
