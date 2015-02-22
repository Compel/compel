import {compile as compileLoops} from './loops';
import {compile as interpolate} from './interpolation';

export function compile(tag) {
  let template = compileLoops(tag);
  template = interpolate(template, tag.scope);
  return template;
}
