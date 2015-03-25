import {any} from '../';

function scopedElementsIn(root) {
  return root.querySelectorAll('[data-scope]');
}

function inAny(elementToFind, elements) {
  return any(elements, element => element.contains(elementToFind));
}

export function inScopeAsserter(root) {
  let childScopes = scopedElementsIn(root);
  return element => !inAny(element, childScopes);
}
