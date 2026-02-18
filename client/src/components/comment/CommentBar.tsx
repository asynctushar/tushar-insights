"use client";

import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { User } from '@/types/user.type';
import { Blog } from '@/types/blog.type';
import { ChangeEvent, useState } from 'react';
import { LogOut, Send, Loader2 } from 'lucide-react';
import UserCard from '../user/UserCard';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addComment } from '@/redux/slices/blog.slice';
import { logout, setIsLoading } from '@/redux/slices/auth.slice';

type CommentBarProps = {
    user: User;
    blogId: string;
};

const CommentBar = ({ user, blogId }: CommentBarProps) => {
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { isLoading } = useAppSelector(state => state.auth);


    const blog = useAppSelector((state) => state.blog.blogs[blogId]);
    const dispatch = useAppDispatch();

    const handleSubmit = async () => {
        if (!comment.trim()) return;

        try {
            setIsSubmitting(true);
            const res = await fetch(`/api/blogs/${blog.slug}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'normal',
                    desc: comment.trim(),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to post comment');
            }

            dispatch(addComment({ blogId, comment: data.data.comment }));
            toast.success("Your comment has been posted successfully.");
            setComment('');
        } catch (error: any) {
            console.error('Comment submission error:', error);
            toast.error(error.message || "Failed to post comment. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = async () => {

        try {
            dispatch(setIsLoading(true));
            const res = await fetch('/api/auth/logout');
            if (!res.ok) {
                throw new Error('Failed to logout');
            }

            toast.success("You have been logged out successfully.");
            dispatch(logout());
        } catch (error: any) {
            console.error('Logout error:', error);
            toast.error(error.message || "Failed to logout. Please try again.",);
        } finally {
            dispatch(setIsLoading(false));
        }
    };

    const displayName = user.fullName ?? user.username;

    return (
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="px-4 sm:px-6 py-4 space-y-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-border">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Comment as</span>
                        <span className="text-xs font-semibold text-foreground">{displayName}</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        disabled={isLoading}
                        className="gap-2 self-end sm:self-auto h-8"
                    >
                        {isLoading ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                            <LogOut className="h-3.5 w-3.5" />
                        )}
                        <span className="text-xs">
                            {isLoading ? 'Logging out...' : 'Logout'}
                        </span>
                    </Button>
                </div>

                {/* Comment Input */}
                <div className="flex flex-col sm:flex-row items-start gap-3">
                    <div className="hidden sm:block">
                        <UserCard user={user} name={false} />
                    </div>

                    <div className="flex-1 w-full space-y-3">
                        <Textarea
                            value={comment}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
                            placeholder="Share your thoughts about this blog..."
                            className="min-h-20 resize-none"
                            disabled={isSubmitting}
                        />

                        <div className="flex justify-end">
                            <Button
                                onClick={handleSubmit}
                                disabled={!comment.trim() || isSubmitting}
                                className="gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Posting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4" />
                                        Submit
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentBar;