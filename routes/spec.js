module.exports = {
    method: 'GET',
    path: '/spec/{param*}',
    handler: require('../handlers/spec')
};