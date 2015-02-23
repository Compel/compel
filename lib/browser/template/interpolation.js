const BIND = 'bind';

function compileElement(element, scope) {
  let expression = element.getAttribute(BIND);

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

  element.innerHTML = value;
}

function inChildScope(root, element) {
  let scopedElements = root.querySelectorAll('[data-scope]');
  for (let i = 0; i < scopedElements.length; i++) {
    if (scopedElements[i].contains(element)) {
      return true;
    }
  }
  return false;
}

export function compile(root, scope) {
  if (root.hasAttribute(BIND)) {
    compileElement(root, scope);
  } else {
    let elements = root.querySelectorAll(`[${BIND}]`);
    for (let i = 0; i < elements.length; i++) {
      let element = elements[i];
      if (!inChildScope(root, element)) {
        compileElement(element, scope);
      }
    }
  }
}
