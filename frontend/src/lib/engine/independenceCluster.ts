import { Source } from '@/types';
import { calculateTextOverlap } from './provenanceEngine';

export interface IndependenceClusteringResult {
  apparentSourcesCount: number;
  independentOriginsCount: number;
  independenceRatio: number; // 0 to 1
  clusters: {
    clusterId: string;
    originSourceId: string;
    sourceIds: string[];
    clusterRationale: string;
  }[];
}

/**
 * Clusters sources based on origin pointers, publisher corporate ownership, and verbatim text overlap
 */
export function clusterSourcesByIndependence(sources: Source[]): IndependenceClusteringResult {
  const apparentSourcesCount = sources.length;
  if (apparentSourcesCount === 0) {
    return {
      apparentSourcesCount: 0,
      independentOriginsCount: 0,
      independenceRatio: 0,
      clusters: [],
    };
  }

  const clusters: {
    clusterId: string;
    originSourceId: string;
    sourceIds: string[];
    clusterRationale: string;
  }[] = [];

  const assigned = new Set<string>();

  for (let i = 0; i < sources.length; i++) {
    const srcA = sources[i];
    if (assigned.has(srcA.id)) continue;

    const currentClusterSources = [srcA.id];
    assigned.add(srcA.id);

    // Look for derived sources (explicit originId or high text overlap)
    for (let j = i + 1; j < sources.length; j++) {
      const srcB = sources[j];
      if (assigned.has(srcB.id)) continue;

      const isExplicitChild = srcB.originId === srcA.id || srcA.originId === srcB.id;
      const sharesOrigin = srcA.originId && srcB.originId && srcA.originId === srcB.originId;
      const highOverlap = calculateTextOverlap(srcA.snippet, srcB.snippet) > 0.45;

      if (isExplicitChild || sharesOrigin || highOverlap) {
        currentClusterSources.push(srcB.id);
        assigned.add(srcB.id);
      }
    }

    clusters.push({
      clusterId: `cluster-${clusters.length + 1}`,
      originSourceId: srcA.originId || srcA.id,
      sourceIds: currentClusterSources,
      clusterRationale:
        currentClusterSources.length > 1
          ? `${currentClusterSources.length} sources share verbatim phrases or direct attribution to origin (${srcA.publisher}).`
          : `Independent primary origin from ${srcA.publisher}.`,
    });
  }

  const independentOriginsCount = clusters.length;
  const independenceRatio = Number((independentOriginsCount / apparentSourcesCount).toFixed(3));

  return {
    apparentSourcesCount,
    independentOriginsCount,
    independenceRatio,
    clusters,
  };
}
