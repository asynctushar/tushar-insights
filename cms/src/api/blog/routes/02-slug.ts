export default {
    routes: [
        {
            method: 'DELETE',
            path: '/blogs/:slug/comments/:documentId',
            handler: 'blog.deleteComment',
            config: {
                auth: {
                    strategies: ['users-permissions'] // authenticated users only
                },
            },
        },
        {
            method: 'POST',
            path: '/blogs/:slug/comments',
            handler: 'blog.createComment',
            config: {
                auth: {
                    strategies: ['users-permissions'] // authenticated users only
                },
            },
        },
        {
            method: 'PATCH',
            path: '/blogs/:slug/reactions/:documentId',
            handler: 'blog.updateBlogReaction',
            config: {
                auth: {
                    strategies: ['users-permissions'] // authenticated users only
                },
            },
        },
        {
            method: 'DELETE',
            path: '/blogs/:slug/reactions/:documentId',
            handler: 'blog.deleteBlogReaction',
            config: {
                auth: {
                    strategies: ['users-permissions'] // authenticated users only
                },
            },
        },
        {
            method: 'POST',
            path: '/blogs/:slug/reactions',
            handler: 'blog.reactBlog',
            config: {
                auth: {
                    strategies: ['users-permissions'] // authenticated users only
                },
            },
        },
        {
            method: 'GET',
            path: '/blogs/:slug',
            handler: 'blog.findBySlug',
            config: {
                auth: false, // public
            },
        },

    ],
};
