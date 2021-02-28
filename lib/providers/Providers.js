"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var storage_1 = __importDefault(require("./storage"));
var util_1 = require("../util/util");
var Providers = /** @class */ (function () {
    function Providers() {
    }
    Providers.addProvider = function (type, name, provider) {
        Providers.providers[type] = Providers.providers[type] || {};
        Providers.providers[type][name] = provider;
    };
    Providers.addProviders = function (type, providers) {
        Providers.providers[type] = util_1.merge(Providers.providers[type], providers);
    };
    Providers.getProvider = function (type, name) {
        if (Providers.providers[type] && Providers.providers[type][name]) {
            return Providers.providers[type][name];
        }
    };
    Providers.getProviders = function (type) {
        if (Providers.providers[type]) {
            return Providers.providers[type];
        }
    };
    Providers.providers = {
        storage: storage_1.default,
    };
    return Providers;
}());
exports.default = Providers;
