import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, ListTodo, Activity, Settings, LogOut, ShieldAlert, Layers } from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { path: '/modules', label: 'Modules', icon: <Layers className="w-4 h-4" /> },
    { path: '/executions', label: 'Executions', icon: <ListTodo className="w-4 h-4" /> },
    { path: '/live', label: 'Live Monitoring', icon: <Activity className="w-4 h-4" /> },
  ];

  // Allow ADMIN and QA_MANAGER to see settings
  if (user?.role === 'ADMIN' || user?.role === 'QA_MANAGER') {
    navItems.push({ path: '/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> });
  }

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      {/* Premium Glassmorphic Top Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-bg-card/75 border-b border-bg-secondary px-lg py-sm flex items-center justify-between shadow-flat-sm">
        <div className="flex items-center space-x-md">
          <div className="flex items-center space-x-xs">
            <ShieldAlert className="w-6 h-6 text-accent-primary animate-pulse" />
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-accent-primary to-accent-hover bg-clip-text text-transparent">
              AI-QA-OS
            </span>
          </div>
          
          <nav className="hidden md:flex space-x-xs">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-xs px-md py-xs rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-accent-primary/10 text-accent-primary'
                      : 'text-text-muted hover:text-text-main hover:bg-bg-secondary/50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center space-x-md">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-text-main">{user?.username}</p>
            <p className="text-[10px] text-text-muted uppercase tracking-wider">{user?.role}</p>
          </div>
          
          <button
            onClick={logout}
            className="flex items-center space-x-xs px-sm py-xs bg-bg-secondary/80 hover:bg-status-error/10 hover:text-status-error rounded-md text-sm font-medium transition-all border border-bg-secondary hover:border-status-error/20"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-md md:p-lg">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
