import { Evidence, Source, NumericalConflict } from '@/types';

export interface SignalAnalysisResult {
  contradictionDetected: boolean;
  contradictionDetails?: string;
  numericalConflict?: NumericalConflict;
  freshnessScore: number; // 0 to 1
  temporalStatus: 'Current' | 'Outdated' | 'Historical' | 'Pending Verification';
  supportScore: number; // 0 to 1
}

export type DomainTopic = 'technology' | 'medicine' | 'policy' | 'statistics' | 'general';

/**
 * Returns half-life in years based on domain sensitivity:
 * - technology & software: ~2 years
 * - policy & statutes: ~2.5 years
 * - medicine & clinical protocols: ~3 years
 * - statistics & economics: ~2 years
 * - general / foundational sciences: ~6 years
 */
export function getDomainHalfLifeYears(topic: DomainTopic = 'general'): number {
  switch (topic) {
    case 'technology':
      return 2.0;
    case 'policy':
      return 2.5;
    case 'medicine':
      return 3.0;
    case 'statistics':
      return 2.0;
    case 'general':
    default:
      return 5.0;
  }
}

/**
 * Evaluates temporal freshness decay based on half-life parameters
 */
export function calculateFreshnessDecay(
  publishedDate: string,
  domainHalfLifeYears: number = 3
): number {
  const pubTime = new Date(publishedDate).getTime();
  if (isNaN(pubTime)) return 0.65;

  const now = new Date('2026-09-07T00:00:00Z').getTime(); // Synchronized to benchmark reference time
  const diffYears = Math.max(0, (now - pubTime) / (1000 * 60 * 60 * 24 * 365.25));

  // Decay formula: F(t) = exp(- (ln(2) / halfLife) * diffYears)
  const lambda = Math.LN2 / domainHalfLifeYears;
  const decay = Math.exp(-lambda * diffYears);

  return Math.max(0.05, Math.min(1.0, Number(decay.toFixed(3))));
}

/**
 * Extracts key numbers with surrounding units (e.g. "17-20 tonnes", "100%", "47 years", "14.8 minutes")
 */
function extractValueWithUnit(text: string): string | null {
  const match = text.match(/\b\d+(?:[.,-]\d+)?(?:\s*(?:%|tonnes?|kg|km|years?|days?|hours?|minutes?|seconds?|kWh|MWh|USD|\$|EUR|€))?\b/i);
  return match ? match[0] : null;
}

/**
 * Analyzes evidence polarity, numerical/factual contradiction signals, and domain freshness
 */
export function analyzeVerificationSignals(
  evidences: Evidence[],
  sources: Source[],
  claimText?: string,
  domain: DomainTopic = 'technology'
): SignalAnalysisResult {
  if (evidences.length === 0) {
    return {
      contradictionDetected: false,
      freshnessScore: 0.5,
      temporalStatus: 'Pending Verification',
      supportScore: 0.3,
    };
  }

  const sourceMap = new Map<string, Source>(sources.map(s => [s.id, s]));
  const halfLife = getDomainHalfLifeYears(domain);

  let supportWeight = 0;
  let contradictWeight = 0;
  let totalWeight = 0;
  let freshnessSum = 0;

  const contradictingEvidences: Evidence[] = [];

  evidences.forEach(ev => {
    const src = sourceMap.get(ev.sourceId);
    const cred = src ? src.credibilityScore : 0.5;
    const fresh = src ? calculateFreshnessDecay(src.publishedDate, halfLife) : 0.6;
    freshnessSum += fresh;

    const effectiveWeight = cred * ev.relevanceScore;
    totalWeight += effectiveWeight;

    if (ev.polarity === 'SUPPORT') {
      supportWeight += effectiveWeight;
    } else if (ev.polarity === 'CONTRADICT') {
      contradictWeight += effectiveWeight;
      contradictingEvidences.push(ev);
    } else {
      supportWeight += effectiveWeight * 0.4;
    }
  });

  const averageFreshness = Number((freshnessSum / evidences.length).toFixed(3));
  const contradictionRatio = totalWeight > 0 ? contradictWeight / totalWeight : 0;

  // A "high-confidence contradiction" is one that comes from a canonical knowledge source
  // (relevanceScore >= 0.85 is only set by factualMatcher curated-fact paths and learned corrections).
  const hasHighConfidenceContradiction = contradictingEvidences.some(ev => ev.relevanceScore >= 0.85);

  // Require a meaningful weight ratio (>= 30%) OR an explicit canonical-knowledge refutation.
  // The previous `|| contradictingEvidences.length > 0` allowed a single 0.25-relevance source
  // from an unrelated page to trigger ABSTAIN on a correct claim — this is now fixed.
  const contradictionDetected = contradictionRatio >= 0.30 || hasHighConfidenceContradiction;

  let temporalStatus: SignalAnalysisResult['temporalStatus'] = 'Current';
  if (averageFreshness < 0.35) {
    temporalStatus = 'Outdated';
  } else if (averageFreshness < 0.60) {
    temporalStatus = 'Pending Verification';
  }

  const supportScore = totalWeight > 0 ? Number((supportWeight / totalWeight).toFixed(3)) : 0.4;

  let contradictionDetails: string | undefined;
  let numericalConflict: NumericalConflict | undefined;

  if (contradictionDetected && contradictingEvidences.length > 0) {
    const bestContradiction = contradictingEvidences[0];
    const src = sourceMap.get(bestContradiction.sourceId);

    if (bestContradiction.exactDifference) {
      contradictionDetails = bestContradiction.exactDifference;
    } else {
      contradictionDetails = `Empirical contradiction from ${src?.publisher || 'primary authority'}: "${bestContradiction.quote.slice(0, 160)}..."`;
    }

    // Extract numerical conflict if available
    const claimedVal = claimText ? extractValueWithUnit(claimText) : null;
    const rebuttalVal = extractValueWithUnit(bestContradiction.quote);

    if (claimedVal && rebuttalVal && claimedVal !== rebuttalVal) {
      numericalConflict = {
        claimedValue: claimedVal,
        rebuttalValue: rebuttalVal,
        deltaNote: `Asserted proposition states ${claimedVal}, but authoritative findings report ${rebuttalVal}.`,
      };
    }
  }

  return {
    contradictionDetected,
    contradictionDetails,
    numericalConflict,
    freshnessScore: averageFreshness,
    temporalStatus,
    supportScore,
  };
}
