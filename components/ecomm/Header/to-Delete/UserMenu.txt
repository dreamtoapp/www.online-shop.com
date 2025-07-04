"use client"

import {
  useState,
} from 'react';

import {

  Menu,
  User,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useMediaQuery } from '@/hooks/use-media-query';


import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';

import { Button } from '@/components/ui/button';





import {
  Sheet,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';

import { UserRole } from '@/constant/enums';





// Define the shape of a single alert
/* type Alert = {
  id: string;
  type: 'warning' | 'destructive';
  title: string;
  description: string;
  href: string;
}; */

interface UserMenuProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: UserRole;
  } | null;
  children?: React.ReactNode;
}



export default function UserMenu({ user, children }: UserMenuProps) {
  const { data: session, status } = useSession();



  const isMobile = useMediaQuery('(max-width: 640px)');
  const [isOpen, setIsOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  if (status === 'loading') {
    return (
      <Skeleton className="h-9 w-9 rounded-full" />
    );
  }

  if (!session || !user) {
    if (!showWelcome) return null;
    return (
      <div className="flex items-center gap-2 bg-feature-users-soft text-feature-users px-2 py-1 rounded-md relative">
        <User className="h-5 w-5 icon-enhanced" />
        <span className="font-medium text-sm">مرحباً بك!</span>
        <Button asChild className="btn-add h-7 px-3 py-1 text-sm rounded">
          <Link href="/auth/register">تسجيل حساب جديد</Link>
        </Button>
        <button
          type="button"
          className="absolute -top-2 -left-2 p-1 rounded-full hover:bg-feature-users/20 transition"
          aria-label="إغلاق"
          onClick={() => setShowWelcome(false)}
        >
          <X className="h-4 w-4 text-feature-users" />
        </button>
      </div>
    );
  }

  const { name, image } = user;



  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <div className='flex items-center gap-3'>
      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetTrigger asChild>
          {isMobile ? (
            <Button
              variant="ghost"
              size="icon"
              className="p-2"
            >
              <Menu className="h-7 w-7" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              className="p-0 focus:outline-none bg-transparent hover:bg-transparent active:bg-transparent"
            >
              <Avatar className="h-10 w-10 border-2 border-border shadow-md bg-transparent">
                <AvatarImage
                  src={image || "/default-avatar.png"}
                  alt={name || "User"}
                  className="object-cover"
                />
                <AvatarFallback className="bg-muted text-muted-foreground font-bold text-xl">
                  {name?.[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
            </Button>
          )}
        </SheetTrigger>
        {isOpen && children}
      </Sheet>
    </div>
  )
}
