require('babel/register');
module.exports = require('./lib/compiler');
exports.plugins = require('./lib/compiler/plugins');
