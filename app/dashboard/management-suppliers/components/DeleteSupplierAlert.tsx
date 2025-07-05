'use client';
import { useState } from 'react';

import Swal from 'sweetalert2';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from '../../../../components/ui/button';
import { Icon } from '@/components/icons/Icon';
import { deleteSupplier } from '../actions/deleteSupplier';

interface DeleteSupplierAlertProps {
  supplierId: string;
}

export default function DeleteSupplierAlert({ supplierId }: DeleteSupplierAlertProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDelete = async () => {
    setIsProcessing(true);
    try {
      const result = await deleteSupplier(supplierId);

      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'تم الحذف بنجاح',
          text: 'تم إزالة بيانات العنصر بشكل نهائي من النظام',
          confirmButtonText: 'تم',
          confirmButtonAriaLabel: 'تأكيد استلام رسالة النجاح',
        });
        // window.location.reload();
        return;
      }

      Swal.fire({
        icon: 'error',
        title: 'تعذر الحذف',
        text: result.message || 'حدث خطأ أثناء محاولة الحذف. يرجى المحاولة لاحقًا',
        confirmButtonText: 'حسنا',
        confirmButtonAriaLabel: 'تأكيد استلام رسالة الخطأ',
      });
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'خطأ غير متوقع',
        text: 'حدث عطل تقني غير متوقع. يرجى إبلاغ الدعم الفني',
        confirmButtonText: 'تم الإبلاغ',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          size={"icon"}
          className='size-10 flex  flex-row-reverse hover:bg-destructive/90 hover:text-destructive-foreground'
          aria-label='فتح نافذة حذف العنصر'
        >

          <Icon name="Trash" className='h-4 w-4 text-destructive' aria-hidden />
        </Button>
      </DialogTrigger>

      <DialogContent
        className='border-destructive/30 bg-background/95 backdrop-blur-sm'
        role='dialog'
        aria-labelledby='deleteConfirmationHeading'
        dir='rtl'
      >
        {/* Accessibility-required title */}

        <DialogTitle id='deleteConfirmationHeading'>تأكيد الحذف النهائي للمورد</DialogTitle>

        <DialogHeader>
          <DialogTitle className='text-right text-xl font-bold text-destructive'>
            ⚠️ تأكيد الحذف النهائي
          </DialogTitle>

          <DialogDescription className='text-right text-sm text-muted-foreground/90'>
            سيتم حذف جميع بيانات العنصر بما في ذلك:
          </DialogDescription>

          <div className='text-right text-muted-foreground/90'>
            <ul className='list-disc space-y-2 pr-4'>
              <li>المنتجات المرتبطة</li>
              <li>سجل التعاملات</li>
              <li>بيانات الاتصال</li>
            </ul>
          </div>
        </DialogHeader>

        <DialogFooter className='flex flex-row-reverse gap-3'>
          <DialogClose asChild>
            <Button
              variant='secondary'
              className='bg-muted/80 hover:bg-accent'
              aria-label='إلغاء عملية الحذف'
            >
              إلغاء الحذف
            </Button>
          </DialogClose>

          <Button
            onClick={handleDelete}
            disabled={isProcessing}
            className='bg-destructive/90 text-destructive-foreground hover:bg-destructive'
            aria-describedby='deleteConfirmationHeading'
          >
            {isProcessing ? (
              <>
                <Icon name="Loader2" className='ml-2 h-4 w-4 animate-spin' aria-hidden />
                <span>جارِ تنفيذ العملية...</span>
              </>
            ) : (
              'تأكيد الحذف الدائم'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
