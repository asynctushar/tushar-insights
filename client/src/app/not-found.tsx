import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[calc(100vh-64px)] flex items-center justify-center">
            <Card className="max-w-2xl w-full shadow-lg">
                <CardContent className="p-8 sm:p-12 text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="text-[120px] sm:text-[150px] font-bold text-primary/10 select-none">
                                404
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Search className="h-16 w-16 text-muted-foreground" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl sm:text-4xl font-bold">
                            Page Not Found
                        </h1>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                        <Button variant="default" asChild className="gap-2">
                            <Link href="/">
                                <Home className="h-4 w-4" />
                                Go Home
                            </Link>
                        </Button>
                        <Button variant="outline" asChild className="gap-2">
                            <Link href="/blogs">
                                <Search className="h-4 w-4" />
                                Browse Blogs
                            </Link>
                        </Button>
                    </div>

                    <div className="pt-6 border-t">
                        <Button variant="ghost" size="sm" asChild className="gap-2">
                            <Link href="javascript:history.back()">
                                <ArrowLeft className="h-4 w-4" />
                                Go Back
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}