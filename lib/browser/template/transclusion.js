export default function (tag) {
  let {doc} = tag;
  let transcludePosition = tag.root.querySelector('[transclude]');
  while (doc.firstChild) transcludePosition.appendChild(doc.firstChild);
}
