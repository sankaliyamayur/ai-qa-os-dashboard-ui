import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { NotFoundPage } from '../pages/NotFoundPage';
import { MockPage } from '../pages/MockPage';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ExecutionsPage } from '../pages/ExecutionsPage';
import { ExecutionDetailPage } from '../pages/ExecutionDetailPage';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleGuard } from './RoleGuard';
import { ErrorBoundary } from '../components/ErrorBoundary';

export const AppRoutes: React.FC = () => {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Dashboard Shell Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/executions" element={<ExecutionsPage />} />
          <Route path="/executions/:executionId" element={<ExecutionDetailPage />} />
          <Route path="/compare" element={<MockPage title="Execution Comparison" />} />
          <Route path="/analytics" element={<MockPage title="Analytics & Charts" />} />
          <Route path="/agent-traces" element={<MockPage title="Agent Trace Auditor" />} />
          <Route path="/live" element={<MockPage title="Live Monitoring" />} />
          
          {/* Admin Restricted Settings */}
          <Route 
            path="/settings" 
            element={
              <RoleGuard allowedRoles={['ADMIN', 'QA_MANAGER']}>
                <MockPage title="System Settings" />
              </RoleGuard>
            } 
          />
        </Route>
        
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  );
};
