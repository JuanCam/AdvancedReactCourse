const { forwardTo } = require('prisma-binding');

const Query = {
    // async items(parent, args, ctx, info) {
    //     const fetchedItems = await ctx.db.query.items();
    //     return fetchedItems;
    // }
    items: forwardTo('db')
};

module.exports = Query;
