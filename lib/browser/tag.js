import {EventEmitter} from 'events';
import {compile as compileTemplate} from './template';

var tags = {};

class Tag extends EventEmitter {
  constructor(root, template) {
    this.root = root;
    this._template = template;
  }

  update(props={}) {
    for (let propName in props) {
      if (props.hasOwnProperty(propName)) {
        this[propName] = props[propName];
      }
    }
    let template = compileTemplate(this);
    this.root.innerHTML = template;
  }
}

export default Tag;

export function register(name, template, script) {
  tags[name] = (root, opts) => {
    let tag = new Tag(root, template);
    script(tag, opts);
  };
}

function mergeElementAttributesInto(root, opts) {
  let {attributes} = root;
  for (let i = 0; i < attributes.length; i++) {
    let attribute = attributes[i];
    if (!opts[attribute.name]) {
      opts[attribute.name] = attribute.value;
    }
  }
}

export function mountTo(root, opts={}) {
  let name = root.tagName.toLowerCase();
  if (tags[name] && !root.scomp) {
    mergeElementAttributesInto(root, opts);
    root.scomp = true;
    return tags[name](root, opts);
  }
}

export function mount(name, opts) {
  let elements = document.querySelectorAll(name);
  if (elements.length) {
    for (let i = 0; i < elements.length; i++) {
      let element = elements[i];
      mountTo(element, opts);
    }
  }
}
