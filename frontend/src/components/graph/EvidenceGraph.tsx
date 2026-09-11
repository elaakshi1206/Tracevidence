'use client';

import React, { useState } from 'react';
import { AnalysisResult, EvidenceGraphNode, EvidenceGraphEdge } from '@/types';
import DecisionBadge from '../common/DecisionBadge';
import {
  ZoomIn,
  ZoomOut,
  Info,
  ExternalLink,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  HelpCircle,
  Share2,
} from 'lucide-react';

interface EvidenceGraphProps {
  analysis: AnalysisResult;
}

export default function EvidenceGraph({ analysis }: EvidenceGraphProps) {
  const { nodes, edges } = analysis.graphData;

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(nodes[0]?.id || null);
  const [tierFilter, setTierFilter] = useState<string>('ALL');

  // Compute 3-column Left-to-Right layout positions:
  // Column 1 (Left): Primary Origins (Root Sources)
  // Column 2 (Middle): Intermediate Sources (Media, blogs, secondary citations)
  // Column 3 (Right): User Claims (Tested propositions)
  const nodePositions = React.useMemo(() => {
    const origins = nodes.filter((n) => n.type === 'origin');
    const sources = nodes.filter((n) => n.type === 'source');
    const claims = nodes.filter((n) => n.type === 'claim');

    const posMap: Record<string, { x: number; y: number }> = {};

    // Left Column: Primary Origins
    origins.forEach((n, idx) => {
      posMap[n.id] = {
        x: 100,
        y: 110 + idx * 150,
      };
    });

    // Middle Column: Intermediate Sources
    sources.forEach((n, idx) => {
      posMap[n.id] = {
        x: 480,
        y: 110 + idx * 140,
      };
    });

    // Right Column: User Claims
    claims.forEach((n, idx) => {
      posMap[n.id] = {
        x: 870,
        y: 120 + idx * 160,
      };
    });

    return posMap;
  }, [nodes]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  // Filtered nodes
  const filteredNodes = nodes.filter((n) => {
    if (tierFilter === 'ALL') return true;
    if (n.type === 'claim') return true;
    return n.tier === tierFilter;
  });

  // Plain-English Graph Conclusion
  const primaryClaim = analysis.claims[0];
  const hasContradiction = analysis.claims.some((c) => c.contradictionDetected || c.decision === 'ABSTAIN');
  const isEchoChamber = analysis.aggregateMetrics.averageIndependence < 0.45 && analysis.sources.length >= 3;
  const independentOriginsCount = Math.max(
    1,
    Math.round(analysis.sources.length * (analysis.aggregateMetrics.averageIndependence || 0.5))
  );

  let graphConclusion = '';
  let conclusionTone: 'contradict' | 'echo' | 'trust' | 'verify' = 'verify';

  if (hasContradiction) {
    graphConclusion = 'Reliable sources contradict this claim.';
    conclusionTone = 'contradict';
  } else if (isEchoChamber) {
    graphConclusion = 'Most sources are repeating the same single report.';
    conclusionTone = 'echo';
  } else if (primaryClaim?.decision === 'TRUST') {
    graphConclusion = 'Strongly supported by multiple independent authoritative origins.';
    conclusionTone = 'trust';
  } else if (independentOriginsCount <= 2) {
    graphConclusion = `Only ${independentOriginsCount} independent source${independentOriginsCount > 1 ? 's support' : ' supports'} this claim.`;
    conclusionTone = 'verify';
  } else {
    graphConclusion = 'Additional independent literature verification recommended.';
    conclusionTone = 'verify';
  }

  return (
    <div className="relative flex flex-col h-[740px] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#07090e] shadow-2xl">
      {/* 1. Plain-English Graph Conclusion Banner */}
      <div className="z-20 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#0b101d]/95 px-5 py-3 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-xl font-bold text-xs shadow-md ${
              conclusionTone === 'contradict'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : conclusionTone === 'trust'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : conclusionTone === 'echo'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
            }`}
          >
            {conclusionTone === 'contradict' ? (
              <XCircle className="h-4 w-4" />
            ) : conclusionTone === 'trust' ? (
              <ShieldCheck className="h-4 w-4" />
            ) : conclusionTone === 'echo' ? (
              <Share2 className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
          </div>
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Graph Conclusion
            </span>
            <div className="text-sm font-bold text-white tracking-tight">{graphConclusion}</div>
          </div>
        </div>

        {/* Top-Right Controls */}
        <div className="flex items-center space-x-2">
          {/* Zoom controls */}
          <div className="flex items-center space-x-1 rounded-lg border border-white/10 bg-slate-800/80 p-1">
            <button
              onClick={() => setZoom((z) => Math.min(2.0, z + 0.15))}
              className="rounded p-1 text-slate-300 hover:bg-white/10 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.15))}
              className="rounded p-1 text-slate-300 hover:bg-white/10 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
              className="rounded p-1 text-slate-300 hover:bg-white/10 hover:text-white"
              title="Reset View"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Tier filter */}
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="rounded-lg border border-white/10 bg-slate-800/80 px-2 py-1 text-xs text-slate-200 outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Tiers</option>
            <option value="Official">Official</option>
            <option value="Government">Government</option>
            <option value="Academic">Academic</option>
            <option value="Reputable Media">Media</option>
          </select>
        </div>
      </div>

      {/* 2. SVG Canvas */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="flex-1 w-full cursor-grab active:cursor-grabbing select-none relative overflow-hidden"
      >
        <svg className="h-full w-full">
          <defs>
            {/* Grid Pattern */}
            <pattern id="graph-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
            </pattern>

            {/* Marker Arrows */}
            <marker id="arrow-support" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
            </marker>
            <marker id="arrow-partial" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
            </marker>
            <marker id="arrow-contradict" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
            </marker>
            <marker id="arrow-syndicate" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#ea580c" />
            </marker>
          </defs>

          {/* Background Grid */}
          <rect width="100%" height="100%" fill="url(#graph-grid)" />

          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* Column Structure Headers (Left to Right Flow) */}
            <g className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400 select-none">
              <rect x="20" y="30" width="300" height="28" rx="6" fill="#061c24" stroke="#0e7490" strokeWidth="1" />
              <text x="170" y="48" textAnchor="middle" fill="#22d3ee">
                1. Primary Origins (Root Sources)
              </text>

              <rect x="400" y="30" width="300" height="28" rx="6" fill="#141432" stroke="#4f46e5" strokeWidth="1" />
              <text x="550" y="48" textAnchor="middle" fill="#818cf8">
                2. Intermediate Sources (Media & Reprints)
              </text>

              <rect x="780" y="30" width="280" height="28" rx="6" fill="#063228" stroke="#059669" strokeWidth="1" />
              <text x="920" y="48" textAnchor="middle" fill="#34d399">
                3. User Claims (Tested Fact)
              </text>
            </g>

            {/* Edges */}
            {edges.map((edge) => {
              const srcPos = nodePositions[edge.source];
              const tgtPos = nodePositions[edge.target];
              if (!srcPos || !tgtPos) return null;

              const isContradict = edge.relationType === 'contradicts';
              const isSupport = edge.relationType === 'supports';
              const isPartial = edge.relationType === 'partially_supports';
              const isSyndicate = edge.relationType === 'syndicates';

              let strokeColor = '#f59e0b';
              let marker = 'url(#arrow-partial)';
              let dashArray: string | undefined = '5,4';

              if (isSupport) {
                strokeColor = '#10b981';
                marker = 'url(#arrow-support)';
                dashArray = undefined;
              } else if (isContradict) {
                strokeColor = '#f43f5e';
                marker = 'url(#arrow-contradict)';
                dashArray = undefined;
              } else if (isSyndicate) {
                strokeColor = '#ea580c';
                marker = 'url(#arrow-syndicate)';
                dashArray = '3,3';
              }

              // Smooth cubic bezier curve from left source to right target
              const dx = tgtPos.x - srcPos.x;
              const pathData = `M ${srcPos.x + 130} ${srcPos.y + 40} C ${srcPos.x + dx * 0.5} ${srcPos.y + 40}, ${
                tgtPos.x - dx * 0.5
              } ${tgtPos.y + 40}, ${tgtPos.x - 10} ${tgtPos.y + 40}`;

              return (
                <g key={edge.id} className="group">
                  <path
                    d={pathData}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={isContradict ? 2.6 : 1.8}
                    strokeDasharray={dashArray}
                    markerEnd={marker}
                    className={isContradict ? 'animate-pulse' : ''}
                    opacity={0.85}
                  />
                  {edge.label && (
                    <text
                      x={(srcPos.x + tgtPos.x) / 2}
                      y={(srcPos.y + tgtPos.y) / 2 - 8}
                      fill={strokeColor}
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="bg-black/90 px-1 py-0.5"
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {filteredNodes.map((node) => {
              const pos = nodePositions[node.id];
              if (!pos) return null;

              const isSelected = selectedNodeId === node.id;
              const isClaim = node.type === 'claim';
              const isOrigin = node.type === 'origin';

              // Visual styling by node role
              let borderColor = 'border-indigo-400/80 shadow-md shadow-indigo-950/40';
              let bgColor = 'bg-[#151733]';
              let roleBadge = 'Intermediate Source';
              let roleBadgeStyle = 'bg-indigo-950 border border-indigo-500/40 text-indigo-300';

              if (isOrigin) {
                borderColor = 'border-cyan-400 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-500/30';
                bgColor = 'bg-[#06242e]';
                roleBadge = 'Primary Origin';
                roleBadgeStyle = 'bg-cyan-950 border border-cyan-400/50 text-cyan-300';
              } else if (isClaim) {
                roleBadge = 'Claim';
                if (node.decision === 'TRUST') {
                  borderColor = 'border-emerald-400 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/40';
                  bgColor = 'bg-[#063b2f]';
                  roleBadgeStyle = 'bg-emerald-950 border border-emerald-400 text-emerald-300';
                } else if (node.decision === 'VERIFY') {
                  borderColor = 'border-amber-400 shadow-lg shadow-amber-950/40 ring-1 ring-amber-500/40';
                  bgColor = 'bg-[#3b2306]';
                  roleBadgeStyle = 'bg-amber-950 border border-amber-400 text-amber-300';
                } else {
                  borderColor = 'border-rose-500 shadow-lg shadow-rose-950/40 ring-1 ring-rose-500/40';
                  bgColor = 'bg-[#3d0818]';
                  roleBadgeStyle = 'bg-rose-950 border border-rose-400 text-rose-300';
                }
              }

              return (
                <foreignObject
                  key={node.id}
                  x={pos.x - 70}
                  y={pos.y}
                  width="220"
                  height="96"
                  className="overflow-visible"
                >
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNodeId(node.id);
                    }}
                    className={`h-full w-full cursor-pointer rounded-xl border-2 p-2.5 transition-all ${borderColor} ${bgColor} ${
                      isSelected ? 'scale-105 ring-2 ring-white shadow-2xl' : 'hover:scale-102 hover:border-white/60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className={`rounded px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider ${roleBadgeStyle}`}>
                        {roleBadge}
                      </span>
                      {isClaim && node.decision && (
                        <span
                          className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                            node.decision === 'TRUST'
                              ? 'bg-emerald-400 text-emerald-950'
                              : node.decision === 'VERIFY'
                              ? 'bg-amber-400 text-amber-950'
                              : 'bg-rose-400 text-rose-950'
                          }`}
                        >
                          {node.decision}
                        </span>
                      )}
                      {node.tier && (
                        <span className="rounded bg-slate-900 border border-white/10 px-1 py-0.5 text-[8px] text-slate-300 font-mono">
                          {node.tier}
                        </span>
                      )}
                    </div>

                    <div className="mt-1 font-bold text-xs text-white truncate leading-tight">
                      {node.label}
                    </div>

                    {node.subtitle && (
                      <div className="mt-0.5 text-[10px] text-slate-300 truncate leading-snug">
                        {node.subtitle}
                      </div>
                    )}
                  </div>
                </foreignObject>
              );
            })}
          </g>
        </svg>
      </div>

      {/* 3. Selected Node Inspector Drawer (Shows what it actually said, relation, support level) */}
      {selectedNode && (() => {
        const matchingSource = analysis.sources.find((s) => s.id === selectedNode.id);
        const matchingClaim = analysis.claims.find((c) => c.id === selectedNode.id);
        const matchingEvidence = analysis.evidences.find(
          (e) => e.sourceId === selectedNode.id || e.claimId === selectedNode.id
        );

        return (
          <div className="absolute bottom-16 right-4 z-20 w-96 max-h-80 overflow-y-auto rounded-xl border border-white/15 bg-[#0a0f1d]/95 p-4 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center space-x-1.5">
                <Info className="h-3.5 w-3.5 text-cyan-400" />
                <span className="font-mono text-xs font-bold uppercase text-white">
                  Node Inspector & Comparison
                </span>
              </div>
              <span className="font-mono text-[10px] text-slate-400">{selectedNode.id}</span>
            </div>

            <div className="mt-2.5">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-white leading-snug truncate max-w-[240px]">
                  {selectedNode.label}
                </h5>
                {matchingSource?.url && (
                  <a
                    href={matchingSource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-[10px] text-cyan-400 hover:text-cyan-300 font-mono"
                  >
                    <span>Source Link</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>

              {selectedNode.subtitle && (
                <p className="mt-0.5 text-[11px] text-slate-300 truncate">{selectedNode.subtitle}</p>
              )}

              {/* What It Actually Said (Verbatim Snippet) */}
              {(matchingSource?.snippet || selectedNode.rawEvidenceSnippet || matchingClaim?.inputQuote) && (
                <div className="mt-2.5 rounded-lg bg-black/50 p-2.5 text-[11px] text-slate-200 border border-white/10 leading-relaxed font-sans">
                  <span className="font-mono text-[10px] font-bold text-cyan-400 block mb-0.5 uppercase tracking-wider">
                    What It Actually Said:
                  </span>
                  &ldquo;{matchingSource?.snippet || matchingClaim?.inputQuote || selectedNode.rawEvidenceSnippet}&rdquo;
                </div>
              )}

              {/* How It Relates to User's Claim & Support Level */}
              {matchingEvidence && (
                <div className="mt-2.5 rounded-lg bg-slate-900/60 p-2.5 border border-white/10 text-[11px] text-slate-300">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] font-bold uppercase text-amber-400">
                      Relation to User Claim:
                    </span>
                    <span
                      className={`font-mono text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                        matchingEvidence.polarity === 'SUPPORT'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : matchingEvidence.polarity === 'CONTRADICT'
                          ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                          : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {matchingEvidence.polarity === 'SUPPORT'
                        ? 'Supports'
                        : matchingEvidence.polarity === 'CONTRADICT'
                        ? 'Contradicts'
                        : 'Partially Supports'}
                    </span>
                  </div>
                  <p className="font-sans leading-relaxed text-slate-200">
                    {matchingEvidence.exactDifference || matchingEvidence.verificationReasoning}
                  </p>
                </div>
              )}

              {/* Claim Verdict if Claim node */}
              {selectedNode.type === 'claim' && primaryClaim && (
                <div className="mt-2.5 rounded-lg bg-slate-900/60 p-2 border border-white/10 space-y-1 text-[11px] font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Decision:</span>
                    <DecisionBadge decision={primaryClaim.decision} size="sm" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Epistemic Confidence:</span>
                    <span className="text-white font-bold">{Math.round(primaryClaim.confidence * 100)}%</span>
                  </div>
                  <div className="text-slate-300 font-sans text-[10px] mt-1 pt-1 border-t border-white/5">
                    {primaryClaim.decisionReason}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* 4. Always-Visible High-Contrast Legend */}
      <div className="z-20 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 bg-[#080d1a] px-5 py-2.5 text-xs font-mono text-slate-300">
        <div className="flex items-center space-x-4">
          <span className="font-bold text-slate-400 uppercase text-[10px]">Node Types:</span>
          <span className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded bg-[#06242e] border border-cyan-400" />
            <span className="text-cyan-200 text-[11px]">Primary Origin</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded bg-[#151733] border border-indigo-400" />
            <span className="text-indigo-200 text-[11px]">Intermediate Source</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded bg-[#063b2f] border border-emerald-400" />
            <span className="text-emerald-200 text-[11px]">User Claim</span>
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <span className="font-bold text-slate-400 uppercase text-[10px]">Edges:</span>
          <span className="flex items-center space-x-1.5">
            <span className="h-0.5 w-3.5 bg-[#10b981]" />
            <span className="text-emerald-300 text-[11px]">Supports</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="h-0.5 w-3.5 border-t-2 border-dashed border-[#f59e0b]" />
            <span className="text-amber-300 text-[11px]">Partially Supports</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="h-0.5 w-3.5 bg-[#f43f5e]" />
            <span className="text-rose-300 text-[11px]">Contradicts</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="h-0.5 w-3.5 border-t-2 border-dotted border-[#ea580c]" />
            <span className="text-orange-300 text-[11px]">Copied / Echo Chamber</span>
          </span>
        </div>
      </div>
    </div>
  );
}
