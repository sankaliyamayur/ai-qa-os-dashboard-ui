import apiClient from '../config/apiClient';

export interface ArtifactDTO {
  /** Test case identifier, e.g. "TC-AL-003" */
  testCaseId: string;

  /** Browser project used for this run: chromium | firefox | webkit */
  browser?: string;

  /** Execution status: passed | failed | skipped */
  status?: string;

  /**
   * HTTP URL to display the failure screenshot in ScreenshotViewer.
   * null → test passed or Playwright has not been run yet.
   */
  screenshotUrl?: string;

  /**
   * HTTP URL to stream/download the execution video (.webm) in VideoPlayer.
   * null → test passed (retain-on-failure: video was discarded).
   */
  videoUrl?: string;

  /**
   * HTTP URL to download the Playwright trace zip in AttachmentViewer.
   * null → test passed or trace was not retained.
   */
  traceUrl?: string;

  /**
   * HTTP URL to open the Playwright HTML report in AttachmentViewer.
   * null → report not generated.
   */
  htmlReportUrl?: string;

  /**
   * Playwright stdout / stderr console log text captured during execution.
   * Displayed in the ExecutionLogs terminal panel.
   */
  consoleLog?: string;

  /**
   * Exception stack trace if the test failed.
   * Displayed in the ExecutionLogs stack-trace panel.
   */
  stackTrace?: string;

  /**
   * Network request log captured during execution.
   * Displayed embedded in AttachmentViewer.
   */
  networkLog?: string;

  /**
   * Execution history — one entry per run, ordered oldest → newest.
   * Enables "Run #1 / Run #2 / Run #3" history view in the dashboard.
   */
  history?: ArtifactRunEntry[];
}

/** A single historical execution run for a test case */
export interface ArtifactRunEntry {
  runNumber: number;
  executionId: string;
  browser: string;
  status: string;
  screenshotUrl?: string;
  videoUrl?: string;
  traceUrl?: string;
}

/**
 * Fetches artifact metadata for the given test case ID.
 *
 * @param testCaseId - The test case identifier (e.g. "TC-AL-003")
 * @returns ArtifactDTO with real artifact URLs, or null if none exist
 */
export async function fetchArtifacts(testCaseId: string): Promise<ArtifactDTO | null> {
  try {
    // apiClient has baseURL: '/api', so we use relative path
    const response = await apiClient.get<ArtifactDTO>(`/dashboard/artifacts/${encodeURIComponent(testCaseId)}`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      // No artifacts for this test case — normal for passed tests
      return null;
    }
    // Network error or backend not running — fail silently and show empty state
    console.warn(`[artifactService] Could not fetch artifacts for ${testCaseId}:`, error);
    return null;
  }
}

/**
 * Fetches full execution history for a test case.
 *
 * @param testCaseId - The test case identifier (e.g. "TC-AL-003")
 * @returns Array of run entries ordered oldest → newest, or empty array if none
 */
export async function fetchArtifactHistory(testCaseId: string): Promise<ArtifactRunEntry[]> {
  try {
    const response = await apiClient.get<ArtifactRunEntry[]>(`/dashboard/artifacts/${encodeURIComponent(testCaseId)}/history`);
    return response.data;
  } catch (error) {
    console.warn(`[artifactService] Could not fetch artifact history for ${testCaseId}:`, error);
    return [];
  }
}

