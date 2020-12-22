import * as base64 from 'base-64';

declare const global;
export function registerBase64() {
  if (!global.btoa) {
    global.btoa = base64.encode;
  }

  if (!global.atob) {
    global.atob = base64.decode;
  }
}

registerBase64();
