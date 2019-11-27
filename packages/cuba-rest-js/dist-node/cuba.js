"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var storage_1 = require("./storage");
var util_1 = require("./util");
var semver = require("semver");
__export(require("./model"));
__export(require("./storage"));
var apps = [];
/**
 * Initializes app.
 * @param {AppConfig} config
 * @returns {CubaApp}
 */
function initializeApp(config) {
    if (config === void 0) { config = {}; }
    if (getApp(config.name) != null) {
        throw new Error("Cuba app is already initialized");
    }
    var cubaApp = new CubaApp(config.name, config.apiUrl, config.restClientId, config.restClientSecret, config.defaultLocale, config.storage, config.apiVersion);
    apps.push(cubaApp);
    return cubaApp;
}
exports.initializeApp = initializeApp;
/**
 * Retrieve previously initialized app by name.
 * @param {string} appName
 * @returns {CubaApp | null}
 */
function getApp(appName) {
    var nameToSearch = appName == null ? "" : appName;
    for (var _i = 0, apps_1 = apps; _i < apps_1.length; _i++) {
        var app = apps_1[_i];
        if (app.name === nameToSearch) {
            return app;
        }
    }
    return null;
}
exports.getApp = getApp;
function removeApp(appName) {
    var app = getApp(appName);
    if (!app) {
        throw new Error('App is not found');
    }
    app.cleanup();
    apps.splice(apps.indexOf(app), 1);
}
exports.removeApp = removeApp;
var CubaApp = /** @class */ (function () {
    function CubaApp(name, apiUrl, restClientId, restClientSecret, defaultLocale, storage, apiVersion) {
        if (name === void 0) { name = ""; }
        if (apiUrl === void 0) { apiUrl = "/app/rest/"; }
        if (restClientId === void 0) { restClientId = "client"; }
        if (restClientSecret === void 0) { restClientSecret = "secret"; }
        if (defaultLocale === void 0) { defaultLocale = "en"; }
        if (storage === void 0) { storage = new storage_1.DefaultStorage(); }
        this.name = name;
        this.apiUrl = apiUrl;
        this.restClientId = restClientId;
        this.restClientSecret = restClientSecret;
        this.defaultLocale = defaultLocale;
        this.storage = storage;
        this.apiVersion = apiVersion;
        this.tokenExpiryListeners = [];
        this.messagesLoadingListeners = [];
        this.enumsLoadingListeners = [];
        this.localeChangeListeners = [];
    }
    Object.defineProperty(CubaApp.prototype, "restApiToken", {
        get: function () {
            return this.storage.getItem(this.name + "_" + CubaApp.REST_TOKEN_STORAGE_KEY);
        },
        set: function (token) {
            this.storage.setItem(this.name + "_" + CubaApp.REST_TOKEN_STORAGE_KEY, token);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CubaApp.prototype, "locale", {
        get: function () {
            var storedLocale = this.storage.getItem(this.name + "_" + CubaApp.LOCALE_STORAGE_KEY);
            return storedLocale ? storedLocale : this.defaultLocale;
        },
        set: function (locale) {
            var _this = this;
            this.storage.setItem(this.name + "_" + CubaApp.LOCALE_STORAGE_KEY, locale);
            this.localeChangeListeners.forEach(function (l) { return l(_this.locale); });
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Logs in user and stores token in provided storage.
     * @param {string} login
     * @param {string} password
     * @param {LoginOptions} options You can use custom endpoints e.g. {tokenEndpoint:'ldap/token'}.
     * @returns {Promise<{access_token: string}>}
     */
    CubaApp.prototype.login = function (login, password, options) {
        var _this = this;
        if (login == null) {
            login = "";
        }
        if (password == null) {
            password = "";
        }
        var fetchOptions = {
            method: "POST",
            headers: this._getBasicAuthHeaders(),
            body: "grant_type=password&username=" + encodeURIComponent(login) + "&password=" + encodeURIComponent(password),
        };
        var endpoint = options && options.tokenEndpoint ? options.tokenEndpoint : 'oauth/token';
        var loginRes = fetch(this.apiUrl + "v2/" + endpoint, fetchOptions)
            .then(this.checkStatus)
            .then(function (resp) { return resp.json(); })
            .then(function (data) {
            _this.restApiToken = data.access_token;
            return data;
        });
        return loginRes;
    };
    CubaApp.prototype.logout = function () {
        return this.revokeToken(this.restApiToken);
    };
    CubaApp.prototype.revokeToken = function (token) {
        var fetchOptions = {
            method: 'POST',
            headers: this._getBasicAuthHeaders(),
            body: 'token=' + encodeURIComponent(token),
        };
        this.clearAuthData();
        return fetch(this.apiUrl + 'v2/oauth/revoke', fetchOptions).then(this.checkStatus);
    };
    CubaApp.prototype.loadEntities = function (entityName, options, fetchOptions) {
        return this.fetch('GET', 'v2/entities/' + entityName, options, __assign({ handleAs: 'json' }, fetchOptions));
    };
    CubaApp.prototype.loadEntitiesWithCount = function (entityName, options, fetchOptions) {
        var count;
        var optionsWithCount = __assign({}, options, { returnCount: true });
        return this.fetch('GET', "v2/entities/" + entityName, optionsWithCount, __assign({ handleAs: 'raw' }, fetchOptions))
            .then(function (response) {
            count = parseInt(response.headers.get('X-Total-Count'), 10);
            return response.json();
        }).then(function (result) { return ({ result: result, count: count }); });
    };
    CubaApp.prototype.searchEntities = function (entityName, entityFilter, options, fetchOptions) {
        var data = __assign({}, options, { filter: entityFilter });
        return this.fetch('GET', 'v2/entities/' + entityName + '/search', data, __assign({ handleAs: 'json' }, fetchOptions));
    };
    CubaApp.prototype.searchEntitiesWithCount = function (entityName, entityFilter, options, fetchOptions) {
        var count;
        var optionsWithCount = __assign({}, options, { filter: entityFilter, returnCount: true });
        return this.fetch('GET', 'v2/entities/' + entityName + '/search', optionsWithCount, __assign({ handleAs: 'raw' }, fetchOptions)).then(function (response) {
            count = parseInt(response.headers.get('X-Total-Count'), 10);
            return response.json();
        }).then(function (result) { return ({ result: result, count: count }); });
    };
    CubaApp.prototype.loadEntity = function (entityName, id, options, fetchOptions) {
        return this.fetch('GET', 'v2/entities/' + entityName + '/' + id, options, __assign({ handleAs: 'json' }, fetchOptions));
    };
    CubaApp.prototype.deleteEntity = function (entityName, id, fetchOptions) {
        return this.fetch('DELETE', 'v2/entities/' + entityName + '/' + id, null, fetchOptions);
    };
    CubaApp.prototype.commitEntity = function (entityName, entity, fetchOptions) {
        if (entity.id) {
            return this.fetch('PUT', 'v2/entities/' + entityName + '/' + entity.id, JSON.stringify(entity), __assign({ handleAs: 'json' }, fetchOptions));
        }
        else {
            return this.fetch('POST', 'v2/entities/' + entityName, JSON.stringify(entity), __assign({ handleAs: 'json' }, fetchOptions));
        }
    };
    CubaApp.prototype.invokeService = function (serviceName, methodName, params, fetchOptions) {
        var serializedParams = params != null ? JSON.stringify(params) : null;
        return this.fetch('POST', 'v2/services/' + serviceName + '/' + methodName, serializedParams, fetchOptions);
    };
    CubaApp.prototype.query = function (entityName, queryName, params, fetchOptions) {
        return this.fetch('GET', 'v2/queries/' + entityName + '/' + queryName, params, __assign({ handleAs: 'json' }, fetchOptions));
    };
    CubaApp.prototype.queryWithCount = function (entityName, queryName, params, fetchOptions) {
        var count;
        var paramsWithCount = __assign({}, params, { returnCount: true });
        return this.fetch('GET', "v2/queries/" + entityName + "/" + queryName, paramsWithCount, __assign({ handleAs: 'raw' }, fetchOptions))
            .then(function (response) {
            count = parseInt(response.headers.get('X-Total-Count'), 10);
            return response.json();
        })
            .then(function (result) { return ({ result: result, count: count }); });
    };
    CubaApp.prototype.queryCount = function (entityName, queryName, params, fetchOptions) {
        return this.fetch('GET', 'v2/queries/' + entityName + '/' + queryName + '/count', params, fetchOptions);
    };
    CubaApp.prototype.loadMetadata = function (fetchOptions) {
        return this.fetch('GET', 'v2/metadata/entities', null, __assign({ handleAs: 'json' }, fetchOptions));
    };
    CubaApp.prototype.loadEntityMetadata = function (entityName, fetchOptions) {
        return this.fetch('GET', 'v2/metadata/entities' + '/' + entityName, null, __assign({ handleAs: 'json' }, fetchOptions));
    };
    CubaApp.prototype.loadEntityViews = function (entityName, fetchOptions) {
        return this.fetch('GET', 'v2/metadata/entities/' + entityName + '/views', null, __assign({ handleAs: 'json' }, fetchOptions));
    };
    CubaApp.prototype.loadEntityView = function (entityName, viewName, fetchOptions) {
        return this.fetch('GET', 'v2/metadata/entities/' + entityName + '/views/' + viewName + '/', null, __assign({ handleAs: 'json' }, fetchOptions));
    };
    CubaApp.prototype.loadEntitiesMessages = function (fetchOptions) {
        var _this = this;
        var fetchRes = this.fetch('GET', 'v2/messages/entities', null, __assign({ handleAs: 'json' }, fetchOptions));
        fetchRes.then(function (messages) {
            _this.messagesCache = messages;
            _this.messagesLoadingListeners.forEach(function (l) { return l(messages); });
        });
        return fetchRes;
    };
    CubaApp.prototype.loadEnums = function (fetchOptions) {
        var _this = this;
        var fetchRes = this.fetch('GET', 'v2/metadata/enums', null, __assign({ handleAs: 'json' }, fetchOptions));
        fetchRes.then(function (enums) {
            _this.enumsCache = enums;
            _this.enumsLoadingListeners.forEach(function (l) { return l(enums); });
        });
        return fetchRes;
    };
    CubaApp.prototype.getPermissions = function (fetchOptions) {
        return this.fetch('GET', 'v2/permissions', null, __assign({ handleAs: 'json' }, fetchOptions));
    };
    CubaApp.prototype.getRoles = function (fetchOptions) {
        return this.fetch('GET', 'v2/roles', null, __assign({ handleAs: 'json' }, fetchOptions));
    };
    CubaApp.prototype.getUserInfo = function (fetchOptions) {
        return this.fetch('GET', 'v2/userInfo', null, __assign({ handleAs: 'json' }, fetchOptions));
    };
    CubaApp.prototype.getFileUploadURL = function () {
        return this.apiUrl + 'v2/files';
    };
    CubaApp.prototype.getFile = function (id, fetchOptions) {
        return this.fetch('GET', 'v2/files/' + id, null, __assign({ handleAs: 'blob' }, fetchOptions));
    };
    CubaApp.prototype.fetch = function (method, path, data, fetchOptions) {
        var _this = this;
        var url = this.apiUrl + path;
        var settings = __assign({ method: method, headers: {
                "Accept-Language": this.locale,
            } }, fetchOptions);
        if (this.restApiToken) {
            settings.headers["Authorization"] = "Bearer " + this.restApiToken;
        }
        if (method === 'POST' || method === 'PUT') {
            settings.body = data;
            settings.headers["Content-Type"] = "application/json; charset=UTF-8";
        }
        if (method === 'GET' && data && Object.keys(data).length > 0) {
            url += '?' + util_1.encodeGetParams(data);
        }
        var handleAs = fetchOptions ? fetchOptions.handleAs : undefined;
        switch (handleAs) {
            case "text":
                settings.headers["Accept"] = "text/html";
                break;
            case "json":
                settings.headers["Accept"] = "application/json";
                break;
        }
        var fetchRes = fetch(url, settings).then(this.checkStatus);
        fetchRes.catch(function (error) {
            if (_this.isTokenExpiredResponse(error.response)) {
                _this.clearAuthData();
                _this.tokenExpiryListeners.forEach(function (l) { return l(); });
            }
        });
        return fetchRes.then(function (resp) {
            if (resp.status === 204) {
                return resp.text();
            }
            switch (handleAs) {
                case "text":
                    return resp.text();
                case "blob":
                    return resp.blob();
                case "json":
                    return resp.json();
                case "raw":
                    return resp;
                default:
                    return resp.text();
            }
        });
    };
    CubaApp.prototype.onLocaleChange = function (c) {
        var _this = this;
        this.localeChangeListeners.push(c);
        return function () { return _this.localeChangeListeners.splice(_this.localeChangeListeners.indexOf(c), 1); };
    };
    CubaApp.prototype.onTokenExpiry = function (c) {
        var _this = this;
        this.tokenExpiryListeners.push(c);
        return function () { return _this.tokenExpiryListeners.splice(_this.tokenExpiryListeners.indexOf(c), 1); };
    };
    CubaApp.prototype.onEnumsLoaded = function (c) {
        var _this = this;
        this.enumsLoadingListeners.push(c);
        return function () { return _this.enumsLoadingListeners.splice(_this.enumsLoadingListeners.indexOf(c), 1); };
    };
    CubaApp.prototype.onMessagesLoaded = function (c) {
        var _this = this;
        this.messagesLoadingListeners.push(c);
        return function () { return _this.messagesLoadingListeners.splice(_this.messagesLoadingListeners.indexOf(c), 1); };
    };
    CubaApp.prototype.cleanup = function () {
        this.storage.clear();
    };
    /**
     * @since 7.2.0
     */
    CubaApp.prototype.setSessionLocale = function () {
        var _this = this;
        return this.requestIfSupported('7.2.0', function () { return _this.fetch('PUT', 'v2/user-session/locale'); });
    };
    /**
     * Returns REST API version number without performing side effects
     *
     * @returns REST API version number
     */
    CubaApp.prototype.getApiVersion = function (fetchOptions) {
        return this.fetch('GET', 'v2/version', null, __assign({ handleAs: 'text' }, fetchOptions));
    };
    /**
     * Updates stored REST API version number (which is used in feature detection mechanism)
     * with a value acquired by requesting version endpoint, and returns an updated value.
     *
     * @returns REST API version number
     */
    CubaApp.prototype.refreshApiVersion = function () {
        var _this = this;
        return this.getApiVersion().then(function (version) {
            _this.apiVersion = version;
            return _this.apiVersion;
        }).catch(function (err) {
            if (err && err.response && err.response.status === 404) {
                // REST API doesn't have a version endpoint
                _this.apiVersion = '0';
                return _this.apiVersion;
            }
            else {
                throw err;
            }
        });
    };
    CubaApp.prototype.requestIfSupported = function (minVersion, requestCallback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isFeatureSupported(minVersion)];
                    case 1:
                        if (_a.sent()) {
                            return [2 /*return*/, requestCallback()];
                        }
                        else {
                            return [2 /*return*/, Promise.reject(CubaApp.NOT_SUPPORTED_BY_API_VERSION)];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CubaApp.prototype.isFeatureSupported = function (minVersion) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.apiVersion) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.refreshApiVersion()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, matchesVersion(this.apiVersion, minVersion)];
                }
            });
        });
    };
    CubaApp.prototype.isTokenExpiredResponse = function (resp) {
        return resp && resp.status === 401;
        // && resp.responseJSON
        // && resp.responseJSON.error === 'invalid_token';
    };
    CubaApp.prototype._getBasicAuthHeaders = function () {
        return getBasicAuthHeaders(this.restClientId, this.restClientSecret, this.locale);
    };
    CubaApp.prototype.checkStatus = function (response) {
        if (response.status >= 200 && response.status < 300) {
            return response;
        }
        else {
            return Promise.reject({ message: response.statusText, response: response });
        }
    };
    CubaApp.prototype.clearAuthData = function () {
        this.storage.removeItem(this.name + "_" + CubaApp.REST_TOKEN_STORAGE_KEY);
        this.storage.removeItem(this.name + "_" + CubaApp.USER_NAME_STORAGE_KEY);
    };
    CubaApp.NOT_SUPPORTED_BY_API_VERSION = 'Not supported by current REST API version';
    CubaApp.REST_TOKEN_STORAGE_KEY = "cubaAccessToken";
    CubaApp.USER_NAME_STORAGE_KEY = "cubaUserName";
    CubaApp.LOCALE_STORAGE_KEY = "cubaLocale";
    return CubaApp;
}());
exports.CubaApp = CubaApp;
function getBasicAuthHeaders(client, secret, locale) {
    if (locale === void 0) { locale = 'en'; }
    return {
        "Accept-Language": locale,
        "Authorization": "Basic " + util_1.base64encode(client + ':' + secret),
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    };
}
exports.getBasicAuthHeaders = getBasicAuthHeaders;
function matchesVersion(versionToTest, versionToMatch) {
    var semverToTest = semver.coerce(versionToTest);
    if (!semverToTest) {
        // versionToTest cannot be converted to semver
        return false;
    }
    var semverToMatch = semver.coerce(versionToMatch);
    if (!semverToMatch) {
        // versionToMatch cannot be converted to semver
        throw new Error("Cannot determine required REST API version: value " + versionToMatch + " cannot be converted to semver");
    }
    return semver.gte(semverToTest, semverToMatch);
}
exports.matchesVersion = matchesVersion;
