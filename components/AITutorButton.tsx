'use client';

import { RiRobot2Line } from 'react-icons/ri';

export default function AITutorButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 bg-[#EFD6C0] text-[#5A4033] p-4 rounded-full shadow-lg
       hover:bg-[#e6c8b0] transition"
      aria-label="Open AI Tutor"
    >
      <RiRobot2Line className="text-xl" />
    </button>
  );
}
