import compileFile from './file';
import compileDir from './directory';
import {statSync as stat} from 'fs-extra';

export default function (from, to) {
  if (from.length === 1 && stat(from[0]).isDirectory()) {
    compileDir(from[0], to);
  } else {
    from.forEach(match => compileFile(match, to));
  }
}
