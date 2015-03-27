import requireDir from 'require-dir';

var plugins = new Set();

export let add = plugins.add.bind(plugins);
export let del = plugins.delete.bind(plugins);

export function compile(propName, something) {
  plugins.forEach(plugin => {
    if (plugin[propName]) {
      something = plugin[propName](something);
    }
  });
  return something;
}

export function compileTemplate(template) {
  return compile('template', template);
}

export function compileScript(script) {
  return compile('script', script);
}

export let inHouse = requireDir('./');
