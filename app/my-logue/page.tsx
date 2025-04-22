// ✅ 파일: app/my-logue/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import {
  fetchUserEntriesByDate,
  fetchUserEntriesByKeyword,
} from '@/lib/firestore';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar-custom.css'; // 커스텀 스타일 추가
import DiaryCard from '@/components/DiaryCard';
import { FaCalendarAlt, FaSearch } from 'react-icons/fa';

export default function MyLoguePage() {
  const user = useAuthStore().user;
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchKeyword, setSearchKeyword] = useState('');
  const [entries, setEntries] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(true);
  const [showSearch, setShowSearch] = useState(false);

  const loadEntries = async () => {
    if (!user) return;
    if (searchKeyword.trim()) {
      const data = await fetchUserEntriesByKeyword(user.uid, searchKeyword);
      setEntries(data);
    } else {
      const data = await fetchUserEntriesByDate(user.uid, selectedDate);
      setEntries(data);
    }
  };

  useEffect(() => {
    loadEntries();
  }, [selectedDate, searchKeyword, user]);

  const handleToggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* 왼쪽: 1/3 영역 */}
        <div className="md:w-1/3 w-full space-y-4">
          <div className="flex gap-2 md:flex-row md:items-center">
            <button
              onClick={() => {
                setShowCalendar(!showCalendar);
                setShowSearch(false);
                setSearchKeyword(''); // ✅ 검색 입력 초기화
                setSelectedDate(new Date()); // ✅ 날짜 초기화 (오늘)
              }}
              className="p-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              <FaCalendarAlt />
            </button>
            <button
              onClick={() => {
                setShowSearch(!showSearch);
                setShowCalendar(false);
              }}
              className="p-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              <FaSearch />
            </button>
          </div>

          {showCalendar && (
            <div className="mt-2">
              <Calendar
                onChange={(date) => setSelectedDate(date as Date)}
                value={selectedDate}
                tileContent={({ date }) => {
                  const today = new Date();
                  const isToday =
                    date.getFullYear() === today.getFullYear() &&
                    date.getMonth() === today.getMonth() &&
                    date.getDate() === today.getDate();

                  const isSelected =
                    selectedDate &&
                    date.getFullYear() === selectedDate.getFullYear() &&
                    date.getMonth() === selectedDate.getMonth() &&
                    date.getDate() === selectedDate.getDate();

                  return isToday && !isSelected ? (
                    <div className="absolute top-1 left-1 text-xs text-yellow-500">
                      ⭐
                    </div>
                  ) : null;
                }}
                tileClassName={({ date }) => {
                  const isSelected =
                    selectedDate &&
                    date.getFullYear() === selectedDate.getFullYear() &&
                    date.getMonth() === selectedDate.getMonth() &&
                    date.getDate() === selectedDate.getDate();

                  return isSelected ? 'selected-tile' : '';
                }}
              />
            </div>
          )}

          {showSearch && (
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Search by keyword"
              className="w-full p-2 border rounded mt-2"
            />
          )}
        </div>

        {/* 오른쪽: 2/3 영역 */}
        <div className="md:w-2/3 w-full space-y-4">
          {entries.length === 0 ? (
            <p className="text-gray-500">
              {searchKeyword.trim()
                ? 'No results for this keyword.'
                : 'No entry for today.'}
            </p>
          ) : (
            entries.map((entry) => (
              <DiaryCard
                key={entry.id}
                entry={entry}
                isExpanded={expandedId === entry.id}
                onToggle={() => handleToggleExpand(entry.id)}
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
}
