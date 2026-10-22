# Finchglow Holdings Group Staff Portal

A single-entry internal portal for the Finchglow Holdings group of companies. Staff see every tool, alert and support channel relevant to their role and selected subsidiary in one place, without navigating to separate URLs or guessing which systems they have access to.

> **Prototype notice:** This is a front-end prototype with mock data. Sign-in is not implemented, and no live API calls or external systems are connected. All data lives in `src/data.ts`.

**Live demo:** [add deployed URL here]
**Design decisions:** see the [Decision Log](./DECISION_LOG.md) for the reasoning, alternatives considered and trade-offs behind the main choices.

[Add two screenshots here: one in light mode and one in dark mode, each showing a different company accent colour.]

---

## Getting started

**Requirements:** Node.js 20.19 or later (required by Vite 7) and npm.

```bash
npm install
npm run dev
```

Then open the local URL printed in the terminal (Vite defaults to `http://localhost:5173`).

To run the checks:

```bash
npm run test        # full test suite
npm run typecheck   # TypeScript, no emit
npm run lint        # ESLint
npm run build       # production build to dist/
```

---

## What the portal does

| Page | Route | Purpose |
|------|-------|---------|
| Home | `/` | Personalised greeting, critical incident banner, quick-access app grid (top 6), recent news feed |
| My Applications | `/applications` | Full list of tools available for the selected company, each linking to a detail page |
| App Detail | `/apps/:appId` | Per-app overview: description, availability by company, launch button (when accessible), quick-action links |
| News & Alerts | `/news` | Full filtered news feed with severity filters (All / Critical / Warnings / Info) plus the critical banner |
| Help & Support | `/help` | Support channels (phone, email, chat) and a searchable FAQ list |

Unknown routes redirect to the home page.

### Company switcher

The sidebar includes a company switcher that filters visible applications and news to the selected subsidiary. Switching companies also changes the accent colour throughout the interface. Each subsidiary has its own brand colour, applied via CSS custom properties.

### Dark mode

A light/dark theme toggle sits in the top bar. The preference persists in `localStorage` and defaults to the operating system's colour scheme on first visit.

### Global search

The top bar search box filters applications and news items scoped to the selected company, with a dropdown of clickable results that navigate to the relevant page.

### Critical incident banner

Critical-severity incidents appear as a dismissible red banner at the top of the home and news pages. Each incident can be expanded to show recommended actions. The banner respects company scope: group-wide incidents show for all companies, and company-specific incidents show only when that company is selected.

### Responsive layout

The sidebar is a persistent column on desktop and an off-canvas drawer on mobile, opened from a hamburger button in the top bar.

---

## Tech stack

- **React 18** with TypeScript
- **Vite 7** for the dev server and builds
- **React Router 7** for client-side routing (`BrowserRouter`)
- **Tailwind CSS 3** for styling, with a custom `ink` colour ramp and a CSS-variable-driven accent system
- **Lucide React** for icons
- **Vitest 5** and **Testing Library** for tests

No backend is connected. See [Path to production](#path-to-production) for how the data layer would be replaced.

---

## Project structure

```
src/
├── App.tsx                 # Shell layout + route definitions
├── main.tsx                # Entry point, wraps app in BrowserRouter
├── context.tsx             # PortalProvider: theme, company, search, accent
├── data.ts                 # Mock data: companies, employee, applications, news
├── types.ts                # TypeScript types for all domain entities
├── index.css               # Tailwind layers + accent CSS custom property utilities
├── components/
│   ├── Applications.tsx    # ApplicationsGrid + AppCard (links to /apps/:id)
│   ├── BrandMark.tsx       # Feather logo + wordmark
│   ├── CompanySwitcher.tsx # Dropdown to select subsidiary (sidebar/inline variants)
│   ├── CriticalBanner.tsx  # Dismissible critical incident alerts
│   ├── NewsFeed.tsx        # Filtered, severity-sorted news list
│   ├── SeverityBadge.tsx   # Colour + text badge for critical/warning/info
│   ├── Sidebar.tsx         # Navigation + company switcher + employee profile
│   ├── TopBar.tsx          # Search, theme toggle, notifications bell, avatar
│   └── Welcome.tsx         # Greeting card with employee + company info
├── pages/
│   ├── Views.tsx           # HomePage, ApplicationsPage, NewsPage
│   ├── AppDetailPage.tsx   # Per-application detail view
│   └── HelpPage.tsx        # Support channels + searchable FAQs
└── test/
    ├── setup.ts            # Vitest setup: jest-dom matchers, matchMedia mock
    ├── utils.tsx           # renderWithProviders helper (PortalProvider + MemoryRouter)
    ├── data.test.ts        # Mock data integrity
    ├── context.test.tsx    # Portal context state
    ├── SeverityBadge.test.tsx
    ├── Applications.test.tsx
    ├── NewsFeed.test.tsx
    ├── AppDetailPage.test.tsx
    └── App.test.tsx        # Full routing + navigation
```

---

## Accent colour system

Each company defines an `accent` hex colour and a softer variant. When the user switches companies, `PortalProvider` sets CSS custom properties on `<html>`:

| Variable | Used by | Example |
|----------|---------|---------|
| `--accent` | `.accent-bg`, `.accent-text`, `.accent-gradient` | `#0284c7` (Travels) |
| `--accent-soft` | `.accent-soft-bg` | `#f0f9ff` |
| `--accent-strong` | `.accent-soft-text`, gradient end | `#0369a1` |
| `--accent-soft-border` | `.accent-soft-border` | `#bae6fd` |

These are consumed by static utility classes in `index.css`, so Tailwind's JIT compiler sees concrete class names (not dynamically built ones) and keeps them in the bundle. The reasoning is in decision D-002.

---

## Available scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server with hot reload |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run typecheck` | TypeScript type checking (no emit) |
| `npm run test` | Run the full test suite once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | ESLint across the project |

---

## Testing

The suite uses Vitest with jsdom and React Testing Library. Each test gets a fresh DOM and portal context. The `renderWithProviders` helper wraps components in both `PortalProvider` and `MemoryRouter`, so routing and context work without a real browser.

```bash
npm run test
```

**43 tests across 7 files** covering:

- Mock data integrity (company IDs, app references, news timestamps, employee access)
- Portal context state (theme toggle and persistence, company switching, accent updates, query state, error on missing provider)
- Component rendering (severity badges, application grid filtering, news feed scoping, filtering and sorting)
- Page-level routing (navigation between all pages, app detail with valid and invalid IDs, launch button visibility, unknown route redirect)

---

## Mock data reference

All data lives in `src/data.ts`:

- **7 companies:** Finchglow Holdings (group) plus 6 subsidiaries (Academy, Travels, B2B, TMC, Holidays, Facilities)
- **10 applications:** each scoped to one or more companies; `group`-scoped apps are visible everywhere
- **9 news items:** severity-ranked (critical > warning > info), scoped to the group or a specific company
- **1 employee:** Amadi Miracle, Travel Operations Officer, based at Travels, with access to group, travels, b2b and holidays

---

## Deployment note

The app uses `BrowserRouter`, so the host must rewrite unknown paths to `index.html`, otherwise deep links such as `/apps/:appId` return a 404 on refresh. The build includes `dist/_redirects` with:

```
/* /index.html 200
```

Hosts that support this file format (for example Netlify) work without further configuration. Other hosts need an equivalent rewrite rule.

---

## Known limitations

- **Mock data only.** Nothing persists except the theme preference, and the selected company resets each session.
- **No real authentication.** The employee profile is mocked.
- **Client-side filtering is not a security boundary.** Company scoping is a UX feature here; real access control must be enforced server-side.
- **The mobile drawer does not trap focus** and has no swipe-to-close gesture.
- **Accent colours are defined in two places** (`data.ts` and lookup maps in `context.tsx`).
- **No visual regression or end-to-end tests.** Coverage is unit and integration level (jsdom).

---

## Path to production

The prototype is structured so that the following changes would take it towards production:

1. **Replace `src/data.ts`** with data-fetching hooks backed by a real data source (for example Supabase tables for companies, employees, applications and news).
2. **Add authentication** (for example Supabase Auth with email/password) and derive the employee profile from the signed-in user instead of mock data.
3. **Replace mock launch URLs** with authenticated SSO redirects or embedded sessions.
4. **Enforce access server-side** (for example row-level security policies) so employees only see the companies and applications their profile grants.
5. **Wire the news feed** to a real incidents/announcements source with realtime updates.

See decision D-010 in the Decision Log for the reasoning.