export interface PipelineExecution {
  id: string;
  pipelineName: string;
  triggerSource: 'GitHub Actions' | 'Azure DevOps' | 'GitLab CI' | 'Jenkins' | 'Bitbucket';
  startedAt: string;
  duration: string;
  status: 'SUCCESS' | 'FAILED' | 'RUNNING';
  buildNumber: string;
  commitHash: string;
  passedCount: number;
  failedCount: number;
  skippedCount: number;
}

export const MOCK_PIPELINE_EXECUTIONS: PipelineExecution[] = [
  {
    id: 'PL-GHA-993848',
    pipelineName: 'AI-QA-OS Core CI',
    triggerSource: 'GitHub Actions',
    startedAt: 'Today 09:10 AM',
    duration: '5m 12s',
    status: 'FAILED',
    buildNumber: 'Bld-2026.07.17-01',
    commitHash: '1a0dd34',
    passedCount: 81,
    failedCount: 3,
    skippedCount: 2
  },
  {
    id: 'PL-AZD-882736',
    pipelineName: 'Nightly Core Validation',
    triggerSource: 'Azure DevOps',
    startedAt: 'Yesterday 11:30 PM',
    duration: '4m 45s',
    status: 'SUCCESS',
    buildNumber: 'Bld-2026.07.16-04',
    commitHash: 'e689cfc',
    passedCount: 86,
    failedCount: 0,
    skippedCount: 0
  },
  {
    id: 'PL-GLI-112734',
    pipelineName: 'Release-1.0.0-RC1-Tests',
    triggerSource: 'GitLab CI',
    startedAt: '2 days ago',
    duration: '8m 20s',
    status: 'SUCCESS',
    buildNumber: 'Bld-2026.07.15-02',
    commitHash: '6f0e2ae',
    passedCount: 85,
    failedCount: 1,
    skippedCount: 0
  }
];
