'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
                    <Card className="max-w-md w-full shadow-lg">
                        <CardContent className="p-8 sm:p-12 text-center space-y-6">
                            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                                <AlertTriangle className="h-8 w-8 text-destructive" />
                            </div>

                            <div className="space-y-2">
                                <h1 className="text-2xl font-bold">
                                    Critical Error
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Something went critically wrong. Please try refreshing the page.
                                </p>
                            </div>

                            <Button onClick={reset} className="gap-2">
                                <RefreshCcw className="h-4 w-4" />
                                Refresh Page
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </body>
        </html>
    );
}