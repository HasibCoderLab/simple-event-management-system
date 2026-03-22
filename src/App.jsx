import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { EventProvider } from "./context/EventContext";

// Layout
import Navbar    from "./components/layout/Navbar";
import BottomNav from "./components/layout/BottomNav";

// Background
import ParticleField from "./components/background/ParticleField";
import GlowOrbs      from "./components/background/GlowOrbs";
import GridBg        from "./components/background/GridBg";

// Pages
import Dashboard from "./pages/Dashboard";
import Guests    from "./pages/Guests";
import Recipes   from "./pages/Recipes";
import Notes     from "./pages/Notes";
import TodoList  from "./pages/TodoList";
import Settings  from "./pages/Settings";
import NotFound from "./pages/NotFound";

// ── Page transition wrapper ──────────────────────────────────────────────────
function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.97, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0,  scale: 1,    filter: "blur(0px)" }}
      exit={{    opacity: 0, y: -28, scale: 0.97, filter: "blur(6px)" }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ── Animated routes ───────────────────────────────────────────────────────────
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"         element={<PageTransition><Dashboard /></PageTransition>} />
        <Route path="/guests"   element={<PageTransition><Guests    /></PageTransition>} />
        <Route path="/recipes"  element={<PageTransition><Recipes   /></PageTransition>} />
        <Route path="/notes"    element={<PageTransition><Notes     /></PageTransition>} />
        <Route path="/todos"    element={<PageTransition><TodoList  /></PageTransition>} />
        <Route path="/settings" element={<PageTransition><Settings  /></PageTransition>} />
       <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />


      </Routes>
    </AnimatePresence>
  );
}

// ── Root App ──────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <EventProvider>
        <div
          className="min-h-screen text-white"
          style={{
            background: "#050d1a",
            fontFamily: "'Hind Siliguri', 'SolaimanLipi', sans-serif",
          }}
        >
          {/* ── Fixed background layers ── */}
          <GridBg />
          <GlowOrbs />
          <ParticleField />

          {/* ── Navigation ── */}
          <Navbar />
          <BottomNav />

          {/* ── Main content ── */}
          <main className="relative z-10 max-w-5xl mx-auto px-4 pt-24 pb-28 md:pb-12">
            <AnimatedRoutes />
          </main>
        </div>
      </EventProvider>
    </BrowserRouter>
  );
}
