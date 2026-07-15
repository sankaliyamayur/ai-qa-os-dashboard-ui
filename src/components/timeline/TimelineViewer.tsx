import React from 'react';
import { ArrowDown, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

export interface TimelineEvent {
  id: string;
  stageName: string;
  startedAt: string;
  durationMs: number;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  cost: number;
  tokens: number;
  retries: number;
}

interface TimelineViewerProps {
  events: TimelineEvent[];
}

export const TimelineViewer: React.FC<TimelineViewerProps> = ({ events }) => {
  const getIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <CheckCircle2 className="w-5 h-5 text-status-success bg-bg-card rounded-full" />;
      case 'FAILED':
        return <AlertCircle className="w-5 h-5 text-status-error bg-bg-card rounded-full" />;
      default:
        return <HelpCircle className="w-5 h-5 text-text-muted bg-bg-card rounded-full" />;
    }
  };

  return (
    <div className="bg-bg-card p-md border border-bg-secondary rounded-lg shadow-flat-md space-y-md">
      <h3 className="text-md font-bold text-text-main">Pipeline Execution Timeline</h3>
      <div className="flex flex-col items-center">
        {events.map((event, idx) => (
          <React.Fragment key={event.id}>
            <div className="flex items-center space-x-md w-full max-w-lg p-sm bg-bg-secondary/40 border border-bg-secondary rounded-md hover:border-accent-primary/40 transition-colors">
              <div className="flex-shrink-0">{getIcon(event.status)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm text-text-main">{event.stageName}</span>
                  <span className="text-[10px] text-text-muted">{event.startedAt}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-text-muted mt-xs">
                  <span>Duration: {(event.durationMs / 1000).toFixed(2)}s</span>
                  <span className="space-x-sm">
                    {event.tokens > 0 && <span>{event.tokens.toLocaleString()} tokens</span>}
                    {event.cost > 0 && <span className="text-status-success">${event.cost.toFixed(3)}</span>}
                    {event.retries > 0 && <span className="text-status-warning">{event.retries} retries</span>}
                  </span>
                </div>
              </div>
            </div>
            {idx < events.length - 1 && (
              <div className="my-xs">
                <ArrowDown className="w-4 h-4 text-text-muted animate-pulse" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
