import { motion } from "framer-motion";

export default function GlowOrbs() {
  const orbs = [
    {
      style: {
        top: "-180px", right: "-180px",
        width: 580, height: 580,
        background: "radial-gradient(circle, rgba(241,169,42,0.22) 0%, transparent 68%)",
      },
      animate: { scale: [1, 1.25, 1], opacity: [0.55, 1, 0.55] },
      duration: 7,
    },
    {
      style: {
        bottom: "-200px", left: "-200px",
        width: 680, height: 680,
        background: "radial-gradient(circle, rgba(20,184,166,0.18) 0%, transparent 70%)",
      },
      animate: { scale: [1.1, 1, 1.1], opacity: [0.4, 0.9, 0.4] },
      duration: 9,
    },
    {
      style: {
        top: "40%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: 460, height: 460,
        background: "radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)",
      },
      animate: { scale: [1, 1.35, 1], opacity: [0.3, 0.65, 0.3] },
      duration: 11,
    },
  ];

  return (
    <>
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="fixed rounded-full pointer-events-none z-0"
          style={orb.style}
          animate={orb.animate}
          transition={{ duration: orb.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </>
  );
}
