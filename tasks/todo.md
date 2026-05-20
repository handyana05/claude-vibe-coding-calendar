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

---

# Tailwind CSS Migration Plan (v4)

Goal: replace the hand-rolled `src/styles.css` with Tailwind CSS v4 utility classes, preserving the current look and responsive behavior. Per the Context7 docs for `tailwindcss.com/docs/installation/using-vite`, Tailwind v4 ships an official Vite plugin (`@tailwindcss/vite`) and a single CSS entry (`@import "tailwindcss";`) — no `tailwind.config.js` or PostCSS pipeline required.

## Tasks

- [ ] **T1. Install Tailwind v4 + Vite plugin**
  - `npm install tailwindcss @tailwindcss/vite`
  - **Acceptance:** packages appear in `package.json` devDependencies; install succeeds without peer warnings.

- [ ] **T2. Wire the Vite plugin** (`vite.config.js`)
  - Add `import tailwindcss from '@tailwindcss/vite'` and include `tailwindcss()` in `plugins`.
  - **Acceptance:** `npm run dev` boots without errors.

- [ ] **T3. Replace `src/styles.css` with Tailwind entry + theme tokens**
  - Body becomes `@import "tailwindcss";` plus a small `@theme` block defining the existing color tokens (accent / chip / today / danger / surface / border / muted) so the colors stay identical and reusable as utilities (e.g. `bg-surface`, `text-muted`).
  - Keep one tiny custom layer for `focus-visible` inset ring on `.cell` if utilities can't express it cleanly — otherwise drop the file size to ~10 lines.
  - **Acceptance:** running the app shows no missing styles; the file is dramatically smaller.

- [ ] **T4. Convert `CalendarHeader.jsx` to utilities**
  - `.cal-header`, `.cal-title`, `.cal-nav`, header buttons → Tailwind utilities (flex / gap / typography / border / hover).
  - **Acceptance:** header looks visually identical at desktop and mobile breakpoints.

- [ ] **T5. Convert `MonthGrid.jsx` to utilities**
  - `.month`, `.weekday-row`, `.weekday`, `.grid`, `.cell` (+ `dim` / `today` / focus-visible variants), `.day-number`, `.events`, `.chip` → utilities. Use `grid grid-cols-7`, `min-h-[110px]`, conditional class strings for today/dim states.
  - **Acceptance:** the month grid renders identically; today highlight and out-of-month dim still work; chip ellipsis still works.

- [ ] **T6. Convert `EventModal.jsx` to utilities**
  - `.backdrop`, `.modal`, label/input/textarea, `.error`, `.modal-actions` (with `.primary` / `.danger` variants) → utilities. Use `focus:outline-2` and `focus:outline-accent` to preserve the focus ring.
  - **Acceptance:** modal opens/closes the same way, validation errors render the same red text, primary and danger buttons keep their colors.

- [ ] **T7. Handle the `max-width: 600px` media query**
  - Reproduce via `sm:` / responsive utilities: shrink cell `min-h`, hide `.chip-time` (use `hidden sm:inline`), shrink header text, reduce padding.
  - **Acceptance:** at a 375px viewport the grid stays usable and the time prefix is hidden on chips, matching the current behavior.

- [ ] **T8. Smoke test + dev server check**
  - Run `npm run dev`, open the app, add / edit / delete an event, navigate months, resize to mobile width.
  - **Acceptance:** no console errors; behavior unchanged; visual parity with the prior CSS.

- [ ] **T9. Security & cleanup pass**
  - Confirm no inline `style` injections, no `dangerouslySetInnerHTML`, no new network calls. Remove dead CSS rules. Append a Review subsection below.
  - **Acceptance:** Review subsection lists files changed and notes any visual deltas.

## Notes / design choices to confirm

- **Tailwind v4 (not v3).** v4 dropped `tailwind.config.js` for the common case in favor of CSS-side `@theme` blocks. This matches the "latest" framing of the request. If you'd prefer v3 (with `tailwind.config.js` + `postcss.config.js`), say so and I'll adjust.
- **Theme tokens.** Existing CSS variable names (`--accent`, `--chip-bg`, etc.) will be re-expressed as Tailwind theme tokens so utility names stay readable (`bg-surface`, `text-muted`, `bg-chip`). Without this, every reference to a custom color would need an arbitrary value like `bg-[#dbeafe]`.
- **Visual parity, not redesign.** This pass is a 1:1 translation. No layout, color, or component-shape changes unless you ask.

## Review — Tailwind migration

### What changed

| File | Change |
|---|---|
| `package.json` | Added `tailwindcss` + `@tailwindcss/vite` (Tailwind v4 official Vite plugin). |
| `vite.config.js` | Registered the `tailwindcss()` plugin alongside `react()`. |
| `src/styles.css` | Replaced 211 lines of hand-rolled CSS with `@import "tailwindcss";` plus an `@theme` block defining the existing color palette as theme tokens (`--color-accent`, `--color-chip`, `--color-today`, etc.) and overriding `--breakpoint-sm` to 37.5rem (600px) so the existing mobile breakpoint is preserved exactly. Kept ~10 lines of body/html base styles. |
| `src/App.jsx` | Replaced the `.app` wrapper class with responsive utilities (`mx-auto max-w-[1100px] px-2 py-3 sm:px-4 sm:py-6`). |
| `src/CalendarHeader.jsx` | Header + nav buttons converted to utilities. |
| `src/MonthGrid.jsx` | Grid, weekday row, day cells (with `today` / out-of-month / focus-visible variants via arbitrary variant selectors), and event chips all converted to utilities. Last-row / last-column border removal handled with `[&:nth-child(7n)]:border-r-0` and `[&:nth-last-child(-n+7)]:border-b-0`. |
| `src/EventModal.jsx` | Backdrop, modal shell, label/input/textarea, validation error text, and primary/danger buttons converted to utilities. Focus ring and `[font:inherit]` preserved. |

### Design decisions

- **Tailwind v4 (CSS-first config).** Per Context7's `tailwindcss.com/docs/installation/using-vite`, v4 ships an official Vite plugin and uses CSS-side `@theme` for tokens — no `tailwind.config.js`, no PostCSS pipeline. Matches the user's "latest" framing.
- **Kept the existing palette as `@theme` tokens.** The custom blue accent, soft today yellow, indigo chip, etc. all survive as named tokens, so the utility surface reads naturally (`bg-accent`, `text-muted`, `bg-chip text-chip-ink`, `bg-today`) instead of inline hex.
- **Overrode `--breakpoint-sm` to 600px.** The original media query was `max-width: 600px`. Tailwind's default `sm:` starts at 640px. Overriding the breakpoint keeps mobile-first utilities flipping at the exact same width as before — visual parity, no 40px no-mans-land.
- **Arbitrary variants instead of CSS overrides.** `[&:nth-child(7n)]:border-r-0` and `[&:nth-last-child(-n+7)]:border-b-0` replace the previous CSS selectors so all styling stays in the JSX, not in a hybrid CSS/JSX split.
- **Tiny base CSS kept on purpose.** `body { font-family/background/color }` + `html/body/#root { height: 100% }` stay in `styles.css` because applying them via JSX would require touching `index.html` or `main.jsx` for marginal gain.

### Verification

- `npm run build` → 35 modules transformed; CSS bundle 12.26 kB (3.40 kB gzip).
- Built CSS contains all custom theme tokens (`color-accent-hover`, `color-chip-hover`, `color-danger-soft`, `color-ink`, `color-line`, `color-muted`, `color-row-alt`, `color-surface`, `color-today`).
- Custom breakpoint compiles to `@media (min-width:37.5rem)` ✓.
- `npm run dev` started cleanly on http://localhost:5173 — no warnings, no errors.

### Security pass

- ✅ No `dangerouslySetInnerHTML` introduced. All event titles/descriptions still render as React text nodes (auto-escaped).
- ✅ No inline `style={{ ... }}` from untrusted input. Class strings are static or composed from boolean state (`inMonth`, `isToday`).
- ✅ No new network calls, no `fetch`, no remote stylesheets (Tailwind v4 ships the CSS at build time).
- ✅ The arbitrary value `bg-[rgba(15,23,42,0.45)]` is a static literal, not user-controlled — Tailwind only honors arbitrary values that are present at build time, so this couldn't be turned into an injection vector even if event text were used as a class.
- ✅ `localStorage` handling is unchanged; the existing try/catch + `Array.isArray` guard still apply.
- ✅ Built CSS size is small (~12 kB) — Tailwind's content scan only includes utilities actually used in the JSX.

### How to verify locally

```powershell
cd C:\Projects\Coursera\VibeCodingWithClaudeCode\calendar-app
npm run dev
# Open http://localhost:5173 — the look should be identical to before.
```

