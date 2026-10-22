import {
  Plane,
  Users,
  Briefcase,
  GraduationCap,
  UserCog,
  Building2,
  Headset,
  Globe,
  Calendar,
  Wallet,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { AppIconName } from '../types';
import { usePortal } from '../context';
import { APPLICATIONS } from '../data';

export const ICONS: Record<AppIconName, LucideIcon> = {
  plane: Plane,
  users: Users,
  briefcase: Briefcase,
  graduationCap: GraduationCap,
  userCog: UserCog,
  building: Building2,
  headset: Headset,
  globe: Globe,
  calendar: Calendar,
  wallet: Wallet,
};

function useVisibleApps() {
  const { selectedCompanyId } = usePortal();
  return useMemo(
    () =>
      APPLICATIONS.filter(
        (a) => a.companyIds.includes(selectedCompanyId) || a.companyIds.includes('group'),
      ),
    [selectedCompanyId],
  );
}

export function ApplicationsGrid({ limit }: { limit?: number }) {
  const apps = useVisibleApps();
  const shown = limit ? apps.slice(0, limit) : apps;

  if (shown.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink-200 bg-ink-50/50 p-10 text-center dark:border-ink-700 dark:bg-ink-800/40">
        <p className="text-sm font-semibold text-ink-600 dark:text-ink-300">No applications available</p>
        <p className="mt-1 text-xs text-ink-400">
          There are no applications for the selected company assigned to your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {shown.map((app) => (
        <AppCard key={app.id} appId={app.id} />
      ))}
    </div>
  );
}

function AppCard({ appId }: { appId: string }) {
  const app = APPLICATIONS.find((a) => a.id === appId)!;
  const Icon = ICONS[app.icon];

  return (
    <Link
      to={`/apps/${app.id}`}
      className="group relative flex flex-col items-start rounded-2xl border border-ink-200 bg-white p-5 text-left shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-ink-300 hover:shadow-cardHover focus-visible:shadow-cardHover dark:border-ink-800 dark:bg-ink-900 dark:hover:border-ink-700"
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl accent-soft-bg accent-text">
          <Icon className="h-[22px] w-[22px]" strokeWidth={2} />
        </div>
        <ArrowUpRight className="h-4 w-4 text-ink-300 transition-all group-hover:text-ink-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 dark:text-ink-600 dark:group-hover:text-ink-300" />
      </div>
      <h3 className="mt-4 text-[15px] font-semibold text-ink-900 dark:text-white">
        {app.name}
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-ink-500 dark:text-ink-400">
        {app.description}
      </p>
      <div className="mt-4 flex w-full items-center justify-between">
        <span className="inline-flex items-center rounded-full border border-ink-200 bg-ink-50 px-2.5 py-0.5 text-[11px] font-medium text-ink-500 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-400">
          {app.category}
        </span>
        <span className="text-[11px] font-semibold accent-text opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          Open
        </span>
      </div>
    </Link>
  );
}
