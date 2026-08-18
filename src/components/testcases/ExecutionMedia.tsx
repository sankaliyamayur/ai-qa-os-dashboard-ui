import React from 'react';
import { ScreenshotViewer } from '../media/ScreenshotViewer';
import { VideoPlayer } from '../media/VideoPlayer';

interface ExecutionMediaProps {
  screenshotUrl?: string;
  videoUrl?: string;
  testName: string;
  status?: string;
}

export const ExecutionMedia: React.FC<ExecutionMediaProps> = ({
  screenshotUrl,
  videoUrl,
  testName,
  status
}) => {
  const isFailed = status?.toLowerCase() === 'failed' || status?.toLowerCase() === 'error';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-md">
      <div>
        <ScreenshotViewer screenshotUrl={screenshotUrl} testName={testName} isFailed={isFailed} />
      </div>
      <div>
        <VideoPlayer videoUrl={videoUrl} testName={testName} isFailed={isFailed} />
      </div>
    </div>
  );
};

export default ExecutionMedia;
