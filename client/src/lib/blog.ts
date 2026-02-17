import { Reaction } from '@/types/blog.type';
import { Comment } from '@/types/comment.type';
import { Heart, Frown, Flame, Laugh, ThumbsUp, type LucideIcon } from 'lucide-react';

export const linkGenerator = (link: string, lang?: string) => {
    if (!lang || lang !== "bn") {
        return link;
    } else {
        if (link === "/") return `${link}${lang}`;

        return `${link}/${lang}`;
    }
};

export const createUrl = (lang: string, categoryId?: string) => {
    const params = new URLSearchParams();
    if (categoryId) params.set("category", categoryId);

    // If lang is "bn", put it in the path
    const path = lang === "bn" ? `/blogs/bn` : "/blogs";
    return `${path}${params.toString() ? `?${params.toString()}` : ""}`;
};

export function normalizePathname(
    pathname: string,
    lang?: string
): string {
    if (!lang || lang === "en") {
        // default language → no suffix
        return pathname;
    }

    // Remove trailing locale segment
    const segments = pathname.split("/").filter(Boolean);

    if (segments[segments.length - 1] === lang) {
        segments.pop();
    }

    return "/" + segments.join("/");
}


type reactionTypesProps = {
    type: Reaction["type"];
    label: string;
    hoverColor: string;
    activeColor: string;
    icon: LucideIcon;
};

export const reactionTypes: reactionTypesProps[] = [
    { type: 'like', icon: Heart, label: 'Like', hoverColor: 'hover:bg-blue-500/10 hover:text-blue-500', activeColor: 'text-blue-500' },
    { type: 'love', icon: Heart, label: 'Love', hoverColor: 'hover:bg-red-500/10 hover:text-red-500', activeColor: 'text-red-500' },
    { type: 'haha', icon: Laugh, label: 'Haha', hoverColor: 'hover:bg-green-500/10 hover:text-green-500', activeColor: 'text-green-500' },
    { type: 'sad', icon: Frown, label: 'Sad', hoverColor: 'hover:bg-yellow-500/10 hover:text-yellow-500', activeColor: 'text-yellow-500' },
    { type: 'angry', icon: Flame, label: 'Angry', hoverColor: 'hover:bg-orange-500/10 hover:text-orange-500', activeColor: 'text-orange-500' },
];


export const reactionIcons = {
    like: { icon: ThumbsUp, label: "Like", color: "text-blue-500" },
    love: { icon: Heart, label: "Love", color: "text-red-500" },
    sad: { icon: Frown, label: "Sad", color: "text-yellow-500" },
    angry: { icon: Flame, label: "Angry", color: "text-orange-500" },
    haha: { icon: Laugh, label: "Haha", color: "text-green-500" },
};

export const removeTopLevelComment = (
    comments: Comment[],
    commentId: string
) => comments.filter(c => c.documentId !== commentId);

export const removeReplyFromParent = (
    comments: Comment[],
    parentCommentId: string,
    replyId: string
) =>
    comments.map(comment =>
        comment.documentId === parentCommentId
            ? {
                ...comment,
                replies: comment.replies.filter(
                    reply => reply.documentId !== replyId
                ),
            }
            : comment
    );


export const removeUserFromComments = (comments: Comment[], userId: string): Comment[] => {
    return comments
        .filter(comment => comment.user.documentId !== userId)
        .map(comment => ({
            ...comment,
            replies: comment.replies
                ? removeUserFromComments(comment.replies, userId)
                : [],
        }));
};

export const updateUserBanStatus = (comments: Comment[], userId: string, isBanned: boolean) => {
    for (const comment of comments) {
        if (comment.user.documentId === userId) {
            comment.user.accountStatus = isBanned ? "banned" : "active";
        }

        if (comment.replies?.length) {
            updateUserBanStatus(comment.replies, userId, isBanned);
        }
    }
}


