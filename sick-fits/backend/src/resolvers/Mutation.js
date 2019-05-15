const Mutation = {
    async createItem(parent, args, ctx, info) {
        // TODO: checkl if we are logged in
        const item = await ctx.db.mutation.createItem({
            data: {...args}
        }, info) // Access prisma DB and mutate
        return item;
    },

    updateItem(parent, args, ctx, info) {
        // First take a copy of the updates
        const updates = { ...args };
        // Remove the id from the updates
        delete updates.id;
        // Run the update method
        return ctx.db.mutation.updateItem({
            data: updates,
            where: {
                id: args.id
            }
        }, info); // Mutate in prisma DB, info is the
                  // return query sent in the Front End
    },

    async deleteItem(parent, args, ctx, info) {
        const where = {id: args.id};
        // Find the item
        const item = await ctx.db.query.item({where}, `{id  title}`);
        // TODO: Check if the user owns that item or have permissions

        // Delete item from DB
        return ctx.db.mutation.deleteItem({where}, info);
    }
};

module.exports = Mutation;
