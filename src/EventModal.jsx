import { useEffect, useState } from 'react';

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TITLE_MAX = 100;
const DESC_MAX = 500;

const labelClass = 'flex flex-col gap-1 text-[0.85rem] text-muted';

const inputClass =
  'min-h-9 rounded-md border border-line bg-white p-2 text-ink [font:inherit] ' +
  'focus:border-accent focus:outline-2 focus:outline-accent focus:outline-offset-[-1px]';

const textareaClass = `${inputClass} min-h-[70px] resize-y`;

const buttonBase =
  'min-h-9 cursor-pointer rounded-md border border-line bg-surface px-3.5 py-2 [font:inherit]';

const primaryClass = `${buttonBase} border-accent bg-accent text-white hover:bg-accent-hover`;
const dangerClass = `${buttonBase} border-danger bg-white text-danger hover:bg-danger-soft`;

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,23,42,0.45)] p-4"
      onMouseDown={handleBackdrop}
      role="dialog"
      aria-modal="true"
    >
      <form
        className="flex max-h-[90vh] w-full max-w-full flex-col gap-3 overflow-y-auto rounded-[10px] bg-surface p-4 shadow-[0_10px_40px_rgba(0,0,0,0.2)] sm:max-w-[440px] sm:p-5"
        onSubmit={handleSubmit}
        noValidate
      >
        <h2 className="m-0 mb-1 text-[1.2rem]">{mode === 'edit' ? 'Edit event' : 'Add event'}</h2>

        <label className={labelClass}>
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={TITLE_MAX + 1}
            className={inputClass}
            autoFocus
          />
          {errors.title && <span className="text-[0.75rem] text-danger">{errors.title}</span>}
        </label>

        <label className={labelClass}>
          Date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
          />
          {errors.date && <span className="text-[0.75rem] text-danger">{errors.date}</span>}
        </label>

        <label className={labelClass}>
          Time (optional)
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={inputClass}
          />
          {errors.time && <span className="text-[0.75rem] text-danger">{errors.time}</span>}
        </label>

        <label className={labelClass}>
          Description (optional)
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={DESC_MAX + 1}
            className={textareaClass}
          />
          {errors.description && (
            <span className="text-[0.75rem] text-danger">{errors.description}</span>
          )}
        </label>

        <div className="mt-1 flex flex-wrap items-center gap-2">
          {mode === 'edit' && (
            <button type="button" className={dangerClass} onClick={() => onDelete(event.id)}>
              Delete
            </button>
          )}
          <span className="flex-1" />
          <button type="button" className={buttonBase} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={primaryClass}>
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
