#!/usr/bin/env node

import program from 'commander';
import pkg from '../../package.json';
import {compileFile} from '../compiler';
import * as plugins from '../compiler/plugins';
import {basename, dirname, extname} from 'path';

program
  .version(pkg.version)
  .usage('[options] source <destination>')
  .option('--babel', 'Compile component scripts with babel.js')
  .option('--html-minifier', 'Minifies HTML (requires html-minifier)')
  .parse(process.argv);

if (program.args < 1) {
  program.help();
}

let [from, to] = program.args;

if (!to) {
  to = `${dirname(from)}/${basename(from, extname(from))}.js`;
}

if (from === to) {
  let ext = extname(from);
  to = `${dirname(from)}/${basename(from, ext)}.compiled.${ext}`;
}

if (program.babel) {
  console.log('Loading babel plugin')
  plugins.add(plugins.inHouse.babel);
}

if (program.htmlMinifier) {
  console.log('Loading HTML minifier plugin');
  plugins.add(plugins.inHouse['html-minifier']);
}

console.log(`Compiling ${from} to ${to}`);
compileFile(from, to);
