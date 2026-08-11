import { useEffect, useState } from 'react';
import {
  getCompliance,
  type ComplianceReport,
  type ControlStatus,
} from '../services/complianceService';

/**
 * GOV-2 — Compliance frameworks & dashboard. Read-only view of the compliance control catalog
 * (SOC 2 / ISO 27001 / GDPR) with per-framework coverage. Self-attestation, not certification.
 * The backend (`/api/governance/compliance`) is served by the gateway.
 */
export default function CompliancePage() {
  const [report, setReport] = useState<ComplianceReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      setReport(await getCompliance());
    } catch {
      setError(true);
      setReport(null);
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
          <h1 className="text-xl font-semibold text-text-main">Compliance</h1>
          <p className="text-xs text-text-muted mt-xs">
            GOV-2 · SOC 2 / ISO 27001 / GDPR control coverage.
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
          Could not load compliance — the gateway may be unavailable (this view is served by the gateway).
        </p>
      )}

      {report && (
        <>
          <p className="text-xs text-text-muted italic">{report.attestation}</p>

          {report.frameworks.map((f) => (
            <div
              key={f.framework}
              className="bg-bg-card border border-bg-secondary rounded-lg shadow-flat-md overflow-hidden"
            >
              <div className="px-md py-sm border-b border-bg-secondary flex items-center justify-between gap-md">
                <h2 className="text-sm font-semibold text-text-main">{f.framework.replace('_', ' ')}</h2>
                <div className="flex items-center gap-sm flex-1 max-w-[28rem]">
                  <div className="flex-1 h-2 rounded-full bg-bg-secondary overflow-hidden">
                    <div
                      className="h-full bg-status-success"
                      style={{ width: `${f.coveragePercent}%` }}
                    />
                  </div>
                  <span className="text-xs text-text-muted whitespace-nowrap">
                    {f.satisfied}/{f.total} · {f.coveragePercent}%
                  </span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-text-muted uppercase tracking-wider">
                      <th className="px-md py-sm font-semibold">Ref</th>
                      <th className="px-md py-sm font-semibold">Requirement</th>
                      <th className="px-md py-sm font-semibold">Satisfied by</th>
                      <th className="px-md py-sm font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {f.controls.map((c) => (
                      <tr key={c.id} className="border-t border-bg-secondary align-top">
                        <td className="px-md py-sm text-text-muted whitespace-nowrap">{c.requirementRef}</td>
                        <td className="px-md py-sm text-text-main">{c.title}</td>
                        <td className="px-md py-sm text-text-muted">{c.satisfiedBy || '—'}</td>
                        <td className="px-md py-sm">
                          <StatusBadge status={c.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: ControlStatus }) {
  if (status === 'SATISFIED') {
    return (
      <span className="px-sm py-xs rounded-md text-xs bg-status-success/10 text-status-success">Satisfied</span>
    );
  }
  if (status === 'PARTIAL') {
    return (
      <span className="px-sm py-xs rounded-md text-xs bg-status-warning/10 text-status-warning">Partial</span>
    );
  }
  return (
    <span className="px-sm py-xs rounded-md text-xs bg-bg-secondary text-text-muted">Not implemented</span>
  );
}
