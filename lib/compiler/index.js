import {load as loadHTML} from 'cheerio';
import {readFile, writeFile} from 'fs';
import Tag from './tag';

function input(file) {
  return new Promise((resolve, reject) => {
    readFile(file, (err, content) => {
      if (err) {
        reject(err);
      } else {
        resolve(content);
      }
    });
  });
}

function registerBindAttributes($el) {
  for (let key in $el.get(0).attribs) {
    if (key.substr(0, 5) === 'bind-') {
      $el.addClass('bind-attribute');
    }
  }
}

function registerEventHandlers($el) {
  for (let key in $el.get(0).attribs) {
    if (key.substr(0, 2) === 'on') {
      $el.addClass('bind-event');
    }
  }
}

function createTag(doc, $) {
  let name = doc.get(0).tagName;
  let template = doc.find('> template');
  template.find('*').each((i, element) => {
    let $el = $(element);
    registerBindAttributes($el);
    registerEventHandlers($el);
  });
  let script = doc.find('> script');
  return new Tag(name, template.html(), script.text());
}

function createTags($) {
  let docs = $(':root');
  docs = docs.map((index, doc) => createTag($(doc), $));
  return Array.from(docs);
}

function compileTags(tags) {
  return tags.map((tag) => tag.compile());
}

function output(to) {
  return (contents) => {
    let content = contents.join('\n');
    return new Promise((resolve, reject) => {
      writeFile(to, content, (err) => err ? reject(err) : resolve());
    });
  };
}

export function compile(content, options={}) {
  let $ = loadHTML(content, options);
  let tags = createTags($);
  return compileTags(tags);
}

export function compileFile(file, to, options={}) {
  return input(file)
    .then((content) => compile(content, options))
    .then(output(to))
    .catch((error) => console.error(error.stack));
}
