import {bind as bindScope} from './interpolation';
import {forEach, uid} from '../';
import Scope from '../scope';

const EACH_FOR = 'data-each-for';

// each="foo"
var propertyRegExp = '[a-zA-Z0-9_\\$\\.]+';
const PROPERTY_REG_EXP = new RegExp(`^${propertyRegExp}$`);

// each="foo in bar"
var eachInRegExp = `(${propertyRegExp})\\s+in\\s+(${propertyRegExp})`;
const EACH_IN_REG_EXP = new RegExp(`^${eachInRegExp}$`);

// each="i, foo in bar"
const KEY_VALUE_EACH_IN_REG_EXP = new RegExp(`^(${propertyRegExp})\\s*,\\s*${eachInRegExp}$`);

function eachValueAs(itemName, prop, callback) {
  prop.forEach((val) => callback({[itemName]: val}));
}

function eachKeyValueAs(keyName, valueName, prop, compile) {
  forEach(prop, (value, key) => {
    compile({
      [keyName]: key,
      [valueName]: value
    });
  });
}

function eachAs(prop, compile) {
  prop.forEach(compile);
}

function bindLoop(element, scope) {
  let id = uid();
  let expression = element.getAttribute('each').trim();
  let keyValue = KEY_VALUE_EACH_IN_REG_EXP.exec(expression);
  let eachIn = EACH_IN_REG_EXP.exec(expression);
  let logicLess = PROPERTY_REG_EXP.exec(expression);
  let parent = element.parentElement;

  let getProp = (name) => scope[name] || [];

  let empty = () => {
    let elements = parent.querySelectorAll(`[${EACH_FOR}="${id}"]`);
    forEach(elements, (element) => {
      parent.removeChild(element);
    });
  };

  let unbind = () => {};

  let compile = (vars) => {
    let node = element.cloneNode(true);
    let childScope = new Scope(vars, scope, node);
    unbind = bindScope(node, childScope);
    parent.appendChild(node);
    childScope.update();
  };

  function watch(propName, compiler, ...args) {
    scope.watch(propName, () => {
      empty();
      unbind();
      compiler.call(null, ...args, getProp(propName), compile);
    });
  }

  parent.removeChild(element);
  element.setAttribute(EACH_FOR, id);

  if (keyValue) {
    // key, value in array
    let [, keyName, valueName, propName] = keyValue;
    watch(propName, eachKeyValueAs, keyName, valueName);
  } else if (eachIn) {
    // value in array
    let [, itemName, propName] = eachIn;
    watch(propName, eachValueAs, itemName);
  } else if (logicLess) {
    // logic less looping
    watch(expression, eachAs);
  } else {
    throw new SyntaxError(`Incorrect "each" expression: "${expression}"`);
  }
}

export function bind(root, scope) {
  let elements = root.querySelectorAll('[each]');
  forEach(elements, (element) => {
    bindLoop(element, scope);
  });
}
