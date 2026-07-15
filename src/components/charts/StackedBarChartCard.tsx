import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChartContainer } from './ChartContainer';

interface StackedBarProps {
  title: string;
  data: Array<{ name: string; passes: number; failures: number }>;
  loading?: boolean;
}

export const StackedBarChartCard: React.FC<StackedBarProps> = ({
  title,
  data,
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
          <Legend 
            verticalAlign="top" 
            height={36} 
            iconType="circle"
            wrapperStyle={{ fontSize: 11 }} 
          />
          <Bar dataKey="passes" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
          <Bar dataKey="failures" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
