import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Module } from '@/mock/modules';
import { CheckCircle2, XCircle, AlertCircle, PlayCircle, Calendar } from 'lucide-react';

interface ModuleCardProps {
  module: Module;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ module }) => {
  const navigate = useNavigate();

  const getPassRateColor = (rate: number) => {
    if (rate >= 95) return 'text-status-success';
    if (rate >= 85) return 'text-status-warning';
    return 'text-status-error';
  };

  return (
    <div
      onClick={() => navigate(`/modules/${module.id}`)}
      className="bg-bg-card border border-bg-secondary rounded-lg p-lg hover:border-accent-primary hover:shadow-flat-md cursor-pointer transition-all duration-standard flex flex-col justify-between h-full"
    >
      <div>
        <div className="flex justify-between items-start mb-md">
          <div>
            <h3 className="text-md font-bold text-text-main group-hover:text-accent-primary transition-colors">
              {module.name}
            </h3>
            <p className="text-xs text-text-muted mt-xs line-clamp-2">
              {module.description}
            </p>
          </div>
          <span className={`text-lg font-bold ${getPassRateColor(module.passRate)}`}>
            {module.passRate}%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-sm mb-lg">
          <div className="flex items-center space-x-xs text-xs">
            <PlayCircle className="w-3.5 h-3.5 text-text-muted" />
            <span className="text-text-muted">Total:</span>
            <span className="font-bold text-text-main">{module.totalTests}</span>
          </div>
          <div className="flex items-center space-x-xs text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-status-success" />
            <span className="text-text-muted">Passed:</span>
            <span className="font-bold text-status-success">{module.passed}</span>
          </div>
          <div className="flex items-center space-x-xs text-xs">
            <XCircle className="w-3.5 h-3.5 text-status-error" />
            <span className="text-text-muted">Failed:</span>
            <span className="font-bold text-status-error">{module.failed}</span>
          </div>
          <div className="flex items-center space-x-xs text-xs">
            <AlertCircle className="w-3.5 h-3.5 text-status-warning" />
            <span className="text-text-muted">Skipped:</span>
            <span className="font-bold text-status-warning">{module.skipped}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-xs border-t border-bg-secondary pt-sm mt-auto text-[10px] text-text-muted">
        <Calendar className="w-3 h-3" />
        <span>Last Run: {module.lastExecution}</span>
      </div>
    </div>
  );
};

export default ModuleCard;
