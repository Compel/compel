import {any} from '../';

function scopedElementsIn(root) {
  return root.querySelectorAll('[data-scope]');
}

function inChild(children, element) {
  return any(children, (child) => child.contains(element));
}

export function inScopeAsserter(root) {
  let childScopes = scopedElementsIn(root);
  return (element) => !inChild(childScopes, element);
}
