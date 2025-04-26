'use client';

import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
      <ReactDatePicker
        selected={selectedDate}
        onChange={onChange}
        dateFormat="dd/MM/yyyy"
        className="border p-2 rounded w-full"
      />
    </div>
  );
}
