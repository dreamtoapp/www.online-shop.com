'use client';
import {
  useEffect,
  useState,
} from 'react';

import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import Link from '@/components/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Package, Star } from 'lucide-react';

interface DashboardHomePageProps {
  summary: {
    orders: { total: number; today: number; pending: number; completed: number; cancelled: number };
    sales: { total: number; today: number };
    customers: { total: number; today: number };
    products: { total: number; outOfStock: number };
    drivers: { total: number };
    salesByMonth: { name: string; sales: number }[];
    topProducts: { name: string; sales: number; quantity: number }[];
    orderStatus: { name: string; value: number }[];
    recentOrders: { id: string; orderNumber: string; customer: string; amount: number; status: string; date: string }[];
  };
}

// Helper to get HSL string like "hsl(220, 70%, 50%)" from a CSS variable
function getResolvedColor(variableName: string): string {
  if (typeof window === 'undefined') return ''; // Guard for SSR
  const value = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
  // CSS var gives "220 70% 50%", Recharts needs "hsl(220, 70%, 50%)"
  if (value) return `hsl(${value.replace(/\s+/g, ', ')})`;
  return ''; // Fallback or default color if needed
}

// Helper to show numbers in English
function formatNumberEn(num: number) {
  return num.toLocaleString('en-US');
}

// Add this map at the top of the file (or import from a constants file)
const statusLabels: Record<string, string> = {
  DELIVERED: 'تم التوصيل',
  IN_TRANSIT: 'قيد التوصيل',
  CANCELED: 'ملغي',
  PENDING: 'قيد الانتظار',
};

export default function DashboardHomePage({ summary: initialSummary }: DashboardHomePageProps) {
  const [summary, setSummary] = useState(initialSummary);
  const [pieChartColors, setPieChartColors] = useState<string[]>([]);
  const [barChartFillColor, setBarChartFillColor] = useState<string>('');

  // Fetch summary from API
  const fetchSummary = async () => {
    try {
      const res = await fetch('/api/dashboard-summary');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setSummary(data);
    } catch (e) {
      // Optionally handle error
    }
  };

  useEffect(() => {
    // Listen for custom event to refresh summary
    const refreshListener = () => fetchSummary();
    window.addEventListener('order-data-refresh', refreshListener);
    return () => window.removeEventListener('order-data-refresh', refreshListener);
  }, []);

  // Optionally, fetch on mount for freshest data
  useEffect(() => { fetchSummary(); }, []);

  useEffect(() => {
    const resolvedPieColors = [
      getResolvedColor('--chart-1'),
      getResolvedColor('--chart-2'),
      getResolvedColor('--chart-3'),
      getResolvedColor('--chart-4'),
      getResolvedColor('--chart-5'),
    ].filter(Boolean);
    setPieChartColors(resolvedPieColors.length > 0 ? resolvedPieColors : ['#cccccc']); // Fallback

    setBarChartFillColor(getResolvedColor('--primary') || '#2563eb'); // Fallback to original blue
  }, []);

  return (
    <div className='container mx-auto py-8' dir='rtl'>
      {/* Summary Cards */}
      <div className='mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6'>
        <div className='flex flex-col items-center rounded-xl bg-info-soft-bg p-4 text-info-fg shadow-sm'>
          <span className='mb-2 text-3xl'>📦</span>
          <span className='text-2xl font-bold'>{formatNumberEn(summary.orders.total)}</span>
          <span className='mt-1 text-sm font-medium'>إجمالي الطلبات</span>
        </div>
        <div className='flex flex-col items-center rounded-xl bg-success-soft-bg p-4 text-success-fg shadow-sm'>
          <span className='mb-2 text-3xl'>💰</span>
          <span className='text-2xl font-bold'>{formatNumberEn(summary.sales.total)}</span>
          <span className='mt-1 text-sm font-medium'>إجمالي المبيعات (ر.س)</span>
        </div>
        <div className='flex flex-col items-center rounded-xl bg-warning-soft-bg p-4 text-warning-fg shadow-sm'>
          <span className='mb-2 text-3xl'>👤</span>
          <span className='text-2xl font-bold'>{formatNumberEn(summary.customers.total)}</span>
          <span className='mt-1 text-sm font-medium'>العملاء</span>
        </div>
        <div className='flex flex-col items-center rounded-xl bg-neutral-soft-bg p-4 text-neutral-fg shadow-sm'>
          <span className='mb-2 text-3xl'>🛒</span>
          <span className='text-2xl font-bold'>{formatNumberEn(summary.products.total)}</span>
          <span className='mt-1 text-sm font-medium'>المنتجات</span>
        </div>
        <div className='flex flex-col items-center rounded-xl bg-danger-soft-bg p-4 text-danger-fg shadow-sm'>
          <span className='mb-2 text-3xl'>⚠️</span>
          <span className='text-2xl font-bold'>{formatNumberEn(summary.products.outOfStock)}</span>
          <span className='mt-1 text-sm font-medium'>غير متوفر</span>
        </div>
        <div className='flex flex-col items-center rounded-xl bg-special-soft-bg p-4 text-special-fg shadow-sm'>
          <span className='mb-2 text-3xl'>🏢</span>
          <span className='text-2xl font-bold'>{formatNumberEn(summary.drivers.total)}</span>
          <span className='mt-1 text-sm font-medium'>السائقون</span>
        </div>
      </div>

      {/* تفاصيل الطلبات */}
      <div className='mb-8 rounded-xl bg-card p-6 shadow'>
        <h2 className='mb-4 text-xl font-bold text-card-foreground'>تفاصيل الطلبات</h2>
        <div className='flex flex-wrap justify-center gap-6'>
          <span className='font-semibold text-success-fg'>
            اليوم: {formatNumberEn(summary.orders.today)}
          </span>
          <span className='font-semibold text-warning-fg'>
            معلق: {formatNumberEn(summary.orders.pending)}
          </span>
          <span className='font-semibold text-info-fg'>
            مكتمل: {formatNumberEn(summary.orders.completed)}
          </span>
          <span className='font-semibold text-danger-fg'>
            ملغي: {formatNumberEn(summary.orders.cancelled)}
          </span>
        </div>
      </div>

      {/* تفاصيل العملاء والمبيعات */}
      <div className='mb-8 rounded-xl bg-card p-6 shadow'>
        <h2 className='mb-4 text-xl font-bold text-card-foreground'>تفاصيل العملاء والمبيعات</h2>
        <div className='flex flex-wrap justify-center gap-6'>
          <span className='font-semibold text-success-fg'>
            عملاء جدد اليوم: {formatNumberEn(summary.customers.today)}
          </span>
          <span className='font-semibold text-success-fg'>
            مبيعات اليوم: {formatNumberEn(summary.sales.today)}
          </span>
        </div>
      </div>

      {/* Sales Over Time Chart */}
      <div className='mb-8 rounded-xl bg-card p-6 shadow'>
        <h2 className='mb-4 text-xl font-bold text-card-foreground'>المبيعات على مدار الشهور</h2>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={summary.salesByMonth} layout='horizontal'>
            <XAxis dataKey='name' tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v) => [formatNumberEn(v as number), 'ر.س']} />
            <Bar dataKey='sales' fill={barChartFillColor} name='المبيعات' radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Products */}
      <Card className="mb-8 shadow-lg border-l-4 border-feature-products card-hover-effect card-border-glow">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Package className="h-5 w-5 text-feature-products icon-enhanced" />
            المنتجات الأكثر مبيعًا
          </CardTitle>
        </CardHeader>
        <CardContent>
          <table className="min-w-full text-right">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-2 text-muted-foreground">المنتج</th>
                <th className="px-4 py-2 text-muted-foreground">المبيعات</th>
                <th className="px-4 py-2 text-muted-foreground">الكمية</th>
              </tr>
            </thead>
            <tbody>
              {summary.topProducts.map((p, i) => (
                <tr key={i} className="border-b hover:bg-feature-products-soft transition">
                  <td className="flex items-center gap-2 font-bold text-lg">
                    {i === 0 && <Star className="h-4 w-4 text-yellow-400" />}
                    <Package className="h-4 w-4 text-feature-products" />
                    {p.name}
                  </td>
                  <td className="font-mono font-semibold">{formatNumberEn(p.sales)}</td>
                  <td>
                    <span className="inline-block rounded-full bg-feature-products-soft px-3 py-1 text-xs font-bold text-feature-products">
                      {formatNumberEn(p.quantity)} قطعة
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Order Status Pie Chart */}
      <div className='mb-8 rounded-xl bg-card p-6 shadow'>
        <h2 className='mb-4 text-xl font-bold text-card-foreground'>حالة الطلبات</h2>
        <ResponsiveContainer width='100%' height={250}>
          <PieChart>
            <Pie
              data={summary.orderStatus}
              cx='50%'
              cy='50%'
              outerRadius={80}
              fill='#2563eb'
              dataKey='value'
              label
            >
              {summary.orderStatus.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={pieChartColors.length > 0 ? pieChartColors[index % pieChartColors.length] : '#cccccc'}
                />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Orders Table */}
      <div className='mb-8 rounded-xl bg-card p-6 shadow'>
        <h2 className='mb-4 text-xl font-bold text-card-foreground'>أحدث الطلبات</h2>
        <table className='min-w-full text-center'>
          <thead>
            <tr className='bg-muted'>
              <th className='px-4 py-2 text-muted-foreground'>رقم الطلب</th>
              <th className='px-4 py-2 text-muted-foreground'>العميل</th>
              <th className='px-4 py-2 text-muted-foreground'>المبلغ</th>
              <th className='px-4 py-2 text-muted-foreground'>الحالة</th>
              <th className='px-4 py-2 text-muted-foreground'>التاريخ</th>
            </tr>
          </thead>
          <tbody className='text-card-foreground'>
            {summary.recentOrders.map((o) => (
              <tr key={o.id} className='border-b'>
                <td className='px-4 py-2'>{o.orderNumber || '—'}</td>
                <td className='px-4 py-2'>{o.customer || '—'}</td>
                <td className='px-4 py-2'>{formatNumberEn(o.amount)}</td>
                <td className='px-4 py-2'>{statusLabels[o.status] || o.status}</td>
                <td className='px-4 py-2'>{new Date(o.date).toLocaleDateString('en-US')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick Actions */}
      <div className='flex flex-wrap justify-center gap-4'>
        <Link
          href='/dashboard/products-control/add'
          className='rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground shadow transition hover:bg-primary/90'
        >
          إضافة منتج جديد
        </Link>
        <button className='rounded-lg bg-secondary px-6 py-3 font-semibold text-secondary-foreground shadow transition hover:bg-muted'>
          تصدير التقارير
        </button>
      </div>
    </div>
  );
}
