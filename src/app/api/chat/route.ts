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
        content: `당신은 공손한 말투로 답변하는 친절한 고객센터 챗봇입니다.
사용자의 질문과 가장 유사한 FAQ 내용을 참고해서 답변을 생성해야 하며,
FAQ에 포함된 정보만을 바탕으로 성실하고 정확하게 안내해 주세요.
모르겠다는 식의 사과 멘트를 하지 마시고, 제공된 FAQ 정보를 최대한 활용해 답변해 주세요.`
      },
      {
        role: 'user',
        content: `질문: ${question}
관련 FAQ 질문: ${matchedFAQ.question}
관련 FAQ 답변: ${matchedFAQ.answer}

위 FAQ 정보를 참고하여 공손하고 정확하게 답변해 주세요.`
      }
    ],
    model: 'gpt-4'
  });

  return NextResponse.json({ answer: completion.choices[0].message.content });
}