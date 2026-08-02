import apiClient from '../config/apiClient';

/** GOV-2 (ADR-081): a compliance control's implementation status (self-attestation). */
export type ControlStatus = 'SATISFIED' | 'PARTIAL' | 'NOT_IMPLEMENTED';

/** GOV-2: one control — a framework requirement mapped to the platform capability that satisfies it. */
export interface ComplianceControl {
  id: string;
  framework: string;
  requirementRef: string;
  title: string;
  satisfiedBy: string;
  status: ControlStatus;
  evidence: string;
}

/** GOV-2: per-framework coverage (satisfied / total). */
export interface ComplianceFrameworkSummary {
  framework: string;
  total: number;
  satisfied: number;
  partial: number;
  notImplemented: number;
  coveragePercent: number;
  controls: ComplianceControl[];
}

/** GOV-2: the compliance read-model — a self-attestation disclaimer + per-framework coverage. */
export interface ComplianceReport {
  attestation: string;
  frameworks: ComplianceFrameworkSummary[];
}

/** GET the compliance report. Served by the gateway (Vite proxies /api/governance -> :8080). */
export async function getCompliance(): Promise<ComplianceReport> {
  const res = await apiClient.get<ComplianceReport>('/governance/compliance');
  return res.data;
}
