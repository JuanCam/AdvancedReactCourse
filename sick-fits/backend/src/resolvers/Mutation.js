const Mutation = {
    async createItem(parent, args, ctx, info) {
        // TODO: checkl if we are logged in
        const item = await ctx.db.mutation.createItem({
            data: {...args}
        }, info) // Access prisma DB and mutate
        return item;
    }
};

module.exports = Mutation;
