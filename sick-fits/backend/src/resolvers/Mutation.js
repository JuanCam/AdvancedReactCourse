const bcrypt = require('bcryptjs');
const { randomBytes } = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { transport, makeANiceEmail } = require('../mail');
const { hasPermission } = require('../utils');

const Mutation = {
    async createItem(parent, args, ctx, info) {
        if(!ctx.request.userId) {
            throw new Error('You must be logged in.');
        }

        const item = await ctx.db.mutation.createItem({
            data: {
                // This is how relationship is created.
                user: {
                    connect: {id: ctx.request.userId}
                },
                ...args
            }
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
        // throw new Error('You aren\'t allowed to delete this item');

        const where = {id: args.id};
        // Find the item
        const item =
         await ctx.db.query.item({where}, `{id  title user { id }}`);
        // TODO: Check if the user owns that item or have permissions
        const ownsItem = item.user.id === ctx.request.userId;
        const hasPermissions = 
                ctx.request.user.permissions.some(
                    permission => ['ADMIN', 'ITEMDELETE'].includes(permission));
        if (!ownsItem && !hasPermissions) {
            throw new Error('You aren\'t allowed to delete this item');
        }


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

        const mailResponse = await transport.sendMail({
            from: 'juanhuge@ss.com',
            to: user.email,
            subject: 'Your Password Reset Token',
            html: makeANiceEmail(`Your Password Reset Token is: 
            \n\n 
            <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">Click here to reset</a>`)
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
    },

    async updatePermissions(parent, args, ctx, info) {
        // 1. Check if they are logged in
        if (!ctx.request.userId) {
            throw new Error('You must be logged in!');
        }
        // 2. Query the current user
        const currentUser = await ctx.db.query.user(
            {
                where: {
                    id: ctx.request.userId,
                },
            },
            info
        );
        // 3. Check if they have permissions to do this
        hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE']);
        // 4. Update the permissions
        return ctx.db.mutation.updateUser(
            {
                data: {
                    permissions: {
                        set: args.permissions,
                    },
                },
                where: {
                    id: args.userId,
                },
            },
            info
        );
    },

    async addToCart(parent, args, ctx, info) {
        const {userId} = ctx.request;
        if (!userId) {
            throw new Error('You must be logged in!');
        }
        const [existingCartItem] = await ctx.db.query.cartItems({
            where: {
                user: { id: userId },
                item: { id: args.id }
            }
        });

        if(existingCartItem) {
            return ctx.db.mutation.updateCartItem({
                where: {id: existingCartItem.id},
                data: { 
                    quantity: existingCartItem.quantity + 1
                }
            }, info);
        }

        return ctx.db.mutation.createCartItem({
            data: {
                user: {
                    connect: {id: userId}
                },
                item: {
                    connect: {id: args.id}
                }
            }
        }, info);
    },

    async removeFromCart(parent, args, ctx, info) {
        const {userId} = ctx.request;
        if (!userId) {
            throw new Error('You must be logged in!');
        }

        const [carItem] = await ctx.db.query.cartItems({
            where: {
                id: args.id,
            }
        }, `{ id, user { id } }`);
        
        if (!carItem) {
            throw new Error('Item not found!');
        }
        
        if (carItem.user.id !== userId) {
            throw new Error('User doesn\'t own this item!');
        }
        return ctx.db.mutation.deleteCartItem({
            where: { id: carItem.id },
        }, info);   
    }
};

module.exports = Mutation;
