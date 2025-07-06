import { Button } from "@/components/ui/button";
import { ShoppingCart, CheckCircle, AlertTriangle } from "lucide-react";

interface CartItem {
    id: string;
    quantity: number;
    product: {
        id: string;
        name: string;
        price: number;
    } | null;
}

interface CartData {
    items: CartItem[];
}

interface Address {
    id: string;
    latitude?: string | null;
    longitude?: string | null;
    isDefault?: boolean;
}

interface PlaceOrderButtonProps {
    cart: CartData;
    defaultAddress?: Address;
}

export default function PlaceOrderButton({ cart, defaultAddress }: PlaceOrderButtonProps) {
    const items = cart?.items || [];
    const hasItems = items.length > 0;
    const totalItems = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const subtotal = items.reduce((sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1), 0);

    // Check if address has valid location
    const hasValidLocation = defaultAddress?.latitude && defaultAddress?.longitude;

    if (!hasItems) {
        return (
            <div className="text-center py-6">
                <AlertTriangle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <p className="text-muted-foreground mb-4">لا يمكن إتمام الطلب</p>
                <p className="text-sm text-orange-600">يجب إضافة منتجات للسلة أولاً</p>
            </div>
        );
    }

    if (!hasValidLocation) {
        return (
            <div className="space-y-4">
                {/* Order Summary */}
                <div className="p-4 bg-feature-commerce-soft rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <ShoppingCart className="h-4 w-4 text-feature-commerce" />
                            <span className="font-medium">يتطلب تحديد موقع</span>
                        </div>
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {totalItems} منتج • إجمالي {subtotal.toFixed(2)} ريال
                    </div>
                </div>

                {/* Location Required Button */}
                <Button
                    className="btn-cancel-outline w-full h-12 text-lg border-red-200 text-red-700 hover:bg-red-50"
                    disabled
                >
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    يجب تحديد موقع التوصيل
                </Button>

                {/* Location Required Note */}
                <div className="text-center">
                    <p className="text-xs text-red-600">
                        🚫 يرجى تحديد موقع دقيق للعنوان في قسم &quot;عنوان التوصيل&quot; أعلاه
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Order Summary */}
            <div className="p-4 bg-feature-commerce-soft rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <ShoppingCart className="h-4 w-4 text-feature-commerce" />
                        <span className="font-medium">جاهز للطلب</span>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-sm text-muted-foreground">
                    {totalItems} منتج • إجمالي {subtotal.toFixed(2)} ريال
                </div>
            </div>

            {/* Place Order Button */}
            <Button
                className="btn-save w-full h-12 text-lg"
                disabled
            >
                <ShoppingCart className="h-5 w-5 mr-2" />
                تنفيذ الطلب (قريبًا)
            </Button>

            {/* Temporary Note */}
            <div className="text-center">
                <p className="text-xs text-muted-foreground">
                    🚧 جاري تطوير نظام الطلبات - سيكون متاحاً قريباً
                </p>
            </div>
        </div>
    );
} 