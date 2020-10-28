export function isFunction(functionToCheck: any) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

export function firstLetterLowerCase(value: string) {
  return value.charAt(0).toLowerCase() + value.slice(1);
}