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
    getData: function () {
        return new Promise(function (resolve, reject) {
            var list = [];
            for (var i in data) {
                list.push(i);
            }
            resolve(list);
        })
    },
    mark: 'users',
    suggestPosition: 'auto',
    after: function () { return ' >'; },
    before: function () { return 'users: '; }
};

var books = {
    getData: function () {
        return new Promise(function (resolve, reject) {
            if (current.user) {
                var list = [];
                for (var i in data[current.user]) {
                    list.push(i);
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

var testData = {current: current, list: list};

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
    return this;
};

ListView.prototype.show = function show () {
    this.$el.show();
    return this;
};

ListView.prototype.remove = function remove () {
    this.$el.remove();
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
    this.listView = new ListView({
        $el: $inputWrapper.find('.list')
    });
    this.dataConfig = dataConfig;
    this.makeDataObj = {};
    this.marks = [];
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
    });

    // this.$input.on('focus', () => {
    // this.updateListView();
    // });

    this.$input.on('click', function () {
        this$1.updateListView();
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
};

Suggest.prototype.parseDataItem = function parseDataItem (item) {
    var markName = item.mark;
    this.marks.push({
        // leftPos: '',
        // rightPos: '',
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
        next: false
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
            this.listView.index--;
            break;
        case keyCode.DOWN:
            this.listView.index++;
            break;
        case keyCode.ENTER:
            this.listView.hide();
            this.selectListViewItem(this.listView.value);
            break;
        case keyCode.ESC:
            this.listView.hide();
            break;
        default:
            this.updateListView();
            break;
    }
    return false;
};

Suggest.prototype.updateListView = function updateListView () {
    var value = this.getStrBeforeCursor();
    var parseResult = this.parseInputStr(value);
    this.setCurrentMark(this._filterRarseResult(parseResult));
    this.refreshListView();
    // this.setCursorToTail();
    // this.$input.focus();
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

Suggest.prototype.setCurrentMark = function setCurrentMark (parseResult) {
        var this$1 = this;

    this.currentMark = null;
    this.strCache = '';
    var markPos = -1;
    var next = false;
    var me = this;

    if (this.marks && this.marks.length > 0 && parseResult.length > 0) {
        var reset = false;
        //match str with marks queues
        for (var i = 0, l = this.marks.length; i < l; i++) {
            var mark = this$1.marks[i];
            if (reset || !parseResult[i]) {
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

    if (this.currentMark) {
        //根据当前mark去getdata
        this.makeDataObj[this.currentMark.markName]().then(function (data) {
            //刷新listview
            this$1.listView.refresh(data);
        });
    }
};

Suggest.prototype.parseInputStr = function parseInputStr (str) {
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
                result.push({
                    markName: mark.markName,
                    type: 'mark'
                });
                i += mark.str.length;
                isMarkStr = true;
                break;
            }
        }
        if (!isMarkStr) {
            var last = result[result.length - 1];
            if (!last || last.type != 'unknow') {
                result.push({
                    type: 'unknow',
                    str: i
                });
            } else {
                last.str += s;
            }
            i++;
        }
    }
    return result;
};

Suggest.prototype.makeMarkStr = function makeMarkStr (mark) {
    return mark.before() + mark.value + mark.after();
};


Suggest.prototype.selectListViewItem = function selectListViewItem (val) {
    this.currentMark.value = val;
    var str = this.currentMark.str = this.makeMarkStr(this.currentMark);
    // this.currentMark.leftPos = this.strCache.length;
    // this.currentMark.rightPos = this.strCache.length + str.length;
    this.$input.val(this.strCache + str);
    $(this).trigger('markChange', $.extend({}, this.currentMark));
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

var suggest = new Suggest($('.input-wrapper'), testData.list);

$(suggest).on('markChange', function (e,mark) {
    if (mark.markName === 'users') {
        testData.current.user = mark.value;
        testData.current.book = '';
    } else if (mark.markName === 'books') {
        testData.current.book = mark.value;
    }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi4uL3N1Z2dlc3QvZ2V0RGF0YS5qcyIsIi4uL3N1Z2dlc3QvbGlzdFZpZXcuanMiLCIuLi9zdWdnZXN0L3N1Z2dlc3QuanMiLCIuLi9zdWdnZXN0L2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImxldCBkYXRhID0ge307XG5sZXQgbmFtZXMgPSBbJ2NpcmNsZScsICd6aGloYW8nLCAnZ2FyeScsICdpbmtpZScsICdwZXJjeScsICdjb2hsaW50JywgJ2xpd2VuJ107XG5sZXQgYm9va3NOdW0gPSA1O1xubGV0IGNoYXB0ZXJzTnVtID0gNjtcblxuZm9yIChsZXQgaSBpbiBuYW1lcykge1xuICAgIGxldCB1c2VyT2JqID0gZGF0YVtuYW1lc1tpXV0gPSB7fTtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IGJvb2tzTnVtOyBqKyspIHtcbiAgICAgICAgbGV0IGJvb2tPYmogPSB1c2VyT2JqW2Ake25hbWVzW2ldfV9ib29rXyR7an1gXSA9IFtdO1xuICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGNoYXB0ZXJzTnVtOyBrKyspIHtcbiAgICAgICAgICAgIGJvb2tPYmoucHVzaChgY2hhcHRlcl8ke2t9YCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5jb25zb2xlLmxvZyhkYXRhKVxuXG5sZXQgY3VycmVudCA9IHtcbiAgICB1c2VyOiAnJyxcbiAgICBib29rOiAnJ1xufTtcblxuY29uc3QgdXNlcnMgPSB7XG4gICAgZ2V0RGF0YTogKCkgPT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgbGV0IGxpc3QgPSBbXTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgaW4gZGF0YSkge1xuICAgICAgICAgICAgICAgIGxpc3QucHVzaChpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlc29sdmUobGlzdClcbiAgICAgICAgfSlcbiAgICB9LFxuICAgIG1hcms6ICd1c2VycycsXG4gICAgc3VnZ2VzdFBvc2l0aW9uOiAnYXV0bycsXG4gICAgYWZ0ZXI6ICgpID0+ICcgPicsXG4gICAgYmVmb3JlOiAoKSA9PiAndXNlcnM6ICdcbn07XG5cbmNvbnN0IGJvb2tzID0ge1xuICAgIGdldERhdGE6ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50LnVzZXIpIHtcbiAgICAgICAgICAgICAgICBsZXQgbGlzdCA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgaW4gZGF0YVtjdXJyZW50LnVzZXJdKSB7XG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShsaXN0KVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0sXG4gICAgbWFyazogJ2Jvb2tzJyxcbiAgICBzdWdnZXN0UG9zaXRpb246ICdhdXRvJyxcbiAgICBhZnRlcjogKCkgPT4gJyA+JyxcbiAgICBiZWZvcmU6ICgpID0+ICdib29rczogJ1xufTtcblxuY29uc3QgY2hhcHRlcnMgPSB7XG4gICAgZ2V0RGF0YTogKCkgPT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coY3VycmVudClcbiAgICAgICAgICAgIGlmIChjdXJyZW50LnVzZXIgJiYgY3VycmVudC5ib29rKSB7XG4gICAgICAgICAgICAgICAgbGV0IG9iaiA9IGRhdGFbY3VycmVudC51c2VyXVtjdXJyZW50LmJvb2tdO1xuICAgICAgICAgICAgICAgIGxldCBsaXN0ID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSBpbiBvYmopIHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKG9ialtpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlc29sdmUobGlzdClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9LFxuICAgIG1hcms6ICdjaGFwdGVycycsXG4gICAgc3VnZ2VzdFBvc2l0aW9uOiAnYXV0bycsXG4gICAgYWZ0ZXI6ICgpID0+ICcgPicsXG4gICAgYmVmb3JlOiAoKSA9PiAnY2hhcHRlcnM6ICdcbn07XG5cbmNvbnN0IGxpc3QgPSBbdXNlcnMsIGJvb2tzLCBjaGFwdGVyc107XG5cbmV4cG9ydCBkZWZhdWx0IHtjdXJyZW50LCBsaXN0fVxuIiwiY2xhc3MgTGlzdFZpZXcge1xuICAgIGNvbnN0cnVjdG9yKG9wdHMgPSB7fSkge1xuXG4gICAgICAgIHRoaXMuJGVsID0gb3B0cy4kZWwgfHwgJCgnPHVsPjwvdWw+Jyk7XG4gICAgICAgIHRoaXMuZGF0YSA9IG9wdHMuZGF0YSB8fCBbXTtcblxuICAgICAgICB0aGlzLml0ZW1DbGFzc05hbWUgPSBvcHRzLml0ZW1DbGFzc05hbWUgfHwgJ2l0ZW0nO1xuICAgICAgICB0aGlzLkhPVkVSX0NMQVNTTkFNRSA9ICdzZWxlY3RlZCc7XG5cbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IG9wdHMudGVtcGxhdGUgfHwgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBsZXQgc3RyID0gJyc7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBkYXRhLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBzdHIgKz0gYDxsaSBjbGFzcz1cIiR7dGhpcy5pdGVtQ2xhc3NOYW1lfVwiIGRhdGEtb3JkZXI9XCIke2l9XCI+JHtkYXRhW2ldfTwvbGk+YDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0cjtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5faW5kZXggPSAtMTtcblxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9XG5cbiAgICBzZXQgaW5kZXgodmFsKSB7XG4gICAgICAgIGlmICh2YWwgPiB0aGlzLmRhdGEubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgdmFsID0gdGhpcy5kYXRhLmxlbmd0aCAtIDE7XG4gICAgICAgIH0gZWxzZSBpZiAodmFsIDwgMCkge1xuICAgICAgICAgICAgdmFsID0gLTFcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVwZGF0ZVZpZXdCeUluZGV4KHRoaXMuX2luZGV4ID0gdmFsKTtcbiAgICB9XG5cbiAgICBnZXQgaW5kZXgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbmRleDtcbiAgICB9XG5cbiAgICBnZXQgJHNlbGVjdEl0ZW0oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEluZGV4SXRlbSgpO1xuICAgIH1cblxuICAgIGdldCAkYWxsSXRlbSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QWxsSXRlbXMoKTtcbiAgICB9XG5cbiAgICBnZXQgdmFsdWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEluZGV4SXRlbSgpLmh0bWwoKTtcbiAgICB9XG5cbiAgICAkKHNlbGVjdG9yKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiRlbC5maW5kKHNlbGVjdG9yKTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgICB0aGlzLmluaXRFdmVudCgpO1xuICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cblxuICAgIGluaXRFdmVudCgpIHtcbiAgICAgICAgbGV0IG1lID0gdGhpcztcbiAgICAgICAgdGhpcy4kZWwub24oJ2NsaWNrJywgJy4nICsgdGhpcy5pdGVtQ2xhc3NOYW1lLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBtZS5fY2xpY2tIYW5kbGVyKCQodGhpcykpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHRoaXMuJGVsLmh0bWwodGhpcy50ZW1wbGF0ZSh0aGlzLmRhdGEpKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcmVmcmVzaChkYXRhLCB0ZW1wbGF0ZSkge1xuICAgICAgICB0aGlzLmluZGV4ID0gLTE7XG5cbiAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRGF0YShkYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0ZW1wbGF0ZSkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVUZW1wbGF0ZSh0ZW1wbGF0ZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlbmRlcigpLnNob3coKTtcbiAgICB9XG5cbiAgICB1cGRhdGVWaWV3QnlJbmRleChpbmRleCkge1xuICAgICAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID4gdGhpcy5kYXRhLmxlbmd0aCkgcmV0dXJuO1xuICAgICAgICB0aGlzLiRhbGxJdGVtLnJlbW92ZUNsYXNzKHRoaXMuSE9WRVJfQ0xBU1NOQU1FKTtcbiAgICAgICAgdGhpcy4kc2VsZWN0SXRlbS5hZGRDbGFzcyh0aGlzLkhPVkVSX0NMQVNTTkFNRSk7XG4gICAgICAgIHRoaXMuc2Nyb2xsQnlJbmRleCgpO1xuICAgIH1cblxuICAgIHVwZGF0ZURhdGEoZGF0YSkge1xuICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIH1cblxuICAgIHVwZGF0ZVRlbXBsYXRlKHRlbXBsYXRlRm4pIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IHRlbXBsYXRlRm47XG4gICAgfVxuXG4gICAgc2Nyb2xsQnlJbmRleCgpIHtcblxuICAgICAgICBpZiAoIXRoaXMuJHNlbGVjdEl0ZW1bMF0pIHJldHVybjtcblxuICAgICAgICBjb25zdCBjb250YWluZXJIZWlnaHQgPSB0aGlzLiRlbC5oZWlnaHQoKTtcbiAgICAgICAgY29uc3QgaXRlbUhlaWdodCA9IHRoaXMuJHNlbGVjdEl0ZW1bMF0ub2Zmc2V0SGVpZ2h0O1xuICAgICAgICBjb25zdCBzY3JvbGxUb3AgPSB0aGlzLiRlbC5zY3JvbGxUb3AoKTtcbiAgICAgICAgY29uc3Qgb2Zmc2V0VG9wID0gdGhpcy4kc2VsZWN0SXRlbVswXS5vZmZzZXRUb3A7XG4gICAgICAgIGxldCBzY3JvbGxUb1ZhbHVlID0gMDtcblxuICAgICAgICBpZiAob2Zmc2V0VG9wID4gKHNjcm9sbFRvcCArIGNvbnRhaW5lckhlaWdodCAtIGl0ZW1IZWlnaHQpKSB7XG5cbiAgICAgICAgICAgIC8vaWYgY3VycmVudCBpdGVtIHVuZGVyIHRoZSBjb250YWluZXIgdmlldyBhcmVhXG4gICAgICAgICAgICBzY3JvbGxUb1ZhbHVlID0gb2Zmc2V0VG9wIC0gY29udGFpbmVySGVpZ2h0ICsgaXRlbUhlaWdodDtcbiAgICAgICAgICAgIHRoaXMuJGVsLnNjcm9sbFRvcChzY3JvbGxUb1ZhbHVlKTtcblxuICAgICAgICB9IGVsc2UgaWYgKG9mZnNldFRvcCA8IHNjcm9sbFRvcCkge1xuXG4gICAgICAgICAgICAvL2lmIGN1cnJlbnQgaXRlbSBvbiB0aGUgY29udGFpbmVyIHZpZXcgYXJlYVxuICAgICAgICAgICAgc2Nyb2xsVG9WYWx1ZSA9IG9mZnNldFRvcDtcbiAgICAgICAgICAgIHRoaXMuJGVsLnNjcm9sbFRvcChzY3JvbGxUb1ZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgX2NsaWNrSGFuZGxlcigkaXRlbSkge1xuICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgY29uc3QgdGVtcEluZGV4ID0gKygkaXRlbS5hdHRyKCdkYXRhLW9yZGVyJykpO1xuICAgICAgICB0aGlzLmluZGV4ID0gdGVtcEluZGV4O1xuICAgICAgICAkKHRoaXMpLnRyaWdnZXIoJ3NlbGVjdEl0ZW0nKTtcbiAgICB9XG5cbiAgICBnZXRJbmRleEl0ZW0oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiQoJy4nICsgdGhpcy5pdGVtQ2xhc3NOYW1lKS5lcSh0aGlzLmluZGV4KTtcbiAgICB9XG5cbiAgICBnZXRBbGxJdGVtcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuJCgnLicgKyB0aGlzLml0ZW1DbGFzc05hbWUpO1xuICAgIH1cblxuICAgIGhpZGUoKSB7XG4gICAgICAgIHRoaXMuJGVsLmhpZGUoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc2hvdygpIHtcbiAgICAgICAgdGhpcy4kZWwuc2hvdygpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICByZW1vdmUoKSB7XG4gICAgICAgIHRoaXMuJGVsLnJlbW92ZSgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExpc3RWaWV3OyIsImltcG9ydCBsaXN0VmlldyBmcm9tICcuL2xpc3RWaWV3JztcblxuY29uc3Qga2V5Q29kZSA9IHtcbiAgICAnRVNDJzogMjcsXG4gICAgJ0VOVEVSJzogMTMsXG4gICAgJ1VQJzogMzgsXG4gICAgJ0RPV04nOiA0MFxufTtcblxuY2xhc3MgU3VnZ2VzdCB7XG5cbiAgICBjb25zdHJ1Y3RvcigkaW5wdXRXcmFwcGVyLCBkYXRhQ29uZmlnKSB7XG4gICAgICAgIHRoaXMuJGVsID0gJGlucHV0V3JhcHBlcjtcbiAgICAgICAgdGhpcy4kaW5wdXQgPSAkaW5wdXRXcmFwcGVyLmZpbmQoJy5pbnB1dCcpO1xuICAgICAgICB0aGlzLmxpc3RWaWV3ID0gbmV3IGxpc3RWaWV3KHtcbiAgICAgICAgICAgICRlbDogJGlucHV0V3JhcHBlci5maW5kKCcubGlzdCcpXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmRhdGFDb25maWcgPSBkYXRhQ29uZmlnO1xuICAgICAgICB0aGlzLm1ha2VEYXRhT2JqID0ge307XG4gICAgICAgIHRoaXMubWFya3MgPSBbXTtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5pbml0RXZlbnQoKTtcbiAgICAgICAgdGhpcy5wYXJzZURhdGFDb25maWcoKTtcbiAgICB9XG5cbiAgICBpbml0RXZlbnQoKSB7XG4gICAgICAgIGxldCBtZSA9IHRoaXM7XG4gICAgICAgIHRoaXMuJGVsLm9uKCdrZXl1cCcsIHRoaXMuJGlucHV0LCBmdW5jdGlvbiAoJGUpIHtcbiAgICAgICAgICAgIG1lLl9rZXl1cEhhbmRsZXIoJGUpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyB0aGlzLiRpbnB1dC5vbignZm9jdXMnLCAoKSA9PiB7XG4gICAgICAgIC8vICAgICB0aGlzLnVwZGF0ZUxpc3RWaWV3KCk7XG4gICAgICAgIC8vIH0pO1xuXG4gICAgICAgIHRoaXMuJGlucHV0Lm9uKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTGlzdFZpZXcoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCh0aGlzLmxpc3RWaWV3KS5vbignc2VsZWN0SXRlbScsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0TGlzdFZpZXdJdGVtKHRoaXMubGlzdFZpZXcudmFsdWUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwYXJzZURhdGFDb25maWcoKSB7XG4gICAgICAgIGlmICh0aGlzLmRhdGFDb25maWcuY29uc3RydWN0b3IgPT0gQXJyYXkpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgaW4gdGhpcy5kYXRhQ29uZmlnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJzZURhdGFJdGVtKHRoaXMuZGF0YUNvbmZpZ1tpXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmRhdGFDb25maWcuY29uc3RydWN0b3IgPT0gT2JqZWN0KSB7XG4gICAgICAgICAgICB0aGlzLnBhcnNlRGF0YUl0ZW0odGhpcy5kYXRhQ29uZmlnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHBhcnNlRGF0YUl0ZW0oaXRlbSkge1xuICAgICAgICBsZXQgbWFya05hbWUgPSBpdGVtLm1hcms7XG4gICAgICAgIHRoaXMubWFya3MucHVzaCh7XG4gICAgICAgICAgICAvLyBsZWZ0UG9zOiAnJyxcbiAgICAgICAgICAgIC8vIHJpZ2h0UG9zOiAnJyxcbiAgICAgICAgICAgIHZhbHVlOiAnJyxcbiAgICAgICAgICAgIHN0cjogJycsXG4gICAgICAgICAgICBtYXJrTmFtZTogbWFya05hbWUsXG4gICAgICAgICAgICBzdWdnZXN0UG9zaXRpb246IGl0ZW0uc3VnZ2VzdFBvc2l0aW9uLFxuICAgICAgICAgICAgYWZ0ZXI6IGl0ZW0uYWZ0ZXIgfHwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJlZm9yZTogaXRlbS5iZWZvcmUgfHwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG5leHQ6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLm1ha2VEYXRhT2JqW21hcmtOYW1lXSA9IGl0ZW0uZ2V0RGF0YTtcbiAgICB9XG5cbiAgICByZXNldE1hcmsobWFyaykge1xuICAgICAgICBtYXJrLmxlZnRQb3MgPSAnJztcbiAgICAgICAgbWFyay5yaWdodFBvcyA9ICcnO1xuICAgICAgICBtYXJrLnZhbHVlID0gJyc7XG4gICAgICAgIG1hcmsuc3RyID0gJyc7XG4gICAgICAgIG1hcmsubmV4dCA9IGZhbHNlO1xuICAgIH1cblxuICAgIF9rZXl1cEhhbmRsZXIoZSkge1xuICAgICAgICBzd2l0Y2ggKGUua2V5Q29kZSkge1xuICAgICAgICAgICAgY2FzZSBrZXlDb2RlLlVQIDpcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RWaWV3LmluZGV4LS07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGtleUNvZGUuRE9XTjpcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RWaWV3LmluZGV4Kys7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGtleUNvZGUuRU5URVI6XG4gICAgICAgICAgICAgICAgdGhpcy5saXN0Vmlldy5oaWRlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RMaXN0Vmlld0l0ZW0odGhpcy5saXN0Vmlldy52YWx1ZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGtleUNvZGUuRVNDOlxuICAgICAgICAgICAgICAgIHRoaXMubGlzdFZpZXcuaGlkZSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUxpc3RWaWV3KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHVwZGF0ZUxpc3RWaWV3KCkge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZ2V0U3RyQmVmb3JlQ3Vyc29yKCk7XG4gICAgICAgIGxldCBwYXJzZVJlc3VsdCA9IHRoaXMucGFyc2VJbnB1dFN0cih2YWx1ZSk7XG4gICAgICAgIHRoaXMuc2V0Q3VycmVudE1hcmsodGhpcy5fZmlsdGVyUmFyc2VSZXN1bHQocGFyc2VSZXN1bHQpKTtcbiAgICAgICAgdGhpcy5yZWZyZXNoTGlzdFZpZXcoKTtcbiAgICAgICAgLy8gdGhpcy5zZXRDdXJzb3JUb1RhaWwoKTtcbiAgICAgICAgLy8gdGhpcy4kaW5wdXQuZm9jdXMoKTtcbiAgICB9XG5cbiAgICBfZmlsdGVyUmFyc2VSZXN1bHQocGFyc2VSZXN1bHQpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHBhcnNlUmVzdWx0Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgaWYgKHBhcnNlUmVzdWx0W2ldLnR5cGUgPT0gJ21hcmsnKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gocGFyc2VSZXN1bHRbaV0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBzZXRDdXJyZW50TWFyayhwYXJzZVJlc3VsdCkge1xuICAgICAgICB0aGlzLmN1cnJlbnRNYXJrID0gbnVsbDtcbiAgICAgICAgdGhpcy5zdHJDYWNoZSA9ICcnO1xuICAgICAgICBsZXQgbWFya1BvcyA9IC0xO1xuICAgICAgICBsZXQgbmV4dCA9IGZhbHNlO1xuICAgICAgICBsZXQgbWUgPSB0aGlzO1xuXG4gICAgICAgIGlmICh0aGlzLm1hcmtzICYmIHRoaXMubWFya3MubGVuZ3RoID4gMCAmJiBwYXJzZVJlc3VsdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBsZXQgcmVzZXQgPSBmYWxzZTtcbiAgICAgICAgICAgIC8vbWF0Y2ggc3RyIHdpdGggbWFya3MgcXVldWVzXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMubWFya3MubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IG1hcmsgPSB0aGlzLm1hcmtzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChyZXNldCB8fCAhcGFyc2VSZXN1bHRbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNldE1hcmsobWFyayk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChtYXJrLm1hcmtOYW1lID09IHBhcnNlUmVzdWx0W2ldLm1hcmtOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIG1hcmtQb3MgPSBpO1xuICAgICAgICAgICAgICAgICAgICBtYXJrLm5leHQgPSBwYXJzZVJlc3VsdFtpXS5uZXh0O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc2V0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWFya1BvcyAhPT0gLTEpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm1hcmtzW21hcmtQb3NdWyduZXh0J10pIHtcbiAgICAgICAgICAgICAgICBpZiAobWFya1BvcyA9PSB0aGlzLm1hcmtzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy/lpoLmnpzotoXlh7rnlYzpmZBcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdHJDYWNoZSA9IGJ1aWxkU3RyQ2FjaGUodGhpcy5tYXJrcy5sZW5ndGggLSAyKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50TWFyayA9IHRoaXMubWFya3NbbWFya1Bvc107XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50TWFyayA9IHRoaXMubWFya3NbbWFya1BvcyArIDFdOy8v5LiL5LiA5LiqbWFyayDkuLrlvZPliY1tYXJrXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RyQ2FjaGUgPSBidWlsZFN0ckNhY2hlKG1hcmtQb3MpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRNYXJrID0gdGhpcy5tYXJrc1ttYXJrUG9zXTsvLyDljLnphY3miJDlip/nmoTmnIDlkI7kuIDkuKptYXJr5Li6Y3VycmVudE1hcmtcbiAgICAgICAgICAgICAgICB0aGlzLnN0ckNhY2hlID0gYnVpbGRTdHJDYWNoZShtYXJrUG9zIC0gMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE1hcmsgPSB0aGlzLm1hcmtzWzBdOy8v56ys5LiA5LiqbWFya+S4uuW9k+WJjW1hcmtcbiAgICAgICAgICAgIHRoaXMuc3RyQ2FjaGUgPSAnJztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGJ1aWxkU3RyQ2FjaGUobCkge1xuICAgICAgICAgICAgbGV0IHN0ciA9ICcnO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgc3RyICs9IG1lLm1ha2VNYXJrU3RyKG1lLm1hcmtzW2ldKSArICcgJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzdHI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZWZyZXNoTGlzdFZpZXcoKSB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRNYXJrKSB7XG4gICAgICAgICAgICAvL+agueaNruW9k+WJjW1hcmvljrtnZXRkYXRhXG4gICAgICAgICAgICB0aGlzLm1ha2VEYXRhT2JqW3RoaXMuY3VycmVudE1hcmsubWFya05hbWVdKCkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgIC8v5Yi35pawbGlzdHZpZXdcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RWaWV3LnJlZnJlc2goZGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHBhcnNlSW5wdXRTdHIoc3RyKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICAgICAgbGV0IGNvdW50ID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBzdHIubGVuZ3RoOyBpIDwgbDsgaSkgeyAvL2NvdW50IOaYr+S4uuS6humYsuatoueoi+W6j+mUmeivryzlr7zoh7Rmb3LnmoTmrbvlvqrnjq9cbiAgICAgICAgICAgIGlmIChjb3VudCsrID4gbCkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgcyA9IHN0cltpXTtcbiAgICAgICAgICAgIGlmIChzID09ICcgJykgeyAvL1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdWyduZXh0J10gPSB0cnVlOy8vbmV4dOihqOekuiwg5piv5ZCm6ZyA6KaB5bGV56S65LiL5LiA5LiqbWFya1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBpc01hcmtTdHIgPSBmYWxzZTtcbiAgICAgICAgICAgIGZvciAobGV0IGogaW4gdGhpcy5tYXJrcykge1xuICAgICAgICAgICAgICAgIGxldCBtYXJrID0gdGhpcy5tYXJrc1tqXTtcbiAgICAgICAgICAgICAgICAvLyR7bWFyay5zdHJ9eHh4IOS4jeeul+S4gOS4qm1hcmtcbiAgICAgICAgICAgICAgICBsZXQgbWF0Y2hWYWx1ZSA9IGkgKyBtYXJrLnN0ci5sZW5ndGggPT09IGwgPyBtYXJrLnN0ciA6IG1hcmsuc3RyICsgJyAnO1xuICAgICAgICAgICAgICAgIGlmIChzdHIuc2xpY2UoaSkuaW5kZXhPZihtYXRjaFZhbHVlKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJrTmFtZTogbWFyay5tYXJrTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdtYXJrJ1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgaSArPSBtYXJrLnN0ci5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIGlzTWFya1N0ciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaXNNYXJrU3RyKSB7XG4gICAgICAgICAgICAgICAgbGV0IGxhc3QgPSByZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgICAgIGlmICghbGFzdCB8fCBsYXN0LnR5cGUgIT0gJ3Vua25vdycpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3Vua25vdycsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHI6IGlcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsYXN0LnN0ciArPSBzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBtYWtlTWFya1N0cihtYXJrKSB7XG4gICAgICAgIHJldHVybiBtYXJrLmJlZm9yZSgpICsgbWFyay52YWx1ZSArIG1hcmsuYWZ0ZXIoKTtcbiAgICB9XG5cblxuICAgIHNlbGVjdExpc3RWaWV3SXRlbSh2YWwpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50TWFyay52YWx1ZSA9IHZhbDtcbiAgICAgICAgbGV0IHN0ciA9IHRoaXMuY3VycmVudE1hcmsuc3RyID0gdGhpcy5tYWtlTWFya1N0cih0aGlzLmN1cnJlbnRNYXJrKTtcbiAgICAgICAgLy8gdGhpcy5jdXJyZW50TWFyay5sZWZ0UG9zID0gdGhpcy5zdHJDYWNoZS5sZW5ndGg7XG4gICAgICAgIC8vIHRoaXMuY3VycmVudE1hcmsucmlnaHRQb3MgPSB0aGlzLnN0ckNhY2hlLmxlbmd0aCArIHN0ci5sZW5ndGg7XG4gICAgICAgIHRoaXMuJGlucHV0LnZhbCh0aGlzLnN0ckNhY2hlICsgc3RyKTtcbiAgICAgICAgJCh0aGlzKS50cmlnZ2VyKCdtYXJrQ2hhbmdlJywgJC5leHRlbmQoe30sIHRoaXMuY3VycmVudE1hcmspKTtcbiAgICB9XG5cbiAgICBnZXRDdXJzb3J0UG9zaXRpb24oKSB7IC8v6I635Y+W5YWJ5qCH5L2N572u5Ye95pWwXG4gICAgICAgIGNvbnN0IGN0cmwgPSB0aGlzLiRpbnB1dFswXTtcbiAgICAgICAgdmFyIENhcmV0UG9zID0gMDsgLy8gSUUgU3VwcG9ydFxuICAgICAgICBpZiAoZG9jdW1lbnQuc2VsZWN0aW9uKSB7XG4gICAgICAgICAgICBjdHJsLmZvY3VzKCk7XG4gICAgICAgICAgICB2YXIgU2VsID0gZG9jdW1lbnQuc2VsZWN0aW9uLmNyZWF0ZVJhbmdlKCk7XG4gICAgICAgICAgICBTZWwubW92ZVN0YXJ0KCdjaGFyYWN0ZXInLCAtY3RybC52YWx1ZS5sZW5ndGgpO1xuICAgICAgICAgICAgQ2FyZXRQb3MgPSBTZWwudGV4dC5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRmlyZWZveCBzdXBwb3J0XG4gICAgICAgIGVsc2UgaWYgKGN0cmwuc2VsZWN0aW9uU3RhcnQgfHwgY3RybC5zZWxlY3Rpb25TdGFydCA9PSAnMCcpXG4gICAgICAgICAgICBDYXJldFBvcyA9IGN0cmwuc2VsZWN0aW9uU3RhcnQ7XG4gICAgICAgIHJldHVybiAoQ2FyZXRQb3MpO1xuICAgIH1cblxuICAgIHNldENhcmV0UG9zaXRpb24ocG9zKSB7IC8v6K6+572u5YWJ5qCH5L2N572u5Ye95pWwXG4gICAgICAgIGNvbnN0IGN0cmwgPSB0aGlzLiRpbnB1dFswXTtcbiAgICAgICAgY3RybC5mb2N1cygpO1xuICAgICAgICBpZiAoY3RybC5zZXRTZWxlY3Rpb25SYW5nZSkge1xuICAgICAgICAgICAgY3RybC5mb2N1cygpO1xuICAgICAgICAgICAgY3RybC5zZXRTZWxlY3Rpb25SYW5nZShwb3MsIHBvcyk7XG4gICAgICAgIH0gZWxzZSBpZiAoY3RybC5jcmVhdGVUZXh0UmFuZ2UpIHtcbiAgICAgICAgICAgIHZhciByYW5nZSA9IGN0cmwuY3JlYXRlVGV4dFJhbmdlKCk7XG4gICAgICAgICAgICByYW5nZS5jb2xsYXBzZSh0cnVlKTtcbiAgICAgICAgICAgIHJhbmdlLm1vdmVFbmQoJ2NoYXJhY3RlcicsIHBvcyk7XG4gICAgICAgICAgICByYW5nZS5tb3ZlU3RhcnQoJ2NoYXJhY3RlcicsIHBvcyk7XG4gICAgICAgICAgICByYW5nZS5zZWxlY3QoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFN0ckJlZm9yZUN1cnNvcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuJGlucHV0LnZhbCgpLnNsaWNlKDAsIHRoaXMuZ2V0Q3Vyc29ydFBvc2l0aW9uKCkpXG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTdWdnZXN0O1xuIiwiaW1wb3J0IHRlc3REYXRhIGZyb20gJy4vZ2V0RGF0YSc7XG5pbXBvcnQgU3VnZ2VzdCBmcm9tICcuL3N1Z2dlc3QnO1xuXG5sZXQgc3VnZ2VzdCA9IG5ldyBTdWdnZXN0KCQoJy5pbnB1dC13cmFwcGVyJyksIHRlc3REYXRhLmxpc3QpO1xuXG4kKHN1Z2dlc3QpLm9uKCdtYXJrQ2hhbmdlJywgZnVuY3Rpb24gKGUsbWFyaykge1xuICAgIGlmIChtYXJrLm1hcmtOYW1lID09PSAndXNlcnMnKSB7XG4gICAgICAgIHRlc3REYXRhLmN1cnJlbnQudXNlciA9IG1hcmsudmFsdWU7XG4gICAgICAgIHRlc3REYXRhLmN1cnJlbnQuYm9vayA9ICcnO1xuICAgIH0gZWxzZSBpZiAobWFyay5tYXJrTmFtZSA9PT0gJ2Jvb2tzJykge1xuICAgICAgICB0ZXN0RGF0YS5jdXJyZW50LmJvb2sgPSBtYXJrLnZhbHVlO1xuICAgIH1cbn0pO1xuIl0sIm5hbWVzIjpbImxldCIsImNvbnN0IiwidGhpcyIsImxpc3RWaWV3Il0sIm1hcHBpbmdzIjoiQUFBQUEsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ2RBLElBQUksS0FBSyxHQUFHLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDL0VBLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQztBQUNqQkEsSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFDOztBQUVwQixLQUFLQSxJQUFJLENBQUMsSUFBSSxLQUFLLEVBQUU7SUFDakJBLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7SUFD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
