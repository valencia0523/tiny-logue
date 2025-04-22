'use client';

import { useRef, useEffect } from 'react';

export default function DiaryTextarea({
  content,
  setContent,
}: {
  content: string;
  setContent: (val: string) => void;
}) {
  const divRef = useRef<HTMLDivElement>(null);

  // 수정된 content를 반영 (예: OpenAI에서 받은 bold 포함된 문자열)
  useEffect(() => {
    if (divRef.current && divRef.current.innerHTML !== content) {
      divRef.current.innerHTML = content;
    }
  }, [content]);

  return (
    <div className="mb-6">
      <label className="block text-sm mb-2 text-gray-600">📝 오늘의 기록</label>
      <div
        ref={divRef}
        contentEditable
        className="w-full min-h-[200px] p-4 rounded-2xl bg-[#fdfdfd] border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 text-[15px] leading-relaxed"
        onInput={(e) => setContent((e.target as HTMLDivElement).innerHTML)}
        suppressContentEditableWarning
      />
    </div>
  );
}
