const bcrypt = require('bcryptjs');
const { randomBytes } = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

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
    },

    async signin(parent, {email, password}, ctx, info) {
        email = email.toLowerCase();
        // hash the password
        const user = await ctx.db.query.user({ where: { email } });
        if (!user) {
            throw new Error('No such user found.');
        }
        const valid = await bcrypt.compare(password, user.password);
        
        if (!valid) {
            throw new Error('Invalid password');
        }
        // create JWT token
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
        // We set the jwt as a cookie in the response
        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365. // 1 year cookie
        });
        return user;
    },

    signout(parent, args, ctx, info) {
        ctx.response.clearCookie('token');
        return { message: 'You were successfuly logged out!' };
    },

    async requestReset(parent, {email}, ctx, info) {
        const user = await ctx.db.query.user({where: {email}});
        if (!user) {
            throw new Error(`Invalid email: ${email}`);
        }
        const resetToken = (await promisify(randomBytes)(20)).toString('hex');
        const resetTokenExpiry = Date.now() + 36000000; // 1 hour
        const res = await ctx.db.mutation.updateUser({
            where: {email},
            data: {resetToken, resetTokenExpiry}
        });
        
        return { message: 'An email has been sent to change your password!' };
    },

    async resetPassword(parent, { password, confirmPassword, resetToken }, ctx, info) {
        if(password !== confirmPassword) {
            throw new Error('Passwords don\'t match');
        }

        const now = Date.now();
        const [user] = await ctx.db.query.users({where: {
            resetToken,
            resetTokenExpiry_gte: Date.now() - 3600000}});
        if (!user) {
            throw new Error('Invalid or expired token');
        }
        const newPassword = await bcrypt.hash(password, 10); 
        const {email} = user;
        const modifiedUser = ctx.db.mutation.updateUser({
            where: {email},
            data: {
                password: newPassword,
                resetToken: null,
                resetTokenExpiry: null
            }
        });

        const token = jwt.sign({userId: modifiedUser.id}, process.env.APP_SECRET);

        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365. // 1 year cookie
        });

        return modifiedUser;
    }
};

module.exports = Mutation;
