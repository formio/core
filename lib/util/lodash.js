"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    keys: function (obj) {
        return Object.keys(obj);
    },
    noop: function () { },
    get: function (obj, path, def) {
        var val = path.
            replace(/\[/g, '.').
            replace(/\]/g, '').
            split('.').
            reduce(function (o, k) { return (o || {})[k]; }, obj);
        return (typeof def !== 'undefined' &&
            typeof val === 'undefined') ? def : val;
    }
};
