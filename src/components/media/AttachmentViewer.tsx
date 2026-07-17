import React from 'react';
import { FileText, Download, ShieldAlert, Radio, Terminal } from 'lucide-react';

interface AttachmentViewerProps {
  htmlReport?: string;
  traceFile?: string;
  networkLog?: string;
  consoleLog?: string;
}

export const AttachmentViewer: React.FC<AttachmentViewerProps> = ({
  htmlReport,
  traceFile,
  networkLog,
  consoleLog
}) => {
  const attachments = [
    {
      name: 'Playwright HTML Report',
      url: htmlReport,
      icon: <FileText className="w-5 h-5 text-accent-primary" />,
      description: 'Full HTML test runner execution dashboard page.'
    },
    {
      name: 'Playwright Trace Zip',
      url: traceFile,
      icon: <Radio className="w-5 h-5 text-purple-500" />,
      description: 'Import into Playwright Trace Viewer to replay execution stages.'
    },
    {
      name: 'Network Request Logs',
      url: networkLog ? '#network' : undefined,
      icon: <ShieldAlert className="w-5 h-5 text-amber-500" />,
      description: 'JSON network telemetry payloads exchanged during session.'
    },
    {
      name: 'Browser Console Logs',
      url: consoleLog ? '#console' : undefined,
      icon: <Terminal className="w-5 h-5 text-emerald-500" />,
      description: 'DevTools stdout console and pipeline warning telemetry.'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
      {attachments.map((att, idx) => {
        if (!att.url) return null;
        return (
          <div key={idx} className="flex justify-between items-center p-md bg-bg-card border border-bg-secondary rounded-lg hover:border-accent-primary/30 transition-all shadow-flat-sm">
            <div className="flex items-center space-x-md">
              <div className="p-sm bg-bg-secondary rounded-md">
                {att.icon}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-text-main">{att.name}</h4>
                <p className="text-xs text-text-muted">{att.description}</p>
              </div>
            </div>
            {att.url.startsWith('#') ? (
              <span className="text-xs text-accent-primary font-semibold uppercase bg-accent-primary/10 px-sm py-[2px] rounded">
                Embedded
              </span>
            ) : (
              <a
                href={att.url}
                target="_blank"
                rel="noreferrer"
                className="p-sm bg-bg-secondary hover:bg-accent-primary hover:text-white rounded-md text-text-muted transition-colors"
                title="Download Attachment"
              >
                <Download className="w-4 h-4" />
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AttachmentViewer;
