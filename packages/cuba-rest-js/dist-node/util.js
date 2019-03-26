"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function base64encode(str) {
    /* tslint:disable:no-string-literal */
    if (typeof btoa === 'function') {
        return btoa(str);
    }
    else if (global['Buffer']) { // prevent Buffer from being injected by browserify
        return new global['Buffer'](str).toString('base64');
    }
    else {
        throw new Error('Unable to encode to base64');
    }
    /* tslint:enable:no-string-literal */
}
exports.base64encode = base64encode;
function encodeGetParams(data) {
    return Object
        .keys(data)
        .map(function (key) {
        return encodeURIComponent(key) + "=" + (encodeURIComponent(serialize(data[key])));
    })
        .join("&");
}
exports.encodeGetParams = encodeGetParams;
function serialize(rawParam) {
    if (rawParam == null) {
        return '';
    }
    if (typeof rawParam === 'object') {
        return JSON.stringify(rawParam);
    }
    return rawParam;
}
