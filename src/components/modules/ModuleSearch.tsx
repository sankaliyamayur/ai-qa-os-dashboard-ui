import React from 'react';
import { useModules } from '../../contexts/ModuleContext';
import { Search } from 'lucide-react';

export const ModuleSearch: React.FC = () => {
  const { filters, setFilters } = useModules();

  return (
    <div className="relative w-full max-w-[28rem]">
      <Search className="absolute left-md top-[13px] w-4 h-4 text-text-muted" />
      <input
        type="text"
        value={filters.searchQuery}
        onChange={e => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
        placeholder="Search Module by ID, Name, or description..."
        className="w-full pl-[40px] pr-md py-sm bg-bg-secondary text-text-main rounded-md border border-bg-secondary focus:outline-hidden focus:ring-2 focus:ring-accent-primary text-sm shadow-flat-sm"
      />
    </div>
  );
};

export default ModuleSearch;
