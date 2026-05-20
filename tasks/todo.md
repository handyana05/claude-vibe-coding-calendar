# Calendar App — Implementation Checklist

A simple month-view calendar with add/edit/delete events, localStorage persistence, and a responsive UI built with React + Vite.

## Tasks

- [x] **1. Scaffold Vite + React project**
  - Files: `package.json`, `vite.config.js`, `.gitignore`, `index.html`, `src/main.jsx`
  - **Acceptance:** `npm install && npm run dev` opens `http://localhost:5173` with no console errors. ✅ Vite v5.4 ready in 2.4s.

- [x] **2. Date utilities** (`src/dateUtils.js`)
  - Functions: `buildMonthMatrix(date)`, `formatYMD(date)`, `isSameDay(a, b)`, `monthLabel(date)`, `addMonths(date, n)`.
  - **Acceptance:** `buildMonthMatrix(new Date('2026-05-15'))` returns 42 `Date` objects starting on a Sunday and containing 2026-05-15.

- [x] **3. App skeleton + state + localStorage** (`src/App.jsx`)
  - State: `events`, `viewDate`, `modal { open, mode, eventId, date }`.
  - Load events from `localStorage` on mount (try/catch). Save on every change.
  - **Acceptance:** Reloading the page restores any events stored under `calendar.events`.

- [x] **4. CalendarHeader** (`src/CalendarHeader.jsx`)
  - Month label + ◀ / Today / ▶ buttons.
  - **Acceptance:** Next/Prev navigate months; Today returns to current month.

- [x] **5. MonthGrid + day cells** (`src/MonthGrid.jsx`)
  - 7×6 grid, weekday header row, day numbers, today highlight, out-of-month dimming.
  - Render event chips per day; click empty cell → add modal; click chip → edit modal.
  - **Acceptance:** An event on 2026-05-20 shows in the correct cell; clicking an empty cell opens the add modal pre-filled with that date.

- [x] **6. EventModal — add flow** (`src/EventModal.jsx`)
  - Controlled form (title, date, time, description). Backdrop click + Escape close it.
  - Validation: title required & ≤100; date required & valid; time `HH:MM` if present; description ≤500.
  - **Acceptance:** Submitting "Meeting / 2026-05-20 / 14:30 / Sync" adds a chip on May 20.

- [x] **7. EventModal — edit & delete**
  - Modal opens pre-filled in edit mode. Delete button removes the event.
  - **Acceptance:** Editing a title updates the chip; Delete removes it and closes the modal.

- [x] **8. Styling + responsive** (`src/styles.css`)
  - CSS grid, modal styles, `max-width: 600px` media query.
  - **Acceptance:** At 375px viewport the grid stays usable and the modal is fully visible.

- [x] **9. Security & polish pass**
  - Confirm: no `dangerouslySetInnerHTML`, localStorage parse fault-tolerant, no secrets, no external network calls.
  - Append a **Review** section below summarizing changes.
  - **Acceptance:** Manual review checklist passes. ✅ See Review below.

## How to run

```powershell
cd C:\Projects\Coursera\VibeCodingWithClaudeCode\calendar-app
npm install
npm run dev
# Open http://localhost:5173
```

## Review

### Summary of changes

A standalone React + Vite single-page app was created from a blank `calendar-app/` directory. Twelve files added:

| File | Purpose |
|---|---|
| `package.json`, `vite.config.js`, `.gitignore` | Project scaffold (react, react-dom, vite, @vitejs/plugin-react). |
| `index.html`, `src/main.jsx` | App entry — mounts `<App />` into `#root`. |
| `src/App.jsx` | Top-level state (`events`, `viewDate`, `modal`), localStorage load/save, CRUD handlers. |
| `src/CalendarHeader.jsx` | Month label + Prev / Today / Next navigation buttons. |
| `src/MonthGrid.jsx` | 7×6 grid, weekday row, today highlight, out-of-month dim, event chips per day, click handlers for add/edit. |
| `src/EventModal.jsx` | Controlled form with title/date/time/description, inline validation, Save / Cancel / Delete. Closes on Escape and backdrop click. |
| `src/dateUtils.js` | `buildMonthMatrix`, `formatYMD`, `isSameDay`, `monthLabel`, `addMonths`. Native `Date` only — no date-fns / dayjs. |
| `src/styles.css` | Layout, modal, chips, mobile media query at `max-width: 600px`. |
| `tasks/todo.md` | This file. |

### Design decisions

- **No state library, no router** — `useState` in `App.jsx` is sufficient.
- **No date library** — native `Date` keeps the dependency tree to react + react-dom + vite.
- **Weeks start Sunday** — matches `Date.prototype.getDay()` directly; no extra modular arithmetic.
- **`crypto.randomUUID()` for event IDs** — browser-native, no `uuid` package needed.
- **Native `<input type="date">` / `<input type="time">`** — browser handles the picker and base format; regex still guards against manual or unsupported-browser input.
- **Sort events by time within a day** — empty time sorts first via `localeCompare`.

### Security review

- ✅ No `dangerouslySetInnerHTML` anywhere — all event titles/descriptions render as React text nodes and are auto-escaped (verified by inspection).
- ✅ `localStorage.getItem` wrapped in `try/catch`, plus `Array.isArray` guard — a corrupted entry falls back to `[]` instead of throwing.
- ✅ `localStorage.setItem` wrapped in `try/catch` — full / disabled storage doesn't crash the app.
- ✅ No network calls, no `fetch`, no `eval`, no `Function()`.
- ✅ No secrets or sensitive data in the frontend — events live only in the user's own `localStorage`.
- ✅ Inputs bounded by `maxLength` (title 100, description 500) and re-validated on submit.
- ✅ `crypto.randomUUID()` is the Web Crypto API — secure source for IDs.
- ⚠️ `npm audit` reports 2 moderate-severity advisories in transitive dev-only dependencies (Vite toolchain). They do not ship in the built bundle and are accepted for this learning-scope project. Run `npm audit fix` if a fix becomes available without breaking changes.

### Notes

- The Vite dev server is currently running in the background — visit http://localhost:5173 in a browser to try the app.
- Events persist under the `localStorage` key `calendar.events`.
