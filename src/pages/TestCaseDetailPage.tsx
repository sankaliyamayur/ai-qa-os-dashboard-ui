import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useModules } from '../contexts/ModuleContext';
import { TestCaseCard } from '../components/testcases/TestCaseCard';
import { FailureReason } from '../components/testcases/FailureReason';
import { ExecutionTimeline } from '../components/testcases/ExecutionTimeline';
import { ExecutionMedia } from '../components/testcases/ExecutionMedia';
import { ExecutionLogs } from '../components/testcases/ExecutionLogs';
import { ExecutionHistory } from '../components/testcases/ExecutionHistory';
import { AttachmentViewer } from '../components/media/AttachmentViewer';
import { ArrowLeft, Clock, Video, Terminal, Calendar, FileText } from 'lucide-react';

export const TestCaseDetailPage: React.FC = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { getTestCaseById, getHistoryForTestCase } = useModules();
  const [activeTab, setActiveTab] = useState<'timeline' | 'media' | 'logs' | 'history' | 'attachments'>('timeline');

  const tc = testId ? getTestCaseById(testId) : undefined;
  const historyItems = testId ? getHistoryForTestCase(testId) : [];

  if (!tc) {
    return (
      <div className="p-lg space-y-md text-center">
        <h2 className="text-xl font-bold text-text-main">Test Case Not Found</h2>
        <p className="text-sm text-text-muted">The requested test case cannot be retrieved from the mock database.</p>
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
          onClick={() => navigate(`/modules/${tc.moduleId}`)}
          className="p-sm bg-bg-secondary text-text-main rounded-md hover:bg-accent-primary hover:text-white transition-colors"
          title="Back to Module"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <span className="text-xs font-semibold text-text-muted">Test Case Details</span>
          <h1 className="text-2xl font-bold text-text-main">{tc.id}</h1>
        </div>
      </div>

      {/* Test Case Overview Card */}
      <TestCaseCard testCase={tc} />

      {/* Failure diagnostic banner if test is failed */}
      <FailureReason
        status={tc.status}
        failureReason={tc.failureReason}
        errorMessage={tc.errorMessage}
      />

      {/* Tabs list */}
      <div className="flex border-b border-bg-secondary space-x-md overflow-x-auto">
        {[
          { id: 'timeline', label: 'Timeline', icon: <Clock className="w-4 h-4" /> },
          { id: 'media', label: 'Media Playback', icon: <Video className="w-4 h-4" /> },
          { id: 'logs', label: 'Terminal Logs', icon: <Terminal className="w-4 h-4" /> },
          { id: 'history', label: 'History', icon: <Calendar className="w-4 h-4" /> },
          { id: 'attachments', label: 'Attachments', icon: <FileText className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-sm py-sm px-md text-sm font-semibold capitalize border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-accent-primary text-accent-primary'
                : 'border-transparent text-text-muted hover:text-text-main'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="space-y-md">
        {activeTab === 'timeline' && (
          <ExecutionTimeline steps={tc.steps} />
        )}

        {activeTab === 'media' && (
          <ExecutionMedia
            screenshotUrl={tc.screenshot}
            videoUrl={tc.videoUrl}
            testName={tc.name}
          />
        )}

        {activeTab === 'logs' && (
          <ExecutionLogs
            consoleLog={tc.consoleLog}
            stackTrace={tc.stackTrace}
          />
        )}

        {activeTab === 'history' && (
          <ExecutionHistory historyItems={historyItems} />
        )}

        {activeTab === 'attachments' && (
          <AttachmentViewer
            htmlReport={tc.htmlReport}
            traceFile={tc.traceFile}
            networkLog={tc.networkLog}
            consoleLog={tc.consoleLog}
          />
        )}
      </div>
    </div>
  );
};

export default TestCaseDetailPage;
