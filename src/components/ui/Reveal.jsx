import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/**
 * Scroll-triggered reveal — animates IN when entering viewport,
 * animates OUT when leaving (once: false).
 *
 * Props:
 *   delay     — stagger delay (s)
 *   direction — "up" | "down" | "left" | "right"
 *   distance  — px to travel (default 55)
 *   duration  — animation duration in s (default 0.65)
 *   className — extra wrapper classes
 */
export default function Reveal({
  children,
  delay = 0,
  direction = "up",
  distance = 55,
  duration = 0.65,
  className = "",
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, amount: 0.12 });

  const axis  = direction === "left" || direction === "right" ? "x" : "y";
  const sign  = direction === "down" || direction === "right" ? -1 : 1;

  const hidden = {
    opacity: 0,
    [axis]: sign * distance,
    scale: 0.94,
    filter: "blur(4px)",
  };
  const visible = { opacity: 1, [axis]: 0, scale: 1, filter: "blur(0px)" };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{ hidden, visible }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
