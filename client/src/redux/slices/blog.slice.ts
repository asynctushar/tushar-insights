import { removeReplyFromParent, removeTopLevelComment } from '@/lib/blog';
import { Blog, Reaction } from '@/types/blog.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BlogState {
    blogs: Record<string, Blog>;
}

const initialState: BlogState = {
    blogs: {},
};


const blogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers: {
        updateBlog(
            state,
            action: PayloadAction<
                Partial<Blog> & { documentId: string; }
            >
        ) {
            const { documentId, ...updates } = action.payload;
            const existing = state.blogs[documentId];

            state.blogs[documentId] = {
                ...existing,
                ...updates,
                documentId,
                comments: updates.comments ? updates.comments : existing?.comments ? existing?.comments : []
            };
        },
        addReaction(
            state,
            action: PayloadAction<{
                blogId: string;
                reaction: Reaction;
            }>
        ) {
            const blog = state.blogs[action.payload.blogId];
            if (blog && blog.reactions) {
                const existing = blog.reactions.find(
                    r => r.documentId === action.payload.reaction.documentId
                );

                if (!existing) {
                    blog.reactions.push(action.payload.reaction);
                }
            };
        },

        updateReaction(
            state,
            action: PayloadAction<{
                blogId: string;
                reactionId: string;
                type: Reaction['type'];
            }>
        ) {
            const blog = state.blogs[action.payload.blogId];
            if (blog && blog.reactions) {
                const reaction = blog.reactions.find(
                    r => r.documentId === action.payload.reactionId
                );

                if (reaction) {
                    reaction.type = action.payload.type;
                }
            };
        },

        removeReaction(
            state,
            action: PayloadAction<{
                blogId: string;
                reactionId: string;
            }>
        ) {
            const blog = state.blogs[action.payload.blogId];
            if (blog && blog.reactions) {
                blog.reactions = blog.reactions.filter(
                    r => r.documentId !== action.payload.reactionId
                );
            }
        },

        addComment(
            state,
            action: PayloadAction<{
                blogId: string;
                comment: Comment;
            }>
        ) {
            const blog = state.blogs[action.payload.blogId];
            if (blog) {
                blog.comments.unshift(action.payload.comment as any);

                // Update count
                if (typeof blog.commentsCount === "number") {
                    blog.commentsCount += 1;
                } else {
                    blog.commentsCount = 1;
                }
            }
        },
        removeComment(
            state,
            action: PayloadAction<{
                blogId: string;
                commentId: string;
            }>
        ) {
            const blog = state.blogs[action.payload.blogId];
            if (blog) {

                blog.comments = removeTopLevelComment(
                    blog.comments ?? [],
                    action.payload.commentId
                );

                // Update count
                if (typeof blog.commentsCount === "number") {
                    blog.commentsCount += 1;
                } else {
                    blog.commentsCount = 1;
                }
            }
        },
        addReply(
            state,
            action: PayloadAction<{
                blogId: string;
                parentCommentId: string;
                reply: Comment;
            }>
        ) {
            const blog = state.blogs[action.payload.blogId];

            if (blog) {
                const parent = blog.comments?.find(
                    c => c.documentId === action.payload.parentCommentId
                );

                if (!parent) return;
                parent.replies ??= [];
                parent.replies.unshift(action.payload.reply as any);
            }
        },

        removeReply(
            state,
            action: PayloadAction<{
                blogId: string;
                parentCommentId: string;
                replyId: string;
            }>
        ) {
            const blog = state.blogs[action.payload.blogId];
            if (blog) {
                blog.comments = removeReplyFromParent(
                    blog.comments ?? [],
                    action.payload.parentCommentId,
                    action.payload.replyId
                );

            }
        }

    },
});

export const {
    updateBlog,
    addReaction,
    updateReaction,
    removeReaction,
    addComment,
    removeComment,
    addReply,
    removeReply,
} = blogSlice.actions;

export default blogSlice.reducer;
