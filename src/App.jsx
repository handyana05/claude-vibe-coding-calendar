import { useState, useEffect, useCallback } from 'react';
import CalendarHeader from './CalendarHeader.jsx';
import MonthGrid from './MonthGrid.jsx';
import EventModal from './EventModal.jsx';
import { addMonths, formatYMD } from './dateUtils.js';

const STORAGE_KEY = 'calendar.events';

function loadEvents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [events, setEvents] = useState(loadEvents);
  const [viewDate, setViewDate] = useState(() => new Date());
  const [modal, setModal] = useState({ open: false, mode: 'add', eventId: null, date: '' });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch {
      // Storage full or disabled — silently ignore; events still live in memory.
    }
  }, [events]);

  const openAdd = useCallback((date) => {
    setModal({ open: true, mode: 'add', eventId: null, date });
  }, []);

  const openEdit = useCallback((eventId) => {
    setModal({ open: true, mode: 'edit', eventId, date: '' });
  }, []);

  const closeModal = useCallback(() => {
    setModal((m) => ({ ...m, open: false }));
  }, []);

  const saveEvent = useCallback((data) => {
    setEvents((prev) => {
      if (data.id) {
        return prev.map((e) => (e.id === data.id ? data : e));
      }
      return [...prev, { ...data, id: crypto.randomUUID() }];
    });
    closeModal();
  }, [closeModal]);

  const deleteEvent = useCallback((id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    closeModal();
  }, [closeModal]);

  const editingEvent = modal.mode === 'edit'
    ? events.find((e) => e.id === modal.eventId) || null
    : null;

  return (
    <div className="mx-auto max-w-[1100px] px-2 py-3 sm:px-4 sm:py-6">
      <CalendarHeader
        viewDate={viewDate}
        onPrev={() => setViewDate((d) => addMonths(d, -1))}
        onNext={() => setViewDate((d) => addMonths(d, 1))}
        onToday={() => setViewDate(new Date())}
      />
      <MonthGrid
        viewDate={viewDate}
        events={events}
        onAddClick={(date) => openAdd(formatYMD(date))}
        onEventClick={(id) => openEdit(id)}
      />
      {modal.open && (
        <EventModal
          mode={modal.mode}
          initialDate={modal.date}
          event={editingEvent}
          onSave={saveEvent}
          onDelete={deleteEvent}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
