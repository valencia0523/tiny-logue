'use client';

import { useState } from 'react';

// 🔧 GPT 결과 파싱 함수
const parseResult = (raw: string): { sentence: string; dialogue: string[] } => {
  const [_, sentenceBlock, dialogueBlock] = raw.split(
    /Corrected Sentence:|Dialogue Example:/
  );
  const sentence = sentenceBlock?.trim() || '';
  const dialogue = dialogueBlock?.trim().split('\n') || [];
  return { sentence, dialogue };
};

export default function AITutorPanel() {
  const [original, setOriginal] = useState('');
  const [meaning, setMeaning] = useState('');
  const [variant, setVariant] = useState<'uk' | 'us'>('uk');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    if (!original || !meaning) return;

    setLoading(true);
    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ original, meaning, variant }),
      });

      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      alert('변환 중 오류가 발생했어요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 bg-white border rounded-lg shadow-lg w-96 p-4 z-40">
      <div className="mb-2 text-sm text-gray-600 font-semibold">
        ✍️ 영어 문장
      </div>
      <textarea
        value={original}
        onChange={(e) => setOriginal(e.target.value)}
        className="w-full border p-2 rounded mb-3"
        rows={2}
        placeholder="사용자가 작성한 문장"
      />

      <div className="mb-2 text-sm text-gray-600 font-semibold">
        💡 의도한 의미 (모국어로)
      </div>
      <textarea
        value={meaning}
        onChange={(e) => setMeaning(e.target.value)}
        className="w-full border p-2 rounded mb-3"
        rows={2}
        placeholder="어떤 의미를 담고 싶은가요?"
      />

      <div className="mb-3 flex items-center justify-between">
        <label className="text-sm text-gray-600 font-medium">
          🌐 영어 종류
        </label>
        <select
          value={variant}
          onChange={(e) => setVariant(e.target.value as 'uk' | 'us')}
          className="border p-1 rounded"
        >
          <option value="uk">🇬🇧 British</option>
          <option value="us">🇺🇸 American</option>
        </select>
      </div>

      <button
        onClick={handleConvert}
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        {loading ? '변환 중...' : '🔁 Convert'}
      </button>

      {result &&
        (() => {
          const { sentence, dialogue } = parseResult(result);
          return (
            <div className="mt-4 border-t pt-3 text-sm">
              <strong className="block mb-2 text-blue-600">
                ✅ Corrected Sentence
              </strong>
              <div className="bg-blue-50 text-blue-900 p-3 rounded mb-4">
                {sentence}
              </div>

              <strong className="block mb-2 text-green-600">
                💬 Dialogue Example
              </strong>
              <div className="flex flex-col gap-2">
                {dialogue.map((line, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded max-w-[90%] text-sm ${
                      line.startsWith('A:')
                        ? 'bg-gray-100 self-start'
                        : 'bg-blue-100 self-end'
                    }`}
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
    </div>
  );
}
