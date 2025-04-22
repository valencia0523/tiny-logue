'use client';

import { useState } from 'react';
import { FaRobot } from 'react-icons/fa';

export default function AITutorButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
      aria-label="Open AI Tutor"
    >
      <FaRobot className="text-xl" />
    </button>
  );
}
