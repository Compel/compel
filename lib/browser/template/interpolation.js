import {forEach} from '../';

const BIND = 'bind';

export function compileElement(element, scope) {
  let expression = element.getAttribute(BIND);

  expression = expression.replace(/([^\.a-z\$_])([a-z\$_]+)/ig, (match, char, propName) => {
    return `${char}scope.${propName}`;
  });

  let value;

  try {
    value = eval(`scope.${expression}`);
    if (typeof value === 'undefined') value = '';
  } catch (e) {
    value = '';
  }

  element.innerHTML = value;
}

export function bindElement(element, scope) {
  let listener = () => compileElement(element, scope);
  scope.on('update', listener);
  return () => scope.removeListener('update', listener);
}

function inChildScope(childScopes, element) {
  let isInChildScope = false;
  forEach(childScopes, (childScope) => {
    if (childScope.contains(element)) {
      isInChildScope = true;
      return false;
    }
  });
  return isInChildScope;
}

export function bind(root, scope) {
  let unbinds = [];
  if (root.hasAttribute(BIND)) {
    unbinds.push(bindElement(root, scope));
  } else {
    let elements = root.querySelectorAll(`[${BIND}]`);
    forEach(elements, (element) => {
      let childScopes = root.querySelectorAll('[data-scope]');
      if (!inChildScope(childScopes, element)) {
        unbinds.push(bindElement(element, scope));
      }
    });
  }
  return () => unbinds.forEach((unbind) => unbind());
}
