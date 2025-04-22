// ✅ 파일: components/DiaryCard.tsx
import { format } from 'date-fns';

interface DiaryCardProps {
  entry: {
    id: string;
    date: { seconds: number };
    content: string;
  };
  isExpanded: boolean;
  onToggle: () => void;
}

export default function DiaryCard({
  entry,
  isExpanded,
  onToggle,
}: DiaryCardProps) {
  const formattedDate = format(
    new Date(entry.date.seconds * 1000),
    'yyyy-MM-dd'
  );
  const preview =
    entry.content.length > 100
      ? entry.content.slice(0, 100) + '...'
      : entry.content;

  return (
    <div className="border rounded p-4 shadow bg-white transition-all duration-300">
      <div onClick={onToggle} className="cursor-pointer">
        <h3 className="font-bold mb-1">{formattedDate}</h3>
        {!isExpanded ? (
          <p className="text-gray-700 whitespace-pre-wrap line-clamp-2">
            {preview}
          </p>
        ) : (
          <div className="mt-2 space-y-2">
            <p className="text-gray-800 whitespace-pre-wrap">{entry.content}</p>
            <button
              className="text-sm text-blue-500 hover:underline"
              onClick={(e) => {
                e.stopPropagation(); // 카드 확장 방지
                navigator.clipboard.writeText(entry.content);
                alert('일기 내용이 복사되었습니다!');
              }}
            >
              📤 공유하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
