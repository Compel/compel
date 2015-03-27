import {minify} from 'html-minifier';
import {add as addPlugin} from '../plugins';

export default {
  template: template => minify(template, {
    collapseWhitespace: true
  })
};
