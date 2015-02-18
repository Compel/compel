const INTERPOLATION_REG_EXP = /\${([^}]+)}/g;

export function compile(vars, template) {
  template = template || vars._template;
  return template.replace(INTERPOLATION_REG_EXP, (match, propName) => {
    propName = propName.trim();
    return vars.hasOwnProperty(propName) ? vars[propName] : match;
  });
}
