

export interface TestCase {
  id: string;
  name: string;
  description: string;
  moduleId: string;
  feature: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Passed' | 'Failed' | 'Skipped';
  browser: 'Chrome' | 'Firefox' | 'Safari' | 'Edge';
  duration: string;
  build: string;
  lastRun: string;
  tags: string[];
  device?: string;
  environment?: string;
  commitHash?: string;
  pipelineId?: string;
  failureReason?: string;
  errorMessage?: string;
  stackTrace?: string;
  screenshot?: string;
  videoUrl?: string;
  htmlReport?: string;
  traceFile?: string;
  networkLog?: string;
  consoleLog?: string;
  steps: {
    time: string;
    action: string;
    status: 'PASS' | 'FAILED' | 'SKIPPED';
    details?: string;
  }[];
}

export const MOCK_TEST_CASES: TestCase[] = [
  {
    id: 'TC-AL-001',
    name: 'AC-001: Verify Admin Login with Valid Credentials',
    description: 'Given Admin is on Login page, When valid Email and Password are entered, Then Login should be successful.',
    moduleId: 'admin-login',
    feature: 'Admin Login Process',
    priority: 'High',
    status: 'Passed',
    browser: 'Chrome',
    duration: '8 sec',
    build: 'Bld-2026.07.17-01',
    lastRun: 'Today 09:10 AM',
    tags: ['Sanity', 'P0', 'Happy-Path'],
    device: 'Desktop - Windows 11',
    environment: 'Staging',
    commitHash: '1a0dd34',
    pipelineId: 'PL-GHA-993848',
    steps: [
      { time: '09:10:01', action: 'Open Chrome Browser', status: 'PASS' },
      { time: '09:10:03', action: 'Navigate to Admin Login URL: https://marketplace-admin.appworkdemo.com/', status: 'PASS' },
      { time: '09:10:05', action: 'Enter Email: admin@360automarketplace.com', status: 'PASS' },
      { time: '09:10:06', action: 'Enter Password: Admin@123', status: 'PASS' },
      { time: '09:10:07', action: 'Click Login button', status: 'PASS' },
      { time: '09:10:09', action: 'Verify redirect to Dashboard', status: 'PASS' }
    ]
  },
  {
    id: 'TC-AL-002',
    name: 'AC-002: Verify Login Failure with Invalid Email',
    description: 'Given Admin enters invalid Email, When Login button is clicked, Then login should fail.',
    moduleId: 'admin-login',
    feature: 'Login Validation',
    priority: 'High',
    status: 'Passed',
    browser: 'Chrome',
    duration: '7 sec',
    build: 'Bld-2026.07.17-01',
    lastRun: 'Today 09:11 AM',
    tags: ['Security', 'P0'],
    device: 'Desktop - Windows 11',
    environment: 'Staging',
    commitHash: '1a0dd34',
    pipelineId: 'PL-GHA-993848',
    steps: [
      { time: '09:11:01', action: 'Navigate to Admin Login URL', status: 'PASS' },
      { time: '09:11:03', action: 'Enter invalid Email: invalid-admin@360automarketplace.com', status: 'PASS' },
      { time: '09:11:04', action: 'Enter Password: Admin@123', status: 'PASS' },
      { time: '09:11:05', action: 'Click Login button', status: 'PASS' },
      { time: '09:11:08', action: 'Verify validation error "Invalid email or password" is shown', status: 'PASS' }
    ]
  },
  {
    id: 'TC-AL-003',
    name: 'AC-003: Verify Login Failure with Invalid Password',
    description: 'Given Admin enters invalid Password, When Login button is clicked, Then login should fail.',
    moduleId: 'admin-login',
    feature: 'Login Validation',
    priority: 'High',
    status: 'Failed',
    browser: 'Firefox',
    duration: '32 sec',
    build: 'Bld-2026.07.17-01',
    lastRun: 'Today 09:14 AM',
    tags: ['Security', 'P0'],
    device: 'Desktop - Ubuntu 22.04',
    environment: 'Staging',
    commitHash: '1a0dd34',
    pipelineId: 'PL-GHA-993848',
    failureReason: 'Validation banner did not appear',
    errorMessage: 'TimeoutError: locator.waitFor() timeout 30000ms exceeded waiting for error message element ".alert-danger".',
    stackTrace: 'TimeoutError: locator.waitFor(): Timeout 30000ms exceeded.\n  at d:\\QA AI Automation\\AI-QA-OS Architecture\\ai-qa-os-execution\\src\\main\\resources\\scripts\\login.spec.ts:18:22\n  at LoginPage.submit (d:\\QA AI Automation\\AI-QA-OS Architecture\\ai-qa-os-execution\\src\\main\\resources\\pages\\LoginPage.ts:45:34)',
    // screenshot, videoUrl, htmlReport, traceFile, networkLog, consoleLog
    // are NOT hardcoded here. They are fetched dynamically from:
    // GET /api/dashboard/artifacts/TC-AL-003
    // via the useArtifacts() hook in TestCaseDetailPage.
    steps: [
      { time: '09:14:01', action: 'Open Firefox Browser', status: 'PASS' },
      { time: '09:14:03', action: 'Navigate to Admin Login URL', status: 'PASS' },
      { time: '09:14:05', action: 'Enter Email: admin@360automarketplace.com', status: 'PASS' },
      { time: '09:14:06', action: 'Enter invalid Password: WrongPassword123', status: 'PASS' },
      { time: '09:14:08', action: 'Click Login button', status: 'PASS' },
      { time: '09:14:38', action: 'Verify validation error alert is visible', status: 'FAILED', details: 'Timeout waiting for validation alert element.' }
    ]
  },
  {
    id: 'TC-AL-004',
    name: 'AC-004: Verify Login Failure with both fields Invalid',
    description: 'Given both Email and Password are invalid, When Login button is clicked, Then login should fail.',
    moduleId: 'admin-login',
    feature: 'Login Validation',
    priority: 'High',
    status: 'Passed',
    browser: 'Chrome',
    duration: '5 sec',
    build: 'Bld-2026.07.17-01',
    lastRun: 'Today 09:12 AM',
    tags: ['Security', 'P1'],
    steps: [
      { time: '09:12:01', action: 'Navigate to Admin Login URL', status: 'PASS' },
      { time: '09:12:02', action: 'Enter Email: invalid-email@test.com', status: 'PASS' },
      { time: '09:12:03', action: 'Enter Password: WrongPassword123', status: 'PASS' },
      { time: '09:12:04', action: 'Click Login button', status: 'PASS' },
      { time: '09:12:06', action: 'Verify login fails with error message', status: 'PASS' }
    ]
  },
  {
    id: 'TC-AL-005',
    name: 'AC-005: Verify Validation when Email is Blank',
    description: 'Given Email field is blank, When Login button is clicked, Then validation message should appear.',
    moduleId: 'admin-login',
    feature: 'Required Validation',
    priority: 'Medium',
    status: 'Passed',
    browser: 'Edge',
    duration: '4 sec',
    build: 'Bld-2026.07.17-01',
    lastRun: 'Today 09:13 AM',
    tags: ['UX', 'Validation'],
    steps: [
      { time: '09:13:01', action: 'Navigate to Admin Login URL', status: 'PASS' },
      { time: '09:13:02', action: 'Leave Email field blank', status: 'PASS' },
      { time: '09:13:03', action: 'Enter Password: Admin@123', status: 'PASS' },
      { time: '09:13:04', action: 'Click Login button', status: 'PASS' },
      { time: '09:13:05', action: 'Verify HTML5 required validation or placeholder error', status: 'PASS' }
    ]
  },
  {
    id: 'TC-AL-006',
    name: 'AC-006: Verify Validation when Password is Blank',
    description: 'Given Password field is blank, When Login button is clicked, Then validation message should appear.',
    moduleId: 'admin-login',
    feature: 'Required Validation',
    priority: 'Medium',
    status: 'Passed',
    browser: 'Chrome',
    duration: '4 sec',
    build: 'Bld-2026.07.17-01',
    lastRun: 'Today 09:13 AM',
    tags: ['UX', 'Validation'],
    steps: [
      { time: '09:13:20', action: 'Navigate to Admin Login URL', status: 'PASS' },
      { time: '09:13:21', action: 'Enter Email: admin@360automarketplace.com', status: 'PASS' },
      { time: '09:13:22', action: 'Leave Password field blank', status: 'PASS' },
      { time: '09:13:23', action: 'Click Login button', status: 'PASS' },
      { time: '09:13:24', action: 'Verify required password message matches spec', status: 'PASS' }
    ]
  },
  {
    id: 'TC-AL-007',
    name: 'AC-007: Verify Validation when both fields are Blank',
    description: 'Given both fields are blank, When Login button is clicked, Then required field validation should appear.',
    moduleId: 'admin-login',
    feature: 'Required Validation',
    priority: 'Medium',
    status: 'Passed',
    browser: 'Firefox',
    duration: '3 sec',
    build: 'Bld-2026.07.17-01',
    lastRun: 'Today 09:13 AM',
    tags: ['UX', 'Validation'],
    steps: [
      { time: '09:13:40', action: 'Navigate to Admin Login URL', status: 'PASS' },
      { time: '09:13:41', action: 'Leave both fields blank', status: 'PASS' },
      { time: '09:13:42', action: 'Click Login button', status: 'PASS' },
      { time: '09:13:43', action: 'Verify UI blocks submission and indicates required inputs', status: 'PASS' }
    ]
  },
  {
    id: 'TC-AL-008',
    name: 'AC-008: Verify Forgot Password navigation link',
    description: 'Given Admin clicks Forgot Password, Then Redirect user to Forgot Password page.',
    moduleId: 'admin-login',
    feature: 'Password Recovery Navigation',
    priority: 'Medium',
    status: 'Skipped',
    browser: 'Safari',
    duration: '0 sec',
    build: 'Bld-2026.07.17-01',
    lastRun: 'Today 09:15 AM',
    tags: ['UX', 'Happy-Path'],
    steps: [
      { time: '09:15:00', action: 'Initialize navigation test suite', status: 'SKIPPED' }
    ]
  }
];
