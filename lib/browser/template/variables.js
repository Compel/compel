const INTERPOLATION_REG_EXP = /\${([^}]+)}/g;

export function compile(template, scope) {
  return template.replace(INTERPOLATION_REG_EXP, (match, expression) => {
    let prop;
    expression = expression.replace(/([^\.a-z\$_])([a-z\$_]+)/ig, (match, char, propName) => {
      return `${char}scope.${propName}`;
    });
    try {
      prop = eval(`scope.${expression}`);
    } catch (e) {
      prop = match;
    }
    return prop;
  });
}
