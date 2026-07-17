import React from 'react';
import { CheckCircle2, XCircle, AlertCircle, ArrowDown } from 'lucide-react';

interface TimelineStep {
  time: string;
  action: string;
  status: 'PASS' | 'FAILED' | 'SKIPPED';
  details?: string;
}

interface ExecutionTimelineProps {
  steps: TimelineStep[];
}

export const ExecutionTimeline: React.FC<ExecutionTimelineProps> = ({ steps }) => {
  return (
    <div className="bg-bg-card border border-bg-secondary rounded-lg p-lg shadow-flat-md space-y-md">
      <h3 className="text-md font-bold text-text-main border-b border-bg-secondary pb-xs">
        Execution Step Timeline
      </h3>

      <div className="flex flex-col items-center py-md space-y-xs max-w-xl mx-auto">
        {steps.map((step, idx) => {
          const isLast = idx === steps.length - 1;
          return (
            <React.Fragment key={idx}>
              {/* Step Card */}
              <div className="w-full flex items-center justify-between p-md bg-bg-secondary border border-bg-secondary rounded-md hover:border-accent-primary/20 transition-all shadow-flat-sm">
                <div className="flex items-center space-x-md">
                  <span className="text-[10px] text-text-muted font-mono bg-bg-primary px-xs py-0.5 rounded">
                    {step.time}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-text-main">{step.action}</h4>
                    {step.details && (
                      <p className="text-xs text-status-error font-medium mt-0.5">{step.details}</p>
                    )}
                  </div>
                </div>

                <div>
                  {step.status === 'PASS' && (
                    <span className="flex items-center space-x-1 text-status-success font-semibold text-xs bg-status-success/10 px-sm py-[2px] rounded border border-status-success/20">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Passed</span>
                    </span>
                  )}
                  {step.status === 'FAILED' && (
                    <span className="flex items-center space-x-1 text-status-error font-semibold text-xs bg-status-error/10 px-sm py-[2px] rounded border border-status-error/20">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Failed</span>
                    </span>
                  )}
                  {step.status === 'SKIPPED' && (
                    <span className="flex items-center space-x-1 text-status-warning font-semibold text-xs bg-status-warning/10 px-sm py-[2px] rounded border border-status-warning/20">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Skipped</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Connector Arrow */}
              {!isLast && (
                <div className="flex justify-center items-center py-1">
                  <ArrowDown className="w-4 h-4 text-text-muted animate-bounce" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ExecutionTimeline;
