import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import apiClient from '../config/apiClient';
import { type Module } from '@/mock/modules';
import { type TestCase } from '@/mock/testcases';
import { MOCK_PIPELINE_EXECUTIONS, type PipelineExecution } from '@/mock/executions';
import { MOCK_HISTORY, type ExecutionHistoryItem } from '@/mock/history';


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
  loading: boolean;
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
  const [modules, setModules] = useState<Module[]>([]);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [modRes, tcRes] = await Promise.all([
          apiClient.get('/dashboard/modules'),
          apiClient.get('/dashboard/testcases')
        ]);
        setModules(modRes.data);
        setTestCases(tcRes.data);
      } catch (err) {
        console.error('Error fetching modules/testcases, falling back to mock data', err);
        // Fallback to mock data if backend isn't ready
        const { MOCK_MODULES } = await import('../mock/modules');
        const { MOCK_TEST_CASES } = await import('../mock/testcases');
        setModules(MOCK_MODULES);
        setTestCases(MOCK_TEST_CASES);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getModuleById = (id: string) => {
    return modules.find(m => m.id === id);
  };

  const getTestCaseById = (id: string) => {
    return testCases.find(tc => tc.id === id);
  };

  const getTestCasesByModule = (moduleId: string) => {
    return testCases.filter(tc => tc.moduleId === moduleId);
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
        modules,
        testCases,
        pipelineExecutions: MOCK_PIPELINE_EXECUTIONS,
        history: MOCK_HISTORY,
        filters,
        setFilters,
        getModuleById,
        getTestCaseById,
        getTestCasesByModule,
        getHistoryForTestCase,
        resetFilters,
        loading
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
