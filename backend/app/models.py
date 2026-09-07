from sqlalchemy import Column, String, Float, Integer, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime

Base = declarative_base()

class AnalysisModel(Base):
    __tablename__ = 'analyses'

    id = Column(String(64), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    query = Column(Text, nullable=False)
    executive_summary = Column(Text)
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
    apparent_sources_count = Column(Integer)
    independent_origins_count = Column(Integer)
    independence_ratio = Column(Float)
    freshness_score = Column(Float)
    contradiction_detected = Column(Boolean, default=False)
    final_trust_score = Column(Float)

    analysis = relationship('AnalysisModel', back_populates='claims')
    evidences = relationship('EvidenceModel', back_populates='claim', cascade='all, delete-orphan')

class SourceModel(Base):
    __tablename__ = 'sources'

    id = Column(String(64), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    publisher = Column(String(255))
    tier = Column(String(64))
    published_date = Column(String(32))
    is_primary_origin = Column(Boolean, default=False)
    origin_id = Column(String(64), nullable=True)
    credibility_score = Column(Float)
    snippet = Column(Text)
    doi = Column(String(128), nullable=True)

class EvidenceModel(Base):
    __tablename__ = 'evidences'

    id = Column(String(64), primary_key=True, index=True)
    claim_id = Column(String(64), ForeignKey('claims.id'))
    source_id = Column(String(64), ForeignKey('sources.id'))
    polarity = Column(String(16))  # SUPPORT, PARTIAL, CONTRADICT
    quote = Column(Text)
    relevance_score = Column(Float)
    verification_reasoning = Column(Text)

    claim = relationship('ClaimModel', back_populates='evidences')
