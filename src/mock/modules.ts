export interface Module {
  id: string;
  name: string;
  description: string;
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  passRate: number;
  lastExecution: string;
}

export const MOCK_MODULES: Module[] = [
  {
    id: 'admin-login',
    name: 'Admin Login',
    description: 'Secure sign-in for auto marketplace administrator panel console, session establishment, and credentials validation.',
    totalTests: 8,
    passed: 6,
    failed: 1,
    skipped: 1,
    passRate: 75,
    lastExecution: 'Today 09:14 AM'
  }
];
