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
    id: 'authentication',
    name: 'Authentication',
    description: 'User login, MFA, register, forgot password, and session validation.',
    totalTests: 86,
    passed: 81,
    failed: 3,
    skipped: 2,
    passRate: 94,
    lastExecution: 'Today 09:15 AM'
  },
  {
    id: 'user-management',
    name: 'User Management',
    description: 'Profiles, role assignments, permissions, and user lists.',
    totalTests: 45,
    passed: 40,
    failed: 4,
    skipped: 1,
    passRate: 89,
    lastExecution: 'Today 10:20 AM'
  },
  {
    id: 'marketplace',
    name: 'Marketplace',
    description: 'Product listing, auto marketplace search, filters, and vehicle detail views.',
    totalTests: 120,
    passed: 115,
    failed: 2,
    skipped: 3,
    passRate: 96,
    lastExecution: 'Yesterday 04:30 PM'
  },
  {
    id: 'orders',
    name: 'Orders',
    description: 'Cart processing, checkout flows, order confirmation, and details.',
    totalTests: 60,
    passed: 58,
    failed: 1,
    skipped: 1,
    passRate: 97,
    lastExecution: 'Yesterday 06:10 PM'
  },
  {
    id: 'payments',
    name: 'Payments',
    description: 'Stripe, PayPal gateways, invoicing, refunds, and billing metrics.',
    totalTests: 35,
    passed: 30,
    failed: 5,
    skipped: 0,
    passRate: 86,
    lastExecution: 'Today 11:05 AM'
  },
  {
    id: 'reports',
    name: 'Reports',
    description: 'Export PDF summaries, excel transactions, and analytics scheduling.',
    totalTests: 24,
    passed: 24,
    failed: 0,
    skipped: 0,
    passRate: 100,
    lastExecution: '2 days ago'
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Real-time charts, pass trends, error distribution analysis, and usage stats.',
    totalTests: 40,
    passed: 38,
    failed: 1,
    skipped: 1,
    passRate: 95,
    lastExecution: 'Today 08:00 AM'
  },
  {
    id: 'settings',
    name: 'Settings',
    description: 'System configurations, theme controls, API integrations, and developer tokens.',
    totalTests: 18,
    passed: 17,
    failed: 1,
    skipped: 0,
    passRate: 94,
    lastExecution: 'Today 07:45 AM'
  }
];
