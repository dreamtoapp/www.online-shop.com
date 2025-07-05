'use client';

import { useState } from 'react'; // Keep only one import
import { useRouter } from 'next/navigation';

import { toast } from 'sonner';
import { addItem } from '@/app/(e-comm)/cart/actions/cartServerActions';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/icons/Icon';

interface AddToCartButtonProps {
  productId: string;
  name: string;
  inStock?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export default function AddToCartButton({
  productId,
  name,
  inStock = true,
  variant = 'default',
  size = 'default',
  className,
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const router = useRouter();

  const handleAddToCart = async () => {
    if (!inStock) return;

    try {
      setIsLoading(true);

      // Call the server action to add to cart
      await addItem(productId, 1);

      // Notify all listeners to re-fetch cart
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('cart-changed'));
        localStorage.setItem('cart-updated', Date.now().toString());
      }

      // Refresh server components (badge count, cart popover, etc.)
      router.refresh();

      // Show success state
      setIsAdded(true);

      // Show toast
      toast.success('تمت الإضافة إلى السلة', {
        description: name,
      });

      // Reset success state after a delay
      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('حدث خطأ أثناء الإضافة إلى السلة');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleAddToCart}
      disabled={isLoading || !inStock || isAdded}
      className={cn(
        isAdded && 'btn-add',
        !inStock && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      {isAdded ? (
        <>
          <Icon
            name="Check"
            size={size === 'sm' ? 'xs' : size === 'lg' ? 'md' : 'sm'}
          />
          {size !== 'icon' && <span className='mr-2'>تمت الإضافة</span>}
        </>
      ) : (
        <>
          <Icon
            name="ShoppingCart"
            size={size === 'sm' ? 'xs' : size === 'lg' ? 'md' : 'sm'}
          />
          {size !== 'icon' && (
            <span className='mr-2'>{!inStock ? 'غير متوفر' : 'إضافة إلى السلة'}</span>
          )}
        </>
      )}
    </Button>
  );
}
