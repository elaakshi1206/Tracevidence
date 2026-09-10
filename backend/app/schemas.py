from pydantic import BaseModel, Field
from typing import List, Optional, Literal

DecisionEnum = Literal['TRUST', 'VERIFY', 'ABSTAIN']
SourceTierEnum = Literal['Academic', 'Government', 'Official', 'Reputable Media', 'Aggregator/Blog', 'Unverified']
PolarityEnum = Literal['SUPPORT', 'PARTIAL', 'CONTRADICT', 'IRRELEVANT']

class SourceSchema(BaseModel):
    id: str
    title: str
    url: Optional[str] = None
    publisher: str
    author_or_org: Optional[str] = None
    tier: SourceTierEnum
    published_date: str
    is_primary_origin: bool = False
    origin_id: Optional[str] = None
    verbatim_overlap_ratio: Optional[float] = 0.0
    credibility_score: float = Field(ge=0.0, le=1.0)
    snippet: str
    doi: Optional[str] = None

class EvidenceSchema(BaseModel):
    id: str
    claim_id: str
    source_id: Optional[str] = None
    polarity: PolarityEnum
    quote: str
    relevance_score: float = Field(ge=0.0, le=1.0)
    verification_reasoning: Optional[str] = None

class TrustMathBreakdownSchema(BaseModel):
    support_score: float = 0.0
    independence_factor: float = 0.0
    freshness_decay: float = 1.0
    contradiction_penalty: float = 0.0
    final_trust_score: float = 0.0

class ClaimSchema(BaseModel):
    id: str
    text: str
    target_entity: str
    confidence: float
    decision: DecisionEnum
    decision_reason: str
    recommended_action: str
    apparent_sources_count: int = 0
    independent_origins_count: int = 0
    independence_ratio: float = 0.0
    freshness_score: float = 1.0
    temporal_status: str = "Current"
    contradiction_detected: bool = False
    contradiction_details: Optional[str] = None
    evidence_ids: List[str] = []
    math_breakdown: Optional[TrustMathBreakdownSchema] = None
    llm_reasoning: Optional[str] = None

class AnalyzeRequest(BaseModel):
    text: Optional[str] = None
    url: Optional[str] = None
    benchmark_id: Optional[str] = None
    mode: Optional[str] = "live"

class AnalysisListItem(BaseModel):
    id: str
    title: str
    query: str
    created_at: str
    claims_count: int
    executive_summary: Optional[str] = None

class AnalysisResponse(BaseModel):
    id: str
    title: str
    query: str
    timestamp: str
    executive_summary: str
    claims: List[ClaimSchema]
    sources: List[SourceSchema]
    evidences: List[EvidenceSchema]
    execution_time_ms: int
    provider: str

class LearnedRuleCreate(BaseModel):
    id: Optional[str] = None
    test_case_id: Optional[str] = None
    claim_snippet: str
    target_entity: str
    original_failed_stage: Optional[str] = None
    original_system_decision: Optional[str] = None
    expected_decision: str
    mistake_pattern: Optional[str] = None
    corrected_reasoning: str
    rule_directive: str
    canonical_correction: Optional[str] = None

class LearnedRuleResponse(BaseModel):
    id: str
    test_case_id: Optional[str] = None
    claim_snippet: str
    target_entity: str
    original_failed_stage: Optional[str] = None
    original_system_decision: Optional[str] = None
    expected_decision: str
    mistake_pattern: Optional[str] = None
    corrected_reasoning: str
    rule_directive: str
    canonical_correction: Optional[str] = None
    applied_count: int = 0
    created_at: str
    active: bool = True
