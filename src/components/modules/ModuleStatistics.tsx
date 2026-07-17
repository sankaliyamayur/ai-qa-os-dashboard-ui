import React from 'react';
import { useModules } from '../../contexts/ModuleContext';
import { Layers, HelpCircle, Percent, Cpu } from 'lucide-react';
import { MetricCard } from '../cards/MetricCard';

export const ModuleStatistics: React.FC = () => {
  const { modules } = useModules();

  const totals = modules.reduce(
    (acc, m) => {
      acc.totalTests += m.totalTests;
      acc.passed += m.passed;
      acc.failed += m.failed;
      acc.skipped += m.skipped;
      return acc;
    },
    { totalTests: 0, passed: 0, failed: 0, skipped: 0 }
  );

  const avgPassRate = totals.totalTests > 0 
    ? Math.round((totals.passed * 100) / totals.totalTests)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
      <MetricCard
        title="Total Modules"
        value={modules.length.toString()}
        description="Active functional application modules"
        icon={<Layers className="w-5 h-5 text-accent-primary" />}
      />
      <MetricCard
        title="Total Test Cases"
        value={totals.totalTests.toString()}
        description={`P: ${totals.passed} | F: ${totals.failed} | S: ${totals.skipped}`}
        icon={<HelpCircle className="w-5 h-5 text-status-info" />}
      />
      <MetricCard
        title="Average Pass Rate"
        value={`${avgPassRate}%`}
        description="Across all functional suites"
        icon={<Percent className="w-5 h-5 text-status-success" />}
      />
      <MetricCard
        title="Pipeline Status"
        value="STABLE"
        description="Active builds passing"
        icon={<Cpu className="w-5 h-5 text-accent-hover" />}
      />
    </div>
  );
};

export default ModuleStatistics;
