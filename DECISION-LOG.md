# Decision Log: Finchglow Holdings Group Staff Portal

A record of the architectural and design decisions made while building the Group Staff Portal prototype. Each entry gives the context, the options considered, the decision, the reasoning, and the trade-offs. The final section lists known limitations and what I would do next.

**Scope of this log:** a front-end prototype built within the 6-8 hour timebox of the case study. Decisions are judged against that constraint and against how easily the prototype could grow into a production system.

## Summary

| ID | Decision | Status |
|----|----------|--------|
| D-001 | Client-side routing with React Router instead of view-state switching | Implemented (revised from initial approach) |
| D-002 | CSS custom property accent system instead of dynamic Tailwind classes | Implemented |
| D-003 | Mock data in a single typed module instead of API integration | Implemented (prototype phase) |
| D-004 | Company-scoped filtering for applications and news | Implemented |
| D-005 | Vitest with jsdom and React Testing Library | Implemented |
| D-006 | Severity-based sorting and colour coding for news | Implemented |
| D-007 | Responsive sidebar with mobile drawer pattern | Implemented |
| D-008 | Stack: Vite, React, TypeScript, Tailwind CSS | Implemented |
| D-009 | Scope: what the prototype deliberately leaves out | Decided |
| D-010 | Production direction: Supabase with row-level security | Proposed (not built) |

Entries are ordered by ID, not by importance. D-008 to D-010 were added after the first draft of this log and cover the framing decisions.

---

## D-001: Client-side routing with React Router instead of view-state switching

**Date:** 2026-10-22
**Status:** Implemented (revised from the initial approach)

### Context

The portal has four top-level pages (Home, My Applications, News & Alerts, Help & Support) plus per-application detail pages. The first version used a `view` string in React context (`'home' | 'applications' | 'news' | 'help'`) with conditional rendering. It worked, but it had no URL history, no deep linking, no back-button support and no shareable URLs.

### Options considered

1. **Keep view-state switching.** Simplest, but fails the navigation basics above.
2. **React Router with `BrowserRouter`.** Real URLs, small cost.
3. **Hash-based routing.** Avoids the server redirect rule, but produces less clean URLs.

### Decision

Use `react-router-dom` v7 with `BrowserRouter`. Each page is a route (`/`, `/applications`, `/news`, `/help`, `/apps/:appId`). Unknown routes redirect to home.

### Reasoning

- **Deep linking and shareability.** Staff can bookmark an application detail page or send a news link to a colleague.
- **Browser back/forward.** Natural navigation works without custom history management.
- **Accessibility.** Each page is a distinct URL, which helps screen reader users orient themselves and move between pages.
- **Foundation for permissions.** Per-route access rules (for example, restricting an application page by company) are straightforward to add later.
- **Minimal cost.** `PortalProvider` got simpler once `view`/`setView` was removed. The sidebar uses `NavLink` for active styling, and the top bar uses `useNavigate`.

### Trade-offs

- Requires a server rewrite rule for client-side routes (handled by `dist/_redirects` with `/* /index.html 200`).
- Slightly more setup than view-state (router wrapper in `main.tsx`, `MemoryRouter` in test utilities).

---

## D-002: CSS custom property accent system instead of dynamic Tailwind classes

**Date:** 2026-10-22
**Status:** Implemented

### Context

Each of the seven entities (six subsidiaries plus the Group) has its own brand colour. When the user switches company, the accent must update across buttons, badges, icons, focus rings, gradients and soft backgrounds. Building class names such as `bg-${company.accentKey}-600` does not work, because Tailwind's JIT compiler cannot see dynamically constructed class names and purges them from the build.

### Options considered

1. **Dynamic Tailwind class names.** Rejected: purged at build time.
2. **Safelisting every colour/shade combination.** Works, but bloats the CSS and needs maintenance for every new colour.
3. **CSS custom properties with static utility classes.** Chosen.

### Decision

Set CSS custom properties (`--accent`, `--accent-soft`, `--accent-strong`, `--accent-soft-border`) on `<html>` from `PortalProvider`. Define static utility classes in `index.css` (`.accent-bg`, `.accent-text`, `.accent-gradient`, and so on) that reference those variables. Tailwind sees concrete class names and keeps them.

### Reasoning

- **Tailwind JIT compatibility.** Every class name is a static string.
- **Runtime flexibility.** Switching company updates variables only; no class swapping.
- **Dark mode support.** `--accent-ring-offset` adjusts per theme, and dark-mode focus rings use a separate rule.
- **Consistency.** Every accent-aware component uses the same small set of classes.

### Trade-offs

- Accent colours are defined in two places: hex values in `data.ts`, and the strong/border variants in lookup maps in `context.tsx`. A single source of truth would be cleaner but would require runtime colour manipulation.
- `STRONG_MAP` and `SOFT_BORDER_MAP` are hardcoded per accent hex, so adding a company colour means editing both maps.

---

## D-003: Mock data in a single typed module instead of API integration

**Date:** 2026-10-22
**Status:** Implemented (prototype phase)

### Context

This is a front-end prototype to demonstrate the portal experience. There is no live backend, and connecting to real systems is out of scope. The data shapes still need to be realistic enough that swapping in a real API later is a small change.

### Options considered

1. **Mock data module with TypeScript types.** Chosen.
2. **Mock API layer (for example MSW or a JSON server).** More realistic, but spends part of a tight timebox on infrastructure that adds little to the demonstration.
3. **Real backend from the start.** Out of scope for the brief.

### Decision

All mock data (companies, employee, applications, news) lives in `src/data.ts` as typed exports. `src/types.ts` defines every entity. Components import from `data.ts` directly.

### Reasoning

- **Fast iteration.** No network latency, auth setup or database provisioning.
- **Type safety.** The `AppItem`, `Company`, `Employee` and `NewsItem` interfaces act as the contract for future API responses.
- **Easy migration path.** Replacing `import { APPLICATIONS } from '../data'` with a data-fetching hook is a localised change per component (see D-010).
- **Testability.** Tests import the same data and assert against known values.

### Trade-offs

- No persistence. Theme is the only state that survives reload (via `localStorage`), and the selected company resets each session.
- The `hoursAgo()` helper makes news timestamps shift relative to load time, so exact time assertions in tests are unreliable. Tests use relative checks instead.

---

## D-004: Company-scoped filtering for applications and news

**Date:** 2026-10-22
**Status:** Implemented

### Context

The portal serves six subsidiaries plus group-wide services. An employee should see only the applications and news relevant to their selected company, plus group-wide items. The employee profile defines which companies they can access.

### Options considered

1. **Show everything and let users filter manually.** Simple, but noisy and wrong for the use case.
2. **Scope by selected company, with a `'group'` value for shared items.** Chosen.
3. **Separate data sets per company.** Duplicates group-wide items and is harder to maintain.

### Decision

Every application has a `companyIds` array and every news item has a `scope` field. The value `'group'` means visible regardless of selected company. Components filter with:

```
item.companyIds.includes(selectedCompanyId) || item.companyIds.includes('group')
```

The company switcher only offers companies in `employee.accessibleCompanyIds`.

### Reasoning

- **Mirrors a real security model.** It previews how row-level security policies would behave: visibility based on company membership.
- **Group-wide items.** HR Self-Service, Facilities Requests and group-wide incidents show for everyone, which matches the organisation's structure.
- **No server needed.** Pure client-side logic is enough for the prototype.

### Trade-offs

- In production, client-side filtering is a UX feature, not a security boundary. Real access control must be enforced server-side (see D-010).
- Someone inspecting the JS bundle could see all applications. Acceptable for a prototype, not for production.

---

## D-005: Vitest with jsdom and React Testing Library

**Date:** 2026-10-22
**Status:** Implemented

### Context

The project needs a test framework that works with Vite, supports React component testing and runs quickly. The suite should cover data integrity, context state, component rendering and full routing flows.

### Options considered

1. **Jest with Babel/ts-jest.** Familiar, but needs a separate transform pipeline alongside Vite.
2. **Vitest.** Shares Vite's pipeline. Chosen.
3. **Browser-based tests only (Playwright or Cypress).** Valuable for visual and end-to-end checks, but slower and heavier than needed for this timebox.

### Decision

Use Vitest with the jsdom environment and React Testing Library. A `renderWithProviders` helper wraps components in `PortalProvider` and `MemoryRouter`. Test setup mocks `window.matchMedia` (jsdom does not implement it) and cleans up the DOM after each test.

### Reasoning

- **Vite-native.** Same transform pipeline as the dev server, with no separate Jest or Babel config.
- **jsdom.** Enough for rendering and DOM assertions without a full browser.
- **Testing Library.** Encourages testing user-visible behaviour (text, roles, interactions) rather than implementation details.
- **MemoryRouter.** Tests can set `initialEntries` to exercise specific routes without URL side effects.

### Trade-offs

- jsdom cannot test layout or visuals, so visual regression needs a browser-based tool.
- `userEvent.setup()` is async, so interaction tests are slightly more verbose.
- Some text appears in several places (sidebar and top bar), so routing tests use `getAllByText` instead of `getByText`.

---

## D-006: Severity-based sorting and colour coding for news

**Date:** 2026-10-22
**Status:** Implemented

### Context

News items have three severity levels: critical, warning and info. The feed must surface the most urgent items first, and the critical banner must pull only critical items.

### Options considered

1. **Sort by date only.** Simple, but a fresh info item would bury an active incident.
2. **Severity first, then date.** Chosen.
3. **Separate sections per severity.** Clear, but fragments the feed and hides the timeline.

### Decision

Define a `SEVERITY_RANK` map (`critical: 3, warning: 2, info: 1`) and sort by rank first, then by `publishedAt` descending. The `SeverityBadge` component renders both a colour and a text label (for example "CRITICAL").

### Reasoning

- **Prioritisation.** Critical incidents always appear at the top.
- **Accessibility.** Colour alone fails WCAG guidance on use of colour. The text label conveys severity redundantly, which helps colour-blind users.
- **One component.** `SeverityBadge` is reused in `NewsFeed` rows and `CriticalBanner`, keeping the two consistent.

### Trade-offs

- A very old critical item still outranks a fresh warning. This is intentional, but it could be revisited (for example, by auto-expiring resolved incidents) if stale criticals become a problem.

---

## D-007: Responsive sidebar with mobile drawer pattern

**Date:** 2026-10-22
**Status:** Implemented

### Context

The portal must work on phones, tablets and desktops. A persistent sidebar suits desktop, but a full-width sidebar would consume too much of a phone screen.

### Options considered

1. **Always-visible sidebar.** Unusable on small screens.
2. **Bottom tab bar on mobile.** Good for four items, but the sidebar also holds the company switcher and secondary links.
3. **Off-canvas drawer on mobile, static sidebar on desktop.** Chosen.

### Decision

The sidebar is a fixed drawer on mobile (hidden by default, slides in over a backdrop) and a static flex column on desktop (`lg:static lg:translate-x-0`). A hamburger button in the top bar, visible below the `lg` breakpoint, toggles the drawer. Navigation links close the drawer on click.

### Reasoning

- **Familiar pattern.** Drawer-over-backdrop is widely understood.
- **No layout shift on desktop.** At the breakpoint the sidebar takes up layout space and content flows beside it.
- **Accessibility basics.** The backdrop has `aria-hidden`, the close button has an `aria-label`, and the sidebar has `aria-label="Primary navigation"`.

### Trade-offs

- The drawer does not trap focus. A production version should add focus trapping while the drawer is open.
- There is no swipe-to-close gesture on touch devices.

---

## D-008: Stack: Vite, React, TypeScript, Tailwind CSS

**Date:** 2026-10-22
**Status:** Implemented

### Context

The brief asks for a front-end prototype delivered in 6-8 hours and presented live. The stack needs to be quick to set up, quick to iterate on, and credible for something that could grow into a real product.

### Options considered

1. **Next.js.** Powerful, but server rendering, API routes and deployment complexity are not needed for a client-only prototype.
2. **Vite with React and TypeScript.** Fast dev server, minimal config. Chosen.
3. **Plain CSS or a component library (for example MUI).** A component library speeds up basics but makes a distinctive, brand-aware UI harder (see D-002).

### Decision

Build with Vite, React and TypeScript, and style with Tailwind CSS.

### Reasoning

- **Speed.** Vite's start-up and hot reload keep the feedback loop short inside a tight timebox.
- **Type safety.** TypeScript makes the data contracts in D-003 enforceable and eases the later move to a real API.
- **Design control.** Tailwind gives fast, consistent styling without fighting a component library's defaults, and it works well with the accent system in D-002.
- **Test fit.** Vitest (D-005) shares Vite's pipeline.

### Trade-offs

- No server rendering or built-in API layer. If the portal later needs server-side logic, it would be added separately (see D-010).
- Hand-built components need more accessibility attention than a mature component library would.

---

## D-009: Scope: what the prototype deliberately leaves out

**Date:** 2026-10-22
**Status:** Decided

### Context

With 6-8 hours available, the goal was a polished, believable front-end, not a complete system. Choosing what not to build was as important as choosing what to build.

### Decision

Included: company-aware navigation and theming, the four main pages plus application detail pages, severity-aware news and a critical banner, light and dark themes, a responsive layout, and a test suite covering data, context, components and routing.

Deliberately excluded:

- **Authentication and real identity.** The employee profile is mocked (D-003).
- **Backend, persistence and real integrations.** Out of scope for the prototype phase (D-003, D-010).
- **Server-enforced access control.** Client-side filtering only (D-004).
- **Advanced keyboard accessibility.** For example, drawer focus trapping (D-007).
- **Visual regression and end-to-end tests.** Unit and integration tests only (D-005).

### Reasoning

- **Depth over breadth.** A smaller feature set built carefully demonstrates front-end quality better than many half-finished features.
- **Honest boundaries.** Documenting exclusions makes clear which gaps are choices, not oversights.

### Trade-offs

- The prototype cannot demonstrate real security, data freshness or multi-user behaviour. The presentation should say so plainly.

---

## D-010: Production direction: Supabase with row-level security

**Date:** 2026-10-22
**Status:** Proposed (not built)

### Context

D-003 and D-004 deliberately postpone the backend. The prototype should still show a credible path to production.

### Options considered

1. **Supabase (Postgres, auth, row-level security).** Maps directly onto the company-membership model in D-004.
2. **Custom API (for example Node.js with Postgres).** Maximum flexibility, but more to build and maintain.
3. **Integrating directly with existing enterprise systems.** Likely the long-term reality, but depends on information outside the brief.

### Proposed decision

Move to Supabase for authentication, data and access control. Express company membership as row-level security policies, so the `companyIds`/`scope` logic in D-004 is enforced by the database and the client filter becomes a convenience only.

### Reasoning

- **Direct mapping.** The existing data shapes and company-scoped filtering translate cleanly to tables and policies.
- **Small change surface.** Components would swap their `data.ts` imports for data-fetching hooks (D-003).
- **Security model.** Server-side enforcement closes the gap noted in D-004.

### Trade-offs

- Adds vendor dependency and operational considerations (hosting, backups, data residency) that the group would need to evaluate.
- Real integrations with existing group systems may need a separate integration layer.

---

## Known limitations and next steps

**Known limitations**

- Mock data only, with no persistence beyond the theme preference.
- Access control is client-side and not a security boundary.
- The mobile drawer lacks focus trapping and swipe-to-close.
- Accent colours are defined in two places and need a single source of truth.
- No visual regression or end-to-end tests.

**Suggested next steps**

1. Add real authentication and move access control server-side (D-010).
2. Replace `data.ts` imports with data-fetching hooks, one component at a time (D-003).
3. Add focus trapping to the drawer and run a full accessibility audit (D-007).
4. Consolidate accent colours into one source of truth (D-002).
5. Add Playwright for end-to-end and visual regression coverage (D-005).
6. Add expiry or resolution status for incidents so stale critical items stop dominating the feed (D-006).