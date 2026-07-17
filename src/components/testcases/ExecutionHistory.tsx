import React from 'react';
import type { ExecutionHistoryItem } from '../../mock/history';
import { BrowserBadge } from './BrowserBadge';
import { StatusBadge } from './StatusBadge';
import { Calendar } from 'lucide-react';

interface ExecutionHistoryProps {
  historyItems: ExecutionHistoryItem[];
}

export const ExecutionHistory: React.FC<ExecutionHistoryProps> = ({ historyItems }) => {
  return (
    <div className="bg-bg-card border border-bg-secondary rounded-lg p-lg shadow-flat-md space-y-md">
      <h3 className="text-sm font-bold text-text-main flex items-center space-x-sm border-b border-bg-secondary pb-xs">
        <Calendar className="w-4 h-4 text-accent-primary" />
        <span>Execution History</span>
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
  );
};

export default ExecutionHistory;
