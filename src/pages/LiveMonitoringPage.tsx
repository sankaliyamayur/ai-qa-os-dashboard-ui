import React from 'react';
import { Shield, ShieldAlert, Wifi, WifiOff } from 'lucide-react';
import { useSSE } from '../hooks/useSSE';
import { MetricCard } from '../components/cards/MetricCard';

export const LiveMonitoringPage: React.FC = () => {
  const { data, status } = useSSE('/api/dashboard/live/stream');

  // Neutral initial structure while live stream connects
  const telemetry = data || {
    runningPipelines: 0,
    queueSize: 0,
    activeAgents: 0,
    cpuUsage: 0,
    memoryUsage: 0,
    redisConnected: false,
    dbPoolActive: 0,
    tokensPerSec: 0,
    requestsPerSec: 0,
    avgLatencyMs: 0,
  };

  return (
    <div className="space-y-lg p-lg">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-text-main">Live Telemetry</h1>
          <p className="text-sm text-text-muted">Real-time infrastructure system metrics</p>
        </div>
        <div className="flex items-center space-x-sm">
          {status === 'CONNECTED' ? (
            <span className="inline-flex items-center text-xs font-semibold text-status-success px-sm py-[2px] bg-status-success/15 border border-status-success/30 rounded-sm">
              <Wifi className="w-3.5 h-3.5 mr-xs" /> LIVE STREAMING
            </span>
          ) : (
            <span className="inline-flex items-center text-xs font-semibold text-status-warning px-sm py-[2px] bg-status-warning/15 border border-status-warning/30 rounded-sm animate-pulse">
              <WifiOff className="w-3.5 h-3.5 mr-xs" /> RECONNECTING...
            </span>
          )}
        </div>
      </div>

      {/* Real-time Cards Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
        <MetricCard title="Running Pipelines" value={telemetry.runningPipelines} />
        <MetricCard title="Queue Size" value={telemetry.queueSize} />
        <MetricCard title="Active Workers" value={telemetry.activeAgents} />
        <MetricCard title="Average Latency" value={`${telemetry.avgLatencyMs}ms`} />
      </div>

      {/* Deeper Infrastructure Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        {/* Core telemetry */}
        <div className="bg-bg-card p-md border border-bg-secondary rounded-lg shadow-flat-md space-y-sm">
          <h3 className="text-sm font-semibold text-text-muted uppercase">Resource Allocation</h3>
          <div className="space-y-md text-sm mt-md">
            <div>
              <div className="flex justify-between mb-xs">
                <span>CPU Usage</span>
                <span className="font-semibold">{telemetry.cpuUsage}%</span>
              </div>
              <div className="w-full bg-bg-secondary h-2 rounded-full overflow-hidden">
                <div className="bg-accent-primary h-full" style={{ width: `${telemetry.cpuUsage}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-xs">
                <span>Memory Usage</span>
                <span className="font-semibold">{telemetry.memoryUsage}%</span>
              </div>
              <div className="w-full bg-bg-secondary h-2 rounded-full overflow-hidden">
                <div className="bg-accent-primary h-full" style={{ width: `${telemetry.memoryUsage}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Database & Caching pools */}
        <div className="bg-bg-card p-md border border-bg-secondary rounded-lg shadow-flat-md space-y-sm">
          <h3 className="text-sm font-semibold text-text-muted uppercase">Dependency Pools</h3>
          <div className="space-y-sm mt-md text-sm">
            <div className="flex justify-between items-center border-b border-bg-secondary pb-xs">
              <span>Redis Cluster Connection</span>
              {telemetry.redisConnected ? (
                <span className="text-status-success font-semibold flex items-center">
                  <Shield className="w-4 h-4 mr-xs" /> Healthy
                </span>
              ) : (
                <span className="text-status-error font-semibold flex items-center">
                  <ShieldAlert className="w-4 h-4 mr-xs" /> Offline
                </span>
              )}
            </div>
            <div className="flex justify-between items-center pb-xs">
              <span>Active HikariCP DB Connections</span>
              <span className="font-semibold text-text-main">{telemetry.dbPoolActive}</span>
            </div>
          </div>
        </div>

        {/* LLM Rate Stats */}
        <div className="bg-bg-card p-md border border-bg-secondary rounded-lg shadow-flat-md space-y-sm">
          <h3 className="text-sm font-semibold text-text-muted uppercase">LLM Throughput Speed</h3>
          <div className="space-y-sm mt-md text-sm">
            <div className="flex justify-between items-center border-b border-bg-secondary pb-xs">
              <span>Tokens / sec</span>
              <span className="font-semibold text-accent-primary">{telemetry.tokensPerSec}</span>
            </div>
            <div className="flex justify-between items-center pb-xs">
              <span>Requests / sec</span>
              <span className="font-semibold text-accent-primary">{telemetry.requestsPerSec} req/s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LiveMonitoringPage;
