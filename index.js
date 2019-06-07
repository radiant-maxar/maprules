'use strict';

const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const config = require('./config')[process.env.NODE_ENV || 'development'];
const inert = require('@hapi/inert');
const yar = { plugin: require('@hapi/yar'), options: config.yar };
const jwtScheme = require('./jwtScheme').scheme;

const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    routes: { cors: true }
});

server.auth.scheme('jwt', jwtScheme);
server.auth.strategy('default', 'jwt');

// initialize server
const initServer = async() => {
    await server.register(inert);
    await server.register(yar);

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