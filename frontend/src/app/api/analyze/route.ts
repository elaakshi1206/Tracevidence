import { NextRequest, NextResponse } from 'next/server';
import { executeTracevidencePipeline } from '@/lib/engine/pipelineOrchestrator';
import { BENCHMARK_CASES } from '@/lib/benchmarks/demoCases';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, benchmarkId, mode = 'benchmark' } = body;

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
