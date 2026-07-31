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
