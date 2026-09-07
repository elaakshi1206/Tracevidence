export interface ExtractedClaimCandidate {
  text: string;
  targetEntity: string;
  inputQuote: string;
  confidence: number;
  extractedFigures?: string[];
  temporalAnchor?: string;
}

/**
 * Deconstructs unstructured user input into verifiable atomic propositions
 * preserving the exact source quotation and extracting numerical/factual anchors.
 */
export function extractAtomicClaimsFromText(input: string): ExtractedClaimCandidate[] {
  const cleanInput = input.trim();
  if (!cleanInput) return [];

  // Split into sentences using punctuation boundaries
  const rawSentences = cleanInput
    .replace(/([.?!])\s*(?=[A-Z0-9])/g, '$1|')
    .split('|')
    .map(s => s.trim())
    .filter(s => s.length > 15);

  if (rawSentences.length === 0) {
    const figures = cleanInput.match(/\b\d+(?:[.,]\d+)?(?:\s*(?:%|tonnes?|kg|km|years?|days?|hours?|minutes?|seconds?|kWh|MWh|USD|\$|EUR|€))?\b/gi) || [];
    return [
      {
        text: cleanInput,
        targetEntity: 'Subject Proposition',
        inputQuote: cleanInput,
        confidence: 0.75,
        extractedFigures: Array.from(new Set(figures)),
      },
    ];
  }

  return rawSentences.slice(0, 5).map((sentence, idx) => {
    // Extract capitalized entities or key noun phrases
    const entities = sentence.match(/\b[A-Z][a-zA-Z0-9-]{2,}\b/g) || [];
    const targetEntity = entities.slice(0, 3).join(' ') || `Proposition Target #${idx + 1}`;

    // Extract numerical figures and units
    const figures = sentence.match(/\b\d+(?:[.,]\d+)?(?:\s*(?:%|tonnes?|kg|km|years?|days?|hours?|minutes?|seconds?|kWh|MWh|USD|\$|EUR|€))?\b/gi) || [];

    // Extract potential temporal anchor (years, dates)
    const temporalMatch = sentence.match(/\b(19\d\d|20\d\d)\b/);
    const temporalAnchor = temporalMatch ? temporalMatch[0] : undefined;

    // Epistemic confidence heuristic (never 100%): more factual markers = higher initial confidence
    const hasNumbers = figures.length > 0;
    const hasDates = Boolean(temporalAnchor);
    const confidence = Math.min(0.88, 0.55 + (hasNumbers ? 0.15 : 0) + (hasDates ? 0.10 : 0));

    return {
      text: sentence,
      targetEntity,
      inputQuote: sentence,
      confidence: Number(confidence.toFixed(2)),
      extractedFigures: Array.from(new Set(figures)),
      temporalAnchor,
    };
  });
}
