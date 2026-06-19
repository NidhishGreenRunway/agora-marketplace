export type Plan = 'peruse' | 'monthly' | 'buy';
export type Screen = 'browse' | 'listing' | 'onboarding' | 'checkout' | 'seller' | 'buyer';
export type Role = 'buyer' | 'seller' | 'both' | null;

export interface Agent {
  id: string;
  name: string;
  monogram: string;
  color: string;
  category: string;
  seller: string;
  verified: boolean;
  rating: number;
  reviews: number;
  tasks: number;
  perUse: number;
  monthly: number;
  buy: number;
  tags: string[];
  blurb: string;
}

export const AGENTS: Agent[] = [
  { id: 'aria', name: 'Aria', monogram: 'AR', color: '#DD6A33', category: 'Customer Support', seller: 'Helpwave', verified: true, rating: 4.9, reviews: 1284, tasks: 2100000, perUse: 0.04, monthly: 149, buy: 4800, tags: ['Multilingual', 'Zendesk', 'Voice'], blurb: 'Resolves tickets end-to-end across email, chat and voice in 30+ languages — escalating only the 4% that truly need a human.' },
  { id: 'forge', name: 'Forge', monogram: 'FG', color: '#3B6FB5', category: 'Coding', seller: 'Stacklight', verified: true, rating: 4.8, reviews: 932, tasks: 540000, perUse: 0.12, monthly: 299, buy: 12000, tags: ['TypeScript', 'Python', 'Reviews PRs'], blurb: 'Picks up a Linear ticket, opens a branch, writes the code and the tests, and ships a clean PR for your review.' },
  { id: 'ledger', name: 'Ledger', monogram: 'LD', color: '#2E8B6E', category: 'Data Analysis', seller: 'Northwind', verified: true, rating: 4.7, reviews: 611, tasks: 88000, perUse: 0.09, monthly: 199, buy: 7500, tags: ['SQL', 'dbt', 'Charts'], blurb: 'Connects to your warehouse and turns raw tables into board-ready dashboards with commentary.' },
  { id: 'quill', name: 'Quill', monogram: 'QL', color: '#9A5BB8', category: 'Creative Writing', seller: 'Inkhouse', verified: false, rating: 4.6, reviews: 1543, tasks: 320000, perUse: 0.03, monthly: 99, buy: 3200, tags: ['Blog', 'Brand voice', 'SEO'], blurb: 'Drafts long-form content in your exact brand voice from a one-line brief — then self-edits twice.' },
  { id: 'pitch', name: 'Pitch', monogram: 'PT', color: '#C0532A', category: 'Sales', seller: 'Revline', verified: true, rating: 4.5, reviews: 478, tasks: 210000, perUse: 0.06, monthly: 129, buy: 5000, tags: ['Outreach', 'CRM', 'Enrichment'], blurb: 'Researches each lead and writes the cold email that actually gets a reply, synced straight to your CRM.' },
  { id: 'scout', name: 'Scout', monogram: 'SC', color: '#3F7BA3', category: 'Research', seller: 'Helpwave', verified: true, rating: 4.8, reviews: 820, tasks: 140000, perUse: 0.08, monthly: 179, buy: 6400, tags: ['Citations', 'Web', 'Reports'], blurb: 'Runs deep research on any topic and returns a structured report with every claim cited and linked.' },
  { id: 'flow', name: 'Flow', monogram: 'FL', color: '#B5862E', category: 'Operations', seller: 'Opsmith', verified: false, rating: 4.6, reviews: 354, tasks: 95000, perUse: 0.07, monthly: 159, buy: 5600, tags: ['Zapier', 'Approvals', 'Ops'], blurb: 'Automates repetitive back-office workflows across your whole SaaS stack with human approval gates.' },
  { id: 'spark', name: 'Spark', monogram: 'SP', color: '#D14F6E', category: 'Marketing', seller: 'Inkhouse', verified: true, rating: 4.4, reviews: 290, tasks: 60000, perUse: 0.05, monthly: 139, buy: 4400, tags: ['Social', 'Calendar', 'Ads'], blurb: 'Plans a full campaign calendar and drafts every post and ad in your voice, ready to schedule.' },
  { id: 'atlas', name: 'Atlas', monogram: 'AT', color: '#2E8B6E', category: 'Data Analysis', seller: 'Northwind', verified: true, rating: 4.9, reviews: 1120, tasks: 410000, perUse: 0.10, monthly: 229, buy: 9000, tags: ['NL query', 'Warehouse', 'Slack'], blurb: 'Answers any metric question in plain English, right inside Slack, straight from your warehouse.' },
];

export const CATEGORIES = ['All', 'Customer Support', 'Coding', 'Data Analysis', 'Creative Writing', 'Sales', 'Research', 'Operations', 'Marketing'];

export const REVIEWS = [
  { name: 'Mara Lindqvist', initials: 'ML', stars: '★★★★★', when: '2 weeks ago', text: 'Replaced two thirds of our tier-1 queue in a month. Hand-offs to humans are clean and well summarized.' },
  { name: 'Devon Park', initials: 'DP', stars: '★★★★★', when: '1 month ago', text: 'Setup took an afternoon. The pay-per-task pricing meant we could prove ROI before committing to a plan.' },
  { name: 'Priya Anand', initials: 'PA', stars: '★★★★☆', when: '2 months ago', text: 'Excellent quality. Docked one star only because the analytics export could be richer.' },
];

export function fmt(n: number): string {
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1e3) return Math.round(n / 1e3) + 'K';
  return '' + n;
}

export function money(n: number): string {
  return '$' + n.toLocaleString('en-US');
}
