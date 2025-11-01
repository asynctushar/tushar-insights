/**
 * blog controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::blog.blog', ({ strapi }) => ({
    async find(ctx) {
        const { data, meta } = await super.find(ctx);

        // For each blog, fetch its comments and reactions manually
        const withExtras = await Promise.all(
            data.map(async (blog) => {
                const blogId = blog.documentId;

                const comments = await strapi.db.query('api::comment.comment').findMany({
                    where: { blog: blogId },
                });

                const reactions = await strapi.db.query('api::reaction.reaction').findMany({
                    where: { blog: blogId },
                });

                console.log(comments);
                console.log(reactions);

                return {
                    ...blog,
                    comments,
                    reactions,
                };
            })
        );

        return { data: withExtras, meta };
    }
}));
