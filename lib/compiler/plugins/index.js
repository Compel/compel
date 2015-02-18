var plugins = new Set();

export var add = plugins.add.bind(plugins);
export var del = plugins.delete.bind(plugins);

export function compile(propName, something) {
  plugins.forEach((plugin) => {
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
