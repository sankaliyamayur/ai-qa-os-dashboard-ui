import apiClient from '../config/apiClient';

/** ENT-4 (FI-ENT4-B): a secret-free per-user admin view — never a password hash or MFA secret. */
export interface AdminUserView {
  /** FI-ENT4-A: the stable user id, used to target the write endpoints. */
  id: string;
  username: string;
  email: string;
  enabled: boolean;
  mfaEnabled: boolean;
  accountLocked: boolean;
  /** FI-ENT4-A: the user's assigned role names (for display + the role editor). */
  roles: string[];
}

/** ENT-4: the RBAC admin read-model — counts, security posture, per-user views, role catalog. */
export interface RbacAdminSummary {
  userCount: number;
  disabledUserCount: number;
  lockedUserCount: number;
  mfaEnabledCount: number;
  roleCount: number;
  permissionCount: number;
  users: AdminUserView[];
  roleNames: string[];
}

/** GET the read-only RBAC admin summary (ENT-4). Requires ADMIN once auth enforcement is on. */
export async function getRbacSummary(): Promise<RbacAdminSummary> {
  const res = await apiClient.get<RbacAdminSummary>('/dashboard/admin/rbac');
  return res.data;
}

// --- FI-ENT4-A: admin write-ops (ADMIN-gated at /api/admin/**; JWT is injected by apiClient) ------

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  roles: string[];
}

/** POST a new user (tenant-scoped by the caller's JWT). Roles are validated against the catalog. */
export async function createUser(request: CreateUserRequest): Promise<void> {
  await apiClient.post('/admin/users', request);
}

/** Enable or disable (soft) a user. The backend rejects disabling your own account. */
export async function setUserEnabled(id: string, enabled: boolean): Promise<void> {
  await apiClient.patch(`/admin/users/${id}/enabled`, { enabled });
}

/** Replace a user's roles. The backend rejects removing your own ADMIN role. */
export async function setUserRoles(id: string, roles: string[]): Promise<void> {
  await apiClient.put(`/admin/users/${id}/roles`, { roles });
}
