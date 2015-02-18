import {compile as compileVars} from './variables';

var propertyRegExp = '[a-zA-Z0-9_\\$\\.]+';
var eachInRegExp = `(${propertyRegExp})\\s+in\\s+(${propertyRegExp})`;
var keyValueEachInRegExp = `(${propertyRegExp})\\s*,\\s*${eachInRegExp}`;

const PROPERTY_REG_EXP = new RegExp(`^${propertyRegExp}$`);
const EACH_IN_REG_EXP = new RegExp(`^${eachInRegExp}$`);
const KEY_VALUE_EACH_IN_REG_EXP = new RegExp(`^${keyValueEachInRegExp}$`);

function compileLogicLess(prop, clone, append) {
  prop.forEach((val) => {
    let clonedNode = clone();
    clonedNode.innerHTML = compileVars(val, clonedNode.innerHTML);
    append(clonedNode);
  });
}

function compileEachIn(itemName, prop, clone, append) {
  prop.forEach((val) => {
    let clonedNode = clone();
    clonedNode.innerHTML = compileVars({
      [itemName]: val
    }, clonedNode.innerHTML);
    append(clonedNode);
  });
}

function compileKeyValue(keyName, valueName, prop, clone, append) {
  for (let key in prop) {
    if (prop.hasOwnProperty(key)) {
      let clonedNode = clone();
      clonedNode.innerHTML = compileVars({
        [keyName]: key,
        [valueName]: prop[key]
      }, clonedNode.innerHTML);
      append(clonedNode);
    }
  }
}

function compileLoop(tag, element) {
  let expression = element.getAttribute('each').trim();
  let keyValue = KEY_VALUE_EACH_IN_REG_EXP.exec(expression);
  let eachIn = EACH_IN_REG_EXP.exec(expression);
  let logicLess = PROPERTY_REG_EXP.exec(expression);
  let parent = element.parentElement;
  let append = (node) => parent.appendChild(node);
  let clone = () => element.cloneNode(true);

  let getProp = (name) => {
    if (tag[name]) {
      return tag[name];
    } else {
      throw new Error(`Property "tag.${name}" doesn't exist`);
    }
  }

  parent.removeChild(element);

  if (keyValue) {
    compileKeyValue(keyValue[1], keyValue[2], getProp(keyValue[3]), clone, append);
  } else if (eachIn) {
    compileEachIn(eachIn[1], getProp(eachIn[2]), clone, append);
  } else if (logicLess) {
    compileLogicLess(getProp(expression), clone, append);
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
