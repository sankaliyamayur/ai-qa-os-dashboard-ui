import React, { useState } from 'react';
import { Terminal, Cpu, DollarSign, RefreshCw } from 'lucide-react';

export interface AgentTraceStep {
  id: string;
  agentName: string;
  prompt: string;
  llmRequest: string;
  rawResponse: string;
  validationError?: string;
  repairAttempt?: string;
  finalJson: string;
  durationMs: number;
  cost: number;
}

interface AgentTraceViewerProps {
  traces: AgentTraceStep[];
}

export const AgentTraceViewer: React.FC<AgentTraceViewerProps> = ({ traces }) => {
  const [selectedTraceId, setSelectedTraceId] = useState<string>(traces[0]?.id || '');
  const selectedTrace = traces.find((t) => t.id === selectedTraceId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-md bg-bg-card border border-bg-secondary rounded-lg shadow-flat-md min-h-[500px]">
      {/* Left List Pane */}
      <div className="border-r border-bg-secondary p-md space-y-sm overflow-y-auto">
        <h3 className="text-sm font-bold text-text-main uppercase tracking-wider">Agents Execution Log</h3>
        <div className="space-y-xs">
          {traces.map((trace) => (
            <button
              key={trace.id}
              onClick={() => setSelectedTraceId(trace.id)}
              className={`w-full text-left p-sm rounded-md transition-colors border text-sm ${
                selectedTraceId === trace.id
                  ? 'bg-accent-primary/10 border-accent-primary/30 text-accent-primary'
                  : 'bg-transparent border-transparent text-text-muted hover:bg-bg-secondary'
              }`}
            >
              <div className="font-semibold">{trace.agentName}</div>
              <div className="text-xs text-text-muted flex justify-between mt-xs">
                <span>{(trace.durationMs / 1000).toFixed(2)}s</span>
                <span>${trace.cost.toFixed(4)}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Details Audit Inspector Pane */}
      <div className="lg:col-span-2 p-md overflow-y-auto space-y-md">
        {selectedTrace ? (
          <>
            <div className="flex justify-between items-center border-b border-bg-secondary pb-sm">
              <h3 className="text-md font-bold text-text-main">{selectedTrace.agentName} Auditing Details</h3>
              <div className="flex items-center space-x-sm text-xs font-mono">
                <span className="flex items-center text-status-success">
                  <DollarSign className="w-3.5 h-3.5 mr-[2px]" />
                  {selectedTrace.cost.toFixed(4)}
                </span>
                <span className="flex items-center text-text-muted">
                  <Cpu className="w-3.5 h-3.5 mr-[2px]" />
                  {selectedTrace.durationMs}ms
                </span>
              </div>
            </div>

            {/* Prompt audit */}
            <div className="space-y-xs">
              <span className="block text-xs font-bold text-text-muted uppercase">Prompt Input</span>
              <div className="bg-bg-secondary p-sm rounded-md text-xs font-mono text-text-main overflow-x-auto">
                {selectedTrace.prompt}
              </div>
            </div>

            {/* LLM Raw request */}
            <div className="space-y-xs">
              <span className="block text-xs font-bold text-text-muted uppercase">Raw Request Parameter</span>
              <div className="bg-bg-secondary p-sm rounded-md text-xs font-mono text-text-main overflow-x-auto">
                {selectedTrace.llmRequest}
              </div>
            </div>

            {/* LLM Response */}
            <div className="space-y-xs">
              <span className="block text-xs font-bold text-text-muted uppercase">LLM Raw Output Response</span>
              <div className="bg-bg-secondary p-sm rounded-md text-xs font-mono text-text-main overflow-x-auto whitespace-pre-wrap">
                {selectedTrace.rawResponse}
              </div>
            </div>

            {/* If repair occurred */}
            {selectedTrace.validationError && (
              <div className="border border-status-error/30 bg-status-error/5 p-sm rounded-md space-y-xs">
                <span className="flex items-center text-xs font-bold text-status-error uppercase">
                  <Terminal className="w-3.5 h-3.5 mr-xs" /> Validation / Output Syntax Error
                </span>
                <p className="text-xs text-text-main font-mono">{selectedTrace.validationError}</p>
              </div>
            )}

            {selectedTrace.repairAttempt && (
              <div className="border border-status-warning/30 bg-status-warning/5 p-sm rounded-md space-y-xs">
                <span className="flex items-center text-xs font-bold text-status-warning uppercase">
                  <RefreshCw className="w-3.5 h-3.5 mr-xs" /> Corrective Healing Prompt
                </span>
                <p className="text-xs text-text-main font-mono">{selectedTrace.repairAttempt}</p>
              </div>
            )}

            {/* Final JSON Output */}
            <div className="space-y-xs">
              <span className="block text-xs font-bold text-text-muted uppercase">Parsed Output Outcome</span>
              <pre className="bg-bg-secondary p-sm rounded-md text-xs font-mono text-text-main overflow-x-auto">
                {selectedTrace.finalJson}
              </pre>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-text-muted">
            Select an Agent to inspect execution traces.
          </div>
        )}
      </div>
    </div>
  );
};
