import { DecisionType, TrustScoreBreakdown, ReliabilityLevel } from '@/types';
import { getTunedHyperparameters, PipelineHyperparameters } from './pipelineTuningEngine';

export interface TrustDecisionOutput {
  decision: DecisionType;
  confidence: number;
  decisionReason: string;
  recommendedAction: string;
  reliabilityIndicator: ReliabilityLevel;
  mathBreakdown: TrustScoreBreakdown;
  llmReasoning: string;
}

/**
 * AIVIDENCE Selective Prediction Engine
 * Rule-driven decision support system calibrated for epistemic humility.
 * Prefers VERIFY and ABSTAIN whenever evidence is single-origin, outdated, conflicting, or uncertain.
 */
export function evaluateTrustDecision(params: {
  supportScore: number;
  independenceFactor: number;
  freshnessDecay: number;
  contradictionDetected: boolean;
  contradictionDetails?: string;
  apparentSourcesCount: number;
  independentOriginsCount: number;
  isLiveRetrieval?: boolean;
  hyperparameters?: PipelineHyperparameters;
}): TrustDecisionOutput {
  const {
    supportScore,
    independenceFactor,
    freshnessDecay,
    contradictionDetected,
    contradictionDetails,
    apparentSourcesCount,
    independentOriginsCount,
    isLiveRetrieval = false,
    hyperparameters,
  } = params;

  const hp = hyperparameters || getTunedHyperparameters();

  // Live retrieval inherently carries higher uncertainty due to open-web noise
  const liveUncertaintyPenalty = isLiveRetrieval ? 0.08 : 0.0;
  const contradictionPenalty = contradictionDetected ? 0.70 : 0.04;

  // Core Trust Formula calibrated on research benchmarks and tuned hyperparameters:
  // T(c) = max(0, min(1, (S(c) * (I(c)^alpha) * (0.4 + 0.6 * F(c))) - w_contra * C(c) - penalty))
  const rawTrust =
    supportScore *
      Math.pow(Math.max(0.08, independenceFactor), hp.echoChamberExponent) *
      (0.4 + 0.6 * freshnessDecay) -
    hp.contradictionPenaltyWeight * contradictionPenalty -
    liveUncertaintyPenalty;

  const finalTrustScore = Math.max(0.02, Math.min(0.96, Number(rawTrust.toFixed(3))));

  let decision: DecisionType = 'VERIFY';
  let decisionReason = '';
  let recommendedAction = '';
  let llmReasoning = '';
  let reliabilityIndicator: ReliabilityLevel = 'Moderate Reliability';

  // Rule 1: Empirical Contradiction or Critical Factual Error -> ABSTAIN
  // Contradiction takes absolute priority: even strong support scores cannot override
  // a confirmed factual contradiction from canonical knowledge or multi-source evidence.
  if (contradictionDetected) {
    decision = 'ABSTAIN';
    reliabilityIndicator = 'High Epistemic Uncertainty';
    decisionReason = contradictionDetails || `Active empirical conflict detected. Authoritative records or verified scientific literature directly contradict the asserted proposition.`;
    recommendedAction = 'Withhold factual endorsement. Issue contradiction advisory and do not cite as true.';
    llmReasoning = `Under AIVIDENCE selective prediction protocol, the engine refrains from asserting truth because authoritative sources directly contest the proposition. Contradiction evidence: ${contradictionDetails || 'Confirmed factual mismatch against canonical literature'}. Support score (${Math.round(supportScore * 100)}%) is overridden by contradiction — correct behaviour per locked decision rules.`;
  }
  // Rule 1B: Zero relevant sources found -> ABSTAIN
  else if (apparentSourcesCount === 0 || independentOriginsCount === 0) {
    decision = 'ABSTAIN';
    reliabilityIndicator = 'High Epistemic Uncertainty';
    decisionReason = 'No relevant, verifiable authoritative sources found addressing this proposition. The system refrains from endorsing ungrounded claims.';
    recommendedAction = 'Withhold automated validation. Perform targeted manual research with specific keywords or verify against primary repositories.';
    llmReasoning = 'The system queried multi-backend knowledge repositories but found zero relevant, verifiable sources that discuss the asserted proposition. Never force a match with unrelated content.';
  }
  // Rule 2: Clearly correct + strongly supported by MULTIPLE independent sources -> TRUST
  // Locked rule: TRUST requires >= 2 independent origins in ALL modes (including live retrieval).
  // A single source, no matter how authoritative, is insufficient to TRUST — it may be
  // a single-origin echo chamber or contain undiscovered errors.
  else if (
    !contradictionDetected &&
    apparentSourcesCount >= 2 &&
    independentOriginsCount >= 2 &&
    supportScore >= 0.70 &&
    finalTrustScore >= hp.selectiveTrustThreshold &&
    independenceFactor >= 0.40
  ) {
    decision = 'TRUST';
    reliabilityIndicator = isLiveRetrieval ? 'Moderate Reliability' : 'High Rigor';
    decisionReason = `Corroborated by ${independentOriginsCount} verified, independent authoritative origin(s) with freshness factor ${Math.round(freshnessDecay * 100)}%, support score ${Math.round(supportScore * 100)}%, and independence ratio ${Math.round(independenceFactor * 100)}%. No contradiction detected.`;
    recommendedAction = 'Admit into knowledge graph as verified proposition; maintain routine periodic temporal re-audit schedule.';
    llmReasoning = `Evidence retrieved from ${independentOriginsCount} genuinely independent authoritative records directly affirms the asserted proposition. Support score: ${Math.round(supportScore * 100)}%. Independence ratio: ${Math.round(independenceFactor * 100)}%. Trust score: ${finalTrustScore.toFixed(3)}. All TRUST thresholds met (tuned threshold: ${hp.selectiveTrustThreshold}): no contradiction, ≥2 independent origins, high factual corroboration.`;
  }
  // Rule 3: Echo Chamber / Syndication Collapse -> VERIFY
  else if (apparentSourcesCount >= 3 && independentOriginsCount <= 1) {
    decision = 'VERIFY';
    reliabilityIndicator = 'Moderate Reliability';
    decisionReason = `Apparent source consensus is deceptive: ${apparentSourcesCount} visible citations collapse upon TRACE-X tracing into only 1 root origin (${(independenceFactor * 100).toFixed(0)}% independence ratio).`;
    recommendedAction = 'Inspect root seed publication; do not treat secondary news or blog repeats as independent corroborations.';
    llmReasoning = `Textual n-gram similarity and citation tracking revealed that multiple media outlets duplicated the same single original publication without conducting independent verification.`;
  }
  // Rule 4: Temporal obsolescence -> VERIFY
  else if (freshnessDecay < 0.45) {
    decision = 'VERIFY';
    reliabilityIndicator = 'Moderate Reliability';
    decisionReason = `Temporal obsolescence detected (freshness factor: ${freshnessDecay}). Underlying evidence relies on dated baselines that may be superseded by recent statutory or technical developments.`;
    recommendedAction = 'Verify against contemporary 2024-2026 data or enacted legislative texts.';
    llmReasoning = `The primary source material reflects baseline conditions that have substantially evolved. Without updated empirical confirmation, high confidence cannot be assigned.`;
  }
  // Rule 5: Insufficient corroboration / Clear factual mismatch / Below Verify threshold -> ABSTAIN
  else if (finalTrustScore < hp.selectiveVerifyThreshold || supportScore < 0.40) {
    decision = 'ABSTAIN';
    reliabilityIndicator = 'High Epistemic Uncertainty';
    decisionReason = `Insufficient verifiable literature or factual mismatch detected. Support score: ${Math.round(supportScore * 100)}% (threshold: 40%). Trust score: ${finalTrustScore.toFixed(3)} (tuned threshold: ${hp.selectiveVerifyThreshold}).`;
    recommendedAction = 'Abstain from automated validation. Perform targeted manual literature review across indexed scientific databases.';
    llmReasoning = `Selective prediction thresholds mandate withholding trust when corroborating evidence is minimal, conflicting, or ambiguous. Support: ${Math.round(supportScore * 100)}%, Trust: ${finalTrustScore.toFixed(3)} — both below the tuned thresholds for TRUST (${hp.selectiveTrustThreshold}) or VERIFY (${hp.selectiveVerifyThreshold}).`;
  }

  // Rule 6: Default Decision Support State -> VERIFY
  else {
    decision = 'VERIFY';
    reliabilityIndicator = isLiveRetrieval ? 'High Epistemic Uncertainty' : 'Moderate Reliability';
    decisionReason = `Plausible proposition, but corroboration threshold for definitive trust is not yet met (${independentOriginsCount} independent origin(s), ${(independenceFactor * 100).toFixed(0)}% independence).`;
    recommendedAction = 'Examine primary citations and verify methodology before citing as settled fact.';
    llmReasoning = `While preliminary supporting citations were retrieved, the absence of multiple independent replications advises treating this as an unconfirmed working proposition.`;
  }

  const mathBreakdown: TrustScoreBreakdown = {
    supportScore,
    independenceFactor,
    freshnessDecay,
    contradictionPenalty,
    finalTrustScore,
  };

  return {
    decision,
    confidence: finalTrustScore,
    decisionReason,
    recommendedAction,
    reliabilityIndicator,
    mathBreakdown,
    llmReasoning,
  };
}
