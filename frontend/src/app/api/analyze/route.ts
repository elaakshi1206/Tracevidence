import { NextRequest, NextResponse } from 'next/server';
import { executeTracevidencePipeline } from '@/lib/engine/pipelineOrchestrator';
import { BENCHMARK_CASES } from '@/lib/benchmarks/demoCases';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, benchmarkId, mode = 'benchmark' } = body;

    // 1. Curated benchmark lookup
    if (benchmarkId) {
      const found = BENCHMARK_CASES.find(b => b.id === benchmarkId);
      if (found) {
        return NextResponse.json({
          success: true,
          data: {
            ...found.data,
            analysisMode: 'benchmark',
            modeBadgeLabel: 'Curated Benchmark',
          },
        });
      }
    }

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Input text is required for analysis.' },
        { status: 400 }
      );
    }

    // 2. Dual-Engine Synergy: Attempt to delegate to FastAPI backend for database persistence
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    if (mode === 'live') {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2500);

        const backendRes = await fetch(`${backendUrl}/api/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, mode }),
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (backendRes.ok) {
          const backendData = await backendRes.json();
          return NextResponse.json({
            success: true,
            data: {
              ...backendData,
              analysisMode: 'live',
              modeBadgeLabel: 'Backend DB Persisted',
            },
          });
        }
      } catch {
        // Backend service is offline/unreachable; seamlessly fall through to local Next.js engine
      }
    }

    // 3. Resilient Local Analytical Execution
    const result = await executeTracevidencePipeline(text, {
      mode: mode === 'live' ? 'live' : 'benchmark',
      benchmarkId,
    });
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Analysis pipeline error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Pipeline execution failed.' },
      { status: 500 }
    );
  }
}
