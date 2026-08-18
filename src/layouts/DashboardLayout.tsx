import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, ListTodo, Activity, Settings, LogOut, ShieldAlert, Layers, ClipboardCheck, Users, Wrench, Trophy, Brain } from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { path: '/modules', label: 'Modules', icon: <Layers className="w-4 h-4" /> },
    { path: '/executions', label: 'Executions', icon: <ListTodo className="w-4 h-4" /> },
    { path: '/live', label: 'Live', icon: <Activity className="w-4 h-4" /> },
    { path: '/reviews', label: 'Review', icon: <ClipboardCheck className="w-4 h-4" /> },
    { path: '/healing', label: 'Healing', icon: <Wrench className="w-4 h-4" /> },
    { path: '/prompt-quality', label: 'Prompts', icon: <Trophy className="w-4 h-4" /> },
    { path: '/learning', label: 'Learning', icon: <Brain className="w-4 h-4" /> },
  ];

  if (user?.role === 'ADMIN' || user?.role === 'QA_MANAGER') {
    navItems.push({ path: '/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> });
  }
  if (user?.role === 'ADMIN') {
    navItems.push({ path: '/admin', label: 'Admin', icon: <Users className="w-4 h-4" /> });
  }

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-bg-card/80 border-b border-bg-secondary shadow-flat-sm">

        {/* Row 1: Logo + User info + Logout */}
        <div className="flex items-center justify-between px-lg py-sm">
          {/* Logo */}
          <div className="flex items-center space-x-xs flex-shrink-0">
            <ShieldAlert className="w-5 h-5 text-accent-primary animate-pulse" />
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-accent-primary to-accent-hover bg-clip-text text-transparent select-none">
              AI-QA-OS
            </span>
            <span className="ml-xs hidden sm:inline text-[10px] font-medium text-text-muted uppercase tracking-widest border border-bg-secondary rounded px-xs py-[2px]">
              Enterprise QA Platform
            </span>
          </div>

          {/* User info + Logout */}
          <div className="flex items-center space-x-sm">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-text-main leading-none">{user?.username}</p>
              <p className="text-[10px] text-text-muted uppercase tracking-wider mt-[2px]">{user?.role?.replace('_', ' ')}</p>
            </div>
            <div className="w-7 h-7 rounded-full bg-accent-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-accent-primary">
                {user?.username?.charAt(0).toUpperCase() ?? 'U'}
              </span>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-xs px-sm py-xs bg-bg-secondary/80 hover:bg-status-error/10 hover:text-status-error rounded-md text-xs font-medium transition-all border border-bg-secondary hover:border-status-error/30"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Row 2: Nav tab bar — horizontally scrollable, no overflow clipping */}
        <nav
          className="flex overflow-x-auto border-t border-bg-secondary/40 px-md"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-1.5 px-md py-sm text-xs font-medium whitespace-nowrap
                  border-b-2 transition-all duration-150 flex-shrink-0
                  ${isActive
                    ? 'border-accent-primary text-accent-primary bg-accent-primary/5'
                    : 'border-transparent text-text-muted hover:text-text-main hover:border-bg-secondary hover:bg-bg-secondary/30'
                  }
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </header>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-md md:p-lg">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
