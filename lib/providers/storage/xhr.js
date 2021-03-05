"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setXhrHeaders = void 0;
var lodash_1 = require("../../util/lodash");
var setXhrHeaders = function (formio, xhr) {
    var headers = formio.options.headers;
    if (headers) {
        var ValidHeaders = {
            'Content-Disposition': true,
        };
        for (var header in headers) {
            if (ValidHeaders[header]) {
                xhr.setRequestHeader(header, headers[header]);
            }
        }
    }
};
exports.setXhrHeaders = setXhrHeaders;
var XHR = {
    trim: function (text) {
        return lodash_1.trim(text, '/');
    },
    path: function (items) {
        return items.filter(function (item) { return !!item; }).map(XHR.trim).join('/');
    },
    upload: function (formio, type, xhrCb, file, fileName, dir, progressCallback, groupPermissions, groupId, abortCallback) {
        return new Promise((function (resolve, reject) {
            // Send the pre response to sign the upload.
            var pre = new XMLHttpRequest();
            // This only fires on a network error.
            pre.onerror = function (err) {
                err.networkError = true;
                reject(err);
            };
            pre.onabort = reject;
            pre.onload = function () {
                if (pre.status >= 200 && pre.status < 300) {
                    var response_1 = JSON.parse(pre.response);
                    // Send the file with data.
                    var xhr_1 = new XMLHttpRequest();
                    if (typeof progressCallback === 'function') {
                        xhr_1.upload.onprogress = progressCallback;
                    }
                    if (typeof abortCallback === 'function') {
                        abortCallback(function () { return xhr_1.abort(); });
                    }
                    xhr_1.openAndSetHeaders = function (method, url, async, user, password) {
                        if (async === void 0) { async = true; }
                        if (user === void 0) { user = null; }
                        if (password === void 0) { password = null; }
                        xhr_1.open(method, url, async, user, password);
                        exports.setXhrHeaders(formio, xhr_1);
                    };
                    // Fire on network error.
                    xhr_1.onerror = function (err) {
                        err.networkError = true;
                        reject(err);
                    };
                    // Fire on network abort.
                    xhr_1.onabort = function (err) {
                        err.networkError = true;
                        reject(err);
                    };
                    // Fired when the response has made it back from the server.
                    xhr_1.onload = function () {
                        if (xhr_1.status >= 200 && xhr_1.status < 300) {
                            resolve(response_1);
                        }
                        else {
                            reject(xhr_1.response || 'Unable to upload file');
                        }
                    };
                    // Set the onabort error callback.
                    xhr_1.onabort = reject;
                    // Get the request and send it to the server.
                    xhr_1.send(xhrCb(xhr_1, response_1));
                }
                else {
                    reject(pre.response || 'Unable to sign file');
                }
            };
            pre.open('POST', formio.formUrl + "/storage/" + type);
            pre.setRequestHeader('Accept', 'application/json');
            pre.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
            var token = formio.getToken();
            if (token) {
                pre.setRequestHeader('x-jwt-token', token);
            }
            pre.send(JSON.stringify({
                name: XHR.path([dir, fileName]),
                size: file.size,
                type: file.type,
                groupPermissions: groupPermissions,
                groupId: groupId,
            }));
        }));
    }
};
exports.default = XHR;
