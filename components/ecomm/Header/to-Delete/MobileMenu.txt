'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';
import { Session } from 'next-auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

import dynamic from 'next/dynamic';
import { UserRole } from '@/constant/enums';

// Define general links for the mobile menu
const generalMobileLinks = [
    { name: 'من نحن', href: '/about' },
    { name: 'تواصل معنا', href: '/contact' },
    { name: 'سياسة الخصوصية', href: '/privacy-policy' },
    { name: 'الشروط والأحكام', href: '/terms-conditions' },
];

const UserMenu = dynamic(() => import('./UserMenu'), { ssr: false });

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    session: Session | null;
}

export default function MobileMenu({ isOpen, onClose, session }: MobileMenuProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/50"
                        onClick={onClose}
                    />

                    {/* Menu Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed top-0 right-0 z-50 h-full w-full max-w-sm"
                    >
                        <div className="flex h-full w-full flex-col bg-background border-l shadow-2xl">
                            {/* Header */}
                            <div className='flex items-center justify-between border-b p-4'>
                                <Link href='/' className='flex items-center gap-3'>
                                    <Image
                                        src='/assets/logo.webp'
                                        alt='شعار الشركة'
                                        width={40}
                                        height={40}
                                        className='h-10 w-10 rounded-lg'
                                    />
                                    <span className='text-xl font-bold text-primary'>
                                        القائمة الرئيسية
                                    </span>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onClose}
                                    className="h-8 w-8 p-0"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Enhanced UserMenu for Mobile */}
                            <div className="border-b p-0">
                                <UserMenu
                                    user={
                                        session?.user?.id
                                            ? {
                                                id: session.user.id,
                                                name: session.user.name,
                                                email: session.user.email,
                                                image: session.user.image,
                                                role: session.user.role as UserRole,
                                            }
                                            : null
                                    }
                                />
                            </div>

                            {/* Content */}
                            <div className='flex-1 overflow-y-auto p-4'>
                                <div className='space-y-6'>
                                    {/* General Links */}
                                    <div className='space-y-4'>
                                        <h3 className='text-sm font-semibold text-muted-foreground uppercase'>
                                            روابط مهمة
                                        </h3>
                                        <nav className='space-y-2'>
                                            {generalMobileLinks.map((link) => (
                                                <Link
                                                    key={link.name}
                                                    href={link.href}
                                                    onClick={onClose}
                                                    className='flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors'
                                                >
                                                    <span>{link.name}</span>
                                                </Link>
                                            ))}
                                        </nav>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className='border-t p-4'>
                                <p className='text-xs text-muted-foreground text-center'>
                                    © 2024 جميع الحقوق محفوظة
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
} 