import { AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import type { Severity } from '../types';

interface SeverityBadgeProps {
  severity: Severity;
  size?: 'sm' | 'md';
}

const CONFIG: Record<
  Severity,
  { label: string; Icon: typeof Info; light: string; dark: string }
> = {
  critical: {
    label: 'Critical',
    Icon: ShieldAlert,
    light: 'bg-red-50 text-red-700 border-red-200',
    dark: 'dark:bg-red-950/60 dark:text-red-300 dark:border-red-900',
  },
  warning: {
    label: 'Warning',
    Icon: AlertTriangle,
    light: 'bg-amber-50 text-amber-800 border-amber-200',
    dark: 'dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900',
  },
  info: {
    label: 'Info',
    Icon: Info,
    light: 'bg-sky-50 text-sky-700 border-sky-200',
    dark: 'dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-900',
  },
};

export function SeverityBadge({ severity, size = 'sm' }: SeverityBadgeProps) {
  const { label, Icon, light, dark } = CONFIG[severity];
  const sizing = size === 'md' ? 'px-2.5 py-1 text-xs gap-1.5' : 'px-2 py-0.5 text-[11px] gap-1';
  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold uppercase tracking-wide ${light} ${dark} ${sizing}`}
    >
      <Icon className={size === 'md' ? 'h-3.5 w-3.5' : 'h-3 w-3'} strokeWidth={2.5} />
      {label}
    </span>
  );
}
