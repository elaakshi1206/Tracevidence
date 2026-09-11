import { NextRequest, NextResponse } from 'next/server';
import { performMultiSearch, fetchFullPageContent } from '@/lib/engine/searchService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action = 'search', query, url } = body;

    // 1. Deep full-page crawl action
    if (action === 'crawl') {
      if (!url || typeof url !== 'string') {
        return NextResponse.json({ success: false, error: 'Target URL is required for crawl action' }, { status: 400 });
      }
      const crawlResult = await fetchFullPageContent(url);
      return NextResponse.json({
        success: crawlResult.success,
        url,
        provider: crawlResult.provider,
        title: crawlResult.title,
        content: crawlResult.content,
      });
    }

    // 2. Default multi-provider search action
    if (!query || typeof query !== 'string') {
      return NextResponse.json({ success: false, error: 'Query is required' }, { status: 400 });
    }

    const { activeProviders, results } = await performMultiSearch(query);

    return NextResponse.json({
      success: true,
      query,
      activeProviders,
      resultsCount: results.length,
      results,
    });
  } catch (err: any) {
    console.error('Search API error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET() {
  const configuredProviders = [
    'OpenAlex (Active, Zero-Key Open Access)',
    'Crossref (Active, Zero-Key Open Access)',
    'arXiv (Active, Zero-Key Open Access)',
    'GDELT 2.0 (Active, Zero-Key Open Access)',
    'Wikipedia REST API (Active, Zero-Key Open Access)',
    'DuckDuckGo Instant Answers (Active, Zero-Key Open Access)',
    'Jina Reader Deep Scraper (Active, Zero-Key Open Access)',
  ];

  if (process.env.BRAVE_SEARCH_API_KEY || process.env.NEXT_PUBLIC_BRAVE_SEARCH_API_KEY) {
    configuredProviders.push('Brave Search API (Key Configured)');
  }
  if (process.env.NEWS_API_KEY || process.env.NEXT_PUBLIC_NEWS_API_KEY) {
    configuredProviders.push('NewsAPI (Key Configured)');
  }
  if (process.env.FIRECRAWL_API_KEY || process.env.NEXT_PUBLIC_FIRECRAWL_API_KEY) {
    configuredProviders.push('Firecrawl API (Key Configured)');
  }
  if (process.env.TAVILY_API_KEY || process.env.NEXT_PUBLIC_TAVILY_API_KEY) {
    configuredProviders.push('Tavily Search API (Key Configured)');
  }
  if (process.env.SERPER_API_KEY || process.env.NEXT_PUBLIC_SERPER_API_KEY) {
    configuredProviders.push('Serper Google Search API (Key Configured)');
  }
  if (process.env.EXA_API_KEY || process.env.NEXT_PUBLIC_EXA_API_KEY) {
    configuredProviders.push('Exa Neural Search API (Key Configured)');
  }

  return NextResponse.json({
    status: 'online',
    system: 'TRACEVIDENCE Multi-Provider Evidence Retrieval Engine',
    providers: configuredProviders,
  });
}

