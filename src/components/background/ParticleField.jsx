import { useMemo } from "react";
import { motion } from "framer-motion";

const COLORS = ["#f1a92a", "#14b8a6", "#a78bfa", "#f472b6", "#38bdf8"];

export default function ParticleField({ count = 55 }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        dur: Math.random() * 9 + 5,
        delay: Math.random() * 7,
        opacity: Math.random() * 0.22 + 0.04,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        xDrift: (Math.random() - 0.5) * 30,
      })),
    [count]
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            opacity: p.opacity,
            filter: `blur(${p.size > 3 ? 1 : 0}px)`,
          }}
          animate={{
            y: [0, -45, 0],
            x: [0, p.xDrift, 0],
            opacity: [p.opacity * 0.2, p.opacity, p.opacity * 0.2],
            scale: [1, 1.9, 1],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
