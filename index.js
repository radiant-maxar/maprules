'use strict';

const Hapi = require('hapi');
const routes = require('./routes');

const server = Hapi.server({ 
    port: process.env.PORT || 3000, 
    host: process.env.HOST || 'localhost',
    routes: { cors: true }
});

// initialize server
const initServer = async () => {
    await server.register(require('inert'));
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