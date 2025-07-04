import React from 'react';

type Alert = {
    id: string;
    type: 'warning' | 'destructive';
    title: string;
    description: string;
    href: string;
};

const UserMenuNotifications: React.FC<{ alerts: Alert[] }> = ({ alerts }) => {
    return (
        <div className="mr-2">
            <span className="text-xs text-muted-foreground">Notifications ({alerts.length})</span>
        </div>
    );
};

export default UserMenuNotifications; 