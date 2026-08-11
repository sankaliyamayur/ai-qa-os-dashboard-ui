import React, { useState } from 'react';
import { Video, Download } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl?: string;
  testName: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, testName }) => {
  const [videoError, setVideoError] = useState(false);

  if (!videoUrl) {
    return (
      <div className="flex flex-col items-center justify-center p-lg bg-bg-secondary rounded-lg border border-dashed border-bg-secondary text-text-muted space-y-xs">
        <Video className="w-10 h-10 mb-sm" />
        <p className="text-sm font-semibold">No execution video available.</p>
        <p className="text-xs text-center max-w-[20rem]">
          Videos are recorded during Playwright execution and retained only on failure<br />
          (<code className="font-mono bg-bg-primary px-xs rounded">video: 'retain-on-failure'</code>).
        </p>
      </div>
    );
  }

  return (
    <div className="bg-bg-card border border-bg-secondary rounded-lg overflow-hidden shadow-flat-md">
      <div className="flex justify-between items-center bg-bg-secondary px-md py-sm border-b border-bg-secondary">
        <span className="text-xs font-semibold text-text-main flex items-center space-x-sm">
          <Video className="w-4 h-4 text-accent-primary" />
          <span>Execution Video - {testName}</span>
        </span>
        <a
          href={videoUrl}
          download={`${testName.replace(/\s+/g, '_')}_execution.mp4`}
          className="flex items-center space-x-xs px-sm py-xs bg-accent-primary text-white rounded text-xs font-semibold hover:bg-accent-hover transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Video</span>
        </a>
      </div>
      <div className="bg-black p-xs flex justify-center items-center">
        {videoError ? (
          <div className="flex flex-col items-center text-text-muted space-y-xs py-md">
            <Video className="w-8 h-8" />
            <p className="text-xs">Video file could not be loaded.</p>
            <a href={videoUrl} target="_blank" rel="noreferrer" className="text-xs text-accent-primary underline">
              Download video file
            </a>
          </div>
        ) : (
          <video
            controls
            className="w-full max-h-[450px] rounded"
            src={videoUrl}
            onError={() => setVideoError(true)}
          >
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
