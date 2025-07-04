'use client';

import React from 'react';
import {
    SheetContent,
    SheetDescription,
    SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    User,
    ChevronLeft,
    Bell,
    ShoppingBag,
    CreditCard,
    Star,
    Heart,
    Settings,
    Award,
    Phone,
    LogOut,
} from 'lucide-react';
import UserMenuStats from './UserMenuStats';
import { UserRole } from '@/constant/enums';
import Link from 'next/link';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

interface UserStats {
    totalOrders: number;
    totalSpent: number;
    loyaltyPoints: number;
    memberSince: string; // MM/YY
    wishlistCount: number;
    reviewsCount: number;
}

interface UserMenuSheetContentProps {
    user: {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role?: UserRole;
    } | null;
    alerts?: any[];
    isMobile: boolean;
    userStats: UserStats | null;
}

const UserMenuSheetContent: React.FC<UserMenuSheetContentProps> = ({ user, isMobile, userStats }) => {
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Custom scrollbar styles
    const scrollbarStyles = `
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: ${isMobile ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.2)'};
            border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: ${isMobile ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.4)'};
        }
    `;

    // Enhanced navigation links with better icons and descriptions
    const navLinks = [
        {
            href: `/user/profile?id=${user?.id}`,
            label: "الملف الشخصي",
            icon: <User className="w-5 h-5" />,
            description: "إدارة معلوماتك الشخصية",
            variant: "default" as const,
            badge: null, // You can add completion logic if needed
        },
        {
            href: `/user/purchase-history`,
            label: "سجل المشتريات",
            icon: <ShoppingBag className="w-5 h-5" />,
            description: "تصفح مشترياتك وطلباتك السابقة",
            variant: "secondary" as const,
            badge: userStats ? userStats.totalOrders.toString() : undefined,
        },
        {
            href: `/user/statement?id=${user?.id}`,
            label: "الحركات المالية",
            icon: <CreditCard className="w-5 h-5" />,
            description: "عرض تاريخ المعاملات والمدفوعات",
            variant: "secondary" as const,
            badge: "جديد",
        },
        {
            href: `/user/ratings`,
            label: "تقييماتي ومراجعاتي",
            icon: <Star className="w-5 h-5" />,
            description: "إدارة تقييماتك وآرائك",
            variant: "secondary" as const,
            badge: userStats ? userStats.reviewsCount.toString() : undefined,
        },
        {
            href: `/user/wishlist`,
            label: "قائمة المفضلة",
            icon: <Heart className="w-5 h-5" />,
            description: "المنتجات التي أعجبتك",
            variant: "destructive" as const,
            badge: userStats ? userStats.wishlistCount.toString() : undefined,
        },
        {
            href: `/user/setting`,
            label: "إعدادات الحساب",
            icon: <Settings className="w-5 h-5" />,
            description: "تخصيص إعدادات حسابك والأمان",
            variant: "outline" as const,
            badge: null,
        },
        {
            href: `/user/notifications`,
            label: "الإشعارات",
            icon: <Bell className="w-5 h-5" />,
            description: "إدارة إشعاراتك وتنبيهاتك",
            variant: "secondary" as const,
            badge: "جديد",
        },
        {
            href: `/contact`,
            label: "اتصل بنا",
            icon: <Phone className="w-5 h-5" />,
            description: "تواصل مع فريق الدعم",
            variant: "outline" as const,
            badge: null,
        },
        {
            href: `/about`,
            label: "حول الموقع",
            icon: <Award className="w-5 h-5" />,
            description: "معلومات عن موقعنا وخدماتنا",
            variant: "outline" as const,
            badge: null,
        },
    ];

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await signOut({
                callbackUrl: '/',
                redirect: true
            });
        } catch (error) {
            console.error('خطأ في تسجيل الخروج:', error);
            setIsLoggingOut(false);
        }
    };

    return (
        <>
            <style>{scrollbarStyles}</style>
            <SheetContent
                side={isMobile ? "bottom" : "right"}
                className={`overflow-y-auto custom-scrollbar ${isMobile ? 'h-[85vh] pb-safe-area-inset-bottom' : 'h-screen'}`}
            >
                {/* Header with gradient background */}
                <div className={isMobile
                    ? "relative p-4 bg-gradient-to-br from-feature-users via-feature-users/90 to-feature-analytics text-white overflow-hidden flex-shrink-0"
                    : "p-4 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-b border-border flex-shrink-0"
                }>
                    {/* Background pattern for mobile */}
                    {isMobile && (
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-4 right-4 w-32 h-32 rounded-full border border-white/20"></div>
                            <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full border border-white/20"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-white/10"></div>
                        </div>
                    )}

                    <div className="relative z-10 flex items-center gap-4 mb-3">
                        <div className={`p-3 rounded-2xl ${isMobile ? 'bg-white/20 backdrop-blur-sm' : 'bg-primary/10'} border ${isMobile ? 'border-white/30' : 'border-primary/20'}`}>
                            <User className={`w-6 h-6 ${isMobile ? 'text-white' : 'text-primary'}`} />
                        </div>
                        <div>
                            <SheetTitle className={`text-2xl font-bold ${isMobile ? 'text-white' : 'text-foreground'} flex items-center gap-2`}>
                                حسابي
                                <Badge variant={isMobile ? "secondary" : "secondary"} className={`text-xs ${isMobile ? 'bg-white/20 text-white border-white/30' : ''}`}>
                                    متصل
                                </Badge>
                            </SheetTitle>
                            <SheetDescription className={`${isMobile ? 'text-white/80' : 'text-muted-foreground'} font-medium`}>
                                مركز إدارة الحساب الشخصي
                            </SheetDescription>
                        </div>
                    </div>

                    {/* User stats/analytics always visible */}
                    {userStats ? (
                        <UserMenuStats userStats={userStats} />
                    ) : (
                        <div className="p-4 text-center text-muted-foreground">جاري تحميل بيانات المستخدم...</div>
                    )}
                </div>

                {/* Navigation Links as styled buttons */}
                <div className="flex-1 p-4 space-y-2">
                    {navLinks.map((link, index) => (
                        <Link
                            key={index}
                            href={link.href}
                            className="flex items-center gap-3 px-4 py-2 rounded-lg transition-colors border border-border bg-muted hover:bg-accent text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                            {link.icon}
                            <div className="flex-1 min-w-0 text-right">
                                <div className="font-medium">{link.label}</div>
                                <div className="text-xs opacity-70 truncate">{link.description}</div>
                            </div>
                            {link.badge && (
                                <Badge variant={link.variant} className="ml-2">
                                    {link.badge}
                                </Badge>
                            )}
                            <ChevronLeft className="w-5 h-5 opacity-50" />
                        </Link>
                    ))}

                    {/* Logout Section */}
                    <div className="mt-6 pt-4 border-t border-border">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-3 px-4 py-3 text-destructive hover:text-destructive hover:bg-destructive/10 border border-destructive/20 hover:border-destructive/30 rounded-lg transition-all duration-200"
                                    disabled={isLoggingOut}
                                >
                                    <LogOut className="w-5 h-5" />
                                    <div className="flex-1 text-right">
                                        <div className="font-medium">تسجيل الخروج</div>
                                        <div className="text-xs opacity-70">إنهاء الجلسة الحالية</div>
                                    </div>
                                    <ChevronLeft className="w-5 h-5 opacity-50" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="max-w-md">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-right flex items-center gap-2">
                                        <LogOut className="w-5 h-5 text-destructive" />
                                        تأكيد تسجيل الخروج
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-right">
                                        هل أنت متأكد من رغبتك في تسجيل الخروج من حسابك؟
                                        <br />
                                        <span className="text-muted-foreground text-sm">ستحتاج إلى تسجيل الدخول مرة أخرى للوصول إلى حسابك.</span>
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="gap-2">
                                    <AlertDialogCancel className="btn-cancel-outline">
                                        إلغاء
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleLogout}
                                        disabled={isLoggingOut}
                                        className="btn-delete"
                                    >
                                        {isLoggingOut ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                                                جاري تسجيل الخروج...
                                            </>
                                        ) : (
                                            <>
                                                <LogOut className="w-4 h-4 ml-2" />
                                                تسجيل الخروج
                                            </>
                                        )}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </SheetContent>
        </>
    );
};

export default UserMenuSheetContent; 