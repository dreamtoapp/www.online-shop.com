import React from 'react';
import { TrendingUp, Gift, ShoppingBag, Calendar, Sparkles, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type UserStats = {
    totalOrders: number;
    totalSpent: number;
    loyaltyPoints: number;
    memberSince: string;
    completionPercentage?: number;
    wishlistCount?: number;
    reviewsCount?: number;
};

const UserMenuStats: React.FC<{ userStats: UserStats }> = ({ userStats }) => {
    // Calculate completion percentage based on profile completeness
    const calculateCompletion = () => {
        let completed = 0;
        if (userStats.totalOrders > 0) completed += 25;
        if (userStats.loyaltyPoints > 0) completed += 25;
        if (userStats.wishlistCount && userStats.wishlistCount > 0) completed += 25;
        if (userStats.reviewsCount && userStats.reviewsCount > 0) completed += 25;
        return completed;
    };

    const completionPercentage = calculateCompletion();

    const statsData = [
        {
            label: "الطلبات",
            value: userStats.totalOrders,
            icon: <ShoppingBag className="w-4 h-4" />,
            color: "bg-feature-commerce",
            bgClass: "bg-feature-commerce/15",
            textClass: "text-feature-commerce",
            borderClass: "border-feature-commerce/30",
            gradient: "from-feature-commerce/20 to-feature-commerce/5",
            isHighlight: userStats.totalOrders > 0,
        },
        {
            label: "النقاط",
            value: userStats.loyaltyPoints,
            icon: <Gift className="w-4 h-4" />,
            color: "bg-feature-suppliers",
            bgClass: "bg-feature-suppliers/15",
            textClass: "text-feature-suppliers",
            borderClass: "border-feature-suppliers/30",
            gradient: "from-feature-suppliers/20 to-feature-suppliers/5",
            isHighlight: userStats.loyaltyPoints > 0,
        },
        {
            label: "الإنفاق",
            value: `${userStats.totalSpent} ر.س`,
            icon: <TrendingUp className="w-4 h-4" />,
            color: "bg-feature-analytics",
            bgClass: "bg-feature-analytics/15",
            textClass: "text-feature-analytics",
            borderClass: "border-feature-analytics/30",
            gradient: "from-feature-analytics/20 to-feature-analytics/5",
            isHighlight: userStats.totalSpent > 0,
        },
        {
            label: "عضو منذ",
            value: userStats.memberSince,
            icon: <Calendar className="w-4 h-4" />,
            color: "bg-feature-users",
            bgClass: "bg-feature-users/15",
            textClass: "text-feature-users",
            borderClass: "border-feature-users/30",
            gradient: "from-feature-users/20 to-feature-users/5",
            isHighlight: true,
        },
    ];

    // Additional stats for bottom row
    const extraStats = [
        {
            label: "المفضلة",
            value: userStats.wishlistCount || 0,
            icon: <Star className="w-3 h-3" />,
            textClass: "text-feature-products",
            bgClass: "bg-feature-products/10",
            borderClass: "border-feature-products/20",
        },
        {
            label: "التقييمات",
            value: userStats.reviewsCount || 0,
            icon: <Star className="w-3 h-3" />,
            textClass: "text-feature-analytics",
            bgClass: "bg-feature-analytics/10",
            borderClass: "border-feature-analytics/20",
        }
    ];

    return (
        <div className="space-y-3">
            {/* Main stats grid */}
            <div className="grid grid-cols-4 gap-2">
                {statsData.map((stat, index) => (
                    <Card
                        key={stat.label}
                        className={`relative overflow-hidden border-0 hover:scale-105 transition-all duration-500 shadow-sm hover:shadow-lg group cursor-pointer bg-gradient-to-br ${stat.gradient}`}
                        style={{
                            animationDelay: `${index * 100}ms`,
                            animation: `fadeInUp 0.6s ease-out forwards`,
                        }}
                    >
                        <CardContent className="p-3 relative">
                            {/* Highlight glow for active stats */}
                            {stat.isHighlight && (
                                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-50 animate-pulse`} />
                            )}

                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className={`p-1.5 rounded-xl ${stat.bgClass} ${stat.textClass} group-hover:scale-125 transition-all duration-500 mb-2 shadow-sm border ${stat.borderClass}`}>
                                    {stat.icon}
                                    {/* Success sparkle for positive stats */}
                                    {stat.isHighlight && typeof stat.value === 'number' && stat.value > 0 && (
                                        <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400 animate-pulse" />
                                    )}
                                </div>

                                <div className={`text-xs opacity-80 mb-1 ${stat.textClass} leading-tight font-medium`}>
                                    {stat.label}
                                </div>
                                <div className={`text-sm font-bold ${stat.textClass} group-hover:scale-110 transition-transform duration-500 leading-tight`}>
                                    {stat.value}
                                </div>
                            </div>

                            {/* Hover effect overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Progress indicator */}
            {completionPercentage > 0 && (
                <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-feature-users/10 via-feature-analytics/10 to-feature-suppliers/10 border border-feature-users/20">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-feature-users">مستوى النشاط</span>
                        <Badge variant="secondary" className="bg-feature-users/10 text-feature-users border-feature-users/20 text-xs">
                            {completionPercentage}%
                        </Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-feature-users via-feature-analytics to-feature-suppliers transition-all duration-1000 ease-out"
                            style={{
                                width: `${completionPercentage}%`,
                                animation: `progressFill 1.5s ease-out forwards`
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Bottom quick stats */}
            <div className="grid grid-cols-2 gap-2">
                {extraStats.map((stat, index) => (
                    <div
                        key={stat.label}
                        className={`flex items-center gap-2 p-2 rounded-lg ${stat.bgClass} border ${stat.borderClass} hover:scale-105 transition-all duration-300`}
                        style={{
                            animationDelay: `${(index + 4) * 100}ms`,
                        }}
                    >
                        <div className={`p-1 rounded ${stat.bgClass} ${stat.textClass}`}>
                            {stat.icon}
                        </div>
                        <div className="flex-1 text-right">
                            <div className={`text-xs ${stat.textClass} font-medium`}>{stat.label}</div>
                            <div className={`text-sm font-bold ${stat.textClass}`}>{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add animations */}
            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes progressFill {
                    from {
                        width: 0%;
                    }
                    to {
                        width: ${completionPercentage}%;
                    }
                }
            `}</style>
        </div>
    );
};

export default UserMenuStats; 