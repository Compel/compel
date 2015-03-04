import {forEach} from '../';
import {inScopeAsserter} from './scope';

function prependScopeToVariables(expression) {
  expression = expression.replace(/([^\.a-z\$_])([a-z\$_]+)/ig, (match, character, propName) => {
    return `${character}scope.${propName}`;
  });
  return `scope.${expression}`;
}

function compileExpression(expression, scope) {
  let value;
  try {
    value = eval(prependScopeToVariables(expression));
    if (typeof value === 'undefined') value = '';
  } catch (e) {
    value = '';
  }
  return value;
}

function compileElementBinding(element, expression, scope) {
  element.textContent = compileExpression(expression, scope);
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
      throw new Error(`Cannot create attribute ${attributeName}. Don't know how to compile a ${typeof value} value.`);
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

function bindAttributes(element, scope) {
  let unbinds = [];
  let attributes = element.attributes;
  forEach(attributes, (attribute) => {
    let {name, value} = attribute;
    if (name.substr(0, 7) === 'bind-') {
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

export default function (root, scope) {
  let unbinds = bindElement(root, scope);
  let elements = root.querySelectorAll('*');
  let assertInScope = inScopeAsserter(root);
  forEach(elements, (element) => {
    if (assertInScope(element)) {
      unbinds = unbinds.concat(bindElement(element, scope));
    }
  });
  return () => unbinds.forEach((unbind) => unbind());
}
