"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Template = void 0;
var Template = /** @class */ (function () {
    function Template(templates) {
        this.templates = templates;
    }
    Template.prototype.render = function (name, ctx, mode) {
        if (mode === void 0) { mode = 'html'; }
        if (this.templates[name] && this.templates[name][mode]) {
            return this.templates[name][mode](ctx);
        }
        if (typeof name === 'function') {
            return name(ctx);
        }
        return 'Unknown template';
    };
    return Template;
}());
exports.Template = Template;
