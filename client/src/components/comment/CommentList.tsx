"use client";

import { User } from '@/types/user.type';
import { Card, CardContent } from '../ui/card';
import CommentItem from './CommentItem';
import { useAppSelector } from '@/redux/hooks';


interface CommentListProps {
    user?: User | null;
    documentId: string;
}

const CommentList = ({ user, documentId }: CommentListProps) => {
    const blog = useAppSelector((state) => state.blog.blogs[documentId]);

    return (
        <Card className="shadow-sm py-4 sm:py-6">
            <CardContent className="px-4 sm:px-6">
                <h3 className="text-xl font-semibold mb-4">
                    Comments ({blog?.comments.length})
                </h3>
                {blog && blog.comments && blog.comments.length > 0 ? (
                    <div className="space-y-4">
                        {blog && blog.comments.map((comment) => (
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
                        <p className="text-muted-foreground">
                            No comments yet. Be the first to share your thoughts!
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default CommentList;