import apiClient from '../config/apiClient';

export interface LeaderboardEntry {
  versionId: string;
  score: number;
  rank: number;
}

/** PE-3: prompt-quality read-model — a version leaderboard aggregated from persisted eval results. */
export interface PromptQualitySummary {
  totalVersions: number;
  bestVersionId: string | null;
  bestScore: number;
  worstVersionId: string | null;
  worstScore: number;
  averageScore: number;
  scoreSpread: number;
  standings: LeaderboardEntry[];
}

export async function getPromptQuality(): Promise<PromptQualitySummary> {
  const res = await apiClient.get<PromptQualitySummary>('/dashboard/prompt-quality');
  return res.data;
}
