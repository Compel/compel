import {forEach} from '../';

const BIND = 'bind';

function compileExpression(expression, scope) {
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

  return value;
}

function compileElementBinding(element, scope) {
  let expression = element.getAttribute(BIND);
  element.innerHTML = compileExpression(expression, scope);
}

function bindElement(element, scope) {
  let listener = () => compileElementBinding(element, scope);
  scope.on('update', listener);
  return () => scope.removeListener('update', listener);
}

function compileAttributeBinding(element, attributeName, attributeValue, scope) {
  let attributeToReplace = attributeName.substr(6);
  element.setAttribute(attributeToReplace, compileExpression(attributeValue, scope));
}

function bindAttribute(element, attributeName, attributeValue, scope) {
  let listener = () => compileAttributeBinding(element, attributeName, attributeValue, scope);
  scope.on('update', listener);
  return () => scope.removeListener('update', listener);
}

function bindFactory(element, scope) {
  let unbinds = [];

  if (element.hasAttribute('bind')) {
    unbinds.push(bindElement(element, scope));
  }

  forEach(element.attributes, (attribute) => {
    let {name, value} = attribute;
    if (name.substr(0, 6) === 'scomp-') {
      unbinds.push(bindAttribute(element, name, value, scope));
    }
  });

  return unbinds;
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

export default function (root, scope) {
  let unbinds = bindFactory(root, scope);
  let elements = root.querySelectorAll('*');
  forEach(elements, (element) => {
    let childScopes = root.querySelectorAll('[data-scope]');
    if (!inChildScope(childScopes, element)) {
      unbinds = unbinds.concat(bindFactory(element, scope));
    }
  });
  return () => unbinds.forEach((unbind) => unbind());
}
