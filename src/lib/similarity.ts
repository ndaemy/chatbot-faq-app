export function findMostSimilarFAQ(input: string, faqs: { question: string; answer: string }[]) {
  const normalize = (text: string) => text.toLowerCase().replace(/[^\w\s]/gi, '');
  const inputNorm = normalize(input);
  let bestScore = -1;
  let best = faqs[0];

  for (const faq of faqs) {
    const score = jaccard(inputNorm.split(' '), normalize(faq.question).split(' '));
    if (score > bestScore) {
      bestScore = score;
      best = faq;
    }
  }

  return best;
}

function jaccard(a: string[], b: string[]) {
  const setA = new Set(a);
  const setB = new Set(b);
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}
