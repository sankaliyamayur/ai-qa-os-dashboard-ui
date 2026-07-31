import { useEffect, useState } from 'react';
import { getHealingAnalytics, type HealingAnalyticsSummary } from '../services/healingService';
import { MetricCard } from '../components/cards/MetricCard';

/**
 * HEAL-3 — Self-Healing Analytics dashboard. Read-only view over the HealingAnalyticsSummary
 * read-model (counts, success rate, average improvement, and breakdowns).
 */
export default function HealingDashboardPage() {
  const [summary, setSummary] = useState<HealingAnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      setSummary(await getHealingAnalytics());
    } catch {
      setError(true);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-lg space-y-md">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-main">Self-Healing Analytics</h1>
          <p className="text-xs text-text-muted mt-xs">HEAL-3 · locator-healing outcomes across runs.</p>
        </div>
        <button
          onClick={load}
          className="px-md py-sm rounded-md bg-bg-card text-text-muted hover:text-text-main"
        >
          Refresh
        </button>
      </div>

      {loading && <p className="text-text-muted">Loading…</p>}
      {error && (
        <p className="text-status-error">Could not load healing analytics — the backend may be unavailable.</p>
      )}

      {summary && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-md">
            <MetricCard title="Total" value={summary.total} />
            <MetricCard title="Applied" value={summary.appliedCount} />
            <MetricCard title="Successful" value={summary.successfulCount} />
            <MetricCard title="Success rate" value={`${(summary.successRate * 100).toFixed(1)}%`} />
            <MetricCard title="Avg improvement" value={summary.avgImprovementScore.toFixed(2)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            <Breakdown title="By action type" data={summary.actionTypeBreakdown} />
            <Breakdown title="By recovery status" data={summary.recoveryStatusBreakdown} />
            <Breakdown title="By failure category" data={summary.failureCategoryBreakdown} />
          </div>
        </>
      )}
    </div>
  );
}

function Breakdown({ title, data }: { title: string; data: Record<string, number> }) {
  const entries = Object.entries(data || {}).sort((a, b) => b[1] - a[1]);
  return (
    <div className="bg-bg-card border border-bg-secondary rounded-lg shadow-flat-md overflow-hidden">
      <div className="px-md py-sm border-b border-bg-secondary">
        <h2 className="text-sm font-semibold text-text-main">{title}</h2>
      </div>
      <div className="divide-y divide-bg-secondary">
        {entries.length === 0 && (
          <div className="px-md py-md text-center text-text-muted text-sm">No data.</div>
        )}
        {entries.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between px-md py-sm text-sm">
            <span className="text-text-muted">{k}</span>
            <span className="text-text-main font-medium">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
