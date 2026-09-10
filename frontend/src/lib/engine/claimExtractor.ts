export interface ExtractedClaimCandidate {
  text: string;
  targetEntity: string;
  inputQuote: string;
  confidence: number;
  extractedFigures?: string[];
  temporalAnchor?: string;
  modalQualifier?: string;
  isAtomicClause?: boolean;
}

const COMMON_ABBREVIATIONS = [
  'u.s.', 'u.k.', 'e.u.', 'dr.', 'mr.', 'mrs.', 'ms.', 'prof.',
  'e.g.', 'i.e.', 'vs.', 'approx.', 'est.', 'no.', 'vol.', 'al.'
];

const MODAL_QUALIFIERS = [
  'allegedly', 'reportedly', 'supposedly', 'tentatively', 'preliminary',
  'hypothetically', 'claimed', 'purported', 'believed to'
];

/**
 * Deconstructs unstructured user input into verifiable atomic propositions
 * preserving the exact source quotation, protecting abbreviations, and splitting
 * contrastive compound clauses.
 */
export function extractAtomicClaimsFromText(input: string): ExtractedClaimCandidate[] {
  const cleanInput = input.trim();
  if (!cleanInput) return [];

  // Protect abbreviations by replacing period with placeholder
  let protectedText = cleanInput;
  COMMON_ABBREVIATIONS.forEach(abbr => {
    const regex = new RegExp(`\\b${abbr.replace(/\./g, '\\.')}`, 'gi');
    protectedText = protectedText.replace(regex, match => match.replace(/\./g, '___DOT___'));
  });

  // Protect decimal numbers (e.g. 3.14, 2.5)
  protectedText = protectedText.replace(/(\d+)\.(\d+)/g, '$1___DECIMAL___$2');

  // Split into sentences using punctuation boundaries
  const rawSentences = protectedText
    .replace(/([.?!])\s*(?=[A-Z0-9])/g, '$1|')
    .split('|')
    .map(s => s.replace(/___DOT___/g, '.').replace(/___DECIMAL___/g, '.').trim())
    .filter(s => s.length > 15);

  const sentencesToProcess = rawSentences.length > 0 ? rawSentences : [cleanInput];

  // Further decompose compound sentences with contrastive conjunctions
  // e.g. "X is true, whereas Y is false" or "X is true, but Y is false"
  const atomicPropositions: { text: string; parentQuote: string; isClause: boolean }[] = [];

  for (const sentence of sentencesToProcess) {
    const compoundSplitRegex = /\s*(?:,\s*(?:whereas|while|however|although|but)\s+|\s*;\s*)\s*/i;
    const subClauses = sentence.split(compoundSplitRegex).map(c => c.trim()).filter(c => c.length > 18);

    if (subClauses.length > 1) {
      for (const clause of subClauses) {
        atomicPropositions.push({
          text: clause,
          parentQuote: sentence,
          isClause: true,
        });
      }
    } else {
      atomicPropositions.push({
        text: sentence,
        parentQuote: sentence,
        isClause: false,
      });
    }
  }

  return atomicPropositions.slice(0, 6).map((item, idx) => {
    const sentence = item.text;
    const lowerSentence = sentence.toLowerCase();

    // Extract capitalized entities or key noun phrases
    const entities = sentence.match(/\b[A-Z][a-zA-Z0-9-]{2,}\b/g) || [];
    const targetEntity = entities.slice(0, 3).join(' ') || `Proposition Target #${idx + 1}`;

    // Extract numerical figures and units
    const figures = sentence.match(/\b\d+(?:[.,]\d+)?(?:\s*(?:%|tonnes?|kg|km|years?|days?|hours?|minutes?|seconds?|kWh|MWh|USD|\$|EUR|€))?\b/gi) || [];

    // Extract potential temporal anchor (years, dates)
    const temporalMatch = sentence.match(/\b(19\d\d|20\d\d)\b/);
    const temporalAnchor = temporalMatch ? temporalMatch[0] : undefined;

    // Detect modal qualifiers
    const detectedModal = MODAL_QUALIFIERS.find(m => lowerSentence.includes(m));

    // Epistemic confidence heuristic (never 100%): more factual markers = higher initial confidence
    const hasNumbers = figures.length > 0;
    const hasDates = Boolean(temporalAnchor);
    let confidence = 0.58 + (hasNumbers ? 0.15 : 0) + (hasDates ? 0.10 : 0);
    if (detectedModal) {
      confidence -= 0.12; // Downgrade confidence for ungrounded/alleged assertions
    }
    confidence = Math.min(0.88, Math.max(0.35, confidence));

    return {
      text: sentence,
      targetEntity,
      inputQuote: item.parentQuote,
      confidence: Number(confidence.toFixed(2)),
      extractedFigures: Array.from(new Set(figures)),
      temporalAnchor,
      modalQualifier: detectedModal,
      isAtomicClause: item.isClause,
    };
  });
}
