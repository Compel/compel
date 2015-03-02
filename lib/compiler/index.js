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

function createTag(doc) {
  let name = doc.get(0).tagName;
  let template = doc.find('> template').html();
  let script = doc.find('> script').text();
  return new Tag(name, template, script);
}

function createTags($) {
  let docs = $(':root');
  docs = docs.map((index, doc) => createTag($(doc)));
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

export function parse(content, options={}) {
  let $ = loadHTML(content, options);
  let tags = createTags($);
  return compileTags(tags);
}

export function parseFile(file, to, options={}) {
  return input(file)
    .then((content) => parse(content, options))
    .then(output(to))
    .catch((error) => console.error(error.stack));
}
