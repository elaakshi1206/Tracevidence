from pydantic import BaseModel, Field
from typing import List, Optional, Literal

DecisionEnum = Literal['TRUST', 'VERIFY', 'ABSTAIN']
SourceTierEnum = Literal['Academic', 'Government', 'Official', 'Reputable Media', 'Aggregator/Blog', 'Unverified']
PolarityEnum = Literal['SUPPORT', 'PARTIAL', 'CONTRADICT']

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
    source_id: str
    polarity: PolarityEnum
    quote: str
    relevance_score: float = Field(ge=0.0, le=1.0)
    verification_reasoning: str

class TrustMathBreakdownSchema(BaseModel):
    support_score: float
    independence_factor: float
    freshness_decay: float
    contradiction_penalty: float
    final_trust_score: float

class ClaimSchema(BaseModel):
    id: str
    text: str
    target_entity: str
    confidence: float
    decision: DecisionEnum
    decision_reason: str
    recommended_action: str
    apparent_sources_count: int
    independent_origins_count: int
    independence_ratio: float
    freshness_score: float
    temporal_status: str
    contradiction_detected: bool
    contradiction_details: Optional[str] = None
    evidence_ids: List[str]
    math_breakdown: TrustMathBreakdownSchema
    llm_reasoning: str

class AnalyzeRequest(BaseModel):
    text: Optional[str] = None
    url: Optional[str] = None
    benchmark_id: Optional[str] = None

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
