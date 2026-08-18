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

        // Normalize test cases first
        const tcList = Array.isArray(tcRes?.data) ? tcRes.data : [];
        const normalizedTCs = tcList.map((tc: any) => ({
          ...tc,
          moduleId: tc?.moduleId ?? tc?.module_id,
          feature: tc?.feature ?? 'General',
          status: tc?.status ?? 'Unknown',
        }));

        // Normalize backend module fields & compute exact statistics from test cases
        const modList = Array.isArray(modRes?.data) ? modRes.data : [];
        const normalizedModules = modList.map((m: any) => {
          const modTCs = normalizedTCs.filter((tc: any) => tc.moduleId === m?.id);
          const hasTCs = modTCs.length > 0;
          
          const passedCount = hasTCs 
            ? modTCs.filter((tc: any) => (tc.status ?? '').toLowerCase() === 'passed').length 
            : Math.round(((m?.passRate ?? m?.pass_rate ?? 0) / 100) * (m?.totalTestCases ?? m?.total_test_cases ?? 0));
            
          const failedCount = hasTCs 
            ? modTCs.filter((tc: any) => (tc.status ?? '').toLowerCase() === 'failed').length 
            : Math.round(((100 - (m?.passRate ?? m?.pass_rate ?? 0)) / 100) * (m?.totalTestCases ?? m?.total_test_cases ?? 0));
            
          const skippedCount = hasTCs 
            ? modTCs.filter((tc: any) => {
                const st = (tc.status ?? '').toLowerCase();
                return st !== 'passed' && st !== 'failed';
              }).length 
            : 0;

          const totalCount = hasTCs ? modTCs.length : (m?.totalTestCases ?? m?.total_test_cases ?? 0);
          const computedPassRate = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : (m?.passRate ?? m?.pass_rate ?? 0);

          return {
            id: m?.id ?? 'unknown',
            name: m?.name ?? 'Unnamed Module',
            description: m?.description ?? '',
            requirementPath: m?.requirementPath ?? m?.requirement_path,
            totalTests: totalCount,
            passRate: computedPassRate,
            passed: passedCount,
            failed: failedCount,
            skipped: skippedCount,
            lastExecution: m?.lastRun ?? m?.last_run ?? '',
            tenantId: m?.tenantId ?? m?.tenant_id,
          };
        });

        setTestCases(normalizedTCs);
        setModules(normalizedModules);
      } catch (err) {
        console.error('Error fetching modules/testcases live data', err);
        setModules([]);
        setTestCases([]);
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
