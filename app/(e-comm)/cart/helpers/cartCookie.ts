import { cookies } from 'next/headers';

// Get the guest cart ID from the cookie
export async function getCartIdFromCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('localCartId')?.value;
}

// Set the guest cart ID cookie
export async function setCartIdCookie(cartId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('localCartId', cartId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

// Clear the guest cart ID cookie
export async function clearCartIdCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('localCartId', '', { maxAge: -1 });
} 