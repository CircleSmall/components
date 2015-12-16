var cutText = (function() {


    /**
     * 多行文本截断，超出显示省略号
     *
     *     使用方式：
     *         //注册要截断字符的宿主环境
     *         cutText.register({
                    name: "relative",
                    style: {
                        width: (window.innerWidth - (17 * 2)) + 'px'
                    }
                });
                //获取截断字符的内容
                cutText.cut({
                    content: content,//内容字符串
                    lines: 2, //截断的行数
                    host: "relative" // 宿主环境名称
                })
     *
     *
     *      逻辑描述：
     *      1、生成一个隐藏的$dom来进行dom操作
     *      2、宿主环境注册：
     *          1、分别生成纯中文和纯英文的两段测试文本
     *          2、分别把中文和英文文本放到$dom中
     *              1、字符串扫描 + range
     *              2、获取单个中(英)字符的宽度
     *      3、截取字符内容
     *          1、读取之前注册的宿主环境的参数(单个中(英)字符的宽度等)
     *          2、开始字符串扫描
     *              1、遇到html标签则跳过
     *              2、扫描超过所设定的行数则终止扫描
     */

    function cutText() {
        this.host = {}; //宿主环境缓存对象
    }

    cutText.prototype = {
        //注册文本截断的宿主环境
        register: function(opt) {
            if (this.host[opt.name]) {
                console.log("该宿主环境已经注册过了")
                return;
            }
            if (!opt.style) {
                console.log("请输入文本截断的宿主环境样式")
                return;
            }
            if (!opt.style.width) {
                console.log("必须给宿主环境定义宽度");
            }
            if (!opt.name) {
                console.log("请给宿主环境命名")
                return;
            }

            this.$dom = this.createDom(opt.style);//创建dom环境
            this.testObj = this.getTestObj();//创建测试文本对象

            this.host[opt.name] = {
                width: this.lineW,
                testObj: this.testObj,
            };
        },

        // 利用字符串扫描+range的方法
        getword: function($node) {
            var node = this.getTextNodes($node)[0];
            var text = node.nodeValue;
            var count = 0;
            var rect;
            for (var i = 0, l = text.length; i < l; i++, count++) {
                range = document.createRange();
                range.setStart(node, 0);
                range.setEnd(node, i + 1);
                rect = range.getClientRects();
                if (rect.length > 1) {
                    break;
                }
            }

            this.lineW = rect[0].width;//行宽

            //返回一个字符的宽度
            return {
                wordW: rect[0].width / (count + 1), //单词宽度
            }
        },

        //用js的offset
        //这种方法，html里可以装标签
        // getwordV2: function(){
        // }
        
        //得到纯文本节点
        getTextNodes: function(node) {
            var result = [];
            var str = "";
            node = node.firstChild;
            while (node) {
                //纯文本节点
                if (node.nodeType == 3 && node.nodeValue.trim().length > 0) //滤掉内容为空的节点
                    result.push(node);
                if (node.nodeType == 1)
                    result = result.concat(this.getTextNodes(node));

                node = node.nextSibling;
            }
            return result;
        },

        getTestObj: function() {
            var arr = [{
                name: "other", //截断字符后用到的省略号
                str: ".........",
                dom: this.$dom,
                check: function(asc) {
                    if (asc == 46) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },{
                name: "en",
                str: "wrfwtf",
                dom: this.$dom,
                check: function(asc) {
                    if (asc <= 122) {
                        //asc码小于122的，都按照英文字符算
                        return true;
                    } else {
                        return false;
                    }
                }
            }, {
                name:"ch",
                str: "我了个去",
                dom: this.$dom,
                check: function(asc) {
                    if (asc > 122) {
                        //asc码大于122的，都按照中文字符算
                        return true;
                    } else {
                        return false;
                    }
                }
            }]

            var testObj = {};
            for(var i in arr){
                testObj[arr[i].name] = this.createTestObj(arr[i]);
            }

            return testObj;
        },

        //创建测试对象
        createTestObj: function(opt) {
            var str = opt.str;
            var dom = opt.dom || this.$dom;

            var resultStr = "";
            var l = 50;

            for (var i = 0; i < l; i++) {
                resultStr = resultStr + str;
            }

            dom.innerHTML = resultStr;
            var singleStrObj = this.getword(dom);

            return {
                width: singleStrObj.wordW, //单个字符的宽度
                check: opt.check, //校验规则
            }
        },

        //通过asc码得到单个字符的宽度
        getWidthByAsc: function(asc) {
            var testObj = this.testObj;
            for (var i in testObj) {
                if (testObj[i].check(asc)) {
                    return testObj[i].width;
                    // break;
                }
            }
        },

        createDom: function(style) {
            // var $dom = $('<p></p>');
            // var style = $.extend(true, {}, style, {
            //     // 'position': 'absolute', 因为p标签在页面里没有移除,所以加上这个会让页面底部出现大量空白
            //     'left': '0',
            //     'bottom': '-9999px',
            //     'visibility': 'hidden',
            //     'z-index': '-99999',
            //     'word-break': 'normal',
            //     'word-wrap': 'break-word'
            // });

            // $('body').append($dom.css(style));

            var $dom = document.createElement("p");

            for(var i in style) {
                $dom.style[i] = style[i];
            };

            $dom.style["left"] = "0";
            $dom.style["bottom"] = "-9999px";
            $dom.style["visibility"] = "hidden";
            $dom.style["z-index"] = "-9999";
            $dom.style["word-break"] = "normal";
            $dom.style["word-wrap"] = "break-word";

            document.body.appendChild($dom);
            return $dom;
        },
        cut: function(opt) {
            if (!opt.host || !opt.lines || !opt.content) {
                return console.log("请输入正确的参数");
            }
            var content = opt.content;
            var lines = opt.lines;
            var para = this.host[opt.host];
            var enW = para.enW;
            var chW = para.chW;
            var width = para.width;

            var otherW = 20 + this.testObj["other"].width; //省略号的宽度
            var currentLine = 1; //当前行
            var currentW = 0;
            var result = "";

            var istag = false;
            //开启字符串扫描
            for (var i = 0, l = content.length; i < l; i++) {
                if (content.charCodeAt(i) == "60") {
                    //如果匹配到了"<"
                    istag = true;
                    continue;
                }
                if (content.charCodeAt(i) == "62") {
                    //如果匹配到了">"
                    istag = false;
                    continue;
                }
                if (istag) {
                    continue;
                }

                var asc = content.charCodeAt(i); //获得asc码

                //遍历测试文本对象
                currentW += this.getWidthByAsc(asc);

                // 如果超过三行
                if (Math.floor((currentW + otherW) / width) == lines) {
                    result += " ..."
                    break;
                }

                result += content[i];
            }
            return result;
        }
    }

    return new cutText;
})();
