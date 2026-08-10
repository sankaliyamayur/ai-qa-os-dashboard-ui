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

/**
 * FI-PE3-C: one recorded prompt render. `promptPreview` is a truncated preview — the backend never
 * serves the full compiled prompt on this unauthenticated surface (compiled prompts embed injected
 * user-story/failure context), so use `promptLength` for the true size.
 */
export interface PromptHistoryEntry {
  id: string;
  templateName: string | null;
  versionLabel: string | null;
  correlationId: string | null;
  traceId: string | null;
  responseTimeMs: number;
  promptLength: number;
  promptPreview: string;
  executedAt: string | null;
}

/**
 * FI-PE3-C: per-execution prompt history. Pass a `correlationId` to see every prompt rendered during
 * one workflow run; omit it for the most recent renders across all runs.
 */
export async function getPromptHistory(
  correlationId?: string,
  limit?: number,
): Promise<PromptHistoryEntry[]> {
  const params: Record<string, string | number> = {};
  if (correlationId && correlationId.trim()) params.correlationId = correlationId.trim();
  if (limit) params.limit = limit;
  const res = await apiClient.get<PromptHistoryEntry[]>('/dashboard/prompt-quality/history', { params });
  return res.data;
}
