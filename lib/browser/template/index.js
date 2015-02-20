import {compile as compileLoops} from './loops';
import {compile as compileVars} from './variables';

export function compile(tag) {
  let template = compileLoops(tag);
  template = compileVars(template, tag.scope);
  return template;
}
