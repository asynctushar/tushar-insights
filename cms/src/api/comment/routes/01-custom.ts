export default {
    routes: [
        {
            method: 'POST',
            path: '/blogs/:slug/comments/:id/reply',
            handler: 'comment.reply',
            config: {
                auth: {
                    strategies: ['users-permissions'] // authenticated users only
                },
            },
        },
    ],
};
