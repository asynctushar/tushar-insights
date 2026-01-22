"use client";

import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const NotificationButton = () => {
    // TODO: Replace with actual notification count from API/state
    const [notificationCount] = useState(2);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="default" size="icon" className="relative hover:bg-primary-foreground/20">
                    <Bell className="h-4 w-4" />
                    {notificationCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center">
                            <span className="absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
                            <span className="relative inline-flex items-center justify-center h-5 w-5 rounded-full text-[10px] font-semibold text-destructive-foreground">
                                {notificationCount > 9 ? '9+' : notificationCount}
                            </span>
                        </span>
                    )}
                    <span className="sr-only">Notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-semibold">Notifications</h3>
                    {notificationCount > 0 && (
                        <span className="text-xs text-muted-foreground">
                            {notificationCount} new
                        </span>
                    )}
                </div>

                {/* Placeholder for notifications */}
                <div className="p-4">
                    <p className="text-sm text-muted-foreground text-center py-8">
                        Notification items will be displayed here
                    </p>
                </div>

                {/* Footer */}
                <div className="border-t p-2">
                    <Button variant="ghost" className="w-full text-sm" size="sm">
                        View all notifications
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default NotificationButton;