import { describe, it, expect } from 'vitest';
import {
  COMPANIES,
  APPLICATIONS,
  NEWS,
  EMPLOYEE,
  companyById,
} from '../data';
import type { CompanyId } from '../types';

describe('mock data integrity', () => {
  it('defines exactly six subsidiaries plus the group', () => {
    const subsidiaries = COMPANIES.filter((c) => c.id !== 'group');
    expect(subsidiaries).toHaveLength(6);
  });

  it('every company has a unique id and a non-empty accent colour', () => {
    const ids = new Set(COMPANIES.map((c) => c.id));
    expect(ids.size).toBe(COMPANIES.length);
    for (const c of COMPANIES) {
      expect(c.accent).toMatch(/^#[0-9a-f]{6}$/i);
      expect(c.shortName.length).toBeGreaterThan(0);
    }
  });

  it('companyById returns the matching company and falls back to group', () => {
    expect(companyById('travels').name).toBe('Finchglow Travels');
    expect(companyById('group').id).toBe('group');
    // unknown id falls back to the first entry (group)
    expect(companyById('nonexistent' as CompanyId).id).toBe('group');
  });

  it('every application references at least one valid company', () => {
    const validIds = new Set(COMPANIES.map((c) => c.id));
    for (const app of APPLICATIONS) {
      expect(app.companyIds.length).toBeGreaterThan(0);
      for (const cid of app.companyIds) {
        expect(validIds.has(cid)).toBe(true);
      }
      expect(app.launchUrl).toMatch(/^https?:\/\//);
    }
  });

  it('every news item has a valid severity, scope, and ISO timestamp', () => {
    const validScopes = new Set(COMPANIES.map((c) => c.id));
    for (const n of NEWS) {
      expect(['critical', 'warning', 'info']).toContain(n.severity);
      expect(validScopes.has(n.scope)).toBe(true);
      expect(() => new Date(n.publishedAt).toISOString()).not.toThrow();
    }
  });

  it('includes at least one group-wide critical incident', () => {
    const groupCritical = NEWS.filter(
      (n) => n.scope === 'group' && n.severity === 'critical',
    );
    expect(groupCritical.length).toBeGreaterThan(0);
  });

  it('employee has access to at least their own company plus group', () => {
    expect(EMPLOYEE.accessibleCompanyIds).toContain(EMPLOYEE.companyId);
    expect(EMPLOYEE.accessibleCompanyIds).toContain('group');
  });
});
