import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, type UserRole } from '../contexts/AuthContext';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<UserRole>('VIEWER');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      // Simulating token generation for authorization interceptors
      login(username, role, 'mock-jwt-token-' + Math.random().toString(36).substring(7));
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary p-md">
      <div className="w-full max-w-md bg-bg-card p-lg rounded-xl shadow-flat-lg border border-bg-secondary">
        <h2 className="text-2xl font-bold text-accent-primary mb-md text-center">AI-QA-OS Login</h2>
        <form onSubmit={handleLogin} className="space-y-md">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-xs">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-md py-sm bg-bg-secondary text-text-main rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-xs">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-md py-sm bg-bg-secondary text-text-main rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
            >
              <option value="VIEWER">Viewer</option>
              <option value="QA_ENGINEER">QA Engineer</option>
              <option value="QA_MANAGER">QA Manager</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-sm bg-accent-primary text-white rounded-md font-semibold hover:bg-accent-hover transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};
export default LoginPage;
