const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

const Query = {
    // async items(parent, args, ctx, info) {
    //     const fetchedItems = await ctx.db.query.items();
    //     return fetchedItems;
    // }
    items: forwardTo('db'),
    item: forwardTo('db'),
    itemsConnection: forwardTo('db'),
    me(parent, args, ctx, info) {
        // check if there's a current user ID
        if(!ctx.request.userId) {
            return null;
        }
        return ctx.db.query.user(
            { 
                where: {id: ctx.request.userId}
            }, info);
    },

    async users(parent, args, ctx, info) {

        if (!ctx.request.userId) {
            return [];
        }
        
        hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);

        return ctx.db.query.users({}, info);
        
    }
};

module.exports = Query;
