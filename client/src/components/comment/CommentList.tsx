"use client";

import { User } from '@/types/user.type';
import { Card, CardContent } from '../ui/card';
import CommentItem from './CommentItem';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useEffect } from 'react';
import { Blog } from '@/types/blog.type';
import { updateBlog } from '@/redux/slices/blog.slice';

interface CommentListProps {
    user?: User | null;
    blog: Blog;
}

const CommentList = ({ user, blog: initialBlog }: CommentListProps) => {
    const blog = useAppSelector((state) => state.blog.blogs[initialBlog.documentId]);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(updateBlog({ comments: initialBlog.comments, documentId: initialBlog.documentId }));
    }, [initialBlog]);

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