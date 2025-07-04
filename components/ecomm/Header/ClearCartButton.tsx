'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useOptimisticCart } from '@/lib/hooks/useOptimisticCart';
import { toast } from 'sonner';

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
            <Trash2 className="h-4 w-4 mr-1 icon-enhanced" />
            Clear Cart
        </Button>
    );
} 