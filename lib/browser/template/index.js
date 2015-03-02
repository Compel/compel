import {bind as bindLoops} from './loops';
import {attach as attachListeners} from './event-listeners';
import transclude from './transclusion';
import bindTemplate from './bind';

export function bindElement(root, scope) {
  bindLoops(root, scope);
  scope.once('update', () => attachListeners(root, scope));
  bindTemplate(root, scope);
}

export function bind(tag) {
  bindElement(tag.root, tag.scope);
  transclude(tag);
}
