/**
 * notification controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::notification.notification', ({ strapi }) => ({

    async find(ctx) {


        if (!ctx.state.user) {
            return ctx.unauthorized('You must be logged in');

        }

        // Add user filter to the query
        ctx.query = {
            filters: {
                user: ctx.state.user.id
            },
            populate: {
                user: true,
                blog: true,
                interacted_by: true,
                comment: true,
            },
        };

        const { data, meta } = await super.find(ctx);

        return {
            data,
            meta
        };
    },

    async clearNotification(ctx) {
        if (!ctx.state.user) {
            return ctx.unauthorized('You must be logged in');
        }

        await strapi.db.query('api::notification.notification').deleteMany({
            where: {
                user: ctx.state.user.id
            }
        });

        return {
            message: "Notification cleared successfully."
        };
    },


    async update(ctx) {
        const user = ctx.state.user;

        if (!user) {
            return ctx.unauthorized('You must be logged in');
        }

        const notificationId = ctx.params.id;

        // Fetch with query engine
        const notification = await strapi.db
            .query('api::notification.notification')
            .findOne({
                where: { id: notificationId },
                populate: ['user'],
            });

        if (!notification) {
            return ctx.notFound('Notification not found');
        }

        if (notification.user.id !== user.id) {
            return ctx.forbidden('You can only update your own notifications');
        }

        if (notification.seen === true) {
            return ctx.badRequest('Notification already marked as seen');
        }

        // Update and return with full population
        const updatedNotification = await strapi.entityService.update(
            'api::notification.notification',
            notificationId,
            {
                data: { seen: true },
                populate: {
                    user: true,
                    blog: true,
                    interactedBy: true,
                    comment: true,
                },
            }
        );

        return { data: updatedNotification };
    }

}));
