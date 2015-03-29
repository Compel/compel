import {compileFile} from '../../compiler';
import {basename, join, relative} from 'path';
import jsPath from '../js-path';
import {mkdirsSync as mkdirs, statSync as stat} from 'fs-extra';

function relativePath(path) {
  return relative(process.cwd(), path);
}

function uniquePath(path) {
  let ext = extname(path);
  return `${dirname(path)}/${basename(path, ext)}.compiled.${ext}`;
}

export default function (from, to) {
  if (!to) to = jsPath(from);
  if (stat(to).isDirectory()) {
    mkdirs(to);
    to = join(to, jsPath(basename(from)));
  }
  if (from === to) to = uniquePath(to);
  console.log(`${relativePath(from)} ==> ${relativePath(to)}`);
  compileFile(from, to);
}
