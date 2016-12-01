var data = {};
var names = ['circle', 'zhihao', 'gary', 'inkie', 'percy', 'cohlint', 'liwen'];
var booksNum = 5;
var chaptersNum = 6;

for (var i in names) {
    var userObj = data[names[i]] = {};
    for (var j = 0; j < booksNum; j++) {
        var bookObj = userObj[((names[i]) + "_book_" + j)] = [];
        for (var k = 0; k < chaptersNum; k++) {
            bookObj.push(("chapter_" + k));
        }
    }
}
console.log(data);

var current = {
    user: '',
    book: ''
};


var guide = {
    getData: function (inputUtilObj) {
        return new Promise(function (resolve, reject) {
            var list = ['ss', 'sdf', 'wer', '23rs'];
            resolve(list);
        })
    },
    mark: 'guides',
    suggestPosition: '',
    after: function () { return ' >'; },
    before: function () { return ''; },
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
    after: function () { return ' >'; },
    before: function () { return 'users: '; },
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
    after: function () { return ' >'; },
    before: function () { return 'books: '; }
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
    suggestPosition: 'auto',
    after: function () { return ' >'; },
    before: function () { return 'chapters: '; }
};

var list = [guide, users, books, chapters];

var oneDataTest = users;

var testData = {current: current, list: list, oneDataTest: oneDataTest};

var ListView = function ListView(opts) {
    if ( opts === void 0 ) opts = {};


    this.$el = opts.$el || $('<ul></ul>');
    this.data = opts.data || [];

    this.itemClassName = opts.itemClassName || 'item';
    this.HOVER_CLASSNAME = 'selected';

    this.template = opts.template || function (data) {
            var this$1 = this;

            var str = '';
            for (var i = 0, l = data.length; i < l; i++) {
                str += "<li class=\"" + (this$1.itemClassName) + "\" data-order=\"" + i + "\">" + (data[i]) + "</li>";
            }
            return str;
        };

    this._index = -1;

    this.init();
};

var prototypeAccessors = { index: {},$selectItem: {},$allItem: {},value: {} };

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
    return this.getIndexItem().html();
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

var keyCode = {
    'ESC': 27,
    'ENTER': 13,
    'UP': 38,
    'DOWN': 40
};

var Suggest = function Suggest($inputWrapper, dataConfig) {
    this.$el = $inputWrapper;
    this.$input = $inputWrapper.find('.input');
    this.$getPosInput = $inputWrapper.find('.get-pos');//用于定位listview 的辅助input
    this.listView = new ListView({
        $el: $inputWrapper.find('.list')
    });
    this.dataConfig = dataConfig;
    this.makeDataObj = {}; //生成数据的map对象
    this.marks = []; //marks数组
    // this.mutiple = false;
    // this.tokenQueue = [];
    this.init();
};

Suggest.prototype.init = function init () {
    this.initEvent();
    this.parseDataConfig();
};

Suggest.prototype.initEvent = function initEvent () {
        var this$1 = this;

    var me = this;
    this.$el.on('keyup', this.$input, function ($e) {
        me._keyupHandler($e);
        return false;
    });

    this.$input.on('click', function () {
        me.updateListView();
        return false;
    });

    $('body').click(function () {
        me.listView.hide();
    });

    $('body').on('keyup', function (e) {
        if (me.listView.display !== 'show') {
            return false;
        }
        switch (e.keyCode) {
            case keyCode.UP :
                me.listView.index--;
                break;
            case keyCode.DOWN:
                me.listView.index++;
                break;
            case keyCode.ENTER:
                me.selectListViewItem(me.listView.value);
                me.listView.hide();
                break;
            case keyCode.ESC:
                me.listView.hide();
                break;
            default:
                break;
        }
        return false;
    });

    $(this.listView).on('selectItem', function () {
        this$1.selectListViewItem(this$1.listView.value);
    });
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

    // //如果只有一种mark, 且mutiple为true
    // if (this.marks.length == 1 && this.marks[0].mutiple) {
    // this.mutiple = true;
    // }
};

Suggest.prototype.parseDataItem = function parseDataItem (item) {
    var markName = item.mark;
    this.marks.push({
        value: '',
        str: '',
        markName: markName,
        suggestPosition: item.suggestPosition,
        after: item.after || function () {
            return ''
        },
        before: item.before || function () {
            return ''
        },
        next: false,
        mutiple: item.mutiple
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

Suggest.prototype._keyupHandler = function _keyupHandler (e) {
    switch (e.keyCode) {
        case keyCode.UP :
            this.$input.blur();
            this.listView.index--;
        case keyCode.DOWN:
            this.$input.blur();
            this.listView.index++;
            break;
        case keyCode.ENTER:
            this.$input.blur();
            break;
        case keyCode.ESC:
            this.$input.blur();
            break;
        default:
            this.updateListView();
            break;
    }
    return false;
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
        var rect = me.resetCurrentCursorRect(value);//得到光标位置对象
        me.refreshListView(); //根据currentMark 请求数据, 刷新listview
    }
};

// getKeyWordsByPos() {
// const pos = this.getCursortPosition();
// const text = this.$input.val();
//
// let findTarget = false; //是否找到目标
// let range_left = -1; //左面空格的位置
// let range_right = -1; //右面空格的位置
//
// for (let l = text.length - 1; l > pos; l--) {
//     if (text.charCodeAt(j) == 32) {
//         //从右向左扫描到空格
//         range_right = l;
//     }
// }
//
// for (let i = 0; i < pos; i++) {
//     if (text.charCodeAt(i) == 32) {
//         //从左向右扫描到空格
//         range_left = i;
//     }
// }
//
// if (range_left == -1) {
//     range_left = 0;
// }
//
// if (range_right == -1) {
//     range_right = text.length;
// }
//
// return {
//     words: text.slice(range_left, range_right),
//     left: range_left,
//     right: range_right
// }
//
// }

// updateListViewAtMutiple() {
// const value = this.$input.val();
// //得到位置, 判断位置在哪一个token里
// const token = this.getTokenByCursor();
// }

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
    var next = false;
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
        if (str.indexOf(this.currentMark.before()) == 0) {
            str = str.slice(this.currentMark.before().length);
        }
        this.inputUtilObj.inputStr = str;
    } else {
        this.inputUtilObj.inputStr = "";
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
            this$1.listView.refresh(data, template);
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
            continue
        }
        var isMarkStr = false;
        for (var j in this.marks) {
            var mark = this$1.marks[j];
            //${mark.str}xxx 不算一个mark
            var matchValue = i + mark.str.length === l ? mark.str : mark.str + ' ';
            if (str.slice(i).indexOf(matchValue) === 0) {
                var obj = {
                    markName: mark.markName,
                    type: 'mark'
                };

                result.push(obj);

                //如果在光标右边
                if (i + matchValue.length > pos) {
                    obj.atPosRight = true;
                    return result;
                }
                i += mark.str.length;
                isMarkStr = true;
                break;
            }
        }
        if (!isMarkStr) {
            var last = result[result.length - 1];
            // if (!last || last.type != 'unmark') {
            // result.push({
            //     type: 'unmark',
            //     str: s
            // })
            // } else {
            // last.str += s;
            // }
            if (!last || last.type != 'unmark') {
                result.push({
                    type: 'unmark',
                    str: str.slice(i)
                });
            }
            // } else {
            // last.str += s;

            // i++;
        }
    }
    return this.currentParseResult = result;
};

Suggest.prototype.makeMarkStr = function makeMarkStr (mark) {
    return mark.before() + mark.value + mark.after();
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
    return this.$input.val().slice(0, this.getCursortPosition())
};

Suggest.prototype.resetCurrentCursorRect = function resetCurrentCursorRect (value) {
    var result = this.currentCursorRect = null;
    var $inputOffset = this.$input.offset();
    if (this.currentMark && this.currentMark.suggestPosition !== 'auto') {
        result = {
            x: $inputOffset.left + 'px',
            y: $inputOffset.top + this.$input[0].offsetHeight + 'px'
        };
    } else if (!value) {
        result = {
            x: $inputOffset.left + 'px',
            y: $inputOffset.top + 'px'
        };
    } else {
        this.$getPosInput.val(value).show().attr('size', value.length);
        var width = this.$getPosInput[0].clientWidth;
        this.$getPosInput.hide();

        result = {
            x: width + $inputOffset.left + 'px',
            y: $inputOffset.top + 'px'
        };
    }
    return this.currentCursorRect = result;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi4uL3N1Z2dlc3QvZ2V0RGF0YS5qcyIsIi4uL3N1Z2dlc3QvbGlzdFZpZXcuanMiLCIuLi9zdWdnZXN0L3N1Z2dlc3QuanMiLCIuLi9zdWdnZXN0L2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImxldCBkYXRhID0ge307XG5sZXQgbmFtZXMgPSBbJ2NpcmNsZScsICd6aGloYW8nLCAnZ2FyeScsICdpbmtpZScsICdwZXJjeScsICdjb2hsaW50JywgJ2xpd2VuJ107XG5sZXQgYm9va3NOdW0gPSA1O1xubGV0IGNoYXB0ZXJzTnVtID0gNjtcblxuZm9yIChsZXQgaSBpbiBuYW1lcykge1xuICAgIGxldCB1c2VyT2JqID0gZGF0YVtuYW1lc1tpXV0gPSB7fTtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IGJvb2tzTnVtOyBqKyspIHtcbiAgICAgICAgbGV0IGJvb2tPYmogPSB1c2VyT2JqW2Ake25hbWVzW2ldfV9ib29rXyR7an1gXSA9IFtdO1xuICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGNoYXB0ZXJzTnVtOyBrKyspIHtcbiAgICAgICAgICAgIGJvb2tPYmoucHVzaChgY2hhcHRlcl8ke2t9YCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5jb25zb2xlLmxvZyhkYXRhKVxuXG5sZXQgY3VycmVudCA9IHtcbiAgICB1c2VyOiAnJyxcbiAgICBib29rOiAnJ1xufTtcblxuXG5jb25zdCBndWlkZSA9IHtcbiAgICBnZXREYXRhOiAoaW5wdXRVdGlsT2JqKSA9PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBsZXQgbGlzdCA9IFsnc3MnLCAnc2RmJywgJ3dlcicsICcyM3JzJ107XG4gICAgICAgICAgICByZXNvbHZlKGxpc3QpXG4gICAgICAgIH0pXG4gICAgfSxcbiAgICBtYXJrOiAnZ3VpZGVzJyxcbiAgICBzdWdnZXN0UG9zaXRpb246ICcnLFxuICAgIGFmdGVyOiAoKSA9PiAnID4nLFxuICAgIGJlZm9yZTogKCkgPT4gJycsXG59O1xuXG5jb25zdCB1c2VycyA9IHtcbiAgICBnZXREYXRhOiAoaW5wdXRVdGlsT2JqKSA9PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBsZXQgbGlzdCA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgaSBpbiBkYXRhKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlucHV0VXRpbE9iai5pc0NvbXBsZXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGkuaW5kZXhPZihpbnB1dFV0aWxPYmouaW5wdXRTdHIpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKGkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlc29sdmUobGlzdClcbiAgICAgICAgfSlcbiAgICB9LFxuICAgIG1hcms6ICd1c2VycycsXG4gICAgc3VnZ2VzdFBvc2l0aW9uOiAnYXV0bycsXG4gICAgYWZ0ZXI6ICgpID0+ICcgPicsXG4gICAgYmVmb3JlOiAoKSA9PiAndXNlcnM6ICcsXG4gICAgbXV0aXBsZTogdHJ1ZVxufTtcblxuY29uc3QgYm9va3MgPSB7XG4gICAgZ2V0RGF0YTogKGlucHV0VXRpbE9iaiA9IHt9KSA9PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudC51c2VyKSB7XG4gICAgICAgICAgICAgICAgbGV0IGxpc3QgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpIGluIGRhdGFbY3VycmVudC51c2VyXSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5wdXRVdGlsT2JqLmlzQ29tcGxldGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChpKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpLmluZGV4T2YoaW5wdXRVdGlsT2JqLmlucHV0U3RyKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2goaSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShsaXN0KVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0sXG4gICAgbWFyazogJ2Jvb2tzJyxcbiAgICBzdWdnZXN0UG9zaXRpb246ICdhdXRvJyxcbiAgICBhZnRlcjogKCkgPT4gJyA+JyxcbiAgICBiZWZvcmU6ICgpID0+ICdib29rczogJ1xufTtcblxuY29uc3QgY2hhcHRlcnMgPSB7XG4gICAgZ2V0RGF0YTogKCkgPT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coY3VycmVudClcbiAgICAgICAgICAgIGlmIChjdXJyZW50LnVzZXIgJiYgY3VycmVudC5ib29rKSB7XG4gICAgICAgICAgICAgICAgbGV0IG9iaiA9IGRhdGFbY3VycmVudC51c2VyXVtjdXJyZW50LmJvb2tdO1xuICAgICAgICAgICAgICAgIGxldCBsaXN0ID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSBpbiBvYmopIHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKG9ialtpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlc29sdmUobGlzdClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9LFxuICAgIG1hcms6ICdjaGFwdGVycycsXG4gICAgc3VnZ2VzdFBvc2l0aW9uOiAnYXV0bycsXG4gICAgYWZ0ZXI6ICgpID0+ICcgPicsXG4gICAgYmVmb3JlOiAoKSA9PiAnY2hhcHRlcnM6ICdcbn07XG5cbmNvbnN0IGxpc3QgPSBbZ3VpZGUsIHVzZXJzLCBib29rcywgY2hhcHRlcnNdO1xuXG5jb25zdCBvbmVEYXRhVGVzdCA9IHVzZXJzO1xuXG5leHBvcnQgZGVmYXVsdCB7Y3VycmVudCwgbGlzdCwgb25lRGF0YVRlc3R9XG4iLCJjbGFzcyBMaXN0VmlldyB7XG4gICAgY29uc3RydWN0b3Iob3B0cyA9IHt9KSB7XG5cbiAgICAgICAgdGhpcy4kZWwgPSBvcHRzLiRlbCB8fCAkKCc8dWw+PC91bD4nKTtcbiAgICAgICAgdGhpcy5kYXRhID0gb3B0cy5kYXRhIHx8IFtdO1xuXG4gICAgICAgIHRoaXMuaXRlbUNsYXNzTmFtZSA9IG9wdHMuaXRlbUNsYXNzTmFtZSB8fCAnaXRlbSc7XG4gICAgICAgIHRoaXMuSE9WRVJfQ0xBU1NOQU1FID0gJ3NlbGVjdGVkJztcblxuICAgICAgICB0aGlzLnRlbXBsYXRlID0gb3B0cy50ZW1wbGF0ZSB8fCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIGxldCBzdHIgPSAnJztcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGRhdGEubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0ciArPSBgPGxpIGNsYXNzPVwiJHt0aGlzLml0ZW1DbGFzc05hbWV9XCIgZGF0YS1vcmRlcj1cIiR7aX1cIj4ke2RhdGFbaV19PC9saT5gO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICB0aGlzLl9pbmRleCA9IC0xO1xuXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH1cblxuICAgIHNldCBpbmRleCh2YWwpIHtcbiAgICAgICAgaWYgKHZhbCA+IHRoaXMuZGF0YS5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICB2YWwgPSB0aGlzLmRhdGEubGVuZ3RoIC0gMTtcbiAgICAgICAgfSBlbHNlIGlmICh2YWwgPCAwKSB7XG4gICAgICAgICAgICB2YWwgPSAtMVxuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlVmlld0J5SW5kZXgodGhpcy5faW5kZXggPSB2YWwpO1xuICAgIH1cblxuICAgIGdldCBpbmRleCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2luZGV4O1xuICAgIH1cblxuICAgIGdldCAkc2VsZWN0SXRlbSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5kZXhJdGVtKCk7XG4gICAgfVxuXG4gICAgZ2V0ICRhbGxJdGVtKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRBbGxJdGVtcygpO1xuICAgIH1cblxuICAgIGdldCB2YWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5kZXhJdGVtKCkuaHRtbCgpO1xuICAgIH1cblxuICAgICQoc2VsZWN0b3IpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuJGVsLmZpbmQoc2VsZWN0b3IpO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMuaW5pdEV2ZW50KCk7XG4gICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfVxuXG4gICAgaW5pdEV2ZW50KCkge1xuICAgICAgICBsZXQgbWUgPSB0aGlzO1xuICAgICAgICB0aGlzLiRlbC5vbignY2xpY2snLCAnLicgKyB0aGlzLml0ZW1DbGFzc05hbWUsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIG1lLl9jbGlja0hhbmRsZXIoJCh0aGlzKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgdGhpcy4kZWwuaHRtbCh0aGlzLnRlbXBsYXRlKHRoaXMuZGF0YSkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICByZWZyZXNoKGRhdGEsIHRlbXBsYXRlKSB7XG4gICAgICAgIHRoaXMuaW5kZXggPSAtMTtcblxuICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVEYXRhKGRhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRlbXBsYXRlKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVRlbXBsYXRlKHRlbXBsYXRlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVuZGVyKCkuc2hvdygpO1xuICAgIH1cblxuICAgIHVwZGF0ZVZpZXdCeUluZGV4KGluZGV4KSB7XG4gICAgICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPiB0aGlzLmRhdGEubGVuZ3RoKSByZXR1cm47XG4gICAgICAgIHRoaXMuJGFsbEl0ZW0ucmVtb3ZlQ2xhc3ModGhpcy5IT1ZFUl9DTEFTU05BTUUpO1xuICAgICAgICB0aGlzLiRzZWxlY3RJdGVtLmFkZENsYXNzKHRoaXMuSE9WRVJfQ0xBU1NOQU1FKTtcbiAgICAgICAgdGhpcy5zY3JvbGxCeUluZGV4KCk7XG4gICAgfVxuXG4gICAgdXBkYXRlRGF0YShkYXRhKSB7XG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgfVxuXG4gICAgdXBkYXRlVGVtcGxhdGUodGVtcGxhdGVGbikge1xuICAgICAgICB0aGlzLnRlbXBsYXRlID0gdGVtcGxhdGVGbjtcbiAgICB9XG5cbiAgICBzY3JvbGxCeUluZGV4KCkge1xuXG4gICAgICAgIGlmICghdGhpcy4kc2VsZWN0SXRlbVswXSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGNvbnRhaW5lckhlaWdodCA9IHRoaXMuJGVsLmhlaWdodCgpO1xuICAgICAgICBjb25zdCBpdGVtSGVpZ2h0ID0gdGhpcy4kc2VsZWN0SXRlbVswXS5vZmZzZXRIZWlnaHQ7XG4gICAgICAgIGNvbnN0IHNjcm9sbFRvcCA9IHRoaXMuJGVsLnNjcm9sbFRvcCgpO1xuICAgICAgICBjb25zdCBvZmZzZXRUb3AgPSB0aGlzLiRzZWxlY3RJdGVtWzBdLm9mZnNldFRvcDtcbiAgICAgICAgbGV0IHNjcm9sbFRvVmFsdWUgPSAwO1xuXG4gICAgICAgIGlmIChvZmZzZXRUb3AgPiAoc2Nyb2xsVG9wICsgY29udGFpbmVySGVpZ2h0IC0gaXRlbUhlaWdodCkpIHtcblxuICAgICAgICAgICAgLy9pZiBjdXJyZW50IGl0ZW0gdW5kZXIgdGhlIGNvbnRhaW5lciB2aWV3IGFyZWFcbiAgICAgICAgICAgIHNjcm9sbFRvVmFsdWUgPSBvZmZzZXRUb3AgLSBjb250YWluZXJIZWlnaHQgKyBpdGVtSGVpZ2h0O1xuICAgICAgICAgICAgdGhpcy4kZWwuc2Nyb2xsVG9wKHNjcm9sbFRvVmFsdWUpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAob2Zmc2V0VG9wIDwgc2Nyb2xsVG9wKSB7XG5cbiAgICAgICAgICAgIC8vaWYgY3VycmVudCBpdGVtIG9uIHRoZSBjb250YWluZXIgdmlldyBhcmVhXG4gICAgICAgICAgICBzY3JvbGxUb1ZhbHVlID0gb2Zmc2V0VG9wO1xuICAgICAgICAgICAgdGhpcy4kZWwuc2Nyb2xsVG9wKHNjcm9sbFRvVmFsdWUpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBfY2xpY2tIYW5kbGVyKCRpdGVtKSB7XG4gICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICBjb25zdCB0ZW1wSW5kZXggPSArKCRpdGVtLmF0dHIoJ2RhdGEtb3JkZXInKSk7XG4gICAgICAgIHRoaXMuaW5kZXggPSB0ZW1wSW5kZXg7XG4gICAgICAgICQodGhpcykudHJpZ2dlcignc2VsZWN0SXRlbScpO1xuICAgIH1cblxuICAgIGdldEluZGV4SXRlbSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuJCgnLicgKyB0aGlzLml0ZW1DbGFzc05hbWUpLmVxKHRoaXMuaW5kZXgpO1xuICAgIH1cblxuICAgIGdldEFsbEl0ZW1zKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4kKCcuJyArIHRoaXMuaXRlbUNsYXNzTmFtZSk7XG4gICAgfVxuXG4gICAgaGlkZSgpIHtcbiAgICAgICAgdGhpcy4kZWwuaGlkZSgpO1xuICAgICAgICB0aGlzLmRpc3BsYXkgPSAnaGlkZSc7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHNob3coKSB7XG4gICAgICAgIHRoaXMuJGVsLnNob3coKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5ID0gJ3Nob3cnO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICByZW1vdmUoKSB7XG4gICAgICAgIHRoaXMuJGVsLnJlbW92ZSgpO1xuICAgICAgICB0aGlzLmRpc3BsYXkgPSAncmVtb3ZlJztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBMaXN0VmlldzsiLCJpbXBvcnQgbGlzdFZpZXcgZnJvbSAnLi9saXN0Vmlldyc7XG5cbmNvbnN0IGtleUNvZGUgPSB7XG4gICAgJ0VTQyc6IDI3LFxuICAgICdFTlRFUic6IDEzLFxuICAgICdVUCc6IDM4LFxuICAgICdET1dOJzogNDBcbn07XG5cbmNsYXNzIFN1Z2dlc3Qge1xuXG4gICAgY29uc3RydWN0b3IoJGlucHV0V3JhcHBlciwgZGF0YUNvbmZpZykge1xuICAgICAgICB0aGlzLiRlbCA9ICRpbnB1dFdyYXBwZXI7XG4gICAgICAgIHRoaXMuJGlucHV0ID0gJGlucHV0V3JhcHBlci5maW5kKCcuaW5wdXQnKTtcbiAgICAgICAgdGhpcy4kZ2V0UG9zSW5wdXQgPSAkaW5wdXRXcmFwcGVyLmZpbmQoJy5nZXQtcG9zJyk7Ly/nlKjkuo7lrprkvY1saXN0dmlldyDnmoTovoXliqlpbnB1dFxuICAgICAgICB0aGlzLmxpc3RWaWV3ID0gbmV3IGxpc3RWaWV3KHtcbiAgICAgICAgICAgICRlbDogJGlucHV0V3JhcHBlci5maW5kKCcubGlzdCcpXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmRhdGFDb25maWcgPSBkYXRhQ29uZmlnO1xuICAgICAgICB0aGlzLm1ha2VEYXRhT2JqID0ge307IC8v55Sf5oiQ5pWw5o2u55qEbWFw5a+56LGhXG4gICAgICAgIHRoaXMubWFya3MgPSBbXTsgLy9tYXJrc+aVsOe7hFxuICAgICAgICAvLyB0aGlzLm11dGlwbGUgPSBmYWxzZTtcbiAgICAgICAgLy8gdGhpcy50b2tlblF1ZXVlID0gW107XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMuaW5pdEV2ZW50KCk7XG4gICAgICAgIHRoaXMucGFyc2VEYXRhQ29uZmlnKCk7XG4gICAgfVxuXG4gICAgaW5pdEV2ZW50KCkge1xuICAgICAgICBsZXQgbWUgPSB0aGlzO1xuICAgICAgICB0aGlzLiRlbC5vbigna2V5dXAnLCB0aGlzLiRpbnB1dCwgZnVuY3Rpb24gKCRlKSB7XG4gICAgICAgICAgICBtZS5fa2V5dXBIYW5kbGVyKCRlKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4kaW5wdXQub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbWUudXBkYXRlTGlzdFZpZXcoKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCgnYm9keScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIG1lLmxpc3RWaWV3LmhpZGUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCgnYm9keScpLm9uKCdrZXl1cCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBpZiAobWUubGlzdFZpZXcuZGlzcGxheSAhPT0gJ3Nob3cnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3dpdGNoIChlLmtleUNvZGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIGtleUNvZGUuVVAgOlxuICAgICAgICAgICAgICAgICAgICBtZS5saXN0Vmlldy5pbmRleC0tO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIGtleUNvZGUuRE9XTjpcbiAgICAgICAgICAgICAgICAgICAgbWUubGlzdFZpZXcuaW5kZXgrKztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBrZXlDb2RlLkVOVEVSOlxuICAgICAgICAgICAgICAgICAgICBtZS5zZWxlY3RMaXN0Vmlld0l0ZW0obWUubGlzdFZpZXcudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBtZS5saXN0Vmlldy5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2Uga2V5Q29kZS5FU0M6XG4gICAgICAgICAgICAgICAgICAgIG1lLmxpc3RWaWV3LmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQodGhpcy5saXN0Vmlldykub24oJ3NlbGVjdEl0ZW0nLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdExpc3RWaWV3SXRlbSh0aGlzLmxpc3RWaWV3LnZhbHVlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcGFyc2VEYXRhQ29uZmlnKCkge1xuICAgICAgICBpZiAodGhpcy5kYXRhQ29uZmlnLmNvbnN0cnVjdG9yID09IEFycmF5KSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpIGluIHRoaXMuZGF0YUNvbmZpZykge1xuICAgICAgICAgICAgICAgIHRoaXMucGFyc2VEYXRhSXRlbSh0aGlzLmRhdGFDb25maWdbaV0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5kYXRhQ29uZmlnLmNvbnN0cnVjdG9yID09IE9iamVjdCkge1xuICAgICAgICAgICAgdGhpcy5wYXJzZURhdGFJdGVtKHRoaXMuZGF0YUNvbmZpZyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAvL+WmguaenOWPquacieS4gOenjW1hcmssIOS4lG11dGlwbGXkuLp0cnVlXG4gICAgICAgIC8vIGlmICh0aGlzLm1hcmtzLmxlbmd0aCA9PSAxICYmIHRoaXMubWFya3NbMF0ubXV0aXBsZSkge1xuICAgICAgICAvLyAgICAgdGhpcy5tdXRpcGxlID0gdHJ1ZTtcbiAgICAgICAgLy8gfVxuICAgIH1cblxuICAgIHBhcnNlRGF0YUl0ZW0oaXRlbSkge1xuICAgICAgICBsZXQgbWFya05hbWUgPSBpdGVtLm1hcms7XG4gICAgICAgIHRoaXMubWFya3MucHVzaCh7XG4gICAgICAgICAgICB2YWx1ZTogJycsXG4gICAgICAgICAgICBzdHI6ICcnLFxuICAgICAgICAgICAgbWFya05hbWU6IG1hcmtOYW1lLFxuICAgICAgICAgICAgc3VnZ2VzdFBvc2l0aW9uOiBpdGVtLnN1Z2dlc3RQb3NpdGlvbixcbiAgICAgICAgICAgIGFmdGVyOiBpdGVtLmFmdGVyIHx8IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJydcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBiZWZvcmU6IGl0ZW0uYmVmb3JlIHx8IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJydcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBuZXh0OiBmYWxzZSxcbiAgICAgICAgICAgIG11dGlwbGU6IGl0ZW0ubXV0aXBsZVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5tYWtlRGF0YU9ialttYXJrTmFtZV0gPSBpdGVtLmdldERhdGE7XG4gICAgfVxuXG4gICAgcmVzZXRNYXJrKG1hcmspIHtcbiAgICAgICAgbWFyay5sZWZ0UG9zID0gJyc7XG4gICAgICAgIG1hcmsucmlnaHRQb3MgPSAnJztcbiAgICAgICAgbWFyay52YWx1ZSA9ICcnO1xuICAgICAgICBtYXJrLnN0ciA9ICcnO1xuICAgICAgICBtYXJrLm5leHQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBfa2V5dXBIYW5kbGVyKGUpIHtcbiAgICAgICAgc3dpdGNoIChlLmtleUNvZGUpIHtcbiAgICAgICAgICAgIGNhc2Uga2V5Q29kZS5VUCA6XG4gICAgICAgICAgICAgICAgdGhpcy4kaW5wdXQuYmx1cigpO1xuICAgICAgICAgICAgICAgIHRoaXMubGlzdFZpZXcuaW5kZXgtLTtcbiAgICAgICAgICAgIGNhc2Uga2V5Q29kZS5ET1dOOlxuICAgICAgICAgICAgICAgIHRoaXMuJGlucHV0LmJsdXIoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RWaWV3LmluZGV4Kys7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGtleUNvZGUuRU5URVI6XG4gICAgICAgICAgICAgICAgdGhpcy4kaW5wdXQuYmx1cigpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBrZXlDb2RlLkVTQzpcbiAgICAgICAgICAgICAgICB0aGlzLiRpbnB1dC5ibHVyKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlTGlzdFZpZXcoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdXBkYXRlTGlzdFZpZXcoKSB7XG4gICAgICAgIGxldCBtZSA9IHRoaXM7XG4gICAgICAgIGlmICh0aGlzLnVwZGF0ZVRpbWVyKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy51cGRhdGVUaW1lcik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnVwZGF0ZVRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB1cGRhdGVMaXN0Vmlld1RpbWVySGFuZGxlcigpO1xuICAgICAgICB9LCAxMDApO1xuXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZUxpc3RWaWV3VGltZXJIYW5kbGVyKCkge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBtZS5nZXRTdHJCZWZvcmVDdXJzb3IoKTsgLy/lvpfliLDlhYnmoIfkuYvliY3nmoTlrZfnrKbkuLJcbiAgICAgICAgICAgIGNvbnN0IHBhcnNlUmVzdWx0ID0gbWUucmVzZXRQYXJzZVJlc3VsdChtZS4kaW5wdXQudmFsKCksIHZhbHVlLmxlbmd0aCk7Ly/op6PmnpDlrZfnrKbkuLJcbiAgICAgICAgICAgIG1lLnJlc2V0Q3VycmVudE1hcmsocGFyc2VSZXN1bHQpOy8v5qC55o2u5a2X56ym5Liy6K6+572uY3VycmVudE1hcmssIGNhY2hlc3RyIOetieWAvFxuICAgICAgICAgICAgY29uc3QgcmVjdCA9IG1lLnJlc2V0Q3VycmVudEN1cnNvclJlY3QodmFsdWUpOy8v5b6X5Yiw5YWJ5qCH5L2N572u5a+56LGhXG4gICAgICAgICAgICBtZS5yZWZyZXNoTGlzdFZpZXcoKTsgLy/moLnmja5jdXJyZW50TWFyayDor7fmsYLmlbDmja4sIOWIt+aWsGxpc3R2aWV3XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBnZXRLZXlXb3Jkc0J5UG9zKCkge1xuICAgIC8vICAgICBjb25zdCBwb3MgPSB0aGlzLmdldEN1cnNvcnRQb3NpdGlvbigpO1xuICAgIC8vICAgICBjb25zdCB0ZXh0ID0gdGhpcy4kaW5wdXQudmFsKCk7XG4gICAgLy9cbiAgICAvLyAgICAgbGV0IGZpbmRUYXJnZXQgPSBmYWxzZTsgLy/mmK/lkKbmib7liLDnm67moIdcbiAgICAvLyAgICAgbGV0IHJhbmdlX2xlZnQgPSAtMTsgLy/lt6bpnaLnqbrmoLznmoTkvY3nva5cbiAgICAvLyAgICAgbGV0IHJhbmdlX3JpZ2h0ID0gLTE7IC8v5Y+z6Z2i56m65qC855qE5L2N572uXG4gICAgLy9cbiAgICAvLyAgICAgZm9yIChsZXQgbCA9IHRleHQubGVuZ3RoIC0gMTsgbCA+IHBvczsgbC0tKSB7XG4gICAgLy8gICAgICAgICBpZiAodGV4dC5jaGFyQ29kZUF0KGopID09IDMyKSB7XG4gICAgLy8gICAgICAgICAgICAgLy/ku47lj7PlkJHlt6bmiavmj4/liLDnqbrmoLxcbiAgICAvLyAgICAgICAgICAgICByYW5nZV9yaWdodCA9IGw7XG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgIH1cbiAgICAvL1xuICAgIC8vICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvczsgaSsrKSB7XG4gICAgLy8gICAgICAgICBpZiAodGV4dC5jaGFyQ29kZUF0KGkpID09IDMyKSB7XG4gICAgLy8gICAgICAgICAgICAgLy/ku47lt6blkJHlj7Pmiavmj4/liLDnqbrmoLxcbiAgICAvLyAgICAgICAgICAgICByYW5nZV9sZWZ0ID0gaTtcbiAgICAvLyAgICAgICAgIH1cbiAgICAvLyAgICAgfVxuICAgIC8vXG4gICAgLy8gICAgIGlmIChyYW5nZV9sZWZ0ID09IC0xKSB7XG4gICAgLy8gICAgICAgICByYW5nZV9sZWZ0ID0gMDtcbiAgICAvLyAgICAgfVxuICAgIC8vXG4gICAgLy8gICAgIGlmIChyYW5nZV9yaWdodCA9PSAtMSkge1xuICAgIC8vICAgICAgICAgcmFuZ2VfcmlnaHQgPSB0ZXh0Lmxlbmd0aDtcbiAgICAvLyAgICAgfVxuICAgIC8vXG4gICAgLy8gICAgIHJldHVybiB7XG4gICAgLy8gICAgICAgICB3b3JkczogdGV4dC5zbGljZShyYW5nZV9sZWZ0LCByYW5nZV9yaWdodCksXG4gICAgLy8gICAgICAgICBsZWZ0OiByYW5nZV9sZWZ0LFxuICAgIC8vICAgICAgICAgcmlnaHQ6IHJhbmdlX3JpZ2h0XG4gICAgLy8gICAgIH1cbiAgICAvL1xuICAgIC8vIH1cblxuICAgIC8vIHVwZGF0ZUxpc3RWaWV3QXRNdXRpcGxlKCkge1xuICAgIC8vICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuJGlucHV0LnZhbCgpO1xuICAgIC8vICAgICAvL+W+l+WIsOS9jee9riwg5Yik5pat5L2N572u5Zyo5ZOq5LiA5LiqdG9rZW7ph4xcbiAgICAvLyAgICAgY29uc3QgdG9rZW4gPSB0aGlzLmdldFRva2VuQnlDdXJzb3IoKTtcbiAgICAvLyB9XG5cbiAgICBfZmlsdGVyUmFyc2VSZXN1bHQocGFyc2VSZXN1bHQpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHBhcnNlUmVzdWx0Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgaWYgKHBhcnNlUmVzdWx0W2ldLnR5cGUgPT0gJ21hcmsnKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gocGFyc2VSZXN1bHRbaV0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICByZXNldEN1cnJlbnRNYXJrKHBhcnNlUmVzdWx0KSB7XG4gICAgICAgIHRoaXMuY3VycmVudE1hcmsgPSBudWxsO1xuICAgICAgICB0aGlzLnN0ckNhY2hlID0gJyc7XG4gICAgICAgIHRoaXMuaW5wdXRVdGlsT2JqID0ge307XG4gICAgICAgIGxldCBtYXJrUG9zID0gLTE7XG4gICAgICAgIGxldCBuZXh0ID0gZmFsc2U7XG4gICAgICAgIGxldCBtZSA9IHRoaXM7XG5cbiAgICAgICAgLyoqKlxuICAgICAgICAgKiBwYXJzZVJlc3VsdCDkuI4gbWFya3Mg5LiA5LiA5Yy56YWNXG4gICAgICAgICAqIG1hcmtQb3Mg6K6w5b2V5Yy56YWN5pyA5ZCO5LiA5qyh5oiQ5Yqf55qE5L2N572uLCBtYXJrUG9zIOacgOWQjuS9jee9rueahOaJgOaciW1hcmsg6YO95Lya6KKr6YeN572uKHJlc2V0TWFyaylcbiAgICAgICAgICovXG4gICAgICAgIGlmICh0aGlzLm1hcmtzICYmIHRoaXMubWFya3MubGVuZ3RoID4gMCAmJiBwYXJzZVJlc3VsdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBsZXQgcmVzZXQgPSBmYWxzZTtcbiAgICAgICAgICAgIC8vbWF0Y2ggc3RyIHdpdGggbWFya3MgcXVldWVzXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMubWFya3MubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IG1hcmsgPSB0aGlzLm1hcmtzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChyZXNldCB8fCAhcGFyc2VSZXN1bHRbaV0gfHwgcGFyc2VSZXN1bHRbaV0udHlwZSA9PSAndW5tYXJrJykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc2V0TWFyayhtYXJrKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKG1hcmsubWFya05hbWUgPT0gcGFyc2VSZXN1bHRbaV0ubWFya05hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgbWFya1BvcyA9IGk7XG4gICAgICAgICAgICAgICAgICAgIG1hcmsubmV4dCA9IHBhcnNlUmVzdWx0W2ldLm5leHQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzZXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKipcbiAgICAgICAgICog5pu05YW3bWFya1BvcyDlkowg5LiK6Z2i55qE5Yy56YWN57uT5p6cLCDmnaXop4nlvpflvZPliY1tYXJrXG4gICAgICAgICAqL1xuICAgICAgICBpZiAobWFya1BvcyAhPT0gLTEpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm1hcmtzW21hcmtQb3NdWyduZXh0J10pIHtcbiAgICAgICAgICAgICAgICBpZiAobWFya1BvcyA9PSB0aGlzLm1hcmtzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy/lpoLmnpzotoXlh7rnlYzpmZBcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdHJDYWNoZSA9IGJ1aWxkU3RyQ2FjaGUodGhpcy5tYXJrcy5sZW5ndGggLSAyKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50TWFyayA9IHRoaXMubWFya3NbbWFya1Bvc107XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50TWFyayA9IHRoaXMubWFya3NbbWFya1BvcyArIDFdOy8v5LiL5LiA5LiqbWFyayDkuLrlvZPliY1tYXJrXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RyQ2FjaGUgPSBidWlsZFN0ckNhY2hlKG1hcmtQb3MpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRNYXJrID0gdGhpcy5tYXJrc1ttYXJrUG9zXTsvLyDljLnphY3miJDlip/nmoTmnIDlkI7kuIDkuKptYXJr5Li6Y3VycmVudE1hcmtcbiAgICAgICAgICAgICAgICB0aGlzLnN0ckNhY2hlID0gYnVpbGRTdHJDYWNoZShtYXJrUG9zIC0gMSk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50TWFyayA9IHRoaXMubWFya3NbMF07Ly/nrKzkuIDkuKptYXJr5Li65b2T5YmNbWFya1xuICAgICAgICAgICAgdGhpcy5zdHJDYWNoZSA9ICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy/moIforrDlhYnmoIfmiYDlnKjnmoRtYXJr5piv5a6M5pW055qE5a2X56ym5LiyICjooajmmI5tYXJr55qE5a2X56ym5Liy5rKh5pyJ5L+u5pS56L+HKVxuICAgICAgICAvL+S8muaciei/meS5iOS4gOS4qumcgOaxgjog5aaC5p6c5a2X56ym5Liy5rKh5pyJ5L+u5pS5LCDngrnlh7vnmoTml7blgJnpnIDopoHlvLnlh7rlhajpg6jnmoRsaXN0LCDmiYDku6Xov5nph4zmoIforrDkuIDkuItcbiAgICAgICAgaWYgKHBhcnNlUmVzdWx0W21hcmtQb3NdICYmIHBhcnNlUmVzdWx0W21hcmtQb3NdLmF0UG9zUmlnaHQpIHtcbiAgICAgICAgICAgIHRoaXMuaW5wdXRVdGlsT2JqLmlzQ29tcGxldGUgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9pbnB1dFN0ciDkuLrmkJzntKLpnIDopoHnmoTlrZfnrKbkuLJcbiAgICAgICAgaWYgKHBhcnNlUmVzdWx0Lmxlbmd0aCA+IDAgJiYgcGFyc2VSZXN1bHRbcGFyc2VSZXN1bHQubGVuZ3RoIC0gMV0udHlwZSA9PSAndW5tYXJrJykge1xuICAgICAgICAgICAgbGV0IHN0ciA9IHBhcnNlUmVzdWx0W3BhcnNlUmVzdWx0Lmxlbmd0aCAtIDFdLnN0cjtcbiAgICAgICAgICAgIGlmIChzdHIuaW5kZXhPZih0aGlzLmN1cnJlbnRNYXJrLmJlZm9yZSgpKSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgc3RyID0gc3RyLnNsaWNlKHRoaXMuY3VycmVudE1hcmsuYmVmb3JlKCkubGVuZ3RoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuaW5wdXRVdGlsT2JqLmlucHV0U3RyID0gc3RyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pbnB1dFV0aWxPYmouaW5wdXRTdHIgPSBcIlwiO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gYnVpbGRTdHJDYWNoZShsKSB7XG4gICAgICAgICAgICBsZXQgc3RyID0gJyc7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICBzdHIgKz0gbWUubWFrZU1hcmtTdHIobWUubWFya3NbaV0pICsgJyAnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHN0cjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlZnJlc2hMaXN0VmlldygpIHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudEN1cnNvclJlY3QpIHtcbiAgICAgICAgICAgIHRoaXMubGlzdFZpZXcuJGVsLmNzcyh7XG4gICAgICAgICAgICAgICAgbGVmdDogdGhpcy5jdXJyZW50Q3Vyc29yUmVjdC54LFxuICAgICAgICAgICAgICAgIHRvcDogdGhpcy5jdXJyZW50Q3Vyc29yUmVjdC55XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRNYXJrKSB7XG4gICAgICAgICAgICAvL+agueaNruW9k+WJjW1hcmvljrtnZXRkYXRhXG4gICAgICAgICAgICB0aGlzLm1ha2VEYXRhT2JqW3RoaXMuY3VycmVudE1hcmsubWFya05hbWVdKHRoaXMuaW5wdXRVdGlsT2JqKS50aGVuKChkYXRhLCB0ZW1wbGF0ZSkgPT4ge1xuICAgICAgICAgICAgICAgIC8v5Yi35pawbGlzdHZpZXdcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RWaWV3LnJlZnJlc2goZGF0YSwgdGVtcGxhdGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDlj4LmlbA6XG4gICAgICogICAgICBzdHI6IOimgeino+aekOeahOWtl+espuS4slxuICAgICAqICAgICAgcG9zOiDlhYnmoIfmiYDlnKjnmoTkvY3nva5cbiAgICAgKlxuICAgICAqIOino+aekOinhOWImTpcbiAgICAgKiAgICAgIOS7peWtl+espuS4suaJq+aPj+eahOaWueW8jywg5LuO5bem5ZCR5Y+z5omr5o+PXG4gICAgICogICAgICDmr4/miavmj4/kuIDkuKrlrZfnrKYsXG4gICAgICogICAgICAgICAg5aaC5p6c6K+l5a2X56ym5piv56m65qC8LCDot7Pov4fmiavmj49cbiAgICAgKiAgICAgICAgICDlpoLmnpzkuI3mmK/nqbrmoLwsIOWwseWIpOaWreivpeWtl+espuaYr+S4jeaYr+WMuemFjeW3sue7j+WtmOWcqOeahG1hcmtcbiAgICAgKiAgICAgICAgICAgICAg6Iul5Yy56YWNLCDliJlyZXN1bHQucHVzaCh7dHlwZTpcIm1hcmtcIn0pXG4gICAgICogICAgICAgICAgICAgICAgICDoi6XljLnphY3nmoTmnIDlpKflj7PovrnnlYzlpKfkuo7lhYnmoIfnmoTkvY3nva4sIOWImeWinuWKoGF0UG9zUmlnaHTlsZ7mgKcsIOe7k+adn+aJq+aPj1xuICAgICAqICAgICAgICAgICAgICAgICAg5aaC5p6c5rKh5Yiw6L6555WMLCDliJnmm7TmlLnlrZfnrKbntKLlvJXkvY3nva4oaSksIOe7p+e7reaJq+aPj1xuICAgICAqICAgICAgICAgICAgICDoi6XkuI3ljLnphY0sIOWImXJlc3VsdC5wdXNoKHt0eXBlOlwidW5tYXJrXCJ9KSwg57uT5p2f5omr5o+PXG4gICAgICog6L+U5Zue57uT5p6cOlxuICAgICAqICAgICAgcmVzdWx0IOmYn+WIlyAsIOavj+S4qml0ZW3mmK/kuIDkuKrlr7nosaEgLCDlr7nosaHph4zmoIflkI3or6Xlr7nosaHnmoTnibnlvoFcbiAgICAgKiAgICAgIGVnMTogW3t0eXBlOidtYXJrJyxtYXJrTmFtZTondXNlcnMnfSwge3R5cGU6J21hcmsnLCBtYXJrTmFtZTonYm9va3MnLGF0UG9zUmlnaHR9XVxuICAgICAqICAgICAgICAgICDooajmmI46IOWcqOW9k+WJjeWFieagh+WkhCwg5omr5o+P5Ye65p2l5LqG5Lik5LiqbWFyayDlr7nosaEsIOS4lOacgOWQjuS4gOS4qm1hcmvlr7nosaHkuYvkuIpcbiAgICAgKiAgICAgIGVnMjogW3t0eXBlOidtYXJrJyxtYXJrTmFtZTondXNlcnMnfSwge3R5cGU6J3VubWFyaycsIHN0cjonc3RyJ31dXG4gICAgICogICAgICAgICAgIOihqOaYjjog5Zyo5b2T5YmN5YWJ5qCH55qE5L2N572u5LiKLCDlj6rmiavmj4/liLDkuobkuIDkuKptYXJrIOWvueixoSwg5Ymp5LiL55qE5pivdW5tYXJrIOWvueixoVxuICAgICAqICAgICAgICAgICAo5LiN5Yy56YWNbWFyayDnmoTlrZfnrKYgLCDkuIDlvovop4bkuLp1bm1hcmspXG4gICAgICogKi9cbiAgICByZXNldFBhcnNlUmVzdWx0KHN0ciwgcG9zKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICAgICAgbGV0IGNvdW50ID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBzdHIubGVuZ3RoOyBpIDwgbDsgaSkgeyAvL2NvdW50IOaYr+S4uuS6humYsuatoueoi+W6j+mUmeivryzlr7zoh7Rmb3LnmoTmrbvlvqrnjq9cbiAgICAgICAgICAgIGlmIChjb3VudCsrID4gbCkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgcyA9IHN0cltpXTtcbiAgICAgICAgICAgIGlmIChzID09ICcgJykgeyAvL1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdWyduZXh0J10gPSB0cnVlOy8vbmV4dOihqOekuiwg5piv5ZCm6ZyA6KaB5bGV56S65LiL5LiA5LiqbWFya1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBpc01hcmtTdHIgPSBmYWxzZTtcbiAgICAgICAgICAgIGZvciAobGV0IGogaW4gdGhpcy5tYXJrcykge1xuICAgICAgICAgICAgICAgIGxldCBtYXJrID0gdGhpcy5tYXJrc1tqXTtcbiAgICAgICAgICAgICAgICAvLyR7bWFyay5zdHJ9eHh4IOS4jeeul+S4gOS4qm1hcmtcbiAgICAgICAgICAgICAgICBsZXQgbWF0Y2hWYWx1ZSA9IGkgKyBtYXJrLnN0ci5sZW5ndGggPT09IGwgPyBtYXJrLnN0ciA6IG1hcmsuc3RyICsgJyAnO1xuICAgICAgICAgICAgICAgIGlmIChzdHIuc2xpY2UoaSkuaW5kZXhPZihtYXRjaFZhbHVlKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgb2JqID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFya05hbWU6IG1hcmsubWFya05hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbWFyaydcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChvYmopO1xuXG4gICAgICAgICAgICAgICAgICAgIC8v5aaC5p6c5Zyo5YWJ5qCH5Y+z6L65XG4gICAgICAgICAgICAgICAgICAgIGlmIChpICsgbWF0Y2hWYWx1ZS5sZW5ndGggPiBwb3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iai5hdFBvc1JpZ2h0ID0gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpICs9IG1hcmsuc3RyLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgaXNNYXJrU3RyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpc01hcmtTdHIpIHtcbiAgICAgICAgICAgICAgICBsZXQgbGFzdCA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgLy8gaWYgKCFsYXN0IHx8IGxhc3QudHlwZSAhPSAndW5tYXJrJykge1xuICAgICAgICAgICAgICAgIC8vICAgICByZXN1bHQucHVzaCh7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICB0eXBlOiAndW5tYXJrJyxcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIHN0cjogc1xuICAgICAgICAgICAgICAgIC8vICAgICB9KVxuICAgICAgICAgICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gICAgIGxhc3Quc3RyICs9IHM7XG4gICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgIGlmICghbGFzdCB8fCBsYXN0LnR5cGUgIT0gJ3VubWFyaycpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3VubWFyaycsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHI6IHN0ci5zbGljZShpKVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vICAgICBsYXN0LnN0ciArPSBzO1xuXG4gICAgICAgICAgICAgICAgLy8gaSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRQYXJzZVJlc3VsdCA9IHJlc3VsdDtcbiAgICB9XG5cbiAgICBtYWtlTWFya1N0cihtYXJrKSB7XG4gICAgICAgIHJldHVybiBtYXJrLmJlZm9yZSgpICsgbWFyay52YWx1ZSArIG1hcmsuYWZ0ZXIoKTtcbiAgICB9XG5cbiAgICBzZWxlY3RMaXN0Vmlld0l0ZW0odmFsKSB7XG4gICAgICAgIHRoaXMuY3VycmVudE1hcmsudmFsdWUgPSB2YWw7XG4gICAgICAgIGxldCBzdHIgPSB0aGlzLmN1cnJlbnRNYXJrLnN0ciA9IHRoaXMubWFrZU1hcmtTdHIodGhpcy5jdXJyZW50TWFyayk7XG4gICAgICAgIHRoaXMuJGlucHV0LnZhbCh0aGlzLnN0ckNhY2hlICsgc3RyKTtcbiAgICAgICAgJCh0aGlzKS50cmlnZ2VyKCdtYXJrQ2hhbmdlJywgJC5leHRlbmQoe30sIHRoaXMuY3VycmVudE1hcmspKTtcbiAgICAgICAgdGhpcy5zZXRDYXJldFBvc2l0aW9uKHRoaXMuJGlucHV0LnZhbCgpLmxlbmd0aCk7XG4gICAgfVxuXG4gICAgZ2V0Q3Vyc29ydFBvc2l0aW9uKCkgeyAvL+iOt+WPluWFieagh+S9jee9ruWHveaVsFxuICAgICAgICBjb25zdCBjdHJsID0gdGhpcy4kaW5wdXRbMF07XG4gICAgICAgIHZhciBDYXJldFBvcyA9IDA7IC8vIElFIFN1cHBvcnRcbiAgICAgICAgaWYgKGRvY3VtZW50LnNlbGVjdGlvbikge1xuICAgICAgICAgICAgY3RybC5mb2N1cygpO1xuICAgICAgICAgICAgdmFyIFNlbCA9IGRvY3VtZW50LnNlbGVjdGlvbi5jcmVhdGVSYW5nZSgpO1xuICAgICAgICAgICAgU2VsLm1vdmVTdGFydCgnY2hhcmFjdGVyJywgLWN0cmwudmFsdWUubGVuZ3RoKTtcbiAgICAgICAgICAgIENhcmV0UG9zID0gU2VsLnRleHQubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIC8vIEZpcmVmb3ggc3VwcG9ydFxuICAgICAgICBlbHNlIGlmIChjdHJsLnNlbGVjdGlvblN0YXJ0IHx8IGN0cmwuc2VsZWN0aW9uU3RhcnQgPT0gJzAnKVxuICAgICAgICAgICAgQ2FyZXRQb3MgPSBjdHJsLnNlbGVjdGlvblN0YXJ0O1xuICAgICAgICByZXR1cm4gKENhcmV0UG9zKTtcbiAgICB9XG5cbiAgICBzZXRDYXJldFBvc2l0aW9uKHBvcykgeyAvL+iuvue9ruWFieagh+S9jee9ruWHveaVsFxuICAgICAgICBjb25zdCBjdHJsID0gdGhpcy4kaW5wdXRbMF07XG4gICAgICAgIGN0cmwuZm9jdXMoKTtcbiAgICAgICAgaWYgKGN0cmwuc2V0U2VsZWN0aW9uUmFuZ2UpIHtcbiAgICAgICAgICAgIGN0cmwuZm9jdXMoKTtcbiAgICAgICAgICAgIGN0cmwuc2V0U2VsZWN0aW9uUmFuZ2UocG9zLCBwb3MpO1xuICAgICAgICB9IGVsc2UgaWYgKGN0cmwuY3JlYXRlVGV4dFJhbmdlKSB7XG4gICAgICAgICAgICB2YXIgcmFuZ2UgPSBjdHJsLmNyZWF0ZVRleHRSYW5nZSgpO1xuICAgICAgICAgICAgcmFuZ2UuY29sbGFwc2UodHJ1ZSk7XG4gICAgICAgICAgICByYW5nZS5tb3ZlRW5kKCdjaGFyYWN0ZXInLCBwb3MpO1xuICAgICAgICAgICAgcmFuZ2UubW92ZVN0YXJ0KCdjaGFyYWN0ZXInLCBwb3MpO1xuICAgICAgICAgICAgcmFuZ2Uuc2VsZWN0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRTdHJCZWZvcmVDdXJzb3IoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiRpbnB1dC52YWwoKS5zbGljZSgwLCB0aGlzLmdldEN1cnNvcnRQb3NpdGlvbigpKVxuICAgIH1cblxuICAgIHJlc2V0Q3VycmVudEN1cnNvclJlY3QodmFsdWUpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHRoaXMuY3VycmVudEN1cnNvclJlY3QgPSBudWxsO1xuICAgICAgICBjb25zdCAkaW5wdXRPZmZzZXQgPSB0aGlzLiRpbnB1dC5vZmZzZXQoKTtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudE1hcmsgJiYgdGhpcy5jdXJyZW50TWFyay5zdWdnZXN0UG9zaXRpb24gIT09ICdhdXRvJykge1xuICAgICAgICAgICAgcmVzdWx0ID0ge1xuICAgICAgICAgICAgICAgIHg6ICRpbnB1dE9mZnNldC5sZWZ0ICsgJ3B4JyxcbiAgICAgICAgICAgICAgICB5OiAkaW5wdXRPZmZzZXQudG9wICsgdGhpcy4kaW5wdXRbMF0ub2Zmc2V0SGVpZ2h0ICsgJ3B4J1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgcmVzdWx0ID0ge1xuICAgICAgICAgICAgICAgIHg6ICRpbnB1dE9mZnNldC5sZWZ0ICsgJ3B4JyxcbiAgICAgICAgICAgICAgICB5OiAkaW5wdXRPZmZzZXQudG9wICsgJ3B4J1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy4kZ2V0UG9zSW5wdXQudmFsKHZhbHVlKS5zaG93KCkuYXR0cignc2l6ZScsIHZhbHVlLmxlbmd0aCk7XG4gICAgICAgICAgICBjb25zdCB3aWR0aCA9IHRoaXMuJGdldFBvc0lucHV0WzBdLmNsaWVudFdpZHRoO1xuICAgICAgICAgICAgdGhpcy4kZ2V0UG9zSW5wdXQuaGlkZSgpO1xuXG4gICAgICAgICAgICByZXN1bHQgPSB7XG4gICAgICAgICAgICAgICAgeDogd2lkdGggKyAkaW5wdXRPZmZzZXQubGVmdCArICdweCcsXG4gICAgICAgICAgICAgICAgeTogJGlucHV0T2Zmc2V0LnRvcCArICdweCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50Q3Vyc29yUmVjdCA9IHJlc3VsdDtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFN1Z2dlc3Q7XG4iLCJpbXBvcnQgdGVzdERhdGEgZnJvbSAnLi9nZXREYXRhJztcbmltcG9ydCBTdWdnZXN0IGZyb20gJy4vc3VnZ2VzdCc7XG5cbmxldCBzdWdnZXN0ID0gbmV3IFN1Z2dlc3QoJCgnLmRlbW8xJyksIHRlc3REYXRhLmxpc3QpO1xuXG4kKHN1Z2dlc3QpLm9uKCdtYXJrQ2hhbmdlJywgZnVuY3Rpb24gKGUsbWFyaykge1xuICAgIGlmIChtYXJrLm1hcmtOYW1lID09PSAndXNlcnMnKSB7XG4gICAgICAgIHRlc3REYXRhLmN1cnJlbnQudXNlciA9IG1hcmsudmFsdWU7XG4gICAgICAgIHRlc3REYXRhLmN1cnJlbnQuYm9vayA9ICcnO1xuICAgIH0gZWxzZSBpZiAobWFyay5tYXJrTmFtZSA9PT0gJ2Jvb2tzJykge1xuICAgICAgICB0ZXN0RGF0YS5jdXJyZW50LmJvb2sgPSBtYXJrLnZhbHVlO1xuICAgIH1cbn0pO1xuXG5cbmxldCBzdWdnZXN0MiA9IG5ldyBTdWdnZXN0KCQoJy5kZW1vMicpLCB0ZXN0RGF0YS5vbmVEYXRhVGVzdCk7XG4kKHN1Z2dlc3QyKS5vbignbWFya0NoYW5nZScsIGZ1bmN0aW9uIChlLG1hcmspIHtcbn0pO1xuIl0sIm5hbWVzIjpbImxldCIsImNvbnN0IiwidGhpcyIsImxpc3RWaWV3Il0sIm1hcHBpbmdzIjoiQUFBQUEsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ2RBLElBQUksS0FBSyxHQUFHLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDL0VBLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQztBQUNqQkEsSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFDOztBQUVwQixLQUFLQSxJQUFJLENBQUMs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
