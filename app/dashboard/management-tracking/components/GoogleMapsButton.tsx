'use client';

import { Button } from '@/components/ui/button';
import { Navigation } from 'lucide-react';

interface GoogleMapsButtonProps {
    latitude: number;
    longitude: number;
}

export default function GoogleMapsButton({ latitude, longitude }: GoogleMapsButtonProps) {
    const handleOpenMaps = () => {
        if (latitude !== 0 && longitude !== 0) {
            window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
        }
    };

    return (
        <Button
            className="btn-view-outline"
            onClick={handleOpenMaps}
            disabled={latitude === 0 && longitude === 0}
        >
            <Navigation className="h-4 w-4 mr-2" />
            فتح في خرائط جوجل
        </Button>
    );
} 