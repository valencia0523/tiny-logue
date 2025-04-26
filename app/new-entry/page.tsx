'use client';

import AITutorButton from '@/components/AITutorButton';
import AITutorPanel from '@/components/AITutorPanel';
import { useState } from 'react';
import DatePicker from '@/components/DatePicker';
import DiaryTextarea from '@/components/DiaryTextarea';
import { saveEntryToFirestore } from '@/lib/firestore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
      setContent(data.result); //bold text
    } catch (error) {
      toast.error('An error occurred during spell check.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const user = useAuthStore((state) => state.user);

  const getPlainText = (html: string): string => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || '';
  };

  const handleSave = async () => {
    if (!user || !selectedDate || !content.trim()) {
      toast.error('Please enter some content.');
      return;
    }

    const plainText = getPlainText(content);

    try {
      await saveEntryToFirestore({
        uid: user.uid,
        date: selectedDate,
        content: plainText,
      });
      toast.success('Saved your note!');
      setContent('');
      setSelectedDate(new Date());
    } catch (error) {
      toast.error('An error occurred while saving.');
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold">New Entry</h1>

      {user ? (
        <p className="text-gray-600 text-md mb-3 italic">
          Write a note for today :)
        </p>
      ) : (
        <p className="text-gray-600 text-md mb-3 italic">
          Please log in first if you wish to save.
        </p>
      )}

      {/*Calendar*/}
      <DatePicker selectedDate={selectedDate} onChange={setSelectedDate} />

      {/*Note area*/}
      <DiaryTextarea content={content} setContent={setContent} />

      {/* Spell check dropdown */}
      <div className="flex justify-between items-center">
        <div>
          <select
            onChange={(e) => handleSpellCheck(e.target.value as 'uk' | 'us')}
            disabled={loading}
            className="appearance-none py-1.5 px-1 border-2 shadow-sm rounded-md text-center
            focus:outline-none focus:border-[#b5d182] 
            cursor-pointer"
            defaultValue=""
          >
            <option value="" disabled hidden>
              Spelling check
            </option>
            <option value="uk">UK spelling check</option>
            <option value="us">US spelling check</option>
          </select>
        </div>

        {/*Save or Log in */}
        {user ? (
          <Button
            onClick={handleSave}
            className="bg-[#b5d182] text-md hover:cursor-pointer hover:bg-[#a0bd6f]"
          >
            Save
          </Button>
        ) : (
          <Link href="/login">
            <Button className="bg-[#b5d182] text-md hover:cursor-pointer hover:bg-[#a0bd6f] md:py-7">
              Log in
            </Button>
          </Link>
        )}
      </div>

      <div>
        {/* AI 튜터 버튼 */}
        <AITutorButton onClick={() => setIsTutorOpen(!isTutorOpen)} />

        {/* AI 튜터 패널 */}
        {isTutorOpen && <AITutorPanel />}
      </div>
    </main>
  );
}
