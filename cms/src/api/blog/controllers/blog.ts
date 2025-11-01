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
                const blogId = blog.documentId;

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
}));
