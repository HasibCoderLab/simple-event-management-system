import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useEvent }    from "../context/EventContext";
import Reveal          from "../components/ui/Reveal";
import GlassCard       from "../components/ui/GlassCard";
import CyberButton     from "../components/ui/CyberButton";
import Modal           from "../components/ui/Modal";
import { Plus, Trash2, Check, CheckSquare } from "lucide-react";

const inp = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-all duration-200";
const lbl = "block text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-widest";

const PRIORITY = {
  high:   { label: "🔴 জরুরি",  color: "#f87171", bg: "bg-rose-500/15",   border: "border-rose-500/30"   },
  medium: { label: "🟡 মাঝারি", color: "#fbbf24", bg: "bg-yellow-500/15", border: "border-yellow-500/30" },
  low:    { label: "🟢 কম",     color: "#4ade80", bg: "bg-green-500/15",  border: "border-green-500/30"  },
};

export default function TodoList() {
  const { todos, addTodo, removeTodo, toggleTodo } = useEvent();
  const [modal, setModal]   = useState(false);
  const [filter, setFilter] = useState("all");
  const [form, setForm]     = useState({ task: "", priority: "medium" });

  const handleAdd = () => {
    if (!form.task.trim()) return;
    addTodo(form);
    setForm({ task: "", priority: "medium" });
    setModal(false);
  };

  const done    = todos.filter((t) => t.done).length;
  const pending = todos.filter((t) => !t.done).length;
  const pct     = todos.length ? (done / todos.length) * 100 : 0;

  const filtered = todos
    .filter((t) => {
      if (filter === "done")    return t.done;
      if (filter === "pending") return !t.done;
      if (filter === "high")    return t.priority === "high" && !t.done;
      return true;
    })
    .sort((a, b) => {
      // priority order: high > medium > low, then done at bottom
      if (a.done !== b.done) return a.done ? 1 : -1;
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.priority] - order[b.priority];
    });

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <Reveal>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-3xl font-black text-white flex items-center gap-2">
              <CheckSquare size={28} className="text-rose-400" />
              কাজের তালিকা
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              <span className="text-teal-400 font-bold">{done}</span> সম্পন্ন ·{" "}
              <span className="text-rose-400 font-bold">{pending}</span> বাকি
            </p>
          </div>
          <CyberButton variant="rose" onClick={() => setModal(true)}>
            <Plus size={14} /> নতুন কাজ
          </CyberButton>
        </div>
      </Reveal>

      {/* PROGRESS BAR */}
      {todos.length > 0 && (
        <Reveal delay={0.08}>
          <GlassCard className="p-5" glow="#14b8a6">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-gray-400 font-semibold">অগ্রগতি</span>
              <span className="font-black text-white">{Math.round(pct)}%</span>
            </div>
            <div className="h-3 bg-white/8 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full relative overflow-hidden"
                style={{
                  background: "linear-gradient(90deg,#f1a92a,#14b8a6,#a78bfa)",
                }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                {/* Shimmer */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                />
              </motion.div>
            </div>
            <div className="flex justify-between text-[10px] mt-2 text-gray-500">
              <span>{done} সম্পন্ন</span>
              <span>{todos.length} মোট</span>
            </div>
          </GlassCard>
        </Reveal>
      )}

      {/* FILTER TABS */}
      <Reveal delay={0.1}>
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "all",     label: `সব (${todos.length})` },
            { key: "pending", label: `বাকি (${pending})` },
            { key: "done",    label: `সম্পন্ন (${done})` },
            { key: "high",    label: `জরুরি (${todos.filter(t => t.priority === "high" && !t.done).length})` },
          ].map((f) => (
            <motion.button
              key={f.key}
              onClick={() => setFilter(f.key)}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${
                filter === f.key
                  ? "bg-[#f1a92a] text-black border-[#f1a92a]"
                  : "bg-white/5 text-gray-400 border-white/10"
              }`}
            >
              {f.label}
            </motion.button>
          ))}
        </div>
      </Reveal>

      {/* TODO LIST */}
      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-16"
          >
            <motion.div
              className="text-6xl mb-3"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {filter === "done" ? "🎉" : "✅"}
            </motion.div>
            <p className="text-gray-400 font-semibold">
              {filter === "done"
                ? "এখনো কোনো কাজ সম্পন্ন হয়নি"
                : filter === "pending"
                ? "সব কাজ সম্পন্ন! 🎉"
                : "কোনো কাজ নেই"}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filtered.map((t, i) => {
              const p = PRIORITY[t.priority];
              return (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, x: -24, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 30, scale: 0.9 }}
                  transition={{ delay: i * 0.04, type: "spring", stiffness: 200 }}
                >
                  <GlassCard
                    className={`p-4 transition-opacity ${t.done ? "opacity-60" : ""}`}
                    glow={p.color}
                  >
                    <div className="flex items-center gap-3">
                      {/* Checkbox */}
                      <motion.button
                        onClick={() => toggleTodo(t.id)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.85 }}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center border-2 flex-shrink-0 transition-all ${
                          t.done
                            ? "bg-teal-500 border-teal-500"
                            : "border-white/20 bg-transparent hover:border-teal-500/50"
                        }`}
                      >
                        <AnimatePresence>
                          {t.done && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                            >
                              <Check size={14} color="white" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>

                      {/* Task text */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-semibold text-sm transition-all ${
                            t.done
                              ? "line-through text-gray-500"
                              : "text-white"
                          }`}
                        >
                          {t.task}
                        </p>
                      </div>

                      {/* Priority badge */}
                      <span
                        className={`text-[10px] font-black px-2.5 py-1 rounded-full border flex-shrink-0 ${p.bg} ${p.border}`}
                        style={{ color: p.color }}
                      >
                        {t.priority === "high"
                          ? "জরুরি"
                          : t.priority === "medium"
                          ? "মাঝারি"
                          : "কম"}
                      </span>

                      {/* Delete */}
                      <motion.button
                        onClick={() => removeTodo(t.id)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.88 }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 transition-all flex-shrink-0"
                      >
                        <Trash2 size={13} />
                      </motion.button>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* ADD MODAL */}
      <Modal open={modal} onClose={() => setModal(false)} title="নতুন কাজ যোগ করুন" glow="#f472b6">
        <div className="space-y-5">
          <div>
            <label className={lbl}>কাজের বিবরণ *</label>
            <input
              className={inp}
              value={form.task}
              onChange={(e) => setForm({ ...form, task: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="যেমন: ক্যাটারিং বুকিং দেওয়া, ফুলের সাজসজ্জা..."
              autoFocus
            />
          </div>

          <div>
            <label className={lbl}>অগ্রাধিকার</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(PRIORITY).map(([key, p]) => (
                <motion.button
                  key={key}
                  onClick={() => setForm({ ...form, priority: key })}
                  whileTap={{ scale: 0.93 }}
                  className={`py-3 rounded-xl text-xs font-black border-2 transition-all ${
                    form.priority === key
                      ? `${p.bg} ${p.border}`
                      : "border-white/10 bg-white/5 text-gray-400"
                  }`}
                  style={form.priority === key ? { color: p.color } : {}}
                >
                  {p.label}
                </motion.button>
              ))}
            </div>
          </div>

          <CyberButton variant="rose" onClick={handleAdd}>
            <Plus size={14} /> কাজ যোগ করুন
          </CyberButton>
        </div>
      </Modal>
    </div>
  );
}
