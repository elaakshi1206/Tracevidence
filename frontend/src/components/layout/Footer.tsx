import React from 'react';
import Link from 'next/link';
import { GitBranch, ShieldAlert, BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white text-[#475569] text-xs sm:text-sm">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Col 1: Framing */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0f766e] text-white shadow-xs">
                <GitBranch className="h-4 w-4" />
              </div>
              <span className="font-mono text-sm font-bold text-[#0f172a] tracking-wider">
                TRACE<span className="text-[#0f766e]">VIDENCE</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-[#475569]">
              TRACEVIDENCE does not ask users to trust the system blindly. It makes evidence provenance, source independence, and uncertainty visible so that users can decide how much to trust the information.
            </p>
          </div>

          {/* Col 2: Research Disclaimer */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 space-y-1.5">
            <div className="flex items-center space-x-1.5 font-mono text-xs font-bold text-amber-800">
              <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
              <span>Academic Research Disclaimer</span>
            </div>
            <p className="text-xs text-amber-900/80 leading-relaxed">
              Research prototype for investigating evidence provenance and selective prediction. Not an infallible truth oracle. Always verify important claims with primary sources.
            </p>
          </div>

          {/* Col 3: BibTeX Citation */}
          <div className="space-y-2">
            <div className="flex items-center space-x-1.5 font-mono text-xs font-bold text-[#0f172a]">
              <BookOpen className="h-4 w-4 text-[#0f766e]" />
              <span>Suggested Paper Citation</span>
            </div>
            <pre className="rounded-xl bg-[#f8fafc] p-3 font-mono text-[11px] text-slate-700 border border-slate-200 overflow-x-auto leading-relaxed shadow-2xs">
{`@inproceedings{tracevidence2026,
  title={TRACEVIDENCE: Deep Provenance Tracing and Selective Trust Intelligence},
  author={Research Innovation Team},
  booktitle={Academic Research Proceedings},
  year={2026}
}`}
            </pre>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-6 text-xs font-mono text-[#64748b]">
          <div>
            &copy; 2026 TRACEVIDENCE Research Consortium. Open Academic Prototype.
          </div>
          <div className="flex space-x-5">
            <Link href="/analyze" className="hover:text-[#0f766e] transition-colors">
              Workspace
            </Link>
            <Link href="/graph" className="hover:text-[#0f766e] transition-colors">
              Evidence Graph
            </Link>
            <Link href="/benchmarks" className="hover:text-[#0f766e] transition-colors">
              Benchmarks
            </Link>
            <Link href="/research" className="hover:text-[#0f766e] transition-colors">
              Research Lab
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
