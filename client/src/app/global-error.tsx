'use client';

import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { useEffect } from 'react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string; };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <html>
            <body>
                <div className="min-h-screen flex items-center justify-center bg-background p-4">
                    <div className="max-w-md w-full text-center space-y-6">
                        <div className="flex justify-center">
                            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
                                <AlertTriangle className="h-10 w-10 text-destructive" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold">
                                Critical Error
                            </h1>
                            <p className="text-muted-foreground">
                                Something went critically wrong. Please try refreshing the page.
                            </p>
                        </div>

                        <Button onClick={reset} className="gap-2">
                            <RefreshCcw className="h-4 w-4" />
                            Refresh Page
                        </Button>
                    </div>
                </div>
            </body>
        </html>
    );
}