import {forEach} from '../';
import {inScopeAsserter} from './scope';

function isEventListeningAttribute(attributeName) {
  return attributeName.substr(0, 2) === 'on';
}

function removeElementEventListener(element, attributeName) {
  element.removeAttribute(attributeName);
  delete element[attributeName];
}

function takeListeners(element, scope) {
  let listeners = [];
  let attributes = element.attributes;
  forEach(attributes, (attribute) => {
    let {name, value} = attribute;
    if (isEventListeningAttribute(name)) {
      removeElementEventListener(element, name);
      let eventName = name.substr(2);
      let listener = scope[value];
      if (listener && typeof listener === 'function') {
        listeners.push({
          name: eventName,
          listener: listener
        });
      }
    }
  });
  return listeners;
}

function addListeners(element, scope) {
  let listeners = takeListeners(element, scope);
  if (listeners.length) {
    forEach(listeners, (listener) => {
      element.addEventListener(listener.name, listener.listener);
    });
  }
}

export function attach(root, scope) {
  addListeners(root, scope);
  let elements = root.querySelectorAll('.bind-event');
  let assertInScope = inScopeAsserter(root);
  forEach(elements, (element) => {
    if (assertInScope(element)) addListeners(element, scope);
  });
}
