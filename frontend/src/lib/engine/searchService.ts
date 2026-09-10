export interface SearchResultItem {
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

      // Unrelated pop culture / fiction pages
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
        snippet.includes('is a beach in') ||
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
  promises.push(queryWikipedia(query));
  activeProviders.push('Wikipedia');

  // If a canonical topic is recognized, query Wikipedia for the authoritative page as well
  const canonicalTopic = extractCanonicalSearchTopic(query);
  if (canonicalTopic && canonicalTopic.toLowerCase() !== query.toLowerCase()) {
    promises.push(queryWikipedia(canonicalTopic));
  }

  promises.push(queryDuckDuckGo(query));
  activeProviders.push('OpenWeb');

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
