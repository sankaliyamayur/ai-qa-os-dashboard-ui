import React from 'react';
import type { TestCase } from '@/mock/testcases';
import { BrowserBadge } from './BrowserBadge';
import { StatusBadge } from './StatusBadge';
import { Compass, Cpu, GitCommit, Server, ShieldCheck, Activity } from 'lucide-react';

interface TestCaseCardProps {
  testCase: TestCase;
}

export const TestCaseCard: React.FC<TestCaseCardProps> = ({ testCase }) => {
  return (
    <div className="bg-bg-card border border-bg-secondary rounded-lg p-lg shadow-flat-md space-y-md">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">{testCase.id}</span>
          <h2 className="text-xl font-bold text-text-main mt-xs">{testCase.name}</h2>
          <p className="text-xs text-text-muted mt-xs">{testCase.description}</p>
        </div>
        <StatusBadge status={testCase.status} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-md border-t border-bg-secondary pt-md text-xs">
        <div className="flex items-center space-x-sm">
          <Compass className="w-4 h-4 text-accent-primary" />
          <div>
            <span className="block text-[10px] text-text-muted font-bold uppercase">Browser & Device</span>
            <span className="font-semibold text-text-main flex items-center space-x-xs mt-0.5">
              <BrowserBadge browser={testCase.browser} />
              <span className="text-text-muted">|</span>
              <span>{testCase.device || 'Desktop'}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-sm">
          <Server className="w-4 h-4 text-purple-500" />
          <div>
            <span className="block text-[10px] text-text-muted font-bold uppercase">Environment</span>
            <span className="font-semibold text-text-main mt-0.5 block">{testCase.environment || 'Staging'}</span>
          </div>
        </div>

        <div className="flex items-center space-x-sm">
          <Cpu className="w-4 h-4 text-emerald-500" />
          <div>
            <span className="block text-[10px] text-text-muted font-bold uppercase">Build Version</span>
            <span className="font-mono text-text-main mt-0.5 block">{testCase.build}</span>
          </div>
        </div>

        <div className="flex items-center space-x-sm">
          <GitCommit className="w-4 h-4 text-amber-500" />
          <div>
            <span className="block text-[10px] text-text-muted font-bold uppercase">Commit SHA</span>
            <span className="font-mono text-text-main mt-0.5 block">{testCase.commitHash || 'N/A'}</span>
          </div>
        </div>

        <div className="flex items-center space-x-sm">
          <Activity className="w-4 h-4 text-status-info" />
          <div>
            <span className="block text-[10px] text-text-muted font-bold uppercase">Pipeline ID</span>
            <span className="font-mono text-text-main mt-0.5 block">{testCase.pipelineId || 'N/A'}</span>
          </div>
        </div>

        <div className="flex items-center space-x-sm">
          <ShieldCheck className="w-4 h-4 text-blue-500" />
          <div>
            <span className="block text-[10px] text-text-muted font-bold uppercase">Priority</span>
            <span className="font-semibold text-text-main mt-0.5 block">{testCase.priority}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCaseCard;
