import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TestCase } from '@/mock/testcases';
import { useModules } from '../../contexts/ModuleContext';
import { BrowserBadge } from './BrowserBadge';
import { StatusBadge } from './StatusBadge';
import { Eye, Search, AlertCircle } from 'lucide-react';

interface TestCaseTableProps {
  testCases: TestCase[];
}

export const TestCaseTable: React.FC<TestCaseTableProps> = ({ testCases }) => {
  const navigate = useNavigate();
  const { filters } = useModules();
  const [localSearch, setLocalSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Apply filters & search
  const filtered = testCases.filter(tc => {
    const matchesStatus = filters.status === 'ALL' || tc.status === filters.status;
    const matchesPriority = filters.priority === 'ALL' || tc.priority === filters.priority;
    const matchesBrowser = filters.browser === 'ALL' || tc.browser === filters.browser;
    const matchesEnvironment = filters.environment === 'ALL' || tc.environment === filters.environment;
    const matchesBuild = filters.buildNumber === 'ALL' || tc.build === filters.buildNumber;
    
    const query = localSearch.toLowerCase();
    const matchesSearch =
      tc.id.toLowerCase().includes(query) ||
      tc.name.toLowerCase().includes(query) ||
      (tc.feature && tc.feature.toLowerCase().includes(query));

    return matchesStatus && matchesPriority && matchesBrowser && matchesEnvironment && matchesBuild && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-md">
      {/* Search inside module */}
      <div className="relative w-full max-w-[24rem]">
        <Search className="absolute left-sm top-[10px] w-4 h-4 text-text-muted" />
        <input
          type="text"
          value={localSearch}
          onChange={e => {
            setLocalSearch(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search test cases..."
          className="w-full pl-[36px] pr-md py-xs bg-bg-secondary text-text-main rounded-md border border-bg-secondary focus:outline-hidden focus:ring-2 focus:ring-accent-primary text-xs shadow-flat-sm"
        />
      </div>

      <div className="bg-bg-card rounded-lg border border-bg-secondary shadow-flat-md overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-bg-secondary text-text-muted text-xs font-semibold uppercase border-b border-bg-secondary">
              <th className="py-sm px-md">Test Case ID</th>
              <th className="py-sm px-md">Test Name</th>
              <th className="py-sm px-md">Priority</th>
              <th className="py-sm px-md">Status</th>
              <th className="py-sm px-md">Browser</th>
              <th className="py-sm px-md">Duration</th>
              <th className="py-sm px-md">Build</th>
              <th className="py-sm px-md">Last Run</th>
              <th className="py-sm px-md text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-secondary text-xs">
            {paginated.map((tc) => (
              <tr key={tc.id} className="hover:bg-bg-secondary/30 transition-colors">
                <td className="py-sm px-md font-bold text-accent-primary">{tc.id}</td>
                <td className="py-sm px-md font-medium text-text-main">
                  <div>
                    <span>{tc.name}</span>
                    <span className="block text-[10px] text-text-muted mt-0.5">{tc.feature}</span>
                  </div>
                </td>
                <td className="py-sm px-md">
                  <span className={`font-semibold ${tc.priority === 'High' ? 'text-status-error' : tc.priority === 'Medium' ? 'text-status-warning' : 'text-text-muted'}`}>
                    {tc.priority}
                  </span>
                </td>
                <td className="py-sm px-md">
                  <StatusBadge status={tc.status} />
                </td>
                <td className="py-sm px-md">
                  <BrowserBadge browser={tc.browser} />
                </td>
                <td className="py-sm px-md text-text-main font-mono">{tc.duration}</td>
                <td className="py-sm px-md text-text-muted font-mono">{tc.build}</td>
                <td className="py-sm px-md text-text-muted">{tc.lastRun}</td>
                <td className="py-sm px-md text-right space-x-xs">
                  <button
                    onClick={() => navigate(`/testcases/${tc.id}`)}
                    className="inline-flex items-center space-x-xs px-2 py-1 bg-bg-secondary hover:bg-accent-primary hover:text-white rounded text-xs font-semibold text-text-main transition-colors"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View</span>
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="py-lg text-center text-text-muted">
                  <div className="flex flex-col items-center justify-center space-y-xs">
                    <AlertCircle className="w-6 h-6 text-text-muted" />
                    <span>No test cases match filter criteria.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-bg-card border border-bg-secondary rounded-lg px-md py-xs">
          <span className="text-xs text-text-muted">
            Showing Page {currentPage} of {totalPages} ({filtered.length} total tests)
          </span>
          <div className="flex space-x-xs">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-sm py-xs bg-bg-secondary hover:bg-bg-secondary/80 disabled:opacity-50 text-xs font-semibold rounded text-text-main transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-sm py-xs bg-bg-secondary hover:bg-bg-secondary/80 disabled:opacity-50 text-xs font-semibold rounded text-text-main transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestCaseTable;
