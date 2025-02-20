// A simple extractive summarization algorithm
export function summarizeText(text: string, sentenceCount: number = 3): string {
  // Split text into sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  if (sentences.length <= sentenceCount) return text;

  // Score sentences based on word frequency
  const wordFreq = new Map<string, number>();
  sentences.forEach(sentence => {
    sentence.toLowerCase().split(/\s+/).forEach(word => {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    });
  });

  // Calculate sentence scores
  const sentenceScores = sentences.map(sentence => {
    return {
      sentence,
      score: sentence.toLowerCase().split(/\s+/)
        .reduce((score, word) => score + (wordFreq.get(word) || 0), 0)
    };
  });

  // Get top sentences
  return sentenceScores
    .sort((a, b) => b.score - a.score)
    .slice(0, sentenceCount)
    .map(item => item.sentence.trim())
    .join(' ');
}