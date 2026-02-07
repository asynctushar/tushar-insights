'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
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
        <div className="container mx-auto px-4 min-h-[calc(100vh-65px)] flex items-center justify-center">
            <Card className="max-w-md w-full shadow-lg">
                <CardContent className="p-8 sm:p-12 text-center space-y-6">
                    <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                        <AlertCircle className="h-8 w-8 text-destructive" />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold">
                            Something Went Wrong
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            An unexpected error occurred. Please try again.
                        </p>
                    </div>

                    {process.env.NODE_ENV === 'development' && error.message && (
                        <div className="bg-muted/50 rounded-md p-3 text-left">
                            <p className="text-xs font-mono text-destructive break-all">
                                {error.message}
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col gap-3 pt-2">
                        <Button onClick={reset} className="gap-2">
                            <RefreshCcw className="h-4 w-4" />
                            Try Again
                        </Button>
                        <Button variant="outline" asChild className="gap-2">
                            <Link href="/">
                                <Home className="h-4 w-4" />
                                Go Home
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}