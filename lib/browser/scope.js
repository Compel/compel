import {EventEmitter} from 'events';

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
    this.emit('update');
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
  }
}
