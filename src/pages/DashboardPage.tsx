import React from 'react';
import { Play, CheckCircle, AlertTriangle, Cpu } from 'lucide-react';
import { MetricCard } from '../components/cards/MetricCard';
import { AreaChartCard } from '../components/charts/AreaChartCard';
import { BarChartCard } from '../components/charts/BarChartCard';
import { PieChartCard } from '../components/charts/PieChartCard';

const MOCK_AREA_DATA = [
  { name: '09:00', value: 4000 },
  { name: '10:00', value: 7500 },
  { name: '11:00', value: 6200 },
  { name: '12:00', value: 9000 },
  { name: '13:00', value: 12000 },
];

const MOCK_BAR_DATA = [
  { name: 'Locators', value: 12 },
  { name: 'Timeouts', value: 8 },
  { name: 'Assertions', value: 15 },
  { name: 'Network', value: 5 },
];

const MOCK_PIE_DATA = [
  { name: 'Chrome', value: 65 },
  { name: 'Firefox', value: 20 },
  { name: 'Safari', value: 15 },
];

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-lg p-lg">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-text-main">Dashboard</h1>
        <span className="text-sm text-text-muted">Live Platform Overview</span>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
        <MetricCard
          title="Running Executions"
          value="4"
          description="Active workflow pipelines"
          icon={<Play className="w-5 h-5" />}
        />
        <MetricCard
          title="Success Rate"
          value="94.2%"
          description="Average test execution passes"
          icon={<CheckCircle className="w-5 h-5 text-status-success" />}
          trend={{ value: 1.2, isPositive: true }}
        />
        <MetricCard
          title="Total Cost (LLM)"
          value="$128.45"
          description="Accumulated model billing"
          icon={<AlertTriangle className="w-5 h-5 text-status-warning" />}
          trend={{ value: 4.8, isPositive: false }}
        />
        <MetricCard
          title="System Memory"
          value="42%"
          description="Cluster resources active"
          icon={<Cpu className="w-5 h-5" />}
        />
      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        <div className="lg:col-span-2">
          <AreaChartCard
            title="Token Consumption Trend"
            data={MOCK_AREA_DATA}
            dataKey="value"
            color="#4f46e5"
          />
        </div>
        <div>
          <PieChartCard
            title="Browser Execution Share"
            data={MOCK_PIE_DATA}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        <div className="lg:col-span-3">
          <BarChartCard
            title="Root-Cause Error Distribution"
            data={MOCK_BAR_DATA}
            dataKey="value"
            color="#ef4444"
          />
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;
