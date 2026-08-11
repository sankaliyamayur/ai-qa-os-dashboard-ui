import React from 'react';
import { useModules } from '../../contexts/ModuleContext';
import { Filter, RotateCcw } from 'lucide-react';

export const ModuleFilters: React.FC = () => {
  const { filters, setFilters, resetFilters } = useModules();

  const handleChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-bg-card border border-bg-secondary rounded-lg p-md shadow-flat-sm space-y-sm">
      <div className="flex justify-between items-center pb-xs border-b border-bg-secondary">
        <span className="text-xs font-semibold text-text-main flex items-center space-x-sm">
          <Filter className="w-4 h-4 text-accent-primary" />
          <span>Execution Filters</span>
        </span>
        <button
          onClick={resetFilters}
          className="flex items-center space-x-xs text-xs text-accent-primary hover:text-accent-hover font-semibold transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-sm">
        {/* Status */}
        <div>
          <label className="block text-[10px] text-text-muted font-bold uppercase mb-xs">Status</label>
          <select
            value={filters.status}
            onChange={e => handleChange('status', e.target.value)}
            className="w-full px-sm py-xs bg-bg-secondary text-text-main border border-bg-secondary rounded focus:outline-hidden focus:ring-2 focus:ring-accent-primary text-xs"
          >
            <option value="ALL">All Statuses</option>
            <option value="Passed">Passed</option>
            <option value="Failed">Failed</option>
            <option value="Skipped">Skipped</option>
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-[10px] text-text-muted font-bold uppercase mb-xs">Priority</label>
          <select
            value={filters.priority}
            onChange={e => handleChange('priority', e.target.value)}
            className="w-full px-sm py-xs bg-bg-secondary text-text-main border border-bg-secondary rounded focus:outline-hidden focus:ring-2 focus:ring-accent-primary text-xs"
          >
            <option value="ALL">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Environment */}
        <div>
          <label className="block text-[10px] text-text-muted font-bold uppercase mb-xs">Environment</label>
          <select
            value={filters.environment}
            onChange={e => handleChange('environment', e.target.value)}
            className="w-full px-sm py-xs bg-bg-secondary text-text-main border border-bg-secondary rounded focus:outline-hidden focus:ring-2 focus:ring-accent-primary text-xs"
          >
            <option value="ALL">All Environments</option>
            <option value="Staging">Staging</option>
            <option value="Production">Production</option>
            <option value="Development">Development</option>
          </select>
        </div>

        {/* Browser */}
        <div>
          <label className="block text-[10px] text-text-muted font-bold uppercase mb-xs">Browser</label>
          <select
            value={filters.browser}
            onChange={e => handleChange('browser', e.target.value)}
            className="w-full px-sm py-xs bg-bg-secondary text-text-main border border-bg-secondary rounded focus:outline-hidden focus:ring-2 focus:ring-accent-primary text-xs"
          >
            <option value="ALL">All Browsers</option>
            <option value="Chrome">Chrome</option>
            <option value="Firefox">Firefox</option>
            <option value="Safari">Safari</option>
            <option value="Edge">Edge</option>
          </select>
        </div>

        {/* Tester */}
        <div>
          <label className="block text-[10px] text-text-muted font-bold uppercase mb-xs">Build / Pipeline</label>
          <select
            value={filters.buildNumber}
            onChange={e => handleChange('buildNumber', e.target.value)}
            className="w-full px-sm py-xs bg-bg-secondary text-text-main border border-bg-secondary rounded focus:outline-hidden focus:ring-2 focus:ring-accent-primary text-xs"
          >
            <option value="ALL">All Builds</option>
            <option value="Bld-2026.07.17-01">Bld-2026.07.17-01</option>
            <option value="Bld-2026.07.16-04">Bld-2026.07.16-04</option>
            <option value="Bld-2026.07.15-02">Bld-2026.07.15-02</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ModuleFilters;
