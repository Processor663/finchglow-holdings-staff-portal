import { useEffect, useRef, useState } from 'react';
import { Building2, Check, ChevronDown } from 'lucide-react';
import { usePortal } from '../context';
import type { CompanyId } from '../types';

export function CompanySwitcher({ variant = 'sidebar' }: { variant?: 'sidebar' | 'inline' }) {
  const { accessibleCompanies, selectedCompanyId, setSelectedCompanyId } = usePortal();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const selected = accessibleCompanies.find((c) => c.id === selectedCompanyId) ?? accessibleCompanies[0];

  function select(id: CompanyId) {
    setSelectedCompanyId(id);
    setOpen(false);
  }

  if (variant === 'inline') {
    return (
      <div className="relative" ref={rootRef}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-50 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-200 dark:hover:bg-ink-800"
        >
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: selected.accent }} />
          <span className="max-w-[160px] truncate">{selected.shortName}</span>
          <ChevronDown className="h-4 w-4 text-ink-400" />
        </button>
        {open && <Menu items={accessibleCompanies} selectedId={selectedCompanyId} onSelect={select} />}
      </div>
    );
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center gap-2.5 rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-left transition-colors hover:bg-ink-50 dark:border-ink-700 dark:bg-ink-900 dark:hover:bg-ink-800"
      >
        <Building2 className="h-4 w-4 shrink-0 text-ink-400" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-ink-800 dark:text-ink-100">
            {selected.shortName}
          </div>
          <div className="truncate text-[11px] text-ink-400">{selected.tagline}</div>
        </div>
        <ChevronDown className={`h-4 w-4 shrink-0 text-ink-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <Menu items={accessibleCompanies} selectedId={selectedCompanyId} onSelect={select} />}
    </div>
  );
}

function Menu({
  items,
  selectedId,
  onSelect,
}: {
  items: { id: CompanyId; name: string; shortName: string; tagline: string; accent: string }[];
  selectedId: CompanyId;
  onSelect: (id: CompanyId) => void;
}) {
  return (
    <div
      role="listbox"
      className="absolute z-50 mt-2 w-full min-w-[220px] animate-slide-down overflow-hidden rounded-xl border border-ink-200 bg-white p-1.5 shadow-overlay dark:border-ink-700 dark:bg-ink-900"
    >
      {items.map((c) => (
        <button
          key={c.id}
          type="button"
          role="option"
          aria-selected={c.id === selectedId}
          onClick={() => onSelect(c.id)}
          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-ink-50 dark:hover:bg-ink-800"
        >
          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: c.accent }} />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-ink-800 dark:text-ink-100">{c.name}</div>
            <div className="truncate text-[11px] text-ink-400">{c.tagline}</div>
          </div>
          {c.id === selectedId && <Check className="h-4 w-4 shrink-0 accent-text" />}
        </button>
      ))}
    </div>
  );
}
