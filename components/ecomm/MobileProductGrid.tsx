'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Icon } from '@/components/icons/Icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    rating: number;
    reviewCount: number;
    imageUrl: string;
    category: string;
    href: string;
    isNew?: boolean;
    isHot?: boolean;
}

interface MobileProductGridProps {
    products: Product[];
    columns?: 2 | 3;
    className?: string;
}

export default function MobileProductGrid({
    products,
    columns = 2,
    className
}: MobileProductGridProps) {
    const formatPrice = (price: number) => {
        return `${price.toFixed(2)} ر.س`;
    };

    const ProductCard = ({ product, index }: { product: Product; index: number }) => {
        const [isWishlisted, setIsWishlisted] = useState(false);
        const [imageError, setImageError] = useState(false);

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
            >
                <Link href={product.href} className="block">
                    <Card className="overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-background">
                        <div className="relative aspect-[3/4] overflow-hidden">
                            <Image
                                src={imageError ? '/fallback/product-fallback.avif' : product.imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                onError={() => setImageError(true)}
                                sizes="(max-width: 768px) 50vw, 33vw"
                            />

                            {/* Badges */}
                            <div className="absolute top-2 left-2 flex flex-col gap-1">
                                {product.isNew && (
                                    <Badge className="bg-green-500 text-green-50 text-xs px-2 py-1 rounded-full">
                                        جديد
                                    </Badge>
                                )}
                                {product.isHot && (
                                    <Badge className="bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                        <Icon name="Flame" size="xs" />
                                        HOT
                                    </Badge>
                                )}
                                {product.discount && product.discount > 0 && (
                                    <Badge className="bg-orange-500 text-orange-50 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                        <Icon name="Percent" size="xs" />
                                        -{product.discount}%
                                    </Badge>
                                )}
                            </div>

                            {/* Wishlist Button */}
                            <div className="absolute top-2 right-2">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setIsWishlisted(!isWishlisted);
                                    }}
                                    className={cn(
                                        "w-8 h-8 rounded-full p-0 shadow-lg transition-all duration-200",
                                        isWishlisted
                                            ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            : "bg-background/90 text-foreground hover:bg-background"
                                    )}
                                >
                                    <Icon name="Heart" size="sm" className={cn(isWishlisted && "fill-current")} />
                                </Button>
                            </div>
                        </div>

                        <CardContent className="p-3">
                            <p className="text-xs text-muted-foreground mb-1 truncate">
                                {product.category}
                            </p>

                            <h3 className="font-medium text-sm text-foreground mb-2 line-clamp-2 leading-tight">
                                {product.name}
                            </h3>

                            <div className="flex items-center gap-1 mb-2">
                                <div className="flex items-center">
                                    <Icon name="Star" size="xs" className="fill-yellow-400 text-yellow-400" />
                                    <span className="text-xs text-muted-foreground ml-1">
                                        {product.rating.toFixed(1)}
                                    </span>
                                </div>
                                <span className="text-xs text-muted-foreground/80">
                                    ({product.reviewCount.toLocaleString()})
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-feature-products text-sm">
                                        {formatPrice(product.price)}
                                    </span>
                                    {product.originalPrice && product.originalPrice > product.price && (
                                        <span className="text-xs text-muted-foreground line-through">
                                            {formatPrice(product.originalPrice)}
                                        </span>
                                    )}
                                </div>

                                <Button
                                    size="sm"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        // Add to cart logic
                                    }}
                                    className="w-8 h-8 rounded-full p-0 bg-feature-products hover:bg-feature-products/90 text-primary-foreground shadow-sm"
                                >
                                    <Icon name="ShoppingBag" size="sm" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </motion.div>
        );
    };

    return (
        <div className={cn("w-full", className)}>
            <div className={cn(
                "grid gap-3 sm:gap-4",
                columns === 2 ? "grid-cols-2" : "grid-cols-3"
            )}>
                {products.map((product, index) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        index={index}
                    />
                ))}
            </div>

            {products.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-muted-foreground mb-4">
                        <Icon name="ShoppingBag" size="lg" className="mx-auto mb-4" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">
                        لا توجد منتجات
                    </h3>
                    <p className="text-muted-foreground">
                        لم يتم العثور على أي منتجات تطابق البحث
                    </p>
                </div>
            )}
        </div>
    );
} 