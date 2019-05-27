const cookieParser = require('cookie-parser');
require('dotenv').config({path: 'variables.env'});
const jwt = require('jsonwebtoken');
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

server.express.use(cookieParser());
// use express middleware to handle current user

// decode JWT so we can get  the user Id on each request
server.express.use((req, res, next) => {
    const {token} = req.cookies;
    if (token) {
        const {userId} = jwt.verify(token, process.env.APP_SECRET);
        // put userId onto the request for future requests to access
        req.userId = userId
    }
    next();  
})

// Create the middle that populates the user on each request
server.express.use(async (req, res, next) => {
    const { token } = req.cookies;
    if (!req.userId) {
        return next();
    }
    const user = await db.query.user(
        {where: {id: req.userId}},
        `{id, name, email, permissions}`);

    req.user = user;
    next();
})

// Start it
server.start({
    cors: {
        credentials: true,
        origin: process.env.FRONTEND_URL,
    },
}, deets => {
    console.log(`Server is now running on port ${deets.port}`);
})