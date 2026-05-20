import { useEffect, useState } from 'react';

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TITLE_MAX = 100;
const DESC_MAX = 500;

function validate({ title, date, time, description }) {
  const errors = {};
  const trimmed = title.trim();
  if (!trimmed) errors.title = 'Title is required.';
  else if (trimmed.length > TITLE_MAX) errors.title = `Title must be ≤${TITLE_MAX} characters.`;

  if (!date) errors.date = 'Date is required.';
  else if (!DATE_RE.test(date) || Number.isNaN(new Date(date).getTime())) {
    errors.date = 'Date is invalid.';
  }

  if (time && !TIME_RE.test(time)) errors.time = 'Time must be HH:MM (24h).';

  if (description.length > DESC_MAX) {
    errors.description = `Description must be ≤${DESC_MAX} characters.`;
  }
  return errors;
}

export default function EventModal({ mode, initialDate, event, onSave, onDelete, onClose }) {
  const [title, setTitle] = useState(event?.title ?? '');
  const [date, setDate] = useState(event?.date ?? initialDate ?? '');
  const [time, setTime] = useState(event?.time ?? '');
  const [description, setDescription] = useState(event?.description ?? '');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate({ title, date, time, description });
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onSave({
      id: event?.id,
      title: title.trim(),
      date,
      time,
      description,
    });
  };

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="backdrop" onMouseDown={handleBackdrop} role="dialog" aria-modal="true">
      <form className="modal" onSubmit={handleSubmit} noValidate>
        <h2>{mode === 'edit' ? 'Edit event' : 'Add event'}</h2>

        <label>
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={TITLE_MAX + 1}
            autoFocus
          />
          {errors.title && <span className="error">{errors.title}</span>}
        </label>

        <label>
          Date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          {errors.date && <span className="error">{errors.date}</span>}
        </label>

        <label>
          Time (optional)
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          {errors.time && <span className="error">{errors.time}</span>}
        </label>

        <label>
          Description (optional)
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={DESC_MAX + 1}
          />
          {errors.description && <span className="error">{errors.description}</span>}
        </label>

        <div className="modal-actions">
          {mode === 'edit' && (
            <button
              type="button"
              className="danger"
              onClick={() => onDelete(event.id)}
            >
              Delete
            </button>
          )}
          <span className="spacer" />
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary">Save</button>
        </div>
      </form>
    </div>
  );
}
