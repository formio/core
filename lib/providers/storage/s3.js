"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var xhr_1 = __importDefault(require("./xhr"));
var s3 = function (formio) { return ({
    uploadFile: function (file, fileName, dir, progressCallback, url, options, fileKey, groupPermissions, groupId, abortCallback) {
        return xhr_1.default.upload(formio, 's3', function (xhr, response) {
            response.data.fileName = fileName;
            response.data.key = xhr_1.default.path([response.data.key, dir, fileName]);
            if (response.signed) {
                xhr.openAndSetHeaders('PUT', response.signed);
                xhr.setRequestHeader('Content-Type', file.type);
                return file;
            }
            else {
                var fd = new FormData();
                for (var key in response.data) {
                    fd.append(key, response.data[key]);
                }
                fd.append('file', file);
                xhr.openAndSetHeaders('POST', response.url);
                return fd;
            }
        }, file, fileName, dir, progressCallback, groupPermissions, groupId, abortCallback).then(function (response) {
            return {
                storage: 's3',
                name: fileName,
                bucket: response.bucket,
                key: response.data.key,
                url: xhr_1.default.path([response.url, response.data.key]),
                acl: response.data.acl,
                size: file.size,
                type: file.type
            };
        });
    },
    downloadFile: function (file) {
        if (file.acl !== 'public-read') {
            return formio.makeRequest('file', formio.formUrl + "/storage/s3?bucket=" + xhr_1.default.trim(file.bucket) + "&key=" + xhr_1.default.trim(file.key), 'GET');
        }
        else {
            return Promise.resolve(file);
        }
    }
}); };
s3.title = 'S3';
exports.default = s3;
