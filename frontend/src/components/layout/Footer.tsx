import React from 'react';
import Link from 'next/link';
import { GitBranch, ShieldAlert, BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/12 bg-[#070b14] text-slate-300 text-sm sm:text-base">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Col 1: Framing */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-rose-500 via-blue-500 to-emerald-400 p-[1px] shadow-md">
                <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-[#0c1220]">
                  <GitBranch className="h-4 w-4 text-white" />
                </div>
              </div>
              <span className="font-mono text-base font-bold text-white tracking-wider">
                TRACE<span className="text-gradient-rbgw">VIDENCE</span>
              </span>
            </div>
            <p className="text-sm sm:text-base leading-relaxed text-slate-300">
              An academic research platform formalizing evidence provenance (TRACE-X) and selective decision intelligence (AIVIDENCE). Designed for verifiable computational journalism, policy auditing, and scientific review.
            </p>
          </div>

          {/* Col 2: Research Disclaimer */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-5 space-y-2">
            <div className="flex items-center space-x-2 font-mono text-sm sm:text-base font-bold text-amber-300">
              <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0" />
              <span>Academic Prototype Disclaimer</span>
            </div>
            <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
              TRACEVIDENCE is a research proof-of-concept exploring selective prediction and citation provenance, not an infallible truth oracle. Empirical claims should always be corroborated with primary laboratory reports and peer-reviewed journals.
            </p>
          </div>

          {/* Col 3: BibTeX Citation */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 font-mono text-sm sm:text-base font-bold text-white">
              <BookOpen className="h-4 w-4 text-blue-400" />
              <span>Suggested Paper Citation</span>
            </div>
            <pre className="rounded-xl bg-black/70 p-3.5 font-mono text-xs text-slate-200 border border-white/10 overflow-x-auto leading-relaxed">
{`@inproceedings{tracevidence2026,
  title={TRACEVIDENCE: Deep Provenance Tracing and Selective Trust Intelligence},
  author={Research Innovation Team},
  booktitle={Proceedings of Avishkar Research Convention},
  year={2026}
}`}
            </pre>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-6 border-t border-white/10 pt-8 text-xs sm:text-sm font-mono text-slate-400">
          <div>
            &copy; 2026 TRACEVIDENCE Research Consortium. Open Academic Prototype.
          </div>
          <div className="flex space-x-6">
            <Link href="/analyze" className="hover:text-white transition-colors">
              Workspace
            </Link>
            <Link href="/graph" className="hover:text-white transition-colors">
              Provenance Graph
            </Link>
            <Link href="/research" className="hover:text-white transition-colors">
              Ablation Suite
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
