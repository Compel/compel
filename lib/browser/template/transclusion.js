import {forEach} from '../';
import {bindElement} from './';

function transclude(element, tag) {
  let {doc} = tag;
  bindElement(doc, tag.scope);
  while (doc.firstChild) element.appendChild(doc.firstChild);
}

export default function (tag) {
  let transcludePositions = tag.root.querySelectorAll('[transclude]');
  forEach(transcludePositions, (it) => transclude(it, tag));
}
