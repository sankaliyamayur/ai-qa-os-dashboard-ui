import React from 'react';
import { ScreenshotViewer } from '../media/ScreenshotViewer';
import { VideoPlayer } from '../media/VideoPlayer';

interface ExecutionMediaProps {
  screenshotUrl?: string;
  videoUrl?: string;
  testName: string;
}

export const ExecutionMedia: React.FC<ExecutionMediaProps> = ({
  screenshotUrl,
  videoUrl,
  testName
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-md">
      <div>
        <ScreenshotViewer screenshotUrl={screenshotUrl} testName={testName} />
      </div>
      <div>
        <VideoPlayer videoUrl={videoUrl} testName={testName} />
      </div>
    </div>
  );
};

export default ExecutionMedia;
