
module.exports = {
    method: 'GET',
    path: '/docs/{param*}',
    handler: require('../handlers/docs')
};