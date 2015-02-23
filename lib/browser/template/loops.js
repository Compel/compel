import {compile as interpolate} from './interpolation';
import Scope from '../scope';

var propertyRegExp = '[a-zA-Z0-9_\\$\\.]+';
var eachInRegExp = `(${propertyRegExp})\\s+in\\s+(${propertyRegExp})`;
var keyValueEachInRegExp = `(${propertyRegExp})\\s*,\\s*${eachInRegExp}`;

// each="foo"
const PROPERTY_REG_EXP = new RegExp(`^${propertyRegExp}$`);

// each="foo in bar"
const EACH_IN_REG_EXP = new RegExp(`^${eachInRegExp}$`);

// each="i, foo in bar"
const KEY_VALUE_EACH_IN_REG_EXP = new RegExp(`^${keyValueEachInRegExp}$`);

function eachValueAs(itemName, prop, callback) {
  prop.forEach((val) => callback({[itemName]: val}));
}

function eachKeyValueAs(keyName, valueName, prop, compile) {
  for (let key in prop) {
    if (prop.hasOwnProperty(key)) {
      compile({
        [keyName]: key,
        [valueName]: prop[key]
      });
    }
  }
}

function compileLoop(element, scope) {
  let expression = element.getAttribute('each').trim();
  let keyValue = KEY_VALUE_EACH_IN_REG_EXP.exec(expression);
  let eachIn = EACH_IN_REG_EXP.exec(expression);
  let logicLess = PROPERTY_REG_EXP.exec(expression);
  let parent = element.parentElement;
  let getProp = (name) => scope[name] || [];

  let compile = (vars) => {
    let node = element.cloneNode(true);
    let childScope = new Scope(vars, scope, node);
    interpolate(node, childScope);
    parent.appendChild(node);
  };

  parent.removeChild(element);

  if (keyValue) {
    // key, value in array
    let [, keyName, valueName, propName] = keyValue;
    eachKeyValueAs(keyName, valueName, getProp(propName), compile);
  } else if (eachIn) {
    // value in array
    let [, itemName, propName] = eachIn;
    eachValueAs(itemName, getProp(propName), compile);
  } else if (logicLess) {
    // logic less looping
    getProp(expression).forEach(compile);
  } else {
    throw new SyntaxError(`Incorrect "each" expression: "${expression}"`);
  }
}

export function compile(root, scope) {
  let elements = root.querySelectorAll('[each]');
  for (let i = 0; i < elements.length; i++) {
    compileLoop(elements[i], scope);
  }
}
