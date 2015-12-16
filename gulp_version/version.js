var through2 = require('through2');
var slash = require('slash');
var util = require("util")
var path = require("path")

function replace(version) {

    if (!version || typeof version !== "string") {
        console.log("version 设置错误")
        return;
    }

    return through2.obj(function transform(file, encoding, callback) {
        if (file.isNull()) {
            this.push(file);
            return callback();
        }

        if (!file.isBuffer()) {
            this.emit('error', new PluginError('gulp-cachebust', 'Non buffer files are not supported for reference rewrites.'));
            this.push(file);
            return callback();
        }

        var contents = file.contents.toString(encoding);
        var filePath = file.path;

        filePath = filterPath(filePath);
        contents = filterContent(filePath, contents);
        // contents = contents.replace(new RegExp('\\b' + original + '(?!\\.)\\b', 'g'), cachebusted);

        file.contents = new Buffer(contents, encoding);
        this.push(file);
        return callback();
    });

    //过滤路径
    function filterPath(filePath) {
        var extname = path.extname(filePath);
        if (extname == ".vm" || extname == ".html") {
            return filePath;
        }
        var basename = path.basename(filePath, extname);
        var dirname = path.dirname(filePath);

        var str = path.join(dirname, basename + '.' + version + extname);
        return slash(str);
    }

    function filterContent(filePath, fileContent) {
        var result = fileContent;
        var extname = path.extname(filePath);
        try {
            if (extname == ".html" || extname == ".vm") {
                //html模板的处理
                result = html(result, version);
                return result;
            } else if (extname == ".css") {
                result = css(result, version);
            } else if (extname == ".js") {
                return fileContent
            } else {
                return fileContent
            }
            return result;
        } catch (err) {
            return result
        }
    }

    function html(content, vendor) {
        var obj = {
            'css': function() {
                var sts = content.match(/<link[^>]*rel=['"]?stylesheet['"]?[^>]*>/g);
                if (util.isArray(sts) && sts.length) {
                    for (var i = 0, len = sts.length; i < len; i++) {
                        var _RULE = sts[i].match(/href=['"]?([^>'"]*)['"]?/);
                        if (_RULE[1]) {
                            var extname = path.extname(_RULE[1]);
                            content = content.replace(sts[i], sts[i].replace(extname, extname + "?" + version));
                        }
                    }
                }
                return content;
            },
            'js': function() {
                var sts = content.match(/<script[^>]*src=['"]?([^>'"]*)['"]?[^>]*>[^<]*<\/script>/g);
                if (util.isArray(sts) && sts.length) {
                    for (var i = 0, len = sts.length; i < len; i++) {
                        var _RULE = sts[i].match(/src=['"]?([^>'"]*)['"]?/);
                        if (_RULE[1]) {
                            var extname = path.extname(_RULE[1]);
                            content = content.replace(sts[i], sts[i].replace(extname, extname + "?" + version));
                        }
                    }
                }
                return content;
            },
            'image': function() {
                var sts = content.match(/<img[^>]*>/g);
                if (util.isArray(sts) && sts.length) {
                    for (var i = 0, len = sts.length; i < len; i++) {
                        var _RULE = sts[i].match(/src=['"]?([^>'"]*)['"]?/);
                        if (_RULE[1]) {
                            var extname = path.extname(_RULE[1]);
                            content = content.replace(sts[i], sts[i].replace(extname, extname + "?" + version));
                        }
                    }
                }
                return content;
            }
        }

        for (var i in obj) {
            obj[i]();
        }
        return content;
    }

    function css(content, vendor) {
        var sts = content.match(/url\(['"]?([^>'"]*)['"]?\)/g);
        if (util.isArray(sts) && sts.length) {
            for (var i = 0, len = sts.length; i < len; i++) {
                var _RULE = sts[i].match(/url\(['"]?([^>'"]*)['"]?[\)]/);
                if (_RULE[1]) {
                    var extname = path.extname(_RULE[1]);
                    content = content.replace(sts[i], sts[i].replace(extname, extname + "?" + version));
                }
            }
        }
        return content;
    }
}
module.exports = replace;
