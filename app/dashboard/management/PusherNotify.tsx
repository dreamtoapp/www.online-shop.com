'use client';

import { useEffect } from 'react';
import Pusher from 'pusher-js';

export default function PusherNotify() {
    useEffect(() => {
        // Initialize Pusher notifications
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || '', {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'mt1',
        });

        // Subscribe to notification channels
        const channel = pusher.subscribe('orders');

        channel.bind('new-order', (data: any) => {
            // Handle new order notifications
            console.log('New order received:', data);
        });

        channel.bind('order-updated', (data: any) => {
            // Handle order update notifications
            console.log('Order updated:', data);
        });

        return () => {
            pusher.unsubscribe('orders');
            pusher.disconnect();
        };
    }, []);

    return null; // This component doesn't render anything
} 