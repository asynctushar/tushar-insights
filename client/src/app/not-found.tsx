import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="container mx-auto px-4 min-h-[calc(100vh-200px)] flex items-center justify-center">
            <Card className="max-w-md w-full shadow-lg">
                <CardContent className="p-8 sm:p-12 text-center space-y-6">
                    <div className="text-8xl font-bold text-destructive/20 select-none">
                        404
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold">
                            Page Not Found
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            The page you're looking for doesn't exist or has been moved.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 pt-2">
                        <Button asChild className="gap-2">
                            <Link href="/">
                                <Home className="h-4 w-4" />
                                Go Home
                            </Link>
                        </Button>
                        <Button variant="outline" asChild className="gap-2">
                            <Link href="/blogs">
                                <ArrowLeft className="h-4 w-4" />
                                Browse Blogs
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}