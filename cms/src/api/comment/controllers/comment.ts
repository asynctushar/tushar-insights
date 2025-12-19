import { factories } from '@strapi/strapi';


export default factories.createCoreController('api::comment.comment', ({ strapi }) => ({

    async reply(ctx) {
        const user = ctx.state.user;

        if (!user) {
            return ctx.unauthorized('You must be logged in');
        }

        const { slug } = ctx.params;
        const commentId = ctx.params.id;

        if (!ctx.request.body?.desc || ctx.request.body?.desc?.trim().length === 0) {
            return ctx.badRequest('Reply description is required');
        }

        // 1️⃣ Find the blog by slug
        const blog = await strapi.db.query('api::blog.blog').findOne({
            where: { slug },
        });

        if (!blog) {
            return ctx.notFound('Blog not found');
        }

        // 2️⃣ Find the parent comment
        const parentComment = await strapi.db.query('api::comment.comment').findOne({
            where: { id: commentId },
            populate: {
                blog: true,
            }
        });

        if (!parentComment) {
            return ctx.notFound('Comment not found');
        }

        // 3️⃣ Check if parent comment is of type "normal"
        if (parentComment.type !== 'normal') {
            return ctx.badRequest('You can only reply to normal comments, not to replies');
        }

        // 4️⃣ Verify parent comment belongs to this blog
        if (parentComment.blog.documentId !== blog.documentId) {
            return ctx.badRequest('Comment does not belong to this blog');
        }

        // 5️⃣ Create the reply
        const reply = await strapi.db.query('api::comment.comment').create({
            data: {
                desc: ctx.request.body.desc.trim(),
                type: 'reply',
                user: user.id,
                blog: blog.id,
                comment: parentComment.id, // Link to parent comment
            },
            populate: {
                user: true,
                blog: true,
                comment: true,
            },
        });

        return {
            data: reply,
            message: 'Reply created successfully',
        };


    },

    async delete(ctx) {
        const user = ctx.state.user;

        if (!user) {
            return ctx.unauthorized('You must be logged in');
        }

        const commentId = ctx.params.id;

        try {
        

            // 2️⃣ Find the comment with user relation
            const comment = await strapi.db.query('api::comment.comment').findOne({
                where: { id: commentId },
                populate: ['user'],
            });

            if (!comment) {
                return ctx.notFound('Comment not found');
            }


            // 4️⃣ Check ownership - user can only delete their own comments
            if (comment.user.id !== user.id) {
                return ctx.forbidden('You can only delete your own comments');
            }

            // 5️⃣ If it's a "normal" comment, delete all its replies first
            if (comment.type === 'normal') {
                await strapi.db.query('api::comment.comment').deleteMany({
                    where: {
                        comment: commentId, // All replies linked to this comment
                    },
                });
            }

            // 6️⃣ Delete the comment itself
            await strapi.db.query('api::comment.comment').delete({
                where: { id: commentId },
            });

            return {
                data: {
                    message: 'Comment deleted successfully',
                    id: commentId,
                },
            };

        } catch (error) {
            console.error('Delete comment error:', error);
            return ctx.badRequest('Unable to delete comment', { error: error.message });
        }
    }
}));