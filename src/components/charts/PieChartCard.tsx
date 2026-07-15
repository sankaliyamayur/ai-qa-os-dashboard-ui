import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { ChartContainer } from './ChartContainer';

interface PieChartProps {
  title: string;
  data: Array<{ name: string; value: number }>;
  colors?: string[];
  loading?: boolean;
}

const DEFAULT_COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

export const PieChartCard: React.FC<PieChartProps> = ({
  title,
  data,
  colors = DEFAULT_COLORS,
  loading = false,
}) => {
  return (
    <ChartContainer title={title} loading={loading}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--color-bg-card)', 
              borderColor: 'var(--color-bg-secondary)',
              color: 'var(--color-text-main)' 
            }} 
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            wrapperStyle={{ fontSize: 11, color: 'var(--color-text-main)' }} 
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
