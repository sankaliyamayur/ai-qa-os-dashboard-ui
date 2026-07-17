import React from 'react';
import { ModuleStatistics } from '../components/modules/ModuleStatistics';
import { ModuleSearch } from '../components/modules/ModuleSearch';
import { ModuleGrid } from '../components/modules/ModuleGrid';

export const ModulesPage: React.FC = () => {
  return (
    <div className="space-y-lg p-lg">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-text-main">Modules Management</h1>
          <p className="text-sm text-text-muted mt-xs">Module-wise test coverage and execution statistics</p>
        </div>
      </div>

      {/* Module statistics */}
      <ModuleStatistics />

      {/* Search area */}
      <div className="flex justify-between items-center bg-bg-card p-md rounded-lg border border-bg-secondary shadow-flat-md">
        <ModuleSearch />
      </div>

      {/* Grid listing */}
      <ModuleGrid />
    </div>
  );
};

export default ModulesPage;
