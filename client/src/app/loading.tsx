import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-64px)]">
            {/* Hero Skeleton */}
            <Card className="mb-8 shadow-lg">
                <CardContent className="p-8 sm:p-12">
                    <Skeleton className="h-10 w-48 mb-3" />
                    <Skeleton className="h-6 w-96 max-w-full" />
                </CardContent>
            </Card>

            {/* Content Skeleton */}
            <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="shadow-md">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Skeleton className="w-full sm:w-1/3 h-48 rounded-md" />
                                <div className="flex-1 space-y-3">
                                    <Skeleton className="h-8 w-3/4" />
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}