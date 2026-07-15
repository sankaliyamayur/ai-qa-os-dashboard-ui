import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ChartContainer } from './ChartContainer';

interface AreaChartProps {
  title: string;
  data: Array<{ name: string; value: number }>;
  dataKey: string;
  color?: string;
  loading?: boolean;
}

export const AreaChartCard: React.FC<AreaChartProps> = ({
  title,
  data,
  dataKey,
  color = '#4f46e5',
  loading = false,
}) => {
  return (
    <ChartContainer title={title} loading={loading}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`color-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-bg-secondary)" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} 
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--color-bg-card)', 
              borderColor: 'var(--color-bg-secondary)',
              color: 'var(--color-text-main)' 
            }} 
          />
          <Area 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            strokeWidth={2}
            fillOpacity={1} 
            fill={`url(#color-${dataKey})`} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
