declare const Buffer;
declare const global;

export function base64encode(str: string): string {
  /* tslint:disable:no-string-literal */
  if (typeof btoa === 'function') {
    return btoa(str);
  } else if (global['Buffer']) { // prevent Buffer from being injected by browserify
    return new global['Buffer'](str).toString('base64');
  } else {
    throw new Error('Unable to encode to base64');
  }
  /* tslint:enable:no-string-literal */
}

export function encodeGetParams(data): string {
  return Object
    .keys(data)
    .map((key) => {
      return encodeURIComponent(key) + "=" + (encodeURIComponent(serialize(data[key])));
    })
    .join("&");
}

function serialize(rawParam): string {
  if (rawParam == null) {
    return '';
  }
  if (typeof rawParam === 'object') {
    return JSON.stringify(rawParam);
  }
  return rawParam;
}
