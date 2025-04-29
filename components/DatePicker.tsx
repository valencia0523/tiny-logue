'use client';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '@/app/styles/calendar-custom.css';

export default function DatePicker({
  selectedDate,
  onChange,
}: {
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm mb-2">📅 Select a date</label>
      <Calendar
        onChange={(date) => onChange(date as Date)}
        value={selectedDate}
        className="border p-2 rounded w-full"
      />
    </div>
  );
}
