export interface VideoRecord {
  id: string;
  testCaseId: string;
  fileName: string;
  videoUrl: string;
  durationSec: number;
}

/**
 * MOCK_VIDEOS is intentionally empty.
 * Real execution videos are captured by Playwright (video: 'retain-on-failure')
 * and served via GET /api/dashboard/artifacts/{testCaseId} → videoUrl.
 * Use the useArtifacts() hook in TestCaseDetailPage to retrieve them.
 */
export const MOCK_VIDEOS: VideoRecord[] = [];

