import {EventEmitter} from 'events';
import {forEach} from './';

const UPDATE = 'update';

export default class Scope extends EventEmitter {
  constructor(props, parent, element) {
    if (element) {
      element.setAttribute('data-scope', '');
    }
    forEach(props, (prop, key) => {
      this[key] = prop;
    }, this);
    this.parent = parent;
  }

  update(props) {
    let updated = [];
    forEach(props, (prop, key) => {
      this.setProperty(key, prop);
      updated.push(key);
    }, this);
    for (let key in this) {
      if (updated.indexOf(key) < 0 &&
         (key === 'parent' || !this.constructor.prototype[key])) {
        this.emit(`${key}.${UPDATE}`, this[key]);
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
