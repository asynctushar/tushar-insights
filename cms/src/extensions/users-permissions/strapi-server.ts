export default (plugin) => {

    // Override UPDATE user - Ban/Unban only
    plugin.controllers.user.update = async (ctx) => {
        const authUser = ctx.state.user;

        if (!authUser) {
            return ctx.unauthorized();
        }

        const userId = ctx.params.id;

        // 1️⃣ Fetch target user with role
        const targetUser = await strapi.query('plugin::users-permissions.user').findOne({
            where: { id: userId },
            populate: ['role'],
        });

        if (!targetUser) {
            return ctx.notFound('User not found');
        }

        // 2️⃣ Check if target is an author
        if (targetUser.role.type === 'author') {
            return ctx.forbidden('You cannot modify author accounts');
        }

        // 3️⃣ Prevent author from changing their own status
        if (authUser.id === userId) {
            return ctx.forbidden('You cannot modify your own account status');
        }

        // 4️⃣ Toggle accountStatus
        const newStatus = targetUser.accountStatus === 'active' ? 'banned' : 'active';

        // 5️⃣ Update only accountStatus
        const updatedUser = await strapi.query('plugin::users-permissions.user').update({
            where: { id: userId },
            data: {
                accountStatus: newStatus,
            },
        });

        const schema = strapi.getModel('plugin::users-permissions.user');
        const sanitizedUser = await strapi.contentAPI.sanitize.output(updatedUser, schema);


        return ctx.send({
            data: sanitizedUser,
            message: `User ${newStatus === 'banned' ? 'banned' : 'unbanned'} successfully`
        });


    };

    // Override DELETE user - Delete user and all associated data
    plugin.controllers.user.destroy = async (ctx) => {
        const authUser = ctx.state.user;
        const userId = ctx.params.id;

        if (!authUser) {
            return ctx.unauthorized();
        }


        // 1️⃣ Fetch target user with role
        const targetUser = await strapi.query('plugin::users-permissions.user').findOne({
            where: { id: userId },
            populate: ['role'],
        });

        if (!targetUser) {
            return ctx.notFound('User not found');
        }

        // 2️⃣ Check if target is an author
        if (targetUser.role.type === 'author') {
            return ctx.forbidden('You cannot delete author accounts');
        }

        // 3️⃣ Prevent author from deleting themselves
        if (authUser.id === userId) {
            return ctx.forbidden('You cannot delete your own account');
        }

        // 4️⃣ Delete associated data (in order to handle foreign key constraints)

        // Delete reactions
        await strapi.db.query('api::reaction.reaction').deleteMany({
            where: { user: userId },
        });

        // Delete comments
        await strapi.db.query('api::comment.comment').deleteMany({
            where: { user: userId },
        });

        // Delete notifications (both as user and interactedBy)
        await strapi.db.query('api::notification.notification').deleteMany({
            where: {
                user: userId,
            },
        });

        // Delete blogs
        await strapi.db.query('api::blog.blog').deleteMany({
            where: { user: userId },
        });

        // 5️⃣ Finally, delete the user
        await strapi.query('plugin::users-permissions.user').delete({
            where: { id: userId },
        });

        return ctx.send({
            data: {
                message: 'User and all associated data deleted successfully',
                id: userId
            }
        });


    };

    return plugin;
};