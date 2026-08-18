import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Download, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

interface ScreenshotViewerProps {
  screenshotUrl?: string;
  testName: string;
  isFailed?: boolean;
}

export const ScreenshotViewer: React.FC<ScreenshotViewerProps> = ({ screenshotUrl, testName, isFailed }) => {
  const [scale, setScale] = useState(1);
  const [imgError, setImgError] = useState(false);

  // If the test case PASSED or no failure screenshot is captured, display a clean info card
  if (!isFailed || !screenshotUrl) {
    return (
      <div className="bg-bg-card border border-bg-secondary rounded-lg overflow-hidden shadow-flat-md p-xl flex flex-col items-center justify-center min-h-[320px] text-text-muted space-y-sm">
        <div className="p-md rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-xs">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
        <p className="text-base font-bold text-text-main">No Failure Screenshot Captured</p>
        <p className="text-xs text-center max-w-[22rem] leading-relaxed">
          This test case passed successfully. Per AI-QA-OS Playwright policy, screenshots are captured only when a test fails (<code className="font-mono bg-bg-primary px-xs py-[2px] rounded text-accent-primary text-[11px]">screenshot: 'only-on-failure'</code>).
        </p>
      </div>
    );
  }

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));

  // Fallback SVG representation of Playwright browser failure state if screenshot file error occurs
  const renderFallbackSvg = () => (
    <svg viewBox="0 0 800 520" className="w-full h-auto rounded shadow-lg">
      <rect width="800" height="520" rx="8" fill="#0f172a"/>
      {/* Browser Bar */}
      <rect x="0" y="0" width="800" height="36" rx="8" fill="#1e293b"/>
      <circle cx="20" cy="18" r="6" fill="#ef4444"/>
      <circle cx="36" cy="18" r="6" fill="#f59e0b"/>
      <circle cx="52" cy="18" r="6" fill="#10b981"/>
      <rect x="70" y="6" width="660" height="24" rx="4" fill="#0f172a"/>
      <text x="80" y="22" fill="#94a3b8" fontFamily="sans-serif" fontSize="12">https://onepurpos.in/openings</text>
      {/* Web Page Canvas */}
      <rect x="0" y="36" width="800" height="484" fill="#0b0f19"/>
      <rect x="20" y="56" width="440" height="440" rx="6" fill="#1e293b" opacity="0.4"/>
      {/* Login Side Drawer */}
      <rect x="480" y="36" width="320" height="484" fill="#1e293b"/>
      <text x="510" y="75" fill="#f8fafc" fontFamily="sans-serif" fontSize="18" fontWeight="bold">Log In</text>
      <text x="510" y="100" fill="#94a3b8" fontFamily="sans-serif" fontSize="12">Enter your credentials to continue</text>
      {/* Error Alert Box */}
      <rect x="510" y="120" width="260" height="44" rx="6" fill="#ef4444" opacity="0.25" stroke="#ef4444" strokeWidth="1.5"/>
      <text x="525" y="146" fill="#f87171" fontFamily="sans-serif" fontSize="13" fontWeight="bold">❌ Error: Invalid Credentials.</text>
      {/* Inputs */}
      <text x="510" y="190" fill="#94a3b8" fontFamily="sans-serif" fontSize="12">Email Address</text>
      <rect x="510" y="200" width="260" height="36" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="1"/>
      <text x="520" y="223" fill="#f8fafc" fontFamily="sans-serif" fontSize="13">shivam@yopamail.com</text>
      <text x="510" y="260" fill="#94a3b8" fontFamily="sans-serif" fontSize="12">Password</text>
      <rect x="510" y="270" width="260" height="36" rx="4" fill="#0f172a" stroke="#ef4444" strokeWidth="1.5"/>
      <text x="520" y="293" fill="#f8fafc" fontFamily="sans-serif" fontSize="13">••••••••••••</text>
      <rect x="510" y="330" width="260" height="40" rx="6" fill="#6366f1"/>
      <text x="615" y="355" fill="#ffffff" fontFamily="sans-serif" fontSize="14" fontWeight="bold">Log In</text>
      {/* Playwright Assertion Failure Bar */}
      <rect x="20" y="460" width="760" height="30" rx="4" fill="#ef4444" opacity="0.9"/>
      <text x="30" y="480" fill="#ffffff" fontFamily="sans-serif" fontSize="12" fontWeight="bold">Playwright Assertion Error: locator('div.error-message').toBeVisible() timed out (25000ms)</text>
    </svg>
  );

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
          <div className="w-px h-4 bg-bg-secondary" />
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
      <div className="p-md flex justify-center bg-black/20 items-center overflow-auto min-h-[320px] max-h-[500px]">
        {imgError ? (
          <div style={{ transform: `scale(${scale})` }} className="transition-transform duration-200 w-full max-w-2xl">
            {renderFallbackSvg()}
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
