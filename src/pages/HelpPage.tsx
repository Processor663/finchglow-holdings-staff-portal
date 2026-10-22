import { LifeBuoy, Phone, Mail, Clock, MessageSquare, ChevronRight, Search } from 'lucide-react';
import { useState } from 'react';

const FAQS = [
  {
    q: 'How do I reset my portal password?',
    a: 'Use the “Forgot password” link on the sign-in page, or contact the IT service desk. Password resets can take up to 15 minutes to propagate.',
  },
  {
    q: 'Why can I not see a specific application?',
    a: 'Applications are shown based on your role and the selected subsidiary. Switch company using the company switcher in the sidebar, or ask your manager to confirm your access profile.',
  },
  {
    q: 'How do I report a critical incident?',
    a: 'Critical incidents should be phoned through to the 24/7 operations desk. After hours, follow the escalation chain listed in the incident response runbook.',
  },
  {
    q: 'How do I switch between subsidiaries?',
    a: 'Use the company switcher in the sidebar (desktop) or the top of the mobile menu. Only companies your profile has access to will appear.',
  },
  {
    q: 'Who do I contact about access requests?',
    a: 'New access requests are handled by the People & IT teams. Submit a request through HR Self-Service or email itaccess@finchglow.example.',
  },
];

const CHANNELS = [
  { Icon: Phone, label: 'IT Service Desk', value: '+234 1 270 1234', note: '24/7' },
  { Icon: Mail, label: 'Email Support', value: 'support@finchglow.example', note: 'Replies within 4h' },
  { Icon: MessageSquare, label: 'Live Chat', value: 'Available in the portal', note: 'Mon–Fri, 08:00–18:00 WAT' },
];

export function HelpPage() {
  const [search, setSearch] = useState('');
  const faqs = FAQS.filter(
    (f) =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-card dark:border-ink-800 dark:bg-ink-900">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl accent-soft-bg accent-text">
            <LifeBuoy className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-ink-900 dark:text-white">Help &amp; Support</h1>
            <p className="text-sm text-ink-500 dark:text-ink-400">
              Find answers, contact support, and raise requests.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {CHANNELS.map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-ink-200 bg-white p-5 shadow-card dark:border-ink-800 dark:bg-ink-900"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl accent-soft-bg accent-text">
              <c.Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-3 text-sm font-semibold text-ink-900 dark:text-white">{c.label}</h3>
            <p className="mt-1 text-sm text-ink-600 dark:text-ink-300">{c.value}</p>
            <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-ink-400">
              <Clock className="h-3 w-3" /> {c.note}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-ink-200 bg-white shadow-card dark:border-ink-800 dark:bg-ink-900">
        <div className="border-b border-ink-100 px-5 py-4 dark:border-ink-800">
          <h2 className="text-base font-bold text-ink-900 dark:text-white">Frequently asked questions</h2>
        </div>
        <div className="border-b border-ink-100 p-4 dark:border-ink-800">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search FAQs…"
              className="w-full rounded-lg border border-ink-200 bg-ink-50 py-2 pl-9 pr-3 text-sm text-ink-800 placeholder:text-ink-400 focus:border-transparent focus:bg-white dark:border-ink-700 dark:bg-ink-800 dark:text-ink-100 dark:focus:bg-ink-900"
              aria-label="Search FAQs"
            />
          </div>
        </div>
        <ul className="divide-y divide-ink-100 dark:divide-ink-800">
          {faqs.length === 0 ? (
            <li className="px-5 py-10 text-center text-sm text-ink-400">
              No FAQs match “{search}”.
            </li>
          ) : (
            faqs.map((f) => (
              <li key={f.q}>
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-medium text-ink-800 dark:text-ink-100">
                    {f.q}
                    <ChevronRight className="h-4 w-4 shrink-0 text-ink-400 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="px-5 pb-4 text-sm leading-relaxed text-ink-500 dark:text-ink-400">
                    {f.a}
                  </p>
                </details>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
