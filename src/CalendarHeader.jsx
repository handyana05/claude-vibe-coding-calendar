import { monthLabel } from './dateUtils.js';

const navButton =
  'min-h-9 cursor-pointer rounded-md border border-line bg-surface px-3.5 py-2 text-[0.95rem] hover:bg-accent-soft';

export default function CalendarHeader({ viewDate, onPrev, onNext, onToday }) {
  return (
    <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <h1 className="m-0 text-[1.2rem] sm:text-2xl">{monthLabel(viewDate)}</h1>
      <div className="flex gap-2">
        <button type="button" onClick={onPrev} className={navButton} aria-label="Previous month">◀</button>
        <button type="button" onClick={onToday} className={navButton}>Today</button>
        <button type="button" onClick={onNext} className={navButton} aria-label="Next month">▶</button>
      </div>
    </header>
  );
}
