import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { input, dialect } = await req.json();

  const prompt = `Please correct the following English text using ${
    dialect === 'uk' ? 'British' : 'American'
  } spelling, grammar, and capitalisation.

Wrap any corrected or changed words using <b>...</b> HTML tags.
Return only the corrected sentence. Do not include any explanations, labels, or introductory text like "Corrected:". Just return the sentence only.

Text:
${input}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0,
  });

  const result = response.choices[0].message.content;

  return NextResponse.json({ result });
}
