import React from 'react';
import { Terminal, Code } from 'lucide-react';

interface ExecutionLogsProps {
  consoleLog?: string;
  stackTrace?: string;
}

export const ExecutionLogs: React.FC<ExecutionLogsProps> = ({ consoleLog, stackTrace }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-md">
      {/* Console log */}
      <div className="bg-bg-card border border-bg-secondary rounded-lg p-lg shadow-flat-md flex flex-col">
        <h3 className="text-sm font-bold text-text-main flex items-center space-x-sm border-b border-bg-secondary pb-xs mb-sm">
          <Terminal className="w-4 h-4 text-accent-primary" />
          <span>Stdout Console Output</span>
        </h3>
        <pre className="flex-1 bg-black/10 border border-bg-secondary rounded p-md font-mono text-[10px] text-text-main overflow-auto max-h-[300px] leading-relaxed">
          {consoleLog || (
            <span className="text-text-muted italic">
              No console output available.{`\n`}Console logs are captured from Playwright stdout/stderr during execution.
            </span>
          )}
        </pre>
      </div>

      {/* Stack Trace */}
      <div className="bg-bg-card border border-bg-secondary rounded-lg p-lg shadow-flat-md flex flex-col">
        <h3 className="text-sm font-bold text-text-main flex items-center space-x-sm border-b border-bg-secondary pb-xs mb-sm">
          <Code className="w-4 h-4 text-status-error" />
          <span>Exception Stack Trace</span>
        </h3>
        <pre className="flex-1 bg-black/10 border border-bg-secondary rounded p-md font-mono text-[10px] text-status-error overflow-auto max-h-[300px] leading-relaxed">
          {stackTrace || (
            <span className="text-text-muted italic" style={{ color: 'inherit' }}>
              No stack trace available.{`\n`}Stack traces are captured only when a test case throws an exception.
            </span>
          )}
        </pre>
      </div>
    </div>
  );
};

export default ExecutionLogs;
