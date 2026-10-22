import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  Building2,
  Tag,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { APPLICATIONS, companyById } from '../data';
import { usePortal } from '../context';
import { ICONS } from '../components/Applications';

export function AppDetailPage() {
  const { appId } = useParams<{ appId: string }>();
  const navigate = useNavigate();
  const { selectedCompanyId } = usePortal();

  const app = APPLICATIONS.find((a) => a.id === appId);

  if (!app) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-xl font-bold text-ink-900 dark:text-white">Application not found</h1>
        <p className="mt-2 text-sm text-ink-500">
          The application you’re looking for doesn’t exist or has been removed.
        </p>
        <Link
          to="/applications"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold accent-text hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to applications
        </Link>
      </div>
    );
  }

  const Icon = ICONS[app.icon];
  const accessible = app.companyIds.includes(selectedCompanyId) || app.companyIds.includes('group');
  const availableCompanies = app.companyIds
    .filter((id) => id !== 'group')
    .map((id) => companyById(id));

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition-colors hover:text-ink-800 dark:text-ink-400 dark:hover:text-ink-100"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-card dark:border-ink-800 dark:bg-ink-900 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl accent-soft-bg accent-text">
              <Icon className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-ink-900 dark:text-white sm:text-2xl">{app.name}</h1>
              <p className="mt-1 max-w-lg text-sm leading-relaxed text-ink-500 dark:text-ink-400">
                {app.description}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-ink-50 px-2.5 py-1 text-[11px] font-medium text-ink-600 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-300">
                  <Tag className="h-3 w-3" /> {app.category}
                </span>
                {accessible ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300">
                    <CheckCircle2 className="h-3 w-3" /> Available for your company
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 dark:border-amber-900 dark:bg-amber-950/60 dark:text-amber-300">
                    <Lock className="h-3 w-3" /> Not available for selected company
                  </span>
                )}
              </div>
            </div>
          </div>

          {accessible && (
            <a
              href={app.launchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl accent-gradient px-5 py-3 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5"
            >
              Launch {app.name}
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-card dark:border-ink-800 dark:bg-ink-900">
          <h2 className="flex items-center gap-2 text-sm font-bold text-ink-900 dark:text-white">
            <Building2 className="h-4 w-4 text-ink-400" /> Available in companies
          </h2>
          <ul className="mt-3 space-y-2">
            {availableCompanies.map((c) => (
              <li key={c.name} className="flex items-center gap-2 text-sm text-ink-600 dark:text-ink-300">
                <span className="h-2 w-2 rounded-full accent-bg" />
                {c.name}
              </li>
            ))}
            {app.companyIds.includes('group') && (
              <li className="flex items-center gap-2 text-sm text-ink-600 dark:text-ink-300">
                <span className="h-2 w-2 rounded-full accent-bg" />
                Finchglow Holdings (Group-wide)
              </li>
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-card dark:border-ink-800 dark:bg-ink-900">
          <h2 className="text-sm font-bold text-ink-900 dark:text-white">Quick actions</h2>
          <div className="mt-3 space-y-2">
            <Link
              to="/news"
              className="block rounded-lg border border-ink-200 px-3 py-2.5 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-50 dark:border-ink-700 dark:text-ink-200 dark:hover:bg-ink-800"
            >
              View related alerts &amp; incidents
            </Link>
            <Link
              to="/help"
              className="block rounded-lg border border-ink-200 px-3 py-2.5 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-50 dark:border-ink-700 dark:text-ink-200 dark:hover:bg-ink-800"
            >
              Get support for this tool
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-ink-200 bg-ink-50/50 p-5 text-sm text-ink-500 dark:border-ink-700 dark:bg-ink-800/40 dark:text-ink-400">
        <p className="font-medium text-ink-700 dark:text-ink-200">Prototype notice</p>
        <p className="mt-1">
          This is a frontend prototype with mock data. In production, launching {app.name} would
          open an authenticated session at {app.launchUrl}.
        </p>
      </div>
    </div>
  );
}
