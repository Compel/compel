import {bind as bindLoops} from './loops';
import {attach as attachListeners} from './event-listeners';
import transclude from './transclusion';
import bind from './bind';

export function bindElement(root, scope) {
  bindLoops(root, scope);
  scope.once('update', () => attachListeners(root, scope));
  bind(root, scope);
}

export function bind(tag) {
  bindElement(tag.root, tag.scope);
  transclude(tag);
}
