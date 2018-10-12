module.exports = {
    method: 'GET',
    path: '/{file*}',
    handler: require('../handlers/fontawesome')
};