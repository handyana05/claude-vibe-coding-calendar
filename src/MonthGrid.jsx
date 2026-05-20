import { useMemo } from 'react';
import { buildMonthMatrix, formatYMD, isSameDay } from './dateUtils.js';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const cellBase =
  'flex min-h-[64px] cursor-pointer flex-col gap-1 border-r border-b border-line bg-surface p-[2px] outline-none ' +
  'focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset ' +
  '[&:nth-child(7n)]:border-r-0 [&:nth-last-child(-n+7)]:border-b-0 ' +
  'sm:min-h-[110px] sm:p-[0.35rem]';

const chipClass =
  'flex w-full min-h-[22px] cursor-pointer items-center gap-1 overflow-hidden whitespace-nowrap rounded ' +
  'border-none bg-chip px-[4px] py-[1px] text-left text-[0.7rem] text-chip-ink text-ellipsis ' +
  'hover:bg-chip-hover sm:px-[6px] sm:py-[2px] sm:text-[0.75rem]';

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
    <div className="overflow-hidden rounded-lg border border-line bg-surface">
      <div className="grid grid-cols-7">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="border-b border-line bg-row-alt px-[0.1rem] py-[0.3rem] text-center text-[0.7rem] font-semibold text-muted sm:p-2 sm:text-[0.8rem]"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((date) => {
          const ymd = formatYMD(date);
          const inMonth = date.getMonth() === viewMonth;
          const isToday = isSameDay(date, today);
          const dayEvents = eventsByDate.get(ymd) || [];
          const cellClass = [
            cellBase,
            !inMonth && 'bg-row-alt text-muted',
            isToday && 'bg-today',
          ]
            .filter(Boolean)
            .join(' ');
          return (
            <div
              key={ymd}
              className={cellClass}
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
              <div className="self-start text-[0.75rem] font-semibold sm:text-[0.85rem]">
                {date.getDate()}
              </div>
              <div className="flex flex-col gap-[2px] overflow-hidden">
                {dayEvents.map((ev) => (
                  <button
                    key={ev.id}
                    type="button"
                    className={chipClass}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(ev.id);
                    }}
                    title={ev.description || ev.title}
                  >
                    {ev.time && (
                      <span className="hidden font-semibold sm:inline">{ev.time}</span>
                    )}
                    <span className="overflow-hidden text-ellipsis">{ev.title}</span>
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
