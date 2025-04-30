'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { fetchAllUserEntries } from '@/lib/firestore';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '@/app/styles/calendar-custom.css';
import DiaryCard from '@/components/DiaryCard';
import { FaCalendarAlt, FaSearch } from 'react-icons/fa';
import { Timestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';

interface DiaryEntry {
  id: string;
  uid: string;
  content: string;
  date: Timestamp;
  createdAt?: Timestamp;
}

export default function MyLoguePage() {
  const user = useAuthStore().user;
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchKeyword, setSearchKeyword] = useState('');
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<DiaryEntry[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedButton, setSelectedButton] = useState<'calendar' | 'search'>(
    'calendar'
  );

  // Fetch all entries once
  const loadEntries = async () => {
    if (!user) return;
    const allData = await fetchAllUserEntries(user.uid);
    // console.log('Fetched entries:', allData);
    setEntries(allData);
  };

  useEffect(() => {
    loadEntries();
  }, [user]);

  // Filter entries based on the selected date
  useEffect(() => {
    if (!selectedDate || !entries.length) {
      setFilteredEntries([]);
      return;
    }

    const start = new Date(selectedDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(selectedDate);
    end.setHours(23, 59, 59, 999);

    const matched = entries.filter((entry) => {
      const entryDate = (entry.date as Timestamp).toDate();
      return entryDate >= start && entryDate <= end;
    });

    setFilteredEntries(matched);
  }, [selectedDate, entries]);

  const handleToggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <main className="p-8 mt-25 max-w-md mx-auto md:mt-35 md:max-w-4xl">
      <div className="flex flex-col gap-10 md:flex-row md:justify-between md:gap-15">
        {/* Left side: calendar and search */}
        <div className="w-full md:min-w-[280px] md:max-w-[300px] space-y-4">
          <div className="flex gap-2 md:flex-row md:items-center">
            <Button
              onClick={() => {
                setShowCalendar(true);
                setShowSearch(false);
                setSearchKeyword('');
                setSelectedDate(new Date()); // Reset to today
                setSelectedButton('calendar');
              }}
              className={`p-2 rounded text-gray-100 hover:cursor-pointer hover:bg-[#a0bd6f] ${
                selectedButton === 'calendar'
                  ? 'bg-[#a0bd6f] text-black'
                  : 'bg-[#b5d182]'
              }`}
              variant="outline"
            >
              <FaCalendarAlt />
            </Button>
            <Button
              onClick={() => {
                setShowSearch(true);
                setShowCalendar(false);
                setSelectedButton('search');
              }}
              className={`p-2 rounded text-gray-100 hover:cursor-pointer hover:bg-[#a0bd6f] ${
                selectedButton === 'search'
                  ? 'bg-[#a0bd6f] text-black'
                  : 'bg-[#b5d182]'
              }`}
              variant="outline"
            >
              <FaSearch />
            </Button>
          </div>

          {/* Calendar view */}
          {showCalendar && (
            <div className="mt-2 relative w-full">
              <Calendar
                className="min-w-[320px] max-w-full"
                onChange={(date) => setSelectedDate(date as Date)}
                value={selectedDate}
                tileContent={({ date }) => {
                  if (!entries.length) return null;

                  const today = new Date();
                  const isToday =
                    date.getFullYear() === today.getFullYear() &&
                    date.getMonth() === today.getMonth() &&
                    date.getDate() === today.getDate();

                  const entryDates = entries.map((entry) => {
                    const entryDate = (entry.date as Timestamp).toDate();
                    return `${entryDate.getFullYear()}-${entryDate.getMonth()}-${entryDate.getDate()}`;
                  });

                  const thisDateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
                  const isWritten = entryDates.includes(thisDateKey);

                  return (
                    <>
                      {/* Show a star if there is a diary entry */}
                      {isWritten && (
                        <div className="absolute top-1 left-1 text-xs text-yellow-500">
                          ⭐
                        </div>
                      )}
                      {/* Bold today's date */}
                      {isToday && (
                        <div className="absolute inset-0 flex items-center justify-center font-bold text-black">
                          {date.getDate()}
                        </div>
                      )}
                    </>
                  );
                }}
                tileClassName={({ date }) => {
                  const selected =
                    selectedDate &&
                    date.getFullYear() === selectedDate.getFullYear() &&
                    date.getMonth() === selectedDate.getMonth() &&
                    date.getDate() === selectedDate.getDate();

                  return selected ? 'selected-tile' : '';
                }}
              />
            </div>
          )}

          {/* Search view */}
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

        {/* Right side: diary entries */}
        <div className="w-full md:flex-1 md:mt-10">
          {/* Search mode */}
          {showSearch && searchKeyword.trim() ? (
            <>
              {entries
                .filter((entry) => entry.content?.includes(searchKeyword))
                .map((entry) => (
                  <DiaryCard
                    key={entry.id}
                    entry={entry}
                    isExpanded={expandedId === entry.id}
                    onToggle={() => handleToggleExpand(entry.id)}
                  />
                ))}
            </>
          ) : (
            <>
              {filteredEntries.length === 0 ? (
                <p className="text-gray-500">No notes for this day.</p>
              ) : (
                filteredEntries.map((entry) => (
                  <DiaryCard
                    key={entry.id}
                    entry={entry}
                    isExpanded={expandedId === entry.id}
                    onToggle={() => handleToggleExpand(entry.id)}
                  />
                ))
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
