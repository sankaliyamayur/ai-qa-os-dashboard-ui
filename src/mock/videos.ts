export interface VideoRecord {
  id: string;
  testCaseId: string;
  fileName: string;
  videoUrl: string;
  durationSec: number;
}

export const MOCK_VIDEOS: VideoRecord[] = [
  {
    id: 'vid-101',
    testCaseId: 'TC-AUTH-002',
    fileName: 'login_error_replay.webm',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    durationSec: 32
  },
  {
    id: 'vid-102',
    testCaseId: 'TC-USER-002',
    fileName: 'user_delete_dialog_replay.webm',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    durationSec: 42
  },
  {
    id: 'vid-103',
    testCaseId: 'TC-PAY-001',
    fileName: 'payment_checkout_timeout.webm',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    durationSec: 45
  }
];
