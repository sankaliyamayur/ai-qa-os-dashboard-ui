import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface FailureReasonProps {
  status: 'Passed' | 'Failed' | 'Skipped' | string;
  failureReason?: string;
  errorMessage?: string;
}

export const FailureReason: React.FC<FailureReasonProps> = ({
  status,
  failureReason,
  errorMessage
}) => {
  if (status !== 'Failed') return null;

  return (
    <div className="bg-status-error/10 border border-status-error/20 rounded-lg p-lg shadow-flat-sm space-y-sm">
      <div className="flex items-center space-x-sm text-status-error font-bold text-sm">
        <ShieldAlert className="w-5 h-5" />
        <span>Root Cause Failure Diagnostics</span>
      </div>

      <div className="text-xs space-y-xs">
        <div>
          <span className="font-bold text-text-main">Reason: </span>
          <span className="text-text-muted">{failureReason || 'Automation runtime failure'}</span>
        </div>
        <div>
          <span className="font-bold text-text-main">Message: </span>
          <span className="font-mono text-status-error bg-black/10 px-xs py-0.5 rounded leading-relaxed">
            {errorMessage || 'Unknown error occurred.'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FailureReason;
