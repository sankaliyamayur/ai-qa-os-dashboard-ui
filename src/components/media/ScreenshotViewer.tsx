import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Download, Image as ImageIcon } from 'lucide-react';

interface ScreenshotViewerProps {
  screenshotUrl?: string;
  testName: string;
}

export const ScreenshotViewer: React.FC<ScreenshotViewerProps> = ({ screenshotUrl, testName }) => {
  const [scale, setScale] = useState(1);
  const [imgError, setImgError] = useState(false);

  if (!screenshotUrl) {
    return (
      <div className="flex flex-col items-center justify-center p-lg bg-bg-secondary rounded-lg border border-dashed border-bg-secondary text-text-muted space-y-xs">
        <ImageIcon className="w-10 h-10 mb-sm" />
        <p className="text-sm font-semibold">No screenshot available.</p>
        <p className="text-xs text-center max-w-xs">
          Screenshots are captured only when a test fails<br />
          (<code className="font-mono bg-bg-primary px-xs rounded">screenshot: 'only-on-failure'</code>).
        </p>
      </div>
    );
  }

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));

  return (
    <div className="bg-bg-card border border-bg-secondary rounded-lg overflow-hidden shadow-flat-md">
      <div className="flex justify-between items-center bg-bg-secondary px-md py-sm border-b border-bg-secondary">
        <span className="text-xs font-semibold text-text-main flex items-center space-x-sm">
          <ImageIcon className="w-4 h-4 text-accent-primary" />
          <span>Failure Screenshot - {testName}</span>
        </span>
        <div className="flex items-center space-x-xs">
          <button
            onClick={handleZoomOut}
            className="p-xs bg-bg-primary hover:bg-bg-secondary rounded transition-colors text-text-muted hover:text-text-main"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs text-text-muted font-mono">{Math.round(scale * 100)}%</span>
          <button
            onClick={handleZoomIn}
            className="p-xs bg-bg-primary hover:bg-bg-secondary rounded transition-colors text-text-muted hover:text-text-main"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-4 bg-bg-secondary" />
          <a
            href={screenshotUrl}
            download={`${testName.replace(/\s+/g, '_')}_screenshot.png`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-xs px-sm py-xs bg-accent-primary text-white rounded text-xs font-semibold hover:bg-accent-hover transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </a>
        </div>
      </div>
      <div className="p-md flex justify-center bg-black/10 items-center overflow-auto min-h-[300px] max-h-[500px]">
        {imgError ? (
          <div className="flex flex-col items-center text-text-muted space-y-xs">
            <ImageIcon className="w-8 h-8" />
            <p className="text-xs">Screenshot file could not be loaded.</p>
            <a href={screenshotUrl} target="_blank" rel="noreferrer" className="text-xs text-accent-primary underline">
              Open raw file
            </a>
          </div>
        ) : (
          <img
            src={screenshotUrl}
            alt={`Failure screenshot for ${testName}`}
            style={{ transform: `scale(${scale})` }}
            className="max-w-full h-auto rounded shadow-lg transition-transform duration-200 origin-center"
            onError={() => setImgError(true)}
          />
        )}
      </div>
    </div>
  );
};

export default ScreenshotViewer;
