import { NextRequest, NextResponse } from 'next/server';
import faqs from '@/data/faq.json';
import { findMostSimilarFAQ } from '@/lib/similarity';
import OpenAI from 'openai';

const openai = new OpenAI();

export async function POST(req: NextRequest) {
  const { question } = await req.json();
  const matchedFAQ = findMostSimilarFAQ(question, faqs);

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: '당신은 공손한 말투로 대답하는 친절한 챗봇입니다.'
      },
      {
        role: 'user',
        content: `질문: ${question}\n관련 FAQ 질문: ${matchedFAQ.question}\n관련 FAQ 답변: ${matchedFAQ.answer}`
      }
    ],
    model: 'gpt-4'
  });

  return NextResponse.json({ answer: completion.choices[0].message.content });
}