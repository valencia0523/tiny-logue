import { format } from 'date-fns';
import { toast } from 'sonner';

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
    'dd/MM/yyyy'
  );
  const preview =
    entry.content.length > 100
      ? entry.content.slice(0, 100) + '...'
      : entry.content;

  return (
    <div className="border rounded p-4 shadow bg-white transition-all duration-300 md:w-md">
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
                e.stopPropagation();
                navigator.clipboard.writeText(entry.content);
                toast('The note has been copied to your clipboard');
              }}
            >
              📤 Share
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
