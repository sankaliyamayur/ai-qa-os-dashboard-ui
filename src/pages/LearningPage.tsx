import { useEffect, useState, type MouseEvent } from 'react';
import { AlertTriangle, CheckCircle2, Minus, TrendingDown, TrendingUp } from 'lucide-react';
import {
  getLearningDashboard,
  type LearningDashboardView,
  type LearningTrend,
} from '../services/learningService';
import { MetricCard } from '../components/cards/MetricCard';

/**
 * LRN-3 — Learning Loop dashboard. Read-only view over the LearningDashboardView read-model:
 * the composite learning score, success rate, average confidence, the confidence-history series,
 * and the HEALTHY/AT_RISK governance signal.
 *
 * The observations behind it are recorded per terminal run and are opt-in
 * (`aiqaos.learning.observations.enabled`), so an empty series is a legitimate state — it means no
 * runs have been observed yet, not that the loop scored zero.
 */
export default function LearningPage() {
  const [view, setView] = useState<LearningDashboardView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      setView(await getLearningDashboard());
    } catch {
      setError(true);
      setView(null);
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
          <h1 className="text-xl font-semibold text-text-main">Learning Loop</h1>
          <p className="text-xs text-text-muted mt-xs">
            LRN-3 · how the platform is learning across observed runs.
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
        <p className="text-status-error">
          Could not load learning metrics — the backend may be unavailable.
        </p>
      )}

      {view && view.sampleCount === 0 && <NoObservationsYet headline={view.headline} />}

      {view && view.sampleCount > 0 && (
        <>
          <HealthBanner view={view} />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-md">
            <MetricCard title="Learning score" value={view.learningScore.toFixed(2)} description="0–1 composite" />
            <MetricCard title="Success rate" value={`${(view.successRate * 100).toFixed(1)}%`} />
            <MetricCard title="Avg confidence" value={view.avgConfidence.toFixed(2)} />
            <MetricCard title="Trend" value={trendLabel(view.trend)} icon={<TrendIcon trend={view.trend} />} />
            <MetricCard title="Observed runs" value={view.sampleCount} description="in this window" />
          </div>

          <ConfidenceHistory series={view.confidenceHistory} />
        </>
      )}
    </div>
  );
}

/** The loop has never been measured — say so, rather than rendering a score of zero. */
function NoObservationsYet({ headline }: { headline: string }) {
  return (
    <div className="bg-bg-card border border-bg-secondary rounded-lg shadow-flat-md p-lg">
      <h2 className="text-sm font-semibold text-text-main">{headline}</h2>
      <p className="text-sm text-text-muted mt-sm">
        No runs have been observed yet. Observations are recorded once a workflow run reaches a
        terminal state and at least one step reported a confidence — and only when
        <code className="mx-xs px-xs rounded-sm bg-bg-secondary text-text-main">
          aiqaos.learning.observations.enabled=true
        </code>
        is set on the runtime.
      </p>
    </div>
  );
}

/** Health is a governance signal, so it ships as icon + label + text — never colour alone. */
function HealthBanner({ view }: { view: LearningDashboardView }) {
  const atRisk = view.health === 'AT_RISK';
  const Icon = atRisk ? AlertTriangle : CheckCircle2;
  return (
    <div className="bg-bg-card border border-bg-secondary rounded-lg shadow-flat-md px-md py-sm flex items-center gap-sm">
      <Icon className={`w-4 h-4 ${atRisk ? 'text-status-warning' : 'text-status-success'}`} />
      <span className="text-sm font-semibold text-text-main">{atRisk ? 'At risk' : 'Healthy'}</span>
      <span className="text-sm text-text-muted">{view.headline}</span>
    </div>
  );
}

function trendLabel(trend: LearningTrend): string {
  if (trend === 'IMPROVING') return 'Improving';
  if (trend === 'REGRESSING') return 'Regressing';
  return 'Stable';
}

function TrendIcon({ trend }: { trend: LearningTrend }) {
  if (trend === 'IMPROVING') return <TrendingUp className="w-4 h-4 text-status-success" />;
  if (trend === 'REGRESSING') return <TrendingDown className="w-4 h-4 text-status-error" />;
  return <Minus className="w-4 h-4 text-text-muted" />;
}

// The svg scales proportionally to the panel width (w-full, no fixed height), so the viewBox aspect
// IS the rendered aspect — a wide one keeps it sparkline-height at full width instead of being
// letterboxed to 600px in the middle of the panel.
const CHART_W = 1200;
const CHART_H = 140;
const PAD_X = 8;
const PAD_Y = 12;

/**
 * The confidence series, oldest → newest. One series, so no legend — the panel title names it;
 * only the latest point is labelled directly, and the full numbers live in the table view.
 */
function ConfidenceHistory({ series }: { series: number[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);

  const n = series.length;
  const innerW = CHART_W - PAD_X * 2;
  const innerH = CHART_H - PAD_Y * 2;
  const x = (i: number) => (n <= 1 ? CHART_W / 2 : PAD_X + (i / (n - 1)) * innerW);
  const y = (v: number) => PAD_Y + (1 - clamp01(v)) * innerH;

  const path = series.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(2)} ${y(v).toFixed(2)}`).join(' ');
  const last = n > 0 ? series[n - 1] : 0;
  const active = hover;

  const onMove = (e: MouseEvent<SVGSVGElement>) => {
    if (n === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const svgX = ratio * CHART_W;
    const i = n <= 1 ? 0 : Math.round(((svgX - PAD_X) / innerW) * (n - 1));
    setHover(Math.min(n - 1, Math.max(0, i)));
  };

  return (
    <div className="bg-bg-card border border-bg-secondary rounded-lg shadow-flat-md overflow-hidden">
      <div className="px-md py-sm border-b border-bg-secondary flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text-main">Confidence history</h2>
        <button
          onClick={() => setShowTable((s) => !s)}
          className="text-xs text-text-muted hover:text-text-main"
        >
          {showTable ? 'Show chart' : 'Show data'}
        </button>
      </div>

      {showTable ? (
        <div className="max-h-[280px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="text-text-muted">
              <tr>
                <th className="text-left px-md py-sm font-medium">Run (oldest → newest)</th>
                <th className="text-right px-md py-sm font-medium">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bg-secondary">
              {series.map((v, i) => (
                <tr key={i}>
                  <td className="px-md py-xs text-text-muted">#{i + 1}</td>
                  <td className="px-md py-xs text-right text-text-main">{v.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="relative p-md">
          <svg
            viewBox={`0 0 ${CHART_W} ${CHART_H}`}
            className="w-full"
            role="img"
            aria-label={`Confidence across ${n} observed runs, oldest to newest. Latest ${last.toFixed(2)}.`}
            onMouseMove={onMove}
            onMouseLeave={() => setHover(null)}
          >
            {/* Recessive reference line at 0.5 — the confidence midpoint. */}
            <line
              x1={PAD_X}
              x2={CHART_W - PAD_X}
              y1={y(0.5)}
              y2={y(0.5)}
              stroke="var(--color-bg-secondary)"
              strokeWidth={1}
            />

            {n > 1 && (
              <path d={path} fill="none" stroke="var(--color-accent-primary)" strokeWidth={2} />
            )}

            {/* A single observation has no line to draw — show the point itself. */}
            {n === 1 && <circle cx={x(0)} cy={y(series[0])} r={4} fill="var(--color-accent-primary)" />}

            {active != null && (
              <>
                <line
                  x1={x(active)}
                  x2={x(active)}
                  y1={PAD_Y}
                  y2={CHART_H - PAD_Y}
                  stroke="var(--color-bg-secondary)"
                  strokeWidth={1}
                />
                <circle
                  cx={x(active)}
                  cy={y(series[active])}
                  r={4}
                  fill="var(--color-accent-primary)"
                  stroke="var(--color-bg-card)"
                  strokeWidth={2}
                />
              </>
            )}
          </svg>

          {/* Selective direct label: the latest value only. */}
          <div className="flex items-center justify-between mt-sm text-xs text-text-muted">
            <span>oldest</span>
            <span className="flex items-center gap-xs">
              latest <span className="text-text-main font-medium">{last.toFixed(2)}</span>
            </span>
          </div>

          {active != null && (
            <div
              className="absolute -top-xs px-sm py-xs rounded-md bg-bg-secondary text-xs text-text-main pointer-events-none"
              style={{ left: `${(x(active) / CHART_W) * 100}%`, transform: 'translateX(-50%)' }}
            >
              run #{active + 1} · {series[active].toFixed(2)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}
