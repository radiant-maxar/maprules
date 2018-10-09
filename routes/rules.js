module.exports = {
    method: 'GET',
    path: '/rules/{param*}',
    handler: require('../handlers/rules')
};