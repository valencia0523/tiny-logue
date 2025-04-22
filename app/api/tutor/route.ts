// app/api/tutor/route.ts
import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // 서버에서는 NEXT_PUBLIC ❌
});

export async function POST(req: NextRequest) {
  const { original, meaning, variant } = await req.json();

  const prompt = `
You are an English writing assistant.

A user wrote this English sentence: "${original}"
They want to express this meaning (in any language): "${meaning}"

Please:
1. Correct and improve the sentence using ${
    variant === 'uk' ? 'British' : 'American'
  } English conventions.
2. Ensure the corrected sentence reflects the intended meaning.
3. Provide a short, natural dialogue (at least 4 lines) where the corrected sentence could appear.

Respond in this format:

Corrected Sentence:
...

Dialogue Example:
...
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const result = response.choices[0].message.content;

    return NextResponse.json({ result });
  } catch (error) {
    console.error('❌ AI Tutor 오류:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
