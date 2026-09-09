import { NextRequest, NextResponse } from 'next/server';

interface SearchResultItem {
  title: string;
  url: string;
  snippet: string;
  publisher?: string;
  publishedDate?: string;
  provider: 'tavily' | 'serper' | 'exa' | 'wikipedia' | 'open_web';
}

/**
 * Queries Tavily Search API
 */
async function queryTavily(query: string, apiKey: string): Promise<SearchResultItem[]> {
  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: 'advanced',
        max_results: 6,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map((r: any) => ({
      title: r.title || '',
      url: r.url || '',
      snippet: r.content || r.snippet || '',
      publisher: new URL(r.url).hostname.replace(/^www\./, ''),
      publishedDate: r.published_date,
      provider: 'tavily' as const,
    }));
  } catch (e) {
    console.warn('Tavily search failed:', e);
    return [];
  }
}

/**
 * Queries Serper (Google Search) API
 */
async function querySerper(query: string, apiKey: string): Promise<SearchResultItem[]> {
  try {
    const res = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: query,
        num: 6,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return [];
    const data = await res.json();
    const organic = data.organic || [];
    return organic.map((r: any) => ({
      title: r.title || '',
      url: r.link || '',
      snippet: r.snippet || '',
      publisher: new URL(r.link).hostname.replace(/^www\./, ''),
      publishedDate: r.date,
      provider: 'serper' as const,
    }));
  } catch (e) {
    console.warn('Serper search failed:', e);
    return [];
  }
}

/**
 * Queries Exa Semantic Search API
 */
async function queryExa(query: string, apiKey: string): Promise<SearchResultItem[]> {
  try {
    const res = await fetch('https://api.exa.ai/search', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        num_results: 6,
        use_autoprompt: true,
        contents: { text: { max_characters: 500 } },
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map((r: any) => ({
      title: r.title || '',
      url: r.url || '',
      snippet: r.text || '',
      publisher: new URL(r.url).hostname.replace(/^www\./, ''),
      publishedDate: r.published_date,
      provider: 'exa' as const,
    }));
  } catch (e) {
    console.warn('Exa search failed:', e);
    return [];
  }
}

/**
 * Queries Wikipedia REST API for authoritative, real factual reference
 */
async function queryWikipedia(query: string): Promise<SearchResultItem[]> {
  try {
    // 1. Search for matching pages
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
      query
    )}&utf8=&format=json`;
    const res = await fetch(searchUrl, {
      headers: { 'User-Agent': 'TRACEVIDENCE-FactChecker/1.0 (contact@tracevidence.org)' },
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) return [];
    const data = await res.json();
    const searchResults = data?.query?.search || [];

    const items: SearchResultItem[] = [];
    for (const item of searchResults.slice(0, 3)) {
      const title = item.title;
      const cleanSnippet = (item.snippet || '').replace(/<[^>]+>/g, '');
      const pageUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/\s+/g, '_'))}`;

      // Fetch summary
      try {
        const summaryRes = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/\s+/g, '_'))}`,
          {
            headers: { 'User-Agent': 'TRACEVIDENCE-FactChecker/1.0' },
            signal: AbortSignal.timeout(3000),
          }
        );
        if (summaryRes.ok) {
          const summaryData = await summaryRes.json();
          items.push({
            title: summaryData.title || title,
            url: summaryData.content_urls?.desktop?.page || pageUrl,
            snippet: summaryData.extract || cleanSnippet,
            publisher: 'en.wikipedia.org',
            publishedDate: summaryData.timestamp || new Date().toISOString().split('T')[0],
            provider: 'wikipedia',
          });
          continue;
        }
      } catch {
        // fallback to search snippet
      }

      items.push({
        title,
        url: pageUrl,
        snippet: cleanSnippet,
        publisher: 'en.wikipedia.org',
        publishedDate: new Date().toISOString().split('T')[0],
        provider: 'wikipedia',
      });
    }

    return items;
  } catch (e) {
    console.warn('Wikipedia query failed:', e);
    return [];
  }
}

/**
 * Queries DuckDuckGo Instant Answer API for real public facts
 */
async function queryDuckDuckGo(query: string): Promise<SearchResultItem[]> {
  try {
    const res = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const items: SearchResultItem[] = [];

    if (data.Abstract && data.AbstractURL) {
      items.push({
        title: data.Heading || query,
        url: data.AbstractURL,
        snippet: data.AbstractText || data.Abstract,
        publisher: data.AbstractSource || new URL(data.AbstractURL).hostname.replace(/^www\./, ''),
        provider: 'open_web',
      });
    }

    if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
      for (const topic of data.RelatedTopics.slice(0, 2)) {
        if (topic.Text && topic.FirstURL) {
          items.push({
            title: topic.Text.slice(0, 60),
            url: topic.FirstURL,
            snippet: topic.Text,
            publisher: new URL(topic.FirstURL).hostname.replace(/^www\./, ''),
            provider: 'open_web',
          });
        }
      }
    }

    return items;
  } catch (e) {
    console.warn('DuckDuckGo query failed:', e);
    return [];
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ success: false, error: 'Query is required' }, { status: 400 });
    }

    const tavilyKey = process.env.TAVILY_API_KEY || process.env.NEXT_PUBLIC_TAVILY_API_KEY;
    const serperKey = process.env.SERPER_API_KEY || process.env.NEXT_PUBLIC_SERPER_API_KEY;
    const exaKey = process.env.EXA_API_KEY || process.env.NEXT_PUBLIC_EXA_API_KEY;

    const promises: Promise<SearchResultItem[]>[] = [];
    const activeProviders: string[] = [];

    // 1. Tavily
    if (tavilyKey) {
      promises.push(queryTavily(query, tavilyKey));
      activeProviders.push('Tavily');
    }

    // 2. Serper (Preferred secondary Google search index)
    if (serperKey) {
      promises.push(querySerper(query, serperKey));
      activeProviders.push('Serper');
    }

    // 3. Exa (Alternative neural search)
    if (exaKey) {
      promises.push(queryExa(query, exaKey));
      activeProviders.push('Exa');
    }

    // 4. Always include authoritative open web encyclopedia search (Wikipedia + DuckDuckGo)
    // to guarantee REAL, live factual documents even if commercial keys are absent or exhausted
    promises.push(queryWikipedia(query));
    activeProviders.push('Wikipedia');

    promises.push(queryDuckDuckGo(query));
    activeProviders.push('OpenWeb');

    const searchResponses = await Promise.allSettled(promises);
    const combinedResults: SearchResultItem[] = [];

    for (const r of searchResponses) {
      if (r.status === 'fulfilled' && Array.isArray(r.value)) {
        combinedResults.push(...r.value);
      }
    }

    return NextResponse.json({
      success: true,
      query,
      activeProviders,
      results: combinedResults,
    });
  } catch (err: any) {
    console.error('Search API error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
