import {compile as compileLoops} from './loops';
import {compile as attachListeners} from './event-listeners';
import {compile as interpolate} from './interpolation';

export function register(tag) {
  let {root, scope} = tag;
  compileLoops(root, scope);
  scope.once('update', () => attachListeners(root, scope));
  scope.on('update', () => interpolate(root, scope));
}
