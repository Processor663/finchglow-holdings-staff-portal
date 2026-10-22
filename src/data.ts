import type { Company, CompanyId, Employee, NewsItem, AppItem } from './types';

export const COMPANIES: Company[] = [
  {
    id: 'group',
    name: 'Finchglow Holdings',
    shortName: 'Holdings',
    tagline: 'Group Headquarters',
    description: 'Central services across the Finchglow group of companies.',
    accent: '#4f46e5',
    accentSoft: '#eef2ff',
    accentKey: 'indigo',
  },
  {
    id: 'academy',
    name: 'Finchglow Academy',
    shortName: 'Academy',
    tagline: 'Learning & Development',
    description: 'Travel, tourism and hospitality training and certification.',
    accent: '#059669',
    accentSoft: '#ecfdf5',
    accentKey: 'emerald',
  },
  {
    id: 'travels',
    name: 'Finchglow Travels',
    shortName: 'Travels',
    tagline: 'Online Travel Agency',
    description: 'Consumer travel booking and trip planning.',
    accent: '#0284c7',
    accentSoft: '#f0f9ff',
    accentKey: 'sky',
  },
  {
    id: 'b2b',
    name: 'Finchglow B2B',
    shortName: 'B2B',
    tagline: 'Agent Booking Platform',
    description: 'Travel booking platform for registered travel agents.',
    accent: '#d97706',
    accentSoft: '#fffbeb',
    accentKey: 'amber',
  },
  {
    id: 'tmc',
    name: 'Finchglow Travel Management',
    shortName: 'TMC',
    tagline: 'Corporate Travel',
    description: 'Corporate travel management and policy compliance.',
    accent: '#e11d48',
    accentSoft: '#fff1f2',
    accentKey: 'rose',
  },
  {
    id: 'holidays',
    name: 'Finchglow Holidays',
    shortName: 'Holidays',
    tagline: 'Leisure & Packages',
    description: 'Curated holiday packages and leisure escapes.',
    accent: '#0d9488',
    accentSoft: '#f0fdfa',
    accentKey: 'teal',
  },
  {
    id: 'facilities',
    name: 'Finchglow Shared Facilities',
    shortName: 'Facilities',
    tagline: 'Shared Services',
    description: 'Shared office, facilities and workplace services.',
    accent: '#475569',
    accentSoft: '#f8fafc',
    accentKey: 'slate',
  },
];

export const EMPLOYEE: Employee = {
  name: 'Amadi Miracle',
  firstName: 'Amadi',
  role: 'Travel Operations Officer',
  companyId: 'travels',
  email: 'amadi.miracle@finchglow.example',
  accessibleCompanyIds: ['group', 'travels', 'b2b', 'holidays'],
};

export const APPLICATIONS: AppItem[] = [
  {
    id: 'booking-platform',
    name: 'Booking Platform',
    description: 'Search and book flights, hotels and ground transport.',
    category: 'Operations',
    icon: 'plane',
    companyIds: ['travels', 'b2b', 'holidays', 'tmc'],
    launchUrl: 'https://booking.finchglow.example',
  },
  {
    id: 'crm',
    name: 'Customer Relationship Management',
    description: 'Manage customer profiles, leads and service cases.',
    category: 'Sales',
    icon: 'users',
    companyIds: ['travels', 'b2b', 'tmc', 'holidays'],
    launchUrl: 'https://crm.finchglow.example',
  },
  {
    id: 'supplier-portal',
    name: 'Supplier Portal',
    description: 'Manage supplier contracts, rates and inventory feeds.',
    category: 'Operations',
    icon: 'briefcase',
    companyIds: ['travels', 'b2b', 'holidays'],
    launchUrl: 'https://suppliers.finchglow.example',
  },
  {
    id: 'learning-academy',
    name: 'Learning Academy',
    description: 'Enrol in courses, track certifications and learning paths.',
    category: 'Learning',
    icon: 'graduationCap',
    companyIds: ['group', 'academy'],
    launchUrl: 'https://learn.finchglow.example',
  },
  {
    id: 'hr-self-service',
    name: 'HR Self-Service',
    description: 'Leave requests, payslips and personal details.',
    category: 'People',
    icon: 'userCog',
    companyIds: ['group'],
    launchUrl: 'https://hr.finchglow.example',
  },
  {
    id: 'facilities-requests',
    name: 'Facilities Requests',
    description: 'Raise maintenance, meeting-room and workplace requests.',
    category: 'Facilities',
    icon: 'building',
    companyIds: ['group', 'facilities'],
    launchUrl: 'https://facilities.finchglow.example',
  },
  {
    id: 'corporate-travel-desk',
    name: 'Corporate Travel Desk',
    description: 'Approve corporate trips and enforce travel policy.',
    category: 'Operations',
    icon: 'globe',
    companyIds: ['tmc'],
    launchUrl: 'https://tmc.finchglow.example',
  },
  {
    id: 'agent-support',
    name: 'Agent Support',
    description: 'Ticketing tools and help resources for B2B agents.',
    category: 'Support',
    icon: 'headset',
    companyIds: ['b2b'],
    launchUrl: 'https://agents.finchglow.example',
  },
  {
    id: 'finance-wallet',
    name: 'Finance & Wallet',
    description: 'View trip budgets, settlements and agent wallet balances.',
    category: 'Operations',
    icon: 'wallet',
    companyIds: ['b2b', 'tmc'],
    launchUrl: 'https://finance.finchglow.example',
  },
  {
    id: 'calendar-scheduler',
    name: 'Shift Scheduler',
    description: 'View contact-centre rosters and swap shifts.',
    category: 'People',
    icon: 'calendar',
    companyIds: ['travels', 'b2b', 'tmc'],
    launchUrl: 'https://shifts.finchglow.example',
    simulated: true,
  },
];

const now = Date.now();
const hoursAgo = (h: number) => new Date(now - h * 3600_000).toISOString();

export const NEWS: NewsItem[] = [
  {
    id: 'n1',
    title: 'Payment gateway disruption',
    summary:
      'Some online card payments may fail intermittently. Contact-centre staff should follow the incident procedure and use the approved alternative workflow until the gateway provider confirms resolution.',
    severity: 'critical',
    scope: 'group',
    publishedAt: hoursAgo(1),
    linkLabel: 'View incident details',
  },
  {
    id: 'n2',
    title: 'Amadeus availability degraded',
    summary:
      'GDS availability for Amadeus is degraded. Rebook affected PNRs via the fallback provider queue and notify the duty supervisor.',
    severity: 'critical',
    scope: 'travels',
    publishedAt: hoursAgo(2),
    linkLabel: 'View incident details',
  },
  {
    id: 'n3',
    title: 'Holiday package pricing sync delay',
    summary:
      'Package prices for the Q4 brochure are syncing slower than usual. Confirm quotes manually with the product team before ticketing.',
    severity: 'warning',
    scope: 'holidays',
    publishedAt: hoursAgo(5),
  },
  {
    id: 'n4',
    title: 'Q3 all-hands schedule confirmed',
    summary:
      'The group Q3 all-hands will be held on Friday 14 November at 15:00 WAT. Calendar invitations have been sent to all staff.',
    severity: 'info',
    scope: 'group',
    publishedAt: hoursAgo(9),
  },
  {
    id: 'n5',
    title: 'New data protection training mandatory',
    summary:
      'All employees must complete the updated data protection module in the Learning Academy by 30 November.',
    severity: 'warning',
    scope: 'group',
    publishedAt: hoursAgo(26),
    linkLabel: 'Start training',
  },
  {
    id: 'n6',
    title: 'B2B agent commission tiers updated',
    summary:
      'Tiered commission rates for platinum agents have been revised. The new rate card is available in the Supplier Portal.',
    severity: 'info',
    scope: 'b2b',
    publishedAt: hoursAgo(30),
  },
  {
    id: 'n7',
    title: 'Corporate travel policy refresh',
    summary:
      'The corporate travel policy has been refreshed for the new fiscal year. Review the updated approval thresholds on the Travel Desk.',
    severity: 'info',
    scope: 'tmc',
    publishedAt: hoursAgo(40),
  },
  {
    id: 'n8',
    title: 'Facilities maintenance window',
    summary:
      'Shared facilities on the 4th floor will be unavailable on Saturday for scheduled maintenance. Reserve alternate rooms in advance.',
    severity: 'warning',
    scope: 'facilities',
    publishedAt: hoursAgo(48),
  },
  {
    id: 'n9',
    title: 'Academy certification window opens',
    summary:
      'The IATA Foundation certification window is now open. Enrolments close 20 December.',
    severity: 'info',
    scope: 'academy',
    publishedAt: hoursAgo(60),
  },
];

export function companyById(id: CompanyId): Company {
  return COMPANIES.find((c) => c.id === id) ?? COMPANIES[0];
}
