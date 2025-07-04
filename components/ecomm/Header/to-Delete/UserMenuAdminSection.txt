import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Crown,
    BarChart3,
    Users,
    Package,
    ShoppingCart,
    TrendingUp,
    ArrowRight
} from 'lucide-react';

const UserMenuAdminSection: React.FC = () => {
    const adminFeatures = [
        {
            href: "/dashboard",
            label: "لوحة التحكم الرئيسية",
            icon: <BarChart3 className="w-4 h-4" />,
            description: "إحصائيات ومتابعة شاملة",
            badge: null,
        },
        {
            href: "/dashboard/management-orders",
            label: "إدارة الطلبات",
            icon: <ShoppingCart className="w-4 h-4" />,
            description: "متابعة وإدارة جميع الطلبات",
            badge: "جديد",
        },
        {
            href: "/dashboard/management-products",
            label: "إدارة المنتجات",
            icon: <Package className="w-4 h-4" />,
            description: "إضافة وتعديل المنتجات",
            badge: null,
        },
        {
            href: "/dashboard/management-users",
            label: "إدارة المستخدمين",
            icon: <Users className="w-4 h-4" />,
            description: "متابعة وإدارة العملاء",
            badge: null,
        },
    ];

    return (
        <div className="space-y-3">
            {/* Admin Status Banner */}
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-feature-users/20 to-feature-analytics/20 rounded-xl border border-feature-users/30">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-feature-users/20">
                        <Crown className="w-4 h-4 text-feature-users" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-feature-users">صلاحيات المدير</p>
                        <p className="text-xs text-feature-users/80">الوصول الكامل للنظام</p>
                    </div>
                </div>
                <Badge variant="secondary" className="bg-feature-users/10 text-feature-users border-feature-users/20">
                    نشط
                </Badge>
            </div>

            {/* Quick Admin Actions */}
            <div className="grid grid-cols-2 gap-2">
                {adminFeatures.map((feature) => (
                    <Link
                        key={feature.href}
                        href={feature.href}
                        className="group p-3 rounded-xl bg-feature-users/5 hover:bg-feature-users/10 border border-feature-users/10 hover:border-feature-users/20 transition-all duration-300 hover:scale-105"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 rounded-lg bg-feature-users/10 text-feature-users group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            {feature.badge && (
                                <Badge variant="secondary" className="text-xs scale-75">
                                    {feature.badge}
                                </Badge>
                            )}
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-feature-users mb-1 group-hover:translate-x-1 transition-transform duration-300">
                                {feature.label}
                            </p>
                            <p className="text-xs text-feature-users/70 leading-tight">
                                {feature.description}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Full Dashboard Access */}
            <Button
                asChild
                className="w-full bg-feature-users hover:bg-feature-users/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
                <Link href="/dashboard" className="flex items-center justify-center gap-2">
                    <TrendingUp className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    <span>الانتقال للوحة التحكم الكاملة</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
            </Button>
        </div>
    );
};

export default UserMenuAdminSection; 