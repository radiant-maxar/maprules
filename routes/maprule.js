module.exports = {
    method: 'GET',
    path: '/maprule/{file*}',
    handler: require('../handlers/maprule')
};