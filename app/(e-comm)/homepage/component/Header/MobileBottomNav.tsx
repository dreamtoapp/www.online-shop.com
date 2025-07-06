'use client';

import { useState, useEffect, useRef, useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@/components/icons/Icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { pingAdminAction } from '@/app/pingAdminAction';
import { WishlistContext } from '@/providers/wishlist-provider';

import Image from 'next/image';

// Types
interface BottomNavItem {
    id: string;
    label: string;
    icon: string;
    href: string;
    badge?: number;
    color: string;
    userImage?: string | null;
    userName?: string;
}

interface MobileBottomNavProps {
    wishlistCount?: number;
    isLoggedIn?: boolean;
    userImage?: string | null;
    userName?: string | null;
    supportEnabled?: boolean;
    whatsappNumber?: string;
    userId?: string;
    onSearchClick?: () => void;
}

// Navigation Item Component (80 lines)
function NavigationItem({
    item,
    isActive,
    onTabPress,
    onSearchClick
}: {
    item: BottomNavItem;
    isActive: boolean;
    onTabPress: (id: string) => void;
    onSearchClick?: () => void;
}) {
    const content = (
        <>
            <div className="relative flex items-center justify-center h-7 w-7">
                {item.id === 'account' ? (
                    item.userImage && !item.userImage.includes('/fallback/') ? (
                        <div className={cn(
                            "relative h-6 w-6 rounded-full transition-all duration-300",
                            isActive
                                ? `ring-2 ring-offset-1 ${item.color.replace('text-', 'ring-')} ring-offset-background`
                                : "ring-1 ring-muted/50"
                        )}>
                            <Image
                                src={item.userImage}
                                alt="User Profile"
                                fill
                                className="rounded-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className={cn(
                            "h-6 w-6 rounded-full flex items-center justify-center bg-feature-users text-white font-bold text-xs select-none",
                            isActive
                                ? `ring-2 ring-offset-1 ${item.color.replace('text-', 'ring-')} ring-offset-background`
                                : "ring-1 ring-muted/50"
                        )}>
                            {item.userName && item.userName.length > 0 ? (
                                <span className="uppercase">{item.userName[0]}</span>
                            ) : (
                                <Icon name="User" size="sm" />
                            )}
                        </div>
                    )
                ) : (
                    <Icon name={item.icon} size="sm" className={cn(
                        "transition-all duration-300",
                        isActive ? `${item.color} scale-110` : "text-muted-foreground",
                        item.id === 'wishlist' && item.badge && item.badge > 0
                            ? "text-feature-users fill-current" : ""
                    )} />
                )}

                {isActive && item.id === 'account' && !item.userImage && (
                    <motion.div
                        layoutId="activeTab"
                        className={cn(
                            "absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full",
                            item.color.replace('text-', 'bg-')
                        )}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                )}
            </div>
            <div className="flex items-center gap-1 mt-1">
                <span className={cn(
                    "text-xs transition-colors duration-300",
                    isActive ? item.color : "text-muted-foreground"
                )}>
                    {item.label}
                </span>
                {item.badge && item.badge > 0 && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    >
                        <Badge className={cn(
                            "text-xs min-w-[16px] h-[16px] rounded-full flex items-center justify-center p-0 font-bold shadow-sm",
                            item.id === 'wishlist'
                                ? "bg-feature-users text-primary-foreground"
                                : "bg-destructive text-destructive-foreground"
                        )}>
                            {item.badge > 99 ? '99+' : item.badge}
                        </Badge>
                    </motion.div>
                )}
            </div>
        </>
    );

    if (item.id === 'search') {
        return (
            <button
                onClick={() => {
                    onTabPress(item.id);
                    onSearchClick?.();
                }}
                className={cn(
                    "flex flex-col items-center justify-center relative transition-all duration-300 w-full h-full pt-1",
                    "hover:bg-muted/50 active:bg-muted",
                    isActive ? "bg-muted/50" : ""
                )}
            >
                {content}
            </button>
        );
    }

    return (
        <Link
            href={item.href}
            onClick={() => onTabPress(item.id)}
            className={cn(
                "flex flex-col items-center justify-center relative transition-all duration-300 w-full h-full pt-1",
                "hover:bg-muted/50 active:bg-muted",
                isActive ? "bg-muted/50" : ""
            )}
        >
            {content}
        </Link>
    );
}

// Support Modal Component (49 lines)
function SupportModal({
    isOpen,
    onClose,
    supportMessage,
    setSupportMessage,
    supportLoading,
    supportStatus,
    onSubmit
}: {
    isOpen: boolean;
    onClose: () => void;
    supportMessage: string;
    setSupportMessage: (msg: string) => void;
    supportLoading: boolean;
    supportStatus: string;
    onSubmit: () => void;
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="flex w-full max-w-xs flex-col gap-3 rounded-lg bg-background p-6 shadow-lg mx-4"
            >
                <h3 className="text-lg font-semibold text-foreground">وصف مشكلتك</h3>
                <p className="mb-1 text-xs text-muted-foreground">
                    <span className="mb-0.5 block">الغرض من هذه الخدمة: إرسال طلب دعم فوري للإدارة لحل مشكلة عاجلة أو استفسار هام.</span>
                    <span className="block">عدد الأحرف المسموح: من 5 إلى 200 حرف.</span>
                    <span className="block">يرجى استخدام هذه الخدمة فقط للمشاكل العاجلة أو الاستفسارات الهامة.</span>
                </p>
                <textarea
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    maxLength={200}
                    rows={3}
                    className="w-full resize-none rounded border border-border bg-background p-2 text-foreground placeholder:text-muted-foreground"
                    placeholder="كيف يمكننا مساعدتك؟"
                    autoFocus
                />
                <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={onClose} disabled={supportLoading}>إلغاء</Button>
                    <Button
                        size="sm"
                        onClick={onSubmit}
                        disabled={supportLoading || supportMessage.trim().length < 5}
                        className="bg-feature-settings hover:bg-feature-settings/90"
                    >
                        {supportLoading ? 'جارٍ الإرسال...' : 'إرسال'}
                    </Button>
                </div>
                {supportStatus === 'sent' && <p className="text-sm text-feature-products">تم إرسال الطلب بنجاح!</p>}
                {supportStatus === 'fallback' && <p className="text-sm text-feature-analytics">ستتم مراجعة طلبك قريباً (وضع الاحتياط).</p>}
                {supportStatus === 'rate-limited' && <p className="text-sm text-feature-settings">يرجى الانتظار قبل إرسال طلب آخر.</p>}
                {supportStatus === 'error' && <p className="text-sm text-destructive">فشل في إرسال الطلب. حاول مرة أخرى.</p>}
            </motion.div>
        </div>
    );
}

// Quick Action Buttons Component (66 lines)
function QuickActionButtons({
    showFAB,
    whatsappNumber,
    supportEnabled,
    supportCooldown,
    onSupportOpen
}: {
    showFAB: boolean;
    whatsappNumber?: string;
    supportEnabled?: boolean;
    supportCooldown: number;
    onSupportOpen: () => void;
}) {
    const handleWhatsAppClick = () => {
        const message = encodeURIComponent('مرحباً، أحتاج مساعدة في التسوق');
        window.open(`https://wa.me/${whatsappNumber?.replace(/\D/g, '')}?text=${message}`, '_blank');
        if ('vibrate' in navigator) navigator.vibrate(100);
    };

    return (
        <AnimatePresence>
            {showFAB && (
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ delay: 0.1 }}
                    className="fixed bottom-20 right-4 z-40 md:hidden space-y-3"
                >
                    {whatsappNumber && (
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button
                                size="sm"
                                variant="secondary"
                                className="w-12 h-12 rounded-full shadow-lg bg-feature-suppliers hover:bg-feature-suppliers/90 border-0 relative"
                                onClick={handleWhatsAppClick}
                            >
                                <Icon name="Whatsapp" size="sm" className="text-primary-foreground" />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-feature-suppliers rounded-full border-2 border-background animate-pulse"></div>
                            </Button>
                        </motion.div>
                    )}
                    {supportEnabled && (
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button
                                size="sm"
                                variant="secondary"
                                className="w-12 h-12 rounded-full shadow-lg bg-feature-settings hover:bg-feature-settings/90 border-0 relative"
                                onClick={onSupportOpen}
                                disabled={supportCooldown > 0}
                                title="طلب دعم فوري من الإدارة"
                            >
                                <Icon name="Zap" size="sm" className="text-primary-foreground" />
                                {supportCooldown > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-background border border-border rounded-full px-1 py-0.5 text-xs font-bold text-foreground shadow">
                                        {Math.floor(supportCooldown / 60)}:{(supportCooldown % 60).toString().padStart(2, '0')}
                                    </span>
                                )}
                            </Button>
                        </motion.div>
                    )}
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Link href="/categories">
                            <Button
                                size="sm"
                                variant="secondary"
                                className="w-12 h-12 rounded-full shadow-lg bg-gradient-to-r from-feature-analytics to-feature-settings border-0 relative"
                            >
                                <Icon name="TrendingUp" size="sm" className="text-primary-foreground" />
                                <Icon name="Sparkles" size="sm" className="text-primary-foreground absolute -top-1 -right-1 animate-pulse" />
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Main Component (69 lines)
export default function MobileBottomNav({
    wishlistCount = 0,
    isLoggedIn = false,
    userImage,
    userName,
    supportEnabled = true,
    whatsappNumber,
    userId = 'guest',
    onSearchClick
}: MobileBottomNavProps) {
    const ctx = useContext(WishlistContext);
    const derivedWishlistCount = ctx ? ctx.wishlistIds.size : wishlistCount;

    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState('home');
    const [showFAB, setShowFAB] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [supportStatus, setSupportStatus] = useState<'idle' | 'sent' | 'error' | 'fallback' | 'rate-limited'>('idle');
    const [showSupportModal, setShowSupportModal] = useState(false);
    const [supportMessage, setSupportMessage] = useState('');
    const [supportLoading, setSupportLoading] = useState(false);
    const [supportCooldown, setSupportCooldown] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const COOLDOWN_SECONDS = 180;
    const LAST_PING_KEY = 'support_ping_last_time';

    const navItems: BottomNavItem[] = [
        { id: 'home', label: 'الرئيسية', icon: 'Home', href: '/', color: 'text-feature-commerce' },
        { id: 'categories', label: 'الأقسام', icon: 'Grid3X3', href: '/categories', color: 'text-feature-products' },
        { id: 'search', label: 'البحث', icon: 'Search', href: '#', color: 'text-feature-analytics' },
        { id: 'wishlist', label: 'المفضلة', icon: 'Heart', href: '/user/wishlist', badge: derivedWishlistCount, color: 'text-feature-users' },
        {
            id: 'account',
            label: isLoggedIn ? 'حسابي' : 'دخول',
            icon: 'User',
            href: isLoggedIn ? '/user/profile' : '/auth/login',
            color: 'text-feature-settings',
            userImage: isLoggedIn ? userImage : null,
            userName: isLoggedIn ? userName || undefined : undefined
        },
    ];

    // Scroll handling
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setShowFAB(false);
            } else {
                setShowFAB(true);
            }
            setLastScrollY(currentScrollY);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    // Active tab handling
    useEffect(() => {
        if (pathname === '/') setActiveTab('home');
        else if (pathname.startsWith('/categories')) setActiveTab('categories');
        else if (pathname.startsWith('/search')) setActiveTab('search');
        else if (pathname.startsWith('/wishlist')) setActiveTab('wishlist');
        else if (pathname.startsWith('/user') || pathname.startsWith('/auth')) setActiveTab('account');
    }, [pathname]);

    // Support cooldown
    useEffect(() => {
        const lastPing = localStorage.getItem(LAST_PING_KEY);
        if (lastPing) {
            const elapsed = Math.floor((Date.now() - parseInt(lastPing, 10)) / 1000);
            if (elapsed < COOLDOWN_SECONDS) setSupportCooldown(COOLDOWN_SECONDS - elapsed);
        }
    }, [COOLDOWN_SECONDS, LAST_PING_KEY]);

    useEffect(() => {
        if (supportCooldown > 0) {
            timerRef.current = setInterval(() => {
                setSupportCooldown((prev) => prev <= 1 ? 0 : prev - 1);
                if (supportCooldown <= 1) clearInterval(timerRef.current!);
            }, 1000);
            return () => clearInterval(timerRef.current!);
        }
    }, [supportCooldown]);

    const handleTabPress = (tabId: string) => {
        setActiveTab(tabId);
        if ('vibrate' in navigator) navigator.vibrate(50);
    };

    const handleSupportPing = async () => {
        setSupportLoading(true);
        const res = await pingAdminAction(userId, supportMessage);
        setSupportLoading(false);

        if (res.success) setSupportStatus('sent');
        else if (res.fallback) setSupportStatus('fallback');
        else if (res.rateLimited) setSupportStatus('rate-limited');
        else setSupportStatus('error');

        if (res.success || res.fallback || res.rateLimited) {
            setSupportCooldown(COOLDOWN_SECONDS);
            localStorage.setItem(LAST_PING_KEY, Date.now().toString());
        }

        setShowSupportModal(false);
        setSupportMessage('');
    };

    return (
        <>
            <motion.div
                initial={{ y: 100 }}
                animate={{ y: showFAB ? 0 : 100 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg md:hidden overflow-hidden"
            >
                <div className="grid grid-cols-5 h-16 w-full">
                    {navItems.map((item) => (
                        <div key={item.id} className="relative">
                            <NavigationItem
                                item={item}
                                isActive={activeTab === item.id}
                                onTabPress={handleTabPress}
                                onSearchClick={onSearchClick}
                            />
                        </div>
                    ))}
                </div>
            </motion.div>

            <QuickActionButtons
                showFAB={showFAB}
                whatsappNumber={whatsappNumber}
                supportEnabled={supportEnabled}
                supportCooldown={supportCooldown}
                onSupportOpen={() => setShowSupportModal(true)}
            />

            <div className="h-16 md:hidden" />

            <SupportModal
                isOpen={showSupportModal}
                onClose={() => setShowSupportModal(false)}
                supportMessage={supportMessage}
                setSupportMessage={setSupportMessage}
                supportLoading={supportLoading}
                supportStatus={supportStatus}
                onSubmit={handleSupportPing}
            />
        </>
    );
} 