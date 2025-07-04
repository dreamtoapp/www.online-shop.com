"use client";
import Image from 'next/image';
import { ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CartWithItems } from '@/app/(e-comm)/cart/actions/cartServerActions';
import QuantityControls from '@/components/cart/QuantityControls';
import { useOptimisticCart } from '@/lib/hooks/useOptimisticCart';

interface CartPreviewProps {
    cart: CartWithItems | null;
    closePopover?: () => void;
    hideHeader?: boolean;
}

export default function CartPreview({ cart, closePopover, hideHeader = false }: CartPreviewProps) {
    const items = cart?.items || [];

    // Hook for optimistic updates
    const { quantityOf, remove } = useOptimisticCart();

    // Calculate total using optimistic quantities
    const total = items.reduce((sum, item) => {
        const qty = quantityOf(item.productId, item.quantity ?? 0);
        return sum + (item.product?.price || 0) * qty;
    }, 0);

    const isEmpty = items.length === 0;

    return (
        <Card className="shadow-lg border-l-4 border-feature-commerce card-hover-effect card-border-glow">
            {!hideHeader && (
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <ShoppingBag className="h-5 w-5 text-feature-commerce icon-enhanced" />
                        سلة التسوق
                    </CardTitle>
                </CardHeader>
            )}
            <CardContent>
                {isEmpty ? (
                    <div className="flex flex-col items-center justify-center text-center py-10">
                        <div className="mb-4 rounded-full bg-feature-commerce-soft p-4 text-feature-commerce">
                            <ShoppingBag className="h-10 w-10 icon-enhanced" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">سلتك فارغة!</h3>
                        <p className="mt-1 text-sm text-muted-foreground">لم تقم بإضافة أي منتجات بعد.</p>
                        <Button asChild className="mt-6 w-full btn-view-outline" onClick={closePopover}>
                            <Link href="/categories">
                                ابدأ التسوق
                                <ArrowLeft className="mr-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <ScrollArea className="max-h-72">
                            {items.map((item) => {
                                const qty = quantityOf(item.productId, item.quantity ?? 0);
                                const lineTotal = (item.product?.price || 0) * qty;
                                return (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-3 py-3 rounded-lg hover:bg-muted/50 transition-colors duration-200"
                                    >
                                        {/* Product Image */}
                                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border shadow-sm">
                                            <Image
                                                src={item.product?.imageUrl || '/fallback/product-fallback.avif'}
                                                alt={item.product?.name || ''}
                                                fill
                                                className="object-cover"
                                                sizes="64px"
                                            />
                                        </div>

                                        {/* Details: name + prices + qty controls */}
                                        <div className="flex-1 overflow-hidden pr-1">
                                            <h4 className="truncate text-sm font-medium text-foreground mb-1">
                                                {item.product?.name}
                                            </h4>
                                            <p className="text-xs flex items-center justify-between mb-1">
                                                <span className="text-muted-foreground">
                                                    {item.product?.price?.toLocaleString()} ر.س
                                                </span>
                                                <span className="font-bold text-foreground whitespace-nowrap">
                                                    {lineTotal.toLocaleString()} ر.س
                                                </span>
                                            </p>
                                            {/* Quantity controls + delete */}
                                            <div className="flex items-center gap-4 mt-2">
                                                <QuantityControls productId={item.productId} serverQty={item.quantity ?? 0} size="sm" />
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-muted-foreground hover:text-destructive btn-delete"
                                                    onClick={() => remove(item.productId)}
                                                    aria-label="حذف المنتج من السلة"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </ScrollArea>
                        <Separator className="my-2" />
                        {/* Sub-total */}
                        <div className="flex items-center justify-between px-1 text-lg font-bold">
                            <span>المجموع الفرعي</span>
                            <span className="text-feature-commerce">
                                {total.toLocaleString()} ر.س
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground">الشحن والضرائب تحسب عند إتمام الطلب.</p>
                        <div className="flex gap-3">
                            <Button asChild variant="outline" className="flex-1 btn-view-outline" onClick={closePopover}>
                                <Link href="/cart">عرض السلة</Link>
                            </Button>
                            <Button asChild className="flex-1 btn-save" onClick={closePopover}>
                                <Link href="/checkout">إتمام الطلب</Link>
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}