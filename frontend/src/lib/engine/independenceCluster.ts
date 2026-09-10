import { Source, CollapseEvidence, ConfidenceLevel, DerivationProbability } from '@/types';
import { calculateTextOverlap } from './provenanceEngine';

export interface ClusterInfo {
  clusterId: string;
  originSourceId: string;
  sourceIds: string[];
  clusterRationale: string;
  collapseEvidence?: CollapseEvidence;
}

export interface IndependenceClusteringResult {
  apparentSourcesCount: number;
  independentOriginsCount: number;
  independenceRatio: number; // 0 to 1
  clusters: ClusterInfo[];
  independenceConfidence: ConfidenceLevel;
  provenanceConfidence: ConfidenceLevel;
  primaryEvidenceSummary: string;
}

/**
 * Extracts numeric quantities and percentages from snippet text
 */
function extractNumericTokens(text: string): Set<string> {
  const matches = text.match(/\b\d+(?:[.,]\d+)?%?\b/g) || [];
  return new Set(matches);
}

/**
 * Finds shared numerical values between two text snippets
 */
function findSharedFigures(textA: string, textB: string): string[] {
  const setA = extractNumericTokens(textA);
  const setB = extractNumericTokens(textB);
  const shared: string[] = [];
  setA.forEach(val => {
    if (setB.has(val) && val.length > 1) {
      shared.push(val);
    }
  });
  return shared;
}

/**
 * Clusters sources based on origin pointers, publisher corporate ownership, and verbatim text overlap.
 * Never claims 100% certainty; expresses probabilistic likelihoods of derivation.
 */
export function clusterSourcesByIndependence(sources: Source[]): IndependenceClusteringResult {
  const apparentSourcesCount = sources.length;
  if (apparentSourcesCount === 0) {
    return {
      apparentSourcesCount: 0,
      independentOriginsCount: 0,
      independenceRatio: 0,
      clusters: [],
      independenceConfidence: 'Low',
      provenanceConfidence: 'Low',
      primaryEvidenceSummary: 'No sources available for provenance clustering.',
    };
  }

  const clusters: ClusterInfo[] = [];
  const assigned = new Set<string>();

  for (let i = 0; i < sources.length; i++) {
    const srcA = sources[i];
    if (assigned.has(srcA.id)) continue;

    const currentClusterSources = [srcA.id];
    assigned.add(srcA.id);

    let maxOverlap = 0;
    const allSharedFigures = new Set<string>();

    // Compare against all subsequent sources
    for (let j = i + 1; j < sources.length; j++) {
      const srcB = sources[j];
      if (assigned.has(srcB.id)) continue;

      const isExplicitChild = srcB.originId === srcA.id || srcA.originId === srcB.id;
      const sharesOrigin = Boolean(srcA.originId && srcB.originId && srcA.originId === srcB.originId);
      const overlap = calculateTextOverlap(srcA.snippet, srcB.snippet);
      if (overlap > maxOverlap) maxOverlap = overlap;

      const sharedFigures = findSharedFigures(srcA.snippet, srcB.snippet);
      sharedFigures.forEach(f => allSharedFigures.add(f));

      const hasSharedFigures = sharedFigures.length > 0;

      // Guard: do not cluster if either snippet is too short (< 15 words).
      // Short snippets share numbers and words by coincidence, producing false collapses.
      const snippetAWords = srcA.snippet.trim().split(/\s+/).length;
      const snippetBWords = srcB.snippet.trim().split(/\s+/).length;
      const bothSnippetsSubstantive = snippetAWords >= 15 && snippetBWords >= 15;

      const isSyndicated = bothSnippetsSubstantive && (
        isExplicitChild || sharesOrigin || overlap > 0.40 || (overlap > 0.25 && hasSharedFigures)
      );

      if (isSyndicated) {
        currentClusterSources.push(srcB.id);
        assigned.add(srcB.id);
      }
    }

    // Determine derivation probability
    let derivationProbability: DerivationProbability = 'Low';
    if (currentClusterSources.length > 1) {
      if (maxOverlap > 0.65 || allSharedFigures.size >= 2) {
        derivationProbability = 'High';
      } else if (maxOverlap > 0.35 || allSharedFigures.size >= 1) {
        derivationProbability = 'Medium';
      }
    }

    const sharedFigArr = Array.from(allSharedFigures);

    // Cautious, evidence-grounded rationale language:
    // Never make absolute collapse claims. Always include similarity % and shared figures as proof.
    let cautiousRationale: string;
    if (currentClusterSources.length > 1) {
      const proofParts: string[] = [];
      if (sharedFigArr.length > 0) {
        proofParts.push(`shared key figures [${sharedFigArr.join(', ')}]`);
      }
      if (maxOverlap > 0) {
        proofParts.push(`${Math.round(maxOverlap * 100)}% n-gram text similarity`);
      }
      const proofStr = proofParts.length > 0 ? ` (evidence: ${proofParts.join(' and ')})` : '';

      if (derivationProbability === 'High') {
        cautiousRationale = `High likelihood of derivation: ${currentClusterSources.length} sources appear to originate from ${srcA.publisher}${proofStr}. Independent verification recommended.`;
      } else if (derivationProbability === 'Medium') {
        cautiousRationale = `Possible shared origin: ${currentClusterSources.length} sources share content markers with ${srcA.publisher}${proofStr}. Treat as probable (not confirmed) derivation.`;
      } else {
        cautiousRationale = `Low-confidence grouping: ${currentClusterSources.length} sources weakly associated with ${srcA.publisher}${proofStr}. May be coincidental overlap.`;
      }
    } else {
      cautiousRationale = `Genuinely independent primary root from ${srcA.publisher}. No significant overlap detected with other retrieved sources.`;
    }

    const collapseEvidence: CollapseEvidence = {
      sharedFigures: sharedFigArr.length > 0 ? sharedFigArr : undefined,
      overlapSnippet: maxOverlap > 0 ? `${Math.round(maxOverlap * 100)}% n-gram similarity with primary root text` : undefined,
      commonOrigin: srcA.originId || srcA.id,
      derivationProbability,
      rationale: cautiousRationale,
    };

    clusters.push({
      clusterId: `cluster-${clusters.length + 1}`,
      originSourceId: srcA.originId || srcA.id,
      sourceIds: currentClusterSources,
      clusterRationale: collapseEvidence.rationale || '',
      collapseEvidence,
    });
  }

  const independentOriginsCount = clusters.length;
  const independenceRatio = Number((independentOriginsCount / apparentSourcesCount).toFixed(3));

  // Determine estimation confidence levels based on sample size and source tier availability
  const hasAcademic = sources.some(s => s.tier === 'Academic' || s.tier === 'Government');
  const provenanceConfidence: ConfidenceLevel =
    sources.length >= 3 && hasAcademic ? 'High' : sources.length >= 2 ? 'Medium' : 'Low';
  const independenceConfidence: ConfidenceLevel =
    sources.length >= 4 ? 'High' : sources.length >= 2 ? 'Medium' : 'Low';

  const collapsedCount = apparentSourcesCount - independentOriginsCount;
  const primaryEvidenceSummary =
    collapsedCount > 0
      ? `TRACE-X detected ${collapsedCount} syndicated reprint(s) across ${apparentSourcesCount} visible citations, reducing apparent consensus to ${independentOriginsCount} independent origin(s).`
      : `All ${apparentSourcesCount} sources exhibit distinct observational methodologies and independent organizational origins.`;

  return {
    apparentSourcesCount,
    independentOriginsCount,
    independenceRatio,
    clusters,
    independenceConfidence,
    provenanceConfidence,
    primaryEvidenceSummary,
  };
}
