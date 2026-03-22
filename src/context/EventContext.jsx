import { createContext, useContext, useState, useEffect } from "react";

const EventContext = createContext(null);

// ── Helper: persist to localStorage ──────────────────────────────────────────
function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage full — silently ignore
    }
  }, [key, value]);

  return [value, setValue];
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function EventProvider({ children }) {
  const [eventInfo, setEventInfo] = useLocalStorage("ep_eventInfo", {
    name: "আমাদের অনুষ্ঠান",
    type: "বিয়ে",
    date: "",
    venue: "",
    budget: "",
    note: "",
  });

  const [guests, setGuests] = useLocalStorage("ep_guests", []);
  const [recipes, setRecipes] = useLocalStorage("ep_recipes", []);
  const [notes, setNotes] = useLocalStorage("ep_notes", []);
  const [todos, setTodos] = useLocalStorage("ep_todos", []);

  // ── Guest actions ──
  const addGuest = (g) =>
    setGuests((prev) => [
      ...prev,
      { ...g, id: Date.now(), confirmed: false, createdAt: new Date().toISOString() },
    ]);

  const removeGuest = (id) => setGuests((prev) => prev.filter((g) => g.id !== id));

  const toggleConfirm = (id) =>
    setGuests((prev) =>
      prev.map((g) => (g.id === id ? { ...g, confirmed: !g.confirmed } : g))
    );

  const updateGuest = (id, data) =>
    setGuests((prev) => prev.map((g) => (g.id === id ? { ...g, ...data } : g)));

  // ── Recipe actions ──
  const addRecipe = (r) =>
    setRecipes((prev) => [...prev, { ...r, id: Date.now() }]);

  const removeRecipe = (id) =>
    setRecipes((prev) => prev.filter((r) => r.id !== id));

  // ── Note actions ──
  const addNote = (n) =>
    setNotes((prev) => [
      ...prev,
      {
        ...n,
        id: Date.now(),
        date: new Date().toLocaleDateString("bn-BD"),
        pinned: false,
      },
    ]);

  const removeNote = (id) => setNotes((prev) => prev.filter((n) => n.id !== id));

  const togglePin = (id) =>
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );

  // ── Todo actions ──
  const addTodo = (t) =>
    setTodos((prev) => [...prev, { ...t, id: Date.now(), done: false }]);

  const removeTodo = (id) => setTodos((prev) => prev.filter((t) => t.id !== id));

  const toggleTodo = (id) =>
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );

  // ── Computed ──
  const stats = {
    total: guests.length,
    male: guests.filter((g) => g.gender === "male").length,
    female: guests.filter((g) => g.gender === "female").length,
    ownSide: guests.filter((g) => g.side === "own").length,
    borSide: guests.filter((g) => g.side === "bor").length,
    confirmed: guests.filter((g) => g.confirmed).length,
    todoDone: todos.filter((t) => t.done).length,
  };

  return (
    <EventContext.Provider
      value={{
        eventInfo, setEventInfo,
        guests, addGuest, removeGuest, toggleConfirm, updateGuest,
        recipes, addRecipe, removeRecipe,
        notes, addNote, removeNote, togglePin,
        todos, addTodo, removeTodo, toggleTodo,
        stats,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useEvent() {
  const ctx = useContext(EventContext);
  if (!ctx) throw new Error("useEvent must be inside EventProvider");
  return ctx;
}
