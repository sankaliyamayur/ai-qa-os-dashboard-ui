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

/** FI-PE3-B: one prompt version that declined over time (recent scores below its earlier scores). */
export interface PromptRegressionSignal {
  versionId: string;
  baselineScore: number;
  currentScore: number;
  delta: number;
  sampleCount: number;
}

/** FI-PE3-B: prompt-regression read-model — versions that regressed, worst-first, + the tolerance used. */
export interface PromptRegressionReport {
  tolerance: number;
  regressedCount: number;
  regressions: PromptRegressionSignal[];
}

export async function getPromptRegressions(): Promise<PromptRegressionReport> {
  const res = await apiClient.get<PromptRegressionReport>('/dashboard/prompt-quality/regressions');
  return res.data;
}
