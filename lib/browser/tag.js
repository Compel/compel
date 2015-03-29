import {bind as bindTemplate} from './template';
import Scope from './scope';
import {uid, forEach} from './';

const DATA_COMPEL = 'data-compel';

export var registeredTags = {};
var tagsByID = {};

function mergeElementAttributesInto(root, opts) {
  let {attributes} = root;
  forEach(attributes, attribute => {
    let name = attribute.name.replace(/-([a-z])/g, g => g[1].toUpperCase());
    if (!opts[name]) opts[name] = attribute.value;
  });
}

export function mountTo(root, opts={}) {
  let name = root.tagName.toLowerCase();
  let createTag = registeredTags[name];
  if (createTag && !root.compel) {
    mergeElementAttributesInto(root, opts);
    return createTag(root, opts);
  }
}

export function mount(selector, opts={}, context=document) {
  let elements = context.querySelectorAll(selector);
  // let elements = context.querySelectorAll('*');
  if (elements.length) {
    let tags = [];
    forEach(elements, element => {
      let tag = mountTo(element, opts);
      if (tag) tags.push(tag);
    });
    return tags;
  } else {
    return [];
  }
}

export function registeredTagNames() {
  return Object.keys(registeredTags);
}

class Tag {
  constructor(root, template, opts) {
    this._id = uid();
    this.parent = undefined;
    this.children = [];
    this.root = root;
    this._template = template;
    this.scope = new Scope(opts, undefined, root);
    this.saveDoc();
    this.root.innerHTML = template;
    bindTemplate(this);
  }

  saveDoc() {
    this.doc = document.createElement('div');
    while (this.root.firstChild) this.doc.appendChild(this.root.firstChild);
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
    let tags = mount(registeredTagNames().join(','), {}, this.root);
    tags.forEach(tag => this.appendChild(tag));
  }
}

export function register(name, template, script) {
  registeredTags[name] = (root, opts) => {
    let tag = new Tag(root, template, opts);
    tagsByID[tag._id] = tag;
    root.compel = tag;
    root.setAttribute(DATA_COMPEL, tag._id);
    script(root, tag.scope);
    tag.scope.update();
    tag.hydrateChildren();
    return tag;
  };
}
