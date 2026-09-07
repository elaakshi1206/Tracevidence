import { Source, ProvenanceChain, ProvenanceNode, ProvenanceLevel } from '@/types';

/**
 * Calculates n-gram overlap similarity between two text snippets (Jaccard similarity of 3-grams)
 */
export function calculateTextOverlap(textA: string, textB: string): number {
  const cleanA = textA.toLowerCase().replace(/[^a-z0-9\s]/g, '');
  const cleanB = textB.toLowerCase().replace(/[^a-z0-9\s]/g, '');

  const wordsA = cleanA.split(/\s+/).filter(w => w.length > 2);
  const wordsB = cleanB.split(/\s+/).filter(w => w.length > 2);

  if (wordsA.length === 0 || wordsB.length === 0) return 0;

  const setA = new Set<string>();
  for (let i = 0; i <= wordsA.length - 3; i++) {
    setA.add(`${wordsA[i]} ${wordsA[i + 1]} ${wordsA[i + 2]}`);
  }

  const setB = new Set<string>();
  for (let i = 0; i <= wordsB.length - 3; i++) {
    setB.add(`${wordsB[i]} ${wordsB[i + 1]} ${wordsB[i + 2]}`);
  }

  if (setA.size === 0 || setB.size === 0) {
    // Fallback to word-level intersection
    const wordSetA = new Set(wordsA);
    const wordSetB = new Set(wordsB);
    let common = 0;
    wordSetA.forEach(w => {
      if (wordSetB.has(w)) common++;
    });
    return common / Math.max(wordSetA.size, wordSetB.size);
  }

  let intersection = 0;
  setA.forEach(gram => {
    if (setB.has(gram)) intersection++;
  });

  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}

/**
 * Reconstructs the TRACE-X provenance chain for a claim across a set of candidate sources
 */
export function reconstructProvenanceChain(
  claimId: string,
  sources: Source[]
): ProvenanceChain {
  if (sources.length === 0) {
    return {
      claimId,
      level: 'Untraceable',
      originSourceId: '',
      steps: [],
      circularityDetected: false,
    };
  }

  // Find primary origin (earliest published academic or government source, or source flagged as primary)
  const sortedByDate = [...sources].sort((a, b) => {
    return new Date(a.publishedDate).getTime() - new Date(b.publishedDate).getTime();
  });

  const primaryCandidate =
    sortedByDate.find(s => s.isPrimaryOrigin || s.tier === 'Academic' || s.tier === 'Government') ||
    sortedByDate[0];

  const steps: ProvenanceNode[] = sortedByDate.map((src, index) => {
    const isRoot = src.id === primaryCandidate.id || src.isPrimaryOrigin;
    const overlap = calculateTextOverlap(primaryCandidate.snippet, src.snippet);

    let role: ProvenanceNode['role'] = 'Derived Commentary';
    if (isRoot) {
      role = 'Primary Origin';
    } else if (src.tier === 'Academic' || src.tier === 'Government') {
      role = 'Peer Replication';
    } else if (overlap > 0.4 || src.verbatimOverlapRatio && src.verbatimOverlapRatio > 0.6) {
      role = 'Syndication / Reprint';
    }

    return {
      sourceId: src.id,
      timestamp: src.publishedDate,
      role,
      distanceFromOrigin: isRoot ? 0 : Math.min(index, 2),
    };
  });

  // Circularity check: multiple secondary media outlets echoing without independent primary replication
  const syndicationCount = steps.filter(s => s.role === 'Syndication / Reprint').length;
  const circularityDetected = syndicationCount >= 2;

  let level: ProvenanceLevel = 'Partially Traceable';
  if (primaryCandidate && (primaryCandidate.tier === 'Academic' || primaryCandidate.tier === 'Government' || primaryCandidate.doi)) {
    level = 'Directly Traceable';
  } else if (!primaryCandidate || steps.length < 2) {
    level = 'Untraceable';
  }

  return {
    claimId,
    level,
    originSourceId: primaryCandidate.id,
    steps,
    circularityDetected,
    circularityDetails: circularityDetected
      ? `${syndicationCount} sources exhibit high verbatim overlap (>60%) stemming from single root origin (${primaryCandidate.publisher}) without independent laboratory or observational verification.`
      : undefined,
  };
}
