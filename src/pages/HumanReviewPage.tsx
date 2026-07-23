import { useEffect, useState } from 'react';
import { getPendingReviews, approveReview, rejectReview, type HumanReview } from '../services/reviewService';

const reviewerName = (): string => {
  try {
    const raw = localStorage.getItem('user_info');
    if (raw) return JSON.parse(raw).username || 'reviewer';
  } catch {
    /* ignore */
  }
  return 'reviewer';
};

export default function HumanReviewPage() {
  const [reviews, setReviews] = useState<HumanReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setReviews(await getPendingReviews());
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const decide = async (r: HumanReview, action: 'approve' | 'reject') => {
    setBusy(r.workflowId);
    try {
      if (action === 'approve') {
        await approveReview(r.workflowId, reviewerName());
      } else {
        await rejectReview(r.workflowId, reviewerName());
      }
      await load();
    } catch (e) {
      console.warn('[review] decision failed', e);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="p-lg space-y-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text-main">Human Review</h1>
        <button onClick={load} className="px-md py-sm rounded-md bg-bg-card text-text-muted">
          Refresh
        </button>
      </div>
      <p className="text-text-muted text-sm">
        Runs paused by the AI confidence gate awaiting a human decision. Approving resumes the pipeline
        from the paused step; rejecting cancels the run.
      </p>

      {loading ? (
        <div className="text-text-muted">Loading…</div>
      ) : reviews.length === 0 ? (
        <div className="rounded-lg bg-bg-card p-lg text-text-muted">No pending reviews.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg bg-bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-text-muted border-b border-bg-secondary">
                <th className="p-md">Workflow</th>
                <th className="p-md">Paused after</th>
                <th className="p-md">Confidence</th>
                <th className="p-md">Since</th>
                <th className="p-md text-right">Decision</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r.reviewId} className="border-b border-bg-secondary">
                  <td className="p-md font-mono text-text-main">{r.workflowId?.slice(0, 8)}</td>
                  <td className="p-md text-text-main">{r.stepName}</td>
                  <td className="p-md text-status-warning">{(r.confidence * 100).toFixed(0)}%</td>
                  <td className="p-md text-text-muted">{r.createdTime?.replace('T', ' ').slice(0, 19)}</td>
                  <td className="p-md text-right space-x-sm">
                    <button
                      disabled={busy === r.workflowId}
                      onClick={() => decide(r, 'approve')}
                      className="px-md py-sm rounded-md bg-status-success text-text-inverse disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      disabled={busy === r.workflowId}
                      onClick={() => decide(r, 'reject')}
                      className="px-md py-sm rounded-md bg-status-error text-text-inverse disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
