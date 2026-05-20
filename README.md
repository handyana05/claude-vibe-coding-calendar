# Calendar App

A simple month-view calendar built with **React + Vite**. Add, edit, and delete events on any day; everything is persisted in your browser's `localStorage`. Built as an exercise for Coursera's "Vibe Coding with Claude Code".

## Features

- 📅 **Month grid** — 6 weeks × 7 days, with today highlighted and out-of-month days dimmed.
- ◀ ▶ **Navigation** — Prev / Today / Next buttons in the header.
- ➕ **Add events** — Click any day cell to open the modal with that date pre-selected.
- ✏️ **Edit events** — Click an event chip to reopen the modal pre-filled.
- 🗑️ **Delete events** — Delete button inside the modal in edit mode.
- 💾 **localStorage persistence** — Events survive page reloads (stored as JSON under `calendar.events`).
- 📱 **Responsive** — Works on desktop and mobile (media query at 600px).
- ✅ **Validation** — Title required (≤100 chars), date required, optional `HH:MM` time, description ≤500 chars.
- ⌨️ **Keyboard-friendly** — Escape closes the modal; cells are focusable.

## Tech stack

- **React 18** + **Vite 5** — no router, no state library, no UI kit.
- **Native `Date`** — no `date-fns` / `dayjs` dependency.
- **Vanilla CSS** — single stylesheet, CSS grid for layout.
- **`crypto.randomUUID()`** for event IDs.

## Getting started

```bash
git clone https://github.com/handyana05/claude-vibe-coding-calendar.git
cd claude-vibe-coding-calendar
npm install
npm run dev
```

Then open <http://localhost:5173>.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR. |
| `npm run build` | Build a production bundle into `dist/`. |
| `npm run preview` | Preview the production build locally. |

## Project structure

```
calendar-app/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx              # React entry point
│   ├── App.jsx               # State + localStorage + composition
│   ├── CalendarHeader.jsx    # Month label + nav buttons
│   ├── MonthGrid.jsx         # 7×6 grid + day cells + event chips
│   ├── EventModal.jsx        # Add / edit / delete form with validation
│   ├── dateUtils.js          # buildMonthMatrix, formatYMD, isSameDay, monthLabel
│   └── styles.css            # Layout, modal, responsive media queries
└── tasks/
    └── todo.md               # Implementation checklist + review
```

## Data model

Events are stored under the `calendar.events` localStorage key as a JSON array:

```json
[
  {
    "id": "f3a1...",
    "title": "Team sync",
    "date": "2026-05-20",
    "time": "14:30",
    "description": "Weekly catch-up"
  }
]
```

## License

MIT
