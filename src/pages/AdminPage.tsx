import { useEffect, useState } from 'react';
import { getRbacSummary, type RbacAdminSummary } from '../services/adminService';
import { MetricCard } from '../components/cards/MetricCard';

/**
 * ENT-4 — User & Access Management (read-only RBAC admin surface).
 * Consumes the secret-free RbacAdminSummary read-model (FI-ENT4-B endpoint). Mutating operations
 * (create/disable user, assign role) are a later slice (FI-ENT4-A) behind a write API + authz.
 */
export default function AdminPage() {
  const [summary, setSummary] = useState<RbacAdminSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      setSummary(await getRbacSummary());
    } catch {
      setError(true);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-lg space-y-md">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-main">User &amp; Access Management</h1>
          <p className="text-xs text-text-muted mt-xs">
            ENT-4 · read-only RBAC admin surface. Write operations arrive in a later slice.
          </p>
        </div>
        <button
          onClick={load}
          className="px-md py-sm rounded-md bg-bg-card text-text-muted hover:text-text-main"
        >
          Refresh
        </button>
      </div>

      {loading && <p className="text-text-muted">Loading…</p>}
      {error && (
        <p className="text-status-error">
          Could not load the admin summary — you may need ADMIN access, or the backend is unavailable.
        </p>
      )}

      {summary && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-md">
            <MetricCard title="Users" value={summary.userCount} />
            <MetricCard title="Disabled" value={summary.disabledUserCount} />
            <MetricCard title="Locked" value={summary.lockedUserCount} />
            <MetricCard title="MFA enabled" value={summary.mfaEnabledCount} />
            <MetricCard title="Roles" value={summary.roleCount} />
            <MetricCard title="Permissions" value={summary.permissionCount} />
          </div>

          <div className="bg-bg-card border border-bg-secondary rounded-lg shadow-flat-md overflow-hidden">
            <div className="px-md py-sm border-b border-bg-secondary">
              <h2 className="text-sm font-semibold text-text-main">Users ({summary.users.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-text-muted uppercase tracking-wider">
                    <th className="px-md py-sm font-semibold">Username</th>
                    <th className="px-md py-sm font-semibold">Email</th>
                    <th className="px-md py-sm font-semibold">Status</th>
                    <th className="px-md py-sm font-semibold">MFA</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.users.map((u) => (
                    <tr key={u.username} className="border-t border-bg-secondary">
                      <td className="px-md py-sm text-text-main font-medium">{u.username}</td>
                      <td className="px-md py-sm text-text-muted">{u.email}</td>
                      <td className="px-md py-sm">
                        <StatusBadge enabled={u.enabled} locked={u.accountLocked} />
                      </td>
                      <td className="px-md py-sm text-text-muted">{u.mfaEnabled ? 'On' : 'Off'}</td>
                    </tr>
                  ))}
                  {summary.users.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-md py-md text-center text-text-muted">
                        No users.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {summary.roleNames.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-text-main mb-sm">Roles</h2>
              <div className="flex flex-wrap gap-xs">
                {summary.roleNames.map((r) => (
                  <span
                    key={r}
                    className="px-sm py-xs rounded-md bg-bg-secondary text-xs text-text-muted"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatusBadge({ enabled, locked }: { enabled: boolean; locked: boolean }) {
  if (locked) {
    return (
      <span className="px-sm py-xs rounded-md text-xs bg-status-error/10 text-status-error">Locked</span>
    );
  }
  if (!enabled) {
    return (
      <span className="px-sm py-xs rounded-md text-xs bg-bg-secondary text-text-muted">Disabled</span>
    );
  }
  return (
    <span className="px-sm py-xs rounded-md text-xs bg-status-success/10 text-status-success">Active</span>
  );
}
