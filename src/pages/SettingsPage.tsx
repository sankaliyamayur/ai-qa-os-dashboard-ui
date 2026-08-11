import React, { useState } from 'react';
import { Save, Plus, Trash2, Key, Server } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [apiKey, setApiKey] = useState('gsk_yA98sD...21j8Fh');
  const [environments, setEnvironments] = useState(['Development', 'Staging', 'Production']);
  const [newEnv, setNewEnv] = useState('');

  const handleAddEnv = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEnv.trim() && !environments.includes(newEnv.trim())) {
      setEnvironments([...environments, newEnv.trim()]);
      setNewEnv('');
    }
  };

  const handleRemoveEnv = (env: string) => {
    setEnvironments(environments.filter((e) => e !== env));
  };

  return (
    <div className="space-y-lg p-lg max-w-4xl">
      <div className="flex justify-between items-center border-b border-bg-secondary pb-sm">
        <div>
          <h1 className="text-3xl font-bold text-text-main">System Settings</h1>
          <p className="text-sm text-text-muted">Manage global project options, keys, and theme</p>
        </div>
      </div>

      {/* Theme Toggling Pane */}
      <div className="bg-bg-card p-md border border-bg-secondary rounded-lg shadow-flat-md space-y-xs">
        <h3 className="text-sm font-bold text-text-main uppercase tracking-wider">Appearance</h3>
        <div className="flex justify-between items-center py-xs text-sm">
          <span>Active Interface Theme</span>
          <button
            onClick={toggleTheme}
            className="px-md py-sm bg-accent-primary text-white rounded-md text-xs font-semibold hover:bg-accent-hover transition-colors capitalize"
          >
            Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode
          </button>
        </div>
      </div>

      {/* LLM Key Integration Form */}
      <div className="bg-bg-card p-md border border-bg-secondary rounded-lg shadow-flat-md space-y-md">
        <div className="flex items-center space-x-sm border-b border-bg-secondary pb-xs">
          <Key className="w-5 h-5 text-accent-primary" />
          <h3 className="text-sm font-bold text-text-main uppercase tracking-wider">LLM Provider Keys</h3>
        </div>
        <div className="space-y-sm text-sm">
          <div>
            <label className="block text-xs text-text-muted mb-xs">Gemini AI Provider Key</label>
            <div className="flex space-x-sm">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1 px-md py-sm bg-bg-secondary text-text-main rounded-md focus:outline-hidden focus:ring-2 focus:ring-accent-primary"
              />
              <button className="flex items-center px-md py-sm bg-status-success text-white rounded-md font-semibold hover:opacity-95 text-xs transition-opacity">
                <Save className="w-4 h-4 mr-xs" /> Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Environment List Config */}
      <div className="bg-bg-card p-md border border-bg-secondary rounded-lg shadow-flat-md space-y-md">
        <div className="flex items-center space-x-sm border-b border-bg-secondary pb-xs">
          <Server className="w-5 h-5 text-accent-primary" />
          <h3 className="text-sm font-bold text-text-main uppercase tracking-wider">Environments Setup</h3>
        </div>
        <div className="space-y-md text-sm">
          <form onSubmit={handleAddEnv} className="flex space-x-sm">
            <input
              type="text"
              required
              value={newEnv}
              onChange={(e) => setNewEnv(e.target.value)}
              placeholder="Add new environment (e.g. Preprod)"
              className="flex-1 px-md py-sm bg-bg-secondary text-text-main rounded-md focus:outline-hidden focus:ring-2 focus:ring-accent-primary text-xs"
            />
            <button
              type="submit"
              className="flex items-center px-md py-sm bg-accent-primary text-white rounded-md font-semibold hover:bg-accent-hover text-xs transition-colors"
            >
              <Plus className="w-4 h-4 mr-xs" /> Add
            </button>
          </form>
          <div className="divide-y divide-bg-secondary">
            {environments.map((env) => (
              <div key={env} className="flex justify-between items-center py-sm">
                <span>{env}</span>
                <button
                  onClick={() => handleRemoveEnv(env)}
                  className="p-xs text-text-muted hover:text-status-error transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;
