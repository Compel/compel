import * as plugins from './plugins';

export default class Tag {

  constructor(name, template, script) {
    this.template = template;
    this.name = name;
    this.script = script;
  }

  compile() {
    let n = this.name;
    let t = this.compileTemplate();
    let s = this.compileScript();
    return `scomp.Tag.register('${n}','${t}',function(tag,opts){${s}});`;
  }

  compileTemplate() {
    let template = this.template.trim().replace(/(\n|\r)/gm, ' '); // Remove new lines
    template = plugins.compileTemplate(template);
    return template
      .replace('\\', '\\\\') // Escape back slashes
      .replace("'", "\\'");  // Escape single quotes
  }

  compileScript() {
    return plugins.compileScript(this.script);
  }

}
