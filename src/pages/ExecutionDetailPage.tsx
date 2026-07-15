import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { MetricBadge } from '../components/common/MetricBadge';
import { TimelineViewer, type TimelineEvent } from '../components/timeline/TimelineViewer';
import { AgentTraceViewer, type AgentTraceStep } from '../components/traces/AgentTraceViewer';

interface LogMessage {
  time: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
}

const MOCK_TRACES: AgentTraceStep[] = [
  {
    id: 'trace-1',
    agentName: 'QA Analyst Agent',
    prompt: 'Analyze user requirements for Authentication layout and export login workflows.',
    llmRequest: 'temperature: 0.1, model: gemini-1.5-pro, max_tokens: 1000',
    rawResponse: '{ "auth_flows": [ "login", "reset_password" ] }',
    finalJson: '{\n  "auth_flows": [\n    "login",\n    "reset_password"\n  ]\n}',
    durationMs: 9000,
    cost: 0.012,
  },
  {
    id: 'trace-2',
    agentName: 'Script Generation Agent',
    prompt: 'Write test cases in Playwright format for Login screen validation.',
    llmRequest: 'temperature: 0.2, model: gemini-1.5-pro, max_tokens: 2000',
    rawResponse: 'INVALID JSON RESPONSE OBJECT',
    validationError: 'Expected key-value json response but received markdown text.',
    repairAttempt: 'Correct the previous output and generate pure JSON format only.',
    finalJson: '{\n  "test_script": "import { test } from \'@playwright/test\';..."\n}',
    durationMs: 35000,
    cost: 0.084,
  },
];

const MOCK_TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'stage-1',
    stageName: 'QA Analysis',
    startedAt: '11:30:01',
    durationMs: 9000,
    status: 'SUCCESS',
    cost: 0.012,
    tokens: 4000,
    retries: 0,
  },
  {
    id: 'stage-2',
    stageName: 'Script Generation',
    startedAt: '11:30:10',
    durationMs: 35000,
    status: 'SUCCESS',
    cost: 0.084,
    tokens: 28000,
    retries: 1,
  },
  {
    id: 'stage-3',
    stageName: 'Execution',
    startedAt: '11:30:45',
    durationMs: 45000,
    status: 'SUCCESS',
    cost: 0,
    tokens: 0,
    retries: 0,
  },
  {
    id: 'stage-4',
    stageName: 'Healing & Pass',
    startedAt: '11:31:30',
    durationMs: 44000,
    status: 'SUCCESS',
    cost: 0.03,
    tokens: 10000,
    retries: 0,
  },
];

const MOCK_DETAILS = {
  id: 'exec-101',
  workflowName: 'Enterprise Login Pipeline',
  startedAt: '2026-07-15 11:30:00',
  finishedAt: '2026-07-15 11:32:15',
  duration: '2m 15s',
  status: 'success' as const,
  passRate: 100,
  environment: 'Staging',
  browser: 'Chrome',
  framework: 'Playwright',
  triggeredBy: 'Jenkins CI',
  gitBranch: 'main',
  gitCommit: 'a8b9c10',
  llmModel: 'Gemini 1.5 Pro',
  tokensUsed: 42000,
  cost: 0.126,
  logs: [
    { time: '11:30:01', level: 'INFO', message: 'Initializing automation agent suite...' },
    { time: '11:30:10', level: 'INFO', message: 'Navigating to login security endpoint.' },
    { time: '11:30:45', level: 'INFO', message: 'Inputting credentials into auth form.' },
    { time: '11:31:30', level: 'INFO', message: 'Security MFA challenge resolved successfully.' },
    { time: '11:32:14', level: 'INFO', message: 'Execution complete. Saving artifacts.' },
  ] as LogMessage[],
};

export const ExecutionDetailPage: React.FC = () => {
  const { executionId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'traces' | 'logs' | 'raw'>('overview');

  return (
    <div className="space-y-lg p-lg">
      <div className="flex items-center space-x-md">
        <button
          onClick={() => navigate('/executions')}
          className="p-sm bg-bg-secondary text-text-main rounded-md hover:bg-accent-primary hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <span className="text-xs font-semibold text-text-muted">Execution Details</span>
          <h1 className="text-2xl font-bold text-text-main flex items-center space-x-sm">
            <span>{executionId}</span>
            <StatusBadge type={MOCK_DETAILS.status}>{MOCK_DETAILS.status.toUpperCase()}</StatusBadge>
          </h1>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex border-b border-bg-secondary space-x-md">
        {(['overview', 'timeline', 'traces', 'logs', 'raw'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-sm px-md text-sm font-semibold capitalize border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-accent-primary text-accent-primary'
                : 'border-transparent text-text-muted hover:text-text-main'
            }`}
          >
            {tab === 'traces' ? 'Agent Traces' : tab}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
          {/* Metadata Summary */}
          <div className="lg:col-span-2 space-y-md">
            <div className="bg-bg-card p-md rounded-lg border border-bg-secondary shadow-flat-md space-y-sm">
              <h3 className="text-md font-bold text-text-main">Workflow Metadata</h3>
              <div className="grid grid-cols-2 gap-sm text-sm">
                <div>
                  <span className="block text-xs text-text-muted">Workflow Name</span>
                  <span className="font-semibold">{MOCK_DETAILS.workflowName}</span>
                </div>
                <div>
                  <span className="block text-xs text-text-muted">Triggered By</span>
                  <span className="font-semibold">{MOCK_DETAILS.triggeredBy}</span>
                </div>
                <div>
                  <span className="block text-xs text-text-muted">Git Context</span>
                  <span className="font-mono text-xs bg-bg-secondary px-xs py-[2px] rounded">
                    {MOCK_DETAILS.gitBranch}@{MOCK_DETAILS.gitCommit}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-text-muted">Time Frame</span>
                  <span className="font-semibold">{MOCK_DETAILS.duration} ({MOCK_DETAILS.startedAt})</span>
                </div>
              </div>
            </div>

            {/* Target Matrix Tags */}
            <div className="bg-bg-card p-md rounded-lg border border-bg-secondary shadow-flat-md space-y-sm">
              <h3 className="text-md font-bold text-text-main">Target Infrastructure</h3>
              <div className="flex space-x-sm">
                <MetricBadge label={MOCK_DETAILS.environment} />
                <MetricBadge label={MOCK_DETAILS.browser} />
                <MetricBadge label={MOCK_DETAILS.framework} />
              </div>
            </div>
          </div>

          {/* Right Pane: LLM Stats */}
          <div className="bg-bg-card p-md rounded-lg border border-bg-secondary shadow-flat-md space-y-md">
            <h3 className="text-md font-bold text-text-main">LLM Optimization Stats</h3>
            <div className="space-y-sm text-sm">
              <div className="flex justify-between items-center border-b border-bg-secondary pb-xs">
                <span className="text-text-muted">Model Used</span>
                <span className="font-semibold text-accent-primary">{MOCK_DETAILS.llmModel}</span>
              </div>
              <div className="flex justify-between items-center border-b border-bg-secondary pb-xs">
                <span className="text-text-muted">Total Tokens</span>
                <span className="font-semibold">{MOCK_DETAILS.tokensUsed.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pb-xs">
                <span className="text-text-muted">Execution Cost</span>
                <span className="font-semibold text-status-success">${MOCK_DETAILS.cost.toFixed(3)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <TimelineViewer events={MOCK_TIMELINE_EVENTS} />
      )}

      {activeTab === 'traces' && (
        <AgentTraceViewer traces={MOCK_TRACES} />
      )}

      {activeTab === 'logs' && (
        <div className="bg-bg-card rounded-lg border border-bg-secondary shadow-flat-md p-md font-mono text-xs overflow-x-auto">
          <div className="space-y-xs">
            {MOCK_DETAILS.logs.map((log, idx) => (
              <div key={idx} className="flex space-x-md py-xs border-b border-bg-secondary/40 last:border-0">
                <span className="text-text-muted">{log.time}</span>
                <span
                  className={`font-bold ${
                    log.level === 'ERROR'
                      ? 'text-status-error'
                      : log.level === 'WARN'
                      ? 'text-status-warning'
                      : 'text-status-info'
                  }`}
                >
                  [{log.level}]
                </span>
                <span className="text-text-main">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'raw' && (
        <div className="bg-bg-card rounded-lg border border-bg-secondary shadow-flat-md p-md font-mono text-xs">
          <pre className="text-text-main overflow-x-auto">
            {JSON.stringify(MOCK_DETAILS, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
export default ExecutionDetailPage;
