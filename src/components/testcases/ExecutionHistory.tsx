import React from 'react';
import type { ExecutionHistoryItem } from '../../mock/history';
import type { ArtifactRunEntry } from '../../services/artifactService';
import { BrowserBadge } from './BrowserBadge';
import { StatusBadge } from './StatusBadge';
import { Calendar, Image as ImageIcon, Video, Radio } from 'lucide-react';

interface ExecutionHistoryProps {
  historyItems: ExecutionHistoryItem[];
  /** Real Playwright artifact history from GET /api/dashboard/artifacts/{testCaseId}/history */
  artifactHistory?: ArtifactRunEntry[];
}

export const ExecutionHistory: React.FC<ExecutionHistoryProps> = ({ historyItems, artifactHistory }) => {
  const hasArtifactHistory = artifactHistory && artifactHistory.length > 0;

  return (
    <div className="space-y-md">
      {/* ── Real Playwright Execution History (from API) ──────────────────── */}
      {hasArtifactHistory && (
        <div className="bg-bg-card border border-bg-secondary rounded-lg p-lg shadow-flat-md space-y-md">
          <h3 className="text-sm font-bold text-text-main flex items-center space-x-sm border-b border-bg-secondary pb-xs">
            <Calendar className="w-4 h-4 text-accent-primary" />
            <span>Playwright Run History</span>
            <span className="ml-auto text-xs font-normal text-text-muted bg-bg-secondary px-sm py-[2px] rounded-full">
              {artifactHistory!.length} run{artifactHistory!.length !== 1 ? 's' : ''}
            </span>
          </h3>

          <div className="space-y-sm">
            {artifactHistory!.map((run) => (
              <div
                key={`${run.executionId}-${run.runNumber}`}
                className="flex items-start justify-between p-sm bg-bg-secondary rounded-lg border border-bg-secondary hover:border-accent-primary/30 transition-colors"
              >
                {/* Run metadata */}
                <div className="flex items-center space-x-md">
                  <div className="flex flex-col items-center w-10">
                    <span className="text-xs font-bold text-accent-primary">#{run.runNumber}</span>
                    <span className="text-[10px] text-text-muted">Run</span>
                  </div>
                  <div className="space-y-[2px]">
                    <div className="flex items-center space-x-sm">
                      <span
                        className={`text-xs font-semibold px-sm py-[1px] rounded-full ${
                          run.status?.toLowerCase() === 'passed' || run.status?.toLowerCase() === 'success'
                            ? 'bg-status-success/10 text-status-success'
                            : run.status?.toLowerCase() === 'failed' || run.status?.toLowerCase() === 'error'
                            ? 'bg-status-error/10 text-status-error'
                            : 'bg-bg-primary text-text-muted'
                        }`}
                      >
                        {run.status?.toUpperCase() ?? 'UNKNOWN'}
                      </span>
                      <span className="text-xs text-text-muted font-mono">{run.browser}</span>
                    </div>
                    <p className="text-[10px] text-text-muted font-mono">{run.executionId}</p>
                  </div>
                </div>

                {/* Artifact links for this run */}
                <div className="flex items-center space-x-xs">
                  {run.screenshotUrl && (
                    <a
                      href={run.screenshotUrl}
                      target="_blank"
                      rel="noreferrer"
                      title="View failure screenshot"
                      className="flex items-center space-x-[3px] px-sm py-[3px] bg-bg-primary hover:bg-accent-primary hover:text-white text-text-muted rounded text-[10px] transition-colors"
                    >
                      <ImageIcon className="w-3 h-3" />
                      <span>Screenshot</span>
                    </a>
                  )}
                  {run.videoUrl && (
                    <a
                      href={run.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      title="Watch execution video"
                      className="flex items-center space-x-[3px] px-sm py-[3px] bg-bg-primary hover:bg-accent-primary hover:text-white text-text-muted rounded text-[10px] transition-colors"
                    >
                      <Video className="w-3 h-3" />
                      <span>Video</span>
                    </a>
                  )}
                  {run.traceUrl && (
                    <a
                      href={run.traceUrl}
                      download
                      title="Download Playwright trace"
                      className="flex items-center space-x-[3px] px-sm py-[3px] bg-bg-primary hover:bg-accent-primary hover:text-white text-text-muted rounded text-[10px] transition-colors"
                    >
                      <Radio className="w-3 h-3" />
                      <span>Trace</span>
                    </a>
                  )}
                  {!run.screenshotUrl && !run.videoUrl && !run.traceUrl && (
                    <span className="text-[10px] text-text-muted italic">No artifacts</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Pipeline Execution History (from mock/real DB) ────────────────── */}
      <div className="bg-bg-card border border-bg-secondary rounded-lg p-lg shadow-flat-md space-y-md">
        <h3 className="text-sm font-bold text-text-main flex items-center space-x-sm border-b border-bg-secondary pb-xs">
          <Calendar className="w-4 h-4 text-accent-primary" />
          <span>Pipeline Execution History</span>
        </h3>

        {historyItems.length === 0 ? (
          <p className="text-xs text-text-muted">No historical runs recorded for this test case.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-bg-secondary text-text-muted font-semibold uppercase border-b border-bg-secondary">
                  <th className="py-xs px-sm">Execution Date</th>
                  <th className="py-xs px-sm">Build</th>
                  <th className="py-xs px-sm">Pipeline</th>
                  <th className="py-xs px-sm">Browser</th>
                  <th className="py-xs px-sm">Status</th>
                  <th className="py-xs px-sm">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bg-secondary text-text-main font-medium">
                {historyItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-bg-secondary/20 transition-colors">
                    <td className="py-xs px-sm text-text-muted">{item.executionDate}</td>
                    <td className="py-xs px-sm font-mono">{item.build}</td>
                    <td className="py-xs px-sm text-text-muted font-mono">{item.pipeline}</td>
                    <td className="py-xs px-sm">
                      <BrowserBadge browser={item.browser} />
                    </td>
                    <td className="py-xs px-sm">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="py-xs px-sm font-mono">{item.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExecutionHistory;
