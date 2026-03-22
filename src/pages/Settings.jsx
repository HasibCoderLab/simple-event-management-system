import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEvent }    from "../context/EventContext";
import Reveal          from "../components/ui/Reveal";
import GlassCard       from "../components/ui/GlassCard";
import CyberButton     from "../components/ui/CyberButton";
import { Settings2, Check, Trash2, AlertTriangle } from "lucide-react";

const inp = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-all duration-200";
const lbl = "block text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-widest";

const EVENT_TYPES = [
  "বিয়ে", "গায়েহলুদ", "আকিকা", "সুন্নতে খৎনা",
  "জন্মদিন", "মেজবানি", "বার্ষিকী", "অন্যান্য",
];

export default function Settings() {
  const { eventInfo, setEventInfo, guests, recipes, notes, todos } = useEvent();
  const [saved, setSaved] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [local, setLocal] = useState({ ...eventInfo });

  const handleSave = () => {
    setEventInfo(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleClearAll = () => {
    // Clear localStorage keys
    ["ep_guests", "ep_recipes", "ep_notes", "ep_todos"].forEach((k) =>
      localStorage.removeItem(k)
    );
    window.location.reload();
  };

  const field = (key, label, placeholder, type = "text") => (
    <div>
      <label className={lbl}>{label}</label>
      <input
        className={inp}
        type={type}
        value={local[key]}
        onChange={(e) => setLocal({ ...local, [key]: e.target.value })}
        placeholder={placeholder}
      />
    </div>
  );

  const stats = [
    { label: "মেহমান",   value: guests.length,  emoji: "👥", color: "#f1a92a" },
    { label: "রেসিপি",  value: recipes.length,  emoji: "🍽️", color: "#14b8a6" },
    { label: "নোটস",    value: notes.length,    emoji: "📝", color: "#a78bfa" },
    { label: "কাজ",     value: todos.length,    emoji: "✅", color: "#f472b6" },
  ];

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <Reveal>
        <h2 className="text-3xl font-black text-white flex items-center gap-2">
          <Settings2 size={28} className="text-[#f1a92a]" />
          অনুষ্ঠানের তথ্য
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          অনুষ্ঠানের বিস্তারিত তথ্য এখানে সংরক্ষণ করুন
        </p>
      </Reveal>

      {/* STATS OVERVIEW */}
      <Reveal delay={0.08}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="rounded-2xl p-4 text-center"
              style={{
                background: "rgba(15,23,42,0.7)",
                border: `1px solid ${s.color}22`,
              }}
            >
              <div className="text-2xl mb-1">{s.emoji}</div>
              <div className="text-xl font-black" style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="text-[10px] text-gray-500 font-semibold">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </Reveal>

      {/* FORM */}
      <Reveal delay={0.12}>
        <GlassCard className="p-6" glow="#f1a92a">
          <h3 className="text-white font-black text-lg mb-5">✏️ তথ্য সম্পাদনা</h3>

          <div className="space-y-4">
            {field("name", "অনুষ্ঠানের নাম *", "যেমন: রিয়াদ ও রিমার বিবাহ অনুষ্ঠান")}

            {/* Event type select */}
            <div>
              <label className={lbl}>অনুষ্ঠানের ধরন</label>
              <select
                className={inp}
                value={local.type}
                onChange={(e) => setLocal({ ...local, type: e.target.value })}
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t} style={{ background: "#0f172a" }}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {field("date",   "তারিখ",       "", "date")}
            {field("venue",  "স্থান / ভেন্যু", "যেমন: কমিউনিটি সেন্টার, ঢাকা")}
            {field("budget", "আনুমানিক বাজেট", "যেমন: ৫,০০,০০০ টাকা")}

            {/* Note */}
            <div>
              <label className={lbl}>বিশেষ নোট</label>
              <textarea
                className={`${inp} resize-none`}
                rows={3}
                value={local.note}
                onChange={(e) => setLocal({ ...local, note: e.target.value })}
                placeholder="অনুষ্ঠান সম্পর্কে অতিরিক্ত তথ্য..."
              />
            </div>

            {/* Save button with success animation */}
            <div className="flex items-center gap-3">
              <motion.div
                animate={
                  saved
                    ? { boxShadow: ["0 0 0px #14b8a6", "0 0 24px #14b8a644", "0 0 0px #14b8a6"] }
                    : {}
                }
                transition={{ duration: 1 }}
              >
                <CyberButton
                  variant={saved ? "teal" : "gold"}
                  onClick={handleSave}
                >
                  {saved ? (
                    <>
                      <Check size={14} /> সংরক্ষিত হয়েছে!
                    </>
                  ) : (
                    <>💾 সংরক্ষণ করুন</>
                  )}
                </CyberButton>
              </motion.div>

              <AnimatePresence>
                {saved && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-teal-400 text-sm font-bold"
                  >
                    ✅ সফলভাবে সংরক্ষিত হয়েছে
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </GlassCard>
      </Reveal>

      {/* APP INFO */}
      <Reveal delay={0.18}>
        <GlassCard className="p-6" glow="#14b8a6">
          <h3 className="text-white font-black text-lg mb-4">ℹ️ অ্যাপ তথ্য</h3>
          <div className="space-y-2 text-sm">
            {[
              ["সংস্করণ",       "১.০.০"],
              ["ডেটা সংরক্ষণ",  "লোকাল স্টোরেজ (ব্রাউজার)"],
              ["ফ্রেমওয়ার্ক",   "React + Vite + Tailwind"],
              ["অ্যানিমেশন",    "Framer Motion"],
              ["ডিজাইন",        "গ্লাসমর্ফিজম + সাইবারপাংক"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-gray-400">{k}</span>
                <span className="text-white font-semibold text-right">{v}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </Reveal>

      {/* DANGER ZONE */}
      <Reveal delay={0.22}>
        <GlassCard className="p-6" glow="#f87171">
          <h3 className="text-rose-400 font-black text-lg mb-2 flex items-center gap-2">
            <AlertTriangle size={18} />
            বিপদ জোন
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            সমস্ত ডেটা মুছে ফেলা হবে। এই কাজ পূর্বাবস্থায় ফেরানো যাবে না।
          </p>

          {!confirmClear ? (
            <CyberButton variant="rose" onClick={() => setConfirmClear(true)}>
              <Trash2 size={14} /> সব ডেটা মুছুন
            </CyberButton>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <p className="text-rose-300 text-sm font-bold">
                  ⚠️ আপনি কি নিশ্চিত? সব মেহমান, রেসিপি, নোট ও কাজ মুছে যাবে!
                </p>
                <div className="flex gap-3">
                  <CyberButton variant="rose" onClick={handleClearAll}>
                    <Trash2 size={14} /> হ্যাঁ, মুছে দিন
                  </CyberButton>
                  <CyberButton variant="teal" onClick={() => setConfirmClear(false)}>
                    <Check size={14} /> বাতিল
                  </CyberButton>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </GlassCard>
      </Reveal>
    </div>
  );
}
