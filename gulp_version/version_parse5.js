var fs = require("fs");

var parse5 = require('parse5');
var http = require('http');

var readStream = fs.createReadStream('./test.html');
var writeStream = fs.createWriteStream('/test2.html');

var parser = new parse5.SAXParser();


fs.readFile('./test.html', function (err, data) {
  if (err) throw err;
  var html = data.toString();
  var ast = parse5.parse(html, {locationInfo:true});
  parseAst(ast);
  var output = parse5.serialize(ast)
  console.log(output)
});

function parseAst(ast) {
    if(ast && ast.childNodes) {
        var arr = ast.childNodes;
        for(var i in arr ) {
            parseAst(arr[i]);
        }
    }
    var attrs = ast.attrs;
    if(attrs) {
        for (var j in attrs) {
            if(attrs[j] && attrs[j].name && /href|src/g.test(attrs[j].name)) {
                attrs[j].value = attrs[j].value + "?test";
            }
        }
    }
}