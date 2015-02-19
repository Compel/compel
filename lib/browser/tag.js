import {compile as compileTemplate} from './template';

var registeredTags = {};
var tagsByID = {};
var uid = 0;

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
  constructor(root, template) {
    this._id = Tag.uid();
    this.parent = undefined;
    this.children = [];
    this.root = root;
    this._template = template;
    this.root.innerHTML = template;
    this._hydrateChildren();
  }

  appendChild(child) {
    this.children.push(child);
    child.parent = this;
  }

  _detachFromDOM() {
    let root = this.root;
    let parent = root.parent;
    parent.removeChild(root);
  }

  _refreshChildren() {
    let children = this.root.querySelectorAll('[data-scomp]');
    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      let childContainer = child.parentElement;
      let tag = tagsByID[child.getAttribute('data-scomp')];
      if (tag) {
        childContainer.replaceChild(tag.root, child);
        tag.update();
      }
    }
  }

  _hydrateChildren() {
    let tags = mount('*', {}, this.root);
    if (tags.length) {
      tags.forEach((tag) => this.appendChild(tag));
      this._template = this.root.innerHTML;
    }
  }

  update(props={}) {
    for (let propName in props) {
      if (props.hasOwnProperty(propName)) {
        this[propName] = props[propName];
      }
    }
    let template = compileTemplate(this);
    this.root.innerHTML = template;
    this._refreshChildren();
  }
}

Tag.uid = function () {
  uid++;
  return uid;
};

export default Tag;

export function register(name, template, script) {
  registeredTags[name] = (root, opts) => {
    let tag = new Tag(root, template);
    tagsByID[tag._id] = tag;
    root.scomp = tag;
    root.setAttribute('data-scomp', tag._id);
    script(tag, opts);
    tag.update();
    return tag;
  };
}
