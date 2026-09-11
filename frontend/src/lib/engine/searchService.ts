export interface SearchResultItem {
  title: string;
  url: string;
  snippet: string;
  publisher?: string;
  publishedDate?: string;
  provider: 'tavily' | 'serper' | 'exa' | 'wikipedia' | 'open_web' | 'openalex' | 'crossref' | 'arxiv' | 'gdelt' | 'newsapi' | 'brave';
  doi?: string;
  citationCount?: number;
  authors?: string[];
  fullContent?: string;
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
      signal: AbortSignal.timeout(6000),
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
      signal: AbortSignal.timeout(6000),
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
      signal: AbortSignal.timeout(6000),
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
 * Queries OpenAlex API for scholarly papers, peer-reviewed citations, DOIs, and abstracts.
 * Free, open-access, zero-key required.
 */
export async function queryOpenAlex(query: string): Promise<SearchResultItem[]> {
  try {
    const cleanQ = query.replace(/[^\w\s-]/g, ' ').trim().slice(0, 150);
    const res = await fetch(`https://api.openalex.org/works?search=${encodeURIComponent(cleanQ)}&per_page=4`, {
      headers: {
        'User-Agent': 'TRACEVIDENCE-Research/1.0 (mailto:team@tracevidence.org)',
      },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    const results = data?.results || [];
    return results.map((work: any) => {
      let abstract = '';
      if (work.abstract_inverted_index) {
        const words: [number, string][] = [];
        for (const [word, positions] of Object.entries(work.abstract_inverted_index as Record<string, number[]>)) {
          for (const pos of positions) {
            words.push([pos, word]);
          }
        }
        words.sort((a, b) => a[0] - b[0]);
        abstract = words.map(w => w[1]).join(' ').slice(0, 500);
      }
      const hostVenue = work.primary_location?.source?.display_name || work.host_venue?.display_name || 'Academic Journal';
      return {
        title: work.title || 'Scholarly Publication',
        url: work.doi || work.id || `https://openalex.org/${work.id}`,
        snippet: abstract || `Published in ${hostVenue} (${work.publication_year || 'Recent'}). Cited by ${work.cited_by_count || 0} scholarly works.`,
        publisher: hostVenue,
        publishedDate: work.publication_date || (work.publication_year ? `${work.publication_year}-01-01` : undefined),
        provider: 'openalex' as const,
        doi: work.doi,
        citationCount: work.cited_by_count,
        authors: (work.authorships || []).slice(0, 3).map((a: any) => a.author?.display_name).filter(Boolean),
      };
    });
  } catch (e) {
    console.warn('OpenAlex search failed:', e);
    return [];
  }
}

/**
 * Queries Crossref API for journal publications, conference proceedings, and DOIs.
 * Free, open-access, zero-key required.
 */
export async function queryCrossref(query: string): Promise<SearchResultItem[]> {
  try {
    const cleanQ = query.replace(/[^\w\s-]/g, ' ').trim().slice(0, 150);
    const res = await fetch(`https://api.crossref.org/works?query=${encodeURIComponent(cleanQ)}&rows=4`, {
      headers: {
        'User-Agent': 'TRACEVIDENCE-CrossrefClient/1.0 (mailto:team@tracevidence.org)',
      },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    const items = data?.message?.items || [];
    return items.map((item: any) => {
      const title = Array.isArray(item.title) ? item.title[0] : (item.title || 'Scholarly Article');
      const publisher = item.publisher || (Array.isArray(item['container-title']) ? item['container-title'][0] : 'Scholarly Publisher');
      const dateParts = item.published?.['date-parts']?.[0] || item['published-print']?.['date-parts']?.[0];
      const publishedDate = dateParts ? `${dateParts[0]}-${String(dateParts[1] || 1).padStart(2, '0')}-${String(dateParts[2] || 1).padStart(2, '0')}` : undefined;
      const url = item.DOI ? `https://doi.org/${item.DOI}` : (item.URL || '');
      const authors = (item.author || []).slice(0, 3).map((a: any) => `${a.given || ''} ${a.family || ''}`.trim()).filter(Boolean);
      return {
        title,
        url,
        snippet: `Peer-reviewed publication in ${publisher}. Indexed in Crossref DOI registry. ${authors.length > 0 ? `Authors: ${authors.join(', ')}.` : ''}`,
        publisher,
        publishedDate,
        provider: 'crossref' as const,
        doi: item.DOI,
        authors,
      };
    });
  } catch (e) {
    console.warn('Crossref search failed:', e);
    return [];
  }
}

/**
 * Queries arXiv API for physics, CS, mathematics, and quantitative biology preprints.
 * Free, open-access, zero-key required.
 */
export async function queryArxiv(query: string): Promise<SearchResultItem[]> {
  try {
    const cleanQ = query.replace(/[^\w\s]/g, ' ').trim().slice(0, 100);
    const res = await fetch(`https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(cleanQ)}&start=0&max_results=4`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return [];
    const xmlText = await res.text();
    const items: SearchResultItem[] = [];
    
    const entries = xmlText.split('<entry>').slice(1);
    for (const entry of entries) {
      const titleMatch = entry.match(/<title>([\s\S]*?)<\/title>/);
      const summaryMatch = entry.match(/<summary>([\s\S]*?)<\/summary>/);
      const idMatch = entry.match(/<id>([\s\S]*?)<\/id>/);
      const publishedMatch = entry.match(/<published>([\s\S]*?)<\/published>/);

      const title = titleMatch ? titleMatch[1].replace(/\s+/g, ' ').trim() : 'arXiv Scientific Paper';
      const snippet = summaryMatch ? summaryMatch[1].replace(/\s+/g, ' ').trim().slice(0, 500) : '';
      const url = idMatch ? idMatch[1].trim() : '';
      const publishedDate = publishedMatch ? publishedMatch[1].split('T')[0] : undefined;

      if (url && snippet) {
        items.push({
          title,
          url,
          snippet,
          publisher: 'arXiv.org (Cornell University)',
          publishedDate,
          provider: 'arxiv' as const,
        });
      }
    }
    return items;
  } catch (e) {
    console.warn('arXiv search failed:', e);
    return [];
  }
}

/**
 * Queries GDELT 2.0 Doc API for real-time global news monitoring with timestamp precedence.
 * Free, open-access, zero-key required.
 */
export async function queryGDELT(query: string): Promise<SearchResultItem[]> {
  try {
    const cleanQ = query.replace(/[^\w\s]/g, ' ').trim().slice(0, 100);
    const res = await fetch(
      `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(cleanQ)}&mode=artlist&maxrecords=5&format=json`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return [];
    const text = await res.text();
    if (!text || !text.trim().startsWith('{')) return [];
    const data = JSON.parse(text);
    const articles = data?.articles || [];
    return articles.map((art: any) => {
      let publishedDate: string | undefined;
      if (art.seendate && art.seendate.length >= 8) {
        const y = art.seendate.substring(0, 4);
        const m = art.seendate.substring(4, 6);
        const d = art.seendate.substring(6, 8);
        publishedDate = `${y}-${m}-${d}`;
      }
      return {
        title: art.title || 'Global News Event Report',
        url: art.url || '',
        snippet: art.title ? `Global news event: "${art.title}". Source outlet: ${art.domain || 'Wire'}.` : 'News event recorded by GDELT monitor.',
        publisher: art.domain || 'Global News Wire',
        publishedDate,
        provider: 'gdelt' as const,
      };
    });
  } catch (e) {
    console.warn('GDELT search failed:', e);
    return [];
  }
}

/**
 * Queries NewsAPI for breaking news and recent events.
 * Requires NEWS_API_KEY.
 */
export async function queryNewsAPI(query: string, apiKey: string): Promise<SearchResultItem[]> {
  try {
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query.slice(0, 100))}&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const articles = data?.articles || [];
    return articles.map((art: any) => ({
      title: art.title || '',
      url: art.url || '',
      snippet: art.description || art.content || art.title || '',
      publisher: art.source?.name || (art.url ? new URL(art.url).hostname.replace(/^www\./, '') : 'News Wire'),
      publishedDate: art.publishedAt ? art.publishedAt.split('T')[0] : undefined,
      provider: 'newsapi' as const,
    }));
  } catch (e) {
    console.warn('NewsAPI search failed:', e);
    return [];
  }
}

/**
 * Queries Brave Search API (Web & News indices).
 * Requires BRAVE_SEARCH_API_KEY.
 */
export async function queryBrave(query: string, apiKey: string): Promise<SearchResultItem[]> {
  try {
    const res = await fetch(
      `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query.slice(0, 150))}&count=5`,
      {
        headers: {
          'Accept': 'application/json',
          'X-Subscription-Token': apiKey,
        },
        signal: AbortSignal.timeout(5000),
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const results = data?.web?.results || [];
    return results.map((r: any) => ({
      title: r.title || '',
      url: r.url || '',
      snippet: r.description || '',
      publisher: r.profile?.name || (r.url ? new URL(r.url).hostname.replace(/^www\./, '') : 'Web'),
      publishedDate: r.page_age ? r.page_age.split('T')[0] : undefined,
      provider: 'brave' as const,
    }));
  } catch (e) {
    console.warn('Brave search failed:', e);
    return [];
  }
}

/**
 * Full page content reader and scraper using Jina Reader (r.jina.ai) or Firecrawl.
 * Jina Reader requires NO API KEY and returns clean markdown.
 */
export async function fetchFullPageContent(
  url: string,
  options?: { firecrawlKey?: string; jinaKey?: string }
): Promise<{ success: boolean; content: string; provider: string; title?: string }> {
  if (!url || !url.startsWith('http')) {
    return { success: false, content: '', provider: 'none' };
  }

  // 1. Try Firecrawl if key is provided
  const firecrawlKey = options?.firecrawlKey || process.env.FIRECRAWL_API_KEY || process.env.NEXT_PUBLIC_FIRECRAWL_API_KEY;
  if (firecrawlKey) {
    try {
      const fcRes = await fetch('https://api.firecrawl.dev/v1/scrape', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${firecrawlKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, formats: ['markdown'] }),
        signal: AbortSignal.timeout(7000),
      });
      if (fcRes.ok) {
        const fcData = await fcRes.json();
        const md = fcData?.data?.markdown || fcData?.data?.content || '';
        if (md.length > 50) {
          return {
            success: true,
            content: md.slice(0, 10000),
            provider: 'firecrawl',
            title: fcData?.data?.metadata?.title,
          };
        }
      }
    } catch (e) {
      console.warn('Firecrawl fetch failed, falling back to Jina Reader:', e);
    }
  }

  // 2. Try Jina Reader (free, zero-key required, returns clean markdown)
  try {
    const jinaHeaders: Record<string, string> = {
      'Accept': 'text/markdown',
      'X-No-Cache': 'true',
    };
    const jinaKey = options?.jinaKey || process.env.JINA_API_KEY || process.env.NEXT_PUBLIC_JINA_API_KEY;
    if (jinaKey) {
      jinaHeaders['Authorization'] = `Bearer ${jinaKey}`;
    }

    const jinaRes = await fetch(`https://r.jina.ai/${url}`, {
      headers: jinaHeaders,
      signal: AbortSignal.timeout(6000),
    });

    if (jinaRes.ok) {
      const text = await jinaRes.text();
      if (text && text.trim().length > 50) {
        return {
          success: true,
          content: text.slice(0, 10000),
          provider: 'jina-reader',
        };
      }
    }
  } catch (e) {
    console.warn('Jina Reader fetch failed, falling back to native fetch:', e);
  }

  // 3. Fallback: simple text extraction via standard fetch
  try {
    const rawRes = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) TRACEVIDENCE/1.0',
      },
      signal: AbortSignal.timeout(4000),
    });
    if (rawRes.ok) {
      const html = await rawRes.text();
      const stripped = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      return {
        success: true,
        content: stripped.slice(0, 8000),
        provider: 'native-fetch',
      };
    }
  } catch (e) {
    console.warn('Native HTML fetch failed:', e);
  }

  return { success: false, content: '', provider: 'none' };
}

/**
 * Classifies whether a query has academic or news intent to optimize provider selection
 */
export function classifyQueryIntent(query: string): {
  isAcademic: boolean;
  isNews: boolean;
} {
  const q = query.toLowerCase();
  const academicTerms = [
    'study', 'research', 'experiment', 'trial', 'peer-reviewed', 'doi',
    'clinical', 'physics', 'quantum', 'algorithm', 'dna', 'genome', 'crispr',
    'emissions', 'lifecycle', 'chemistry', 'biology', 'astronomy', 'neural',
    'vaccine', 'efficacy', 'mortality', 'nobel', 'theory', 'paper', 'journal'
  ];
  const newsTerms = [
    'announced', 'launched', 'breaking', 'today', 'yesterday', 'minister',
    'president', 'election', 'ceasefire', 'treaty', 'policy', 'resigned',
    'stocks', 'inflation', 'gdp', 'acquisition', 'sec', 'sanctions', 'summit',
    'parliament', 'congress', 'war', 'crisis', 'spokesperson'
  ];

  const isAcademic = academicTerms.some(term => q.includes(term));
  const isNews = newsTerms.some(term => q.includes(term));
  return { isAcademic, isNews };
}

// Common entertainment / fiction / pop culture markers in Wikipedia titles
const ENTERTAINMENT_DISAMBIG_REGEX = /\((?:film|tv series|television series|song|album|novel|play|musical|actor|actress|band|character|fairy[- ]tale|video game|franchise|soundtrack|comics|miniseries)\)/i;
const PROPOSITION_BALLOT_REGEX = /\b(?:california proposition|proposition \d+)\b/i;

// Basic English stop words
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can\'t', 'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t',
  'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have',
  'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself',
  'him', 'himself', 'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into',
  'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my',
  'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our',
  'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s',
  'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs',
  'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re',
  'they\'ve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t',
  'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s',
  'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t',
  'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself',
  'yourselves'
]);

/**
 * Extracts substantive, non-stopword tokens from text (preserving crucial short words like 'sun', 'dna')
 */
export function extractSubstantiveTokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 1 && !STOP_WORDS.has(token));
}

/**
 * Computes semantic lexical overlap ratio between a query and a text snippet/title
 */
export function computeLexicalOverlap(query: string, text: string): number {
  const queryTokens = extractSubstantiveTokens(query);
  if (queryTokens.length === 0) return 0.5;

  const targetTokens = new Set(extractSubstantiveTokens(text));
  let matched = 0;
  for (const q of queryTokens) {
    if (targetTokens.has(q)) {
      matched++;
    } else {
      // Partial prefix / root match (e.g. set vs sets, rose vs rise)
      for (const t of targetTokens) {
        if (t.startsWith(q) || q.startsWith(t)) {
          matched += 0.8;
          break;
        }
      }
    }
  }

  return Math.min(1.0, matched / queryTokens.length);
}

/**
 * Queries Wikipedia REST API for authoritative, real factual reference
 * Includes smart disambiguation, pop-culture filtering, and topic relevance ranking.
 */
async function queryWikipedia(query: string): Promise<SearchResultItem[]> {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
      query
    )}&srlimit=12&utf8=&format=json`;
    const res = await fetch(searchUrl, {
      headers: { 'User-Agent': 'TRACEVIDENCE-FactChecker/1.0 (contact@tracevidence.org)' },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) return [];
    const data = await res.json();
    const searchResults = data?.query?.search || [];
    if (!Array.isArray(searchResults) || searchResults.length === 0) return [];

    const queryLower = query.toLowerCase();
    const queryMentionsEntertainment = /(film|movie|song|album|series|actor|actress|band|fiction|book|play|musical)/i.test(queryLower);
    const queryMentionsBallot = /(proposition|ballot|referendum|election|vote|measure)/i.test(queryLower);

    // Filter out obviously irrelevant noise (disambiguation pages, unrelated fiction/movies/ballots/numbers/festivals/biographies)
    const queryAsksPerson = /(who is|born|died|biography|politician|scientist|person|actor|actress|author|president|minister)/i.test(queryLower);
    const queryAsksNumber = /\b(?:prime number|integer|even number|odd number|numeral)\b/i.test(queryLower);
    const queryAsksFestival = /(festival|ceremony|award|carnival)/i.test(queryLower);

    const validCandidates = searchResults.filter((item: any) => {
      const title = item.title || '';
      const snippet = (item.snippet || '').replace(/<[^>]+>/g, '').toLowerCase();
      const titleLower = title.toLowerCase();

      // Disambiguation pages
      if (titleLower.includes('(disambiguation)')) return false;

      // Pure number pages (e.g. "24 (number)", "23 (number)") unless query asks for number theory
      if (!queryAsksNumber && (/\b\d+\s*\(number\)/i.test(title) || /\b\d+\s*\(disambiguation\)/i.test(title))) {
        return false;
      }

      // Festivals / awards / ceremonies unless requested
      if (!queryAsksFestival && (
        /\b(?:international\s+)?film\s+festival\b/i.test(title) ||
        /\b(?:annual\s+)?awards?\b/i.test(title) ||
        titleLower.includes('film festival')
      )) {
        return false;
      }

      // Unrelated biographies when query is about natural science, astronomy, or state symbols
      if (!queryAsksPerson && (
        snippet.includes('was a pakistani') ||
        snippet.includes('is a pakistani') ||
        snippet.includes('was an american') ||
        snippet.includes('was an english') ||
        snippet.includes('was an indian actor') ||
        snippet.includes('was an indian cricketer') ||
        snippet.includes('was born on') ||
        snippet.includes('was a computer prodigy') ||
        /\bwas an? (?:actor|actress|cricketer|footballer|singer|politician|poet|prodigy)\b/i.test(snippet)
      )) {
        return false;
      }

      // Unrelated pop culture / fiction / video game pages
      if (!queryMentionsEntertainment && ENTERTAINMENT_DISAMBIG_REGEX.test(title)) {
        return false;
      }
      if (!queryMentionsEntertainment && (
        snippet.includes('is a television series') ||
        snippet.includes('is an american drama television series') ||
        snippet.includes('is a musical') ||
        snippet.includes('is a norwegian fairy-tale') ||
        snippet.includes('is a film directed by') ||
        snippet.includes('is a song recorded by') ||
        snippet.includes('is a beach') ||
        snippet.includes('action-adventure game') ||
        snippet.includes('game developed by') ||
        snippet.includes('is a video game') ||
        snippet.includes('video game') ||
        titleLower.includes('sunset overdrive') ||
        snippet.includes('is an ancient egyptian')
      )) {
        return false;
      }

      // Unrelated California / state ballot propositions
      if (!queryMentionsBallot && PROPOSITION_BALLOT_REGEX.test(title)) {
        return false;
      }
      if (!queryMentionsBallot && snippet.includes('california proposition')) {
        return false;
      }

      return true;
    });

    // Score candidates based on lexical and topical overlap with query
    const scoredCandidates = validCandidates.map((item: any) => {
      const title = item.title || '';
      const cleanSnippet = (item.snippet || '').replace(/<[^>]+>/g, '');
      const overlap = computeLexicalOverlap(query, `${title} ${cleanSnippet}`);
      return { item, title, cleanSnippet, overlap };
    });

    // Sort by overlap descending
    scoredCandidates.sort((a, b) => b.overlap - a.overlap);

    // Keep top candidates with strict minimum overlap (at least 0.28)
    // NEVER force low-overlap (< 0.28) candidates: if none pass, return empty
    const topCandidates = scoredCandidates
      .filter(c => c.overlap >= 0.28)
      .slice(0, 4);

    const candidatesToFetch = topCandidates;

    const items: SearchResultItem[] = [];
    for (const cand of candidatesToFetch) {
      const title = cand.title;
      const cleanSnippet = cand.cleanSnippet;
      const pageUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/\s+/g, '_'))}`;

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
          const extract = summaryData.extract || cleanSnippet;

          // Double check summary extract against entertainment / ballot filters
          if (!queryMentionsEntertainment && (
            extract.includes('is an American drama television series') ||
            extract.includes('is a television series') ||
            extract.includes('is a Norwegian fairy-tale') ||
            extract.includes('is a musical with music by')
          )) {
            continue;
          }

          // Combine search snippet and summary extract to preserve specific matched factual evidence
          const combinedSnippet = cleanSnippet && extract && !extract.toLowerCase().includes(cleanSnippet.toLowerCase().slice(0, 30))
            ? `${cleanSnippet}. ${extract}`
            : (extract || cleanSnippet);

          items.push({
            title: summaryData.title || title,
            url: summaryData.content_urls?.desktop?.page || pageUrl,
            snippet: combinedSnippet.slice(0, 650),
            publisher: 'en.wikipedia.org',
            publishedDate: summaryData.timestamp || new Date().toISOString().split('T')[0],
            provider: 'wikipedia' as const,
          });
          continue;
        }
      } catch {
        // use snippet fallback
      }

      items.push({
        title,
        url: pageUrl,
        snippet: cleanSnippet.slice(0, 500),
        publisher: 'en.wikipedia.org',
        publishedDate: new Date().toISOString().split('T')[0],
        provider: 'wikipedia' as const,
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
      { signal: AbortSignal.timeout(4000) }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const items: SearchResultItem[] = [];

    if (data.Abstract && data.AbstractURL) {
      const overlap = computeLexicalOverlap(query, `${data.Heading || ''} ${data.Abstract}`);
      if (overlap >= 0.25) {
        items.push({
          title: data.Heading || query,
          url: data.AbstractURL,
          snippet: data.AbstractText || data.Abstract,
          publisher: data.AbstractSource || new URL(data.AbstractURL).hostname.replace(/^www\./, ''),
          provider: 'open_web',
        });
      }
    }

    if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
      for (const topic of data.RelatedTopics.slice(0, 4)) {
        if (topic.Text && topic.FirstURL) {
          const overlap = computeLexicalOverlap(query, topic.Text);
          if (overlap >= 0.25) {
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
    }

    return items;
  } catch (e) {
    console.warn('DuckDuckGo query failed:', e);
    return [];
  }
}


/**
 * Extracts a canonical search topic from a claim to guide Wikipedia toward authoritative encyclopedic articles
 */
export function extractCanonicalSearchTopic(query: string): string | null {
  const q = query.toLowerCase();
  if (q.includes('ashoka chakra') || (q.includes('chakra') && (q.includes('spoke') || q.includes('flag')))) {
    return 'Ashoka Chakra';
  }
  if ((q.includes('flag') || q.includes('tiranga') || q.includes('tricolour')) && (q.includes('india') || q.includes('indian'))) {
    return 'Flag of India';
  }
  if (q.includes('sun') && (q.includes('set') || q.includes('setting') || q.includes('rise') || q.includes('rising') || q.includes('east') || q.includes('west'))) {
    return 'Sunset';
  }
  if (q.includes('national bird') && q.includes('india')) {
    return 'Indian peafowl';
  }
  if (q.includes('national animal') && q.includes('india')) {
    return 'Royal Bengal tiger';
  }
  return null;
}

/**
 * Unified multi-search service combining Tavily, Serper/Exa, and Open Reference APIs
 */
export async function performMultiSearch(query: string): Promise<{
  activeProviders: string[];
  results: SearchResultItem[];
}> {
  // If running in the browser, delegate to /api/search to avoid CORS and forbidden header restrictions
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.results)) {
          return {
            activeProviders: data.activeProviders || ['Wikipedia', 'OpenWeb'],
            results: data.results,
          };
        }
      }
    } catch (err) {
      console.warn('Browser /api/search delegation failed, falling back:', err);
    }
  }

  const tavilyKey = process.env.TAVILY_API_KEY || process.env.NEXT_PUBLIC_TAVILY_API_KEY;
  const serperKey = process.env.SERPER_API_KEY || process.env.NEXT_PUBLIC_SERPER_API_KEY;
  const exaKey = process.env.EXA_API_KEY || process.env.NEXT_PUBLIC_EXA_API_KEY;
  const braveKey = process.env.BRAVE_SEARCH_API_KEY || process.env.NEXT_PUBLIC_BRAVE_SEARCH_API_KEY;
  const newsKey = process.env.NEWS_API_KEY || process.env.NEXT_PUBLIC_NEWS_API_KEY;

  const { isAcademic, isNews } = classifyQueryIntent(query);

  const promises: Promise<SearchResultItem[]>[] = [];
  const activeProviders: string[] = [];

  // 1. Tavily
  if (tavilyKey) {
    promises.push(queryTavily(query, tavilyKey));
    activeProviders.push('Tavily');
  }

  // 2. Serper (Google Search Index)
  if (serperKey) {
    promises.push(querySerper(query, serperKey));
    activeProviders.push('Serper');
  }

  // 3. Exa (Semantic Neural Search)
  if (exaKey) {
    promises.push(queryExa(query, exaKey));
    activeProviders.push('Exa');
  }

  // 4. Brave Search API
  if (braveKey) {
    promises.push(queryBrave(query, braveKey));
    activeProviders.push('Brave');
  }

  // 5. NewsAPI (if configured)
  if (newsKey) {
    promises.push(queryNewsAPI(query, newsKey));
    activeProviders.push('NewsAPI');
  }

  // 6. GDELT (Real-time global news monitor, zero-key open access)
  promises.push(queryGDELT(query));
  activeProviders.push('GDELT');

  // 7. Academic / Scientific Repositories (OpenAlex, Crossref, arXiv)
  // If query is academic, query all three. Otherwise, query OpenAlex for authoritative peer-reviewed coverage.
  promises.push(queryOpenAlex(query));
  activeProviders.push('OpenAlex');

  if (isAcademic) {
    promises.push(queryCrossref(query));
    activeProviders.push('Crossref');
    promises.push(queryArxiv(query));
    activeProviders.push('arXiv');
  }

  // 8. Authoritative Encyclopedia (Wikipedia + DuckDuckGo)
  promises.push(queryWikipedia(query));
  activeProviders.push('Wikipedia');

  // If a canonical topic is recognized, query Wikipedia for the authoritative page as well
  const canonicalTopic = extractCanonicalSearchTopic(query);
  if (canonicalTopic && canonicalTopic.toLowerCase() !== query.toLowerCase()) {
    promises.push(queryWikipedia(canonicalTopic));
  }

  promises.push(queryDuckDuckGo(query));
  activeProviders.push('DuckDuckGo');

  const searchResponses = await Promise.allSettled(promises);
  const combinedResults: SearchResultItem[] = [];

  for (const r of searchResponses) {
    if (r.status === 'fulfilled' && Array.isArray(r.value)) {
      combinedResults.push(...r.value);
    }
  }

  return {
    activeProviders,
    results: combinedResults,
  };
}
