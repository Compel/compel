import * as tag from './tag';

export {tag};

export const IE8 = typeof html5 !== 'undefined';

export function load() {
  let eventName = IE8 ? 'DOMContentLoaded' : 'readystatechange';
  document.addEventListener(eventName, () => {
    for (let tagName in tag.registeredTags) {
      tag.mount(tagName);
    }
  });
}

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
