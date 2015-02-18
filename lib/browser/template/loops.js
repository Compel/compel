import {compile as compileVars} from './variables';

var propertyRegExp = '[a-zA-Z0-9_\\$\\.]+';
var eachInRegExp = `(${propertyRegExp})\\s+in\\s+(${propertyRegExp})`;
var keyValueEachInRegExp = `(${propertyRegExp})\\s*,\\s*${eachInRegExp}`;

const PROPERTY_REG_EXP = new RegExp(`^${propertyRegExp}$`);
const EACH_IN_REG_EXP = new RegExp(`^${eachInRegExp}$`);
const KEY_VALUE_EACH_IN_REG_EXP = new RegExp(`^${keyValueEachInRegExp}$`);

function compileLogicLess(prop, compile) {
  prop.forEach((val) => compile(val));
}

function compileEachIn(itemName, prop, compile) {
  prop.forEach((val) => compile({[itemName]: val}));
}

function compileKeyValue(keyName, valueName, prop, compile) {
  for (let key in prop) {
    if (prop.hasOwnProperty(key)) {
      compile({
        [keyName]: key,
        [valueName]: prop[key]
      });
    }
  }
}

function compileLoop(tag, element) {
  let expression = element.getAttribute('each').trim();
  let keyValue = KEY_VALUE_EACH_IN_REG_EXP.exec(expression);
  let eachIn = EACH_IN_REG_EXP.exec(expression);
  let logicLess = PROPERTY_REG_EXP.exec(expression);
  let parent = element.parentElement;

  let compile = (vars) => {
    let node = element.cloneNode(true);
    node.innerHTML = compileVars(vars, node.innerHTML);
    parent.appendChild(node);
  };

  let getProp = (name) => {
    if (tag[name]) {
      return tag[name];
    } else {
      throw new Error(`Property "tag.${name}" doesn't exist`);
    }
  };

  parent.removeChild(element);

  if (keyValue) {
    // key, value in array
    compileKeyValue(keyValue[1], keyValue[2], getProp(keyValue[3]), compile);
  } else if (eachIn) {
    // value in array
    compileEachIn(eachIn[1], getProp(eachIn[2]), compile);
  } else if (logicLess) {
    // logic less looping
    compileLogicLess(getProp(expression), compile);
  } else {
    throw new SyntaxError(`Incorrect "each" expression: "${expression}"`);
  }
}

export function compile(tag, template) {
  template = template || tag._template;

  let wrapper = document.createElement('div');
  wrapper.innerHTML = template;

  let elements = wrapper.querySelectorAll('[each]');
  for (let i = 0; i < elements.length; i++) {
    compileLoop(tag, elements[i]);
  }

  return elements.length ? wrapper.innerHTML : template;
}
