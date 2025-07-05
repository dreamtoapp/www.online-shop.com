// app/dashboard/components/menuConfig.ts
import {
  Activity,
  Bell,
  BookOpen,
  CalendarClock,
  CheckCircle,
  ClipboardList,
  Clock,
  CreditCard,
  Database,
  Gauge,
  Headset,
  Home,
  Info,
  LayoutDashboard,
  LayoutGrid,
  LifeBuoy,
  Mailbox,
  Megaphone,
  Newspaper,
  Package,
  SearchCheck,
  Settings,
  ShieldCheck,
  Store,
  Tag,
  Tags,
  Truck,
  Users,
  Warehouse,
  XCircle,
} from 'lucide-react';

// export const menuGroups = [
//   {
//     label: 'الرئيسية', // Home / Overview
//     items: [
//       { title: 'لوحة المعلومات', url: '/dashboard', icon: LayoutDashboard },
//       { title: 'عرض المتجر', url: '/', icon: Home },
//     ],
//   },
//   {
//     label: 'الطلبات', // Orders
//     items: [
//       { title: 'كل الطلبات', url: '/dashboard/orders-management', icon: Layers },
//       { title: 'قيد المعالجة', url: '/dashboard/orders-management/status/pending', icon: Clock },
//       { title: 'قيد التوصيل', url: '/dashboard/orders-management/status/in-way', icon: Truck },
//       { title: 'تم التوصيل', url: '/dashboard/orders-management/status/delivered', icon: CheckCircle },
//       { title: 'ملغاة', url: '/dashboard/orders-management/status/canceled', icon: XCircle },
//     ],
//   },
//   {
//     label: 'التقارير والتحليلات',
//     items: [
//       { title: 'نظرة عامة', url: '/dashboard/reports', icon: PieChart },
//     ],
//   },
//   {
//     label: 'إدارة الفريق',
//     items: [
//       { title: 'المشرفون', url: '/dashboard/user-mangment/admin', icon: Handshake },
//       { title: 'المسوقون', url: '/dashboard/user-mangment/marketer', icon: Megaphone },
//       { title: 'العملاء', url: '/dashboard/user-mangment/customer', icon: Users2 },
//       { title: 'السائقون', url: '/dashboard/user-mangment/drivers', icon: Truck },
//       { title: 'جداول العمل', url: '/dashboard/shifts', icon: Timer },
//     ],
//   },
//   {
//     label: 'المنتجات والمخزون',
//     items: [
//       { title: 'إدارة المنتجات', url: '/dashboard/products-control', icon: Package },
//       { title: 'الأصناف', url: '/dashboard/categories', icon: LayoutGrid },
//       { title: 'الموردون', url: '/dashboard/suppliers', icon: ShoppingBasket },
//     ],
//   },
//   {
//     label: 'التسويق والعروض',
//     items: [
//       { title: 'العروض الترويجية', url: '/dashboard/promotions', icon: Gift },
//       { title: 'النشرة البريدية', url: '/dashboard/clientnews', icon: Newspaper },
//       { title: 'المحتوى الإرشادي', url: '/seo/documentation', icon: FileText },
//     ],
//   },
//   {
//     label: 'تجربة العملاء',
//     items: [

//       { title: 'رسائل العملاء', url: '/dashboard/clientsubmission', icon: Users },
//     ],
//   },
//   {
//     label: 'المعاملات المالية',
//     items: [
//       { title: 'سجل المصروفات', url: '/dashboard/expenses', icon: CreditCard },
//     ],
//   },
//   {
//     label: 'الإعدادات والنظام',
//     items: [
//       { title: 'الإعدادات العامة', url: '/dashboard/settings', icon: Settings },

//       { title: 'الإشعارات والتنبيهات', url: '/dashboard/alerts', icon: AlertTriangle },
//       { title: 'الدعم الفني', url: '/dashboard/maintinance', icon: Wrench },
//       { title: 'الدليل والتعليمات', url: '/dashboard/guidelines', icon: Info },
//       { title: 'تهيئة البيانات', url: '/dashboard/dataSeed', icon: Layers },
//     ],
//   },
//   {
//     label: 'تحسين محركات البحث (SEO)',
//     items: [
//       { title: 'تحليلات الأداء', url: '/dashboard/seo', icon: Target },
//       { title: 'الصفحة الرئيسية', url: '/dashboard/seo/home', icon: Home },
//       { title: 'صفحة من نحن', url: '/dashboard/seo/about', icon: Info },
//       { title: 'مدونة الموقع', url: '/dashboard/seo/blog', icon: Newspaper },
//       { title: 'صفحات المنتجات', url: '/dashboard/seo/product', icon: Package },
//       { title: 'صفحات العروض', url: '/dashboard/seo/promotion', icon: Gift },
//       { title: 'صفحات الأصناف', url: '/dashboard/seo/category', icon: LayoutGrid },
//       { title: 'أداء SEO', url: '/dashboard/seo/performance', icon: PieChart },
//     ],
//   },
// ];
export const menuGroups = [
  {
    label: 'الرئيسية',
    items: [
      { title: 'لوحة التحكم', url: '/dashboard', icon: LayoutDashboard },
      { title: 'المتجر', url: '/', icon: Store },
    ],
  },
  {
    label: 'الطلبات',
    items: [
      { title: 'جميع الطلبات', url: '/dashboard/management-orders', icon: ClipboardList },
      { title: 'قيد المراجعة', url: '/dashboard/management-orders/status/pending', icon: Clock },
      { title: 'قيد التوصيل', url: '/dashboard/management-orders/status/in-way', icon: Truck },
      { title: 'مكتملة', url: '/dashboard/management-orders/status/delivered', icon: CheckCircle },
      { title: 'ملغاة', url: '/dashboard/management-orders/status/canceled', icon: XCircle },
      { title: 'تحليلات الطلبات', url: '/dashboard/management-orders/analytics', icon: Activity },
    ],
  },
  {
    label: 'المنتجات',
    items: [
      { title: 'المنتجات', url: '/dashboard/management-products', icon: Package },
      { title: 'التصنيفات', url: '/dashboard/management-categories', icon: Tags },
      { title: 'الموردين', url: '/dashboard/management-suppliers', icon: Warehouse },
    ],
  },
  {
    label: 'العملاء',
    items: [
      { title: 'العملاء', url: '/dashboard/management-users/customer', icon: Users },
      { title: 'الدعم', url: '/dashboard/management/client-submission', icon: Headset },
    ],
  },
  {
    label: 'الفريق',
    items: [
      { title: 'المشرفون', url: '/dashboard/management-users/admin', icon: ShieldCheck },
      { title: 'التسويق', url: '/dashboard/management-users/marketer', icon: Megaphone },
      { title: 'السائقون', url: '/dashboard/management-users/drivers', icon: Truck },
      { title: 'المناوبات', url: '/dashboard/shifts', icon: CalendarClock },
    ],
  },
  {
    label: 'التسويق',
    items: [
      { title: 'العروض', url: '/dashboard/management-offer', icon: Tag },
      { title: 'البريد الإلكتروني', url: '/dashboard/management/client-news', icon: Mailbox },
    ],
  },
  {
    label: 'التقارير',
    items: [
      { title: 'التقارير', url: '/dashboard/management-reports', icon: Activity },
    ],
  },
  {
    label: 'المالية',
    items: [
      { title: 'المصروفات', url: '/dashboard/management-expenses', icon: CreditCard },
    ],
  },
  {
    label: 'الإعدادات',
    items: [
      { title: 'الإعدادات', url: '/dashboard/settings', icon: Settings },
      { title: 'التنبيهات', url: '/dashboard/management-notification', icon: Bell },
      { title: 'الصيانة', url: '/dashboard/management-maintinance', icon: LifeBuoy },
      { title: 'الدليل', url: '/dashboard/guidelines', icon: BookOpen },
      { title: 'البيانات', url: '/dashboard/dataSeed', icon: Database },
      { title: 'من نحن', url: '/dashboard/management/about', icon: Info },
    ],
  },
  {
    label: 'تحسين المحركات',
    items: [
      { title: 'تحليل SEO', url: '/dashboard/seo', icon: SearchCheck },
      { title: 'الصفحة الرئيسية', url: '/dashboard/seo/home', icon: Home },
      { title: 'من نحن', url: '/dashboard/seo/about', icon: Info },
      { title: 'المدونة', url: '/dashboard/seo/blog', icon: Newspaper },
      { title: 'صفحات المنتجات', url: '/dashboard/seo/product', icon: Package },
      { title: 'الترويج', url: '/dashboard/seo/promotion', icon: Tag },
      { title: 'التصنيفات', url: '/dashboard/seo/category', icon: LayoutGrid },
      { title: 'الأداء', url: '/dashboard/seo/performance', icon: Gauge },
    ],
  },
];