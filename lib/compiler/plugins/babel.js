import {transform} from 'babel';
import {add as addPlugin} from '../plugins';

export default {
  script: script => transform(script).code
};
