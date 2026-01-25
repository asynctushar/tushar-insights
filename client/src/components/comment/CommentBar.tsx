"use client";

import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { User } from '@/types/user.type';
import { Blog } from '@/types/blog.type';
import { ChangeEvent, useState } from 'react';
import { LogOut, Send } from 'lucide-react';
import UserCard from '../user/UserCard';

type CommentBarProps = {
    user: User;
    blog: Blog;
};

const CommentBar = ({ user, blog }: CommentBarProps) => {
    const [comment, setComment] = useState('');

    const handleSubmit = () => {
        // TODO: Implement comment submission
        setComment('');
    };

    const handleLogout = () => {

    };

    const displayName = user.fullName ?? user.username;

    return (
        <Card className="shadow-md">
            <CardContent className="space-y-4">
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
                        className="gap-2"
                    >
                        <LogOut className="h-4 w-4" />
                        <span className="hidden sm:inline">Logout</span>
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
                        />

                        <div className="flex justify-end">
                            <Button
                                onClick={handleSubmit}
                                disabled={!comment.trim()}
                                className="gap-2"
                            >
                                <Send className="h-4 w-4" />
                                Submit
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CommentBar;