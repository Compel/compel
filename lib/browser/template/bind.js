import {forEach} from '../';

function compileExpression(expression, scope) {
  expression = expression.replace(/([^\.a-z\$_])([a-z\$_]+)/ig, (match, character, propName) => {
    return `${character}scope.${propName}`;
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

function compileElementBinding(element, expression, scope) {
  element.innerHTML = compileExpression(expression, scope);
}

function bindContent(element, scope) {
  let expression = element.getAttribute('bind');
  let listener = () => compileElementBinding(element, expression, scope);
  element.removeAttribute('bind');
  scope.on('update', listener);
  return () => scope.removeListener('update', listener);
}

function compileAttributeBinding(element, attributeName, attributeValue, scope) {
  let value = compileExpression(attributeValue, scope);
  if (value === false) {
    return element.removeAttribute(attributeName);
  } else if (value === true) {
    value = '';
  } else if (Array.isArray(value)) {
    value = value.join(' ');
  } else {
    try {
      value = value.toString();
    } catch (e) {
      throw new Error(`Cannot create attribute ${attributeName}. Don't know how to compile a ${type} value.`);
    }
  }
  element.setAttribute(attributeName, value);
}

function bindAttribute(element, attributeName, attributeValue, scope) {
  let attributeToReplace = attributeName.substr(7);
  let listener = () => compileAttributeBinding(element, attributeToReplace, attributeValue, scope);
  scope.on('update', listener);
  return () => scope.removeListener('update', listener);
}

export function bindAttributes(element, scope) {
  let unbinds = [];
  let attributes = element.attributes;
  forEach(attributes, (attribute) => {
    let {name, value} = attribute;
    if (name.substr(0, 7) === 'compel-') {
      unbinds.push(bindAttribute(element, name, value, scope));
    }
  });
  forEach(attributes, element.removeAttribute.bind(element));
  return unbinds;
}

function bindElement(element, scope) {
  let unbinds = [];
  if (element.hasAttribute('bind')) {
    unbinds.push(bindContent(element, scope));
  }
  unbinds = unbinds.concat(bindAttributes(element, scope));
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
  let unbinds = bindElement(root, scope);
  let elements = root.querySelectorAll('*');
  forEach(elements, (element) => {
    let childScopes = root.querySelectorAll('[data-scope]');
    if (!inChildScope(childScopes, element)) {
      unbinds = unbinds.concat(bindElement(element, scope));
    }
  });
  return () => unbinds.forEach((unbind) => unbind());
}
