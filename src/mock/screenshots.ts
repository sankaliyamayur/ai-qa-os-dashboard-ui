export interface Screenshot {
  id: string;
  testCaseId: string;
  fileName: string;
  url: string;
  capturedAt: string;
}

export const MOCK_SCREENSHOTS: Screenshot[] = [
  {
    id: 'img-101',
    testCaseId: 'TC-AL-003',
    fileName: 'login_failed.png',
    url: 'https://images.unsplash.com/photo-1590408595525-ac1f3049f55e?w=800&auto=format&fit=crop',
    capturedAt: 'Today 09:14 AM'
  }
];
