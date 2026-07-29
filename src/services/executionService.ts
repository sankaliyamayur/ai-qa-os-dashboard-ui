import apiClient from '../config/apiClient';

// ─── Types ──────────────────────────────────────────────────────────────────

export type ExecutionStatus = 'success' | 'warning' | 'error' | 'info';

export interface ExecutionRow {
  id: string;
  workflowName: string;
  startedAt: string;
  duration: string;
  status: ExecutionStatus;
  passRate: number;
  environment: string;
  browser: string;
  framework: string;
  triggeredBy: string;
}

export interface ExecutionDetail extends ExecutionRow {
  finishedAt: string;
  gitBranch: string;
  environment: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toStatus(raw?: string): ExecutionStatus {
  if (!raw) return 'info';
  const s = raw.toLowerCase();
  if (s === 'success' || s === 'passed') return 'success';
  if (s === 'failed' || s === 'error')   return 'error';
  if (s === 'running')                   return 'info';
  return 'warning';
}

function toPassRate(item: any): number {
  const total = item.totalSteps ?? 0;
  const success = item.successSteps ?? 0;
  return total > 0 ? Math.round((success * 100) / total) : 0;
}

function toRow(item: any): ExecutionRow {
  return {
    id:           item.executionId,
    workflowName: item.gitBranch ? `Pipeline - ${item.gitBranch}` : 'AUTONOMOUS_QA_PIPELINE',
    startedAt:    item.startTime ? item.startTime.replace('T', ' ').substring(0, 16) : 'Just now',
    duration:     item.durationMs ? `${Math.round(item.durationMs / 1000)}s` : 'Running',
    status:       toStatus(item.status),
    passRate:     toPassRate(item),
    environment:  item.environment ?? 'Staging',
    browser:      item.browser ?? 'Chrome',
    framework:    'Playwright',
    triggeredBy:  item.gitCommit ? `Commit: ${item.gitCommit.substring(0, 7)}` : 'API',
  };
}

// ─── API calls ───────────────────────────────────────────────────────────────

/**
 * PERF-3: Fetches the execution list via apiClient (JWT-aware, consistent baseURL).
 * Returns up to `size` rows ordered by most-recent first.
 */
export async function fetchExecutions(size = 50): Promise<ExecutionRow[]> {
  const res = await apiClient.get<{ content: any[] }>(`/dashboard/executions?size=${size}`);
  const content = res.data?.content ?? [];
  return content.map(toRow);
}

/**
 * PERF-3: Fetches a single execution's full detail by ID via apiClient.
 */
export async function fetchExecutionDetail(executionId: string): Promise<ExecutionDetail> {
  const res = await apiClient.get<any>(`/dashboard/executions/${executionId}`);
  const item = res.data;
  return {
    ...toRow(item),
    finishedAt: item.endTime   ? item.endTime.replace('T', ' ').substring(0, 19)   : 'Running',
    gitBranch:  item.gitBranch ?? 'main',
    environment: item.environment ?? 'Staging',
  };
}
