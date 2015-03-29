import {basename, join, dirname, extname} from 'path';

export default function (...paths) {
  let path = join(...paths);
  let dir = dirname(path);
  let ext = extname(path);
  let base = basename(path, ext);
  return join(dir, `${base}.js`);
}
