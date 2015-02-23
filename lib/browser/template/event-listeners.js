function getListeners(element, scope) {
  let listeners = [];
  let attributes = element.attributes;
  for (var i = 0; i < attributes.length; i++) {
    let attribute = attributes[i];
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
  }
  return listeners;
}

function addListeners(element, scope) {
  let listeners = getListeners(element, scope);
  if (listeners.length) {
    listeners.forEach((listener) => {
      element.addEventListener(listener.name, listener.listener);
    });
  }
}

export function compile(root, scope) {
  addListeners(root);
  let elements = root.querySelectorAll('*');
  for (let i = 0; i < elements.length; i++) {
    addListeners(elements[i], scope);
  }
}
