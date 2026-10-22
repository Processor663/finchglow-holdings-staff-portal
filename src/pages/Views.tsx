import { LayoutGrid, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Welcome } from '../components/Welcome';
import { CriticalBanner } from '../components/CriticalBanner';
import { ApplicationsGrid } from '../components/Applications';
import { NewsFeed } from '../components/NewsFeed';

export function HomePage() {
  return (
    <div className="space-y-6">
      <Welcome />
      <CriticalBanner />

      <section>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-ink-400" />
            <h2 className="text-base font-bold text-ink-900 dark:text-white">Your applications</h2>
          </div>
          <Link
            to="/applications"
            className="inline-flex items-center gap-1 text-xs font-semibold accent-text hover:underline"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <ApplicationsGrid limit={6} />
      </section>

      <section>
        <NewsFeed compact />
      </section>
    </div>
  );
}

export function ApplicationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-ink-900 dark:text-white">My Applications</h1>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
          Tools available to you for the selected company. Click any app to view details and launch.
        </p>
      </div>
      <ApplicationsGrid />
    </div>
  );
}

export function NewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-ink-900 dark:text-white">News &amp; Alerts</h1>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
          Group-wide and company-specific announcements, warnings, and critical incidents.
        </p>
      </div>
      <CriticalBanner />
      <NewsFeed />
    </div>
  );
}
