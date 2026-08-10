import apiClient from '../config/apiClient';

/** HEAL-3: self-healing analytics read-model — locator-healing outcomes across runs. */
export interface HealingAnalyticsSummary {
  total: number;
  appliedCount: number;
  successfulCount: number;
  successRate: number; // 0..1
  avgImprovementScore: number;
  actionTypeBreakdown: Record<string, number>;
  recoveryStatusBreakdown: Record<string, number>;
  failureCategoryBreakdown: Record<string, number>;
}

export async function getHealingAnalytics(): Promise<HealingAnalyticsSummary> {
  const res = await apiClient.get<HealingAnalyticsSummary>('/dashboard/healing/analytics');
  return res.data;
}

/**
 * HEAL-3 (FI-HEAL3-B): one locator in the drift ranking. `healRate` separates "breaks often but
 * self-heals" from "breaks often and nobody can fix it" — different maintenance problems.
 */
export interface LocatorDriftEntry {
  selector: string;
  failures: number;
  healsProposed: number;
  healRate: number; // 0..1
}

/** Worst-drifting locators first. Empty until drift has actually been observed. */
export async function getLocatorDrift(limit?: number): Promise<LocatorDriftEntry[]> {
  const res = await apiClient.get<LocatorDriftEntry[]>('/dashboard/healing/locator-drift', {
    params: limit ? { limit } : undefined,
  });
  return res.data;
}
