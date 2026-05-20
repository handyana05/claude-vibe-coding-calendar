import { monthLabel } from './dateUtils.js';

export default function CalendarHeader({ viewDate, onPrev, onNext, onToday }) {
  return (
    <header className="cal-header">
      <h1 className="cal-title">{monthLabel(viewDate)}</h1>
      <div className="cal-nav">
        <button type="button" onClick={onPrev} aria-label="Previous month">◀</button>
        <button type="button" onClick={onToday}>Today</button>
        <button type="button" onClick={onNext} aria-label="Next month">▶</button>
      </div>
    </header>
  );
}
