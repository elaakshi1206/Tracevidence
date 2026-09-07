'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AnalysisResult, EvidenceGraphNode, EvidenceGraphEdge, SourceTier, PolarityType } from '@/types';
import DecisionBadge from '../common/DecisionBadge';
import SourceBadge from '../common/SourceBadge';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Filter,
  Info,
  Layers,
  Sparkles,
  ExternalLink,
  RotateCcw,
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

  // Compute node positions programmatically for an impressive layout
  // Origin nodes on Left (x: 100), Sources in Center (x: 450), Claims on Right (x: 800)
  const nodePositions = React.useMemo(() => {
    const origins = nodes.filter((n) => n.type === 'origin');
    const sources = nodes.filter((n) => n.type === 'source');
    const claims = nodes.filter((n) => n.type === 'claim');

    const posMap: Record<string, { x: number; y: number }> = {};

    origins.forEach((n, idx) => {
      posMap[n.id] = {
        x: 120,
        y: 120 + idx * 160,
      };
    });

    sources.forEach((n, idx) => {
      posMap[n.id] = {
        x: 480,
        y: 100 + idx * 140,
      };
    });

    claims.forEach((n, idx) => {
      posMap[n.id] = {
        x: 860,
        y: 130 + idx * 180,
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

  return (
    <div className="relative flex flex-col h-[700px] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#07090e] shadow-2xl">
      {/* Top Controls Toolbar */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-[#0d1424]/90 p-2 shadow-xl backdrop-blur-md">
        <div className="flex items-center space-x-1 border-r border-white/10 pr-2">
          <button
            onClick={() => setZoom((z) => Math.min(2.0, z + 0.15))}
            className="rounded p-1.5 text-slate-300 hover:bg-white/10 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.15))}
            className="rounded p-1.5 text-slate-300 hover:bg-white/10 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            className="rounded p-1.5 text-slate-300 hover:bg-white/10 hover:text-white"
            title="Reset View"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        {/* Tier filter */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400 font-mono">Filter:</span>
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="rounded border border-white/10 bg-slate-800 px-2 py-1 text-xs text-slate-200 outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Tiers</option>
            <option value="Academic">Academic</option>
            <option value="Government">Government</option>
            <option value="Reputable Media">Media</option>
            <option value="Aggregator/Blog">Aggregator / Blog</option>
          </select>
        </div>

        <div className="hidden sm:flex items-center space-x-3 text-[11px] font-mono text-slate-400 border-l border-white/10 pl-2">
          <span className="flex items-center space-x-1">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <span>Origins</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="h-2 w-2 rounded-full bg-indigo-400" />
            <span>Sources</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Claims</span>
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="h-full w-full cursor-grab active:cursor-grabbing select-none"
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
            <marker id="arrow-contradict" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
            </marker>
            <marker id="arrow-syndicate" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
            </marker>
            <marker id="arrow-cites" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#06b6d4" />
            </marker>
          </defs>

          {/* Background Grid */}
          <rect width="100%" height="100%" fill="url(#graph-grid)" />

          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* Edges */}
            {edges.map((edge) => {
              const srcPos = nodePositions[edge.source];
              const tgtPos = nodePositions[edge.target];
              if (!srcPos || !tgtPos) return null;

              const isContradict = edge.relationType === 'contradicts';
              const isSyndicate = edge.relationType === 'syndicates';

              let strokeColor = '#06b6d4';
              let marker = 'url(#arrow-cites)';

              if (edge.relationType === 'supports') {
                strokeColor = '#10b981';
                marker = 'url(#arrow-support)';
              } else if (isContradict) {
                strokeColor = '#f43f5e';
                marker = 'url(#arrow-contradict)';
              } else if (isSyndicate) {
                strokeColor = '#f59e0b';
                marker = 'url(#arrow-syndicate)';
              }

              // Cubic bezier curve path
              const dx = tgtPos.x - srcPos.x;
              const pathData = `M ${srcPos.x + 90} ${srcPos.y + 35} C ${srcPos.x + dx * 0.5} ${srcPos.y + 35}, ${tgtPos.x - dx * 0.5} ${tgtPos.y + 35}, ${tgtPos.x - 10} ${tgtPos.y + 35}`;

              return (
                <g key={edge.id} className="group">
                  <path
                    d={pathData}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={isContradict ? 2.5 : 1.8}
                    strokeDasharray={isSyndicate ? '5,5' : undefined}
                    markerEnd={marker}
                    className={edge.animated ? 'animate-pulse' : ''}
                    opacity={0.8}
                  />
                  {edge.label && (
                    <text
                      x={(srcPos.x + tgtPos.x) / 2}
                      y={(srcPos.y + tgtPos.y) / 2 - 8}
                      fill={strokeColor}
                      fontSize="10"
                      fontFamily="monospace"
                      textAnchor="middle"
                      className="bg-black/80 px-1 py-0.5"
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

              let borderColor = 'border-slate-500 shadow-sm';
              let bgColor = 'bg-[#1e293b]';
              if (isClaim) {
                if (node.decision === 'TRUST') {
                  borderColor = 'border-[#059669] ring-1 ring-emerald-500/50 shadow-md shadow-emerald-950/40';
                  bgColor = 'bg-[#064e3b]';
                } else if (node.decision === 'VERIFY') {
                  borderColor = 'border-[#d97706] ring-1 ring-amber-500/50 shadow-md shadow-amber-950/40';
                  bgColor = 'bg-[#451a03]';
                } else {
                  borderColor = 'border-[#e11d48] ring-1 ring-rose-500/50 shadow-md shadow-rose-950/40';
                  bgColor = 'bg-[#4c0519]';
                }
              } else if (isOrigin) {
                borderColor = 'border-[#14b8a6] ring-1 ring-teal-400/50 shadow-md shadow-teal-950/40';
                bgColor = 'bg-[#134e4a]';
              } else {
                borderColor = 'border-slate-400 shadow-md';
                bgColor = 'bg-[#1e293b]';
              }

              return (
                <foreignObject
                  key={node.id}
                  x={pos.x - 80}
                  y={pos.y}
                  width="210"
                  height="90"
                  className="overflow-visible"
                >
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNodeId(node.id);
                    }}
                    className={`h-full w-full cursor-pointer rounded-xl border-2 p-3 transition-all ${borderColor} ${bgColor} ${
                      isSelected ? 'scale-105 ring-2 ring-white' : 'hover:scale-102'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-slate-200 font-bold">
                        {node.type}
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
                        <span className="rounded bg-teal-950 border border-teal-500/30 px-1.5 py-0.5 text-[9px] text-teal-300 font-mono font-bold">
                          {node.tier}
                        </span>
                      )}
                    </div>

                    <div className="mt-1 font-bold text-xs text-white truncate">{node.label}</div>
                    {node.subtitle && (
                      <div className="mt-0.5 text-[10px] text-slate-300 truncate leading-tight">
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

      {/* Selected Node Inspector Drawer */}
      {selectedNode && (() => {
        const matchingSource = analysis.sources.find((s) => s.id === selectedNode.id);
        const matchingClaim = analysis.claims.find((c) => c.id === selectedNode.id);
        const matchingEvidence = analysis.evidences.filter((e) => e.sourceId === selectedNode.id || e.claimId === selectedNode.id);

        return (
          <div className="absolute bottom-4 right-4 z-20 w-88 max-h-80 overflow-y-auto rounded-xl border border-white/15 bg-[#0d1424]/95 p-4 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center space-x-1.5">
                <Info className="h-3.5 w-3.5 text-cyan-400" />
                <span className="font-mono text-xs font-bold uppercase text-white">
                  Node Inspector & Raw Evidence
                </span>
              </div>
              <span className="font-mono text-[10px] text-slate-400">{selectedNode.id}</span>
            </div>

            <div className="mt-2.5">
              <h5 className="text-xs font-bold text-white leading-snug">{selectedNode.label}</h5>
              {selectedNode.subtitle && (
                <p className="mt-1 text-[11px] text-slate-300">{selectedNode.subtitle}</p>
              )}

              {/* Raw Evidence / Snippet */}
              {(matchingSource?.snippet || selectedNode.rawEvidenceSnippet || matchingClaim?.inputQuote) && (
                <div className="mt-2.5 rounded-lg bg-black/40 p-2 text-[11px] text-slate-300 border border-white/10 leading-relaxed font-sans">
                  <span className="font-mono text-[10px] font-bold text-cyan-400 block mb-0.5 uppercase">
                    Raw Evidence Snippet:
                  </span>
                  &ldquo;{matchingSource?.snippet || matchingClaim?.inputQuote || selectedNode.rawEvidenceSnippet}&rdquo;
                </div>
              )}

              <div className="mt-3 space-y-1.5 text-[11px] font-mono border-t border-white/5 pt-2">
                <div className="flex justify-between text-slate-400">
                  <span>Node Type:</span>
                  <span className="font-bold text-cyan-300 uppercase">{selectedNode.type}</span>
                </div>
                {selectedNode.tier && (
                  <div className="flex justify-between text-slate-400">
                    <span>Quality Tier:</span>
                    <span className="text-white font-semibold">{selectedNode.tier}</span>
                  </div>
                )}
                {matchingSource?.publishedDate && (
                  <div className="flex justify-between text-slate-400">
                    <span>Publication Date:</span>
                    <span className="text-slate-200">{matchingSource.publishedDate}</span>
                  </div>
                )}
                {matchingSource?.verbatimOverlapRatio && (
                  <div className="flex justify-between text-slate-400">
                    <span>Verbatim Text Overlap:</span>
                    <span className="text-amber-400 font-bold">
                      {Math.round(matchingSource.verbatimOverlapRatio * 100)}% Derived
                    </span>
                  </div>
                )}
                {matchingSource?.doi && (
                  <div className="flex justify-between text-slate-400">
                    <span>Canonical DOI:</span>
                    <span className="text-emerald-400 font-bold truncate max-w-[150px]">
                      {matchingSource.doi}
                    </span>
                  </div>
                )}
                {selectedNode.decision && (
                  <div className="flex justify-between text-slate-400 pt-1">
                    <span>Trust Decision:</span>
                    <DecisionBadge decision={selectedNode.decision} size="sm" />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
