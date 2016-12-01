import listView from './listView';

const keyCode = {
    'ESC': 27,
    'ENTER': 13,
    'UP': 38,
    'DOWN': 40
};

class Suggest {

    constructor($inputWrapper, dataConfig) {
        this.$el = $inputWrapper;
        this.$input = $inputWrapper.find('.input');
        this.$getPosInput = $inputWrapper.find('.get-pos');
        this.listView = new listView({
            $el: $inputWrapper.find('.list')
        });
        this.dataConfig = dataConfig;
        this.makeDataObj = {};
        this.marks = [];
        this.mutiple = false;
        this.tokenQueue = [];
        this.init();
    }

    init() {
        this.initEvent();
        this.parseDataConfig();
    }

    initEvent() {
        let me = this;
        this.$el.on('keyup', this.$input, function ($e) {
            me._keyupHandler($e);
        });

        this.$input.on('click', function () {
            me.updateListView();
            return false;
        });

        $('body').click(function () {
            me.listView.hide();
        });

        $('body').on('keyup', function (e) {
            switch (e.keyCode) {
                case keyCode.UP :
                    me.listView.index--;
                    break;
                case keyCode.DOWN:
                    me.listView.index++;
                    break;
                case keyCode.ENTER:
                    me.listView.hide();
                    me.selectListViewItem(me.listView.value);
                    break;
                case keyCode.ESC:
                    me.listView.hide();
                    break;
                default:
                    break;
            }
            return false;
        });

        $(this.listView).on('selectItem', () => {
            this.selectListViewItem(this.listView.value);
        });
    }

    parseDataConfig() {
        if (this.dataConfig.constructor == Array) {
            for (let i in this.dataConfig) {
                this.parseDataItem(this.dataConfig[i]);
            }

        } else if (this.dataConfig.constructor == Object) {
            this.parseDataItem(this.dataConfig);
        }

        //如果只有一种mark, 且mutiple为true
        if (this.marks.length == 1 && this.marks[0].mutiple) {
            this.mutiple = true;
        }
    }

    parseDataItem(item) {
        let markName = item.mark;
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
    }

    resetMark(mark) {
        mark.leftPos = '';
        mark.rightPos = '';
        mark.value = '';
        mark.str = '';
        mark.next = false;
    }

    _keyupHandler(e) {
        switch (e.keyCode) {
            case keyCode.UP :
                this.$input.blur();
            case keyCode.DOWN:
                this.$input.blur();
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
    }

    updateListView() {
        const value = this.getStrBeforeCursor();
        const rect = this.resetCurrentCursorRect(value);
        const parseResult = this.resetParseResult(value);

        if (this.mutiple) {
            //如果是在mutiple 模式下, 就不用这么多的计算了
        } else {
            this.resetCurrentMark(this._filterRarseResult(parseResult));
            this.refreshListView();
        }
    }

    updateListViewAtMutiple() {
        const value = this.$input.val();
        //得到位置, 判断位置在哪一个token里
        const token = this.getTokenByCursor();
    }

    _filterRarseResult(parseResult) {
        var result = [];
        for (let i = 0, l = parseResult.length; i < l; i++) {
            if (parseResult[i].type == 'mark') {
                result.push(parseResult[i])
            }
        }
        return result;
    }

    resetCurrentMark(parseResult) {
        this.currentMark = null;
        this.strCache = '';
        let markPos = -1;
        let next = false;
        let me = this;

        if (this.marks && this.marks.length > 0 && parseResult.length > 0) {
            let reset = false;
            //match str with marks queues
            for (let i = 0, l = this.marks.length; i < l; i++) {
                let mark = this.marks[i];
                if (reset || !parseResult[i]) {
                    this.resetMark(mark);
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
            let str = '';
            for (let i = 0; i <= l; i++) {
                str += me.makeMarkStr(me.marks[i]) + ' ';
            }
            return str;
        }
    }

    refreshListView() {
        if (this.currentCursorRect) {
            this.listView.$el.css({
                left: this.currentCursorRect.x,
                top: this.currentCursorRect.y
            })
        }
        if (this.currentMark) {
            //根据当前mark去getdata
            this.makeDataObj[this.currentMark.markName]().then((data) => {
                //刷新listview
                this.listView.refresh(data);
            });
        }
    }

    resetParseResult(str) {
        let result = [];
        let count = 0;
        for (let i = 0, l = str.length; i < l; i) { //count 是为了防止程序错误,导致for的死循环
            if (count++ > l) {
                break;
            }

            let s = str[i];
            if (s == ' ') { //
                if (result.length > 0) {
                    result[result.length - 1]['next'] = true;//next表示, 是否需要展示下一个mark
                }
                i++;
                continue
            }
            let isMarkStr = false;
            for (let j in this.marks) {
                let mark = this.marks[j];
                //${mark.str}xxx 不算一个mark
                let matchValue = i + mark.str.length === l ? mark.str : mark.str + ' ';
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
                let last = result[result.length - 1];
                if (!last || last.type != 'unknow') {
                    result.push({
                        type: 'unknow',
                        str: i
                    })
                } else {
                    last.str += s;
                }
                i++;
            }
        }
        return this.currentParseResult = result;
    }

    makeMarkStr(mark) {
        return mark.before() + mark.value + mark.after();
    }

    selectListViewItem(val) {
        this.currentMark.value = val;
        let str = this.currentMark.str = this.makeMarkStr(this.currentMark);
        this.$input.val(this.strCache + str);
        $(this).trigger('markChange', $.extend({}, this.currentMark));
        this.setCaretPosition(this.$input.val().length);
    }

    getCursortPosition() { //获取光标位置函数
        const ctrl = this.$input[0];
        var CaretPos = 0; // IE Support
        if (document.selection) {
            ctrl.focus();
            var Sel = document.selection.createRange();
            Sel.moveStart('character', -ctrl.value.length);
            CaretPos = Sel.text.length;
        }
        // Firefox support
        else if (ctrl.selectionStart || ctrl.selectionStart == '0')
            CaretPos = ctrl.selectionStart;
        return (CaretPos);
    }

    setCaretPosition(pos) { //设置光标位置函数
        const ctrl = this.$input[0];
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
    }

    getStrBeforeCursor() {
        return this.$input.val().slice(0, this.getCursortPosition())
    }

    resetCurrentCursorRect(value) {
        let result = this.currentCursorRect = null;
        const $inputOffset = this.$input.offset();
        if (this.currentMark && this.currentMark.suggestPosition !== 'auto') {
            result = {
                x: $inputOffset.left + 'px',
                y: $inputOffset.top + 'px'
            }
        } else if (!value) {
            result = {
                x: $inputOffset.left + 'px',
                y: $inputOffset.top + 'px'
            }
        } else {
            this.$getPosInput.val(value).show().attr('size', value.length);
            const width = this.$getPosInput[0].clientWidth;
            this.$getPosInput.hide();

            result = {
                x: width + $inputOffset.left + 'px',
                y: $inputOffset.top + 'px'
            }
        }

        return this.currentCursorRect = result;

    }
}

export default Suggest;
