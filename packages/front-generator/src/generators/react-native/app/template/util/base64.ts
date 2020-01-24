import * as base64 from 'base-64';

declare const global;
export function registerBase64() {
  global.btoa = base64.encode;
  global.atob = base64.decode;
}

registerBase64();
