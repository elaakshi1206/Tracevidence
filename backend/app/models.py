from sqlalchemy import Column, String, Float, Integer, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class AnalysisModel(Base):
    __tablename__ = 'analyses'

    id = Column(String(64), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    query = Column(Text, nullable=False)
    executive_summary = Column(Text, nullable=True)
    provider = Column(String(128), default="TRACEVIDENCE Research Engine")
    execution_time_ms = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    claims = relationship('ClaimModel', back_populates='analysis', cascade='all, delete-orphan')

class ClaimModel(Base):
    __tablename__ = 'claims'

    id = Column(String(64), primary_key=True, index=True)
    analysis_id = Column(String(64), ForeignKey('analyses.id'))
    text = Column(Text, nullable=False)
    target_entity = Column(String(255))
    confidence = Column(Float)
    decision = Column(String(16))  # TRUST, VERIFY, ABSTAIN
    decision_reason = Column(Text)
    recommended_action = Column(Text)
    apparent_sources_count = Column(Integer, default=0)
    independent_origins_count = Column(Integer, default=0)
    independence_ratio = Column(Float, default=0.0)
    freshness_score = Column(Float, default=1.0)
    temporal_status = Column(String(64), default="Current")
    contradiction_detected = Column(Boolean, default=False)
    contradiction_details = Column(Text, nullable=True)
    final_trust_score = Column(Float, default=0.0)
    llm_reasoning = Column(Text, nullable=True)

    analysis = relationship('AnalysisModel', back_populates='claims')
    evidences = relationship('EvidenceModel', back_populates='claim', cascade='all, delete-orphan')

class SourceModel(Base):
    __tablename__ = 'sources'

    id = Column(String(64), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    url = Column(Text, nullable=True)
    publisher = Column(String(255))
    tier = Column(String(64))
    published_date = Column(String(32))
    is_primary_origin = Column(Boolean, default=False)
    origin_id = Column(String(64), nullable=True)
    credibility_score = Column(Float, default=0.5)
    snippet = Column(Text)
    doi = Column(String(128), nullable=True)

class EvidenceModel(Base):
    __tablename__ = 'evidences'

    id = Column(String(64), primary_key=True, index=True)
    claim_id = Column(String(64), ForeignKey('claims.id'))
    source_id = Column(String(64), ForeignKey('sources.id'), nullable=True)
    polarity = Column(String(16))  # SUPPORT, PARTIAL, CONTRADICT, IRRELEVANT
    quote = Column(Text)
    relevance_score = Column(Float, default=0.5)
    verification_reasoning = Column(Text, nullable=True)

    claim = relationship('ClaimModel', back_populates='evidences')

class LearnedRuleModel(Base):
    """
    Persistent repository for Continuous Learning memories and analyst corrections
    """
    __tablename__ = 'learned_rules'

    id = Column(String(64), primary_key=True, index=True)
    test_case_id = Column(String(64), nullable=True)
    claim_snippet = Column(Text, nullable=False)
    target_entity = Column(String(255), nullable=False)
    original_failed_stage = Column(String(128))
    original_system_decision = Column(String(16))
    expected_decision = Column(String(16))
    mistake_pattern = Column(Text)
    corrected_reasoning = Column(Text)
    rule_directive = Column(Text)
    canonical_correction = Column(Text)
    applied_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    active = Column(Boolean, default=True)
