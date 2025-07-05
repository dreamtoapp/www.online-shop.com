'use client';
import { iconVariants } from '@/lib/utils';
import { Icon } from '@/components/icons/Icon';
import { Button } from '@/components/ui/button';

interface CartItemProps {
  product: {
    id: string;
    name: string;
    price: number;
  };
  quantity: number;
  onRemove: () => void;
}

export default function MiniCartItem({ product, quantity, onRemove }: CartItemProps) {
  return (
    <div className='flex items-center justify-between border-b pb-2'>
      {/* Product Details */}
      <div>
        <p className='font-semibold'>{product.name}</p>
        <p className='text-sm text-gray-500'>
          {quantity} × ${product.price.toFixed(2)}
        </p>
      </div>

      {/* Price and Remove Button */}
      <div className='flex items-center gap-2'>
        <p className='font-semibold'>${(product.price * quantity).toFixed(2)}</p>
        <Button
          variant='outline'
          size='icon'
          onClick={onRemove}
          className='border-red-500 text-red-500 transition hover:bg-red-100'
          aria-label={`حذف المنتج ${product.name}`}
        >
          <Icon name="Trash2" size="xs" className={iconVariants({ size: 'xs' })} />
        </Button>
      </div>
    </div>
  );
}
