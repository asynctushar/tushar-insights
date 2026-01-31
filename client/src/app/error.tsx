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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[calc(100vh-64px)] flex items-center justify-center">
            <Card className="max-w-2xl w-full shadow-lg">
                <CardContent className="p-8 sm:p-12 text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
                            <AlertCircle className="h-10 w-10 text-destructive" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl sm:text-4xl font-bold">
                            Something went wrong!
                        </h1>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            We encountered an unexpected error. Don't worry, our team has been notified and we're working on it.
                        </p>
                    </div>

                    {process.env.NODE_ENV === 'development' && (
                        <Card className="bg-muted/50">
                            <CardContent className="p-4 text-left">
                                <p className="text-xs font-mono text-destructive break-all">
                                    {error.message}
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
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