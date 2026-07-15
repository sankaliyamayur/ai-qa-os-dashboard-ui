import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ChartContainer } from './ChartContainer';

interface BarChartProps {
  title: string;
  data: Array<{ name: string; value: number }>;
  dataKey: string;
  color?: string;
  loading?: boolean;
}

export const BarChartCard: React.FC<BarChartProps> = ({
  title,
  data,
  dataKey,
  color = '#3b82f6',
  loading = false,
}) => {
  return (
    <ChartContainer title={title} loading={loading}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
          <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
