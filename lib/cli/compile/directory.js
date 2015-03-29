import {mkdirs} from 'fs-extra';
import {walk} from 'walk';
import compileFile from './file';
import jsPath from '../js-path';
import {resolve} from 'path';

function createFileHandler(to) {
  return (root, fileStat, next) => {
    compileFile(
      resolve(root, fileStat.name),
      jsPath(to, fileStat.name)
    );
    next();
  };
}

function handleError(root, nodeStatsArray, next) {
  nodeStatsArray.forEach(n => {
    console.error("[ERROR] " + n.name)
    console.error(n.error.message || (n.error.code + ": " + n.error.path));
  });
  next();
}

export default function (from, to) {
  let handleFile = createFileHandler(to);
  mkdirs(to, err => {
    if (err) return console.error(err);
    let walker = walk(from);
    walker.on('file', handleFile);
    walker.on('errors', handleError);
  });
}
