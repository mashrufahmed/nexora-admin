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
    ],
  },
  {
    label: 'Product Catalog',
    items: [
      { title: 'Products', url: '/products', icon: Package, permission: 'product.create' },
      { title: 'Brands', url: '/brands', icon: Tag, permission: 'product.create' },
      {
        title: 'Categories',
        url: '/categories',
        icon: FolderTree,
      },
    ],
  },
  {
    label: 'Editorial & Reviews',
    items: [
      { title: 'Reviews', url: '/reviews', icon: Star, permission: 'review.create' },
      { title: 'Review criteria', url: '/review-criteria', icon: SlidersHorizontal, permission: 'review.create' },
      { title: 'Buying Guides', url: '/guides', icon: BookOpen },
      { title: 'Comparisons', url: '/comparisons', icon: Columns2 },
    ],
  },
  {
    label: 'Affiliate',
    items: [
      { title: 'Affiliate Overview', url: '/affiliate', icon: TrendingUp, permission: 'affiliate.manage' },
      { title: 'Affiliate Links', url: '/affiliate/links', icon: Link2, permission: 'affiliate.manage' },
      { title: 'Merchants', url: '/affiliate/merchants', icon: Store, permission: 'affiliate.manage' },
    ],
  },
  {
    label: 'Media & SEO',
    items: [
      { title: 'Media Library', url: '/media', icon: Image, permission: 'media.upload' },
      { title: 'Authors', url: '/authors', icon: Users, permission: 'content.create' },
      { title: 'Redirects', url: '/seo/redirects', icon: ArrowRightLeft },
      { title: 'Tags', url: '/tags', icon: Tag, permission: 'tag.manage' },
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
        permission: 'analytics.read',
      },
    ],
  },
  {
    label: 'Organization',
    items: [
      { title: 'Team Members', url: '/team', icon: Users, permission: 'rbac.admins.read' },
      { title: 'Roles & Permissions', url: '/team/roles', icon: ShieldCheck, permission: 'rbac.roles.read' },
      { title: 'Audit Logs', url: '/audit-logs', icon: ScrollText, permission: 'audit.logs.read' },
    ],
  },
  {
    label: 'Platform',
    items: [
      { title: 'Email', url: '/email', icon: Mail, permission: 'email.manage' },
    ],
  },
  {
    label: 'Settings',
    items: [
      { title: 'Account Settings', url: '/settings/account', icon: UserCircle },
      { title: 'Security', url: '/settings/security', icon: Lock },
    ],
  },
];

export const allNavLeaves = navGroups.flatMap((g) =>
  g.items.map((i) => ({ ...i, group: g.label })),
);
