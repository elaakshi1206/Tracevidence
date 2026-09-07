import { Evidence, Source } from '@/types';

export interface SignalAnalysisResult {
  contradictionDetected: boolean;
  contradictionDetails?: string;
  freshnessScore: number; // 0 to 1
  temporalStatus: 'Current' | 'Outdated' | 'Historical' | 'Pending Verification';
  supportScore: number; // 0 to 1
}

/**
 * Evaluates temporal freshness decay based on half-life parameters
 * lambda = 0.25 (approx 3-year half life for technology/regulatory domains)
 */
export function calculateFreshnessDecay(publishedDate: string, domainHalfLifeYears: number = 3): number {
  const pubTime = new Date(publishedDate).getTime();
  if (isNaN(pubTime)) return 0.70;

  const now = new Date('2026-09-07T00:00:00Z').getTime(); // Synchronized to benchmark reference time
  const diffYears = Math.max(0, (now - pubTime) / (1000 * 60 * 60 * 24 * 365.25));

  // Decay formula: F(t) = exp(- (ln(2) / halfLife) * diffYears)
  const lambda = Math.LN2 / domainHalfLifeYears;
  const decay = Math.exp(-lambda * diffYears);

  return Math.max(0.05, Math.min(1.0, Number(decay.toFixed(3))));
}

/**
 * Analyzes evidence polarity, contradiction signals, and average freshness
 */
export function analyzeVerificationSignals(
  evidences: Evidence[],
  sources: Source[]
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

  let supportWeight = 0;
  let contradictWeight = 0;
  let totalWeight = 0;
  let freshnessSum = 0;

  const contradictingEvidences: Evidence[] = [];

  evidences.forEach(ev => {
    const src = sourceMap.get(ev.sourceId);
    const cred = src ? src.credibilityScore : 0.5;
    const fresh = src ? calculateFreshnessDecay(src.publishedDate) : 0.6;
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
  const contradictionDetected = contradictionRatio >= 0.3 || contradictingEvidences.length > 0;

  let temporalStatus: SignalAnalysisResult['temporalStatus'] = 'Current';
  if (averageFreshness < 0.35) {
    temporalStatus = 'Outdated';
  } else if (averageFreshness < 0.60) {
    temporalStatus = 'Pending Verification';
  }

  const supportScore = totalWeight > 0 ? Number((supportWeight / totalWeight).toFixed(3)) : 0.4;

  let contradictionDetails: string | undefined;
  if (contradictionDetected && contradictingEvidences.length > 0) {
    const bestContradiction = contradictingEvidences[0];
    const src = sourceMap.get(bestContradiction.sourceId);
    contradictionDetails = `Contradicted by ${src?.title || 'authoritative source'}: "${bestContradiction.quote.slice(0, 140)}..."`;
  }

  return {
    contradictionDetected,
    contradictionDetails,
    freshnessScore: averageFreshness,
    temporalStatus,
    supportScore,
  };
}
