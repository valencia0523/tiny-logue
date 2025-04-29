import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
2. Ensure the corrected sentence accurately reflects the intended meaning.
3. Provide a short, natural dialogue (at least 4 lines) where the corrected sentence could naturally appear.
4. In the dialogue example, only use "A:" and "B:" as speakers (do not invent names like John, Amy, etc.).

Respond strictly in this format:

Corrected Sentence:
...

Dialogue Example:
A: ...
B: ...
A: ...
B: ...
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
    console.error('AI Tutor error:', error);
    return NextResponse.json(
      { error: 'An error has occurred while processing your request.' },
      { status: 500 }
    );
  }
}
