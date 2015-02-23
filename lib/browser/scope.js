import {EventEmitter} from 'events';

const UPDATE = 'update';

export default class Scope extends EventEmitter {
  constructor(props, parent, element) {
    if (element) {
      element.setAttribute('data-scope', '');
    }
    for (let key in props) {
      if (props.hasOwnProperty(key)) {
        this[key] = props[key];
      }
    }
    this.parent = parent;
  }

  update(props) {
    for (let key in props) {
      this.setProperty(key, props[key]);
    }
    for (let key in this) {
      if (key === 'parent' || !this.constructor.prototype[key]) {
        this.setProperty(key, this[key]);
      }
    }
    this.emit(UPDATE);
  }

  hasProperty(name) {
    return this.hasOwnProperty(name) ||
          (this.parent && this.parent.hasProperty(name));
  }

  getProperty(name) {
    if (this.hasOwnProperty(name)) {
      return this[name];
    } else if (this.parent) {
      return this.parent.getProperty(name);
    }
  }

  setProperty(name, value) {
    if (this.hasOwnProperty(name)) {
      this[name] = value;
    } else if (this.parent && this.parent.hasProperty(name)) {
      this.parent.setProperty(name, value);
    } else {
      this[name] = value;
    }
    this.emit(`${name}.${UPDATE}`, value);
  }

  watch(name, callback) {
    this.on(`${name}.${UPDATE}`, callback);
  }

  stopWatching(name, callback) {
    this.removeListener(`${name}.${UPDATE}`, callback);
  }
}
