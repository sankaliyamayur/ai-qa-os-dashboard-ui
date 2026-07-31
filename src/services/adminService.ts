import apiClient from '../config/apiClient';

/** ENT-4 (FI-ENT4-B): a secret-free per-user admin view — never a password hash or MFA secret. */
export interface AdminUserView {
  username: string;
  email: string;
  enabled: boolean;
  mfaEnabled: boolean;
  accountLocked: boolean;
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
