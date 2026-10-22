import { ShieldAlert, ExternalLink, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NEWS, companyById } from '../data';
import { usePortal } from '../context';
import { SeverityBadge } from './SeverityBadge';

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600_000);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export function CriticalBanner() {
  const { selectedCompanyId } = usePortal();
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<string | null>(null);

  const incidents = useMemo(
    () =>
      NEWS.filter((n) => n.severity === 'critical' && !dismissed.has(n.id)).filter(
        (n) => n.scope === 'group' || n.scope === selectedCompanyId,
      ),
    [selectedCompanyId, dismissed],
  );

  if (incidents.length === 0) return null;

  return (
    <div className="space-y-3" role="alert" aria-live="assertive">
      {incidents.map((n) => {
        const isGroup = n.scope === 'group';
        const company = companyById(n.scope);
        const open = expanded === n.id;
        return (
          <div
            key={n.id}
            className="overflow-hidden rounded-2xl border-2 border-red-400 bg-red-50 shadow-card dark:border-red-800/80 dark:bg-red-950/40"
          >
            <div className="flex flex-col gap-3 p-4 sm:items-center sm:p-5 md:flex-row">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white">
                  <ShieldAlert className="h-5 w-5" strokeWidth={2.25} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <SeverityBadge severity="critical" />
                    <span className="text-[11px] font-medium uppercase tracking-wide text-red-700/80 dark:text-red-300/80">
                      {isGroup ? "Group-wide" : company.shortName}
                    </span>
                    <span className="text-[11px] text-red-700/70 dark:text-red-300/60">
                      · {timeAgo(n.publishedAt)}
                    </span>
                  </div>
                  <h2 className="mt-1.5 text-base font-bold text-red-900 dark:text-red-100 sm:text-lg">
                    {n.title}
                  </h2>
                  <p
                    className={`mt-1 text-sm text-red-800/90 dark:text-red-200/85 ${
                      open ? "" : "line-clamp-2"
                    }`}
                  >
                    {n.summary}
                  </p>
                  {open && (
                    <div className="mt-3 rounded-lg border border-red-300 bg-white/60 p-3 text-sm text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100">
                      <p className="font-semibold">Recommended actions</p>
                      <ul className="mt-1.5 list-disc space-y-1 pl-5 text-red-800 dark:text-red-200">
                        <li>
                          Follow the incident response runbook for payment
                          gateway failures.
                        </li>
                        <li>
                          Switch to the approved alternative payment workflow
                          documented in the ops wiki.
                        </li>
                        <li>
                          Log every affected booking in the incident tracker for
                          reconciliation.
                        </li>
                        <li>
                          Notify the duty supervisor if a customer escalates
                          beyond tier-1.
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => setExpanded(open ? null : n.id)}
                  className="w-full inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500"
                >
                  {n.linkLabel ?? "View incident details"}
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDismissed((s) => new Set(s).add(n.id))}
                  className="rounded-lg p-2 text-red-700/70 transition-colors hover:bg-red-100 dark:text-red-300/70 dark:hover:bg-red-900/40"
                  aria-label="Dismiss alert"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
      <button
        type="button"
        onClick={() => navigate('/news')}
        className="text-xs font-medium text-ink-400 hover:text-ink-700 dark:hover:text-ink-200"
      >
        View all incidents in News &amp; Alerts →
      </button>
    </div>
  );
}
