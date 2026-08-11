import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, type UserRole } from '../contexts/AuthContext';
import apiClient from '../config/apiClient';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('VIEWER');
  const { login } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/auth/login', {
        username,
        password,
      });

      const token = response.data.accessToken;
      if (token) {
        login(username, role, token);
        navigate('/dashboard');
      } else {
        setError('No access token returned from backend.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err?.response?.status === 403 || err?.response?.status === 401) {
        setError('Invalid username or password.');
      } else if (err?.code === 'ECONNABORTED' || !err?.response) {
        setError('Cannot connect to backend. Please ensure the dashboard backend (port 8090) is running.');
      } else {
        setError(err?.response?.data?.message || err.message || 'Login failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary p-md">
      <div className="w-full max-w-[28rem] bg-bg-card p-lg rounded-xl shadow-flat-lg border border-bg-secondary">
        <h2 className="text-2xl font-bold text-accent-primary mb-md text-center">AI-QA-OS Login</h2>
        {error && (
          <div className="p-sm mb-md bg-red-100 text-red-700 text-xs rounded border border-red-200">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-md">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-xs">Username</label>
            <input
              id="login-username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-md py-sm bg-bg-secondary text-text-main rounded-md focus:outline-hidden focus:ring-2 focus:ring-accent-primary"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-xs">Password</label>
            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-md py-sm bg-bg-secondary text-text-main rounded-md focus:outline-hidden focus:ring-2 focus:ring-accent-primary"
              placeholder="Enter your password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-xs">Role</label>
            <select
              id="login-role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-md py-sm bg-bg-secondary text-text-main rounded-md focus:outline-hidden focus:ring-2 focus:ring-accent-primary"
            >
              <option value="VIEWER">Viewer</option>
              <option value="QA_ENGINEER">QA Engineer</option>
              <option value="QA_MANAGER">QA Manager</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className="w-full py-sm bg-accent-primary text-white rounded-md font-semibold hover:bg-accent-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <p className="mt-md text-center text-xs text-text-muted">
          Default credentials: <span className="font-mono text-accent-primary">admin / admin</span>
        </p>
      </div>
    </div>
  );
};
export default LoginPage;
