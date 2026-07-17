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
    testCaseId: 'TC-AUTH-002',
    fileName: 'login_failed.png',
    url: 'https://images.unsplash.com/photo-1590408595525-ac1f3049f55e?w=800&auto=format&fit=crop',
    capturedAt: 'Today 09:14 AM'
  },
  {
    id: 'img-102',
    testCaseId: 'TC-USER-002',
    fileName: 'user_delete_dialog_stuck.png',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop',
    capturedAt: 'Today 10:20 AM'
  },
  {
    id: 'img-103',
    testCaseId: 'TC-PAY-001',
    fileName: 'stripe_gateway_timeout.png',
    url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop',
    capturedAt: 'Today 11:05 AM'
  }
];
