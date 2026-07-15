import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { NotFoundPage } from '../pages/NotFoundPage';
import { MockPage } from '../pages/MockPage';
import { ErrorBoundary } from '../components/ErrorBoundary';

export const AppRoutes: React.FC = () => {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Protected Dashboard Shell Routes */}
        <Route path="/dashboard" element={<MockPage title="Dashboard Overview" />} />
        <Route path="/executions" element={<MockPage title="Workflow Execution History" />} />
        <Route path="/executions/:executionId" element={<MockPage title="Execution Details" />} />
        <Route path="/compare" element={<MockPage title="Execution Comparison" />} />
        <Route path="/analytics" element={<MockPage title="Analytics & Charts" />} />
        <Route path="/agent-traces" element={<MockPage title="Agent Trace Auditor" />} />
        <Route path="/live" element={<MockPage title="Live Monitoring" />} />
        <Route path="/settings" element={<MockPage title="System Settings" />} />
        <Route path="/login" element={<MockPage title="Authentication Portal" />} />
        
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  );
};
