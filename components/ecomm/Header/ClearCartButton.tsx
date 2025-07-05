'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useOptimisticCart } from '@/lib/hooks/useOptimisticCart';
import { toast } from 'sonner';
import { Icon } from '@/components/icons/Icon';

export default function ClearCartButton() {
    const router = useRouter();
    const { clear } = useOptimisticCart();

    const handleClick = async () => {
        try {
            await clear();
            router.refresh();
            toast.success('تم تفريغ السلة بنجاح');
        } catch (err) {
            console.error('Failed to clear cart', err);
            toast.error('حدث خطأ أثناء تفريغ السلة');
        }
    };

    return (
        <Button
            variant="destructive"
            size="sm"
            className="btn-delete"
            onClick={handleClick}
        >
            <Icon name="Trash2" className="h-4 w-4 mr-1 icon-enhanced" />
            Clear Cart
        </Button>
    );
} 