'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    X,
    TrendingUp,
    Camera,
    Mic,
    Filter,
    Globe,
    Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SearchSuggestion {
    id: string;
    type: 'product' | 'category' | 'brand' | 'trending';
    title: string;
    subtitle?: string;
    imageUrl?: string;
    price?: number;
    originalPrice?: number;
    rating?: number;
    isHot?: boolean;
    href: string;
}

interface RecentSearch {
    id: string;
    query: string;
    timestamp: Date;
}

interface MobileSearchBarProps {
    placeholder?: string;
    onSearch?: (query: string) => void;
    enableBingSearch?: boolean;
    className?: string;
}

export default function MobileSearchBar({
    placeholder = "ابحث عن المنتجات...",
    onSearch,
    enableBingSearch = true,
    className
}: MobileSearchBarProps) {
    const [query, setQuery] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [_suggestions, _setSuggestions] = useState<SearchSuggestion[]>([]); // TODO: Implement search suggestions
    const [_recentSearches, _setRecentSearches] = useState<RecentSearch[]>([]); // TODO: Implement recent searches
    const [trendingSearches, setTrendingSearches] = useState<string[]>([]);
    const [_isLoading, _setIsLoading] = useState(false); // TODO: Implement loading states

    const searchInputRef = useRef<HTMLInputElement>(null);

    // Sample trending searches
    useEffect(() => {
        setTrendingSearches([
            'فساتين صيفية',
            'أحذية رياضية',
            'حقائب يد',
            'عطور نسائية',
            'ساعات ذكية',
            'ملابس أطفال',
            'مكياج',
            'إكسسوارات'
        ]);
    }, []);

    const handleSearch = (searchQuery: string) => {
        if (searchQuery.trim()) {
            onSearch?.(searchQuery);
            setIsExpanded(false);
            setQuery('');
        }
    };

    const handleBingSearch = (searchQuery: string) => {
        if (searchQuery.trim()) {
            const bingUrl = `https://www.bing.com/search?q=${encodeURIComponent(searchQuery + ' site:' + window.location.hostname)}`;
            window.open(bingUrl, '_blank');
            setIsExpanded(false);
            setQuery('');
        }
    };

    return (
        <div className={cn("relative w-full", className)}>
            {/* Search Input */}
            <div className="relative">
                <Input
                    ref={searchInputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsExpanded(true)}
                    placeholder={placeholder}
                    className={cn(
                        "w-full h-12 pl-12 pr-20 rounded-full border-2 transition-all duration-200",
                        "focus:border-feature-products focus:ring-feature-products",
                        isExpanded ? "bg-background shadow-lg" : "bg-muted/30"
                    )}
                />

                {/* Search Icon */}
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />

                {/* Right Actions */}
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 rounded-full p-0"
                    >
                        <Mic className="h-4 w-4 text-muted-foreground" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 rounded-full p-0"
                    >
                        <Camera className="h-4 w-4 text-muted-foreground" />
                    </Button>

                    {(query || isExpanded) && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setQuery('');
                                setIsExpanded(false);
                                searchInputRef.current?.blur();
                            }}
                            className="w-8 h-8 rounded-full p-0"
                        >
                            <X className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Search Overlay */}
            <AnimatePresence>
                {isExpanded && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/20 z-40"
                            onClick={() => setIsExpanded(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute top-full left-0 right-0 z-50 bg-background rounded-2xl shadow-2xl border mt-2 max-h-[70vh] overflow-y-auto"
                        >
                            <div className="p-4">
                                {/* Trending Searches */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4" />
                                        البحث الرائج
                                    </h3>

                                    <div className="flex flex-wrap gap-2">
                                        {trendingSearches.map((trend, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleSearch(trend)}
                                                className="px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-full text-sm text-foreground transition-colors"
                                            >
                                                {trend}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="mt-6 pt-4 border-t border-border space-y-3">
                                    {/* Advanced Search */}
                                    <Link
                                        href="/search/filters"
                                        className="flex items-center justify-center gap-2 p-3 bg-feature-products/10 rounded-lg text-feature-products hover:bg-feature-products/20 transition-colors"
                                    >
                                        <Filter className="h-4 w-4" />
                                        <span className="font-medium">البحث المتقدم</span>
                                    </Link>

                                    {/* Bing Search */}
                                    {enableBingSearch && query && (
                                        <button
                                            onClick={() => handleBingSearch(query)}
                                            className="w-full flex items-center justify-center gap-2 p-3 bg-blue-500/10 rounded-lg text-blue-600 hover:bg-blue-500/20 transition-colors"
                                        >
                                            <Globe className="h-4 w-4" />
                                            <span className="font-medium">البحث في Bing</span>
                                            <Zap className="h-3 w-3" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
} 