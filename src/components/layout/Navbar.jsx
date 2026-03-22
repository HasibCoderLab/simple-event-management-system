import { useState } from "react";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard, Users, UtensilsCrossed,
  StickyNote, CheckSquare, Settings2, Menu, X,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/",         label: "ড্যাশবোর্ড", Icon: LayoutDashboard },
  { to: "/guests",   label: "মেহমান",      Icon: Users },
  { to: "/recipes",  label: "রেসিপি",       Icon: UtensilsCrossed },
  { to: "/notes",    label: "নোটস",         Icon: StickyNote },
  { to: "/todos",    label: "টু-ডু",        Icon: CheckSquare },
  { to: "/settings", label: "সেটিংস",      Icon: Settings2 },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 border-b"
      style={{
        background: "rgba(5,13,26,0.88)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderColor: "rgba(255,255,255,0.06)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <motion.div className="flex items-center gap-2.5" whileHover={{ scale: 1.04 }}>
          <motion.span
            className="text-2xl"
            animate={{ rotate: [0, 14, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            💍
          </motion.span>
          <div className="leading-none">
            <span className="text-white font-black text-base md:text-lg tracking-tight">অনুষ্ঠান</span>
            <span className="font-black text-base md:text-lg tracking-tight" style={{ color: "#f1a92a" }}>
              &nbsp;প্ল্যানার
            </span>
          </div>
        </motion.div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(({ to, label, Icon }) => (
            <NavLink key={to} to={to} end={to === "/"}>
              {({ isActive }) => (
                <motion.div
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    isActive ? "text-black" : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navPill"
                      className="absolute inset-0 bg-[#f1a92a] rounded-xl -z-10"
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    />
                  )}
                  <Icon size={13} />
                  {label}
                </motion.div>
              )}
            </NavLink>
          ))}
        </div>

        {/* Mobile toggle */}
        <motion.button
          className="md:hidden text-gray-400 hover:text-white transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
          whileTap={{ scale: 0.9 }}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </motion.button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden border-t overflow-hidden"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
          >
            <div className="p-3 grid grid-cols-3 gap-2">
              {NAV_ITEMS.map(({ to, label, Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  onClick={() => setMobileOpen(false)}
                >
                  {({ isActive }) => (
                    <motion.div
                      whileTap={{ scale: 0.92 }}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-[11px] font-black transition-all ${
                        isActive ? "bg-[#f1a92a] text-black" : "bg-white/5 text-gray-400"
                      }`}
                    >
                      <Icon size={18} />
                      {label}
                    </motion.div>
                  )}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
