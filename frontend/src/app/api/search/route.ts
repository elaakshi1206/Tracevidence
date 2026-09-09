import { NextRequest, NextResponse } from 'next/server';
import { performMultiSearch } from '@/lib/engine/searchService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ success: false, error: 'Query is required' }, { status: 400 });
    }

    const { activeProviders, results } = await performMultiSearch(query);

    return NextResponse.json({
      success: true,
      query,
      activeProviders,
      results,
    });
  } catch (err: any) {
    console.error('Search API error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
