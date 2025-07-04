'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight,
    Star,
    Clock,
    Flame,
    TrendingUp,
    Package,
    Sparkles,
    Heart,
    ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface CategoryItem {
    id: string;
    name: string;
    slug: string;
    icon?: string;
    imageUrl?: string;
    productCount?: number;
    isHot?: boolean;
    isNew?: boolean;
}

interface FeaturedProduct {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    imageUrl: string;
    rating: number;
    slug: string;
    isLimitedTime?: boolean;
}

interface MegaMenuCategory {
    id: string;
    name: string;
    slug: string;
    icon: any;
    color: string;
    subcategories: CategoryItem[];
    featuredProducts: FeaturedProduct[];
    promotionalBanner?: {
        title: string;
        description: string;
        imageUrl: string;
        linkUrl: string;
        backgroundColor: string;
    };
}

// Sample data structure - replace with actual API data
const megaMenuCategories: MegaMenuCategory[] = [
    {
        id: 'women',
        name: 'ملابس نسائية',
        slug: 'women',
        icon: Sparkles,
        color: 'border-feature-products',
        subcategories: [
            { id: 'dresses', name: 'فساتين', slug: 'dresses', productCount: 2543, isHot: true },
            { id: 'tops', name: 'بلوزات', slug: 'tops', productCount: 1876 },
            { id: 'bottoms', name: 'بناطيل', slug: 'bottoms', productCount: 1234 },
            { id: 'outerwear', name: 'ملابس خارجية', slug: 'outerwear', productCount: 987, isNew: true },
            { id: 'activewear', name: 'ملابس رياضية', slug: 'activewear', productCount: 654 },
            { id: 'swimwear', name: 'ملابس سباحة', slug: 'swimwear', productCount: 432 }
        ],
        featuredProducts: [
            {
                id: 'p1',
                name: 'فستان صيفي أنيق',
                price: 89,
                originalPrice: 129,
                imageUrl: '/fallback/product-fallback.avif',
                rating: 4.8,
                slug: 'summer-dress',
                isLimitedTime: true
            },
            {
                id: 'p2',
                name: 'بلوزة عملية راقية',
                price: 65,
                imageUrl: '/fallback/product-fallback.avif',
                rating: 4.6,
                slug: 'office-blouse'
            },
            {
                id: 'p3',
                name: 'جاكيت شتوي دافئ',
                price: 156,
                originalPrice: 200,
                imageUrl: '/fallback/product-fallback.avif',
                rating: 4.9,
                slug: 'winter-jacket'
            }
        ],
        promotionalBanner: {
            title: 'تخفيضات الصيف',
            description: 'خصم يصل إلى 70% على مختارات مميزة',
            imageUrl: '/fallback/fallback.avif',
            linkUrl: '/summer-sale',
            backgroundColor: 'bg-gradient-to-r from-pink-500 to-purple-600'
        }
    },
    {
        id: 'men',
        name: 'ملابس رجالية',
        slug: 'men',
        icon: Package,
        color: 'border-feature-users',
        subcategories: [
            { id: 'shirts', name: 'قمصان', slug: 'shirts', productCount: 1234, isHot: true },
            { id: 'pants', name: 'بناطيل', slug: 'pants', productCount: 987 },
            { id: 'suits', name: 'بدلات', slug: 'suits', productCount: 543 },
            { id: 'casual', name: 'كاجوال', slug: 'casual', productCount: 876, isNew: true },
            { id: 'sportswear', name: 'ملابس رياضية', slug: 'sportswear', productCount: 654 },
            { id: 'accessories', name: 'إكسسوارات', slug: 'accessories', productCount: 432 }
        ],
        featuredProducts: [
            {
                id: 'm1',
                name: 'قميص رسمي أنيق',
                price: 95,
                imageUrl: '/fallback/product-fallback.avif',
                rating: 4.7,
                slug: 'formal-shirt'
            },
            {
                id: 'm2',
                name: 'بدلة عمل راقية',
                price: 280,
                originalPrice: 350,
                imageUrl: '/fallback/product-fallback.avif',
                rating: 4.8,
                slug: 'business-suit',
                isLimitedTime: true
            }
        ]
    },
    {
        id: 'accessories',
        name: 'إكسسوارات',
        slug: 'accessories',
        icon: Heart,
        color: 'border-feature-analytics',
        subcategories: [
            { id: 'bags', name: 'حقائب', slug: 'bags', productCount: 876, isHot: true },
            { id: 'jewelry', name: 'مجوهرات', slug: 'jewelry', productCount: 654 },
            { id: 'watches', name: 'ساعات', slug: 'watches', productCount: 432 },
            { id: 'sunglasses', name: 'نظارات شمسية', slug: 'sunglasses', productCount: 321, isNew: true },
            { id: 'scarves', name: 'أوشحة', slug: 'scarves', productCount: 234 },
            { id: 'belts', name: 'أحزمة', slug: 'belts', productCount: 198 }
        ],
        featuredProducts: [
            {
                id: 'a1',
                name: 'حقيبة يد عصرية',
                price: 120,
                originalPrice: 160,
                imageUrl: '/fallback/product-fallback.avif',
                rating: 4.5,
                slug: 'trendy-handbag'
            }
        ]
    }
];

interface MegaMenuProps {
    isOpen: boolean;
    activeCategory: string | null;
    onCategoryHover: (categoryId: string | null) => void;
    onClose: () => void;
}

export default function MegaMenu({
    isOpen,
    activeCategory,
    onCategoryHover,
    onClose
}: MegaMenuProps) {
    const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

    const activeCategoryData = megaMenuCategories.find(cat => cat.id === activeCategory);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen, onClose]);

    if (!isOpen || !activeCategoryData) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl"
                onMouseLeave={() => onCategoryHover(null)}
            >
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-12 gap-8">
                        {/* Categories Column */}
                        <div className="col-span-4">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <activeCategoryData.icon className="h-5 w-5 text-feature-products" />
                                {activeCategoryData.name}
                            </h3>

                            <div className="space-y-2">
                                {activeCategoryData.subcategories.map((subcategory) => (
                                    <Link
                                        key={subcategory.id}
                                        href={`/categories/${activeCategoryData.slug}/${subcategory.slug}`}
                                        className="group flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-gray-700 group-hover:text-feature-products font-medium">
                                                {subcategory.name}
                                            </span>
                                            {subcategory.isHot && (
                                                <Badge className="bg-red-500 text-white text-xs px-2 py-1">
                                                    <Flame className="h-3 w-3 mr-1" />
                                                    رائج
                                                </Badge>
                                            )}
                                            {subcategory.isNew && (
                                                <Badge className="bg-green-500 text-white text-xs px-2 py-1">
                                                    <Sparkles className="h-3 w-3 mr-1" />
                                                    جديد
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <span>({subcategory.productCount})</span>
                                            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Featured Products Column */}
                        <div className="col-span-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-900">منتجات مميزة</h3>
                                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    الأكثر مبيعاً
                                </Badge>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                {activeCategoryData.featuredProducts.map((product) => (
                                    <Card
                                        key={product.id}
                                        className="group cursor-pointer border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                                        onMouseEnter={() => setHoveredProduct(product.id)}
                                        onMouseLeave={() => setHoveredProduct(null)}
                                    >
                                        <div className="relative aspect-square overflow-hidden">
                                            {product.isLimitedTime && (
                                                <Badge className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    عرض محدود
                                                </Badge>
                                            )}

                                            <Image
                                                src={product.imageUrl}
                                                alt={product.name}
                                                fill
                                                className={`object-cover transition-transform duration-500 ${hoveredProduct === product.id ? 'scale-110' : 'scale-100'
                                                    }`}
                                            />

                                            <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'
                                                }`}>
                                                <div className="absolute bottom-3 left-3 right-3">
                                                    <Button
                                                        size="sm"
                                                        className="w-full bg-white text-gray-900 hover:bg-gray-100"
                                                    >
                                                        <ShoppingBag className="h-4 w-4 mr-2" />
                                                        إضافة للسلة
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        <CardContent className="p-3">
                                            <h4 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
                                                {product.name}
                                            </h4>

                                            <div className="flex items-center gap-1 mb-2">
                                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                <span className="text-xs text-gray-600">{product.rating}</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-feature-products">
                                                    {product.price} ر.س
                                                </span>
                                                {product.originalPrice && (
                                                    <span className="text-xs text-gray-500 line-through">
                                                        {product.originalPrice} ر.س
                                                    </span>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
} 