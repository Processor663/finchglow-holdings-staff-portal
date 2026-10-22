import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { PortalProvider, usePortal } from '../context';

function wrapper({ children }: { children: React.ReactNode }) {
  return <PortalProvider>{children}</PortalProvider>;
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('dark');
});

describe('PortalProvider context', () => {
  it('exposes the employee, default company, and theme', () => {
    const { result } = renderHook(() => usePortal(), { wrapper });
    expect(result.current.employee.firstName).toBe('Amadi');
    expect(result.current.selectedCompanyId).toBe('travels');
    expect(['light', 'dark']).toContain(result.current.theme);
  });

  it('setSelectedCompanyId updates the selected company and accent', () => {
    const { result } = renderHook(() => usePortal(), { wrapper });
    act(() => result.current.setSelectedCompanyId('b2b'));
    expect(result.current.selectedCompanyId).toBe('b2b');
    expect(result.current.accent.color).toBe('#d97706');
  });

  it('toggleTheme flips between light and dark and persists to localStorage', () => {
    const { result } = renderHook(() => usePortal(), { wrapper });
    const initial = result.current.theme;
    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe(initial === 'dark' ? 'light' : 'dark');
    expect(localStorage.getItem('fg-theme')).toBe(result.current.theme);
  });

  it('only lists companies the employee can access', () => {
    const { result } = renderHook(() => usePortal(), { wrapper });
    const ids = result.current.accessibleCompanies.map((c) => c.id);
    expect(ids).toEqual(['group', 'travels', 'b2b', 'holidays']);
  });

  it('setQuery updates the search query', () => {
    const { result } = renderHook(() => usePortal(), { wrapper });
    act(() => result.current.setQuery('booking'));
    expect(result.current.query).toBe('booking');
  });

  it('throws when usePortal is called outside the provider', () => {
    expect(() => renderHook(() => usePortal())).toThrow(
      'usePortal must be used within PortalProvider',
    );
  });
});
