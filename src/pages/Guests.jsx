import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useEvent } from "../context/EventContext";
import Reveal      from "../components/ui/Reveal";
import GlassCard   from "../components/ui/GlassCard";
import CyberButton from "../components/ui/CyberButton";
import Modal       from "../components/ui/Modal";
import {
  Plus, Trash2, Check, Phone, Filter,
  Users, UserCheck, User,
} from "lucide-react";

// ── Shared input styles ───────────────────────────────────────────────────────
const inp = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-all duration-200";
const lbl = "block text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-widest";

// ── Filter tab button ─────────────────────────────────────────────────────────
function FilterTab({ active, onClick, children }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.95 }}
      className={`px-4 py-2 rounded-xl text-xs font-black transition-all border ${
        active
          ? "bg-[#f1a92a] text-black border-[#f1a92a]"
          : "bg-white/5 text-gray-400 border-white/10 hover:text-white"
      }`}
    >
      {children}
    </motion.button>
  );
}

// ── Gender / side toggle group ────────────────────────────────────────────────
function ToggleGroup({ value, onChange, options }) {
  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <motion.button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          whileTap={{ scale: 0.93 }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black border-2 transition-all ${
            value === opt.value
              ? "border-[#f1a92a] bg-[#f1a92a]/15 text-[#f1a92a]"
              : "border-white/10 text-gray-400 bg-white/5 hover:border-white/25"
          }`}
        >
          {opt.label}
        </motion.button>
      ))}
    </div>
  );
}

export default function Guests() {
  const { guests, addGuest, removeGuest, toggleConfirm, stats } = useEvent();

  const [modal, setModal]       = useState(false);
  const [filter, setFilter]     = useState("all");
  const [search, setSearch]     = useState("");
  const [form, setForm]         = useState({
    name: "", gender: "male", side: "own", phone: "",
  });

  const handleAdd = () => {
    if (!form.name.trim()) return;
    addGuest(form);
    setForm({ name: "", gender: "male", side: "own", phone: "" });
    setModal(false);
  };

  // Filter + search
  const filtered = guests.filter((g) => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase())
      || (g.phone && g.phone.includes(search));
    const matchFilter =
      filter === "all"    ? true :
      filter === "male"   ? g.gender === "male" :
      filter === "female" ? g.gender === "female" :
      filter === "own"    ? g.side === "own" :
      filter === "bor"    ? g.side === "bor" :
      filter === "confirmed" ? g.confirmed :
      filter === "pending"   ? !g.confirmed : true;
    return matchSearch && matchFilter;
  });

  const FILTERS = [
    { key: "all",       label: `সবাই (${guests.length})` },
    { key: "male",      label: `ছেলে (${stats.male})` },
    { key: "female",    label: `মেয়ে (${stats.female})` },
    { key: "own",       label: `নিজ পক্ষ (${stats.ownSide})` },
    { key: "bor",       label: `বর পক্ষ (${stats.borSide})` },
    { key: "confirmed", label: `নিশ্চিত (${stats.confirmed})` },
    { key: "pending",   label: `অপেক্ষায় (${guests.length - stats.confirmed})` },
  ];

  return (
    <div className="space-y-6">

      {/* ── HEADER ── */}
      <Reveal>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-3xl font-black text-white flex items-center gap-2">
              <Users size={28} className="text-[#f1a92a]" />
              মেহমান তালিকা
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              মোট <span className="text-white font-bold">{guests.length}</span> জন আমন্ত্রিত
            </p>
          </div>
          <CyberButton variant="gold" onClick={() => setModal(true)}>
            <Plus size={14} /> নতুন মেহমান
          </CyberButton>
        </div>
      </Reveal>

      {/* ── SEARCH ── */}
      <Reveal delay={0.08}>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
          <input
            className={`${inp} pl-10`}
            placeholder="নাম বা ফোন নম্বর দিয়ে খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </Reveal>

      {/* ── FILTER TABS ── */}
      <Reveal delay={0.12}>
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <FilterTab
              key={f.key}
              active={filter === f.key}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </FilterTab>
          ))}
        </div>
      </Reveal>

      {/* ── GUEST LIST ── */}
      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-3">👤</div>
            <p className="text-gray-400 font-semibold">কোনো মেহমান পাওয়া যায়নি</p>
            <p className="text-gray-600 text-xs mt-1">
              {guests.length === 0
                ? "নতুন মেহমান যোগ করুন"
                : "অন্য ফিল্টার বা সার্চ চেষ্টা করুন"}
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-3">
            {filtered.map((g, i) => (
              <motion.div
                key={g.id}
                layout
                initial={{ opacity: 0, y: 22, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: -40, scale: 0.9 }}
                transition={{ delay: i * 0.04, type: "spring", stiffness: 200 }}
              >
                <GlassCard
                  className="p-4"
                  glow={g.side === "bor" ? "#a78bfa" : "#14b8a6"}
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 6 }}
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{
                        background:
                          g.gender === "male"
                            ? "rgba(56,189,248,0.14)"
                            : "rgba(244,114,182,0.14)",
                      }}
                    >
                      {g.gender === "male" ? "👨" : "👩"}
                    </motion.div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-black truncate">{g.name}</h4>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                            g.side === "own"
                              ? "bg-teal-500/20 text-teal-400"
                              : "bg-purple-500/20 text-purple-400"
                          }`}
                        >
                          {g.side === "own" ? "🏠 নিজ" : "💍 বর পক্ষ"}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                            g.gender === "male"
                              ? "bg-sky-500/20 text-sky-400"
                              : "bg-pink-500/20 text-pink-400"
                          }`}
                        >
                          {g.gender === "male" ? "ছেলে" : "মেয়ে"}
                        </span>
                        {g.phone && (
                          <span className="text-[10px] text-gray-500 flex items-center gap-1">
                            <Phone size={9} /> {g.phone}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      {/* Confirm toggle */}
                      <motion.button
                        onClick={() => toggleConfirm(g.id)}
                        whileHover={{ scale: 1.18 }}
                        whileTap={{ scale: 0.88 }}
                        title={g.confirmed ? "নিশ্চিত বাতিল করুন" : "নিশ্চিত করুন"}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                          g.confirmed
                            ? "bg-teal-500/25 border-teal-500/50 text-teal-400"
                            : "bg-white/5 border-white/10 text-gray-500 hover:border-teal-500/40"
                        }`}
                      >
                        <Check size={15} />
                      </motion.button>

                      {/* Delete */}
                      <motion.button
                        onClick={() => removeGuest(g.id)}
                        whileHover={{ scale: 1.18 }}
                        whileTap={{ scale: 0.88 }}
                        className="w-9 h-9 rounded-xl flex items-center justify-center bg-rose-500/15 border border-rose-500/25 text-rose-400 hover:bg-rose-500/25 transition-all"
                      >
                        <Trash2 size={14} />
                      </motion.button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* ── ADD GUEST MODAL ── */}
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="নতুন মেহমান যোগ করুন"
        glow="#f1a92a"
      >
        <div className="space-y-5">
          <div>
            <label className={lbl}>নাম *</label>
            <input
              className={inp}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="মেহমানের পুরো নাম লিখুন"
              autoFocus
            />
          </div>

          <div>
            <label className={lbl}>লিঙ্গ</label>
            <ToggleGroup
              value={form.gender}
              onChange={(v) => setForm({ ...form, gender: v })}
              options={[
                { value: "male",   label: "👨 ছেলে" },
                { value: "female", label: "👩 মেয়ে" },
              ]}
            />
          </div>

          <div>
            <label className={lbl}>পক্ষ</label>
            <ToggleGroup
              value={form.side}
              onChange={(v) => setForm({ ...form, side: v })}
              options={[
                { value: "own", label: "🏠 নিজ পক্ষ" },
                { value: "bor", label: "💍 বর পক্ষ"  },
              ]}
            />
          </div>

          <div>
            <label className={lbl}>ফোন নম্বর (ঐচ্ছিক)</label>
            <input
              className={inp}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="01XXXXXXXXX"
              type="tel"
            />
          </div>

          <CyberButton variant="gold" onClick={handleAdd}>
            <Plus size={14} /> মেহমান যোগ করুন
          </CyberButton>
        </div>
      </Modal>
    </div>
  );
}
