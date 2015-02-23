import {bind as bindLoops} from './loops';
import {attach as attachListeners} from './event-listeners';
import {bind as bindInterpolation} from './interpolation';

export function bind(tag) {
  let {root, scope} = tag;
  bindLoops(root, scope);
  scope.once('update', () => attachListeners(root, scope));
  bindInterpolation(root, scope);
}
