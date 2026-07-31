import { useEffect, useState } from 'react';
import {
  getRbacSummary,
  createUser,
  setUserEnabled,
  setUserRoles,
  type RbacAdminSummary,
  type AdminUserView,
} from '../services/adminService';
import { MetricCard } from '../components/cards/MetricCard';

/**
 * ENT-4 — User & Access Management.
 * Reads the secret-free RbacAdminSummary (FI-ENT4-B) and drives the admin write-ops (FI-ENT4-A):
 * create user, enable/disable, and assign roles. Writes hit the ADMIN-gated /api/admin/** API; the
 * server enforces hasRole('ADMIN') and the self-lockout / self-demotion guards, so the UI stays thin.
 */
export default function AdminPage() {
  const [summary, setSummary] = useState<RbacAdminSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

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

  // Runs a write, then refreshes the summary so the table reflects the authoritative server state.
  const run = async (op: () => Promise<void>) => {
    setBusy(true);
    setActionError(null);
    try {
      await op();
      await load();
    } catch (e) {
      setActionError(extractMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-lg space-y-md">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-main">User &amp; Access Management</h1>
          <p className="text-xs text-text-muted mt-xs">
            ENT-4 · RBAC admin surface. Write operations require ADMIN.
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
      {actionError && <p className="text-status-error">{actionError}</p>}

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

          <CreateUserForm
            roleNames={summary.roleNames}
            busy={busy}
            onCreate={(req) => run(() => createUser(req))}
          />

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
                    <th className="px-md py-sm font-semibold">Roles</th>
                    <th className="px-md py-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.users.map((u) => (
                    <UserRow
                      key={u.id}
                      user={u}
                      roleNames={summary.roleNames}
                      busy={busy}
                      onToggleEnabled={() => run(() => setUserEnabled(u.id, !u.enabled))}
                      onSaveRoles={(roles) => run(() => setUserRoles(u.id, roles))}
                    />
                  ))}
                  {summary.users.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-md py-md text-center text-text-muted">
                        No users.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function CreateUserForm({
  roleNames,
  busy,
  onCreate,
}: {
  roleNames: string[];
  busy: boolean;
  onCreate: (req: { username: string; email: string; password: string; roles: string[] }) => void;
}) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roles, setRoles] = useState<string[]>([]);

  const canSubmit = username.trim() && email.trim() && password.trim() && !busy;

  const submit = () => {
    if (!canSubmit) return;
    onCreate({ username: username.trim(), email: email.trim(), password, roles });
    setUsername('');
    setEmail('');
    setPassword('');
    setRoles([]);
  };

  return (
    <div className="bg-bg-card border border-bg-secondary rounded-lg shadow-flat-md p-md space-y-sm">
      <h2 className="text-sm font-semibold text-text-main">Create user</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-sm">
        <input
          className="px-sm py-sm rounded-md bg-bg-secondary text-text-main text-sm"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="px-sm py-sm rounded-md bg-bg-secondary text-text-main text-sm"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="px-sm py-sm rounded-md bg-bg-secondary text-text-main text-sm"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <RoleChips roleNames={roleNames} selected={roles} onToggle={(r) => setRoles(toggle(roles, r))} />
      <div className="flex justify-end">
        <button
          onClick={submit}
          disabled={!canSubmit}
          className="px-md py-sm rounded-md bg-accent-primary hover:bg-accent-hover text-white text-sm disabled:opacity-40"
        >
          Create
        </button>
      </div>
    </div>
  );
}

function UserRow({
  user,
  roleNames,
  busy,
  onToggleEnabled,
  onSaveRoles,
}: {
  user: AdminUserView;
  roleNames: string[];
  busy: boolean;
  onToggleEnabled: () => void;
  onSaveRoles: (roles: string[]) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<string[]>(user.roles);

  const startEditing = () => {
    setDraft(user.roles);
    setEditing(true);
  };
  const save = () => {
    onSaveRoles(draft);
    setEditing(false);
  };

  return (
    <tr className="border-t border-bg-secondary align-top">
      <td className="px-md py-sm text-text-main font-medium">{user.username}</td>
      <td className="px-md py-sm text-text-muted">{user.email}</td>
      <td className="px-md py-sm">
        <StatusBadge enabled={user.enabled} locked={user.accountLocked} />
      </td>
      <td className="px-md py-sm">
        {editing ? (
          <div className="space-y-sm">
            <RoleChips
              roleNames={roleNames}
              selected={draft}
              onToggle={(r) => setDraft(toggle(draft, r))}
            />
            <div className="flex gap-xs">
              <button
                onClick={save}
                disabled={busy}
                className="px-sm py-xs rounded-md bg-accent-primary hover:bg-accent-hover text-white text-xs disabled:opacity-40"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-sm py-xs rounded-md bg-bg-secondary text-text-muted text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-xs">
            {user.roles.length === 0 && <span className="text-text-muted text-xs">—</span>}
            {user.roles.map((r) => (
              <span key={r} className="px-sm py-xs rounded-md bg-bg-secondary text-xs text-text-muted">
                {r}
              </span>
            ))}
          </div>
        )}
      </td>
      <td className="px-md py-sm">
        <div className="flex gap-xs">
          <button
            onClick={onToggleEnabled}
            disabled={busy}
            className="px-sm py-xs rounded-md bg-bg-secondary text-text-muted hover:text-text-main text-xs disabled:opacity-40"
          >
            {user.enabled ? 'Disable' : 'Enable'}
          </button>
          {!editing && (
            <button
              onClick={startEditing}
              disabled={busy}
              className="px-sm py-xs rounded-md bg-bg-secondary text-text-muted hover:text-text-main text-xs disabled:opacity-40"
            >
              Edit roles
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

function RoleChips({
  roleNames,
  selected,
  onToggle,
}: {
  roleNames: string[];
  selected: string[];
  onToggle: (role: string) => void;
}) {
  if (roleNames.length === 0) {
    return <p className="text-xs text-text-muted">No roles defined in the catalog.</p>;
  }
  return (
    <div className="flex flex-wrap gap-xs">
      {roleNames.map((r) => {
        const on = selected.some((s) => s.toUpperCase() === r.toUpperCase());
        return (
          <button
            key={r}
            type="button"
            onClick={() => onToggle(r)}
            className={
              'px-sm py-xs rounded-md text-xs border ' +
              (on
                ? 'bg-accent-primary/10 text-accent-primary border-accent-primary/40'
                : 'bg-bg-secondary text-text-muted border-transparent')
            }
          >
            {r}
          </button>
        );
      })}
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

/** Toggle a value in/out of a list, matching case-insensitively (role names are canonical server-side). */
function toggle(list: string[], value: string): string[] {
  return list.some((v) => v.toUpperCase() === value.toUpperCase())
    ? list.filter((v) => v.toUpperCase() !== value.toUpperCase())
    : [...list, value];
}

function extractMessage(e: unknown): string {
  if (typeof e === 'object' && e !== null) {
    const err = e as { response?: { data?: { message?: string } }; message?: string };
    return err.response?.data?.message ?? err.message ?? 'The operation failed.';
  }
  return 'The operation failed.';
}
