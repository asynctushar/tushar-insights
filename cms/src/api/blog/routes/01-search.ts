export default {
    routes: [
        {
            method: 'GET',
            path: '/blogs/search',
            handler: 'blog.search',
            config: {
                auth: false, // public search
            },
        },
    ],
};
