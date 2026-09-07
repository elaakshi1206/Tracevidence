export interface ExtractedClaimCandidate {
  text: string;
  targetEntity: string;
  confidence: number;
}

export function extractAtomicClaimsFromText(input: string): ExtractedClaimCandidate[] {
  const cleanInput = input.trim();
  if (!cleanInput) return [];

  // Split into sentences or clauses
  const rawSentences = cleanInput
    .replace(/([.?!])\s*(?=[A-Z0-9])/g, '$1|')
    .split('|')
    .map(s => s.trim())
    .filter(s => s.length > 20);

  if (rawSentences.length === 0) {
    return [
      {
        text: cleanInput,
        targetEntity: 'Subject Entity',
        confidence: 0.85,
      },
    ];
  }

  return rawSentences.slice(0, 5).map((sentence, idx) => {
    // Extract likely target entity using capital words, numbers or domain indicators
    const entities = sentence.match(/\b[A-Z][a-zA-Z0-9-]{2,}\b/g) || [];
    const targetEntity = entities.slice(0, 2).join(' ') || `Proposition Target #${idx + 1}`;
    
    // Heuristic confidence based on factual markers (numbers, percentages, specific verbs)
    const hasNumbers = /\b\d+(\.\d+)?%?\b/.test(sentence);
    const hasDates = /\b(19\d\d|20\d\d)\b/.test(sentence);
    const confidence = Math.min(0.95, 0.65 + (hasNumbers ? 0.15 : 0) + (hasDates ? 0.10 : 0));

    return {
      text: sentence,
      targetEntity,
      confidence,
    };
  });
}
