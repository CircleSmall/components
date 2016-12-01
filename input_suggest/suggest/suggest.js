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
        this.$getPosInput = $inputWrapper.find('.get-pos');//用于定位listview 的辅助input
        this.listView = new listView({
            $el: $inputWrapper.find('.list')
        });
        this.dataConfig = dataConfig;
        this.makeDataObj = {}; //生成数据的map对象
        this.marks = []; //marks数组
        // this.mutiple = false;
        // this.tokenQueue = [];
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

        // //如果只有一种mark, 且mutiple为true
        // if (this.marks.length == 1 && this.marks[0].mutiple) {
        //     this.mutiple = true;
        // }
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
    }

    updateListView() {
        let me = this;
        if (this.updateTimer) {
            clearTimeout(this.updateTimer);
        }

        this.updateTimer = setTimeout(() => {
            updateListViewTimerHandler();
        }, 100);

        function updateListViewTimerHandler() {
            const value = me.getStrBeforeCursor(); //得到光标之前的字符串
            const parseResult = me.resetParseResult(me.$input.val(), value.length);//解析字符串
            me.resetCurrentMark(parseResult);//根据字符串设置currentMark, cachestr 等值
            const rect = me.resetCurrentCursorRect(value);//得到光标位置对象
            me.refreshListView(); //根据currentMark 请求数据, 刷新listview
        }
    }

    // getKeyWordsByPos() {
    //     const pos = this.getCursortPosition();
    //     const text = this.$input.val();
    //
    //     let findTarget = false; //是否找到目标
    //     let range_left = -1; //左面空格的位置
    //     let range_right = -1; //右面空格的位置
    //
    //     for (let l = text.length - 1; l > pos; l--) {
    //         if (text.charCodeAt(j) == 32) {
    //             //从右向左扫描到空格
    //             range_right = l;
    //         }
    //     }
    //
    //     for (let i = 0; i < pos; i++) {
    //         if (text.charCodeAt(i) == 32) {
    //             //从左向右扫描到空格
    //             range_left = i;
    //         }
    //     }
    //
    //     if (range_left == -1) {
    //         range_left = 0;
    //     }
    //
    //     if (range_right == -1) {
    //         range_right = text.length;
    //     }
    //
    //     return {
    //         words: text.slice(range_left, range_right),
    //         left: range_left,
    //         right: range_right
    //     }
    //
    // }

    // updateListViewAtMutiple() {
    //     const value = this.$input.val();
    //     //得到位置, 判断位置在哪一个token里
    //     const token = this.getTokenByCursor();
    // }

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
        this.inputUtilObj = {};
        let markPos = -1;
        let next = false;
        let me = this;

        /***
         * parseResult 与 marks 一一匹配
         * markPos 记录匹配最后一次成功的位置, markPos 最后位置的所有mark 都会被重置(resetMark)
         */
        if (this.marks && this.marks.length > 0 && parseResult.length > 0) {
            let reset = false;
            //match str with marks queues
            for (let i = 0, l = this.marks.length; i < l; i++) {
                let mark = this.marks[i];
                if (reset || !parseResult[i] || parseResult[i].type == 'unmark') {
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
            let str = parseResult[parseResult.length - 1].str;
            if (str.indexOf(this.currentMark.before()) == 0) {
                str = str.slice(this.currentMark.before().length);
            }
            this.inputUtilObj.inputStr = str;
        } else {
            this.inputUtilObj.inputStr = "";
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
            this.makeDataObj[this.currentMark.markName](this.inputUtilObj).then((data, template) => {
                //刷新listview
                this.listView.refresh(data, template);
            });
        }
    }

    /**
     * 参数:
     *      str: 要解析的字符串
     *      pos: 光标所在的位置
     *
     * 解析规则:
     *      以字符串扫描的方式, 从左向右扫描
     *      每扫描一个字符,
     *          如果该字符是空格, 跳过扫描
     *          如果不是空格, 就判断该字符是不是匹配已经存在的mark
     *              若匹配, 则result.push({type:"mark"})
     *                  若匹配的最大右边界大于光标的位置, 则增加atPosRight属性, 结束扫描
     *                  如果没到边界, 则更改字符索引位置(i), 继续扫描
     *              若不匹配, 则result.push({type:"unmark"}), 结束扫描
     * 返回结果:
     *      result 队列 , 每个item是一个对象 , 对象里标名该对象的特征
     *      eg1: [{type:'mark',markName:'users'}, {type:'mark', markName:'books',atPosRight}]
     *           表明: 在当前光标处, 扫描出来了两个mark 对象, 且最后一个mark对象之上
     *      eg2: [{type:'mark',markName:'users'}, {type:'unmark', str:'str'}]
     *           表明: 在当前光标的位置上, 只扫描到了一个mark 对象, 剩下的是unmark 对象
     *           (不匹配mark 的字符 , 一律视为unmark)
     * */
    resetParseResult(str, pos) {
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
                    let obj = {
                        markName: mark.markName,
                        type: 'mark'
                    };

                    result.push(obj);

                    //如果在光标右边
                    if (i + matchValue.length > pos) {
                        obj.atPosRight = true
                        return result;
                    }
                    i += mark.str.length;
                    isMarkStr = true;
                    break;
                }
            }
            if (!isMarkStr) {
                let last = result[result.length - 1];
                // if (!last || last.type != 'unmark') {
                //     result.push({
                //         type: 'unmark',
                //         str: s
                //     })
                // } else {
                //     last.str += s;
                // }
                if (!last || last.type != 'unmark') {
                    result.push({
                        type: 'unmark',
                        str: str.slice(i)
                    })
                }
                // } else {
                //     last.str += s;

                // i++;
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
                y: $inputOffset.top + this.$input[0].offsetHeight + 'px'
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
