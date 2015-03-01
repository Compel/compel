import * as tag from './tag';

export {tag};

export const IE8 = typeof html5 !== 'undefined';

export function load() {
  let eventName = IE8 ? 'DOMContentLoaded' : 'readystatechange';
  document.addEventListener(eventName, () => {
    tag.mount(tag.registeredTagNames().join(','));
  });
}

var uidPlacement = 0;

export function uid() {
  uidPlacement++;
  return `compel-${uidPlacement}`;
}

export function uidFor(element) {
  if (!element.id) {
    element.id = uid();
  }
  return element.id;
}

export function forEach(arr, callback, context=arr) {
  if (typeof arr === 'object') {
    if (typeof arr.length === 'undefined') {
      for (let key in arr) {
        if (arr.hasOwnProperty(key) &&
            callback.call(context, arr[key], key) === false) {
          break;
        }
      }
    } else {
      for (let i = 0; i < arr.length; i++) {
        if (callback.call(context, arr[i], i) === false) {
          break;
        }
      }
    }
  }
}
