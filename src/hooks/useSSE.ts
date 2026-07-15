import { useEffect, useState, useRef, useCallback } from 'react';

export interface LiveTelemetryData {
  runningPipelines: number;
  queueSize: number;
  activeAgents: number;
  cpuUsage: number;
  memoryUsage: number;
  redisConnected: boolean;
  dbPoolActive: number;
  tokensPerSec: number;
  requestsPerSec: number;
  avgLatencyMs: number;
}

export const useSSE = (url: string) => {
  const [data, setData] = useState<LiveTelemetryData | null>(null);
  const [status, setStatus] = useState<'CONNECTED' | 'RECONNECTING' | 'DISCONNECTED'>('DISCONNECTED');
  const reconnectTimeoutRef = useRef<number | null>(null);
  const delayRef = useRef<number>(2000); // start with 2s reconnect delay

  const connect = useCallback(() => {
    setStatus('RECONNECTING');
    const eventSource = new EventSource(url);

    eventSource.onopen = () => {
      setStatus('CONNECTED');
      delayRef.current = 2000; // reset delay on successful connection
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        setData(parsed);
      } catch (err) {
        console.error('Error parsing SSE telemetery payload:', err);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
      setStatus('DISCONNECTED');
      
      // Exponential Backoff Reconnection logic
      const nextDelay = Math.min(delayRef.current * 2, 30000); // cap at 30 seconds max
      delayRef.current = nextDelay;
      console.warn(`SSE connection failed. Retrying in ${nextDelay}ms...`);
      
      reconnectTimeoutRef.current = window.setTimeout(() => {
        connect();
      }, nextDelay);
    };

    return eventSource;
  }, [url]);

  useEffect(() => {
    const sse = connect();

    return () => {
      sse.close();
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);

  return { data, status };
};
