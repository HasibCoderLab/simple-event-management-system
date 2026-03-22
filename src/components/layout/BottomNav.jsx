import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, UtensilsCrossed,
  StickyNote, CheckSquare, Settings2,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/",         label: "হোম",    Icon: LayoutDashboard },
  { to: "/guests",   label: "মেহমান", Icon: Users },
  { to: "/recipes",  label: "রেসিপি", Icon: UtensilsCrossed },
  { to: "/notes",    label: "নোটস",   Icon: StickyNote },
  { to: "/todos",    label: "কাজ",    Icon: CheckSquare },
  { to: "/settings", label: "সেটিংস", Icon: Settings2 },
];

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 md:hidden z-40 border-t"
      style={{
        background: "rgba(5,13,26,0.95)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderColor: "rgba(255,255,255,0.07)",
      }}
    >
      <div className="flex">
        {NAV_ITEMS.map(({ to, label, Icon }) => (
          <NavLink key={to} to={to} end={to === "/"} className="flex-1">
            {({ isActive }) => (
              <motion.div
                whileTap={{ scale: 0.82 }}
                className={`flex flex-col items-center gap-1 py-2.5 text-[9px] font-black transition-colors relative ${
                  isActive ? "text-[#f1a92a]" : "text-gray-600"
                }`}
              >
                {/* Top indicator bar */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="bottomBar"
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[2.5px] rounded-full bg-[#f1a92a]"
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      exit={{ opacity: 0, scaleX: 0 }}
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    />
                  )}
                </AnimatePresence>

                <motion.div
                  animate={isActive ? { scale: [1, 1.28, 1] } : { scale: 1 }}
                  transition={{ duration: 0.35 }}
                >
                  <Icon size={17} />
                </motion.div>
                {label}
              </motion.div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
