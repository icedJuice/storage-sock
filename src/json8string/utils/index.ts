export const isArray = (arg: any): boolean =>
  Array.isArray ? Array.isArray(arg) : arg instanceof Array;

const stringContains = (str: string, text: string) => {
  return str.indexOf(text) > -1;
};

export const isObject = (arg: any): boolean =>
  stringContains(Object.prototype.toString.call(arg), "Object");

export const isRegExp = (arg: any) => arg instanceof RegExp;

export const isString = (arg: any) => typeof arg === 'string';

export const isDate = (arg: any) => arg instanceof Date;

export const isFunction = (arg: any) => arg instanceof Function;

export const isUndefined = (arg: any) => arg === undefined;

export const isNull = (arg: any) => arg === null;

export const isNumber = (arg: any) => typeof arg === 'number';

export const isSymbol = (arg: any) => typeof arg === 'symbol';

export const types = {
    object: 'Object',
    string: 'String',
    regexp: 'RegExp',
    array: 'Array',
    date: 'Date',
    function: 'Function',
    null: 'Null',
    undefined: 'Undefined',
}

export const typeOf = (arg: any) => {
    if (isObject(arg)) {
        return 'object';
    }
}