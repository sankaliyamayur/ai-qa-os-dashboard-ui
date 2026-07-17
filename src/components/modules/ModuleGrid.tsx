import React from 'react';
import { useModules } from '../../contexts/ModuleContext';
import { ModuleCard } from './ModuleCard';

export const ModuleGrid: React.FC = () => {
  const { modules, filters } = useModules();

  const filteredModules = modules.filter(m => {
    return m.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
           m.description.toLowerCase().includes(filters.searchQuery.toLowerCase());
  });

  return (
    <div>
      {filteredModules.length === 0 ? (
        <div className="text-center py-lg text-text-muted">
          No modules match your search query.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
          {filteredModules.map(m => (
            <ModuleCard key={m.id} module={m} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ModuleGrid;
