import {bind as bindTemplate} from './template';
import Scope from './scope';
import {uid, forEach} from './';

const DATA_SCOMP = 'data-scomp';

export var registeredTags = {};
var tagsByID = {};

function mergeElementAttributesInto(root, opts) {
  let {attributes} = root;
  forEach(attributes, (attribute) => {
    if (!opts[attribute.name]) {
      opts[attribute.name] = attribute.value;
    }
  });
}

export function mountTo(root, opts={}) {
  let name = root.tagName.toLowerCase();
  let createTag = registeredTags[name];
  if (createTag && !root.scomp) {
    mergeElementAttributesInto(root, opts);
    return createTag(root, opts);
  }
}

export function mount(selector, opts, context=document) {
  let elements = context.querySelectorAll(selector);
  if (elements.length) {
    let tags = [];
    forEach(elements, (element) => {
      let tag = mountTo(element, opts);
      if (tag) tags.push(tag);
    });
    return tags;
  }
}

class Tag {
  constructor(root, template, opts) {
    this._id = uid();
    this.parent = undefined;
    this.children = [];
    this.root = root;
    this._template = template;
    this.scope = new Scope(opts, undefined, root);
    this.root.innerHTML = template;
    bindTemplate(this);
    this.hydrateChildren();
  }

  appendChild(child) {
    this.children.push(child);
    child.setParent(this);
  }

  setParent(parentTag) {
    this.parent = parentTag;
    this.scope.parentScope = parentTag.scope;
  }

  hydrateChildren() {
    let tags = mount('*', {}, this.root);
    tags.forEach((tag) => this.appendChild(tag));
  }
}

export function register(name, template, script) {
  registeredTags[name] = (root, opts) => {
    let tag = new Tag(root, template, opts);
    tagsByID[tag._id] = tag;
    root.scomp = tag;
    root.setAttribute(DATA_SCOMP, tag._id);
    script(root, tag.scope);
    tag.scope.update();
    return tag;
  };

  if (typeof html5 !== 'undefined') {
    html5.addElements(name);
  }
}
