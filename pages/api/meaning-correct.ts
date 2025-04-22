import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { english, korean } = req.body;

  const prompt = `
영어 문장을 교정해 주세요. 한국어 의미에 맞게 자연스럽고 정확한 문장으로 바꿔 주세요.
틀린 영어 문장: "${english}"
한국어 의미: "${korean}"

- 교정된 문장
- 짧은 설명 (왜 틀렸는지)
- 예시 대화문 4줄
형식으로 출력해 주세요.
`;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are a bilingual English writing tutor for Korean learners.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const reply = chatCompletion.choices[0].message.content;
    res.status(200).json({ result: reply });
  } catch (err) {
    console.error('AI 오류:', err);
    res.status(500).json({ error: 'AI 요청 실패' });
  }
}
