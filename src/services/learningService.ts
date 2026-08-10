import apiClient from '../config/apiClient';

/** LRN-3: whether the learning loop is holding up, or needs intervention. */
export type LearningHealth = 'HEALTHY' | 'AT_RISK';

/** LRN-2's trend over the observed window — second half of the series vs the first. */
export type LearningTrend = 'IMPROVING' | 'STABLE' | 'REGRESSING';

/**
 * LRN-3: the learning-loop read-model, computed from the observations the run pipeline records
 * (one per terminal run whose confidence was actually measured). `sampleCount === 0` means no runs
 * have been observed yet — not a score of zero.
 */
export interface LearningDashboardView {
  learningScore: number; // 0..1 composite
  successRate: number; // 0..1
  avgConfidence: number; // 0..1
  confidenceHistory: number[]; // oldest → newest
  trend: LearningTrend;
  sampleCount: number;
  health: LearningHealth;
  headline: string;
}

export async function getLearningDashboard(limit?: number): Promise<LearningDashboardView> {
  const res = await apiClient.get<LearningDashboardView>('/dashboard/learning', {
    params: limit ? { limit } : undefined,
  });
  return res.data;
}
