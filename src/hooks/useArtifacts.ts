import { useState, useEffect } from 'react';
import { fetchArtifacts, type ArtifactDTO } from '../services/artifactService';

interface UseArtifactsResult {
  /** Real Playwright artifact data — null if no artifacts exist for this test case */
  artifacts: ArtifactDTO | null;
  /** True while the API request is in-flight */
  loading: boolean;
  /** Non-null if the API returned an unexpected error (distinct from "no artifacts") */
  error: string | null;
}

/**
 * useArtifacts
 *
 * React hook that fetches real Playwright artifact metadata for a test case.
 *
 * Lifecycle:
 *  - loading=true immediately on mount / testCaseId change
 *  - artifacts=ArtifactDTO when backend returns data (test has failed and artifacts exist)
 *  - artifacts=null when backend returns 404 (test passed or never run)
 *  - error=string when backend returns unexpected error
 *
 * Re-fetches when testCaseId changes. No polling — artifacts are static
 * after execution completes.
 *
 * @param testCaseId - e.g. "TC-AL-003", or undefined while the test case is loading
 */
export function useArtifacts(testCaseId: string | undefined): UseArtifactsResult {
  const [artifacts, setArtifacts] = useState<ArtifactDTO | null>(null);
  const [loading, setLoading]     = useState<boolean>(false);
  const [error, setError]         = useState<string | null>(null);

  useEffect(() => {
    // Nothing to fetch if no test case is selected
    if (!testCaseId) {
      setArtifacts(null);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchArtifacts(testCaseId);

        if (!cancelled) {
          setArtifacts(data);  // null means "no artifacts" — not an error
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load artifacts');
          setArtifacts(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    // Cleanup: ignore stale responses if testCaseId changes before fetch completes
    return () => {
      cancelled = true;
    };
  }, [testCaseId]);

  return { artifacts, loading, error };
}

export default useArtifacts;
