'use strict';

const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const config = require('./config')[process.env.NODE_ENV || 'development'];
const inert = require('@hapi/inert');
const jwtScheme = require('./jwtScheme').scheme;

const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    routes: { cors: { origin: ['*'], credentials: true } }
});

server.auth.scheme('jwt', jwtScheme);
server.auth.strategy('default', 'jwt');

// initialize server
const initServer = async() => {
    server.state('maprules_session', config.session);
    await server.register(inert);

    // add endpoints
    server.route(routes);

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);

};

// deal with the unhandle-able
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);

});

// run the server
initServer();