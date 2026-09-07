import React from 'react';
import Link from 'next/link';
import { GitBranch, ShieldAlert, BookOpen, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-[#05070a] text-slate-400 text-xs">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Col 1: Framing */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-cyan-500/20 text-cyan-400">
                <GitBranch className="h-3.5 w-3.5" />
              </div>
              <span className="font-mono font-bold text-white tracking-wider">TRACEVIDENCE</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              An academic research platform formalizing evidence provenance (TRACE-X) and selective decision intelligence (AIVIDENCE). Designed for verifiable computational journalism, policy auditing, and scientific review.
            </p>
          </div>

          {/* Col 2: Research Disclaimer */}
          <div className="rounded-xl border border-amber-500/20 bg-amber-950/10 p-4 space-y-1.5">
            <div className="flex items-center space-x-1.5 font-mono text-[11px] font-bold text-amber-300">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
              <span>Academic Prototype Disclaimer</span>
            </div>
            <p className="text-[10px] text-amber-200/80 leading-relaxed">
              TRACEVIDENCE is a research proof-of-concept exploring selective prediction and citation provenance, not an infallible truth oracle. Empirical claims should always be corroborated with primary laboratory reports and peer-reviewed journals.
            </p>
          </div>

          {/* Col 3: BibTeX Citation */}
          <div className="space-y-2">
            <div className="flex items-center space-x-1.5 font-mono text-[11px] font-bold text-white">
              <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
              <span>Suggested Paper Citation</span>
            </div>
            <pre className="rounded-lg bg-black/60 p-2.5 font-mono text-[9px] text-slate-300 border border-white/5 overflow-x-auto">
{`@inproceedings{tracevidence2026,
  title={TRACEVIDENCE: Deep Provenance Tracing and Selective Trust Intelligence},
  author={Research Innovation Team},
  booktitle={Proceedings of Avishkar Research Convention},
  year={2026}
}`}
            </pre>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-6 text-[11px] font-mono text-slate-500">
          <div>
            &copy; 2026 TRACEVIDENCE Research Consortium. Open Academic Prototype.
          </div>
          <div className="flex space-x-4">
            <Link href="/analyze" className="hover:text-cyan-400 transition-colors">
              Workspace
            </Link>
            <Link href="/graph" className="hover:text-cyan-400 transition-colors">
              Provenance Graph
            </Link>
            <Link href="/research" className="hover:text-cyan-400 transition-colors">
              Ablation Suite
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
