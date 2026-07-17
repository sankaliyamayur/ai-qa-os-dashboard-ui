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
  // Authentication Module
  {
    id: 'TC-AUTH-001',
    name: 'Verify Admin Login with Valid Credentials',
    description: 'Ensure that the administrator is redirected to the admin dashboard upon providing a valid username and password.',
    moduleId: 'authentication',
    feature: 'Admin Sign-In',
    priority: 'High',
    status: 'Passed',
    browser: 'Chrome',
    duration: '12 sec',
    build: 'Bld-2026.07.17-01',
    lastRun: 'Today 09:12 AM',
    tags: ['Sanity', 'Regression', 'P0'],
    device: 'Desktop - Windows 11',
    environment: 'Staging',
    commitHash: '1a0dd34',
    pipelineId: 'PL-GHA-993848',
    steps: [
      { time: '09:12:01', action: 'Open Browser & Launch Chrome', status: 'PASS' },
      { time: '09:12:03', action: 'Navigate to Admin Login URL', status: 'PASS' },
      { time: '09:12:06', action: 'Enter email address: admin@360automarketplace.com', status: 'PASS' },
      { time: '09:12:08', action: 'Enter password: Admin@123', status: 'PASS' },
      { time: '09:12:10', action: 'Click login button', status: 'PASS' },
      { time: '09:12:13', action: 'Verify dashboard title is visible', status: 'PASS' }
    ]
  },
  {
    id: 'TC-AUTH-002',
    name: 'Verify Login Failure with Invalid Password',
    description: 'Ensure that correct validation message is shown and login fails when password is case-sensitive wrong.',
    moduleId: 'authentication',
    feature: 'Admin Sign-In',
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
    failureReason: 'Dashboard verification failed',
    errorMessage: 'TimeoutError: locator.click() waiting for element "#submit" failed - 30 seconds exceeded.',
    stackTrace: 'TimeoutError: locator.click(): Timeout 30000ms exceeded.\n  at d:\\QA AI Automation\\AI-QA-OS Architecture\\ai-qa-os-execution\\src\\main\\resources\\scripts\\login.spec.ts:18:22\n  at LoginPage.submit (d:\\QA AI Automation\\AI-QA-OS Architecture\\ai-qa-os-execution\\src\\main\\resources\\pages\\LoginPage.ts:45:34)',
    screenshot: 'https://images.unsplash.com/photo-1590408595525-ac1f3049f55e?w=800&auto=format&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    htmlReport: '/reports/playwright-report.html',
    traceFile: '/artifacts/playwright-trace.zip',
    networkLog: 'Host: localhost:8082\nMethod: POST /api/v1/auth/login\nStatus: 401 Unauthorized\nPayload: {"email": "admin@360automarketplace.com", "password": "wrong_password"}',
    consoleLog: '[INFO] Launching Firefox...\n[WARN] Failed to load favicon\n[ERROR] Authentication API failed with HTTP 401.',
    steps: [
      { time: '09:14:01', action: 'Open Browser & Launch Firefox', status: 'PASS' },
      { time: '09:14:03', action: 'Navigate to Admin Login URL', status: 'PASS' },
      { time: '09:14:06', action: 'Enter email address: admin@360automarketplace.com', status: 'PASS' },
      { time: '09:14:08', action: 'Enter password: WrongPassword123', status: 'PASS' },
      { time: '09:14:10', action: 'Click login button', status: 'PASS' },
      { time: '09:14:40', action: 'Verify dashboard title is visible', status: 'FAILED', details: 'Dashboard title not found.' }
    ]
  },
  {
    id: 'TC-AUTH-003',
    name: 'Forgot Password Verification Email Send',
    description: 'Ensure forgot password request issues a secure recovery code via email.',
    moduleId: 'authentication',
    feature: 'Password Recovery',
    priority: 'Medium',
    status: 'Skipped',
    browser: 'Safari',
    duration: '0 sec',
    build: 'Bld-2026.07.17-01',
    lastRun: 'Today 09:15 AM',
    tags: ['Functional'],
    steps: [
      { time: '09:15:00', action: 'Initialize forgot password test', status: 'SKIPPED' }
    ]
  },

  // User Management
  {
    id: 'TC-USER-001',
    name: 'Create New QA Engineer Role Account',
    description: 'Ensure admin can successfully invite and delegate role roles to new users.',
    moduleId: 'user-management',
    feature: 'Role Delegation',
    priority: 'High',
    status: 'Passed',
    browser: 'Chrome',
    duration: '15 sec',
    build: 'Bld-2026.07.17-01',
    lastRun: 'Today 10:18 AM',
    tags: ['Functional', 'RBAC'],
    steps: [
      { time: '10:18:01', action: 'Navigate to user management section', status: 'PASS' },
      { time: '10:18:05', action: 'Click "New User"', status: 'PASS' },
      { time: '10:18:10', action: 'Fill user form with QA Engineer role details', status: 'PASS' },
      { time: '10:18:16', action: 'Save user and verify user exists in list', status: 'PASS' }
    ]
  },
  {
    id: 'TC-USER-002',
    name: 'Delete User Account Assertion',
    description: 'Ensure deletion locks user logins instantly across active sessions.',
    moduleId: 'user-management',
    feature: 'User Deletion',
    priority: 'High',
    status: 'Failed',
    browser: 'Edge',
    duration: '42 sec',
    build: 'Bld-2026.07.17-01',
    lastRun: 'Today 10:20 AM',
    tags: ['Regression', 'P1'],
    failureReason: 'Delete dialog did not close',
    errorMessage: 'TimeoutError: locator.waitFor() timeout 30000ms exceeded waiting for dialog to close.',
    stackTrace: 'TimeoutError: locator.waitFor() timeout 30000ms exceeded.\n  at d:\\QA AI Automation\\AI-QA-OS Architecture\\ai-qa-os-execution\\src\\main\\resources\\scripts\\user.spec.ts:32:15',
    screenshot: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    steps: [
      { time: '10:19:00', action: 'Navigate to user grid list', status: 'PASS' },
      { time: '10:19:05', action: 'Click delete icon on row #3', status: 'PASS' },
      { time: '10:19:10', action: 'Click confirm modal button', status: 'PASS' },
      { time: '10:19:42', action: 'Verify user row is deleted', status: 'FAILED', details: 'Row still visible in list.' }
    ]
  },

  // Payments Module
  {
    id: 'TC-PAY-001',
    name: 'Verify Stripe Card Payment Checkout Flow',
    description: 'Complete transaction using Stripe developer test cards.',
    moduleId: 'payments',
    feature: 'Credit Card Payment',
    priority: 'High',
    status: 'Failed',
    browser: 'Chrome',
    duration: '45 sec',
    build: 'Bld-2026.07.17-01',
    lastRun: 'Today 11:05 AM',
    tags: ['Checkout', 'Stripe'],
    failureReason: 'Payment gateway timeout',
    errorMessage: 'Stripe API returned 504 Gateway Timeout during charge authorization.',
    stackTrace: 'NetworkError: Stripe API charge authorization failed due to Gateway Timeout.\n  at d:\\QA AI Automation\\AI-QA-OS Architecture\\ai-qa-os-execution\\src\\main\\resources\\payment.spec.ts:88:14',
    screenshot: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    steps: [
      { time: '11:04:20', action: 'Navigate to payment checkout page', status: 'PASS' },
      { time: '11:04:25', action: 'Input Stripe test visa credentials', status: 'PASS' },
      { time: '11:04:30', action: 'Click Pay Now button', status: 'PASS' },
      { time: '11:05:05', action: 'Verify receipt popup message', status: 'FAILED', details: 'Timeout waiting for payment provider response.' }
    ]
  }
];
