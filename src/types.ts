export type Severity = 'critical' | 'warning' | 'info';

export type CompanyId =
  | 'group'
  | 'academy'
  | 'travels'
  | 'b2b'
  | 'tmc'
  | 'holidays'
  | 'facilities';

export interface Company {
  id: CompanyId;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  /** Illustrative brand colour (not an official Finchglow brand colour). */
  accent: string;
  accentSoft: string;
  /** Tailwind class fragments applied dynamically — see accentClasses helper. */
  accentKey: AccentKey;
}

export type AccentKey =
  | 'indigo'
  | 'emerald'
  | 'sky'
  | 'amber'
  | 'rose'
  | 'teal'
  | 'slate';

export interface Employee {
  name: string;
  firstName: string;
  role: string;
  companyId: CompanyId;
  email: string;
  /** Access to subsidiary companies beyond their own + group. */
  accessibleCompanyIds: CompanyId[];
}

export type AppCategory = 'Operations' | 'Sales' | 'People' | 'Learning' | 'Facilities' | 'Support';

export interface AppItem {
  id: string;
  name: string;
  description: string;
  category: AppCategory;
  icon: AppIconName;
  /** Companies where this app is available. `group` = available everywhere. */
  companyIds: CompanyId[];
  launchUrl: string;
  /** When true, the launch opens a simulated modal rather than a new tab. */
  simulated?: boolean;
}

export type AppIconName =
  | 'plane'
  | 'users'
  | 'briefcase'
  | 'graduationCap'
  | 'userCog'
  | 'building'
  | 'headset'
  | 'globe'
  | 'calendar'
  | 'wallet';

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  severity: Severity;
  /** Group-wide items stay visible under every subsidiary. */
  scope: 'group' | CompanyId;
  publishedAt: string; // ISO
  linkLabel?: string;
}
