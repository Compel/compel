import {register as registerTemplate} from './template';
import Scope from './scope';

const DATA_SCOMP = 'data-scomp';

var registeredTags = {};
var tagsByID = {};
var uidPlacement = 0;

export function uid() {
  uidPlacement++;
  return `scomp-${uidPlacement}`;
}

export function uidFor(element) {
  if (!element.id) {
    element.id = uid();
  }
  return element.id;
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
    for (let i = 0; i < elements.length; i++) {
      let tag = mountTo(elements[i], opts);
      if (tag) tags.push(tag);
    }
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
    registerTemplate(this);
    this._hydrateChildren();
  }

  appendChild(child) {
    this.children.push(child);
    child.setParent(this);
  }

  setParent(parentTag) {
    this.parent = parentTag;
    this.scope.parentScope = parentTag.scope;
  }

  _refreshChildren() {
    let children = this.root.querySelectorAll(`[${DATA_SCOMP}]`);
    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      let tag = tagsByID[child.getAttribute(DATA_SCOMP)];
      if (tag) tag.update();
    }
  }

  _hydrateChildren() {
    let tags = mount('*', {}, this.root);
    if (tags.length) {
      tags.forEach((tag) => this.appendChild(tag));
      this._template = this.root.innerHTML;
    }
  }
}

export function register(name, template, script) {
  registeredTags[name] = (root, opts) => {
    let tag = new Tag(root, template, opts);
    tagsByID[tag._id] = tag;
    root.scomp = tag;
    root.setAttribute(DATA_SCOMP, tag._id);
    script(tag.root, tag.scope);
    tag.scope.update();
    return tag;
  };
}
