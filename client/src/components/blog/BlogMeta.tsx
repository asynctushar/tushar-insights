"use client";

import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { useState } from "react";
import { reactionIcons } from "@/lib/blog";
import { useAppSelector } from "@/redux/hooks";
import { Skeleton } from "../ui/skeleton";

interface BlogMetaProps {
    documentId: string;
    blogUrl?: string;
}

interface ReactionCounts {
    like: number;
    love: number;
    sad: number;
    angry: number;
    haha: number;
}

const BlogMeta = ({ documentId, blogUrl }: BlogMetaProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const blog = useAppSelector((state) => state.blog.blogs[documentId]);
    const isLoading = !blog;

    // Calculate reaction counts
    const reactionCounts: ReactionCounts = blog?.reactions?.reduce(
        (acc, reaction) => {
            if (reaction.type in acc) {
                acc[reaction.type as keyof ReactionCounts] += 1;
            }
            return acc;
        },
        { like: 0, love: 0, sad: 0, angry: 0, haha: 0 } as ReactionCounts
    ) || { like: 0, love: 0, sad: 0, angry: 0, haha: 0 };

    // Get top 3 reactions
    const topReactions = Object.entries(reactionCounts)
        .filter(([_, count]) => count > 0)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3);

    const totalReactions = Object.values(reactionCounts).reduce((sum, count) => sum + count, 0);

    if (isLoading) {
        return (
            <div className="flex items-center gap-2">
                {blogUrl && <Skeleton className="h-9 w-20" />}
                <Skeleton className="h-9 w-24" />
            </div>
        );
    }

    return (
        <>
            <div className="flex items-center gap-2">
                {/* Comments Button */}
                {blogUrl && (
                    <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="gap-2"
                    >
                        <Link href={blogUrl}>
                            <MessageSquare className="h-4 w-4" />
                            <span className="text-sm">{blog.comments?.length || 0}</span>
                        </Link>
                    </Button>
                )}

                {/* Reactions Button */}
                {totalReactions > 0 && (
                    <Button
                        onClick={() => setOpen(true)}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                    >
                        <div className="flex items-center -space-x-1">
                            {topReactions.map(([type]) => {
                                const ReactionIcon = reactionIcons[type as keyof typeof reactionIcons].icon;
                                const color = reactionIcons[type as keyof typeof reactionIcons].color;
                                return (
                                    <div
                                        key={type}
                                        className={`w-5 h-5 rounded-full bg-background flex items-center justify-center ${color}`}
                                    >
                                        <ReactionIcon className="h-3 w-3" />
                                    </div>
                                );
                            })}
                        </div>
                        <span className="text-sm">{totalReactions}</span>
                    </Button>
                )}
            </div>

            {/* Reactions Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-center">
                            Reactions
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {Object.entries(reactionIcons).map(([type, { icon: Icon, label, color }]) => {
                            const count = reactionCounts[type as keyof ReactionCounts];

                            return (
                                <div key={type} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Icon className={`h-5 w-5 ${color}`} />
                                            <span className="text-sm font-medium">{label}</span>
                                        </div>
                                        <span className="text-sm font-semibold">{count}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default BlogMeta;