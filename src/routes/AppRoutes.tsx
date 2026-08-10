import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { NotFoundPage } from '../pages/NotFoundPage';
import { MockPage } from '../pages/MockPage';
import { LoginPage } from '../pages/LoginPage';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleGuard } from './RoleGuard';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Skeleton } from '../components/common/Skeleton';

import { DashboardLayout } from '../layouts/DashboardLayout';

// Lazy loading the page modules for performance optimization and bundle chunking
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const ExecutionsPage = lazy(() => import('../pages/ExecutionsPage'));
const ExecutionDetailPage = lazy(() => import('../pages/ExecutionDetailPage'));
const AnalyticsPage = lazy(() => import('../pages/AnalyticsPage'));
const LiveMonitoringPage = lazy(() => import('../pages/LiveMonitoringPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const ModulesPage = lazy(() => import('../pages/ModulesPage'));
const ModuleDetailPage = lazy(() => import('../pages/ModuleDetailPage'));
const TestCaseDetailPage = lazy(() => import('../pages/TestCaseDetailPage'));
const HumanReviewPage = lazy(() => import('../pages/HumanReviewPage')); // AI-2
const AdminPage = lazy(() => import('../pages/AdminPage')); // ENT-4
const HealingDashboardPage = lazy(() => import('../pages/HealingDashboardPage')); // HEAL-3
const PromptQualityPage = lazy(() => import('../pages/PromptQualityPage')); // PE-3
const LearningPage = lazy(() => import('../pages/LearningPage')); // LRN-3
const CompliancePage = lazy(() => import('../pages/CompliancePage')); // GOV-2

const PageFallback: React.FC = () => (
  <div className="p-lg space-y-md">
    <Skeleton className="h-8 w-1/4 mb-md" />
    <div className="grid grid-cols-1 md:grid-cols-4 gap-md">
      <Skeleton className="h-28 w-full" />
      <Skeleton className="h-28 w-full" />
      <Skeleton className="h-28 w-full" />
      <Skeleton className="h-28 w-full" />
    </div>
    <Skeleton className="h-[300px] w-full mt-md" />
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Dashboard Shell Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/executions" element={<ExecutionsPage />} />
              <Route path="/executions/:executionId" element={<ExecutionDetailPage />} />
              <Route path="/compare" element={<MockPage title="Execution Comparison" />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/agent-traces" element={<MockPage title="Agent Trace Auditor" />} />
              <Route path="/live" element={<LiveMonitoringPage />} />
              <Route path="/reviews" element={<HumanReviewPage />} />{/* AI-2 */}
              <Route
                path="/admin"
                element={
                  <RoleGuard allowedRoles={['ADMIN']}>
                    <AdminPage />
                  </RoleGuard>
                }
              />{/* ENT-4 */}
              <Route path="/healing" element={<HealingDashboardPage />} />{/* HEAL-3 */}
              <Route path="/prompt-quality" element={<PromptQualityPage />} />{/* PE-3 */}
              <Route path="/learning" element={<LearningPage />} />{/* LRN-3 */}
              <Route path="/compliance" element={<CompliancePage />} />{/* GOV-2 */}
              <Route path="/modules" element={<ModulesPage />} />
              <Route path="/modules/:moduleId" element={<ModuleDetailPage />} />
              <Route path="/testcases/:testId" element={<TestCaseDetailPage />} />
              
              {/* Admin Restricted Settings */}
              <Route 
                path="/settings" 
                element={
                  <RoleGuard allowedRoles={['ADMIN', 'QA_MANAGER']}>
                    <SettingsPage />
                  </RoleGuard>
                } 
              />
            </Route>
          </Route>
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};
