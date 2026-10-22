import { Feather } from 'lucide-react';

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg accent-gradient text-white shadow-sm">
        <Feather className="h-5 w-5" strokeWidth={2.25} />
      </div>
      {!compact && (
        <div className="leading-tight">
          <div className="text-[15px] font-bold tracking-tight text-ink-900 dark:text-white">
            Finchglow
          </div>
          <div className="text-[11px] font-medium uppercase tracking-wider text-ink-400 dark:text-ink-400">
            Holdings
          </div>
        </div>
      )}
    </div>
  );
}
