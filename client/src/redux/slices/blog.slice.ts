import { removeReplyFromParent, removeTopLevelComment, removeUserFromComments, updateUserBanStatus } from '@/lib/blog';
import { Blog, Reaction } from '@/types/blog.type';
import { Comment } from '@/types/comment.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BlogState {
    blogs: Record<string, Blog>;
    isLoading: boolean;
}

const initialState: BlogState = {
    blogs: {},
    isLoading: true
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
        },

        banUser(
            state,
            action: PayloadAction<{
                blogId: string;
                userId: string;
                isBanned: boolean;
            }>
        ) {
            const blog = state.blogs[action.payload.blogId];
            if (!blog || !blog.comments?.length) return;

            updateUserBanStatus(
                blog.comments,
                action.payload.userId,
                action.payload.isBanned
            );
        },

        removeUser(
            state,
            action: PayloadAction<{
                blogId: string;
                userId: string;
            }>
        ) {
            const blog = state.blogs[action.payload.blogId];
            if (!blog || !blog.comments?.length) return;

            const cleanedComments = removeUserFromComments(
                blog.comments,
                action.payload.userId
            );
            blog.comments = cleanedComments;

        },
        setIsMetaLoading: (state, action) => {
            state.isLoading = action.payload;
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
    banUser,
    removeUser,
    setIsMetaLoading
} = blogSlice.actions;

export default blogSlice.reducer;
