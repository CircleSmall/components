var data = {};
var names = ['circle', 'zhihao', 'gary', 'inkie', 'percy', 'cohlint', 'liwen'];
var booksNum = 5;
var chaptersNum = 6;

for (var i in names) {
    var userObj = data[names[i]] = {};
    for (var j = 0; j < booksNum; j++) {
        var bookObj = userObj[((names[i]) + " book " + j)] = [];
        for (var k = 0; k < chaptersNum; k++) {
            bookObj.push(("chapter " + k));
        }
    }
}
console.log(data);

var current = {
    user: '',
    book: ''
};


var test = false;
var guide = {
    getData: function (inputUtilObj) {
        return new Promise(function (resolve, reject) {
            var list = [];
            if (test) {

                list = [{
                    origin: 'ee',
                    replace: 'eA'
                }, {
                    origin: 'ff',
                    replace: 'fB'
                }, {
                    origin: 'scc',
                    replace: 'sCC'
                }, {
                    origin: 'd22d',
                    replace: 'D4D'
                }];
                test = !test;
            } else {
                list = [{
                    origin: 'aa',
                    replace: 'AA'
                }, {
                    origin: 'bb',
                    replace: 'BB'
                }, {
                    origin: 'cc',
                    replace: 'CC'
                }, {
                    origin: 'dd',
                    replace: 'DD'
                }];

                test = !test;

            }
            resolve(list);
        })
    },
    mark: 'guides',
    suggestPosition: '',
    renderAfter: {
        addStrAtStart: function () { return ''; },
        addStrAtEnd: function () { return ''; }
    },
    renderBefore: {
        addStrAtStart: function () { return ''; }
    },
    renderReplaceValue: true,
    // jumpCurrent: true
};

var users = {
    getData: function (inputUtilObj) {
        return new Promise(function (resolve, reject) {
            var list = [];
            for (var i in data) {
                if (inputUtilObj.isComplete) {
                    list.push(i);
                } else if (i.indexOf(inputUtilObj.inputStr) > -1) {
                    list.push(i);
                }
            }
            resolve(list);
        })
    },
    mark: 'users',
    suggestPosition: 'auto',

    renderAfter: {
        addStrAtStart: function () { return 'us: '; },
        addStrAtEnd: function () { return ' >'; }
    },
    renderBefore: {
        addStrAtStart: function () { return 'users: '; }
    },
    mutiple: true
};

var books = {
    getData: function (inputUtilObj) {
        if ( inputUtilObj === void 0 ) inputUtilObj = {};

        return new Promise(function (resolve, reject) {
            if (current.user) {
                var list = [];
                for (var i in data[current.user]) {
                    if (inputUtilObj.isComplete) {
                        list.push(i);
                    } else if (i.indexOf(inputUtilObj.inputStr) > -1) {
                        list.push(i);
                    }
                }
                resolve(list);
            }
        })
    },
    mark: 'books',
    suggestPosition: 'auto',
    renderAfter: {
        addStrAtStart: function () { return 'bks: '; },
        addStrAtEnd: function () { return ' >'; }
    },
    renderBefore: {
        addStrAtStart: function () { return 'books: '; }
    }
};

var chapters = {
    getData: function () {
        return new Promise(function (resolve, reject) {
            console.log(current);
            if (current.user && current.book) {
                var obj = data[current.user][current.book];
                var list = [];
                for (var i in obj) {
                    list.push(obj[i]);
                }
                resolve(list);
            }
        })
    },
    mark: 'chapters',
    suggestPosition: 'auto'
};

var list = [guide, users, books, chapters];

var oneDataTest = users;

var testData = {current: current, list: list, oneDataTest: oneDataTest};

var ListView = function ListView(opts) {
    if ( opts === void 0 ) opts = {};


    this.$el = opts.$el || $('<ul></ul>');
    this.data = opts.data || [];

    this.itemClassName = opts.itemClassName || 'ui-menu-item';
    this.HOVER_CLASSNAME = 'ui-state-focus';

    this.template = opts.template || function (data) {
            var this$1 = this;

            var str = '';
            for (var i = 0, l = data.length; i < l; i++) {
                if(data[i].constructor === Object) {
                    str += "<li class=\"" + (this$1.itemClassName) + "\" data-str=\"" + (data[i]['replace']) + "\" isReplace=\"true\" data-order=\"" + i + "\"><a href=\"javascript:;\">" + (data[i]['origin']) + "</a></li>";
                } else {
                    str += "<li class=\"" + (this$1.itemClassName) + "\" data-order=\"" + i + "\" data-str=\"" + (data[i]) + "\"><a href=\"javascript:;\">" + (data[i]) + "</a></li>";
                }
            }
            return str;
        };

    this._index = -1;

    this.init();
};

var prototypeAccessors = { index: {},$selectItem: {},$allItem: {},value: {},currentItemIsReplace: {} };

prototypeAccessors.index.set = function (val) {
    if (val > this.data.length - 1) {
        val = this.data.length - 1;
    } else if (val < 0) {
        val = -1;
        }
        this.updateViewByIndex(this._index = val);
};

prototypeAccessors.index.get = function () {
        return this._index;
};

prototypeAccessors.$selectItem.get = function () {
    return this.getIndexItem();
};

prototypeAccessors.$allItem.get = function () {
    return this.getAllItems();
};

prototypeAccessors.value.get = function () {
    return this.getIndexItem().attr('data-str');
};

prototypeAccessors.currentItemIsReplace.get = function () {
    return this.getIndexItem().attr('isReplace')
    };

ListView.prototype.$ = function $ (selector) {
    return this.$el.find(selector);
};

ListView.prototype.init = function init () {
    this.initEvent();
        this.render();
};

ListView.prototype.initEvent = function initEvent () {
    var me = this;
    this.$el.on('click', '.' + this.itemClassName, function () {
        me._clickHandler($(this));
    });
    this.$el.on('mouseover', '.' + this.itemClassName, function () {
        me._mouseoverHandler($(this));
    });
};

ListView.prototype.render = function render () {
    this.$el.html(this.template(this.data));
    return this;
};

ListView.prototype.refresh = function refresh (data, template) {
    this.index = -1;

    if (data) {
        this.updateData(data);
    }

    if (template) {
        this.updateTemplate(template);
    }

    this.render().show();

    return this;
};

ListView.prototype.updateViewByIndex = function updateViewByIndex (index) {
    if (index < 0 || index > this.data.length) { return; }
    this.$allItem.removeClass(this.HOVER_CLASSNAME);
    this.$selectItem.addClass(this.HOVER_CLASSNAME);
    this.scrollByIndex();
};

ListView.prototype.updateData = function updateData (data) {
    this.data = data;
};

ListView.prototype.updateTemplate = function updateTemplate (templateFn) {
    this.template = templateFn;
};

ListView.prototype.scrollByIndex = function scrollByIndex () {

    if (!this.$selectItem[0]) { return; }

    var containerHeight = this.$el.height();
    var itemHeight = this.$selectItem[0].offsetHeight;
    var scrollTop = this.$el.scrollTop();
    var offsetTop = this.$selectItem[0].offsetTop;
    var scrollToValue = 0;

    if (offsetTop > (scrollTop + containerHeight - itemHeight)) {

        //if current item under the container view area
        scrollToValue = offsetTop - containerHeight + itemHeight;
        this.$el.scrollTop(scrollToValue);

    } else if (offsetTop < scrollTop) {

        //if current item on the container view area
        scrollToValue = offsetTop;
        this.$el.scrollTop(scrollToValue);
    }

};

ListView.prototype._clickHandler = function _clickHandler ($item) {
    this.hide();
    var tempIndex = +($item.attr('data-order'));
    this.index = tempIndex;
    $(this).trigger('selectItem');
};

ListView.prototype._mouseoverHandler = function _mouseoverHandler ($item) {
    this.getAllItems().removeClass(this.HOVER_CLASSNAME);
    $item.addClass(this.HOVER_CLASSNAME);
};

ListView.prototype.getIndexItem = function getIndexItem () {
    return this.$('.' + this.itemClassName).eq(this.index);
};

ListView.prototype.getAllItems = function getAllItems () {
    return this.$('.' + this.itemClassName);
};

ListView.prototype.hide = function hide () {
    this.$el.hide();
    this.display = 'hide';
    return this;
};

ListView.prototype.show = function show () {
    this.$el.show();
    this.display = 'show';
    return this;
};

ListView.prototype.remove = function remove () {
    this.$el.remove();
    this.display = 'remove';
    return this;
};

Object.defineProperties( ListView.prototype, prototypeAccessors );

/* jshint browser: true */


// The properties that we copy into a mirrored div.
// Note that some browsers, such as Firefox,
// do not concatenate properties, i.e. padding-top, bottom etc. -> padding,
// so we have to do every single property specifically.
var properties = [
    'direction',  // RTL support
    'boxSizing',
    'width',  // on Chrome and IE, exclude the scrollbar, so the mirror div wraps exactly as the textarea does
    'height',
    'overflowX',
    'overflowY',  // copy the scrollbar for IE

    'borderTopWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderLeftWidth',
    'borderStyle',

    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',

    // https://developer.mozilla.org/en-US/docs/Web/CSS/font
    'fontStyle',
    'fontVariant',
    'fontWeight',
    'fontStretch',
    'fontSize',
    'fontSizeAdjust',
    'lineHeight',
    'fontFamily',

    'textAlign',
    'textTransform',
    'textIndent',
    'textDecoration',  // might not make a difference, but better be safe

    'letterSpacing',
    'wordSpacing',

    'tabSize',
    'MozTabSize'

];

var isBrowser = (typeof window !== 'undefined');
var isFirefox = (isBrowser && window.mozInnerScreenX != null);

function getCaretCoordinates(element, position, options) {
    if (!isBrowser) {
        throw new Error('textarea-caret-position#getCaretCoordinates should only be called in a browser');
    }

    var debug = options && options.debug || false;
    if (debug) {
        var el = document.querySelector('#input-textarea-caret-position-mirror-div');
        if (el) {
            el.parentNode.removeChild(el);
        }
    }

    // mirrored div
    var div = document.createElement('div');
    div.id = 'input-textarea-caret-position-mirror-div';
    document.body.appendChild(div);

    var style = div.style;
    var computed = window.getComputedStyle ? getComputedStyle(element) : element.currentStyle;  // currentStyle for IE < 9

    // default textarea styles
    style.whiteSpace = 'pre-wrap';
    if (element.nodeName !== 'INPUT')
        { style.wordWrap = 'break-word'; }  // only for textarea-s

    // position off-screen
    style.position = 'absolute';  // required to return coordinates properly
    if (!debug)
        { style.visibility = 'hidden'; }  // not 'display: none' because we want rendering

    // transfer the element's properties to the div
    properties.forEach(function (prop) {
        style[prop] = computed[prop];
    });

    if (isFirefox) {
        // Firefox lies about the overflow property for textareas: https://bugzilla.mozilla.org/show_bug.cgi?id=984275
        if (element.scrollHeight > parseInt(computed.height))
            { style.overflowY = 'scroll'; }
    } else {
        style.overflow = 'hidden';  // for Chrome to not render a scrollbar; IE keeps overflowY = 'scroll'
    }

    div.textContent = element.value.substring(0, position);
    // the second special handling for input type="text" vs textarea: spaces need to be replaced with non-breaking spaces - http://stackoverflow.com/a/13402035/1269037
    if (element.nodeName === 'INPUT')
        { div.textContent = div.textContent.replace(/\s/g, '\u00a0'); }

    var span = document.createElement('span');
    // Wrapping must be replicated *exactly*, including when a long word gets
    // onto the next line, with whitespace at the end of the line before (#7).
    // The  *only* reliable way to do that is to copy the *entire* rest of the
    // textarea's content into the <span> created at the caret position.
    // for inputs, just '.' would be enough, but why bother?
    span.textContent = element.value.substring(position) || '.';  // || because a completely empty faux span doesn't render at all
    div.appendChild(span);

    var coordinates = {
        top: span.offsetTop + parseInt(computed['borderTopWidth']),
        left: span.offsetLeft + parseInt(computed['borderLeftWidth'])
    };

    if (debug) {
        span.style.backgroundColor = '#aaa';
    } else {
        document.body.removeChild(div);
    }

    return coordinates;
}

var keyCode = {
    'ESC': 27,
    'ENTER': 13,
    'UP': 38,
    'DOWN': 40
};

var Suggest = function Suggest($inputWrapper, dataConfig) {
    this.$el = $inputWrapper;
    this.$input = $inputWrapper.find('.input');
    this.$getPosInput = $inputWrapper.find('.input-pos-help');//用于定位listview 的辅助input
    this.listView = new ListView({
        $el: $inputWrapper.find('.ui-autocomplete')
    });
    // this.dataConfig = dataConfig || [];
    // this.makeDataObj = {}; //生成数据的map对象
    // this.marks = []; //marks数组
    this.init();
    this.updateConfig(dataConfig);
};

Suggest.prototype.init = function init () {
    this.initEvent();
};

Suggest.prototype.initEvent = function initEvent () {
        var this$1 = this;

    var me = this;

    this.$input.on('keydown', $.proxy(this._keyDownHandler, this));

    this.$input.on('click', function () {
        me.updateListView();
        return false;
    });

    $('body').click(function () {
        me.listView.hide();
    });

    $(this.listView).on('selectItem', function () {
        var value = this$1.listView.value;
        if(this$1.listView.currentItemIsReplace) {
            this$1.currentMark.replaceValue = value;
        }
        this$1.selectListViewItem(value);
    });
};

Suggest.prototype.updateConfig = function updateConfig (dataConfig) {
    this.marks = [];
    this.makeDataObj = {};
    this.dataConfig = dataConfig;
    this.parseDataConfig();
};

Suggest.prototype.parseDataConfig = function parseDataConfig () {
        var this$1 = this;

    if (this.dataConfig.constructor == Array) {
        for (var i in this.dataConfig) {
            this$1.parseDataItem(this$1.dataConfig[i]);
        }

    } else if (this.dataConfig.constructor == Object) {
        this.parseDataItem(this.dataConfig);
    }
};

Suggest.prototype.parseDataItem = function parseDataItem (item) {
    var markName = item.mark;
    this.marks.push({
        value: '',
        str: '',
        markName: markName,
        suggestPosition: item.suggestPosition,
        renderAfter: item.renderAfter,
        renderBefore: item.renderBefore,
        next: false,
        renderReplaceValue: item.renderReplaceValue,
        replaceValue:'',
        jumpCurrent: item.jumpCurrent
    });
    this.makeDataObj[markName] = item.getData;
};

Suggest.prototype.resetMark = function resetMark (mark) {
    mark.leftPos = '';
    mark.rightPos = '';
    mark.value = '';
    mark.str = '';
    mark.next = false;
};

Suggest.prototype._keyDownHandler = function _keyDownHandler (e) {
    switch (e.keyCode) {
        case keyCode.UP :
            e.preventDefault();
            this.listView.index--;
            break;
        case keyCode.DOWN:
            e.preventDefault();
            this.listView.index++;
            break;
        case keyCode.ENTER:
            e.preventDefault();
            this.selectListViewItem(this.listView.value);
            this.listView.hide();
            break;
        case keyCode.ESC:
            e.preventDefault();
            this.listView.hide();
            break;
        default:
            this.updateListView();
            break;
    }
};

Suggest.prototype.updateListView = function updateListView () {
    var me = this;
    if (this.updateTimer) {
        clearTimeout(this.updateTimer);
    }

    this.updateTimer = setTimeout(function () {
        updateListViewTimerHandler();
    }, 100);

    function updateListViewTimerHandler() {
        var value = me.getStrBeforeCursor(); //得到光标之前的字符串
        var parseResult = me.resetParseResult(me.$input.val(), value.length);//解析字符串
        me.resetCurrentMark(parseResult);//根据字符串设置currentMark, cachestr 等值
        value = me.getStrBeforeCursor();//光标位置有可能会变化
        me.resetCurrentCursorRect(value);//得到光标位置对象
        me.refreshListView(); //根据currentMark 请求数据, 刷新listview
    }
};

Suggest.prototype._filterRarseResult = function _filterRarseResult (parseResult) {
    var result = [];
    for (var i = 0, l = parseResult.length; i < l; i++) {
        if (parseResult[i].type == 'mark') {
            result.push(parseResult[i]);
        }
    }
    return result;
};

Suggest.prototype.resetCurrentMark = function resetCurrentMark (parseResult) {
        var this$1 = this;

    this.currentMark = null;
    this.strCache = '';
    this.inputUtilObj = {};
    var markPos = -1;
    var me = this;

    /***
     * parseResult 与 marks 一一匹配
     * markPos 记录匹配最后一次成功的位置, markPos 最后位置的所有mark 都会被重置(resetMark)
     */
    if (this.marks && this.marks.length > 0 && parseResult.length > 0) {
        var reset = false;
        //match str with marks queues
        for (var i = 0, l = this.marks.length; i < l; i++) {
            var mark = this$1.marks[i];
            if (reset || !parseResult[i] || parseResult[i].type == 'unmark') {
                this$1.resetMark(mark);
                continue;
            }

            if (mark.markName == parseResult[i].markName) {
                markPos = i;
                mark.next = parseResult[i].next;
            } else {
                reset = true;
            }
        }
    }

    /***
     * 更具markPos 和 上面的匹配结果, 来觉得当前mark
     */
    if (markPos !== -1) {
        if (this.marks[markPos]['next']) {
            if (markPos == this.marks.length - 1) {
                //如果超出界限
                this.strCache = buildStrCache(this.marks.length - 2);
                this.currentMark = this.marks[markPos];
            } else {
                this.currentMark = this.marks[markPos + 1];//下一个mark 为当前mark
                this.strCache = buildStrCache(markPos);
                var startStrRenderBefore = this.currentMark.renderBefore && this.currentMark.renderBefore.addStrAtStart();
                if (startStrRenderBefore) {
                    if (parseResult[markPos + 1] && parseResult[markPos + 1].str.indexOf(startStrRenderBefore) == 0) {
                    } else if (!parseResult[markPos + 1]) {
                        var start = this.currentMark.renderBefore.addStrAtStart();
                        var cacheStr = (parseResult[markPos + 1] && parseResult[markPos + 1].str) || '';
                        this.$input.val(this.strCache + ' ' + start + cacheStr);
                    }
                }
            }

        } else {
            this.currentMark = this.marks[markPos];// 匹配成功的最后一个mark为currentMark
            this.strCache = buildStrCache(markPos - 1);

        }

    } else {
        this.currentMark = this.marks[0];//第一个mark为当前mark
        this.strCache = '';
    }

    //标记光标所在的mark是完整的字符串 (表明mark的字符串没有修改过)
    //会有这么一个需求: 如果字符串没有修改, 点击的时候需要弹出全部的list, 所以这里标记一下
    if (parseResult[markPos] && parseResult[markPos].atPosRight) {
        this.inputUtilObj.isComplete = true;
    }

    //inputStr 为搜索需要的字符串
    if (parseResult.length > 0 && parseResult[parseResult.length - 1].type == 'unmark') {
        var str = parseResult[parseResult.length - 1].str;
        this.inputUtilObj.inputStr = this.getMarkStrExceptExternalStr(str, this.currentMark);
    } else {
        this.inputUtilObj.inputStr = '';
    }

    function buildStrCache(l) {
        var str = '';
        for (var i = 0; i <= l; i++) {
            str += me.makeMarkStr(me.marks[i]) + ' ';
        }
        return str;
    }
};

Suggest.prototype.refreshListView = function refreshListView () {
        var this$1 = this;

    if (this.currentCursorRect) {
        this.listView.$el.css({
            left: this.currentCursorRect.x,
            top: this.currentCursorRect.y
        });
    }
    if (this.currentMark) {
        //根据当前mark去getdata
        this.makeDataObj[this.currentMark.markName](this.inputUtilObj).then(function (data, template) {
            //刷新listview
            if (data.length !== 0) {
                this$1.listView.refresh(data, template).show();
            } else {
                this$1.listView.hide();
            }
        });
    }
};

/**
 * 参数:
 *  str: 要解析的字符串
 *  pos: 光标所在的位置
 *
 * 解析规则:
 *  以字符串扫描的方式, 从左向右扫描
 *  每扫描一个字符,
 *      如果该字符是空格, 跳过扫描
 *      如果不是空格, 就判断该字符是不是匹配已经存在的mark
 *          若匹配, 则result.push({type:"mark"})
 *              若匹配的最大右边界大于光标的位置, 则增加atPosRight属性, 结束扫描
 *              如果没到边界, 则更改字符索引位置(i), 继续扫描
 *          若不匹配, 则result.push({type:"unmark"}), 结束扫描
 * 返回结果:
 *  result 队列 , 每个item是一个对象 , 对象里标名该对象的特征
 *  eg1: [{type:'mark',markName:'users'}, {type:'mark', markName:'books',atPosRight}]
 *       表明: 在当前光标处, 扫描出来了两个mark 对象, 且最后一个mark对象之上
 *  eg2: [{type:'mark',markName:'users'}, {type:'unmark', str:'str'}]
 *       表明: 在当前光标的位置上, 只扫描到了一个mark 对象, 剩下的是unmark 对象
 *       (不匹配mark 的字符 , 一律视为unmark)
 * */
Suggest.prototype.resetParseResult = function resetParseResult (str, pos) {
        var this$1 = this;

    var marks = $.extend(true, [], this.marks);
    var result = [];
    var count = 0;
    for (var i = 0, l = str.length; i < l; i) { //count 是为了防止程序错误,导致for的死循环
        if (count++ > l) {
            break;
        }

        var s = str[i];
        if (s == ' ') { //
            if (result.length > 0) {
                result[result.length - 1]['next'] = true;//next表示, 是否需要展示下一个mark
            }
            i++;
            continue;
        }
        // let isMarkStr = false;

        //chack by mark
        var mark = marks[0];
        var markStr = mark.str;
        // for (let j in this.marks) {
        // let mark = this.marks[j];

        //${mark.str}xxx 不算一个mark
        // if (mark.renderReplaceValue) { //比较replace值, 不比较origin值
        // markStr = mark.replaceValue || '';
        // }
        var matchValue = i + markStr.length === l ? markStr : markStr + ' ';
        if (str.slice(i).indexOf(matchValue) === 0) {
            var obj = {
                markName: mark.markName,
                type: 'mark'
            };

            result.push(obj);

            //如果在光标右边
            if (i + matchValue.length > pos) {
                obj.atPosRight = true;
                return this$1.currentParseResult = result;
            }

            marks.splice(0, 1);//删除匹配成功的mark
            i += markStr.length;
            // isMarkStr = true;
            // break;
        } else {
            //如果mark没有匹配成功, 则
            result.push({
                type: 'unmark',
                str: str.slice(i)
            });
            // let last = result[result.length - 1];
            // if (!last || last.type != 'unmark') {
            // result.push({
            //     type: 'unmark',
            //     str: str.slice(i)
            // });
            // }
            return this$1.currentParseResult = result;
        }
        // }
        // if (!isMarkStr) {
        // let last = result[result.length - 1];
        // if (!last || last.type != 'unmark') {
        //     result.push({
        //         type: 'unmark',
        //         str: str.slice(i)
        //     });
        // }
        // }
    }
    return this.currentParseResult = result;
};

//markstr 是不包括renderBefore.addStrAtStart 这个字符的
Suggest.prototype.makeMarkStr = function makeMarkStr (mark) {
    mark.renderAfterEndStr = '';
    mark.renderAfterStartStr = '';

    if (mark.renderAfter && mark.renderAfter.addStrAtStart) {
        mark.renderAfterStartStr = mark.renderAfter.addStrAtStart();
    }

    if (mark.renderAfter && mark.renderAfter.addStrAtEnd) {
        mark.renderAfterEndStr = mark.renderAfter.addStrAtEnd();
    }

    var value = mark.replaceValue || mark.value;

    return mark.renderAfterStartStr + value + mark.renderAfterEndStr;
};

Suggest.prototype.getMarkStrExceptExternalStr = function getMarkStrExceptExternalStr (str, mark) {
    if (mark.renderBefore && mark.renderBefore.addStrAtStart) {
        str = str.slice(mark.renderBefore.addStrAtStart.length);
    }

    var before = mark.renderAfterStartStr;
    var after = mark.renderAfterEndStr;
    if (before && str.indexOf(before) == 0) {
        str = str.slice(before.length);
    }
    if (after && str.indexOf(after) == str.length - after.length) {
        str = str.slice(0, str.length - after.length);
    }

    return str;
};

Suggest.prototype.selectListViewItem = function selectListViewItem (val) {
    this.currentMark.value = val;
    var str = this.currentMark.str = this.makeMarkStr(this.currentMark);
    this.$input.val(this.strCache + str);
    $(this).trigger('markChange', $.extend({}, this.currentMark));
    this.setCaretPosition(this.$input.val().length);
};

Suggest.prototype.getCursortPosition = function getCursortPosition () { //获取光标位置函数
    var ctrl = this.$input[0];
    var CaretPos = 0; // IE Support
    if (document.selection) {
        ctrl.focus();
        var Sel = document.selection.createRange();
        Sel.moveStart('character', -ctrl.value.length);
        CaretPos = Sel.text.length;
    }
    // Firefox support
    else if (ctrl.selectionStart || ctrl.selectionStart == '0')
        { CaretPos = ctrl.selectionStart; }
    return (CaretPos);
};

Suggest.prototype.setCaretPosition = function setCaretPosition (pos) { //设置光标位置函数
    var ctrl = this.$input[0];
    ctrl.focus();
    if (ctrl.setSelectionRange) {
        ctrl.focus();
        ctrl.setSelectionRange(pos, pos);
    } else if (ctrl.createTextRange) {
        var range = ctrl.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
    }
};

Suggest.prototype.getStrBeforeCursor = function getStrBeforeCursor () {
    return this.$input.val().slice(0, this.getCursortPosition());
};

Suggest.prototype.resetCurrentCursorRect = function resetCurrentCursorRect (value) {
    var result = this.currentCursorRect = null;
    var $inputOffset = this.$input.offset();
    var inputHeight = this.$input[0].offsetHeight;
    if (this.currentMark && this.currentMark.suggestPosition !== 'auto') {
        result = {
            x: $inputOffset.left + 'px',
            y: $inputOffset.top + inputHeight + 'px'
        };
    } else if (!value) {
        result = {
            x: $inputOffset.left + 'px',
            y: $inputOffset.top + inputHeight + 'px'
        };
    } else {
        var coordinates = getCaretCoordinates(this.$input[0], value.length);
        result = {
            x: coordinates.left + $inputOffset.left,
            y: coordinates.top + this._calculateLineHeight() + $inputOffset.top
        };
    }

    return this.currentCursorRect = result;
};

Suggest.prototype._calculateLineHeight = function _calculateLineHeight () {
    if (this._calculateLineHeight) {
        return this._calculateLineHeight;
    }
    var el = this.$input[0];
    var lineHeight = parseInt($(el).css('line-height'), 10);
    if (isNaN(lineHeight)) {
        // http://stackoverflow.com/a/4515470/1297336
        var parentNode = el.parentNode;
        var temp = document.createElement(el.nodeName);
        var style = el.style;
        temp.setAttribute(
            'style',
            'margin:0px;padding:0px;font-family:' + style.fontFamily + ';font-size:' + style.fontSize
        );
        temp.innerHTML = 'test';
        parentNode.appendChild(temp);
        lineHeight = temp.clientHeight;
        parentNode.removeChild(temp);
    }
    return this._calculateLineHeight = lineHeight;
};

var suggest = new Suggest($('.demo1'), testData.list);

$(suggest).on('markChange', function (e,mark) {
    if (mark.markName === 'users') {
        testData.current.user = mark.value;
        testData.current.book = '';
    } else if (mark.markName === 'books') {
        testData.current.book = mark.value;
    }
});


var suggest2 = new Suggest($('.demo2'), testData.oneDataTest);
$(suggest2).on('markChange', function (e,mark) {
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi4uL3N1Z2dlc3QvZ2V0RGF0YS5qcyIsIi4uL3N1Z2dlc3QvbGlzdFZpZXcuanMiLCIuLi9zdWdnZXN0L3RleHRhcmVhX2NhcmV0LmpzIiwiLi4vc3VnZ2VzdC9zdWdnZXN0LmpzIiwiLi4vc3VnZ2VzdC9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgZGF0YSA9IHt9O1xubGV0IG5hbWVzID0gWydjaXJjbGUnLCAnemhpaGFvJywgJ2dhcnknLCAnaW5raWUnLCAncGVyY3knLCAnY29obGludCcsICdsaXdlbiddO1xubGV0IGJvb2tzTnVtID0gNTtcbmxldCBjaGFwdGVyc051bSA9IDY7XG5cbmZvciAobGV0IGkgaW4gbmFtZXMpIHtcbiAgICBsZXQgdXNlck9iaiA9IGRhdGFbbmFtZXNbaV1dID0ge307XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBib29rc051bTsgaisrKSB7XG4gICAgICAgIGxldCBib29rT2JqID0gdXNlck9ialtgJHtuYW1lc1tpXX0gYm9vayAke2p9YF0gPSBbXTtcbiAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBjaGFwdGVyc051bTsgaysrKSB7XG4gICAgICAgICAgICBib29rT2JqLnB1c2goYGNoYXB0ZXIgJHtrfWApO1xuICAgICAgICB9XG4gICAgfVxufVxuY29uc29sZS5sb2coZGF0YSlcblxubGV0IGN1cnJlbnQgPSB7XG4gICAgdXNlcjogJycsXG4gICAgYm9vazogJydcbn07XG5cblxubGV0IHRlc3QgPSBmYWxzZTtcbmNvbnN0IGd1aWRlID0ge1xuICAgIGdldERhdGE6IChpbnB1dFV0aWxPYmopID0+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIGxldCBsaXN0ID0gW107XG4gICAgICAgICAgICBpZiAodGVzdCkge1xuXG4gICAgICAgICAgICAgICAgbGlzdCA9IFt7XG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbjogJ2VlJyxcbiAgICAgICAgICAgICAgICAgICAgcmVwbGFjZTogJ2VBJ1xuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luOiAnZmYnLFxuICAgICAgICAgICAgICAgICAgICByZXBsYWNlOiAnZkInXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICBvcmlnaW46ICdzY2MnLFxuICAgICAgICAgICAgICAgICAgICByZXBsYWNlOiAnc0NDJ1xuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luOiAnZDIyZCcsXG4gICAgICAgICAgICAgICAgICAgIHJlcGxhY2U6ICdENEQnXG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgICAgICB0ZXN0ID0gIXRlc3Q7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxpc3QgPSBbe1xuICAgICAgICAgICAgICAgICAgICBvcmlnaW46ICdhYScsXG4gICAgICAgICAgICAgICAgICAgIHJlcGxhY2U6ICdBQSdcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbjogJ2JiJyxcbiAgICAgICAgICAgICAgICAgICAgcmVwbGFjZTogJ0JCJ1xuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luOiAnY2MnLFxuICAgICAgICAgICAgICAgICAgICByZXBsYWNlOiAnQ0MnXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICBvcmlnaW46ICdkZCcsXG4gICAgICAgICAgICAgICAgICAgIHJlcGxhY2U6ICdERCdcbiAgICAgICAgICAgICAgICB9XVxuXG4gICAgICAgICAgICAgICAgdGVzdCA9ICF0ZXN0O1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXNvbHZlKGxpc3QpXG4gICAgICAgIH0pXG4gICAgfSxcbiAgICBtYXJrOiAnZ3VpZGVzJyxcbiAgICBzdWdnZXN0UG9zaXRpb246ICcnLFxuICAgIHJlbmRlckFmdGVyOiB7XG4gICAgICAgIGFkZFN0ckF0U3RhcnQ6ICgpID0+ICcnLFxuICAgICAgICBhZGRTdHJBdEVuZDogKCkgPT4gJydcbiAgICB9LFxuICAgIHJlbmRlckJlZm9yZToge1xuICAgICAgICBhZGRTdHJBdFN0YXJ0OiAoKSA9PiAnJ1xuICAgIH0sXG4gICAgcmVuZGVyUmVwbGFjZVZhbHVlOiB0cnVlLFxuICAgIC8vIGp1bXBDdXJyZW50OiB0cnVlXG59O1xuXG5jb25zdCB1c2VycyA9IHtcbiAgICBnZXREYXRhOiAoaW5wdXRVdGlsT2JqKSA9PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBsZXQgbGlzdCA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgaSBpbiBkYXRhKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlucHV0VXRpbE9iai5pc0NvbXBsZXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGkuaW5kZXhPZihpbnB1dFV0aWxPYmouaW5wdXRTdHIpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKGkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlc29sdmUobGlzdClcbiAgICAgICAgfSlcbiAgICB9LFxuICAgIG1hcms6ICd1c2VycycsXG4gICAgc3VnZ2VzdFBvc2l0aW9uOiAnYXV0bycsXG5cbiAgICByZW5kZXJBZnRlcjoge1xuICAgICAgICBhZGRTdHJBdFN0YXJ0OiAoKSA9PiAndXM6ICcsXG4gICAgICAgIGFkZFN0ckF0RW5kOiAoKSA9PiAnID4nXG4gICAgfSxcbiAgICByZW5kZXJCZWZvcmU6IHtcbiAgICAgICAgYWRkU3RyQXRTdGFydDogKCkgPT4gJ3VzZXJzOiAnXG4gICAgfSxcbiAgICBtdXRpcGxlOiB0cnVlXG59O1xuXG5jb25zdCBib29rcyA9IHtcbiAgICBnZXREYXRhOiAoaW5wdXRVdGlsT2JqID0ge30pID0+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50LnVzZXIpIHtcbiAgICAgICAgICAgICAgICBsZXQgbGlzdCA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgaW4gZGF0YVtjdXJyZW50LnVzZXJdKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnB1dFV0aWxPYmouaXNDb21wbGV0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKGkpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGkuaW5kZXhPZihpbnB1dFV0aWxPYmouaW5wdXRTdHIpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXNvbHZlKGxpc3QpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSxcbiAgICBtYXJrOiAnYm9va3MnLFxuICAgIHN1Z2dlc3RQb3NpdGlvbjogJ2F1dG8nLFxuICAgIHJlbmRlckFmdGVyOiB7XG4gICAgICAgIGFkZFN0ckF0U3RhcnQ6ICgpID0+ICdia3M6ICcsXG4gICAgICAgIGFkZFN0ckF0RW5kOiAoKSA9PiAnID4nXG4gICAgfSxcbiAgICByZW5kZXJCZWZvcmU6IHtcbiAgICAgICAgYWRkU3RyQXRTdGFydDogKCkgPT4gJ2Jvb2tzOiAnXG4gICAgfVxufTtcblxuY29uc3QgY2hhcHRlcnMgPSB7XG4gICAgZ2V0RGF0YTogKCkgPT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coY3VycmVudClcbiAgICAgICAgICAgIGlmIChjdXJyZW50LnVzZXIgJiYgY3VycmVudC5ib29rKSB7XG4gICAgICAgICAgICAgICAgbGV0IG9iaiA9IGRhdGFbY3VycmVudC51c2VyXVtjdXJyZW50LmJvb2tdO1xuICAgICAgICAgICAgICAgIGxldCBsaXN0ID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSBpbiBvYmopIHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKG9ialtpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlc29sdmUobGlzdClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9LFxuICAgIG1hcms6ICdjaGFwdGVycycsXG4gICAgc3VnZ2VzdFBvc2l0aW9uOiAnYXV0bydcbn07XG5cbmNvbnN0IGxpc3QgPSBbZ3VpZGUsIHVzZXJzLCBib29rcywgY2hhcHRlcnNdO1xuXG5jb25zdCBvbmVEYXRhVGVzdCA9IHVzZXJzO1xuXG5leHBvcnQgZGVmYXVsdCB7Y3VycmVudCwgbGlzdCwgb25lRGF0YVRlc3R9XG4iLCJjbGFzcyBMaXN0VmlldyB7XG4gICAgY29uc3RydWN0b3Iob3B0cyA9IHt9KSB7XG5cbiAgICAgICAgdGhpcy4kZWwgPSBvcHRzLiRlbCB8fCAkKCc8dWw+PC91bD4nKTtcbiAgICAgICAgdGhpcy5kYXRhID0gb3B0cy5kYXRhIHx8IFtdO1xuXG4gICAgICAgIHRoaXMuaXRlbUNsYXNzTmFtZSA9IG9wdHMuaXRlbUNsYXNzTmFtZSB8fCAndWktbWVudS1pdGVtJztcbiAgICAgICAgdGhpcy5IT1ZFUl9DTEFTU05BTUUgPSAndWktc3RhdGUtZm9jdXMnO1xuXG4gICAgICAgIHRoaXMudGVtcGxhdGUgPSBvcHRzLnRlbXBsYXRlIHx8IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgbGV0IHN0ciA9ICcnO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gZGF0YS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoZGF0YVtpXS5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHIgKz0gYDxsaSBjbGFzcz1cIiR7dGhpcy5pdGVtQ2xhc3NOYW1lfVwiIGRhdGEtc3RyPVwiJHtkYXRhW2ldWydyZXBsYWNlJ119XCIgaXNSZXBsYWNlPVwidHJ1ZVwiIGRhdGEtb3JkZXI9XCIke2l9XCI+PGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiPiR7ZGF0YVtpXVsnb3JpZ2luJ119PC9hPjwvbGk+YDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ciArPSBgPGxpIGNsYXNzPVwiJHt0aGlzLml0ZW1DbGFzc05hbWV9XCIgZGF0YS1vcmRlcj1cIiR7aX1cIiBkYXRhLXN0cj1cIiR7ZGF0YVtpXX1cIj48YSBocmVmPVwiamF2YXNjcmlwdDo7XCI+JHtkYXRhW2ldfTwvYT48L2xpPmA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0cjtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5faW5kZXggPSAtMTtcblxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9XG5cbiAgICBzZXQgaW5kZXgodmFsKSB7XG4gICAgICAgIGlmICh2YWwgPiB0aGlzLmRhdGEubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgdmFsID0gdGhpcy5kYXRhLmxlbmd0aCAtIDE7XG4gICAgICAgIH0gZWxzZSBpZiAodmFsIDwgMCkge1xuICAgICAgICAgICAgdmFsID0gLTE7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51cGRhdGVWaWV3QnlJbmRleCh0aGlzLl9pbmRleCA9IHZhbCk7XG4gICAgfVxuXG4gICAgZ2V0IGluZGV4KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faW5kZXg7XG4gICAgfVxuXG4gICAgZ2V0ICRzZWxlY3RJdGVtKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRJbmRleEl0ZW0oKTtcbiAgICB9XG5cbiAgICBnZXQgJGFsbEl0ZW0oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEFsbEl0ZW1zKCk7XG4gICAgfVxuXG4gICAgZ2V0IHZhbHVlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRJbmRleEl0ZW0oKS5hdHRyKCdkYXRhLXN0cicpO1xuICAgIH1cblxuICAgIGdldCBjdXJyZW50SXRlbUlzUmVwbGFjZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5kZXhJdGVtKCkuYXR0cignaXNSZXBsYWNlJylcbiAgICB9XG5cbiAgICAkKHNlbGVjdG9yKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiRlbC5maW5kKHNlbGVjdG9yKTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgICB0aGlzLmluaXRFdmVudCgpO1xuICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cblxuICAgIGluaXRFdmVudCgpIHtcbiAgICAgICAgbGV0IG1lID0gdGhpcztcbiAgICAgICAgdGhpcy4kZWwub24oJ2NsaWNrJywgJy4nICsgdGhpcy5pdGVtQ2xhc3NOYW1lLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBtZS5fY2xpY2tIYW5kbGVyKCQodGhpcykpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy4kZWwub24oJ21vdXNlb3ZlcicsICcuJyArIHRoaXMuaXRlbUNsYXNzTmFtZSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbWUuX21vdXNlb3ZlckhhbmRsZXIoJCh0aGlzKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgdGhpcy4kZWwuaHRtbCh0aGlzLnRlbXBsYXRlKHRoaXMuZGF0YSkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICByZWZyZXNoKGRhdGEsIHRlbXBsYXRlKSB7XG4gICAgICAgIHRoaXMuaW5kZXggPSAtMTtcblxuICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVEYXRhKGRhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRlbXBsYXRlKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVRlbXBsYXRlKHRlbXBsYXRlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVuZGVyKCkuc2hvdygpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHVwZGF0ZVZpZXdCeUluZGV4KGluZGV4KSB7XG4gICAgICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPiB0aGlzLmRhdGEubGVuZ3RoKSByZXR1cm47XG4gICAgICAgIHRoaXMuJGFsbEl0ZW0ucmVtb3ZlQ2xhc3ModGhpcy5IT1ZFUl9DTEFTU05BTUUpO1xuICAgICAgICB0aGlzLiRzZWxlY3RJdGVtLmFkZENsYXNzKHRoaXMuSE9WRVJfQ0xBU1NOQU1FKTtcbiAgICAgICAgdGhpcy5zY3JvbGxCeUluZGV4KCk7XG4gICAgfVxuXG4gICAgdXBkYXRlRGF0YShkYXRhKSB7XG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgfVxuXG4gICAgdXBkYXRlVGVtcGxhdGUodGVtcGxhdGVGbikge1xuICAgICAgICB0aGlzLnRlbXBsYXRlID0gdGVtcGxhdGVGbjtcbiAgICB9XG5cbiAgICBzY3JvbGxCeUluZGV4KCkge1xuXG4gICAgICAgIGlmICghdGhpcy4kc2VsZWN0SXRlbVswXSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGNvbnRhaW5lckhlaWdodCA9IHRoaXMuJGVsLmhlaWdodCgpO1xuICAgICAgICBjb25zdCBpdGVtSGVpZ2h0ID0gdGhpcy4kc2VsZWN0SXRlbVswXS5vZmZzZXRIZWlnaHQ7XG4gICAgICAgIGNvbnN0IHNjcm9sbFRvcCA9IHRoaXMuJGVsLnNjcm9sbFRvcCgpO1xuICAgICAgICBjb25zdCBvZmZzZXRUb3AgPSB0aGlzLiRzZWxlY3RJdGVtWzBdLm9mZnNldFRvcDtcbiAgICAgICAgbGV0IHNjcm9sbFRvVmFsdWUgPSAwO1xuXG4gICAgICAgIGlmIChvZmZzZXRUb3AgPiAoc2Nyb2xsVG9wICsgY29udGFpbmVySGVpZ2h0IC0gaXRlbUhlaWdodCkpIHtcblxuICAgICAgICAgICAgLy9pZiBjdXJyZW50IGl0ZW0gdW5kZXIgdGhlIGNvbnRhaW5lciB2aWV3IGFyZWFcbiAgICAgICAgICAgIHNjcm9sbFRvVmFsdWUgPSBvZmZzZXRUb3AgLSBjb250YWluZXJIZWlnaHQgKyBpdGVtSGVpZ2h0O1xuICAgICAgICAgICAgdGhpcy4kZWwuc2Nyb2xsVG9wKHNjcm9sbFRvVmFsdWUpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAob2Zmc2V0VG9wIDwgc2Nyb2xsVG9wKSB7XG5cbiAgICAgICAgICAgIC8vaWYgY3VycmVudCBpdGVtIG9uIHRoZSBjb250YWluZXIgdmlldyBhcmVhXG4gICAgICAgICAgICBzY3JvbGxUb1ZhbHVlID0gb2Zmc2V0VG9wO1xuICAgICAgICAgICAgdGhpcy4kZWwuc2Nyb2xsVG9wKHNjcm9sbFRvVmFsdWUpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBfY2xpY2tIYW5kbGVyKCRpdGVtKSB7XG4gICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICBjb25zdCB0ZW1wSW5kZXggPSArKCRpdGVtLmF0dHIoJ2RhdGEtb3JkZXInKSk7XG4gICAgICAgIHRoaXMuaW5kZXggPSB0ZW1wSW5kZXg7XG4gICAgICAgICQodGhpcykudHJpZ2dlcignc2VsZWN0SXRlbScpO1xuICAgIH1cblxuICAgIF9tb3VzZW92ZXJIYW5kbGVyKCRpdGVtKSB7XG4gICAgICAgIHRoaXMuZ2V0QWxsSXRlbXMoKS5yZW1vdmVDbGFzcyh0aGlzLkhPVkVSX0NMQVNTTkFNRSk7XG4gICAgICAgICRpdGVtLmFkZENsYXNzKHRoaXMuSE9WRVJfQ0xBU1NOQU1FKTtcbiAgICB9XG5cbiAgICBnZXRJbmRleEl0ZW0oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiQoJy4nICsgdGhpcy5pdGVtQ2xhc3NOYW1lKS5lcSh0aGlzLmluZGV4KTtcbiAgICB9XG5cbiAgICBnZXRBbGxJdGVtcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuJCgnLicgKyB0aGlzLml0ZW1DbGFzc05hbWUpO1xuICAgIH1cblxuICAgIGhpZGUoKSB7XG4gICAgICAgIHRoaXMuJGVsLmhpZGUoKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5ID0gJ2hpZGUnO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzaG93KCkge1xuICAgICAgICB0aGlzLiRlbC5zaG93KCk7XG4gICAgICAgIHRoaXMuZGlzcGxheSA9ICdzaG93JztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcmVtb3ZlKCkge1xuICAgICAgICB0aGlzLiRlbC5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5ID0gJ3JlbW92ZSc7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTGlzdFZpZXc7IiwiLyoganNoaW50IGJyb3dzZXI6IHRydWUgKi9cblxuXG4vLyBUaGUgcHJvcGVydGllcyB0aGF0IHdlIGNvcHkgaW50byBhIG1pcnJvcmVkIGRpdi5cbi8vIE5vdGUgdGhhdCBzb21lIGJyb3dzZXJzLCBzdWNoIGFzIEZpcmVmb3gsXG4vLyBkbyBub3QgY29uY2F0ZW5hdGUgcHJvcGVydGllcywgaS5lLiBwYWRkaW5nLXRvcCwgYm90dG9tIGV0Yy4gLT4gcGFkZGluZyxcbi8vIHNvIHdlIGhhdmUgdG8gZG8gZXZlcnkgc2luZ2xlIHByb3BlcnR5IHNwZWNpZmljYWxseS5cbnZhciBwcm9wZXJ0aWVzID0gW1xuICAgICdkaXJlY3Rpb24nLCAgLy8gUlRMIHN1cHBvcnRcbiAgICAnYm94U2l6aW5nJyxcbiAgICAnd2lkdGgnLCAgLy8gb24gQ2hyb21lIGFuZCBJRSwgZXhjbHVkZSB0aGUgc2Nyb2xsYmFyLCBzbyB0aGUgbWlycm9yIGRpdiB3cmFwcyBleGFjdGx5IGFzIHRoZSB0ZXh0YXJlYSBkb2VzXG4gICAgJ2hlaWdodCcsXG4gICAgJ292ZXJmbG93WCcsXG4gICAgJ292ZXJmbG93WScsICAvLyBjb3B5IHRoZSBzY3JvbGxiYXIgZm9yIElFXG5cbiAgICAnYm9yZGVyVG9wV2lkdGgnLFxuICAgICdib3JkZXJSaWdodFdpZHRoJyxcbiAgICAnYm9yZGVyQm90dG9tV2lkdGgnLFxuICAgICdib3JkZXJMZWZ0V2lkdGgnLFxuICAgICdib3JkZXJTdHlsZScsXG5cbiAgICAncGFkZGluZ1RvcCcsXG4gICAgJ3BhZGRpbmdSaWdodCcsXG4gICAgJ3BhZGRpbmdCb3R0b20nLFxuICAgICdwYWRkaW5nTGVmdCcsXG5cbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9DU1MvZm9udFxuICAgICdmb250U3R5bGUnLFxuICAgICdmb250VmFyaWFudCcsXG4gICAgJ2ZvbnRXZWlnaHQnLFxuICAgICdmb250U3RyZXRjaCcsXG4gICAgJ2ZvbnRTaXplJyxcbiAgICAnZm9udFNpemVBZGp1c3QnLFxuICAgICdsaW5lSGVpZ2h0JyxcbiAgICAnZm9udEZhbWlseScsXG5cbiAgICAndGV4dEFsaWduJyxcbiAgICAndGV4dFRyYW5zZm9ybScsXG4gICAgJ3RleHRJbmRlbnQnLFxuICAgICd0ZXh0RGVjb3JhdGlvbicsICAvLyBtaWdodCBub3QgbWFrZSBhIGRpZmZlcmVuY2UsIGJ1dCBiZXR0ZXIgYmUgc2FmZVxuXG4gICAgJ2xldHRlclNwYWNpbmcnLFxuICAgICd3b3JkU3BhY2luZycsXG5cbiAgICAndGFiU2l6ZScsXG4gICAgJ01velRhYlNpemUnXG5cbl07XG5cbnZhciBpc0Jyb3dzZXIgPSAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpO1xudmFyIGlzRmlyZWZveCA9IChpc0Jyb3dzZXIgJiYgd2luZG93Lm1veklubmVyU2NyZWVuWCAhPSBudWxsKTtcblxuZnVuY3Rpb24gZ2V0Q2FyZXRDb29yZGluYXRlcyhlbGVtZW50LCBwb3NpdGlvbiwgb3B0aW9ucykge1xuICAgIGlmICghaXNCcm93c2VyKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigndGV4dGFyZWEtY2FyZXQtcG9zaXRpb24jZ2V0Q2FyZXRDb29yZGluYXRlcyBzaG91bGQgb25seSBiZSBjYWxsZWQgaW4gYSBicm93c2VyJyk7XG4gICAgfVxuXG4gICAgdmFyIGRlYnVnID0gb3B0aW9ucyAmJiBvcHRpb25zLmRlYnVnIHx8IGZhbHNlO1xuICAgIGlmIChkZWJ1Zykge1xuICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjaW5wdXQtdGV4dGFyZWEtY2FyZXQtcG9zaXRpb24tbWlycm9yLWRpdicpO1xuICAgICAgICBpZiAoZWwpIHtcbiAgICAgICAgICAgIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gbWlycm9yZWQgZGl2XG4gICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpdi5pZCA9ICdpbnB1dC10ZXh0YXJlYS1jYXJldC1wb3NpdGlvbi1taXJyb3ItZGl2JztcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRpdik7XG5cbiAgICB2YXIgc3R5bGUgPSBkaXYuc3R5bGU7XG4gICAgdmFyIGNvbXB1dGVkID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUgPyBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpIDogZWxlbWVudC5jdXJyZW50U3R5bGU7ICAvLyBjdXJyZW50U3R5bGUgZm9yIElFIDwgOVxuXG4gICAgLy8gZGVmYXVsdCB0ZXh0YXJlYSBzdHlsZXNcbiAgICBzdHlsZS53aGl0ZVNwYWNlID0gJ3ByZS13cmFwJztcbiAgICBpZiAoZWxlbWVudC5ub2RlTmFtZSAhPT0gJ0lOUFVUJylcbiAgICAgICAgc3R5bGUud29yZFdyYXAgPSAnYnJlYWstd29yZCc7ICAvLyBvbmx5IGZvciB0ZXh0YXJlYS1zXG5cbiAgICAvLyBwb3NpdGlvbiBvZmYtc2NyZWVuXG4gICAgc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnOyAgLy8gcmVxdWlyZWQgdG8gcmV0dXJuIGNvb3JkaW5hdGVzIHByb3Blcmx5XG4gICAgaWYgKCFkZWJ1ZylcbiAgICAgICAgc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nOyAgLy8gbm90ICdkaXNwbGF5OiBub25lJyBiZWNhdXNlIHdlIHdhbnQgcmVuZGVyaW5nXG5cbiAgICAvLyB0cmFuc2ZlciB0aGUgZWxlbWVudCdzIHByb3BlcnRpZXMgdG8gdGhlIGRpdlxuICAgIHByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbiAocHJvcCkge1xuICAgICAgICBzdHlsZVtwcm9wXSA9IGNvbXB1dGVkW3Byb3BdO1xuICAgIH0pO1xuXG4gICAgaWYgKGlzRmlyZWZveCkge1xuICAgICAgICAvLyBGaXJlZm94IGxpZXMgYWJvdXQgdGhlIG92ZXJmbG93IHByb3BlcnR5IGZvciB0ZXh0YXJlYXM6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTk4NDI3NVxuICAgICAgICBpZiAoZWxlbWVudC5zY3JvbGxIZWlnaHQgPiBwYXJzZUludChjb21wdXRlZC5oZWlnaHQpKVxuICAgICAgICAgICAgc3R5bGUub3ZlcmZsb3dZID0gJ3Njcm9sbCc7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJzsgIC8vIGZvciBDaHJvbWUgdG8gbm90IHJlbmRlciBhIHNjcm9sbGJhcjsgSUUga2VlcHMgb3ZlcmZsb3dZID0gJ3Njcm9sbCdcbiAgICB9XG5cbiAgICBkaXYudGV4dENvbnRlbnQgPSBlbGVtZW50LnZhbHVlLnN1YnN0cmluZygwLCBwb3NpdGlvbik7XG4gICAgLy8gdGhlIHNlY29uZCBzcGVjaWFsIGhhbmRsaW5nIGZvciBpbnB1dCB0eXBlPVwidGV4dFwiIHZzIHRleHRhcmVhOiBzcGFjZXMgbmVlZCB0byBiZSByZXBsYWNlZCB3aXRoIG5vbi1icmVha2luZyBzcGFjZXMgLSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xMzQwMjAzNS8xMjY5MDM3XG4gICAgaWYgKGVsZW1lbnQubm9kZU5hbWUgPT09ICdJTlBVVCcpXG4gICAgICAgIGRpdi50ZXh0Q29udGVudCA9IGRpdi50ZXh0Q29udGVudC5yZXBsYWNlKC9cXHMvZywgJ1xcdTAwYTAnKTtcblxuICAgIHZhciBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIC8vIFdyYXBwaW5nIG11c3QgYmUgcmVwbGljYXRlZCAqZXhhY3RseSosIGluY2x1ZGluZyB3aGVuIGEgbG9uZyB3b3JkIGdldHNcbiAgICAvLyBvbnRvIHRoZSBuZXh0IGxpbmUsIHdpdGggd2hpdGVzcGFjZSBhdCB0aGUgZW5kIG9mIHRoZSBsaW5lIGJlZm9yZSAoIzcpLlxuICAgIC8vIFRoZSAgKm9ubHkqIHJlbGlhYmxlIHdheSB0byBkbyB0aGF0IGlzIHRvIGNvcHkgdGhlICplbnRpcmUqIHJlc3Qgb2YgdGhlXG4gICAgLy8gdGV4dGFyZWEncyBjb250ZW50IGludG8gdGhlIDxzcGFuPiBjcmVhdGVkIGF0IHRoZSBjYXJldCBwb3NpdGlvbi5cbiAgICAvLyBmb3IgaW5wdXRzLCBqdXN0ICcuJyB3b3VsZCBiZSBlbm91Z2gsIGJ1dCB3aHkgYm90aGVyP1xuICAgIHNwYW4udGV4dENvbnRlbnQgPSBlbGVtZW50LnZhbHVlLnN1YnN0cmluZyhwb3NpdGlvbikgfHwgJy4nOyAgLy8gfHwgYmVjYXVzZSBhIGNvbXBsZXRlbHkgZW1wdHkgZmF1eCBzcGFuIGRvZXNuJ3QgcmVuZGVyIGF0IGFsbFxuICAgIGRpdi5hcHBlbmRDaGlsZChzcGFuKTtcblxuICAgIHZhciBjb29yZGluYXRlcyA9IHtcbiAgICAgICAgdG9wOiBzcGFuLm9mZnNldFRvcCArIHBhcnNlSW50KGNvbXB1dGVkWydib3JkZXJUb3BXaWR0aCddKSxcbiAgICAgICAgbGVmdDogc3Bhbi5vZmZzZXRMZWZ0ICsgcGFyc2VJbnQoY29tcHV0ZWRbJ2JvcmRlckxlZnRXaWR0aCddKVxuICAgIH07XG5cbiAgICBpZiAoZGVidWcpIHtcbiAgICAgICAgc3Bhbi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI2FhYSc7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChkaXYpO1xuICAgIH1cblxuICAgIHJldHVybiBjb29yZGluYXRlcztcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0Q2FyZXRDb29yZGluYXRlcztcbiIsImltcG9ydCBsaXN0VmlldyBmcm9tICcuL2xpc3RWaWV3JztcbmltcG9ydCBnZXRDYXJldENvb3JkaW5hdGVzIGZyb20nLi90ZXh0YXJlYV9jYXJldCc7XG5cbmNvbnN0IGtleUNvZGUgPSB7XG4gICAgJ0VTQyc6IDI3LFxuICAgICdFTlRFUic6IDEzLFxuICAgICdVUCc6IDM4LFxuICAgICdET1dOJzogNDBcbn07XG5cbmNsYXNzIFN1Z2dlc3Qge1xuXG4gICAgY29uc3RydWN0b3IoJGlucHV0V3JhcHBlciwgZGF0YUNvbmZpZykge1xuICAgICAgICB0aGlzLiRlbCA9ICRpbnB1dFdyYXBwZXI7XG4gICAgICAgIHRoaXMuJGlucHV0ID0gJGlucHV0V3JhcHBlci5maW5kKCcuaW5wdXQnKTtcbiAgICAgICAgdGhpcy4kZ2V0UG9zSW5wdXQgPSAkaW5wdXRXcmFwcGVyLmZpbmQoJy5pbnB1dC1wb3MtaGVscCcpOy8v55So5LqO5a6a5L2NbGlzdHZpZXcg55qE6L6F5YqpaW5wdXRcbiAgICAgICAgdGhpcy5saXN0VmlldyA9IG5ldyBsaXN0Vmlldyh7XG4gICAgICAgICAgICAkZWw6ICRpbnB1dFdyYXBwZXIuZmluZCgnLnVpLWF1dG9jb21wbGV0ZScpXG4gICAgICAgIH0pO1xuICAgICAgICAvLyB0aGlzLmRhdGFDb25maWcgPSBkYXRhQ29uZmlnIHx8IFtdO1xuICAgICAgICAvLyB0aGlzLm1ha2VEYXRhT2JqID0ge307IC8v55Sf5oiQ5pWw5o2u55qEbWFw5a+56LGhXG4gICAgICAgIC8vIHRoaXMubWFya3MgPSBbXTsgLy9tYXJrc+aVsOe7hFxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgdGhpcy51cGRhdGVDb25maWcoZGF0YUNvbmZpZyk7XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5pbml0RXZlbnQoKTtcbiAgICB9XG5cbiAgICBpbml0RXZlbnQoKSB7XG4gICAgICAgIGxldCBtZSA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kaW5wdXQub24oJ2tleWRvd24nLCAkLnByb3h5KHRoaXMuX2tleURvd25IYW5kbGVyLCB0aGlzKSk7XG5cbiAgICAgICAgdGhpcy4kaW5wdXQub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbWUudXBkYXRlTGlzdFZpZXcoKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCgnYm9keScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIG1lLmxpc3RWaWV3LmhpZGUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCh0aGlzLmxpc3RWaWV3KS5vbignc2VsZWN0SXRlbScsICgpID0+IHtcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IHRoaXMubGlzdFZpZXcudmFsdWU7XG4gICAgICAgICAgICBpZih0aGlzLmxpc3RWaWV3LmN1cnJlbnRJdGVtSXNSZXBsYWNlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50TWFyay5yZXBsYWNlVmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2VsZWN0TGlzdFZpZXdJdGVtKHZhbHVlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdXBkYXRlQ29uZmlnKGRhdGFDb25maWcpIHtcbiAgICAgICAgdGhpcy5tYXJrcyA9IFtdO1xuICAgICAgICB0aGlzLm1ha2VEYXRhT2JqID0ge307XG4gICAgICAgIHRoaXMuZGF0YUNvbmZpZyA9IGRhdGFDb25maWc7XG4gICAgICAgIHRoaXMucGFyc2VEYXRhQ29uZmlnKCk7XG4gICAgfVxuXG4gICAgcGFyc2VEYXRhQ29uZmlnKCkge1xuICAgICAgICBpZiAodGhpcy5kYXRhQ29uZmlnLmNvbnN0cnVjdG9yID09IEFycmF5KSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpIGluIHRoaXMuZGF0YUNvbmZpZykge1xuICAgICAgICAgICAgICAgIHRoaXMucGFyc2VEYXRhSXRlbSh0aGlzLmRhdGFDb25maWdbaV0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5kYXRhQ29uZmlnLmNvbnN0cnVjdG9yID09IE9iamVjdCkge1xuICAgICAgICAgICAgdGhpcy5wYXJzZURhdGFJdGVtKHRoaXMuZGF0YUNvbmZpZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwYXJzZURhdGFJdGVtKGl0ZW0pIHtcbiAgICAgICAgbGV0IG1hcmtOYW1lID0gaXRlbS5tYXJrO1xuICAgICAgICB0aGlzLm1hcmtzLnB1c2goe1xuICAgICAgICAgICAgdmFsdWU6ICcnLFxuICAgICAgICAgICAgc3RyOiAnJyxcbiAgICAgICAgICAgIG1hcmtOYW1lOiBtYXJrTmFtZSxcbiAgICAgICAgICAgIHN1Z2dlc3RQb3NpdGlvbjogaXRlbS5zdWdnZXN0UG9zaXRpb24sXG4gICAgICAgICAgICByZW5kZXJBZnRlcjogaXRlbS5yZW5kZXJBZnRlcixcbiAgICAgICAgICAgIHJlbmRlckJlZm9yZTogaXRlbS5yZW5kZXJCZWZvcmUsXG4gICAgICAgICAgICBuZXh0OiBmYWxzZSxcbiAgICAgICAgICAgIHJlbmRlclJlcGxhY2VWYWx1ZTogaXRlbS5yZW5kZXJSZXBsYWNlVmFsdWUsXG4gICAgICAgICAgICByZXBsYWNlVmFsdWU6JycsXG4gICAgICAgICAgICBqdW1wQ3VycmVudDogaXRlbS5qdW1wQ3VycmVudFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5tYWtlRGF0YU9ialttYXJrTmFtZV0gPSBpdGVtLmdldERhdGE7XG4gICAgfVxuXG4gICAgcmVzZXRNYXJrKG1hcmspIHtcbiAgICAgICAgbWFyay5sZWZ0UG9zID0gJyc7XG4gICAgICAgIG1hcmsucmlnaHRQb3MgPSAnJztcbiAgICAgICAgbWFyay52YWx1ZSA9ICcnO1xuICAgICAgICBtYXJrLnN0ciA9ICcnO1xuICAgICAgICBtYXJrLm5leHQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBfa2V5RG93bkhhbmRsZXIoZSkge1xuICAgICAgICBzd2l0Y2ggKGUua2V5Q29kZSkge1xuICAgICAgICAgICAgY2FzZSBrZXlDb2RlLlVQIDpcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5saXN0Vmlldy5pbmRleC0tO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBrZXlDb2RlLkRPV046XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMubGlzdFZpZXcuaW5kZXgrKztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2Uga2V5Q29kZS5FTlRFUjpcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RMaXN0Vmlld0l0ZW0odGhpcy5saXN0Vmlldy52YWx1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5saXN0Vmlldy5oaWRlKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGtleUNvZGUuRVNDOlxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RWaWV3LmhpZGUoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVMaXN0VmlldygpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlTGlzdFZpZXcoKSB7XG4gICAgICAgIGxldCBtZSA9IHRoaXM7XG4gICAgICAgIGlmICh0aGlzLnVwZGF0ZVRpbWVyKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy51cGRhdGVUaW1lcik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnVwZGF0ZVRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB1cGRhdGVMaXN0Vmlld1RpbWVySGFuZGxlcigpO1xuICAgICAgICB9LCAxMDApO1xuXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZUxpc3RWaWV3VGltZXJIYW5kbGVyKCkge1xuICAgICAgICAgICAgbGV0IHZhbHVlID0gbWUuZ2V0U3RyQmVmb3JlQ3Vyc29yKCk7IC8v5b6X5Yiw5YWJ5qCH5LmL5YmN55qE5a2X56ym5LiyXG4gICAgICAgICAgICBjb25zdCBwYXJzZVJlc3VsdCA9IG1lLnJlc2V0UGFyc2VSZXN1bHQobWUuJGlucHV0LnZhbCgpLCB2YWx1ZS5sZW5ndGgpOy8v6Kej5p6Q5a2X56ym5LiyXG4gICAgICAgICAgICBtZS5yZXNldEN1cnJlbnRNYXJrKHBhcnNlUmVzdWx0KTsvL+agueaNruWtl+espuS4suiuvue9rmN1cnJlbnRNYXJrLCBjYWNoZXN0ciDnrYnlgLxcbiAgICAgICAgICAgIHZhbHVlID0gbWUuZ2V0U3RyQmVmb3JlQ3Vyc29yKCk7Ly/lhYnmoIfkvY3nva7mnInlj6/og73kvJrlj5jljJZcbiAgICAgICAgICAgIG1lLnJlc2V0Q3VycmVudEN1cnNvclJlY3QodmFsdWUpOy8v5b6X5Yiw5YWJ5qCH5L2N572u5a+56LGhXG4gICAgICAgICAgICBtZS5yZWZyZXNoTGlzdFZpZXcoKTsgLy/moLnmja5jdXJyZW50TWFyayDor7fmsYLmlbDmja4sIOWIt+aWsGxpc3R2aWV3XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfZmlsdGVyUmFyc2VSZXN1bHQocGFyc2VSZXN1bHQpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHBhcnNlUmVzdWx0Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgaWYgKHBhcnNlUmVzdWx0W2ldLnR5cGUgPT0gJ21hcmsnKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gocGFyc2VSZXN1bHRbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcmVzZXRDdXJyZW50TWFyayhwYXJzZVJlc3VsdCkge1xuICAgICAgICB0aGlzLmN1cnJlbnRNYXJrID0gbnVsbDtcbiAgICAgICAgdGhpcy5zdHJDYWNoZSA9ICcnO1xuICAgICAgICB0aGlzLmlucHV0VXRpbE9iaiA9IHt9O1xuICAgICAgICBsZXQgbWFya1BvcyA9IC0xO1xuICAgICAgICBsZXQgbWUgPSB0aGlzO1xuXG4gICAgICAgIC8qKipcbiAgICAgICAgICogcGFyc2VSZXN1bHQg5LiOIG1hcmtzIOS4gOS4gOWMuemFjVxuICAgICAgICAgKiBtYXJrUG9zIOiusOW9leWMuemFjeacgOWQjuS4gOasoeaIkOWKn+eahOS9jee9riwgbWFya1BvcyDmnIDlkI7kvY3nva7nmoTmiYDmnIltYXJrIOmDveS8muiiq+mHjee9rihyZXNldE1hcmspXG4gICAgICAgICAqL1xuICAgICAgICBpZiAodGhpcy5tYXJrcyAmJiB0aGlzLm1hcmtzLmxlbmd0aCA+IDAgJiYgcGFyc2VSZXN1bHQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbGV0IHJlc2V0ID0gZmFsc2U7XG4gICAgICAgICAgICAvL21hdGNoIHN0ciB3aXRoIG1hcmtzIHF1ZXVlc1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLm1hcmtzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBtYXJrID0gdGhpcy5tYXJrc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAocmVzZXQgfHwgIXBhcnNlUmVzdWx0W2ldIHx8IHBhcnNlUmVzdWx0W2ldLnR5cGUgPT0gJ3VubWFyaycpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNldE1hcmsobWFyayk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChtYXJrLm1hcmtOYW1lID09IHBhcnNlUmVzdWx0W2ldLm1hcmtOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIG1hcmtQb3MgPSBpO1xuICAgICAgICAgICAgICAgICAgICBtYXJrLm5leHQgPSBwYXJzZVJlc3VsdFtpXS5uZXh0O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc2V0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKioqXG4gICAgICAgICAqIOabtOWFt21hcmtQb3Mg5ZKMIOS4iumdoueahOWMuemFjee7k+aenCwg5p2l6KeJ5b6X5b2T5YmNbWFya1xuICAgICAgICAgKi9cbiAgICAgICAgaWYgKG1hcmtQb3MgIT09IC0xKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5tYXJrc1ttYXJrUG9zXVsnbmV4dCddKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1hcmtQb3MgPT0gdGhpcy5tYXJrcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIC8v5aaC5p6c6LaF5Ye655WM6ZmQXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RyQ2FjaGUgPSBidWlsZFN0ckNhY2hlKHRoaXMubWFya3MubGVuZ3RoIC0gMik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudE1hcmsgPSB0aGlzLm1hcmtzW21hcmtQb3NdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudE1hcmsgPSB0aGlzLm1hcmtzW21hcmtQb3MgKyAxXTsvL+S4i+S4gOS4qm1hcmsg5Li65b2T5YmNbWFya1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0ckNhY2hlID0gYnVpbGRTdHJDYWNoZShtYXJrUG9zKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHN0YXJ0U3RyUmVuZGVyQmVmb3JlID0gdGhpcy5jdXJyZW50TWFyay5yZW5kZXJCZWZvcmUgJiYgdGhpcy5jdXJyZW50TWFyay5yZW5kZXJCZWZvcmUuYWRkU3RyQXRTdGFydCgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhcnRTdHJSZW5kZXJCZWZvcmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJzZVJlc3VsdFttYXJrUG9zICsgMV0gJiYgcGFyc2VSZXN1bHRbbWFya1BvcyArIDFdLnN0ci5pbmRleE9mKHN0YXJ0U3RyUmVuZGVyQmVmb3JlKSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFwYXJzZVJlc3VsdFttYXJrUG9zICsgMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgc3RhcnQgPSB0aGlzLmN1cnJlbnRNYXJrLnJlbmRlckJlZm9yZS5hZGRTdHJBdFN0YXJ0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNhY2hlU3RyID0gKHBhcnNlUmVzdWx0W21hcmtQb3MgKyAxXSAmJiBwYXJzZVJlc3VsdFttYXJrUG9zICsgMV0uc3RyKSB8fCAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiRpbnB1dC52YWwodGhpcy5zdHJDYWNoZSArICcgJyArIHN0YXJ0ICsgY2FjaGVTdHIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudE1hcmsgPSB0aGlzLm1hcmtzW21hcmtQb3NdOy8vIOWMuemFjeaIkOWKn+eahOacgOWQjuS4gOS4qm1hcmvkuLpjdXJyZW50TWFya1xuICAgICAgICAgICAgICAgIHRoaXMuc3RyQ2FjaGUgPSBidWlsZFN0ckNhY2hlKG1hcmtQb3MgLSAxKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRNYXJrID0gdGhpcy5tYXJrc1swXTsvL+esrOS4gOS4qm1hcmvkuLrlvZPliY1tYXJrXG4gICAgICAgICAgICB0aGlzLnN0ckNhY2hlID0gJyc7XG4gICAgICAgIH1cblxuICAgICAgICAvL+agh+iusOWFieagh+aJgOWcqOeahG1hcmvmmK/lrozmlbTnmoTlrZfnrKbkuLIgKOihqOaYjm1hcmvnmoTlrZfnrKbkuLLmsqHmnInkv67mlLnov4cpXG4gICAgICAgIC8v5Lya5pyJ6L+Z5LmI5LiA5Liq6ZyA5rGCOiDlpoLmnpzlrZfnrKbkuLLmsqHmnInkv67mlLksIOeCueWHu+eahOaXtuWAmemcgOimgeW8ueWHuuWFqOmDqOeahGxpc3QsIOaJgOS7pei/memHjOagh+iusOS4gOS4i1xuICAgICAgICBpZiAocGFyc2VSZXN1bHRbbWFya1Bvc10gJiYgcGFyc2VSZXN1bHRbbWFya1Bvc10uYXRQb3NSaWdodCkge1xuICAgICAgICAgICAgdGhpcy5pbnB1dFV0aWxPYmouaXNDb21wbGV0ZSA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvL2lucHV0U3RyIOS4uuaQnOe0oumcgOimgeeahOWtl+espuS4slxuICAgICAgICBpZiAocGFyc2VSZXN1bHQubGVuZ3RoID4gMCAmJiBwYXJzZVJlc3VsdFtwYXJzZVJlc3VsdC5sZW5ndGggLSAxXS50eXBlID09ICd1bm1hcmsnKSB7XG4gICAgICAgICAgICBsZXQgc3RyID0gcGFyc2VSZXN1bHRbcGFyc2VSZXN1bHQubGVuZ3RoIC0gMV0uc3RyO1xuICAgICAgICAgICAgdGhpcy5pbnB1dFV0aWxPYmouaW5wdXRTdHIgPSB0aGlzLmdldE1hcmtTdHJFeGNlcHRFeHRlcm5hbFN0cihzdHIsIHRoaXMuY3VycmVudE1hcmspO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pbnB1dFV0aWxPYmouaW5wdXRTdHIgPSAnJztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGJ1aWxkU3RyQ2FjaGUobCkge1xuICAgICAgICAgICAgbGV0IHN0ciA9ICcnO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgc3RyICs9IG1lLm1ha2VNYXJrU3RyKG1lLm1hcmtzW2ldKSArICcgJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzdHI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZWZyZXNoTGlzdFZpZXcoKSB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRDdXJzb3JSZWN0KSB7XG4gICAgICAgICAgICB0aGlzLmxpc3RWaWV3LiRlbC5jc3Moe1xuICAgICAgICAgICAgICAgIGxlZnQ6IHRoaXMuY3VycmVudEN1cnNvclJlY3QueCxcbiAgICAgICAgICAgICAgICB0b3A6IHRoaXMuY3VycmVudEN1cnNvclJlY3QueVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY3VycmVudE1hcmspIHtcbiAgICAgICAgICAgIC8v5qC55o2u5b2T5YmNbWFya+WOu2dldGRhdGFcbiAgICAgICAgICAgIHRoaXMubWFrZURhdGFPYmpbdGhpcy5jdXJyZW50TWFyay5tYXJrTmFtZV0odGhpcy5pbnB1dFV0aWxPYmopLnRoZW4oKGRhdGEsIHRlbXBsYXRlKSA9PiB7XG4gICAgICAgICAgICAgICAgLy/liLfmlrBsaXN0dmlld1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxpc3RWaWV3LnJlZnJlc2goZGF0YSwgdGVtcGxhdGUpLnNob3coKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxpc3RWaWV3LmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOWPguaVsDpcbiAgICAgKiAgICAgIHN0cjog6KaB6Kej5p6Q55qE5a2X56ym5LiyXG4gICAgICogICAgICBwb3M6IOWFieagh+aJgOWcqOeahOS9jee9rlxuICAgICAqXG4gICAgICog6Kej5p6Q6KeE5YiZOlxuICAgICAqICAgICAg5Lul5a2X56ym5Liy5omr5o+P55qE5pa55byPLCDku47lt6blkJHlj7Pmiavmj49cbiAgICAgKiAgICAgIOavj+aJq+aPj+S4gOS4quWtl+espixcbiAgICAgKiAgICAgICAgICDlpoLmnpzor6XlrZfnrKbmmK/nqbrmoLwsIOi3s+i/h+aJq+aPj1xuICAgICAqICAgICAgICAgIOWmguaenOS4jeaYr+epuuagvCwg5bCx5Yik5pat6K+l5a2X56ym5piv5LiN5piv5Yy56YWN5bey57uP5a2Y5Zyo55qEbWFya1xuICAgICAqICAgICAgICAgICAgICDoi6XljLnphY0sIOWImXJlc3VsdC5wdXNoKHt0eXBlOlwibWFya1wifSlcbiAgICAgKiAgICAgICAgICAgICAgICAgIOiLpeWMuemFjeeahOacgOWkp+WPs+i+ueeVjOWkp+S6juWFieagh+eahOS9jee9riwg5YiZ5aKe5YqgYXRQb3NSaWdodOWxnuaApywg57uT5p2f5omr5o+PXG4gICAgICogICAgICAgICAgICAgICAgICDlpoLmnpzmsqHliLDovrnnlYwsIOWImeabtOaUueWtl+espue0ouW8leS9jee9rihpKSwg57un57ut5omr5o+PXG4gICAgICogICAgICAgICAgICAgIOiLpeS4jeWMuemFjSwg5YiZcmVzdWx0LnB1c2goe3R5cGU6XCJ1bm1hcmtcIn0pLCDnu5PmnZ/miavmj49cbiAgICAgKiDov5Tlm57nu5Pmnpw6XG4gICAgICogICAgICByZXN1bHQg6Zif5YiXICwg5q+P5LiqaXRlbeaYr+S4gOS4quWvueixoSAsIOWvueixoemHjOagh+WQjeivpeWvueixoeeahOeJueW+gVxuICAgICAqICAgICAgZWcxOiBbe3R5cGU6J21hcmsnLG1hcmtOYW1lOid1c2Vycyd9LCB7dHlwZTonbWFyaycsIG1hcmtOYW1lOidib29rcycsYXRQb3NSaWdodH1dXG4gICAgICogICAgICAgICAgIOihqOaYjjog5Zyo5b2T5YmN5YWJ5qCH5aSELCDmiavmj4/lh7rmnaXkuobkuKTkuKptYXJrIOWvueixoSwg5LiU5pyA5ZCO5LiA5LiqbWFya+WvueixoeS5i+S4ilxuICAgICAqICAgICAgZWcyOiBbe3R5cGU6J21hcmsnLG1hcmtOYW1lOid1c2Vycyd9LCB7dHlwZTondW5tYXJrJywgc3RyOidzdHInfV1cbiAgICAgKiAgICAgICAgICAg6KGo5piOOiDlnKjlvZPliY3lhYnmoIfnmoTkvY3nva7kuIosIOWPquaJq+aPj+WIsOS6huS4gOS4qm1hcmsg5a+56LGhLCDliankuIvnmoTmmK91bm1hcmsg5a+56LGhXG4gICAgICogICAgICAgICAgICjkuI3ljLnphY1tYXJrIOeahOWtl+espiAsIOS4gOW+i+inhuS4unVubWFyaylcbiAgICAgKiAqL1xuICAgIHJlc2V0UGFyc2VSZXN1bHQoc3RyLCBwb3MpIHtcbiAgICAgICAgbGV0IG1hcmtzID0gJC5leHRlbmQodHJ1ZSwgW10sIHRoaXMubWFya3MpO1xuICAgICAgICBsZXQgcmVzdWx0ID0gW107XG4gICAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gc3RyLmxlbmd0aDsgaSA8IGw7IGkpIHsgLy9jb3VudCDmmK/kuLrkuobpmLLmraLnqIvluo/plJnor68s5a+86Ie0Zm9y55qE5q275b6q546vXG4gICAgICAgICAgICBpZiAoY291bnQrKyA+IGwpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHMgPSBzdHJbaV07XG4gICAgICAgICAgICBpZiAocyA9PSAnICcpIHsgLy9cbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXVsnbmV4dCddID0gdHJ1ZTsvL25leHTooajnpLosIOaYr+WQpumcgOimgeWxleekuuS4i+S4gOS4qm1hcmtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gbGV0IGlzTWFya1N0ciA9IGZhbHNlO1xuXG4gICAgICAgICAgICAvL2NoYWNrIGJ5IG1hcmtcbiAgICAgICAgICAgIGxldCBtYXJrID0gbWFya3NbMF07XG4gICAgICAgICAgICBsZXQgbWFya1N0ciA9IG1hcmsuc3RyO1xuICAgICAgICAgICAgLy8gZm9yIChsZXQgaiBpbiB0aGlzLm1hcmtzKSB7XG4gICAgICAgICAgICAvLyAgICAgbGV0IG1hcmsgPSB0aGlzLm1hcmtzW2pdO1xuXG4gICAgICAgICAgICAvLyR7bWFyay5zdHJ9eHh4IOS4jeeul+S4gOS4qm1hcmtcbiAgICAgICAgICAgIC8vIGlmIChtYXJrLnJlbmRlclJlcGxhY2VWYWx1ZSkgeyAvL+avlOi+g3JlcGxhY2XlgLwsIOS4jeavlOi+g29yaWdpbuWAvFxuICAgICAgICAgICAgLy8gICAgIG1hcmtTdHIgPSBtYXJrLnJlcGxhY2VWYWx1ZSB8fCAnJztcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIGxldCBtYXRjaFZhbHVlID0gaSArIG1hcmtTdHIubGVuZ3RoID09PSBsID8gbWFya1N0ciA6IG1hcmtTdHIgKyAnICc7XG4gICAgICAgICAgICBpZiAoc3RyLnNsaWNlKGkpLmluZGV4T2YobWF0Y2hWYWx1ZSkgPT09IDApIHtcbiAgICAgICAgICAgICAgICBsZXQgb2JqID0ge1xuICAgICAgICAgICAgICAgICAgICBtYXJrTmFtZTogbWFyay5tYXJrTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ21hcmsnXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKG9iaik7XG5cbiAgICAgICAgICAgICAgICAvL+WmguaenOWcqOWFieagh+WPs+i+uVxuICAgICAgICAgICAgICAgIGlmIChpICsgbWF0Y2hWYWx1ZS5sZW5ndGggPiBwb3MpIHtcbiAgICAgICAgICAgICAgICAgICAgb2JqLmF0UG9zUmlnaHQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50UGFyc2VSZXN1bHQgPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbWFya3Muc3BsaWNlKDAsIDEpOy8v5Yig6Zmk5Yy56YWN5oiQ5Yqf55qEbWFya1xuICAgICAgICAgICAgICAgIGkgKz0gbWFya1N0ci5sZW5ndGg7XG4gICAgICAgICAgICAgICAgLy8gaXNNYXJrU3RyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAvLyBicmVhaztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy/lpoLmnpxtYXJr5rKh5pyJ5Yy56YWN5oiQ5YqfLCDliJlcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd1bm1hcmsnLFxuICAgICAgICAgICAgICAgICAgICBzdHI6IHN0ci5zbGljZShpKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIC8vIGxldCBsYXN0ID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICAvLyBpZiAoIWxhc3QgfHwgbGFzdC50eXBlICE9ICd1bm1hcmsnKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIHR5cGU6ICd1bm1hcmsnLFxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgc3RyOiBzdHIuc2xpY2UoaSlcbiAgICAgICAgICAgICAgICAvLyAgICAgfSk7XG4gICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRQYXJzZVJlc3VsdCA9IHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIC8vIGlmICghaXNNYXJrU3RyKSB7XG4gICAgICAgICAgICAvLyAgICAgbGV0IGxhc3QgPSByZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgLy8gICAgIGlmICghbGFzdCB8fCBsYXN0LnR5cGUgIT0gJ3VubWFyaycpIHtcbiAgICAgICAgICAgIC8vICAgICAgICAgcmVzdWx0LnB1c2goe1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgdHlwZTogJ3VubWFyaycsXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBzdHI6IHN0ci5zbGljZShpKVxuICAgICAgICAgICAgLy8gICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vICAgICB9XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFBhcnNlUmVzdWx0ID0gcmVzdWx0O1xuICAgIH1cblxuICAgIC8vbWFya3N0ciDmmK/kuI3ljIXmi6xyZW5kZXJCZWZvcmUuYWRkU3RyQXRTdGFydCDov5nkuKrlrZfnrKbnmoRcbiAgICBtYWtlTWFya1N0cihtYXJrKSB7XG4gICAgICAgIG1hcmsucmVuZGVyQWZ0ZXJFbmRTdHIgPSAnJztcbiAgICAgICAgbWFyay5yZW5kZXJBZnRlclN0YXJ0U3RyID0gJyc7XG5cbiAgICAgICAgaWYgKG1hcmsucmVuZGVyQWZ0ZXIgJiYgbWFyay5yZW5kZXJBZnRlci5hZGRTdHJBdFN0YXJ0KSB7XG4gICAgICAgICAgICBtYXJrLnJlbmRlckFmdGVyU3RhcnRTdHIgPSBtYXJrLnJlbmRlckFmdGVyLmFkZFN0ckF0U3RhcnQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtYXJrLnJlbmRlckFmdGVyICYmIG1hcmsucmVuZGVyQWZ0ZXIuYWRkU3RyQXRFbmQpIHtcbiAgICAgICAgICAgIG1hcmsucmVuZGVyQWZ0ZXJFbmRTdHIgPSBtYXJrLnJlbmRlckFmdGVyLmFkZFN0ckF0RW5kKCk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgdmFsdWUgPSBtYXJrLnJlcGxhY2VWYWx1ZSB8fCBtYXJrLnZhbHVlO1xuXG4gICAgICAgIHJldHVybiBtYXJrLnJlbmRlckFmdGVyU3RhcnRTdHIgKyB2YWx1ZSArIG1hcmsucmVuZGVyQWZ0ZXJFbmRTdHI7XG4gICAgfVxuXG4gICAgZ2V0TWFya1N0ckV4Y2VwdEV4dGVybmFsU3RyKHN0ciwgbWFyaykge1xuICAgICAgICBpZiAobWFyay5yZW5kZXJCZWZvcmUgJiYgbWFyay5yZW5kZXJCZWZvcmUuYWRkU3RyQXRTdGFydCkge1xuICAgICAgICAgICAgc3RyID0gc3RyLnNsaWNlKG1hcmsucmVuZGVyQmVmb3JlLmFkZFN0ckF0U3RhcnQubGVuZ3RoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBiZWZvcmUgPSBtYXJrLnJlbmRlckFmdGVyU3RhcnRTdHI7XG4gICAgICAgIGxldCBhZnRlciA9IG1hcmsucmVuZGVyQWZ0ZXJFbmRTdHI7XG4gICAgICAgIGlmIChiZWZvcmUgJiYgc3RyLmluZGV4T2YoYmVmb3JlKSA9PSAwKSB7XG4gICAgICAgICAgICBzdHIgPSBzdHIuc2xpY2UoYmVmb3JlLmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFmdGVyICYmIHN0ci5pbmRleE9mKGFmdGVyKSA9PSBzdHIubGVuZ3RoIC0gYWZ0ZXIubGVuZ3RoKSB7XG4gICAgICAgICAgICBzdHIgPSBzdHIuc2xpY2UoMCwgc3RyLmxlbmd0aCAtIGFmdGVyLmxlbmd0aCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc3RyO1xuICAgIH1cblxuICAgIHNlbGVjdExpc3RWaWV3SXRlbSh2YWwpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50TWFyay52YWx1ZSA9IHZhbDtcbiAgICAgICAgbGV0IHN0ciA9IHRoaXMuY3VycmVudE1hcmsuc3RyID0gdGhpcy5tYWtlTWFya1N0cih0aGlzLmN1cnJlbnRNYXJrKTtcbiAgICAgICAgdGhpcy4kaW5wdXQudmFsKHRoaXMuc3RyQ2FjaGUgKyBzdHIpO1xuICAgICAgICAkKHRoaXMpLnRyaWdnZXIoJ21hcmtDaGFuZ2UnLCAkLmV4dGVuZCh7fSwgdGhpcy5jdXJyZW50TWFyaykpO1xuICAgICAgICB0aGlzLnNldENhcmV0UG9zaXRpb24odGhpcy4kaW5wdXQudmFsKCkubGVuZ3RoKTtcbiAgICB9XG5cbiAgICBnZXRDdXJzb3J0UG9zaXRpb24oKSB7IC8v6I635Y+W5YWJ5qCH5L2N572u5Ye95pWwXG4gICAgICAgIGNvbnN0IGN0cmwgPSB0aGlzLiRpbnB1dFswXTtcbiAgICAgICAgdmFyIENhcmV0UG9zID0gMDsgLy8gSUUgU3VwcG9ydFxuICAgICAgICBpZiAoZG9jdW1lbnQuc2VsZWN0aW9uKSB7XG4gICAgICAgICAgICBjdHJsLmZvY3VzKCk7XG4gICAgICAgICAgICB2YXIgU2VsID0gZG9jdW1lbnQuc2VsZWN0aW9uLmNyZWF0ZVJhbmdlKCk7XG4gICAgICAgICAgICBTZWwubW92ZVN0YXJ0KCdjaGFyYWN0ZXInLCAtY3RybC52YWx1ZS5sZW5ndGgpO1xuICAgICAgICAgICAgQ2FyZXRQb3MgPSBTZWwudGV4dC5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRmlyZWZveCBzdXBwb3J0XG4gICAgICAgIGVsc2UgaWYgKGN0cmwuc2VsZWN0aW9uU3RhcnQgfHwgY3RybC5zZWxlY3Rpb25TdGFydCA9PSAnMCcpXG4gICAgICAgICAgICBDYXJldFBvcyA9IGN0cmwuc2VsZWN0aW9uU3RhcnQ7XG4gICAgICAgIHJldHVybiAoQ2FyZXRQb3MpO1xuICAgIH1cblxuICAgIHNldENhcmV0UG9zaXRpb24ocG9zKSB7IC8v6K6+572u5YWJ5qCH5L2N572u5Ye95pWwXG4gICAgICAgIGNvbnN0IGN0cmwgPSB0aGlzLiRpbnB1dFswXTtcbiAgICAgICAgY3RybC5mb2N1cygpO1xuICAgICAgICBpZiAoY3RybC5zZXRTZWxlY3Rpb25SYW5nZSkge1xuICAgICAgICAgICAgY3RybC5mb2N1cygpO1xuICAgICAgICAgICAgY3RybC5zZXRTZWxlY3Rpb25SYW5nZShwb3MsIHBvcyk7XG4gICAgICAgIH0gZWxzZSBpZiAoY3RybC5jcmVhdGVUZXh0UmFuZ2UpIHtcbiAgICAgICAgICAgIHZhciByYW5nZSA9IGN0cmwuY3JlYXRlVGV4dFJhbmdlKCk7XG4gICAgICAgICAgICByYW5nZS5jb2xsYXBzZSh0cnVlKTtcbiAgICAgICAgICAgIHJhbmdlLm1vdmVFbmQoJ2NoYXJhY3RlcicsIHBvcyk7XG4gICAgICAgICAgICByYW5nZS5tb3ZlU3RhcnQoJ2NoYXJhY3RlcicsIHBvcyk7XG4gICAgICAgICAgICByYW5nZS5zZWxlY3QoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFN0ckJlZm9yZUN1cnNvcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuJGlucHV0LnZhbCgpLnNsaWNlKDAsIHRoaXMuZ2V0Q3Vyc29ydFBvc2l0aW9uKCkpO1xuICAgIH1cblxuICAgIHJlc2V0Q3VycmVudEN1cnNvclJlY3QodmFsdWUpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHRoaXMuY3VycmVudEN1cnNvclJlY3QgPSBudWxsO1xuICAgICAgICBjb25zdCAkaW5wdXRPZmZzZXQgPSB0aGlzLiRpbnB1dC5vZmZzZXQoKTtcbiAgICAgICAgY29uc3QgaW5wdXRIZWlnaHQgPSB0aGlzLiRpbnB1dFswXS5vZmZzZXRIZWlnaHQ7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRNYXJrICYmIHRoaXMuY3VycmVudE1hcmsuc3VnZ2VzdFBvc2l0aW9uICE9PSAnYXV0bycpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgICAgICAgICB4OiAkaW5wdXRPZmZzZXQubGVmdCArICdweCcsXG4gICAgICAgICAgICAgICAgeTogJGlucHV0T2Zmc2V0LnRvcCArIGlucHV0SGVpZ2h0ICsgJ3B4J1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgICAgICAgICB4OiAkaW5wdXRPZmZzZXQubGVmdCArICdweCcsXG4gICAgICAgICAgICAgICAgeTogJGlucHV0T2Zmc2V0LnRvcCArIGlucHV0SGVpZ2h0ICsgJ3B4J1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGNvb3JkaW5hdGVzID0gZ2V0Q2FyZXRDb29yZGluYXRlcyh0aGlzLiRpbnB1dFswXSwgdmFsdWUubGVuZ3RoKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgICAgICAgICB4OiBjb29yZGluYXRlcy5sZWZ0ICsgJGlucHV0T2Zmc2V0LmxlZnQsXG4gICAgICAgICAgICAgICAgeTogY29vcmRpbmF0ZXMudG9wICsgdGhpcy5fY2FsY3VsYXRlTGluZUhlaWdodCgpICsgJGlucHV0T2Zmc2V0LnRvcFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRDdXJzb3JSZWN0ID0gcmVzdWx0O1xuICAgIH1cblxuICAgIF9jYWxjdWxhdGVMaW5lSGVpZ2h0KCkge1xuICAgICAgICBpZiAodGhpcy5fY2FsY3VsYXRlTGluZUhlaWdodCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NhbGN1bGF0ZUxpbmVIZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGVsID0gdGhpcy4kaW5wdXRbMF07XG4gICAgICAgIGxldCBsaW5lSGVpZ2h0ID0gcGFyc2VJbnQoJChlbCkuY3NzKCdsaW5lLWhlaWdodCcpLCAxMCk7XG4gICAgICAgIGlmIChpc05hTihsaW5lSGVpZ2h0KSkge1xuICAgICAgICAgICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNDUxNTQ3MC8xMjk3MzM2XG4gICAgICAgICAgICB2YXIgcGFyZW50Tm9kZSA9IGVsLnBhcmVudE5vZGU7XG4gICAgICAgICAgICB2YXIgdGVtcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZWwubm9kZU5hbWUpO1xuICAgICAgICAgICAgdmFyIHN0eWxlID0gZWwuc3R5bGU7XG4gICAgICAgICAgICB0ZW1wLnNldEF0dHJpYnV0ZShcbiAgICAgICAgICAgICAgICAnc3R5bGUnLFxuICAgICAgICAgICAgICAgICdtYXJnaW46MHB4O3BhZGRpbmc6MHB4O2ZvbnQtZmFtaWx5OicgKyBzdHlsZS5mb250RmFtaWx5ICsgJztmb250LXNpemU6JyArIHN0eWxlLmZvbnRTaXplXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGVtcC5pbm5lckhUTUwgPSAndGVzdCc7XG4gICAgICAgICAgICBwYXJlbnROb2RlLmFwcGVuZENoaWxkKHRlbXApO1xuICAgICAgICAgICAgbGluZUhlaWdodCA9IHRlbXAuY2xpZW50SGVpZ2h0O1xuICAgICAgICAgICAgcGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0ZW1wKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fY2FsY3VsYXRlTGluZUhlaWdodCA9IGxpbmVIZWlnaHQ7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTdWdnZXN0O1xuIiwiaW1wb3J0IHRlc3REYXRhIGZyb20gJy4vZ2V0RGF0YSc7XG5pbXBvcnQgU3VnZ2VzdCBmcm9tICcuL3N1Z2dlc3QnO1xuXG5sZXQgc3VnZ2VzdCA9IG5ldyBTdWdnZXN0KCQoJy5kZW1vMScpLCB0ZXN0RGF0YS5saXN0KTtcblxuJChzdWdnZXN0KS5vbignbWFya0NoYW5nZScsIGZ1bmN0aW9uIChlLG1hcmspIHtcbiAgICBpZiAobWFyay5tYXJrTmFtZSA9PT0gJ3VzZXJzJykge1xuICAgICAgICB0ZXN0RGF0YS5jdXJyZW50LnVzZXIgPSBtYXJrLnZhbHVlO1xuICAgICAgICB0ZXN0RGF0YS5jdXJyZW50LmJvb2sgPSAnJztcbiAgICB9IGVsc2UgaWYgKG1hcmsubWFya05hbWUgPT09ICdib29rcycpIHtcbiAgICAgICAgdGVzdERhdGEuY3VycmVudC5ib29rID0gbWFyay52YWx1ZTtcbiAgICB9XG59KTtcblxuXG5sZXQgc3VnZ2VzdDIgPSBuZXcgU3VnZ2VzdCgkKCcuZGVtbzInKSwgdGVzdERhdGEub25lRGF0YVRlc3QpO1xuJChzdWdnZXN0Mikub24oJ21hcmtDaGFuZ2UnLCBmdW5jdGlvbiAoZSxtYXJrKSB7XG59KTtcbiJdLCJuYW1lcyI6WyJsZXQiLCJjb25zdCIsInRoaXMiLCJsaXN0VmlldyJdLCJtYXBwaW5ncyI6IkFBQUFBLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNkQSxJQUFJLEtBQUssR0FBRyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQy9FQSxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUM7QUFDakJBLElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQzs7QUFFcEIsS0FBS0EsSUFBSSxDQUFDLElBQUksS0FBSyxFQUFFO0lBQ2pCQSxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ2xDLEtBQUtBLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQy9CQSxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsQ0FBQSxDQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQSxXQUFPLEdBQUUsQ0FBQyxDQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDcEQsS0FBS0Es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
