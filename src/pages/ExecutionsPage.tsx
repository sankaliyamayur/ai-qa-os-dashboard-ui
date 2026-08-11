import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Download } from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { MetricBadge } from '../components/common/MetricBadge';
import { useQuery } from '../hooks/useQuery';
import { fetchExecutions, type ExecutionRow } from '../services/executionService';


const MOCK_ROWS: ExecutionRow[] = [
  {
    id: 'exec-101',
    workflowName: 'Enterprise Login Pipeline',
    startedAt: '2026-07-15 11:30',
    duration: '2m 15s',
    status: 'success',
    passRate: 100,
    environment: 'Staging',
    browser: 'Chrome',
    framework: 'Playwright',
    triggeredBy: 'Jenkins CI',
  },
  {
    id: 'exec-102',
    workflowName: 'Payment Gateway Validation',
    startedAt: '2026-07-15 11:02',
    duration: '5m 40s',
    status: 'error',
    passRate: 60,
    environment: 'Production',
    browser: 'Firefox',
    framework: 'Selenium',
    triggeredBy: 'GitLab Runner',
  },
  {
    id: 'exec-103',
    workflowName: 'User Profile Settings Sync',
    startedAt: '2026-07-15 10:45',
    duration: '1m 10s',
    status: 'success',
    passRate: 100,
    environment: 'Development',
    browser: 'Safari',
    framework: 'Cypress',
    triggeredBy: 'John Doe',
  },
];

export const ExecutionsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [envFilter, setEnvFilter] = useState('ALL');
  const navigate = useNavigate();

  // PERF-3: useQuery with 30s cache — prevents re-fetching on every re-render/navigation
  const fetcher = useCallback(() => fetchExecutions(50), []);
  const { data: apiRows } = useQuery<ExecutionRow[]>(
    'executions',
    fetcher,
    { ttl: 30_000 }
  );

  // Fall back to mock data while loading or if API is unavailable
  const rows: ExecutionRow[] = (apiRows && apiRows.length > 0) ? apiRows : MOCK_ROWS;

  const filteredRows = rows.filter((row) => {
    const matchesSearch =
      row.id.toLowerCase().includes(search.toLowerCase()) ||
      row.workflowName.toLowerCase().includes(search.toLowerCase());
    const matchesEnv = envFilter === 'ALL' || row.environment === envFilter;
    return matchesSearch && matchesEnv;
  });

  const exportToJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredRows, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `executions_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-lg p-lg">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-text-main">Execution History</h1>
        <button
          onClick={exportToJson}
          className="flex items-center px-md py-sm bg-accent-primary text-white rounded-md text-sm font-semibold hover:bg-accent-hover transition-colors"
        >
          <Download className="w-4 h-4 mr-xs" /> Export JSON
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md bg-bg-card p-md rounded-lg border border-bg-secondary shadow-flat-md">
        <div className="relative">
          <Search className="absolute left-md top-[14px] w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Workflow ID or Name..."
            className="w-full pl-[40px] pr-md py-sm bg-bg-secondary text-text-main rounded-md focus:outline-hidden focus:ring-2 focus:ring-accent-primary text-sm"
          />
        </div>
        <div className="flex items-center space-x-sm">
          <Filter className="w-4 h-4 text-text-muted" />
          <select
            value={envFilter}
            onChange={(e) => setEnvFilter(e.target.value)}
            className="w-full px-md py-sm bg-bg-secondary text-text-main rounded-md focus:outline-hidden focus:ring-2 focus:ring-accent-primary text-sm"
          >
            <option value="ALL">All Environments</option>
            <option value="Development">Development</option>
            <option value="Staging">Staging</option>
            <option value="Production">Production</option>
          </select>
        </div>
      </div>

      {/* Main Execution History Data Grid */}
      <div className="bg-bg-card rounded-lg border border-bg-secondary shadow-flat-md overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-bg-secondary text-text-muted text-xs font-semibold uppercase border-b border-bg-secondary">
              <th className="py-md px-lg">Execution ID</th>
              <th className="py-md px-lg">Workflow</th>
              <th className="py-md px-lg">Started</th>
              <th className="py-md px-lg">Duration</th>
              <th className="py-md px-lg">Status</th>
              <th className="py-md px-lg">Pass Rate</th>
              <th className="py-md px-lg">Metadata</th>
              <th className="py-md px-lg">Triggered By</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-secondary text-sm">
            {filteredRows.map((row) => (
              <tr
                key={row.id}
                onClick={() => navigate(`/executions/${row.id}`)}
                className="hover:bg-bg-secondary/50 cursor-pointer transition-colors"
              >
                <td className="py-md px-lg font-bold text-accent-primary">{row.id}</td>
                <td className="py-md px-lg text-text-main font-medium">{row.workflowName}</td>
                <td className="py-md px-lg text-text-muted">{row.startedAt}</td>
                <td className="py-md px-lg text-text-main">{row.duration}</td>
                <td className="py-md px-lg">
                  <StatusBadge type={row.status}>{row.status.toUpperCase()}</StatusBadge>
                </td>
                <td className="py-md px-lg font-semibold">{row.passRate}%</td>
                <td className="py-md px-lg space-x-xs">
                  <MetricBadge label={row.environment} />
                  <MetricBadge label={row.browser} />
                  <MetricBadge label={row.framework} />
                </td>
                <td className="py-md px-lg text-text-muted">{row.triggeredBy}</td>
              </tr>
            ))}
            {filteredRows.length === 0 && (
              <tr>
                <td colSpan={8} className="py-lg text-center text-text-muted">
                  No execution logs match filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ExecutionsPage;
