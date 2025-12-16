/**
 * blog controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::blog.blog', ({ strapi }) => ({
    async find(ctx) {
        // Ensure user and category are populated as before
        ctx.query.populate = {
            cover: {
                fields: ['url', 'name', 'width', 'height', 'alternativeText', 'ext'], // general fields
            },
            user: true,
            category: true,
        };

        const { data, meta } = await super.find(ctx);

        const withExtras = await Promise.all(
            data.map(async (blog) => {
                const blogId = blog.id;

                const commentsCount = await strapi.db.query('api::comment.comment').count({
                    where: { blog: blogId },
                });

                const reactions = await strapi.db.query('api::reaction.reaction').findMany({
                    where: { blog: blogId },
                });

                return {
                    ...blog,
                    commentsCount,
                    reactions,
                };
            })
        );

        return { data: withExtras, meta };
    },

    async search(ctx) {
        const query = ctx.request.query.query || '';
        const locale = ctx.request.query.locale || 'en';

        if (!query) {
            return { data: [] };
        }

        const blogs = await strapi.db.query('api::blog.blog').findMany({
            where: {
                title: { $containsi: query },
                locale,
                publishedAt: { $notNull: true }
            },
            select: ['id', 'documentId', 'title', 'desc', 'slug', 'locale'],
            orderBy: { title: 'asc' },
            limit: 5,
        });

        return { data: blogs };
    },

    async findBySlug(ctx) {
        const { slug } = ctx.params;

        if (!slug) {
            return ctx.badRequest('Slug is required');
        }

        // 1️⃣ Fetch blog by slug
        const blog = await strapi.db.query('api::blog.blog').findOne({
            where: {
                slug,
                publishedAt: { $notNull: true }, // only published
            },
            populate: {
                cover: {
                    select: ['url', 'name', 'width', 'height', 'alternativeText', 'ext'],
                },
                user: true,
                category: true,
            },
        });

        if (!blog) {
            return ctx.notFound('Blog not found');
        }

        const blogId = blog.id;

        // 2️⃣ Fetch comments
        const comments = await strapi.db.query('api::comment.comment').findMany({
            where: {
                blog: blogId,
                publishedAt: { $notNull: true },
            },
            orderBy: { createdAt: 'asc' },
        });

        // 3️⃣ Arrange comments → replies
        const commentMap = new Map();

        comments.forEach((comment) => {
            commentMap.set(comment.documentId, {
                ...comment,
                replies: [],
            });
        });

        comments.forEach((comment) => {
            if (comment.type === 'reply' && comment.comment) {
                const parent = commentMap.get(comment.comment);
                if (parent) {
                    parent.replies.push(commentMap.get(comment.documentId));
                }
            }
        });

        const arrangedComments = Array.from(commentMap.values()).filter(
            (comment) => comment.type === 'normal'
        );

        // 4️⃣ Fetch reactions
        const reactions = await strapi.db.query('api::reaction.reaction').findMany({
            where: {
                blog: blogId,
                publishedAt: { $notNull: true },
            },
        });

        // 5️⃣ Return final response
        return {
            data: {
                ...blog,
                comments: arrangedComments,
                reactions,
            },
        };
    },

    async reactBlog(ctx) {
        const { slug } = ctx.params;
        const user = ctx.state.user;

        if (!user) {
            return ctx.unauthorized('You must be logged in');
        }

        if (!slug) {
            return ctx.badRequest('Slug is required');
        }

        if (!ctx.request.body?.type || !["like", "love", "angry", "sad", "haha"].includes(ctx.request.body.type)) {
            return ctx.badRequest("Please add correct reactions type.");
        };

        // 1️⃣ Fetch blog by slug
        const blog = await strapi.db.query('api::blog.blog').findOne({
            where: {
                slug,
                publishedAt: { $notNull: true }, // only published
            },
        });

        if (!blog) {
            return ctx.notFound('Blog not found');
        }


        // 3️⃣ Prevent duplicate reactions (important)
        const existingReaction = await strapi.db
            .query('api::reaction.reaction')
            .findOne({
                where: {
                    blog: blog.id,
                    user: user.id,
                },
            });

        if (existingReaction) {
            return ctx.badRequest('You have already reacted');
        }

        // 4️⃣ Create reaction
        const reaction = await strapi.db
            .query('api::reaction.reaction')
            .create({
                data: {
                    blog: blog.id,
                    user: user.id,
                    type: ctx.request.body.type,
                },
            });

        // 5️⃣ Return final response
        return {
            data: {
                reaction,
            },
        };
    },


    async updateBlogReaction(ctx) {
        const { slug, documentId } = ctx.params;
        const user = ctx.state.user;

        if (!user) {
            return ctx.unauthorized('You must be logged in');
        }

        if (!slug) {
            return ctx.badRequest('Slug is required');
        }

        if (!documentId) {
            return ctx.badRequest('Reaction documentId is required');
        }

        if (!ctx.request.body?.type || !["like", "love", "angry", "sad", "haha"].includes(ctx.request.body.type)) {
            return ctx.badRequest("Please add correct reactions type.");
        };

        // 1️⃣ Fetch blog by slug
        const blog = await strapi.db.query('api::blog.blog').findOne({
            where: {
                slug,
                publishedAt: { $notNull: true }, // only published
            },
        });

        if (!blog) {
            return ctx.notFound('Blog not found');
        }


        // find reaction
        const existingReaction = await strapi.db
            .query('api::reaction.reaction')
            .findOne({
                where: {
                    user: user.id,
                    blog: blog.id,
                    documentId: documentId,
                }
            });

        if (!existingReaction) {
            return ctx.badRequest('Reaction not found');
        }

        // update reaction
        const reaction = await strapi.db
            .query('api::reaction.reaction')
            .update({
                where: { documentId: documentId },
                data: {
                    blog: blog.id,
                    user: user.id,
                    type: ctx.request.body.type,
                },
            });

        // 5️⃣ Return final response
        return {
            data: {
                reaction,
            },
        };
    },


    async deleteBlogReaction(ctx) {
        const { slug, documentId } = ctx.params;
        const user = ctx.state.user;

        if (!user) {
            return ctx.unauthorized('You must be logged in');
        }

        if (!slug) {
            return ctx.badRequest('Slug is required');
        }

        if (!documentId) {
            return ctx.badRequest('Reaction documentId is required');
        }

        // 1️⃣ Fetch blog by slug
        const blog = await strapi.db.query('api::blog.blog').findOne({
            where: {
                slug,
                publishedAt: { $notNull: true }, // only published
            },
        });

        if (!blog) {
            return ctx.notFound('Blog not found');
        }


        // find reaction
        const existingReaction = await strapi.db
            .query('api::reaction.reaction')
            .findOne({
                where: {
                    user: user.id,
                    blog: blog.id,
                    documentId: documentId,
                }
            });

        if (!existingReaction) {
            return ctx.badRequest('Reaction not found');
        }

        // delete reaction
        await strapi.db
            .query('api::reaction.reaction')
            .delete({
                where: { documentId: documentId },
            });

        // 5️⃣ Return final response
        return {
            data: {
                message: "Reaction removed successfully"
            },
        };
    },



    // Normal comment creation
    async createComment(ctx) {

        const { slug } = ctx.params;
        const user = ctx.state.user;

        if (!user) {
            return ctx.unauthorized('You must be logged in');
        }

        if (!slug) {
            return ctx.badRequest('Slug is required');
        }

        if (!ctx.request.body?.desc || ctx.request.body?.desc?.length < 1) {
            return ctx.badRequest("Please add description");
        };

        if (!ctx.request.body?.type || ctx.request.body.type !== "normal") {
            return ctx.badRequest("Please add correct comment type.");
        };

        if (ctx.request.body.accountStatus === "banned") {
            return ctx.badRequest("Banned user can't comment");
        }

        // 1️⃣ Fetch blog by slug
        const blog = await strapi.db.query('api::blog.blog').findOne({
            where: {
                slug,
                publishedAt: { $notNull: true }, // only published
            },
        });

        if (!blog) {
            return ctx.notFound('Blog not found');
        }


        // Create comment
        const comment = await strapi.db
            .query('api::comment.comment')
            .create({
                data: {
                    blog: blog.id,
                    user: user.id,
                    type: ctx.request.body.type,
                    desc: ctx.request.body.desc
                },
            });

        // 5️⃣ Return final response
        return {
            data: {
                comment,
            },
        };

    },

    // Normal comment Deletation
    async deleteComment(ctx) {

        const { slug, documentId } = ctx.params;
        const user = ctx.state.user;

        if (!user) {
            return ctx.unauthorized('You must be logged in');
        }

        if (!slug) {
            return ctx.badRequest('Slug is required');
        }

        if (ctx.request.body.accountStatus === "banned") {
            return ctx.badRequest("Banned user can't comment");
        }

        // 1️⃣ Fetch blog by slug
        const blog = await strapi.db.query('api::blog.blog').findOne({
            where: {
                slug,
                publishedAt: { $notNull: true }, // only published
            },
        });

        if (!blog) {
            return ctx.notFound('Blog not found');
        }


        // Find comment
        const comment = await strapi.db
            .query('api::comment.comment')
            .findOne({
                where: {
                    documentId: documentId,
                    blog: blog.id,
                    user: user.id,
                    type: "normal"
                }
            });



        if (!comment) {
            return ctx.notFound('Commment not found');
        }

        // delete comment
        await strapi.db
            .query('api::comment.comment')
            .delete({
                where: {
                    documentId: documentId,
                    blog: blog.id,
                    user: user.id,
                    type: "normal"
                }
            });


        // 5️⃣ Return final response
        return {
            data: {
                message: "Comment removed successfully."
            },
        };

    },
}));
