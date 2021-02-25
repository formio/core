"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    type: 'datavalue',
    extends: 'html',
    template: function (ctx) {
        return "<" + ctx.tag + " ref=\"val\"" + ctx.attrs + ">" + ctx.value() + "</" + ctx.tag + ">";
    }
};
