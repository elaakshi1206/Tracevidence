'use client';

import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, Sparkles, Lightbulb, X, Info } from 'lucide-react';

export interface ContextHelpTooltipProps {
  title: string;
  simpleExplanation: string;
  whyItMatters?: string;
  example?: string;
  icon?: 'help' | 'sparkle' | 'lightbulb' | 'info';
  size?: 'xs' | 'sm' | 'md';
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export default function ContextHelpTooltip({
  title,
  simpleExplanation,
  whyItMatters,
  example,
  icon = 'help',
  size = 'sm',
  align = 'center',
  className = '',
}: ContextHelpTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const IconComponent =
    icon === 'sparkle'
      ? Sparkles
      : icon === 'lightbulb'
      ? Lightbulb
      : icon === 'info'
      ? Info
      : HelpCircle;

  const iconSizes = {
    xs: 'h-3 w-3',
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
  };

  const alignStyles = {
    left: 'left-0 origin-top-left',
    center: 'left-1/2 -translate-x-1/2 origin-top',
    right: 'right-0 origin-top-right',
  };

  return (
    <div className={`relative inline-flex items-center ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="group inline-flex items-center justify-center rounded-full p-0.5 text-cyan-400/80 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors focus:outline-none focus:ring-1 focus:ring-cyan-400"
        title={`Help: ${title}`}
        aria-label={`Learn more about ${title}`}
      >
        <IconComponent className={`${iconSizes[size]} transition-transform group-hover:scale-110`} />
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute bottom-full mb-2 z-50 w-72 sm:w-80 rounded-xl border border-cyan-500/40 bg-[#0d1424]/95 p-3.5 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 ${alignStyles[align]}`}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-2">
            <div className="flex items-center space-x-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-cyan-500/20 text-cyan-400">
                <Lightbulb className="h-3 w-3" />
              </span>
              <h4 className="font-mono text-xs font-bold text-white tracking-tight">{title}</h4>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-0.5 rounded"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Body: Plain English */}
          <div className="mt-2.5 space-y-2 text-xs">
            <div>
              <span className="font-semibold text-cyan-300">In simple terms: </span>
              <span className="text-slate-200 leading-relaxed">{simpleExplanation}</span>
            </div>

            {whyItMatters && (
              <div className="rounded-lg bg-cyan-950/40 p-2 border border-cyan-500/20">
                <span className="font-semibold text-emerald-300">Why this matters: </span>
                <span className="text-slate-300 text-[11px] leading-relaxed">{whyItMatters}</span>
              </div>
            )}

            {example && (
              <div className="rounded-lg bg-black/30 p-2 text-[11px] text-slate-400 italic border border-white/5">
                <span className="font-medium text-amber-300 not-italic">Example: </span>
                {example}
              </div>
            )}
          </div>

          {/* Pointer tail */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-3 w-3 rotate-45 border-r border-b border-cyan-500/40 bg-[#0d1424]" />
        </div>
      )}
    </div>
  );
}
