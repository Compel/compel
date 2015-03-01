require('babel/register');
require('../lib/compiler/plugins/babel');

var compel = require('../');

function build(name) {
  compel.parseFile(__dirname+'/tags/source/'+name+'.html', __dirname+'/tags/build/'+name+'.js');
}

build('variables');
build('loops');
build('nested');
build('options');
build('event-listeners');
build('overriding-attributes');
build('transclusion');
