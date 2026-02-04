"use client";

import { useState } from 'react';
import { Button } from '../ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Reaction } from '@/types/blog.type';
import { User } from '@/types/user.type';
import { toast } from 'sonner';
import { reactionTypes } from '@/lib/blog';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/redux/hooks';
import { addReaction, removeReaction, updateReaction } from '@/redux/slices/blog.slice';

interface ReactBarProps {
    blogId: string;
    user: User;
}

const ReactBar = ({ blogId, user }: ReactBarProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const blog = useAppSelector((state) => state.blog?.blogs[blogId]);
    const dispatch = useDispatch();


    // Find user's current reaction
    const userReaction = blog?.reactions?.find(
        (reaction) => reaction.user?.documentId === user.documentId
    );

    const handleReaction = async (type: Reaction["type"]) => {
        setIsLoading(true);

        try {
            // Case 1: User clicked the same reaction - Remove it
            if (userReaction && userReaction.type === type) {
                const res = await fetch(`/api/blogs/${blog?.slug}/reactions/${userReaction.documentId}`, {
                    method: 'DELETE',
                });
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || 'Failed to remove reaction');
                }

                dispatch(removeReaction({ blogId, reactionId: userReaction.documentId }));
                toast.success('Reaction removed');
            }
            // Case 2: User already reacted but chose different reaction - Update it
            else if (userReaction && userReaction.type !== type) {
                const res = await fetch(`/api/blogs/${blog?.slug}/reactions/${userReaction.documentId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type }),
                });
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || 'Failed to update reaction');
                }

                dispatch(updateReaction({ blogId: blogId, reactionId: userReaction.documentId, type: type }));
                toast.success('Reaction updated');
            }
            // Case 3: New reaction - Create it
            else {
                const res = await fetch(`/api/blogs/${blog?.slug}/reactions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type }),
                });
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || 'Failed to add reaction');
                }

                dispatch(addReaction({ blogId: blogId, reaction: data.data.reaction }));
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
            <Dialog>
                <Button
                    disabled={isLoading}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    asChild
                >
                    <DialogTrigger>

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
                    </DialogTrigger>
                </Button>

                <DialogContent
                    className="sm:max-w-md"
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
                                    className={`flex flex-col items-center gap-2 h-auto py-3 ${!isActive && hoverColor}`}
                                    title={label}
                                    asChild
                                >
                                    <DialogClose>
                                        <Icon className="h-6 w-6" />
                                        <span className="text-xs">{label}</span>
                                    </DialogClose>
                                </Button>
                            );
                        })}
                    </div>
                </DialogContent>
            </Dialog >
        </>
    );
};

export default ReactBar;