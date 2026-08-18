import React, { useEffect, useState } from 'react';
import { AreaChartCard } from '../components/charts/AreaChartCard';
import { BarChartCard } from '../components/charts/BarChartCard';
import { PieChartCard } from '../components/charts/PieChartCard';
import { StackedBarChartCard } from '../components/charts/StackedBarChartCard';
import { fetchExecutions, type ExecutionRow } from '../services/executionService';
import { getHealingAnalytics } from '../services/healingService';

export const AnalyticsPage: React.FC = () => {
  const [executions, setExecutions] = useState<ExecutionRow[]>([]);
  const [healingActions, setHealingActions] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [execs, healingSummary] = await Promise.allSettled([
          fetchExecutions(50),
          getHealingAnalytics(),
        ]);
        if (execs.status === 'fulfilled') {
          setExecutions(execs.value);
        }
        if (healingSummary.status === 'fulfilled' && healingSummary.value?.actionTypeBreakdown) {
          const formatted = Object.entries(healingSummary.value.actionTypeBreakdown).map(
            ([name, value]) => ({ name, value })
          );
          setHealingActions(formatted);
        }
      } catch (e) {
        console.error('Failed to fetch analytics live data', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute Live Historical Pass Rate
  const passRateHistory = executions
    .slice(0, 7)
    .reverse()
    .map((e, idx) => ({
      name: e.startedAt ? e.startedAt.split(' ')[0] || `Run ${idx + 1}` : `Run ${idx + 1}`,
      value: e.passRate,
    }));

  // Compute Live Environment Execution Outcomes
  const envMap: Record<string, { passes: number; failures: number }> = {};
  executions.forEach((e) => {
    const env = e.environment || 'Staging';
    if (!envMap[env]) {
      envMap[env] = { passes: 0, failures: 0 };
    }
    if (e.status === 'success') {
      envMap[env].passes += 1;
    } else if (e.status === 'error') {
      envMap[env].failures += 1;
    }
  });
  const envStackedData = Object.entries(envMap).map(([name, counts]) => ({
    name,
    passes: counts.passes,
    failures: counts.failures,
  }));

  return (
    <div className="space-y-lg p-lg">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-text-main">Analytics Dashboard</h1>
          <span className="text-sm text-text-muted">
            {loading ? 'Loading live platform data...' : 'Aggregated Quality Platform Insights (Live Data)'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-md">
        <AreaChartCard
          title="Platform Pass Rate History (%)"
          data={passRateHistory.length > 0 ? passRateHistory : [{ name: 'No Live Runs', value: 0 }]}
          dataKey="value"
          color="#10b981"
        />
        <StackedBarChartCard
          title="Environment Execution Outcomes (Stacked)"
          data={envStackedData.length > 0 ? envStackedData : [{ name: 'No Live Environment Runs', passes: 0, failures: 0 }]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        <div className="lg:col-span-1">
          <PieChartCard
            title="Healing Operations Split"
            data={healingActions.length > 0 ? healingActions : [{ name: 'No Operations Logged', value: 0 }]}
          />
        </div>
        <div className="lg:col-span-2">
          <BarChartCard
            title="Active Workflow Execution Distribution by Environment"
            data={envStackedData.length > 0 ? envStackedData.map(e => ({ name: e.name, value: e.passes + e.failures })) : [{ name: 'No Data', value: 0 }]}
            dataKey="value"
            color="#fbbf24"
          />
        </div>
      </div>
    </div>
  );
};
export default AnalyticsPage;
