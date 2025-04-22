'use client';

import { useState } from 'react';

export default function AITestPage() {
  const [english, setEnglish] = useState('');
  const [korean, setKorean] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCorrect = async () => {
    setLoading(true);
    const res = await fetch('/api/meaning-correct', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ english, korean }),
    });
    const data = await res.json();
    setResult(data.result);
    setLoading(false);
  };

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🇰🇷 의미 기반 AI 교정 테스트</h1>

      <textarea
        value={english}
        onChange={(e) => setEnglish(e.target.value)}
        placeholder="틀린 영어 문장 입력"
        rows={3}
        className="w-full p-3 border rounded mb-4"
      />

      <textarea
        value={korean}
        onChange={(e) => setKorean(e.target.value)}
        placeholder="한국어 의미 입력"
        rows={2}
        className="w-full p-3 border rounded mb-4"
      />

      <button
        onClick={handleCorrect}
        disabled={loading || !english || !korean}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Correcting...' : 'AI 교정 요청'}
      </button>

      {result && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">✅ 교정 결과:</h2>
          <pre className="whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </main>
  );
}
