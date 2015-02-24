import {forEach} from '../';

function getListeners(element, scope) {
  let listeners = [];
  let attributes = element.attributes;
  forEach(attributes, (attribute) => {
    let attributeName = attribute.name;
    if (attributeName.substr(0, 2) === 'on') {
      let eventName = attributeName.substr(2);
      let listenerName = attribute.value;
      let listener = scope[listenerName];
      element.removeAttribute(attributeName);
      delete element[attributeName];
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
  let listeners = getListeners(element, scope);
  if (listeners.length) {
    forEach(listeners, (listener) => {
      element.addEventListener(listener.name, listener.listener);
    });
  }
}

export function attach(root, scope) {
  addListeners(root);
  let elements = root.querySelectorAll('*');
  forEach(elements, (element) => addListeners(element, scope));
}
