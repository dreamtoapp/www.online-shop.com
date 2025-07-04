'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    X,
    Clock,
    TrendingUp,
    ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface MobileSearchDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSearch?: (query: string) => void;
}

export default function MobileSearchDrawer({
    isOpen,
    onClose,
    onSearch
}: MobileSearchDrawerProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    // Sample trending searches
    const trendingSearches = [
        'فساتين صيفية',
        'أحذية رياضية',
        'حقائب يد',
        'ملابس أطفال',
        'إكسسوارات',
        'جاكيت شتوي'
    ];

    useEffect(() => {
        if (isOpen && inputRef.current) {
            // Focus the input when drawer opens
            setTimeout(() => {
                inputRef.current?.focus();
            }, 300);
        }
    }, [isOpen]);

    useEffect(() => {
        // Load recent searches from localStorage
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    const handleSearch = (query: string) => {
        if (!query.trim()) return;

        // Add to recent searches
        const updated = [query, ...recentSearches.filter(item => item !== query)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('recentSearches', JSON.stringify(updated));

        // Execute search
        onSearch?.(query);
        onClose();

        // Navigate to search results
        window.location.href = `/search?q=${encodeURIComponent(query)}`;
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch(searchQuery);
        }
    };

    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem('recentSearches');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black/50 z-50 md:hidden"
                        onClick={onClose}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ y: '-100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '-100%' }}
                        transition={{
                            type: 'spring',
                            damping: 25,
                            stiffness: 200,
                            duration: 0.3
                        }}
                        className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border shadow-2xl md:hidden"
                    >
                        <div className="container mx-auto px-4 py-6">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold">البحث</h2>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onClose}
                                    className="w-8 h-8 p-0"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            {/* Search Input */}
                            <div className="relative mb-6">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        ref={inputRef}
                                        type="text"
                                        placeholder="ابحث عن المنتجات..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="pl-10 pr-4 h-12 text-base border-2 focus:border-feature-users transition-colors duration-300"
                                    />
                                </div>
                                {searchQuery && (
                                    <Button
                                        onClick={() => handleSearch(searchQuery)}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 px-3 bg-feature-users hover:bg-feature-users/90"
                                        size="sm"
                                    >
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>

                            {/* Recent Searches */}
                            {recentSearches.length > 0 && (
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            البحث السابق
                                        </h3>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={clearRecentSearches}
                                            className="text-xs text-destructive hover:text-destructive"
                                        >
                                            مسح الكل
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {recentSearches.map((search, index) => (
                                            <motion.button
                                                key={index}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: index * 0.1 }}
                                                onClick={() => handleSearch(search)}
                                                className="flex items-center gap-1 px-3 py-2 bg-muted rounded-full text-sm hover:bg-muted/80 transition-colors duration-200"
                                            >
                                                <Clock className="h-3 w-3 text-muted-foreground" />
                                                {search}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Trending Searches */}
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4" />
                                    البحث الرائج
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {trendingSearches.map((search, index) => (
                                        <motion.button
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                            onClick={() => handleSearch(search)}
                                            className="flex items-center gap-1 px-3 py-2 bg-feature-users/10 border border-feature-users/20 rounded-full text-sm hover:bg-feature-users/20 transition-colors duration-200"
                                        >
                                            <TrendingUp className="h-3 w-3 text-feature-users" />
                                            {search}
                                            <Badge variant="secondary" className="ml-1 text-xs">
                                                {Math.floor(Math.random() * 100) + 1}
                                            </Badge>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
} 