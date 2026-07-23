import apiClient from '../config/apiClient';

/** AI-2 — a run paused for human review (AI-1 confidence gate < threshold). */
export interface HumanReview {
  reviewId: string;
  workflowId: string;
  executionId: string;
  stepName: string;
  confidence: number;
  status: string;
  createdTime: string;
}

export async function getPendingReviews(): Promise<HumanReview[]> {
  const res = await apiClient.get<HumanReview[]>('/dashboard/reviews');
  return res.data;
}

export async function approveReview(workflowId: string, reviewer: string, comment?: string): Promise<void> {
  await apiClient.post(`/dashboard/reviews/${workflowId}/approve`, { reviewer, comment });
}

export async function rejectReview(workflowId: string, reviewer: string, comment?: string): Promise<void> {
  await apiClient.post(`/dashboard/reviews/${workflowId}/reject`, { reviewer, comment });
}
