import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useEvent }    from "../context/EventContext";
import Reveal          from "../components/ui/Reveal";
import GlassCard       from "../components/ui/GlassCard";
import CyberButton     from "../components/ui/CyberButton";
import Modal           from "../components/ui/Modal";
import { Plus, Trash2, Pin, StickyNote } from "lucide-react";

const inp = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-all duration-200";
const lbl = "block text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-widest";

const NOTE_COLORS = [
  { label: "সোনালী",  value: "#f1a92a" },
  { label: "টিল",     value: "#14b8a6" },
  { label: "বেগুনি",  value: "#a78bfa" },
  { label: "গোলাপি",  value: "#f472b6" },
  { label: "নীল",     value: "#38bdf8" },
];

export default function Notes() {
  const { notes, addNote, removeNote, togglePin } = useEvent();
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    title: "", content: "", color: "#f1a92a",
  });

  const handleAdd = () => {
    if (!form.title.trim()) return;
    addNote(form);
    setForm({ title: "", content: "", color: "#f1a92a" });
    setModal(false);
  };

  const filtered = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      (n.content && n.content.toLowerCase().includes(search.toLowerCase()))
  );

  // Pinned first
  const sorted = [
    ...filtered.filter((n) => n.pinned),
    ...filtered.filter((n) => !n.pinned),
  ];

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <Reveal>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-3xl font-black text-white flex items-center gap-2">
              <StickyNote size={28} className="text-purple-400" />
              নোটস
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              মোট <span className="text-white font-bold">{notes.length}</span>টি নোট
              {notes.filter((n) => n.pinned).length > 0 && (
                <span className="ml-2 text-yellow-400">
                  • 📌 {notes.filter((n) => n.pinned).length}টি পিন করা
                </span>
              )}
            </p>
          </div>
          <CyberButton variant="purple" onClick={() => setModal(true)}>
            <Plus size={14} /> নতুন নোট
          </CyberButton>
        </div>
      </Reveal>

      {/* SEARCH */}
      <Reveal delay={0.08}>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
          <input
            className={`${inp} pl-10`}
            placeholder="নোট খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </Reveal>

      {/* NOTES GRID */}
      <AnimatePresence mode="popLayout">
        {sorted.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-16"
          >
            <motion.div
              className="text-6xl mb-3"
              animate={{ rotate: [0, 10, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              📝
            </motion.div>
            <p className="text-gray-400 font-semibold">কোনো নোট নেই</p>
            <p className="text-gray-600 text-xs mt-1">
              গুরুত্বপূর্ণ তথ্য এখানে রাখুন
            </p>
          </motion.div>
        ) : (
          <div className="columns-1 md:columns-2 gap-4 space-y-4">
            {sorted.map((n, i) => (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, y: 24, rotateX: -10 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.85, rotateX: 10 }}
                transition={{
                  delay: i * 0.05,
                  type: "spring",
                  stiffness: 180,
                }}
                className="break-inside-avoid mb-4"
              >
                <GlassCard
                  className="p-5"
                  glow={n.color || "#a78bfa"}
                >
                  {/* Top accent bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl"
                    style={{ background: n.color || "#a78bfa" }}
                  />

                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      {n.pinned && (
                        <motion.span
                          animate={{ rotate: [0, 10, -5, 0] }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className="text-yellow-400"
                        >
                          📌
                        </motion.span>
                      )}
                      <h4
                        className="font-black text-base leading-snug"
                        style={{ color: n.color || "#a78bfa" }}
                      >
                        {n.title}
                      </h4>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <motion.button
                        onClick={() => togglePin(n.id)}
                        whileHover={{ scale: 1.18 }}
                        whileTap={{ scale: 0.88 }}
                        title={n.pinned ? "পিন খুলুন" : "পিন করুন"}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                          n.pinned
                            ? "bg-yellow-500/25 text-yellow-400"
                            : "bg-white/5 text-gray-500 hover:text-yellow-400"
                        }`}
                      >
                        <Pin size={12} />
                      </motion.button>
                      <motion.button
                        onClick={() => removeNote(n.id)}
                        whileHover={{ scale: 1.18 }}
                        whileTap={{ scale: 0.88 }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 transition-all"
                      >
                        <Trash2 size={12} />
                      </motion.button>
                    </div>
                  </div>

                  {n.content && (
                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                      {n.content}
                    </p>
                  )}

                  <p className="text-gray-600 text-[10px] mt-3 font-semibold">
                    📅 {n.date}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* ADD MODAL */}
      <Modal open={modal} onClose={() => setModal(false)} title="নতুন নোট লিখুন" glow="#a78bfa">
        <div className="space-y-5">
          <div>
            <label className={lbl}>শিরোনাম *</label>
            <input
              className={inp}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="নোটের শিরোনাম"
              autoFocus
            />
          </div>

          <div>
            <label className={lbl}>বিস্তারিত</label>
            <textarea
              className={`${inp} resize-none`}
              rows={5}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="এখানে গুরুত্বপূর্ণ তথ্য লিখুন..."
            />
          </div>

          {/* Color picker */}
          <div>
            <label className={lbl}>রঙ বেছে নিন</label>
            <div className="flex gap-3">
              {NOTE_COLORS.map((c) => (
                <motion.button
                  key={c.value}
                  onClick={() => setForm({ ...form, color: c.value })}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 rounded-full border-2 transition-all"
                  style={{
                    background: c.value,
                    borderColor:
                      form.color === c.value ? "white" : "transparent",
                    boxShadow:
                      form.color === c.value
                        ? `0 0 12px ${c.value}80`
                        : "none",
                  }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <CyberButton variant="purple" onClick={handleAdd}>
            <Plus size={14} /> নোট সংরক্ষণ করুন
          </CyberButton>
        </div>
      </Modal>
    </div>
  );
}
