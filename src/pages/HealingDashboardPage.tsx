import { useEffect, useState } from 'react';
import {
  getHealingAnalytics,
  getLocatorDrift,
  type HealingAnalyticsSummary,
  type LocatorDriftEntry,
} from '../services/healingService';
import { MetricCard } from '../components/cards/MetricCard';

/**
 * HEAL-3 — Self-Healing Analytics dashboard. Read-only view over the HealingAnalyticsSummary
 * read-model (counts, success rate, average improvement, and breakdowns).
 */
export default function HealingDashboardPage() {
  const [summary, setSummary] = useState<HealingAnalyticsSummary | null>(null);
  const [drift, setDrift] = useState<LocatorDriftEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      // FI-HEAL3-B is fetched independently of the summary: they read different tables, so one
      // being empty must not blank the other (the FI-PE3-C lesson).
      const [analytics, drifting] = await Promise.allSettled([getHealingAnalytics(), getLocatorDrift()]);
      if (analytics.status === 'fulfilled') {
        setSummary(analytics.value);
      } else {
        setError(true);
        setSummary(null);
      }
      setDrift(drifting.status === 'fulfilled' ? drifting.value : []);
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

      {!loading && <LocatorDrift entries={drift} />}
    </div>
  );
}

/** HEAL-3 (FI-HEAL3-B): which locators break most, and how often anything can fix them. */
function LocatorDrift({ entries }: { entries: LocatorDriftEntry[] }) {
  return (
    <div className="bg-bg-card border border-bg-secondary rounded-lg shadow-flat-md overflow-hidden">
      <div className="px-md py-sm border-b border-bg-secondary">
        <h2 className="text-sm font-semibold text-text-main">Most-drifting locators</h2>
        <p className="text-xs text-text-muted mt-xs">
          FI-HEAL3-B · selectors ranked by observed failures, with how often a replacement was proposed.
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="px-md py-md text-sm text-text-muted">
          No locator drift observed yet. Failures are recorded only when a run names exactly one
          locator, and only when
          <code className="mx-xs px-xs rounded-sm bg-bg-secondary text-text-main">
            aiqaos.healing.locator-drift.enabled=true
          </code>
          is set.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-text-muted">
              <tr>
                <th className="text-left px-md py-sm font-medium">Selector</th>
                <th className="text-right px-md py-sm font-medium">Failures</th>
                <th className="text-right px-md py-sm font-medium">Heals proposed</th>
                <th className="text-right px-md py-sm font-medium">Heal rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bg-secondary">
              {entries.map((e) => (
                <tr key={e.selector}>
                  <td className="px-md py-sm font-mono text-xs text-text-main break-all">{e.selector}</td>
                  <td className="px-md py-sm text-right text-text-main">{e.failures}</td>
                  <td className="px-md py-sm text-right text-text-muted">{e.healsProposed}</td>
                  <td
                    className={`px-md py-sm text-right font-medium ${
                      e.healRate === 0 ? 'text-status-error' : 'text-text-main'
                    }`}
                  >
                    {(e.healRate * 100).toFixed(0)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
