import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEvent } from "../context/EventContext";
import Reveal from "../components/ui/Reveal";
import GlassCard from "../components/ui/GlassCard";
import StatChip from "../components/ui/StatChip";
import CyberButton from "../components/ui/CyberButton";
import ProgressRing from "../components/ui/ProgressRing";
import {
  Plus, Users, ChefHat, StickyNote, CheckSquare,
  TrendingUp, Clock, Star,
} from "lucide-react";

// ── Reusable label/value row inside cards ─────────────────────────────────────
function InfoRow({ label, value, color = "#f1a92a" }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className="font-black text-sm" style={{ color }}>{value}</span>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { eventInfo, stats, guests, todos, recipes, notes } = useEvent();

  const todoDone = todos.filter((t) => t.done).length;
  const recentGuests = [...guests].reverse().slice(0, 5);

  // Upcoming todos (not done, high priority first)
  const upcomingTodos = todos
    .filter((t) => !t.done)
    .sort((a, b) => (a.priority === "high" ? -1 : 1))
    .slice(0, 4);

  return (
    <div className="space-y-8">

      {/* ── LOGO ─────────────────────────────────────────────────────────────── */}
      <Reveal>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 90" width="340" height="53"
          style={{ display: "block" }}>
          <rect x="0" y="0" width="600" height="90" rx="16" fill="#0f172a" />
          <polygon points="55,55 87,31 119,55" fill="#1e293b" />
          <rect x="63" y="55" width="48" height="30" rx="3" fill="#f1a92a" />
          <rect x="76" y="65" width="12" height="20" rx="2" fill="#0f172a" />
          <circle cx="85" cy="76" r="1.5" fill="#f1a92a" />
          <rect x="65" y="60" width="9" height="7" rx="1" fill="#0f172a" />
          <rect x="97" y="60" width="9" height="7" rx="1" fill="#0f172a" />
          <circle cx="69" cy="64" r="3.5" fill="#ffffff" />
          <circle cx="101" cy="64" r="3.5" fill="#ffffff" />
          <path d="M97 68 Q101 75 105 68" fill="#ffffff" />
          <line x1="112" y1="33" x2="112" y2="43" stroke="#f1a92a" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="109" y1="33" x2="109" y2="38" stroke="#f1a92a" strokeWidth="1" strokeLinecap="round" />
          <line x1="115" y1="33" x2="115" y2="38" stroke="#f1a92a" strokeWidth="1" strokeLinecap="round" />
          <circle cx="120" cy="34" r="2.5" fill="none" stroke="#f1a92a" strokeWidth="1.2" />
          <line x1="120" y1="36" x2="120" y2="43" stroke="#f1a92a" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="140" y1="22" x2="140" y2="68" stroke="#1e293b" strokeWidth="1" />
          <text style={{ fontFamily: "Arial, sans-serif", fontSize: "22px", fontWeight: 700, fill: "#f8fafc", letterSpacing: "3px" }} x="158" y="47">EVENT PLANNER</text>
          <text style={{ fontFamily: "Arial, sans-serif", fontSize: "10px", fontWeight: 400, fill: "#94a3b8", letterSpacing: "4px" }} x="158" y="66">GUESTS · RECIPES · HOME</text>
        </svg>
      </Reveal>

      {/* ── HERO BANNER ─────────────────────────────────────────────────────── */}
      <Reveal>
        <div
          className="relative overflow-hidden rounded-3xl p-8 md:p-10"
          style={{
            background:
              "linear-gradient(135deg,rgba(241,169,42,0.14) 0%,rgba(20,184,166,0.09) 50%,rgba(167,139,250,0.09) 100%)",
            border: "1px solid rgba(241,169,42,0.18)",
          }}
        >
          {/* Decorative floating emoji */}
          <motion.div
            className="absolute top-4 right-6 text-[90px] select-none pointer-events-none opacity-10"
            animate={{ rotate: [0, 12, -6, 0], y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            💍
          </motion.div>

          {/* Corner decoration */}
          <div className="absolute top-0 left-0 w-20 h-20 opacity-20"
            style={{
              background:
                "linear-gradient(135deg, #f1a92a 0%, transparent 70%)",
              clipPath: "polygon(0 0, 100% 0, 0 100%)",
            }}
          />

          <div className="relative z-10">
            <motion.p
              className="text-xs font-black uppercase tracking-[5px] mb-3"
              style={{ color: "#f1a92a" }}
              animate={{ opacity: [0.65, 1, 0.65] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              ✨ অনুষ্ঠান পরিকল্পনা
            </motion.p>

            <h1
              className="text-4xl md:text-5xl font-black text-white mb-3 leading-tight"
              style={{
                fontFamily: "'Hind Siliguri', serif",
                textShadow: "0 0 40px rgba(241,169,42,0.35)",
              }}
            >
              {eventInfo.name}
            </h1>

            <div className="flex flex-wrap gap-3 text-sm text-gray-300">
              {eventInfo.type && (
                <span className="flex items-center gap-1.5">
                  <Star size={13} className="text-yellow-400" />
                  {eventInfo.type}
                </span>
              )}
              {eventInfo.date && (
                <span className="flex items-center gap-1.5">
                  <Clock size={13} className="text-teal-400" />
                  {eventInfo.date}
                </span>
              )}
              {eventInfo.venue && (
                <span className="flex items-center gap-1.5">
                  📍 {eventInfo.venue}
                </span>
              )}
            </div>

            {/* Quick action strip */}
            <div className="flex flex-wrap gap-2 mt-6">
              <CyberButton variant="gold" onClick={() => navigate("/guests")}>
                <Plus size={13} /> মেহমান যোগ
              </CyberButton>
              <CyberButton variant="teal" onClick={() => navigate("/recipes")}>
                <ChefHat size={13} /> রেসিপি
              </CyberButton>
              <CyberButton variant="purple" onClick={() => navigate("/todos")}>
                <CheckSquare size={13} /> কাজ
              </CyberButton>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ── STAT CHIPS GRID ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { emoji: "👥", value: stats.total, label: "মোট মেহমান", color: "#f1a92a", delay: 0.00 },
          { emoji: "👨", value: stats.male, label: "ছেলে", color: "#38bdf8", delay: 0.07 },
          { emoji: "👩", value: stats.female, label: "মেয়ে", color: "#f472b6", delay: 0.14 },
          { emoji: "🏠", value: stats.ownSide, label: "নিজ পক্ষ", color: "#4ade80", delay: 0.21 },
          { emoji: "💍", value: stats.borSide, label: "বর পক্ষ", color: "#a78bfa", delay: 0.28 },
          { emoji: "✅", value: stats.confirmed, label: "নিশ্চিত", color: "#14b8a6", delay: 0.35 },
        ].map((s) => (
          <StatChip
            key={s.label}
            emoji={s.emoji}
            value={s.value}
            label={s.label}
            color={s.color}
            delay={s.delay}
            total={stats.total}
          />
        ))}
      </div>

      {/* ── PROGRESS + BREAKDOWN ROW ─────────────────────────────────────────── */}
      <div className="grid md:grid-cols-2 gap-4">

        {/* Confirmation ring */}
        <Reveal delay={0.1} direction="left">
          <GlassCard className="p-6 h-full" glow="#f1a92a">
            <h3 className="text-white font-black text-lg mb-5 flex items-center gap-2">
              <TrendingUp size={18} className="text-[#f1a92a]" />
              নিশ্চিতকরণ অগ্রগতি
            </h3>
            <div className="flex items-center gap-6">
              <ProgressRing
                value={stats.confirmed}
                total={stats.total || 1}
                color="#f1a92a"
                size={110}
              />
              <div className="space-y-2">
                <InfoRow label="নিশ্চিত" value={`${stats.confirmed} জন`} color="#14b8a6" />
                <InfoRow label="অপেক্ষায়" value={`${stats.total - stats.confirmed} জন`} color="#f472b6" />
                <InfoRow label="মোট" value={`${stats.total} জন`} />
              </div>
            </div>
          </GlassCard>
        </Reveal>

        {/* Gender / side breakdown */}
        <Reveal delay={0.15} direction="right">
          <GlassCard className="p-6 h-full" glow="#a78bfa">
            <h3 className="text-white font-black text-lg mb-5 flex items-center gap-2">
              <Users size={18} className="text-purple-400" />
              বিস্তারিত বিভাজন
            </h3>
            <div className="space-y-3">
              {[
                { label: "ছেলে মেহমান", value: stats.male, total: stats.total, color: "#38bdf8" },
                { label: "মেয়ে মেহমান", value: stats.female, total: stats.total, color: "#f472b6" },
                { label: "নিজ পক্ষ", value: stats.ownSide, total: stats.total, color: "#4ade80" },
                { label: "বর পক্ষ", value: stats.borSide, total: stats.total, color: "#a78bfa" },
              ].map((row) => (
                <div key={row.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400 font-semibold">{row.label}</span>
                    <span className="font-black" style={{ color: row.color }}>
                      {row.value} জন
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: row.color }}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${row.total > 0 ? (row.value / row.total) * 100 : 0}%`,
                      }}
                      transition={{ duration: 1.1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </Reveal>
      </div>

      {/* ── CONTENT OVERVIEW ROW ────────────────────────────────────────────── */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { label: "রেসিপি", value: recipes.length, icon: "🍽️", color: "#14b8a6", route: "/recipes" },
          { label: "নোটস", value: notes.length, icon: "📝", color: "#a78bfa", route: "/notes" },
          { label: "কাজ বাকি", value: todos.filter(t => !t.done).length, icon: "📋", color: "#f472b6", route: "/todos" },
        ].map((item, i) => (
          <Reveal key={item.label} delay={i * 0.08}>
            <GlassCard
              className="p-5 cursor-pointer"
              glow={item.color}
              onClick={() => navigate(item.route)}
            >
              <div className="flex items-center gap-3">
                <motion.span
                  className="text-3xl"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                >
                  {item.icon}
                </motion.span>
                <div>
                  <div className="text-2xl font-black" style={{ color: item.color }}>
                    {item.value}
                  </div>
                  <div className="text-xs text-gray-400 font-semibold">{item.label}</div>
                </div>
              </div>
            </GlassCard>
          </Reveal>
        ))}
      </div>

      {/* ── TODO PROGRESS ────────────────────────────────────────────────────── */}
      {todos.length > 0 && (
        <Reveal delay={0.1}>
          <GlassCard className="p-6" glow="#14b8a6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-black text-lg flex items-center gap-2">
                <CheckSquare size={18} className="text-teal-400" />
                কাজের অগ্রগতি
              </h3>
              <span className="text-xs font-black text-teal-400">
                {todoDone}/{todos.length} সম্পন্ন
              </span>
            </div>
            <div className="h-2.5 bg-white/8 rounded-full overflow-hidden mb-4">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg,#f1a92a,#14b8a6)",
                }}
                animate={{
                  width: `${todos.length ? (todoDone / todos.length) * 100 : 0}%`,
                }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </div>
            <div className="space-y-2">
              {upcomingTodos.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center gap-3 text-sm"
                >
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${t.priority === "high"
                        ? "bg-rose-400"
                        : t.priority === "medium"
                          ? "bg-yellow-400"
                          : "bg-teal-400"
                      }`}
                  />
                  <span className="text-gray-300">{t.task}</span>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </Reveal>
      )}

      {/* ── RECENT GUESTS ────────────────────────────────────────────────────── */}
      {recentGuests.length > 0 && (
        <Reveal delay={0.12}>
          <GlassCard className="p-6" glow="#a78bfa">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-black text-lg flex items-center gap-2">
                <Users size={18} className="text-purple-400" />
                সাম্প্রতিক মেহমান
              </h3>
              <CyberButton variant="purple" small onClick={() => navigate("/guests")}>
                সব দেখুন
              </CyberButton>
            </div>
            <div className="space-y-2">
              {recentGuests.map((g, i) => (
                <motion.div
                  key={g.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center justify-between p-3 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                >
                  <div className="flex items-center gap-3">
                    <motion.span
                      className="text-xl"
                      whileHover={{ scale: 1.3, rotate: 10 }}
                    >
                      {g.gender === "male" ? "👨" : "👩"}
                    </motion.span>
                    <div>
                      <p className="text-white font-black text-sm">{g.name}</p>
                      <p className="text-gray-500 text-xs">
                        {g.side === "own" ? "🏠 নিজ পক্ষ" : "💍 বর পক্ষ"}
                        {g.phone && ` • ${g.phone}`}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-black px-2.5 py-1 rounded-full ${g.confirmed
                        ? "bg-teal-500/20 text-teal-400"
                        : "bg-gray-700/60 text-gray-500"
                      }`}
                  >
                    {g.confirmed ? "✓ নিশ্চিত" : "অপেক্ষায়"}
                  </span>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </Reveal>
      )}

      {/* ── EMPTY STATE ──────────────────────────────────────────────────────── */}
      {guests.length === 0 && todos.length === 0 && recipes.length === 0 && (
        <Reveal delay={0.2}>
          <GlassCard className="p-10 text-center" glow="#f1a92a">
            <motion.div
              className="text-7xl mb-4"
              animate={{ y: [0, -14, 0], rotate: [0, 8, -4, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              🎊
            </motion.div>
            <h3 className="text-2xl font-black text-white mb-2">শুরু করুন!</h3>
            <p className="text-gray-400 text-sm mb-6">
              প্রথমে মেহমান তালিকা, রেসিপি এবং কাজের তালিকা তৈরি করুন।
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <CyberButton variant="gold" onClick={() => navigate("/guests")}>
                <Users size={14} /> মেহমান যোগ করুন
              </CyberButton>
              <CyberButton variant="teal" onClick={() => navigate("/settings")}>
                অনুষ্ঠানের তথ্য দিন
              </CyberButton>
            </div>
          </GlassCard>
        </Reveal>
      )}
    </div>
  );
}