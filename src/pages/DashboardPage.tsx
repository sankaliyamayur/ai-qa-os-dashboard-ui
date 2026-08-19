import React, { useEffect, useState } from 'react';
import { Play, CheckCircle, AlertTriangle, Cpu, RefreshCw } from 'lucide-react';
import { MetricCard } from '../components/cards/MetricCard';
import { AreaChartCard } from '../components/charts/AreaChartCard';
import { BarChartCard } from '../components/charts/BarChartCard';
import { PieChartCard } from '../components/charts/PieChartCard';
import { fetchExecutions, type ExecutionRow } from '../services/executionService';
import apiClient from '../config/apiClient';

export const DashboardPage: React.FC = () => {
  const [executions, setExecutions] = useState<ExecutionRow[]>([]);
  const [bugBreakdown, setBugBreakdown] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadLiveData = async () => {
    setLoading(true);
    setError(false);
    try {
      const [execData, bugRes] = await Promise.allSettled([
        fetchExecutions(50),
        apiClient.get<Record<string, number>>('/dashboard/bugs/breakdown'),
      ]);

      if (execData.status === 'fulfilled') {
        setExecutions(execData.value);
      }
      if (bugRes.status === 'fulfilled' && bugRes.value.data) {
        const breakdownObj = bugRes.value.data;
        const formatted = Object.entries(breakdownObj).map(([name, value]) => ({ name, value }));
        setBugBreakdown(formatted);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLiveData();
    const timer = setInterval(() => {
      loadLiveData();
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Compute live dynamic metrics
  const activePipelines = executions.filter(
    (e) => e.status === 'info' || e.duration === 'Running'
  ).length;

  const avgPassRate =
    executions.length > 0
      ? Math.round(executions.reduce((acc, curr) => acc + curr.passRate, 0) / executions.length)
      : 0;

  // Compute Live Browser Share
  const browserCounts: Record<string, number> = {};
  executions.forEach((e) => {
    const b = e.browser || 'Chromium';
    browserCounts[b] = (browserCounts[b] || 0) + 1;
  });
  const pieData = Object.entries(browserCounts).map(([name, value]) => ({ name, value }));

  // Compute Live Execution Pass Rate Trend for Area Chart
  const areaData = executions
    .slice(0, 7)
    .reverse()
    .map((e, idx) => ({
      name: e.startedAt ? e.startedAt.split(' ')[1] || `Run ${idx + 1}` : `Run ${idx + 1}`,
      value: e.passRate,
    }));

  return (
    <div className="space-y-lg p-lg">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-text-main">Dashboard</h1>
          <span className="text-sm text-text-muted">Live Platform Overview (Real Backend Data)</span>
        </div>
        <button
          onClick={loadLiveData}
          disabled={loading}
          className="flex items-center px-md py-sm bg-bg-card hover:bg-bg-secondary text-text-main border border-bg-secondary rounded-md text-sm font-medium transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 mr-xs ${loading ? 'animate-spin' : ''}`} /> Refresh Live Data
        </button>
      </div>

      {error && (
        <div className="p-md bg-status-error/10 border border-status-error/30 rounded-md text-status-error text-sm">
          Could not fetch live platform metrics from backend. Showing latest available system state.
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
        <MetricCard
          title="Running Executions"
          value={loading ? '...' : String(activePipelines)}
          description="Active live workflow pipelines"
          icon={<Play className="w-5 h-5" />}
        />
        <MetricCard
          title="Success Rate"
          value={loading ? '...' : `${avgPassRate}%`}
          description="Average pass rate across live executions"
          icon={<CheckCircle className="w-5 h-5 text-status-success" />}
        />
        <MetricCard
          title="Total Executions"
          value={loading ? '...' : String(executions.length)}
          description="Total recorded workflow runs"
          icon={<AlertTriangle className="w-5 h-5 text-status-warning" />}
        />
        <MetricCard
          title="Platform Status"
          value={loading ? '...' : executions.length > 0 ? 'Active' : 'Idle'}
          description="Live cluster status"
          icon={<Cpu className="w-5 h-5" />}
        />
      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        <div className="lg:col-span-2">
          <AreaChartCard
            title="Execution Pass Rate Trend (%)"
            data={areaData.length > 0 ? areaData : [{ name: 'No Data', value: 0 }]}
            dataKey="value"
            color="#4f46e5"
          />
        </div>
        <div>
          <PieChartCard
            title="Browser Execution Share"
            data={pieData.length > 0 ? pieData : [{ name: 'No Data', value: 0 }]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        <div className="lg:col-span-3">
          <BarChartCard
            title="Root-Cause Error Distribution"
            data={bugBreakdown.length > 0 ? bugBreakdown : [{ name: 'No Failures Logged', value: 0 }]}
            dataKey="value"
            color="#ef4444"
          />
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;
