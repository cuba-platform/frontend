"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Simple im-memory storage compatible with localStorage/sessionStorage API.
 */
var DefaultStorage = /** @class */ (function () {
    function DefaultStorage() {
        this.items = {};
    }
    Object.defineProperty(DefaultStorage.prototype, "length", {
        get: function () {
            return Object.keys(this.items).length;
        },
        enumerable: true,
        configurable: true
    });
    DefaultStorage.prototype.clear = function () {
        this.items = {};
    };
    DefaultStorage.prototype.getItem = function (key) {
        return this.items[key];
    };
    /**
     * @deprecated operation not supported
     */
    DefaultStorage.prototype.key = function (index) {
        throw new Error('Unsupported operation');
    };
    DefaultStorage.prototype.removeItem = function (key) {
        delete this.items[key];
    };
    DefaultStorage.prototype.setItem = function (key, data) {
        this.items[key] = data;
    };
    return DefaultStorage;
}());
exports.DefaultStorage = DefaultStorage;
