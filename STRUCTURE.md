# 📁 অনুষ্ঠান প্ল্যানার — Full Project Structure

```
event-planner/
├── public/
│   └── index.html
├── src/
│   ├── main.jsx                    # Entry point
│   ├── App.jsx                     # Root App + Router
│   │
│   ├── context/
│   │   └── EventContext.jsx        # Global state (Context API)
│   │
│   ├── hooks/
│   │   ├── useLocalStorage.js      # Persist data to localStorage
│   │   └── useAnimNum.js           # Animated number counter
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── GlassCard.jsx
│   │   │   ├── CyberButton.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── StatChip.jsx
│   │   │   ├── Reveal.jsx          # Scroll reveal wrapper
│   │   │   └── ProgressRing.jsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── BottomNav.jsx
│   │   │   └── Sidebar.jsx
│   │   │
│   │   └── background/
│   │       ├── ParticleField.jsx
│   │       ├── GlowOrbs.jsx
│   │       └── GridBg.jsx
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Guests.jsx
│   │   ├── Recipes.jsx
│   │   ├── Notes.jsx
│   │   ├── TodoList.jsx
│   │   └── Settings.jsx
│   │
│   └── styles/
│       └── globals.css             # Tailwind + custom CSS vars
│
├── package.json
├── vite.config.js
└── tailwind.config.js
```
