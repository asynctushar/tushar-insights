"use client";

import { User } from '@/types/user.type';
import { Card, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import CommentItem from './CommentItem';
import { useAppSelector } from '@/redux/hooks';

interface CommentListProps {
    user?: User | null;
    documentId: string;
}

const CommentList = ({ user, documentId }: CommentListProps) => {
    const isLoading = useAppSelector((state) => state.blog.isLoading);
    const blog = useAppSelector((state) => state.blog.blogs[documentId]);

    if (isLoading) {
        return (
            <Card className="shadow-sm">
                <CardContent className="p-6 space-y-6">
                    {/* Header Skeleton */}
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-7 w-40" />
                    </div>

                    {/* Comment Skeletons */}
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="shadow-sm">
                            <CardContent className="p-4 space-y-3">
                                {/* User info */}
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-8 w-8 rounded-full" />
                                        <div className="space-y-1">
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-3 w-16" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-8 w-8" />
                                </div>

                                {/* Comment text */}
                                <Skeleton className="h-16 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="shadow-sm">
            <CardContent className="p-4 sm:p-6">
                <h3 className="text-xl font-semibold mb-6">
                    Comments ({blog.comments?.length || 0})
                </h3>
                {blog.comments && blog.comments.length > 0 ? (
                    <div className="space-y-3">
                        {blog.comments.map((comment) => (
                            <CommentItem
                                blogId={blog.documentId}
                                comment={comment}
                                key={comment.documentId}
                                user={user}
                                blogSlug={blog.slug}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-2xl mb-4">💬</div>
                        <p className="text-muted-foreground text-lg">
                            No comments yet.
                        </p>
                        <p className="text-muted-foreground text-sm mt-2">
                            Be the first to share your thoughts!
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default CommentList;