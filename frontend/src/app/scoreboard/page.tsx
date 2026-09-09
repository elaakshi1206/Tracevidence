'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Award, ArrowRight } from 'lucide-react';

export default function ScoreboardRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/research?tab=scoreboard');
  }, [router]);

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center space-y-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0f766e] text-white mx-auto shadow-md">
        <Award className="h-6 w-6" />
      </div>
      <h1 className="text-xl font-bold font-mono text-[#0f172a]">
        Scoreboard has moved into the Research Lab
      </h1>
      <p className="text-sm text-slate-600">
        Redirecting you to the unified Research Lab Scoreboard tab...
      </p>
      <Link
        href="/research?tab=scoreboard"
        className="inline-flex items-center gap-2 rounded-xl bg-[#0f766e] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#115e59] transition-all"
      >
        <span>Go to Research Lab Scoreboard</span>
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
