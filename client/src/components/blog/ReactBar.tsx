"use client";

import { useState } from 'react';
import { Button } from '../ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Blog } from '@/types/blog.type';
import { User } from '@/types/user.type';
import { toast } from 'sonner';
import { reactionTypes } from '@/lib/blog';

interface ReactBarProps {
    blog: Blog;
    user: User;
}

const ReactBar = ({ blog, user }: ReactBarProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Find user's current reaction
    const userReaction = blog.reactions?.find(
        (reaction) => reaction.user?.documentId === user.documentId
    );

    const handleReaction = async (type: string) => {
        setIsLoading(true);

        try {
            // Case 1: User clicked the same reaction - Remove it
            if (userReaction && userReaction.type === type) {
                const res = await fetch(`/api/blogs/${blog.slug}/reactions/${userReaction.documentId}`, {
                    method: 'DELETE',
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || 'Failed to remove reaction');
                }

                toast.success('Reaction removed');
            }
            // Case 2: User already reacted but chose different reaction - Update it
            else if (userReaction && userReaction.type !== type) {
                const res = await fetch(`/api/blogs/${blog.slug}/reactions/${userReaction.documentId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type }),
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || 'Failed to update reaction');
                }

                toast.success('Reaction updated');
            }
            // Case 3: New reaction - Create it
            else {
                const res = await fetch(`/api/blogs/${blog.slug}/reactions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type }),
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || 'Failed to add reaction');
                }

                toast.success('Reaction added');
            }

            setOpen(false);
        } catch (error: any) {
            toast.error(error.message || 'Failed to process reaction');
        } finally {
            setIsLoading(false);
        }
    };

    // Get current reaction data
    const currentReaction = userReaction
        ? reactionTypes.find(r => r.type === userReaction.type)
        : null;

    const CurrentReactionIcon = currentReaction?.icon;
    const currentReactionColor = currentReaction?.activeColor;

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                variant="outline"
                size="sm"
                className="gap-2"
            >
                {CurrentReactionIcon ? (
                    <>
                        <CurrentReactionIcon className={`h-4 w-4 ${currentReactionColor}`} />
                        <span className="capitalize">{userReaction?.type}</span>
                    </>
                ) : (
                    <>
                        React
                    </>
                )}
            </Button>

            <Dialog open={open} onOpenChange={isLoading ? undefined : setOpen}>
                <DialogContent
                    className="sm:max-w-md"
                    onEscapeKeyDown={(e) => isLoading && e.preventDefault()}
                    showCloseButton={false}
                >
                    <DialogHeader>
                        <DialogTitle
                            className='text-center'
                        >React</DialogTitle>
                        <DialogDescription
                            className='text-center'
                        >
                            Choose a reaction. Tap again to remove.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex items-center justify-around gap-2 py-6">
                        {reactionTypes.map(({ type, icon: Icon, label, hoverColor }) => {
                            const isActive = userReaction?.type === type;

                            return (
                                <Button
                                    key={type}
                                    variant={isActive ? "default" : "ghost"}
                                    size="lg"
                                    onClick={() => handleReaction(type)}
                                    disabled={isLoading}
                                    className={`flex flex-col items-center gap-2 h-auto py-3 ${!isActive && hoverColor}`}
                                    title={label}
                                >

                                    <Icon className="h-6 w-6" />
                                    <span className="text-xs">{label}</span>
                                </Button>
                            );
                        })}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ReactBar;