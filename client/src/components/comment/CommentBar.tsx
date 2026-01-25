"use client";

import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { User } from '@/types/user.type';
import { Blog } from '@/types/blog.type';
import { ChangeEvent, useState } from 'react';
import { LogOut, Send, Loader2 } from 'lucide-react';
import UserCard from '../user/UserCard';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";

type CommentBarProps = {
    user: User;
    blog: Blog;
};

const CommentBar = ({ user, blog }: CommentBarProps) => {
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        if (!comment.trim()) return;

        setIsSubmitting(true);

        try {
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

            toast.success("Your comment has been posted successfully.");

            setComment('');
            router.refresh();
        } catch (error: any) {
            console.error('Comment submission error:', error);
            toast.error(error.message || "Failed to post comment. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);

        try {
            const res = await fetch('/api/auth/logout');

            if (!res.ok) {
                throw new Error('Failed to logout');
            }

            toast.success("You have been logged out successfully.");

            router.refresh();
        } catch (error: any) {
            console.error('Logout error:', error);
            toast.error(error.message || "Failed to logout. Please try again.",);
            setIsLoggingOut(false);
        }
    };

    const displayName = user.fullName ?? user.username;

    return (
        <Card className="shadow-md">
            <CardContent className="p-4 sm:p-6 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Comment as</span>
                        <span className="text-sm font-semibold">{displayName}</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="gap-2"
                    >
                        {isLoggingOut ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <LogOut className="h-4 w-4" />
                        )}
                        <span className="hidden sm:inline">
                            {isLoggingOut ? 'Logging out...' : 'Logout'}
                        </span>
                    </Button>
                </div>

                {/* Comment Input */}
                <div className="flex items-start gap-3">
                    <UserCard user={user} name={false} />

                    <div className="flex-1 space-y-3">
                        <Textarea
                            value={comment}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
                            placeholder="Share your thoughts about this blog..."
                            className="min-h-25 resize-none"
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
            </CardContent>
        </Card>
    );
};

export default CommentBar;