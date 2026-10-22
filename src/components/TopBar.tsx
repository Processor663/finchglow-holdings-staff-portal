import { useEffect, useMemo, useRef, useState } from 'react';
import { Bell, Menu, Moon, Search, Sun, X, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePortal } from '../context';
import { APPLICATIONS, NEWS } from '../data';

export function TopBar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { theme, toggleTheme, query, setQuery, selectedCompanyId, employee } = usePortal();
  const navigate = useNavigate();
  const [focused, setFocused] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  const unreadCount = useMemo(
    () => NEWS.filter((n) => n.severity === 'critical' || n.severity === 'warning').length,
    [],
  );

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBellOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { apps: [], news: [] };
    const apps = APPLICATIONS.filter(
      (a) => a.companyIds.includes(selectedCompanyId) || a.companyIds.includes('group'),
    ).filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q),
    );
    const news = NEWS.filter(
      (n) => n.scope === 'group' || n.scope === selectedCompanyId,
    ).filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.summary.toLowerCase().includes(q),
    );
    return { apps: apps.slice(0, 5), news: news.slice(0, 5) };
  }, [query, selectedCompanyId]);

  const hasResults = results.apps.length > 0 || results.news.length > 0;
  const showDropdown = focused && query.trim().length > 0;
  const initials = employee.name.split(' ').map((n) => n[0]).slice(0, 2).join('');

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-ink-200 bg-white/90 px-4 backdrop-blur dark:border-ink-800 dark:bg-ink-900/90 lg:px-6">
      <button
        type="button"
        onClick={onOpenMenu}
        className="rounded-lg p-2 text-ink-500 hover:bg-ink-100 lg:hidden dark:text-ink-300 dark:hover:bg-ink-800"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative flex-1 max-w-xl">
        <label htmlFor="portal-search" className="sr-only">
          Search applications and news
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            id="portal-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder="Search applications, news…"
            className="w-full rounded-lg border border-ink-200 bg-ink-50 py-2 pl-9 pr-9 text-sm text-ink-800 placeholder:text-ink-400 transition-colors focus:border-transparent focus:bg-white dark:border-ink-700 dark:bg-ink-800 dark:text-ink-100 dark:focus:bg-ink-900"
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-ink-400 hover:text-ink-700 dark:hover:text-ink-200"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {showDropdown && (
          <div className="absolute left-0 right-0 top-full z-40 mt-2 animate-slide-down overflow-hidden rounded-xl border border-ink-200 bg-white shadow-overlay dark:border-ink-700 dark:bg-ink-900">
            {hasResults ? (
              <div className="max-h-[60vh] overflow-y-auto scrollbar-thin">
                {results.apps.length > 0 && (
                  <div className="p-2">
                    <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink-400">
                      Applications
                    </div>
                    {results.apps.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onMouseDown={() => {
                          navigate(`/apps/${a.id}`);
                          setQuery('');
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left hover:bg-ink-50 dark:hover:bg-ink-800"
                      >
                        <span className="flex-1 truncate text-sm text-ink-800 dark:text-ink-100">{a.name}</span>
                        <span className="text-[11px] text-ink-400">{a.category}</span>
                      </button>
                    ))}
                  </div>
                )}
                {results.news.length > 0 && (
                  <div className="border-t border-ink-100 p-2 dark:border-ink-800">
                    <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink-400">
                      News & Alerts
                    </div>
                    {results.news.map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onMouseDown={() => {
                          navigate('/news');
                          setQuery('');
                        }}
                        className="flex w-full items-start gap-2 rounded-lg px-2 py-2 text-left hover:bg-ink-50 dark:hover:bg-ink-800"
                      >
                        <span className="flex-1">
                          <span className="block truncate text-sm text-ink-800 dark:text-ink-100">{n.title}</span>
                          <span className="block truncate text-[11px] text-ink-400">{n.summary}</span>
                        </span>
                        <ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0 text-ink-300" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="px-4 py-6 text-center text-sm text-ink-400">
                No results for “{query.trim()}”.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-lg p-2 text-ink-500 transition-colors hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <div className="relative" ref={bellRef}>
          <button
            type="button"
            onClick={() => setBellOpen((o) => !o)}
            className="relative rounded-lg p-2 text-ink-500 transition-colors hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
            aria-label={`Notifications, ${unreadCount} unread`}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>
          {bellOpen && (
            <div className="absolute right-0 top-full z-40 mt-2 w-80 animate-slide-down overflow-hidden rounded-xl border border-ink-200 bg-white shadow-overlay dark:border-ink-700 dark:bg-ink-900">
              <div className="border-b border-ink-100 px-4 py-3 text-sm font-semibold dark:border-ink-800">
                Recent alerts
              </div>
              <div className="max-h-80 overflow-y-auto scrollbar-thin">
                {NEWS.filter((n) => n.scope === 'group' || n.scope === selectedCompanyId)
                  .slice(0, 6)
                  .map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => {
                        navigate('/news');
                        setBellOpen(false);
                      }}
                      className="block w-full border-b border-ink-50 px-4 py-3 text-left last:border-0 hover:bg-ink-50 dark:border-ink-800/60 dark:hover:bg-ink-800"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 shrink-0 rounded-full ${
                            n.severity === 'critical'
                              ? 'bg-red-500'
                              : n.severity === 'warning'
                                ? 'bg-amber-500'
                                : 'bg-sky-500'
                          }`}
                        />
                        <span className="truncate text-sm font-medium text-ink-800 dark:text-ink-100">
                          {n.title}
                        </span>
                      </div>
                      <div className="mt-1 line-clamp-2 text-[12px] text-ink-400">{n.summary}</div>
                    </button>
                  ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  navigate('/news');
                  setBellOpen(false);
                }}
                className="block w-full px-4 py-2.5 text-center text-sm font-medium accent-text hover:bg-ink-50 dark:hover:bg-ink-800"
              >
                View all alerts
              </button>
            </div>
          )}
        </div>

        <div className="ml-1 hidden items-center gap-2.5 sm:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-full accent-gradient text-xs font-bold text-white">
            {initials}
          </div>
          <div className="hidden leading-tight md:block">
            <div className="text-sm font-semibold text-ink-800 dark:text-ink-100">{employee.name}</div>
            <div className="text-[11px] text-ink-400">{employee.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
