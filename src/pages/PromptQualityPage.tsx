import { useEffect, useState } from 'react';
import { getPromptQuality, type PromptQualitySummary } from '../services/promptQualityService';
import { MetricCard } from '../components/cards/MetricCard';

/**
 * PE-3 — Prompt Quality dashboard. Read-only leaderboard over the PromptQualitySummary read-model,
 * aggregated from persisted evaluation results (no benchmark re-run).
 */
export default function PromptQualityPage() {
  const [summary, setSummary] = useState<PromptQualitySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      setSummary(await getPromptQuality());
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
          <h1 className="text-xl font-semibold text-text-main">Prompt Quality</h1>
          <p className="text-xs text-text-muted mt-xs">
            PE-3 · prompt-version leaderboard from evaluation results.
          </p>
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
        <p className="text-status-error">Could not load prompt quality — the backend may be unavailable.</p>
      )}

      {summary && summary.totalVersions === 0 && !loading && (
        <p className="text-text-muted">
          No evaluation results yet — run the prompt-eval harness to populate the leaderboard.
        </p>
      )}

      {summary && summary.totalVersions > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-md">
            <MetricCard title="Versions" value={summary.totalVersions} />
            <MetricCard
              title="Best"
              value={summary.bestScore.toFixed(2)}
              description={summary.bestVersionId ?? ''}
            />
            <MetricCard
              title="Worst"
              value={summary.worstScore.toFixed(2)}
              description={summary.worstVersionId ?? ''}
            />
            <MetricCard title="Average" value={summary.averageScore.toFixed(2)} />
            <MetricCard title="Spread" value={summary.scoreSpread.toFixed(2)} />
          </div>

          <div className="bg-bg-card border border-bg-secondary rounded-lg shadow-flat-md overflow-hidden">
            <div className="px-md py-sm border-b border-bg-secondary">
              <h2 className="text-sm font-semibold text-text-main">Leaderboard</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-text-muted uppercase tracking-wider">
                    <th className="px-md py-sm font-semibold">Rank</th>
                    <th className="px-md py-sm font-semibold">Version</th>
                    <th className="px-md py-sm font-semibold">Mean score</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.standings.map((s) => (
                    <tr key={s.versionId} className="border-t border-bg-secondary">
                      <td className="px-md py-sm text-text-muted">#{s.rank}</td>
                      <td className="px-md py-sm text-text-main font-medium">{s.versionId}</td>
                      <td className="px-md py-sm text-text-main">{s.score.toFixed(3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
