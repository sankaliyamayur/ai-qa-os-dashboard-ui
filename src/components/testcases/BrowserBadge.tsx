import React from 'react';
import { Globe, Flame, Compass, Monitor } from 'lucide-react';

interface BrowserBadgeProps {
  browser: 'Chrome' | 'Firefox' | 'Safari' | 'Edge' | string;
}

export const BrowserBadge: React.FC<BrowserBadgeProps> = ({ browser }) => {
  const getIcon = () => {
    switch (browser) {
      case 'Chrome':
        return <Globe className="w-3.5 h-3.5" />;
      case 'Firefox':
        return <Flame className="w-3.5 h-3.5" />;
      case 'Safari':
        return <Compass className="w-3.5 h-3.5" />;
      default:
        return <Monitor className="w-3.5 h-3.5" />;
    }
  };

  const getStyle = () => {
    switch (browser) {
      case 'Chrome':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Firefox':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'Safari':
        return 'bg-teal-500/10 text-teal-500 border-teal-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-xs font-semibold border ${getStyle()}`}>
      {getIcon()}
      <span>{browser}</span>
    </span>
  );
};

export default BrowserBadge;
