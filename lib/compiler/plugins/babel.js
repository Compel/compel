import {transform} from 'babel';
import {add as addPlugin} from '../plugins';

addPlugin({
  script: (script) => transform(script).code
});
