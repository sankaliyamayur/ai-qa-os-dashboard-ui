import { useEffect, useState } from 'react';
import {
  getPromptHistory,
  getPromptQuality,
  getPromptRegressions,
  type PromptHistoryEntry,
  type PromptQualitySummary,
  type PromptRegressionReport,
} from '../services/promptQualityService';
import { MetricCard } from '../components/cards/MetricCard';

/**
 * PE-3 — Prompt Quality dashboard. Read-only leaderboard over the PromptQualitySummary read-model,
 * aggregated from persisted evaluation results (no benchmark re-run). FI-PE3-B adds a regressions
 * panel — versions whose recent scores dropped below their earlier scores. FI-PE3-C adds the
 * per-execution history panel, fed by the prompt-render recorder.
 */
export default function PromptQualityPage() {
  const [summary, setSummary] = useState<PromptQualitySummary | null>(null);
  const [regressions, setRegressions] = useState<PromptRegressionReport | null>(null);
  const [history, setHistory] = useState<PromptHistoryEntry[] | null>(null);
  const [correlationFilter, setCorrelationFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async (correlationId = correlationFilter) => {
    setLoading(true);
    setError(false);
    try {
      // History comes from prompt_executions, a different source than the leaderboard's eval_results,
      // so it is fetched independently — one being empty must not hide the other.
      const [s, r, h] = await Promise.all([
        getPromptQuality(),
        getPromptRegressions(),
        getPromptHistory(correlationId),
      ]);
      setSummary(s);
      setRegressions(r);
      setHistory(h);
    } catch {
      setError(true);
      setSummary(null);
      setRegressions(null);
      setHistory(null);
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
          onClick={() => load()}
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

          <div className="bg-bg-card border border-bg-secondary rounded-lg shadow-flat-md overflow-hidden">
            <div className="px-md py-sm border-b border-bg-secondary flex items-center justify-between">
              <h2 className="text-sm font-semibold text-text-main">
                Regressions{regressions ? ` (${regressions.regressedCount})` : ''}
              </h2>
              {regressions && (
                <span className="text-xs text-text-muted">
                  versions declining over time · tolerance {regressions.tolerance.toFixed(2)}
                </span>
              )}
            </div>
            {regressions && regressions.regressedCount > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-text-muted uppercase tracking-wider">
                      <th className="px-md py-sm font-semibold">Version</th>
                      <th className="px-md py-sm font-semibold">Baseline</th>
                      <th className="px-md py-sm font-semibold">Current</th>
                      <th className="px-md py-sm font-semibold">Δ</th>
                      <th className="px-md py-sm font-semibold">Samples</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regressions.regressions.map((r) => (
                      <tr key={r.versionId} className="border-t border-bg-secondary">
                        <td className="px-md py-sm text-text-main font-medium">{r.versionId}</td>
                        <td className="px-md py-sm text-text-muted">{r.baselineScore.toFixed(3)}</td>
                        <td className="px-md py-sm text-text-main">{r.currentScore.toFixed(3)}</td>
                        <td className="px-md py-sm text-status-error">{r.delta.toFixed(3)}</td>
                        <td className="px-md py-sm text-text-muted">{r.sampleCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="px-md py-md text-text-muted">No regressions detected.</p>
            )}
          </div>
        </>
      )}

      {/* FI-PE3-C — per-execution prompt history. Rendered independently of the leaderboard: it reads
          prompt_executions, so it can have rows even when no evaluation results exist yet. */}
      <div className="bg-bg-card border border-bg-secondary rounded-lg shadow-flat-md overflow-hidden">
        <div className="px-md py-sm border-b border-bg-secondary flex items-center justify-between gap-md">
          <h2 className="text-sm font-semibold text-text-main">
            Prompt history{history ? ` (${history.length})` : ''}
          </h2>
          <div className="flex items-center gap-sm">
            <input
              value={correlationFilter}
              onChange={(e) => setCorrelationFilter(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') load(correlationFilter);
              }}
              placeholder="Filter by correlation id…"
              className="px-sm py-xs text-xs rounded-md bg-bg-secondary text-text-main placeholder:text-text-muted"
            />
            <button
              onClick={() => load(correlationFilter)}
              className="px-sm py-xs text-xs rounded-md bg-bg-secondary text-text-muted hover:text-text-main"
            >
              Apply
            </button>
            {correlationFilter && (
              <button
                onClick={() => {
                  setCorrelationFilter('');
                  load('');
                }}
                className="px-sm py-xs text-xs rounded-md text-text-muted hover:text-text-main"
              >
                Clear
              </button>
            )}
          </div>
        </div>
        {history && history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-text-muted uppercase tracking-wider">
                  <th className="px-md py-sm font-semibold">Template</th>
                  <th className="px-md py-sm font-semibold">Version</th>
                  <th className="px-md py-sm font-semibold">Run</th>
                  <th className="px-md py-sm font-semibold">Render ms</th>
                  <th className="px-md py-sm font-semibold">Chars</th>
                  <th className="px-md py-sm font-semibold">Preview</th>
                  <th className="px-md py-sm font-semibold">Executed</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => (
                  <tr key={h.id} className="border-t border-bg-secondary align-top">
                    <td className="px-md py-sm text-text-main font-medium">{h.templateName ?? '—'}</td>
                    <td className="px-md py-sm text-text-muted">{h.versionLabel ?? '—'}</td>
                    <td className="px-md py-sm text-text-muted font-mono text-xs">
                      {h.correlationId ?? '—'}
                    </td>
                    <td className="px-md py-sm text-text-main">{h.responseTimeMs}</td>
                    <td className="px-md py-sm text-text-muted">{h.promptLength}</td>
                    <td className="px-md py-sm text-text-muted max-w-[28rem] truncate" title={h.promptPreview}>
                      {h.promptPreview}
                    </td>
                    <td className="px-md py-sm text-text-muted whitespace-nowrap">
                      {h.executedAt ? new Date(h.executedAt).toLocaleString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !loading && (
            <p className="px-md py-md text-text-muted">
              {correlationFilter
                ? 'No prompt renders recorded for that correlation id.'
                : 'No prompt renders recorded yet — set aiqaos.prompt.history.enabled=true on the gateway and run a workflow.'}
            </p>
          )
        )}
      </div>
    </div>
  );
}
