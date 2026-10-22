import { CalendarDays } from 'lucide-react';
import { usePortal } from '../context';
import { companyById } from '../data';

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-NG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function Welcome() {
  const { employee, selectedCompanyId } = usePortal();
  const company = companyById(selectedCompanyId);

  return (
    <section className="rounded-2xl border border-ink-200 bg-white p-5 shadow-card dark:border-ink-800 dark:bg-ink-900 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-ink-400">
            {greeting()},
          </p>
          <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-ink-900 dark:text-white sm:text-[28px]">
            {employee.firstName}
          </h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">
            Welcome to your Finchglow workspace.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-ink-50 px-2.5 py-1 font-medium text-ink-600 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-300">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: company.accent }} />
              {company.name}
            </span>
            <span className="inline-flex items-center rounded-full border border-ink-200 bg-ink-50 px-2.5 py-1 font-medium text-ink-600 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-300">
              {employee.role}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start rounded-xl border border-ink-200 bg-ink-50 px-3 py-2 text-sm text-ink-500 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-300 sm:self-center">
          <CalendarDays className="h-4 w-4 text-ink-400" />
          <span className="font-medium">{formatDate()}</span>
        </div>
      </div>
    </section>
  );
}
