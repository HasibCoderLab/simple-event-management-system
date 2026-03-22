import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useEvent }    from "../context/EventContext";
import Reveal          from "../components/ui/Reveal";
import GlassCard       from "../components/ui/GlassCard";
import CyberButton     from "../components/ui/CyberButton";
import Modal           from "../components/ui/Modal";
import { Plus, Trash2, ChefHat, Users } from "lucide-react";

const inp = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-all duration-200";
const lbl = "block text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-widest";

const CATEGORIES = ["মাংস", "মাছ", "সবজি", "ভাত/পোলাও", "রুটি/পরোটা", "মিষ্টি/ডেজার্ট", "স্যুপ/স্টার্টার", "পানীয়", "অন্যান্য"];

const CAT_CONFIG = {
  "মাংস":           { emoji: "🥩", color: "#f87171", glow: "#f87171" },
  "মাছ":            { emoji: "🐟", color: "#38bdf8", glow: "#38bdf8" },
  "সবজি":           { emoji: "🥦", color: "#4ade80", glow: "#4ade80" },
  "ভাত/পোলাও":     { emoji: "🍚", color: "#fbbf24", glow: "#fbbf24" },
  "রুটি/পরোটা":    { emoji: "🫓", color: "#fb923c", glow: "#fb923c" },
  "মিষ্টি/ডেজার্ট": { emoji: "🍮", color: "#f472b6", glow: "#f472b6" },
  "স্যুপ/স্টার্টার": { emoji: "🍲", color: "#a78bfa", glow: "#a78bfa" },
  "পানীয়":         { emoji: "🥤", color: "#14b8a6", glow: "#14b8a6" },
  "অন্যান্য":       { emoji: "🍴", color: "#94a3b8", glow: "#94a3b8" },
};

export default function Recipes() {
  const { recipes, addRecipe, removeRecipe } = useEvent();
  const [modal, setModal] = useState(false);
  const [filterCat, setFilterCat] = useState("all");
  const [form, setForm] = useState({
    name: "", category: "মাংস", servings: "", note: "",
  });

  const handleAdd = () => {
    if (!form.name.trim()) return;
    addRecipe(form);
    setForm({ name: "", category: "মাংস", servings: "", note: "" });
    setModal(false);
  };

  const filtered =
    filterCat === "all"
      ? recipes
      : recipes.filter((r) => r.category === filterCat);

  // group by category for display
  const grouped = filtered.reduce((acc, r) => {
    acc[r.category] = acc[r.category] || [];
    acc[r.category].push(r);
    return acc;
  }, {});

  // category stats
  const catStats = CATEGORIES.map((c) => ({
    name: c,
    count: recipes.filter((r) => r.category === c).length,
    ...CAT_CONFIG[c],
  })).filter((c) => c.count > 0);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <Reveal>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-3xl font-black text-white flex items-center gap-2">
              <ChefHat size={28} className="text-teal-400" />
              রেসিপি তালিকা
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              অনুষ্ঠানের মেনু — মোট{" "}
              <span className="text-white font-bold">{recipes.length}</span>টি আইটেম
            </p>
          </div>
          <CyberButton variant="teal" onClick={() => setModal(true)}>
            <Plus size={14} /> নতুন রেসিপি
          </CyberButton>
        </div>
      </Reveal>

      {/* CATEGORY PILLS (only if data exists) */}
      {catStats.length > 0 && (
        <Reveal delay={0.08}>
          <div className="flex gap-2 flex-wrap">
            <motion.button
              onClick={() => setFilterCat("all")}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${
                filterCat === "all"
                  ? "bg-[#f1a92a] text-black border-[#f1a92a]"
                  : "bg-white/5 text-gray-400 border-white/10"
              }`}
            >
              সব ({recipes.length})
            </motion.button>
            {catStats.map((c) => (
              <motion.button
                key={c.name}
                onClick={() => setFilterCat(c.name)}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${
                  filterCat === c.name
                    ? "border-opacity-100 text-black"
                    : "bg-white/5 text-gray-400 border-white/10"
                }`}
                style={
                  filterCat === c.name
                    ? { background: c.color, borderColor: c.color }
                    : {}
                }
              >
                {c.emoji} {c.name} ({c.count})
              </motion.button>
            ))}
          </div>
        </Reveal>
      )}

      {/* LIST */}
      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-3">🍽️</div>
            <p className="text-gray-400 font-semibold">কোনো রেসিপি নেই</p>
            <p className="text-gray-600 text-xs mt-1">অনুষ্ঠানের মেনু তৈরি করুন</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([cat, items], gi) => {
              const cfg = CAT_CONFIG[cat] || CAT_CONFIG["অন্যান্য"];
              return (
                <Reveal key={cat} delay={gi * 0.06}>
                  {/* Category header */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{cfg.emoji}</span>
                    <h3 className="font-black text-base" style={{ color: cfg.color }}>
                      {cat}
                    </h3>
                    <div
                      className="flex-1 h-px"
                      style={{ background: `${cfg.color}30` }}
                    />
                    <span
                      className="text-xs font-black px-2 py-0.5 rounded-full"
                      style={{ color: cfg.color, background: `${cfg.color}18` }}
                    >
                      {items.length}টি
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    {items.map((r, i) => (
                      <motion.div
                        key={r.id}
                        layout
                        initial={{ opacity: 0, y: 18, scale: 0.94 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        transition={{ delay: i * 0.06 }}
                      >
                        <GlassCard className="p-5" glow={cfg.glow}>
                          <div className="flex justify-between items-start">
                            <div className="flex-1 pr-3">
                              <h4 className="text-white font-black text-base mb-1">
                                {r.name}
                              </h4>
                              {r.servings && (
                                <p className="text-gray-400 text-xs flex items-center gap-1.5">
                                  <Users size={11} />
                                  {r.servings} জনের জন্য
                                </p>
                              )}
                              {r.note && (
                                <p
                                  className="text-gray-500 text-xs mt-2 italic border-l-2 pl-2"
                                  style={{ borderColor: `${cfg.color}50` }}
                                >
                                  {r.note}
                                </p>
                              )}
                            </div>
                            <motion.button
                              onClick={() => removeRecipe(r.id)}
                              whileHover={{ scale: 1.2, rotate: 12 }}
                              whileTap={{ scale: 0.88 }}
                              className="w-8 h-8 rounded-lg flex items-center justify-center bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 transition-all flex-shrink-0"
                            >
                              <Trash2 size={13} />
                            </motion.button>
                          </div>
                        </GlassCard>
                      </motion.div>
                    ))}
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* ADD MODAL */}
      <Modal open={modal} onClose={() => setModal(false)} title="নতুন রেসিপি যোগ করুন" glow="#14b8a6">
        <div className="space-y-5">
          <div>
            <label className={lbl}>রেসিপির নাম *</label>
            <input
              className={inp}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="যেমন: গরুর রেজালা, কাচ্চি বিরিয়ানি..."
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>ক্যাটাগরি</label>
              <select
                className={inp}
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} style={{ background: "#0f172a" }}>
                    {CAT_CONFIG[c]?.emoji} {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={lbl}>কতজনের জন্য</label>
              <input
                className={inp}
                type="number"
                min="1"
                value={form.servings}
                onChange={(e) => setForm({ ...form, servings: e.target.value })}
                placeholder="৫০"
              />
            </div>
          </div>

          <div>
            <label className={lbl}>নোট (ঐচ্ছিক)</label>
            <textarea
              className={inp}
              rows={2}
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="রান্নার বিশেষ নির্দেশনা..."
            />
          </div>

          <CyberButton variant="teal" onClick={handleAdd}>
            <Plus size={14} /> রেসিপি যোগ করুন
          </CyberButton>
        </div>
      </Modal>
    </div>
  );
}
