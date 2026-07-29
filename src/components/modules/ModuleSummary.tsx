import React from 'react';
import type { Module } from '@/mock/modules';

import { CheckCircle2, XCircle, AlertCircle, PlayCircle } from 'lucide-react';

interface ModuleSummaryProps {
  module: Module;
}

export const ModuleSummary: React.FC<ModuleSummaryProps> = ({ module }) => {
  const getPassRateColor = (rate: number) => {
    if (rate >= 95) return 'text-status-success';
    if (rate >= 85) return 'text-status-warning';
    return 'text-status-error';
  };

  return (
    <div className="bg-bg-card border border-bg-secondary rounded-lg p-lg shadow-flat-md flex flex-col md:flex-row md:items-center justify-between gap-md">
      <div>
        <h1 className="text-2xl font-bold text-text-main">{module.name} Module</h1>
        <p className="text-sm text-text-muted mt-xs">{module.description}</p>
      </div>

      <div className="flex flex-wrap items-center gap-lg">
        <div className="flex items-center space-x-sm">
          <div className="p-xs bg-bg-secondary rounded">
            <PlayCircle className="w-5 h-5 text-text-muted" />
          </div>
          <div>
            <span className="block text-[10px] text-text-muted font-bold uppercase">Total Tests</span>
            <span className="text-md font-bold text-text-main">{module.totalTests}</span>
          </div>
        </div>

        <div className="flex items-center space-x-sm">
          <div className="p-xs bg-status-success/15 rounded">
            <CheckCircle2 className="w-5 h-5 text-status-success" />
          </div>
          <div>
            <span className="block text-[10px] text-text-muted font-bold uppercase">Passed</span>
            <span className="text-md font-bold text-status-success">{module.passed}</span>
          </div>
        </div>

        <div className="flex items-center space-x-sm">
          <div className="p-xs bg-status-error/15 rounded">
            <XCircle className="w-5 h-5 text-status-error" />
          </div>
          <div>
            <span className="block text-[10px] text-text-muted font-bold uppercase">Failed</span>
            <span className="text-md font-bold text-status-error">{module.failed}</span>
          </div>
        </div>

        <div className="flex items-center space-x-sm">
          <div className="p-xs bg-status-warning/15 rounded">
            <AlertCircle className="w-5 h-5 text-status-warning" />
          </div>
          <div>
            <span className="block text-[10px] text-text-muted font-bold uppercase">Skipped</span>
            <span className="text-md font-bold text-status-warning">{module.skipped}</span>
          </div>
        </div>

        <div className="border-l border-bg-secondary pl-lg">
          <span className="block text-[10px] text-text-muted font-bold uppercase">Pass Rate</span>
          <span className={`text-2xl font-bold ${getPassRateColor(module.passRate)}`}>
            {module.passRate}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ModuleSummary;
