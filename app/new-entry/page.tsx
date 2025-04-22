'use client';

import AITutorButton from '@/components/AITutorButton';
import AITutorPanel from '@/components/AITutorPanel';
import { useState } from 'react';
import DatePicker from '@/components/DatePicker';
import DiaryTextarea from '@/components/DiaryTextarea';

import { saveEntryToFirestore } from '@/lib/firestore';
import { useAuthStore } from '@/lib/store/useAuthStore';

export default function NewEntryPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const [isTutorOpen, setIsTutorOpen] = useState(false);

  const handleSpellCheck = async (dialect: 'uk' | 'us') => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/spellcheck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: content, dialect }),
      });

      const data = await res.json();
      setContent(data.result); // bold 포함된 텍스트
    } catch (error) {
      alert('스펠링 교정 중 오류가 발생했어요.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const user = useAuthStore().user;

  const getPlainText = (html: string): string => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || '';
  };

  const handleSave = async () => {
    if (!user || !selectedDate || !content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    const plainText = getPlainText(content);

    try {
      await saveEntryToFirestore({
        uid: user.uid,
        date: selectedDate,
        content: plainText,
      });

      alert('일기가 저장되었습니다!');
      setContent('');
      setSelectedDate(new Date());
    } catch (error) {
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">New Entry</h1>

      {/* 🔒 안내 문구 */}
      {!user && (
        <p className="mb-4 text-sm text-gray-600">
          저장을 원하시면 먼저 로그인해 주세요.
        </p>
      )}

      {/* 📅 날짜 선택 */}
      <DatePicker selectedDate={selectedDate} onChange={setSelectedDate} />

      {/* 📝 다이어리 입력 */}
      <DiaryTextarea content={content} setContent={setContent} />

      {/* 🇬🇧🇺🇸 스펠링 체크 버튼 */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={() => handleSpellCheck('uk')}
          disabled={loading}
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
        >
          🇬🇧 영국식 스펠링 체크
        </button>
        <button
          onClick={() => handleSpellCheck('us')}
          disabled={loading}
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
        >
          🇺🇸 미국식 스펠링 체크
        </button>
      </div>

      {/* 💾 저장 or 🔐 로그인 안내 */}
      {user ? (
        <button
          onClick={handleSave}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          💾 저장
        </button>
      ) : (
        <div className="mt-4">
          <a
            href="/signup"
            className="inline-block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            로그인 / 회원가입 하러 가기 →
          </a>
        </div>
      )}

      <div>
        {/* AI 튜터 버튼 */}
        <AITutorButton onClick={() => setIsTutorOpen(!isTutorOpen)} />

        {/* AI 튜터 패널 */}
        {isTutorOpen && <AITutorPanel />}
      </div>
    </main>
  );
}
