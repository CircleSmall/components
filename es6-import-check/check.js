var fs = require("fs");

var iterator = require("babel-runtime/core-js/get-iterator");
var babylon = require("babylon");
var traverse = require("babel-traverse")["default"];

var str = fs.readFileSync('./str.js').toString();

var plugin = {
    Program: {
        exit: function (path) {
            var body = path.get("body");
            for (var _iterator3 = body, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : (0, iterator.default)(_iterator3); ;) {
                var _ref3;
                if (_isArray3) {
                    if (_i3 >= _iterator3.length) break;
                    _ref3 = _iterator3[_i3++];
                } else {
                    _i3 = _iterator3.next();
                    if (_i3.done) break;
                    _ref3 = _i3.value;
                }
                var _path = _ref3;
                // console.log(_path.isExportDeclaration())
                console.log(_path.isImportDeclaration())
                // console.log(_path.isExportDefaultDeclaration())
                // console.log(_path.isExportNamedDeclaration())
                // console.log(_path.isExportAllDeclaration())
            }
        }
    }
}

var ast = babylon.parse(str, {
    sourceType: "module"
});

traverse(ast, plugin);

