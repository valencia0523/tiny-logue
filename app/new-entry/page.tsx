'use client';

import AITutorButton from '@/components/AITutorButton';
import AITutorPanel from '@/components/AITutorPanel';
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '@/app/styles/calendar-custom.css';
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
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const user = useAuthStore((state) => state.user);

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
      console.log(error);
    }
  };

  return (
    <main className="p-8 mt-25 max-w-md mx-auto md:mt-35 md:max-w-lg">
      <h1 className="text-2xl mb-4 font-bold md:text-4xl">New Logue</h1>

      {user ? (
        <p className="text-gray-600 text-md mb-3 italic">
          Start your logue for today :)
        </p>
      ) : (
        <p className="text-gray-600 text-md mb-3 italic">
          Please log in first if you wish to save.
        </p>
      )}

      {/* Calendar Toggle */}
      <div className="relative mb-4">
        <label className="block text-sm mb-2">📅 Select a date</label>
        <button
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          className="w-full border p-2 rounded text-left bg-white hover:bg-gray-100"
        >
          {selectedDate
            ? selectedDate.toLocaleDateString('en-GB')
            : 'Select a date'}
        </button>

        {isCalendarOpen && (
          <Calendar
            onChange={(date) => {
              setSelectedDate(date as Date);
              setIsCalendarOpen(false);
            }}
            value={selectedDate}
            className="absolute bg-white top-full left-0  shadow-lg rounded z-20 w-[85vw] max-w-sm"
          />
        )}
      </div>

      {/*Note area*/}
      <DiaryTextarea content={content} setContent={setContent} />

      {/* Spell check dropdown */}
      <div className="flex justify-between items-center">
        <div>
          <select
            onChange={(e) => handleSpellCheck(e.target.value as 'uk' | 'us')}
            disabled={loading}
            className="appearance-none py-1.5 px-1 border-2 shadow-sm rounded-md text-left
            focus:outline-none focus:border-[#b5d182] 
            cursor-pointer"
            defaultValue=""
          >
            <option value="" disabled hidden>
              Spelling check
            </option>
            <option value="uk">🇬🇧 British</option>
            <option value="us">🇺🇸 American</option>
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
            <Button className="bg-[#b5d182] text-md hover:cursor-pointer hover:bg-[#a0bd6f] md:py-5">
              Log in
            </Button>
          </Link>
        )}
      </div>

      <div>
        {/* AI tutor button */}
        <AITutorButton onClick={() => setIsTutorOpen(!isTutorOpen)} />

        {/* AI tutor panel */}
        {isTutorOpen && <AITutorPanel />}
      </div>
    </main>
  );
}
