import { useMemo } from 'react';
import { buildMonthMatrix, formatYMD, isSameDay } from './dateUtils.js';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function MonthGrid({ viewDate, events, onAddClick, onEventClick }) {
  const cells = useMemo(() => buildMonthMatrix(viewDate), [viewDate]);
  const today = new Date();
  const viewMonth = viewDate.getMonth();

  const eventsByDate = useMemo(() => {
    const map = new Map();
    for (const e of events) {
      const list = map.get(e.date);
      if (list) list.push(e);
      else map.set(e.date, [e]);
    }
    for (const list of map.values()) {
      list.sort((a, b) => (a.time || '').localeCompare(b.time || ''));
    }
    return map;
  }, [events]);

  return (
    <div className="month">
      <div className="weekday-row">
        {WEEKDAYS.map((d) => (
          <div key={d} className="weekday">{d}</div>
        ))}
      </div>
      <div className="grid">
        {cells.map((date) => {
          const ymd = formatYMD(date);
          const inMonth = date.getMonth() === viewMonth;
          const isToday = isSameDay(date, today);
          const dayEvents = eventsByDate.get(ymd) || [];
          return (
            <div
              key={ymd}
              className={`cell${inMonth ? '' : ' dim'}${isToday ? ' today' : ''}`}
              onClick={() => onAddClick(date)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onAddClick(date);
                }
              }}
            >
              <div className="day-number">{date.getDate()}</div>
              <div className="events">
                {dayEvents.map((ev) => (
                  <button
                    key={ev.id}
                    type="button"
                    className="chip"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(ev.id);
                    }}
                    title={ev.description || ev.title}
                  >
                    {ev.time && <span className="chip-time">{ev.time}</span>}
                    <span className="chip-title">{ev.title}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
