require('babel/register')({only: new RegExp('^' + __dirname)});
module.exports = require('./lib/compiler');
exports.plugins = require('./lib/compiler/plugins');
