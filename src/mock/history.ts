export interface ExecutionHistoryItem {
  id: string;
  testCaseId: string;
  executionDate: string;
  build: string;
  pipeline: string;
  browser: 'Chrome' | 'Firefox' | 'Safari' | 'Edge';
  status: 'Passed' | 'Failed' | 'Skipped';
  duration: string;
}

export const MOCK_HISTORY: ExecutionHistoryItem[] = [
  // History for TC-AUTH-002
  {
    id: 'h-101',
    testCaseId: 'TC-AUTH-002',
    executionDate: 'Today 09:14 AM',
    build: 'Bld-2026.07.17-01',
    pipeline: 'PL-GHA-993848',
    browser: 'Firefox',
    status: 'Failed',
    duration: '32 sec'
  },
  {
    id: 'h-102',
    testCaseId: 'TC-AUTH-002',
    executionDate: 'Yesterday 11:30 PM',
    build: 'Bld-2026.07.16-04',
    pipeline: 'PL-AZD-882736',
    browser: 'Chrome',
    status: 'Passed',
    duration: '11 sec'
  },
  {
    id: 'h-103',
    testCaseId: 'TC-AUTH-002',
    executionDate: '2 days ago',
    build: 'Bld-2026.07.15-02',
    pipeline: 'PL-GLI-112734',
    browser: 'Chrome',
    status: 'Passed',
    duration: '12 sec'
  },

  // History for TC-AUTH-001
  {
    id: 'h-201',
    testCaseId: 'TC-AUTH-001',
    executionDate: 'Today 09:12 AM',
    build: 'Bld-2026.07.17-01',
    pipeline: 'PL-GHA-993848',
    browser: 'Chrome',
    status: 'Passed',
    duration: '12 sec'
  },
  {
    id: 'h-202',
    testCaseId: 'TC-AUTH-001',
    executionDate: 'Yesterday 11:29 PM',
    build: 'Bld-2026.07.16-04',
    pipeline: 'PL-AZD-882736',
    browser: 'Chrome',
    status: 'Passed',
    duration: '10 sec'
  }
];
