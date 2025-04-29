'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Parse gpt
const parseResult = (raw: string): { sentence: string; dialogue: string[] } => {
  const [, sentenceBlock, dialogueBlock] = raw.split(
    /Corrected Sentence:|Dialogue Example:/
  );
  const sentence = sentenceBlock?.trim() || '';
  const dialogue = dialogueBlock?.trim().split('\n') || [];
  return { sentence, dialogue };
};

export default function AITutorPanel() {
  const [original, setOriginal] = useState('');
  const [meaning, setMeaning] = useState('');
  const [variant, setVariant] = useState<'' | 'uk' | 'us'>('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleConvert = async () => {
    if (!original || !meaning)
      toast.error(
        'Please complete both the English sentence and the intended meaning before converting.'
      );
    return;

    // Check if the original sentence if English
    const isEnglish = /^[\x00-\x7F]*$/.test(original);
    if (!isEnglish) {
      toast.error(
        'Please make sure the English sentence is written in English.'
      );
      return;
    }

    // Check if variant is selected
    if (!variant) {
      toast.error('Please select an English variant.');
      return;
    }

    // If all inputs are valid
    setLoading(true);
    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ original, meaning, variant }),
      });

      const data = await res.json();
      setResult(data.result);
    } catch (error) {
      toast.error('An error occurred during conversion.');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Copy function
  const copySentence = async (sentence: string) => {
    try {
      await navigator.clipboard.writeText(sentence);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      toast.error('Failed to copy.');
      console.log(error);
    }
  };

  return (
    <div
      className="p-4 bg-white fixed bottom-22 right-6 border-2 border-[#EFD6C0] rounded-lg shadow-lg 
    w-85 max-w-lg max-h-[60vh] overflow-y-auto z-40"
    >
      <div className="">
        <div className="text-gray-500 text-sm mb-4">
          Enter your English sentence and its intended meaning. AI will suggest
          a correction and a dialogue example.
        </div>
        <div className="mb-2 text-sm text-gray-600 font-semibold">
          ✍️ English Sentence
        </div>
        <textarea
          value={original}
          onChange={(e) => setOriginal(e.target.value)}
          className="w-full border p-2 rounded mb-3"
          rows={3}
          placeholder="Write your sentence here"
        />

        <div className="mb-2 text-sm text-gray-600 font-semibold">
          💡 Intended Meaning <br />
          <span className="ml-5">(in your native language)</span>
        </div>
        <textarea
          value={meaning}
          onChange={(e) => setMeaning(e.target.value)}
          className="w-full border p-2 rounded mb-3"
          rows={3}
          placeholder="What meaning would you like to convey?"
        />

        <div className="flex justify-between">
          <div className="mb-3 flex items-center justify-between">
            <select
              value={variant}
              onChange={(e) => setVariant(e.target.value as 'uk' | 'us')}
              className="border p-1 rounded py-1.5 px-1 shadow-sm cursor-pointer"
            >
              <option value="" disabled hidden>
                English Variant
              </option>
              <option value="uk">🇬🇧 British</option>
              <option value="us">🇺🇸 American</option>
            </select>
          </div>

          <Button
            onClick={handleConvert}
            disabled={loading}
            className="bg-[#EFD6C0] text-[#5A4033] hover:cursor-pointer hover:bg-[#e6c8b0]"
          >
            {loading ? 'Converting...' : '🔁 Convert'}
          </Button>
        </div>

        {result &&
          (() => {
            const { sentence, dialogue } = parseResult(result);
            return (
              <>
                <div className="text-center italic">
                  Take a look at your result below.
                </div>
                <div className="mt-4 border-t pt-3 text-sm">
                  <strong className="block mb-2 text-blue-600">
                    ✅ Corrected Sentence
                  </strong>

                  <div className="bg-blue-50 text-blue-900 p-3 rounded">
                    {sentence}
                  </div>
                  <div className="flex justify-end mb-4">
                    <Button
                      onClick={() => copySentence(sentence)}
                      variant="outline"
                      className="scale-80"
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
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
              </>
            );
          })()}
      </div>
    </div>
  );
}
