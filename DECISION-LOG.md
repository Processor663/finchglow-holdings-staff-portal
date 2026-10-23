# Decision Log

The three hardest trade-offs in the Finchglow Group Staff Portal prototype.

---

## 1. Client-side routing over view-state switching

**Decision:** I replaced a `view` string in React context with React Router, so each page has its own URL.

**Why:** Staff will want to bookmark a specific tool or share a news item. Routing gives deep links, working back/forward buttons and shareable URLs, and it removed navigation state from `PortalProvider`.

**Cost:** The host must rewrite unknown paths to `index.html` (`/* /index.html 200`), or deep links fail on refresh. Tests also need a router wrapper (`MemoryRouter` with `initialEntries`). This is more setup than a conditional-render prototype strictly needs.

**Verdict:** Worth it. A portal people return to by link is the wrong place to skip real URLs.

---

## 2. CSS-variable accent system over dynamic Tailwind classes

**Decision:** Each subsidiary's brand colour is applied through CSS custom properties on `<html>`, read by static utility classes (`.accent-bg`, `.accent-text`, `.accent-gradient`).

**Why:** Switching company must recolour the whole interface. Tailwind's JIT compiler purges dynamically built class names such as `bg-${color}-600`, so static classes backed by variables are the safe way to change colour at runtime.

**Cost:** Accent colours now live in two places: `data.ts` holds the base hex, while `context.tsx` hardcodes `STRONG_MAP` and `SOFT_BORDER_MAP` for the darker and border variants. Adding a company colour means editing both. A single source with runtime colour calculation would be cleaner, but it would add a colour-manipulation dependency for a small gain.

**Verdict:** Accepted the duplication. With seven colours, it's a smaller risk than a new dependency.

---

## 3. Mock data in one module over API integration

**Decision:** All data lives in `src/data.ts` as typed exports, with no backend.

**Why:** It allowed fast iteration inside the timebox and gave tests stable fixtures. The TypeScript interfaces (`AppItem`, `Company`, `NewsItem`) act as the contract for a future API, so migrating is a localised change per component.

**Cost:** Nothing persists except the theme preference, and there are no live updates. More importantly, company-scoped filtering is a UX feature, not security: anyone can read all applications from the JS bundle.

**Verdict:** Right for a prototype, wrong for production. In production, access must be enforced server-side (for example row-level security), not by client-side `companyIds.includes()`.

---

**With more time:** I would add server-enforced access control first, then consolidate the accent colours into one source.