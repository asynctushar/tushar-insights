export default {
    routes: [
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
