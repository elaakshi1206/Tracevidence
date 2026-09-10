import { Source, SourceTier } from '@/types';
import { performMultiSearch, SearchResultItem } from './searchService';

export interface RetrievalResult {
  sources: Source[];
  backendUsed: string;
  queryTerms: string[];
  retrievalTimestamp: string;
}

/**
 * Classifies publisher into a credibility tier, prioritizing government,
 * educational, and verified encyclopedic authorities.
 */
export function classifySourceTier(publisher: string, url?: string): SourceTier {
  const p = publisher.toLowerCase();
  const u = (url || '').toLowerCase();

  // Government & Sovereign bodies
  if (
    p.includes('government') ||
    p.includes('ministry') ||
    p.includes('department') ||
    p.includes('parliament') ||
    p.includes('assembly') ||
    p.includes('who') ||
    p.includes('fda') ||
    p.includes('epa') ||
    p.includes('eea') ||
    p.includes('archive.india.gov.in') ||
    p.includes('knowindia.india.gov.in') ||
    u.includes('.gov.in') ||
    u.includes('.nic.in') ||
    u.includes('.gov') ||
    u.includes('.europa.eu')
  ) {
    return 'Government';
  }

  // Academic & Peer-Reviewed
  if (
    p.includes('nature') ||
    p.includes('science') ||
    p.includes('lancet') ||
    p.includes('nejm') ||
    p.includes('ieee') ||
    p.includes('acm') ||
    p.includes('university') ||
    p.includes('institute') ||
    p.includes('laboratory') ||
    p.includes('consortium') ||
    p.includes('jstor') ||
    p.includes('springer') ||
    u.includes('.edu') ||
    u.includes('doi.org') ||
    u.includes('arxiv.org')
  ) {
    return 'Academic';
  }

  // Official Standards, Historical Authorities, and Canonical Encyclopedias
  if (
    p.includes('wikipedia') ||
    p.includes('britannica') ||
    p.includes('standard') ||
    p.includes('iso') ||
    p.includes('regulatory') ||
    p.includes('statutory') ||
    p.includes('official') ||
    u.includes('wikipedia.org') ||
    u.includes('britannica.com')
  ) {
    return 'Official';
  }

  // Reputable International & National Media
  if (
    p.includes('reuters') ||
    p.includes('associated press') ||
    p.includes('ap news') ||
    p.includes('bbc') ||
    p.includes('bloomberg') ||
    p.includes('the hindu') ||
    p.includes('times of india') ||
    p.includes('indian express') ||
    p.includes('ndtv') ||
    p.includes('press trust of india') ||
    p.includes('pti') ||
    p.includes('wsj') ||
    p.includes('economist') ||
    p.includes('theguardian')
  ) {
    return 'Reputable Media';
  }

  // Content aggregators / blogs
  if (
    p.includes('blog') ||
    p.includes('daily') ||
    p.includes('wire') ||
    p.includes('buzz') ||
    p.includes('insider') ||
    p.includes('digest') ||
    p.includes('forum')
  ) {
    return 'Aggregator/Blog';
  }

  return 'Unverified';
}

/**
 * Determines baseline credibility weight for a source tier
 */
export function getTierCredibility(tier: SourceTier): number {
  switch (tier) {
    case 'Government':
      return 0.98;
    case 'Academic':
      return 0.95;
    case 'Official':
      return 0.92;
    case 'Reputable Media':
      return 0.78;
    case 'Aggregator/Blog':
      return 0.45;
    case 'Unverified':
    default:
      return 0.35;
  }
}

/**
 * Domains that should be filtered out because they are spam, ad farms, or unreliable scrapers
 */
const LOW_QUALITY_DOMAINS = [
  'pinterest.com',
  'quora.com',
  'reddit.com',
  'facebook.com',
  'instagram.com',
  'tiktok.com',
  'twitter.com',
  'x.com',
  'linkedin.com',
  'blogspot.com',
  'wordpress.com',
  'tumblr.com',
];

import { extractSubstantiveTokens, computeLexicalOverlap } from './searchService';

/**
 * Checks whether a retrieved search item is topical and substantive to the user's claim(s)
 */
export function evaluateSourceRelevance(
  item: SearchResultItem,
  claimTexts: string[]
): { isRelevant: boolean; relevanceScore: number } {
  const combinedClaims = claimTexts.join(' ').toLowerCase();
  const sourceContent = `${item.title} ${item.snippet}`.toLowerCase();

  const queryTokens = extractSubstantiveTokens(combinedClaims);
  if (queryTokens.length === 0) {
    return { isRelevant: true, relevanceScore: 0.5 };
  }

  // 1. Immediate rejection of known entertainment/fiction or ballot measures if query does not ask for them
  const queryAsksEntertainment = /(film|movie|song|album|series|actor|actress|band|fiction|book|play|musical)/i.test(combinedClaims);
  const queryAsksBallot = /(proposition|ballot|referendum|election|vote|measure)/i.test(combinedClaims);

  if (!queryAsksEntertainment) {
    if (
      item.title.toLowerCase().includes('(tv series)') ||
      item.title.toLowerCase().includes('(film)') ||
      item.title.toLowerCase().includes('(song)') ||
      item.title.toLowerCase().includes('(album)') ||
      item.title.toLowerCase().includes('(fairy-tale)') ||
      item.title.toLowerCase().includes('(novel)') ||
      item.title.toLowerCase().includes('(miniseries)') ||
      item.title.toLowerCase().includes('(video game)') ||
      item.title.toLowerCase().includes('(franchise)') ||
      item.title.toLowerCase().includes('(character)') ||
      item.snippet.toLowerCase().includes('is an american drama television series') ||
      item.snippet.toLowerCase().includes('is a television series') ||
      item.snippet.toLowerCase().includes('is a musical with') ||
      item.snippet.toLowerCase().includes('is a norwegian fairy-tale') ||
      item.snippet.toLowerCase().includes('is a film directed by') ||
      item.snippet.toLowerCase().includes('is a song recorded by') ||
      item.snippet.toLowerCase().includes('is an american sitcom') ||
      item.snippet.toLowerCase().includes('is an american animated') ||
      item.snippet.toLowerCase().includes('is a british television') ||
      item.snippet.toLowerCase().includes('is a video game') ||
      item.snippet.toLowerCase().includes('is a comic book') ||
      item.snippet.toLowerCase().includes('is a superhero film') ||
      item.snippet.toLowerCase().includes('is an action film') ||
      item.snippet.toLowerCase().includes('is a horror film')
    ) {
      return { isRelevant: false, relevanceScore: 0.05 };
    }
  }

  if (!queryAsksBallot) {
    if (
      /\bcalifornia proposition\b/i.test(item.title) ||
      /\bproposition \d+\b/i.test(item.title) ||
      item.snippet.toLowerCase().includes('california proposition')
    ) {
      return { isRelevant: false, relevanceScore: 0.05 };
    }
  }

  // 2. Compute lexical overlap across title + snippet
  const overlap = computeLexicalOverlap(combinedClaims, sourceContent);

  // 3. Subject presence check
  // For short claims (<= 4 substantive tokens), at least 1 primary substantive noun/entity must appear
  const sourceTokens = new Set(extractSubstantiveTokens(sourceContent));
  const hasSubjectOverlap = queryTokens.some(qt => sourceTokens.has(qt) || Array.from(sourceTokens).some(st => st.startsWith(qt) || qt.startsWith(st)));

  // If the source does not even mention a single substantive token from the claim, it is completely irrelevant
  if (!hasSubjectOverlap) {
    return { isRelevant: false, relevanceScore: 0.10 };
  }

  // 4. Entity-anchor check: extract critical proper nouns and numbers from the claim.
  // When the claim contains at least 2 named anchors (e.g. "India" + "peacock", or "Ashoka Chakra" + "24"),
  // require that at least one anchor appears verbatim in the source to prevent off-topic results
  // that only share generic function words from passing relevance.
  const claimRawLower = combinedClaims.toLowerCase();
  const entityAnchors: string[] = [];

  // Named entities: sequences of >= 1 capitalised words from the original combined claim texts
  const originalCombined = claimTexts.join(' ');
  const namedEntityMatches = originalCombined.match(/\b[A-Z][a-zA-Z]{2,}(?:\s+[A-Z][a-zA-Z]{2,})?\b/g) || [];
  namedEntityMatches.forEach(ne => entityAnchors.push(ne.toLowerCase()));

  // Critical numbers (e.g. "24", "206", "46", "100")
  const criticalNumbers = combinedClaims.match(/\b\d{2,}\b/g) || [];
  criticalNumbers.forEach(n => entityAnchors.push(n));

  if (entityAnchors.length >= 2) {
    const sourceHasAnchor = entityAnchors.some(anchor => sourceContent.includes(anchor));
    if (!sourceHasAnchor) {
      return { isRelevant: false, relevanceScore: 0.12 };
    }
  }

  // Minimum threshold of 0.32 lexical overlap required to be considered relevant
  // (raised from 0.28 to reduce loosely-related off-topic sources)
  const isRelevant = overlap >= 0.32;
  const relevanceScore = Math.max(0.10, Math.min(1.0, Number(overlap.toFixed(2))));

  return { isRelevant, relevanceScore };
}

/**
 * Multi-backend evidence retriever
 * 1. Queries Tavily, Serper/Exa, and Open Web reference indices simultaneously.
 * 2. Combines, deduplicates, and filters search results strictly for topic relevance.
 * 3. Never invents fake sources or retains unrelated pages.
 */
export async function retrieveEvidenceForClaims(
  claimTexts: string[],
  targetEntity: string
): Promise<RetrievalResult> {
  const firstClaim = claimTexts[0] || '';
  const cleanTarget = targetEntity && !targetEntity.startsWith('Proposition Target') ? targetEntity : '';

  // Avoid repeating entity if claim already contains it
  const targetTokens = cleanTarget.toLowerCase().split(/\s+/).filter(Boolean);
  const claimAlreadyHasTarget = targetTokens.length > 0 && targetTokens.every(t => firstClaim.toLowerCase().includes(t));
  const query = (cleanTarget && !claimAlreadyHasTarget)
    ? `${cleanTarget} ${firstClaim}`.trim().slice(0, 180)
    : firstClaim.trim().slice(0, 180);

  const retrievalTimestamp = new Date().toISOString();

  let rawResults: SearchResultItem[] = [];
  let providersUsed: string[] = [];

  try {
    const searchRes = await performMultiSearch(query);
    rawResults = searchRes.results;
    providersUsed = searchRes.activeProviders;
  } catch (err) {
    console.warn('performMultiSearch failed:', err);
  }

  // Deduplicate and process results with strict relevance filtering
  const seenUrls = new Set<string>();
  const seenTitles = new Set<string>();
  const processedSources: (Source & { rawRelevance: number })[] = [];

  for (const item of rawResults) {
    if (!item.url || !item.snippet || item.snippet.trim().length < 20) continue;

    // Filter low-quality scraper / social media domains
    const lowerUrl = item.url.toLowerCase();
    if (LOW_QUALITY_DOMAINS.some(bad => lowerUrl.includes(bad))) {
      continue;
    }

    // STRICT RELEVANCE FILTER: Discard sources about completely different topics
    const { isRelevant, relevanceScore } = evaluateSourceRelevance(item, claimTexts);
    if (!isRelevant) {
      continue;
    }

    // Deduplicate by clean URL or title
    const cleanUrl = item.url.split('?')[0].replace(/\/$/, '');
    const normTitle = (item.title || '').toLowerCase().trim();

    if (seenUrls.has(cleanUrl) || (normTitle && seenTitles.has(normTitle))) {
      continue;
    }
    seenUrls.add(cleanUrl);
    if (normTitle) seenTitles.add(normTitle);

    const publisher = item.publisher || new URL(item.url).hostname.replace(/^www\./, '');
    const tier = classifySourceTier(publisher, item.url);
    const credibility = getTierCredibility(tier);

    processedSources.push({
      id: `src-live-${processedSources.length + 1}`,
      title: item.title || `Retrieved Document #${processedSources.length + 1}`,
      url: item.url,
      publisher,
      authorOrOrg: publisher,
      tier,
      publishedDate: item.publishedDate || new Date().toISOString().split('T')[0],
      isPrimaryOrigin: tier === 'Government' || tier === 'Academic' || tier === 'Official',
      credibilityScore: credibility,
      snippet: item.snippet,
      rawRelevance: relevanceScore,
    });
  }

  // Sort sources by combined relevance and credibility descending
  processedSources.sort((a, b) => {
    const scoreA = a.rawRelevance * 0.6 + a.credibilityScore * 0.4;
    const scoreB = b.rawRelevance * 0.6 + b.credibilityScore * 0.4;
    return scoreB - scoreA;
  });

  const finalSources: Source[] = processedSources.slice(0, 8).map(s => {
    const { rawRelevance, ...rest } = s;
    return rest;
  });

  const backendUsed = providersUsed.length > 0
    ? `Live Retrieval (${providersUsed.join(' + ')})`
    : 'Live Search Index';

  return {
    sources: finalSources,
    backendUsed,
    queryTerms: query.split(/\s+/).slice(0, 6),
    retrievalTimestamp,
  };
}

