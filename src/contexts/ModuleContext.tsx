import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { MOCK_MODULES, type Module } from '../mock/modules';
import { MOCK_TEST_CASES, type TestCase } from '../mock/testcases';
import { MOCK_PIPELINE_EXECUTIONS, type PipelineExecution } from '../mock/executions';
import { MOCK_HISTORY, type ExecutionHistoryItem } from '../mock/history';

export interface FilterState {
  moduleId: string;
  status: string;
  priority: string;
  environment: string;
  browser: string;
  tester: string;
  buildNumber: string;
  searchQuery: string;
}

interface ModuleContextType {
  modules: Module[];
  testCases: TestCase[];
  pipelineExecutions: PipelineExecution[];
  history: ExecutionHistoryItem[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  getModuleById: (id: string) => Module | undefined;
  getTestCaseById: (id: string) => TestCase | undefined;
  getTestCasesByModule: (moduleId: string) => TestCase[];
  getHistoryForTestCase: (testCaseId: string) => ExecutionHistoryItem[];
  resetFilters: () => void;
}

const initialFilters: FilterState = {
  moduleId: 'ALL',
  status: 'ALL',
  priority: 'ALL',
  environment: 'ALL',
  browser: 'ALL',
  tester: 'ALL',
  buildNumber: 'ALL',
  searchQuery: ''
};

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

export const ModuleProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const getModuleById = (id: string) => {
    return MOCK_MODULES.find(m => m.id === id);
  };

  const getTestCaseById = (id: string) => {
    return MOCK_TEST_CASES.find(tc => tc.id === id);
  };

  const getTestCasesByModule = (moduleId: string) => {
    return MOCK_TEST_CASES.filter(tc => tc.moduleId === moduleId);
  };

  const getHistoryForTestCase = (testCaseId: string) => {
    return MOCK_HISTORY.filter(h => h.testCaseId === testCaseId);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <ModuleContext.Provider
      value={{
        modules: MOCK_MODULES,
        testCases: MOCK_TEST_CASES,
        pipelineExecutions: MOCK_PIPELINE_EXECUTIONS,
        history: MOCK_HISTORY,
        filters,
        setFilters,
        getModuleById,
        getTestCaseById,
        getTestCasesByModule,
        getHistoryForTestCase,
        resetFilters
      }}
    >
      {children}
    </ModuleContext.Provider>
  );
};

export const useModules = () => {
  const context = useContext(ModuleContext);
  if (!context) {
    throw new Error('useModules must be used within a ModuleProvider');
  }
  return context;
};
