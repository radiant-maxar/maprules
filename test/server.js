'use strict';

const Hapi = require('@hapi/hapi');
const config = require('../config')['development'];
const host = config.host;
const server = Hapi.server({ port: 3001, host: host });


server.liftOff = async (route) => {
    try {
        server.route(route);

        if (!module.parent) {
            await server.start();
            console.log(`test server started at ${server.info.uri}`);

        } else {
            await server.initialize();

        }

    } catch (error) {
        throw error;

    }
};

server.crashLanding = async () => {
    try {
        return await server.stop();

    } catch (error) {
        console.error(error);

    }
};

void async function () {
    try {
        if (!module.parent) {
            await server.start();

        }
    } catch (error) {
        console.error(error);

    }
}();

module.exports = server;