export default {
    routes: [{
        method: 'DELETE',
        path: '/notifications',
        handler: 'notification.clearNotification',
        config: {
            auth: {
                strategies: ['users-permissions'] // authenticated users only
            },
        },
    }]
};