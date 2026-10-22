import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { CompanyId } from './types';
import { COMPANIES, EMPLOYEE, companyById } from './data';

type Theme = 'light' | 'dark';

interface PortalContextValue {
  theme: Theme;
  toggleTheme: () => void;
  selectedCompanyId: CompanyId;
  setSelectedCompanyId: (id: CompanyId) => void;
  employee: typeof EMPLOYEE;
  accessibleCompanies: typeof COMPANIES;
  query: string;
  setQuery: (q: string) => void;
  accent: { color: string; soft: string; strong: string; softBorder: string };
}

const PortalContext = createContext<PortalContextValue | null>(null);

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem('fg-theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const STRONG_MAP: Record<string, string> = {
  '#4f46e5': '#4338ca',
  '#059669': '#047857',
  '#0284c7': '#0369a1',
  '#d97706': '#b45309',
  '#e11d48': '#be123c',
  '#0d9488': '#0f766e',
  '#475569': '#334155',
};
const SOFT_BORDER_MAP: Record<string, string> = {
  '#4f46e5': '#c7d2fe',
  '#059669': '#a7f3d0',
  '#0284c7': '#bae6fd',
  '#d97706': '#fde68a',
  '#e11d48': '#fecdd3',
  '#0d9488': '#99f6e4',
  '#475569': '#cbd5e1',
};

export function PortalProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [selectedCompanyId, setSelectedCompanyId] = useState<CompanyId>(EMPLOYEE.companyId);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('fg-theme', theme);
  }, [theme]);

  const company = companyById(selectedCompanyId);
  const accent = useMemo(
    () => ({
      color: company.accent,
      soft: company.accentSoft,
      strong: STRONG_MAP[company.accent] ?? company.accent,
      softBorder: SOFT_BORDER_MAP[company.accent] ?? company.accentSoft,
    }),
    [company],
  );

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent', accent.color);
    root.style.setProperty('--accent-soft', accent.soft);
    root.style.setProperty('--accent-strong', accent.strong);
    root.style.setProperty('--accent-soft-border', accent.softBorder);
    root.style.setProperty('--accent-ring', accent.color);
    root.style.setProperty('--accent-ring-offset', theme === 'dark' ? '#0b101b' : '#ffffff');
  }, [accent, theme]);

  const accessibleCompanies = useMemo(
    () => COMPANIES.filter((c) => EMPLOYEE.accessibleCompanyIds.includes(c.id)),
    [],
  );

  const value: PortalContextValue = {
    theme,
    toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    selectedCompanyId,
    setSelectedCompanyId,
    employee: EMPLOYEE,
    accessibleCompanies,
    query,
    setQuery,
    accent,
  };

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>;
}

export function usePortal() {
  const ctx = useContext(PortalContext);
  if (!ctx) throw new Error('usePortal must be used within PortalProvider');
  return ctx;
}
