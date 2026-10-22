import { useMemo, useState } from 'react';
import { Filter as FilterIcon, Inbox, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NEWS, companyById } from '../data';
import type { Severity, NewsItem } from '../types';
import { usePortal } from '../context';
import { SeverityBadge } from './SeverityBadge';

type SeverityFilter = 'all' | Severity;

const FILTERS: { id: SeverityFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'critical', label: 'Critical' },
  { id: 'warning', label: 'Warnings' },
  { id: 'info', label: 'Info' },
];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600_000);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export function NewsFeed({ compact = false }: { compact?: boolean }) {
  const { selectedCompanyId } = usePortal();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<SeverityFilter>('all');

  const items = useMemo(() => {
    const scoped = NEWS.filter((n) => n.scope === 'group' || n.scope === selectedCompanyId);
    const filtered = filter === 'all' ? scoped : scoped.filter((n) => n.severity === filter);
    return [...filtered].sort(
      (a, b) =>
        SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity] ||
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
  }, [selectedCompanyId, filter]);

  return (
    <div className="rounded-2xl border border-ink-200 bg-white shadow-card dark:border-ink-800 dark:bg-ink-900">
      <div className="flex items-center justify-between gap-3 border-b border-ink-100 px-5 py-4 dark:border-ink-800">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-ink-900 dark:text-white">News &amp; Alerts</h2>
          {!compact && (
            <span className="rounded-full bg-ink-100 px-2 py-0.5 text-[11px] font-semibold text-ink-500 dark:bg-ink-800 dark:text-ink-400">
              {items.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <FilterIcon className="hidden h-3.5 w-3.5 text-ink-400 sm:block" />
          <div className="flex items-center gap-1 rounded-lg bg-ink-100 p-0.5 dark:bg-ink-800">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                aria-pressed={filter === f.id}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  filter === f.id
                    ? 'bg-white text-ink-800 shadow-sm dark:bg-ink-700 dark:text-white'
                    : 'text-ink-500 hover:text-ink-800 dark:text-ink-400 dark:hover:text-ink-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState filter={filter} />
      ) : (
        <ul className="divide-y divide-ink-100 dark:divide-ink-800">
          {items.slice(0, compact ? 4 : undefined).map((n) => (
            <NewsRow key={n.id} item={n} />
          ))}
        </ul>
      )}
      {compact && items.length > 4 && (
        <div className="border-t border-ink-100 px-5 py-2.5 dark:border-ink-800">
          <button
            type="button"
            onClick={() => navigate('/news')}
            className="text-xs font-semibold accent-text hover:underline"
          >
            View all {items.length} items
          </button>
        </div>
      )}
    </div>
  );
}

const SEVERITY_RANK: Record<Severity, number> = { critical: 3, warning: 2, info: 1 };

function NewsRow({ item }: { item: NewsItem }) {
  const isGroup = item.scope === 'group';
  const company = companyById(item.scope);
  return (
    <li className="group flex gap-3 px-5 py-4 transition-colors hover:bg-ink-50/60 dark:hover:bg-ink-800/40">
      <span
        className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
          item.severity === 'critical'
            ? 'bg-red-500 ring-2 ring-red-200 dark:ring-red-900/60'
            : item.severity === 'warning'
              ? 'bg-amber-500 ring-2 ring-amber-200 dark:ring-amber-900/60'
              : 'bg-sky-500 ring-2 ring-sky-200 dark:ring-sky-900/60'
        }`}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <SeverityBadge severity={item.severity} />
          <span className="text-[11px] font-medium uppercase tracking-wide text-ink-400">
            {isGroup ? 'Group-wide' : company.shortName}
          </span>
          <span className="text-[11px] text-ink-400">· {timeAgo(item.publishedAt)}</span>
        </div>
        <h3 className="mt-1.5 text-sm font-semibold text-ink-900 dark:text-ink-100">
          {item.title}
        </h3>
        <p className="mt-1 text-[13px] leading-relaxed text-ink-500 dark:text-ink-400">
          {item.summary}
        </p>
        {item.linkLabel && (
          <button
            type="button"
            className="mt-2.5 inline-flex items-center gap-0.5 text-xs font-semibold accent-text hover:underline"
          >
            {item.linkLabel}
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </li>
  );
}

function EmptyState({ filter }: { filter: SeverityFilter }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-100 text-ink-400 dark:bg-ink-800 dark:text-ink-500">
        <Inbox className="h-6 w-6" />
      </div>
      <p className="mt-3 text-sm font-semibold text-ink-700 dark:text-ink-200">No items to show</p>
      <p className="mt-1 text-xs text-ink-400">
        {filter === 'all'
          ? 'There is no news or alerts for the selected company right now.'
          : `No ${filter} alerts match the selected company. Try another filter.`}
      </p>
    </div>
  );
}
