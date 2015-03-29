import program from 'commander';
import pkg from '../../package.json';
import * as plugins from '../compiler/plugins';
import {basename, dirname, extname} from 'path';
import jsPath from './js-path';
import compile from './compile';

program
  .version(pkg.version)
  .usage('[options] source <destination>')
  .option('-o, --output [directory]', 'A directory to put the compiled output. Default is the same as the source')
  .option('--babel', 'Compile component scripts with babel.js')
  .option('--html-minifier', 'Minifies HTML (requires html-minifier)')
  .parse(process.argv);

if (program.args < 1) {
  program.help();
}

if (program.babel) {
  console.log('Loading babel plugin')
  plugins.add(plugins.inHouse.babel);
}

if (program.htmlMinifier) {
  console.log('Loading HTML minifier plugin');
  plugins.add(plugins.inHouse['html-minifier']);
}

compile(program.args, program.output);
