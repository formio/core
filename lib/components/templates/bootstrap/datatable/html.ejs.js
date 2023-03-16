Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default=function(ctx) {
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
__p += '<table class="table' +
((__t = ( ctx.classes )) == null ? '' : __t) +
'">\n    <thead>\n        <tr>\n            ';
 ctx.component.components.forEach(function(comp) { ;
__p += '\n                <th>' +
((__t = ( comp.label || comp.key )) == null ? '' : __t) +
'</th>\n            ';
 }); ;
__p += '\n        </tr>\n    </thead>\n    <tbody>\n        ';
 ctx.instance.rows.forEach(function(row) { ;
__p += '\n            <tr>\n                ';
 row.forEach(function(rowComp) { ;
__p += '\n                    <td>' +
((__t = ( rowComp.dataValue )) == null ? '' : __t) +
'</td>\n                ';
 }); ;
__p += '\n            </tr>\n        ';
 }); ;
__p += '\n    </tbody>\n</table>';
return __p
}