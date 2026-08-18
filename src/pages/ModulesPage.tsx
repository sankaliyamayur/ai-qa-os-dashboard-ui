import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModules } from '../contexts/ModuleContext';
import { ModuleStatistics } from '../components/modules/ModuleStatistics';
import { ModuleSearch } from '../components/modules/ModuleSearch';
import {
  Layers, ChevronRight, CheckCircle2, XCircle, AlertCircle,
  FileText, Users, Shield, Plus, BookOpen
} from 'lucide-react';

// ─── Role detection helper ─────────────────────────────────────────────────
// Determines which "role bucket" a module/story belongs to.
// Logic: module name or requirementPath containing "admin" → Admin bucket,
// otherwise → User bucket.
function getRoleBucket(module: any): 'Admin' | 'User' {
  const haystack = `${module.name} ${module.description} ${module.requirementPath ?? ''}`.toLowerCase();
  if (haystack.includes('admin')) return 'Admin';
  return 'User';
}

// ─── Section card ─────────────────────────────────────────────────────────
interface SectionCardProps {
  moduleId: string;
  sectionName: string;   // "feature" field value, e.g. "User Login"
  testCases: any[];
  storyPath?: string;
  onNavigate: (moduleId: string) => void;
}

const SectionCard: React.FC<SectionCardProps> = ({ moduleId, sectionName, testCases, storyPath, onNavigate }) => {
  const passed  = testCases.filter(tc => (tc.status ?? '').toLowerCase() === 'passed').length;
  const failed  = testCases.filter(tc => (tc.status ?? '').toLowerCase() === 'failed').length;
  const skipped = testCases.length - passed - failed;
  const passRate = testCases.length > 0 ? Math.round((passed / testCases.length) * 100) : 0;

  const passColor =
    passRate >= 95 ? 'text-status-success' :
    passRate >= 80 ? 'text-status-warning' :
    'text-status-error';

  const barColor =
    passRate >= 95 ? 'bg-status-success' :
    passRate >= 80 ? 'bg-status-warning' :
    'bg-status-error';

  return (
    <div
      onClick={() => onNavigate(moduleId)}
      className="group bg-bg-card border border-bg-secondary rounded-lg p-md hover:border-accent-primary hover:shadow-flat-md cursor-pointer transition-all duration-200"
    >
      {/* Section header */}
      <div className="flex items-start justify-between mb-sm">
        <div className="flex items-center gap-xs">
          <FileText className="w-3.5 h-3.5 text-accent-primary flex-shrink-0 mt-[1px]" />
          <span className="text-sm font-semibold text-text-main group-hover:text-accent-primary transition-colors line-clamp-1">
            {sectionName}
          </span>
        </div>
        <span className={`text-sm font-bold flex-shrink-0 ml-sm ${passColor}`}>
          {passRate}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-bg-secondary rounded-full mb-sm overflow-hidden">
        <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${passRate}%` }} />
      </div>

      {/* Stats */}
      <div className="flex items-center gap-md text-[11px]">
        <span className="flex items-center gap-xs text-text-muted">
          <CheckCircle2 className="w-3 h-3 text-status-success" />{passed} passed
        </span>
        <span className="flex items-center gap-xs text-text-muted">
          <XCircle className="w-3 h-3 text-status-error" />{failed} failed
        </span>
        {skipped > 0 && (
          <span className="flex items-center gap-xs text-text-muted">
            <AlertCircle className="w-3 h-3 text-status-warning" />{skipped} skipped
          </span>
        )}
      </div>

      {/* Story path */}
      {storyPath && (
        <p className="mt-sm text-[10px] text-text-muted truncate flex items-center gap-xs">
          <BookOpen className="w-3 h-3 flex-shrink-0" />
          {storyPath}
        </p>
      )}
    </div>
  );
};

// ─── Role group ───────────────────────────────────────────────────────────
interface RoleGroupProps {
  role: 'Admin' | 'User';
  modules: any[];
  testCases: any[];
  searchQuery: string;
  onNavigate: (moduleId: string) => void;
}

const ROLE_META = {
  Admin: {
    icon: <Shield className="w-5 h-5 text-amber-400" />,
    label: 'Admin',
    desc: 'Administrative role — user management, system configuration, access control',
    accent: 'border-amber-500/30 bg-amber-500/5',
    badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  },
  User: {
    icon: <Users className="w-5 h-5 text-blue-400" />,
    label: 'User',
    desc: 'Standard user role — authentication, profile, and core application features',
    accent: 'border-blue-500/30 bg-blue-500/5',
    badge: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  },
};

const RoleGroup: React.FC<RoleGroupProps> = ({ role, modules, testCases, searchQuery, onNavigate }) => {
  const meta = ROLE_META[role];
  const [expanded, setExpanded] = React.useState(true);

  // Group test cases by (moduleId + feature) to get sections
  const sections = useMemo(() => {
    const result: { moduleId: string; sectionName: string; storyPath?: string; tcs: any[] }[] = [];
    modules.forEach(mod => {
      const moduleTCs = testCases.filter(tc => tc.moduleId === mod.id);
      // Group by feature (= story section title)
      const byFeature: Record<string, any[]> = moduleTCs.reduce((acc: Record<string, any[]>, tc) => {
        const key = tc.feature || mod.name;
        if (!acc[key]) acc[key] = [];
        acc[key].push(tc);
        return acc;
      }, {});

      // If no test cases yet, show the module itself as one section
      if (Object.keys(byFeature).length === 0) {
        if (mod.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          result.push({ moduleId: mod.id, sectionName: mod.name, storyPath: mod.requirementPath, tcs: [] });
        }
      } else {
        Object.entries(byFeature).forEach(([feature, tcs]) => {
          if (
            feature.toLowerCase().includes(searchQuery.toLowerCase()) ||
            mod.name.toLowerCase().includes(searchQuery.toLowerCase())
          ) {
            result.push({ moduleId: mod.id, sectionName: feature, storyPath: mod.requirementPath, tcs });
          }
        });
      }
    });
    return result;
  }, [modules, testCases, searchQuery]);

  if (sections.length === 0) return null;

  const totalTCs   = sections.reduce((s, sec) => s + sec.tcs.length, 0);
  const totalPassed = sections.reduce((s, sec) => s + sec.tcs.filter(tc => (tc.status ?? '').toLowerCase() === 'passed').length, 0);

  return (
    <div className={`rounded-xl border ${meta.accent} p-lg`}>
      {/* Role header */}
      <button
        className="w-full flex items-center justify-between mb-md"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center gap-sm">
          {meta.icon}
          <div className="text-left">
            <div className="flex items-center gap-xs">
              <h2 className="text-base font-bold text-text-main">{meta.label} Module</h2>
              <span className={`text-[10px] font-semibold px-xs py-[2px] rounded ${meta.badge}`}>
                {sections.length} {sections.length === 1 ? 'section' : 'sections'}
              </span>
            </div>
            <p className="text-xs text-text-muted mt-[2px]">{meta.desc}</p>
          </div>
        </div>
        <div className="flex items-center gap-md flex-shrink-0">
          <span className="text-xs text-text-muted hidden sm:block">
            {totalPassed}/{totalTCs} tests passed
          </span>
          <ChevronRight className={`w-4 h-4 text-text-muted transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </div>
      </button>

      {/* Sections grid */}
      {expanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
          {sections.map((sec) => (
            <SectionCard
              key={`${sec.moduleId}-${sec.sectionName}`}
              moduleId={sec.moduleId}
              sectionName={sec.sectionName}
              testCases={sec.tcs}
              storyPath={sec.storyPath}
              onNavigate={onNavigate}
            />
          ))}

          {/* "Add new story" placeholder */}
          <div className="border-2 border-dashed border-bg-secondary rounded-lg p-md flex flex-col items-center justify-center gap-xs text-text-muted hover:border-accent-primary/50 hover:text-accent-primary transition-all cursor-default min-h-[100px]">
            <Plus className="w-5 h-5" />
            <span className="text-xs font-medium">Add new user story</span>
            <span className="text-[10px] text-center leading-tight">
              Place a .md file in<br />resources/user-stories/
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────
export const ModulesPage: React.FC = () => {
  const navigate = useNavigate();
  const { modules, testCases, filters } = useModules();
  const searchQuery = filters.searchQuery;

  // Separate modules into Admin / User buckets
  const adminModules = useMemo(() => modules.filter(m => getRoleBucket(m) === 'Admin'), [modules]);
  const userModules  = useMemo(() => modules.filter(m => getRoleBucket(m) === 'User'),  [modules]);

  const handleNavigate = (moduleId: string) => navigate(`/modules/${moduleId}`);

  return (
    <div className="space-y-lg p-lg">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-main flex items-center gap-sm">
            <Layers className="w-7 h-7 text-accent-primary" />
            Modules
          </h1>
          <p className="text-sm text-text-muted mt-xs">
            Role-based module hierarchy — each module groups related user story sections
          </p>
        </div>
      </div>

      {/* Summary stats */}
      <ModuleStatistics />

      {/* Search bar */}
      <div className="bg-bg-card p-md rounded-lg border border-bg-secondary shadow-flat-md">
        <ModuleSearch />
      </div>

      {/* Role groups */}
      <div className="space-y-lg">
        {modules.length === 0 ? (
          <div className="text-center py-2xl text-text-muted">
            <Layers className="w-10 h-10 mx-auto mb-md opacity-30" />
            <p className="font-medium">No modules yet</p>
            <p className="text-sm mt-xs">Run a workflow with a user story to auto-create the first module.</p>
          </div>
        ) : (
          <>
            <RoleGroup
              role="User"
              modules={userModules}
              testCases={testCases}
              searchQuery={searchQuery}
              onNavigate={handleNavigate}
            />
            <RoleGroup
              role="Admin"
              modules={adminModules}
              testCases={testCases}
              searchQuery={searchQuery}
              onNavigate={handleNavigate}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ModulesPage;
