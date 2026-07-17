import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useModules } from '../contexts/ModuleContext';
import { ModuleSummary } from '../components/modules/ModuleSummary';
import { ModuleFilters } from '../components/modules/ModuleFilters';
import { TestCaseTable } from '../components/testcases/TestCaseTable';
import { ArrowLeft } from 'lucide-react';

export const ModuleDetailPage: React.FC = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { getModuleById, getTestCasesByModule } = useModules();

  const moduleObj = moduleId ? getModuleById(moduleId) : undefined;
  const testCasesForModule = moduleId ? getTestCasesByModule(moduleId) : [];

  if (!moduleObj) {
    return (
      <div className="p-lg space-y-md text-center">
        <h2 className="text-xl font-bold text-text-main">Module Not Found</h2>
        <p className="text-sm text-text-muted">The specified application module does not exist or has been removed.</p>
        <button
          onClick={() => navigate('/modules')}
          className="px-md py-sm bg-accent-primary text-white font-semibold rounded hover:bg-accent-hover transition-all text-xs"
        >
          Back to Modules
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-lg p-lg">
      <div className="flex items-center space-x-md">
        <button
          onClick={() => navigate('/modules')}
          className="p-sm bg-bg-secondary text-text-main rounded-md hover:bg-accent-primary hover:text-white transition-colors"
          title="Back to Modules"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <span className="text-xs font-semibold text-text-muted">Module Details</span>
          <h1 className="text-2xl font-bold text-text-main">{moduleObj.name}</h1>
        </div>
      </div>

      {/* Module Summary */}
      <ModuleSummary module={moduleObj} />

      {/* Filter options */}
      <ModuleFilters />

      {/* TestCase Table */}
      <div className="space-y-sm">
        <h3 className="text-md font-bold text-text-main">Module Test Cases</h3>
        <TestCaseTable testCases={testCasesForModule} />
      </div>
    </div>
  );
};

export default ModuleDetailPage;
