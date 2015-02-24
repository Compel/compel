require('babel/register');
require('../lib/compiler/plugins/babel');

var scomp = require('../');

function build(name) {
  scomp.parseFile(__dirname+'/tags/source/'+name+'.html', __dirname+'/tags/build/'+name+'.js');
}

build('variables');
build('loops');
build('nested');
build('options');
build('event-listeners');
build('overriding-attributes');
