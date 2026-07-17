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
    testCaseId: 'TC-AL-003',
    fileName: 'login_error_replay.webm',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    durationSec: 32
  }
];
