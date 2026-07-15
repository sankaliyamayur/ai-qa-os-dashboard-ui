import React from 'react';
import { AreaChartCard } from '../components/charts/AreaChartCard';
import { BarChartCard } from '../components/charts/BarChartCard';
import { PieChartCard } from '../components/charts/PieChartCard';
import { StackedBarChartCard } from '../components/charts/StackedBarChartCard';

const MOCK_HISTORICAL_DATA = [
  { name: 'July 11', value: 92 },
  { name: 'July 12', value: 93 },
  { name: 'July 13', value: 91 },
  { name: 'July 14', value: 95 },
  { name: 'July 15', value: 94 },
];

const MOCK_ENV_STACKED = [
  { name: 'Development', passes: 80, failures: 15 },
  { name: 'Staging', passes: 65, failures: 8 },
  { name: 'Production', passes: 50, failures: 2 },
];

const MOCK_HEALING_PIE = [
  { name: 'Locator Repaired', value: 45 },
  { name: 'Wait Timeout Adjusted', value: 30 },
  { name: 'Script Regenerated', value: 25 },
];

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-lg p-lg">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-text-main">Analytics Dashboard</h1>
        <span className="text-sm text-text-muted">Aggregated Quality Platform Insights</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-md">
        <AreaChartCard
          title="Platform Pass Rate History (%)"
          data={MOCK_HISTORICAL_DATA}
          dataKey="value"
          color="#10b981"
        />
        <StackedBarChartCard
          title="Environment Execution Outcomes (Stacked)"
          data={MOCK_ENV_STACKED}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        <div className="lg:col-span-1">
          <PieChartCard
            title="Healing Operations Split"
            data={MOCK_HEALING_PIE}
          />
        </div>
        <div className="lg:col-span-2">
          <BarChartCard
            title="Total LLM Call Retries per Agent"
            data={[
              { name: 'Analyst', value: 5 },
              { name: 'Generator', value: 14 },
              { name: 'Executor', value: 2 },
              { name: 'Healer', value: 8 },
            ]}
            dataKey="value"
            color="#fbbf24"
          />
        </div>
      </div>
    </div>
  );
};
export default AnalyticsPage;
