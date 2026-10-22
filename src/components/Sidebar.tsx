import { Home, LayoutGrid, Newspaper, LifeBuoy, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { usePortal } from '../context';
import { BrandMark } from './BrandMark';
import { CompanySwitcher } from './CompanySwitcher';

const NAV_ITEMS: { to: string; label: string; Icon: typeof Home; end?: boolean }[] = [
  { to: '/', label: 'Home', Icon: Home, end: true },
  { to: '/applications', label: 'My Applications', Icon: LayoutGrid },
  { to: '/news', label: 'News & Alerts', Icon: Newspaper },
  { to: '/help', label: 'Help & Support', Icon: LifeBuoy },
];

export function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const { employee, theme } = usePortal();
  const initials = employee.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink-950/50 animate-fade-in lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-ink-200 bg-white transition-transform duration-200 dark:border-ink-800 dark:bg-ink-900 lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Primary navigation"
      >
        <div className="flex items-center justify-between px-4 py-4">
          <NavLink to="/" onClick={onClose}>
            <BrandMark />
          </NavLink>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-ink-400 hover:bg-ink-100 lg:hidden dark:hover:bg-ink-800"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-3 pb-3">
          <CompanySwitcher />
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {NAV_ITEMS.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'accent-soft-bg accent-soft-text'
                    : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900 dark:text-ink-300 dark:hover:bg-ink-800 dark:hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`h-[18px] w-[18px] shrink-0 ${isActive ? 'accent-text' : 'text-ink-400 group-hover:text-ink-600 dark:group-hover:text-ink-200'}`}
                    strokeWidth={2.25}
                  />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-ink-200 p-3 dark:border-ink-800">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full accent-gradient text-xs font-bold text-white">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-ink-800 dark:text-ink-100">
                {employee.name}
              </div>
              <div className="truncate text-[11px] text-ink-400">{employee.role}</div>
            </div>
          </div>
          <div className="mt-1 px-2 text-[10px] text-ink-300 dark:text-ink-500">
            {theme === 'dark' ? 'Dark' : 'Light'} mode · prototype
          </div>
        </div>
      </aside>
    </>
  );
}
