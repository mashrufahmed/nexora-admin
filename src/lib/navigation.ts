import {
  ArrowRightLeft,
  Award,
  BadgePercent,
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  CalendarClock,
  Columns2,
  CreditCard,
  File,
  FileText,
  FlaskConical,
  FolderTree,
  Gauge,
  GitPullRequest,
  Globe,
  History,
  Image,
  KeyRound,
  LayoutDashboard,
  LayoutTemplate,
  LineChart,
  Link,
  Link2,
  Lock,
  Mail,
  Map,
  Megaphone,
  Menu,
  MousePointerClick,
  Network,
  Newspaper,
  Package,
  Palette,
  PieChart,
  Puzzle,
  Receipt,
  ScrollText,
  Search,
  Settings2,
  ShieldCheck,
  ShoppingBag,
  Sliders,
  SlidersHorizontal,
  Star,
  Store,
  Tag,
  TrendingUp,
  UserCircle,
  Users,
  Webhook,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

export interface NavLeaf {
  title: string;
  url: string;
  icon: LucideIcon;
  permission?: string;
}
export interface NavGroup {
  label: string;
  items: NavLeaf[];
}

export const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [{ title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Website Management',
    items: [
      { title: 'All Sites', url: '/sites', icon: Globe, permission: 'site.manage' },
      { title: 'Domains', url: '/sites/s1/domains', icon: Link2 },
      { title: 'Site Settings', url: '/sites/s1/settings', icon: Settings2 },
      { title: 'Theme & Branding', url: '/sites/s1/branding', icon: Palette },
      { title: 'Navigation', url: '/sites/s1/navigation', icon: Menu },
      {
        title: 'Homepage Builder',
        url: '/page-builder',
        icon: LayoutTemplate,
      },
    ],
  },
  {
    label: 'Content',
    items: [
      { title: 'All Content', url: '/content', icon: FileText, permission: 'content.create' },
      { title: 'Articles', url: '/content/articles', icon: Newspaper },
      { title: 'Pages', url: '/content/pages', icon: File },
      { title: 'Editorial Workflow', url: '/editorial', icon: GitPullRequest },
      {
        title: 'Scheduled Content',
        url: '/content/scheduled',
        icon: CalendarClock,
      },
      { title: 'Content Revisions', url: '/content/revisions', icon: History },
    ],
  },
  {
    label: 'Product Catalog',
    items: [
      { title: 'Products', url: '/products', icon: Package, permission: 'product.create' },
      { title: 'Brands', url: '/brands', icon: Tag },
      {
        title: 'Product Categories',
        url: '/product-categories',
        icon: FolderTree,
      },
      {
        title: 'Product Attributes',
        url: '/product-attributes',
        icon: SlidersHorizontal,
      },
    ],
  },
  {
    label: 'Editorial & Reviews',
    items: [
      { title: 'Reviews', url: '/reviews', icon: Star, permission: 'review.create' },
      {
        title: 'Review Methodologies',
        url: '/review-methodologies',
        icon: FlaskConical,
      },
      { title: 'Scoring Criteria', url: '/review-scoring', icon: Gauge },
      { title: 'Awards', url: '/review-awards', icon: Award },
      { title: 'Buying Guides', url: '/guides', icon: BookOpen },
      { title: 'Comparisons', url: '/comparisons', icon: Columns2 },
    ],
  },
  {
    label: 'Affiliate',
    items: [
      { title: 'Affiliate Overview', url: '/affiliate', icon: TrendingUp, permission: 'affiliate.manage' },
      { title: 'Networks', url: '/affiliate/networks', icon: Network },
      { title: 'Merchants', url: '/affiliate/merchants', icon: Store },
      { title: 'Affiliate Links', url: '/affiliate/links', icon: Link },
      { title: 'Offers', url: '/affiliate/offers', icon: BadgePercent },
      { title: 'Campaigns', url: '/affiliate/campaigns', icon: Megaphone },
      {
        title: 'Click Analytics',
        url: '/affiliate/clicks',
        icon: MousePointerClick,
      },
      {
        title: 'Commission Reports',
        url: '/affiliate/commissions',
        icon: Receipt,
      },
    ],
  },
  {
    label: 'Media & SEO',
    items: [
      { title: 'Media Library', url: '/media', icon: Image, permission: 'media.upload' },
      { title: 'Authors', url: '/authors', icon: Users, permission: 'content.create' },
      { title: 'SEO Overview', url: '/seo', icon: Search },
      { title: 'Redirects', url: '/seo/redirects', icon: ArrowRightLeft },
      { title: 'Tags', url: '/tags', icon: Tag, permission: 'tag.manage' },
      { title: 'Sitemap', url: '/seo/sitemap', icon: Map },
      { title: 'SEO Settings', url: '/seo/settings', icon: Wrench },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { title: 'Overview', url: '/analytics', icon: BarChart3, permission: 'analytics.read' },
      {
        title: 'Content Analytics',
        url: '/analytics/content',
        icon: LineChart,
      },
      {
        title: 'Product Analytics',
        url: '/analytics/products',
        icon: ShoppingBag,
      },
      {
        title: 'Affiliate Analytics',
        url: '/analytics/affiliate',
        icon: PieChart,
      },
      { title: 'Newsletter', url: '/newsletter', icon: Mail, permission: 'newsletter.manage' },
    ],
  },
  {
    label: 'Organization',
    items: [
      { title: 'Team Members', url: '/team', icon: Users, permission: 'rbac.admins.read' },
      { title: 'Invitations', url: '/team/invitations', icon: Mail },
      { title: 'Roles & Permissions', url: '/team/roles', icon: ShieldCheck, permission: 'rbac.roles.read' },
      { title: 'Audit Logs', url: '/audit-logs', icon: ScrollText, permission: 'audit.logs.read' },
    ],
  },
  {
    label: 'Platform',
    items: [
      { title: 'Integrations', url: '/integrations', icon: Puzzle },
      { title: 'API Keys', url: '/api-keys', icon: KeyRound },
      { title: 'Webhooks', url: '/webhooks', icon: Webhook },
      { title: 'Notifications', url: '/settings/notifications', icon: Bell },
      { title: 'Email', url: '/email', icon: Mail, permission: 'email.manage' },
      { title: 'Usage & Billing', url: '/billing', icon: CreditCard },
    ],
  },
  {
    label: 'Settings',
    items: [
      {
        title: 'Organization Settings',
        url: '/settings/organization',
        icon: Building2,
      },
      { title: 'Account Settings', url: '/settings/account', icon: UserCircle },
      { title: 'Security', url: '/settings/security', icon: Lock },
      { title: 'Preferences', url: '/settings/preferences', icon: Sliders },
    ],
  },
];

export const allNavLeaves = navGroups.flatMap((g) =>
  g.items.map((i) => ({ ...i, group: g.label })),
);
