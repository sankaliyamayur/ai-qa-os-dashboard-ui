import { describe, it, expect } from 'vitest';

describe('Formatters and Helpers', () => {
  it('should calculate pass rate percentage correctly', () => {
    const calculateRate = (passed: number, total: number) => {
      if (total === 0) return 0;
      return Math.round((passed / total) * 100);
    };

    expect(calculateRate(8, 10)).toBe(80);
    expect(calculateRate(0, 5)).toBe(0);
    expect(calculateRate(5, 5)).toBe(100);
  });

  it('should parse role configurations', () => {
    const hasAdminAccess = (role: string) => {
      return ['ADMIN', 'QA_MANAGER'].includes(role);
    };

    expect(hasAdminAccess('ADMIN')).toBe(true);
    expect(hasAdminAccess('QA_MANAGER')).toBe(true);
    expect(hasAdminAccess('VIEWER')).toBe(false);
  });
});
