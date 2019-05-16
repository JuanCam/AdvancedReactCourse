const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
    },

    async signup(parent, args, ctx, info) {
        args.email = args.email.toLowerCase();
        // hash the password
        const password = await bcrypt.hash(args.password, 10);
        // create the user in the db
        const user = await ctx.db.mutation.createUser({
            data: {
                ...args,
                password,
                permissions: {set: ['USER']}
            }
        }, info);
        // create JWT token
        const token = jwt.sign({userId: user.id}, process.env.APP_SECRET);
        // We set the jwt as a cookie in the response
        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365. // 1 year cookie
        });

        return user;

    }
};

module.exports = Mutation;
