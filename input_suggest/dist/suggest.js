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

var list = [users, books, chapters];

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
        var rect = me.resetCurrentCursorRect(value);//得到光标位置对象
        var parseResult = me.resetParseResult(me.$input.val(), value.length);//解析字符串
        me.resetCurrentMark(parseResult);//根据字符串设置currentMark, cachestr 等值
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
        this.makeDataObj[this.currentMark.markName](this.inputUtilObj).then(function (data) {
            //刷新listview
            this$1.listView.refresh(data);
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
            y: $inputOffset.top + 'px'
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
