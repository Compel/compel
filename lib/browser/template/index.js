import {compile as compileLoops} from './loops';
import {compile as interpolate} from './interpolation';

export function compile(tag) {
  let template = tag._template;
  let wrapper = document.createElement('div');
  wrapper.innerHTML = template;
  compileLoops(wrapper, tag.scope);
  interpolate(wrapper, tag.scope);
  return wrapper.innerHTML;
}
