import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Home, ArrowLeft, Compass, Rocket,
  Satellite, AlertTriangle,
} from "lucide-react";

import ParticleField from "../components/background/ParticleField";
import GlowOrbs      from "../components/background/GlowOrbs";
import GridBg        from "../components/background/GridBg";

/* ─── Variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 60, filter: "blur(12px)", scale: 0.96 },
  visible: (i = 0) => ({
    opacity: 1, y: 0, filter: "blur(0px)", scale: 1,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.6, rotate: -10 },
  visible: (i = 0) => ({
    opacity: 1, scale: 1, rotate: 0,
    transition: { type: "spring", stiffness: 200, damping: 18, delay: i * 0.1 },
  }),
};

/* ─── Floating debris particle ─── */
const Debris = ({ x, y, size, dur, delay, shape }) => (
  <motion.div
    className="fixed pointer-events-none z-0"
    style={{ left: `${x}%`, top: `${y}%` }}
    animate={{
      y: [0, -40, 0],
      x: [0, shape === "left" ? -20 : 20, 0],
      rotate: [0, 180, 360],
      opacity: [0.15, 0.4, 0.15],
    }}
    transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
  >
    {shape === "circle"
      ? <div className="rounded-full bg-[#f1a92a]/30" style={{ width: size, height: size }} />
      : shape === "square"
        ? <div className="rounded-sm bg-teal-500/20 rotate-45" style={{ width: size, height: size }} />
        : <div className="bg-white/10" style={{ width: size, height: size / 4, borderRadius: 2 }} />
    }
  </motion.div>
);

/* ─── Glitch text effect ─── */
const GlitchText = ({ text, className }) => {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    const trigger = () => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 400);
    };
    const iv = setInterval(trigger, 3000);
    return () => clearInterval(iv);
  }, []);

  return (
    <span className={`relative inline-block ${className}`}>
      {text}
      {glitching && (
        <>
          <span
            className="absolute inset-0 text-teal-400 pointer-events-none"
            style={{ clipPath: "inset(30% 0 50% 0)", transform: "translateX(-4px)", opacity: 0.7 }}
          >{text}</span>
          <span
            className="absolute inset-0 text-[#f1a92a] pointer-events-none"
            style={{ clipPath: "inset(55% 0 10% 0)", transform: "translateX(4px)", opacity: 0.7 }}
          >{text}</span>
        </>
      )}
    </span>
  );
};

/* ─── Orbiting satellite ─── */
const SatelliteOrbit = () => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ width: 160, height: 160, top: "50%", left: "50%", marginTop: -80, marginLeft: -80 }}
    animate={{ rotate: 360 }}
    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
  >
    <motion.div
      className="absolute -top-3 left-1/2 -translate-x-1/2"
      animate={{
        filter: [
          "drop-shadow(0 0 4px #14b8a6)",
          "drop-shadow(0 0 14px #14b8a6)",
          "drop-shadow(0 0 4px #14b8a6)",
        ],
      }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <Satellite size={20} className="text-teal-400" />
    </motion.div>
  </motion.div>
);

/* ─── Cyber Button (local, standalone) ─── */
const CyberBtn = ({ onClick, children, primary = true }) => (
  <motion.button
    onClick={onClick}
    whileHover={{
      scale: 1.06, y: -4,
      boxShadow: primary
        ? "0 16px 40px rgba(241,169,42,0.35)"
        : "0 16px 40px rgba(20,184,166,0.3)",
    }}
    whileTap={{ scale: 0.95 }}
    className={`relative px-7 py-4 font-black text-sm md:text-base cursor-pointer overflow-hidden flex items-center gap-2
      ${primary
        ? "bg-[#f1a92a] text-black"
        : "bg-transparent text-teal-400 border-2 border-teal-400"}`}
    style={{
      clipPath: primary
        ? "polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px))"
        : "polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))",
    }}
  >
    <motion.span
      animate={{ x: ["-100%", "200%"] }}
      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
    />
    <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/40" />
    <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/40" />
    <span className="relative z-10 flex items-center gap-2">{children}</span>
  </motion.button>
);

/* ══════════════════════════════════════
   MAIN 404 PAGE
══════════════════════════════════════ */
const NotFound = () => {
  const navigate  = useNavigate();
  const pageRef   = useRef(null);
  const [dots, setDots] = useState("");

  const { scrollYProgress } = useScroll({ target: pageRef, offset: ["start end", "end start"] });
  const scrollBar = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  const bgY       = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const { scrollY } = useScroll();
  const heroY  = useTransform(scrollY, [0, 400], [0, -80]);
  const heroOp = useTransform(scrollY, [0, 380], [1, 0]);
  const heroSc = useTransform(scrollY, [0, 380], [1, 0.9]);

  /* animated ellipsis */
  useEffect(() => {
    const iv = setInterval(() => setDots((d) => (d.length >= 3 ? "" : d + ".")), 500);
    return () => clearInterval(iv);
  }, []);

  /* floating debris config */
  const debris = [
    { x: 5,  y: 15, size: 12, dur: 7,  delay: 0,   shape: "circle" },
    { x: 90, y: 20, size: 8,  dur: 9,  delay: 1,   shape: "square" },
    { x: 15, y: 75, size: 16, dur: 8,  delay: 2,   shape: "circle" },
    { x: 80, y: 70, size: 10, dur: 11, delay: 0.5, shape: "bar"    },
    { x: 50, y: 10, size: 6,  dur: 6,  delay: 1.5, shape: "square" },
    { x: 30, y: 85, size: 14, dur: 10, delay: 3,   shape: "circle" },
    { x: 70, y: 50, size: 8,  dur: 8,  delay: 2.5, shape: "bar"    },
    { x: 3,  y: 50, size: 18, dur: 13, delay: 0.8, shape: "square" },
    { x: 95, y: 55, size: 10, dur: 7,  delay: 4,   shape: "circle" },
    { x: 60, y: 90, size: 12, dur: 9,  delay: 1.2, shape: "bar"    },
  ];

  return (
    <div
      ref={pageRef}
      className="min-h-screen w-full text-white flex flex-col items-center justify-center
        px-4 pt-32 md:pt-40 pb-20 relative overflow-hidden"
      style={{ background: "#050d1a" }}
    >
      {/* ── Backgrounds ── */}
      <GridBg />
      <GlowOrbs />
      <ParticleField count={30} />

      {/* ── Floating debris ── */}
      {debris.map((d, i) => <Debris key={i} {...d} />)}

      {/* ── Scroll progress bar ── */}
      <motion.div
        style={{
          scaleX: scrollBar,
          transformOrigin: "left",
          background: "linear-gradient(90deg, #f1a92a, #14b8a6)",
        }}
        className="fixed top-0 left-0 right-0 h-[3px] z-50"
      />

      {/* ── Parallax bg layer ── */}
      <motion.div style={{ y: bgY }} className="fixed inset-0 pointer-events-none z-0" />

      {/* ══ MAIN CONTENT ══ */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto gap-8">

        {/* ── STATUS BADGE ── */}
        <motion.div
          custom={0} variants={fadeUp} initial="hidden" animate="visible"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border overflow-hidden relative
            border-red-500/40 bg-red-500/10 text-red-400 text-xs font-black uppercase tracking-widest backdrop-blur-sm"
        >
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-transparent via-red-400/15 to-transparent"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
          />
          <motion.span
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-red-400 inline-block"
          />
          <AlertTriangle size={12} />
          ERROR 404 — PAGE NOT FOUND
        </motion.div>

        {/* ── BIG 404 ── */}
        <motion.div
          custom={1} variants={fadeUp} initial="hidden" animate="visible"
          className="relative select-none"
        >
          {/* ghost 404 behind */}
          <motion.div
            animate={{ opacity: [0.04, 0.09, 0.04] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10"
            style={{ fontSize: "clamp(180px, 30vw, 320px)", fontWeight: 900, lineHeight: 1 }}
          >
            <span style={{ WebkitTextStroke: "2px rgba(255,255,255,0.3)", color: "transparent" }}>
              404
            </span>
          </motion.div>

          {/* main 404 */}
          <div
            className="flex items-center gap-2 md:gap-4"
            style={{ fontSize: "clamp(80px, 18vw, 180px)", fontWeight: 900, lineHeight: 1 }}
          >
            {["4", "0", "4"].map((ch, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
                animate={{
                  opacity: 1, scale: 1, rotate: 0,
                  y: [0, i % 2 === 0 ? -12 : -8, 0],
                  filter: [
                    i === 1 ? "drop-shadow(0 0 0px #14b8a6)"  : "drop-shadow(0 0 0px #f1a92a)",
                    i === 1 ? "drop-shadow(0 0 30px #14b8a6)" : "drop-shadow(0 0 30px #f1a92a)",
                    i === 1 ? "drop-shadow(0 0 0px #14b8a6)"  : "drop-shadow(0 0 0px #f1a92a)",
                  ],
                }}
                transition={{
                  opacity: { duration: 0.5, delay: i * 0.12 },
                  scale:   { type: "spring", stiffness: 200, damping: 18, delay: i * 0.12 },
                  rotate:  { type: "spring", stiffness: 200, damping: 18, delay: i * 0.12 },
                  y:       { duration: 3, delay: i * 0.4 + 0.5, repeat: Infinity, ease: "easeInOut" },
                  filter:  { duration: 3, delay: i * 0.4 + 0.5, repeat: Infinity, ease: "easeInOut" },
                }}
                whileHover={{ scale: 1.15, rotate: i === 1 ? 10 : 5 }}
                className={`inline-block relative cursor-default ${i === 1 ? "text-teal-500" : "text-[#f1a92a]"}`}
                style={{
                  textShadow: i === 1
                    ? "0 0 60px rgba(20,184,166,0.5)"
                    : "0 0 60px rgba(241,169,42,0.5)",
                }}
              >
                <GlitchText text={ch} />

                {/* orbit ring around "0" */}
                {i === 1 && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <SatelliteOrbit />
                    <motion.div
                      className="absolute rounded-full"
                      style={{ width: 160, height: 160, border: "1.5px dashed rgba(20,184,166,0.3)" }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                )}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* ── HEADING ── */}
        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className="space-y-3">
          <h2 className="text-2xl md:text-4xl font-black text-white leading-tight">
            রাস্তা ভুল করেছেন{" "}
            <motion.span
              className="text-[#f1a92a] inline-block"
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              style={{ textShadow: "0 0 30px rgba(241,169,42,0.4)" }}
            >
              ভাই!
            </motion.span>
          </h2>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-32 h-[3px] mx-auto rounded-full origin-left"
            style={{ background: "linear-gradient(90deg, #f1a92a, #14b8a6)" }}
          />
        </motion.div>

        {/* ── DESCRIPTION ── */}
        <motion.p
          custom={4} variants={fadeUp} initial="hidden" animate="visible"
          className="text-gray-400 text-base md:text-lg max-w-md leading-relaxed font-medium"
        >
          আপনি যে পেজটি খুঁজছেন সেটি খুঁজে পাওয়া যায়নি।
          সম্ভবত এটি সরিয়ে ফেলা হয়েছে অথবা{" "}
          <motion.span
            className="text-[#f1a92a] font-bold"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            লিংকটি ভুল
          </motion.span>
          {" "}।
        </motion.p>

        {/* ── TERMINAL HINT ── */}
        <motion.div
          custom={5} variants={scaleIn} initial="hidden" animate="visible"
          className="w-full max-w-sm rounded-2xl p-4 border relative overflow-hidden backdrop-blur-md text-left"
          style={{
            background: "rgba(5,13,26,0.85)",
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          <motion.div
            animate={{ x: ["-100%", "200%"], opacity: [0, 0.5, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-500/10 to-transparent pointer-events-none"
          />
          <div className="flex items-center gap-2 mb-3">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-gray-500 text-xs ml-2 font-mono">event-planner ~ terminal</span>
          </div>
          <div className="font-mono text-sm space-y-1">
            <div className="text-green-400">
              <span className="text-teal-400">➜</span>{" "}
              <span className="text-[#f1a92a]">~</span> cd{" "}
              <motion.span
                className="text-white"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                /page-not-found
              </motion.span>
            </div>
            <div className="text-red-400">
              <span className="text-gray-500">error:</span> No such directory
            </div>
            <div className="text-gray-400 flex items-center gap-1">
              <span className="text-teal-400">➜</span>{" "}
              <span className="text-[#f1a92a]">~</span>
              <motion.span
                animate={{ opacity: [0, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
                className="inline-block w-2 h-4 bg-teal-400 ml-1 align-middle"
              />
            </div>
          </div>
        </motion.div>

        {/* ── LOADING BAR ── */}
        <motion.div
          custom={6} variants={fadeUp} initial="hidden" animate="visible"
          className="w-full max-w-sm"
        >
          <div className="flex justify-between text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
            <span>Searching for page{dots}</span>
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-red-400"
            >
              NOT FOUND
            </motion.span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
            <motion.div
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="h-full w-1/3 rounded-full relative"
              style={{ background: "linear-gradient(90deg, #f1a92a, #14b8a6, #f1a92a)" }}
            >
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* ── ACTION BUTTONS ── */}
        <motion.div
          custom={7} variants={fadeUp} initial="hidden" animate="visible"
          className="flex flex-wrap gap-4 justify-center"
        >
          <CyberBtn onClick={() => navigate(-1)} primary={false}>
            <motion.span
              animate={{ x: [0, -4, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              <ArrowLeft size={16} />
            </motion.span>
            পিছনে যান
          </CyberBtn>

          <CyberBtn onClick={() => navigate("/")} primary>
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <Home size={16} />
            </motion.span>
            হোম পেজ ফিরুন
          </CyberBtn>
        </motion.div>

        {/* ── FLOATING COMPASS ── */}
        <motion.div custom={8} variants={scaleIn} initial="hidden" animate="visible" className="mt-4">
          <motion.div
            animate={{
              rotate: [0, 360],
              filter: [
                "drop-shadow(0 0 0px #f1a92a)",
                "drop-shadow(0 0 20px #f1a92a)",
                "drop-shadow(0 0 0px #f1a92a)",
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="text-[#f1a92a] opacity-30"
          >
            <Compass size={56} />
          </motion.div>
        </motion.div>

        {/* ── BOTTOM TAGLINE ── */}
        <motion.div
          custom={9} variants={fadeUp} initial="hidden" animate="visible"
          className="text-xs tracking-[0.3em] uppercase text-gray-600"
        >
          <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 3, repeat: Infinity }}>
            ✦ অনুষ্ঠান প্ল্যানার — গেস্ট ম্যানেজমেন্ট সিস্টেম ✦
          </motion.span>
        </motion.div>

      </div>
    </div>
  );
};

export default NotFound;