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
        }, info); // Mutate in prisma DB
    }
};

module.exports = Mutation;
