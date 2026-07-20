export interface Screenshot {
  id: string;
  testCaseId: string;
  fileName: string;
  url: string;
  capturedAt: string;
}

/**
 * MOCK_SCREENSHOTS is intentionally empty.
 * Real screenshot artifacts are captured by Playwright (screenshot: 'only-on-failure')
 * and served via GET /api/dashboard/artifacts/{testCaseId} → screenshotUrl.
 * Use the useArtifacts() hook in TestCaseDetailPage to retrieve them.
 */
export const MOCK_SCREENSHOTS: Screenshot[] = [];

