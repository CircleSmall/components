import listView from './listView';
import getCaretCoordinates from'./textarea_caret';

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
        this.$getPosInput = $inputWrapper.find('.input-pos-help');//用于定位listview 的辅助input
        this.listView = new listView({
            $el: $inputWrapper.find('.ui-autocomplete')
        });
        // this.dataConfig = dataConfig || [];
        // this.makeDataObj = {}; //生成数据的map对象
        // this.marks = []; //marks数组
        this.init();
        this.updateConfig(dataConfig);
    }

    init() {
        this.initEvent();
    }

    initEvent() {
        let me = this;

        this.$input.on('keydown', $.proxy(this._keyDownHandler, this));

        this.$input.on('click', function () {
            me.updateListView();
            return false;
        });

        $('body').click(function () {
            me.listView.hide();
        });

        $(this.listView).on('selectItem', () => {
            let value = this.listView.value;
            if(this.listView.currentItemIsReplace) {
                this.currentMark.replaceValue = value;
            }
            this.selectListViewItem(value);
        });
    }

    updateConfig(dataConfig) {
        this.marks = [];
        this.makeDataObj = {};
        this.dataConfig = dataConfig;
        this.parseDataConfig();
    }

    parseDataConfig() {
        if (this.dataConfig.constructor == Array) {
            for (let i in this.dataConfig) {
                this.parseDataItem(this.dataConfig[i]);
            }

        } else if (this.dataConfig.constructor == Object) {
            this.parseDataItem(this.dataConfig);
        }
    }

    parseDataItem(item) {
        let markName = item.mark;
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
    }

    resetMark(mark) {
        mark.leftPos = '';
        mark.rightPos = '';
        mark.value = '';
        mark.str = '';
        mark.next = false;
    }

    _keyDownHandler(e) {
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
            let value = me.getStrBeforeCursor(); //得到光标之前的字符串
            const parseResult = me.resetParseResult(me.$input.val(), value.length);//解析字符串
            me.resetCurrentMark(parseResult);//根据字符串设置currentMark, cachestr 等值
            value = me.getStrBeforeCursor();//光标位置有可能会变化
            me.resetCurrentCursorRect(value);//得到光标位置对象
            me.refreshListView(); //根据currentMark 请求数据, 刷新listview
        }
    }

    _filterRarseResult(parseResult) {
        var result = [];
        for (let i = 0, l = parseResult.length; i < l; i++) {
            if (parseResult[i].type == 'mark') {
                result.push(parseResult[i]);
            }
        }
        return result;
    }

    resetCurrentMark(parseResult) {
        this.currentMark = null;
        this.strCache = '';
        this.inputUtilObj = {};
        let markPos = -1;
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
                    let startStrRenderBefore = this.currentMark.renderBefore && this.currentMark.renderBefore.addStrAtStart();
                    if (startStrRenderBefore) {
                        if (parseResult[markPos + 1] && parseResult[markPos + 1].str.indexOf(startStrRenderBefore) == 0) {
                        } else if (!parseResult[markPos + 1]) {
                            let start = this.currentMark.renderBefore.addStrAtStart();
                            let cacheStr = (parseResult[markPos + 1] && parseResult[markPos + 1].str) || '';
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
            let str = parseResult[parseResult.length - 1].str;
            this.inputUtilObj.inputStr = this.getMarkStrExceptExternalStr(str, this.currentMark);
        } else {
            this.inputUtilObj.inputStr = '';
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
            });
        }
        if (this.currentMark) {
            //根据当前mark去getdata
            this.makeDataObj[this.currentMark.markName](this.inputUtilObj).then((data, template) => {
                //刷新listview
                if (data.length !== 0) {
                    this.listView.refresh(data, template).show();
                } else {
                    this.listView.hide();
                }
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
        let marks = $.extend(true, [], this.marks);
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
                continue;
            }
            // let isMarkStr = false;

            //chack by mark
            let mark = marks[0];
            let markStr = mark.str;
            // for (let j in this.marks) {
            //     let mark = this.marks[j];

            //${mark.str}xxx 不算一个mark
            // if (mark.renderReplaceValue) { //比较replace值, 不比较origin值
            //     markStr = mark.replaceValue || '';
            // }
            let matchValue = i + markStr.length === l ? markStr : markStr + ' ';
            if (str.slice(i).indexOf(matchValue) === 0) {
                let obj = {
                    markName: mark.markName,
                    type: 'mark'
                };

                result.push(obj);

                //如果在光标右边
                if (i + matchValue.length > pos) {
                    obj.atPosRight = true;
                    return this.currentParseResult = result;
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
                //     result.push({
                //         type: 'unmark',
                //         str: str.slice(i)
                //     });
                // }
                return this.currentParseResult = result;
            }
            // }
            // if (!isMarkStr) {
            //     let last = result[result.length - 1];
            //     if (!last || last.type != 'unmark') {
            //         result.push({
            //             type: 'unmark',
            //             str: str.slice(i)
            //         });
            //     }
            // }
        }
        return this.currentParseResult = result;
    }

    //markstr 是不包括renderBefore.addStrAtStart 这个字符的
    makeMarkStr(mark) {
        mark.renderAfterEndStr = '';
        mark.renderAfterStartStr = '';

        if (mark.renderAfter && mark.renderAfter.addStrAtStart) {
            mark.renderAfterStartStr = mark.renderAfter.addStrAtStart();
        }

        if (mark.renderAfter && mark.renderAfter.addStrAtEnd) {
            mark.renderAfterEndStr = mark.renderAfter.addStrAtEnd();
        }

        let value = mark.replaceValue || mark.value;

        return mark.renderAfterStartStr + value + mark.renderAfterEndStr;
    }

    getMarkStrExceptExternalStr(str, mark) {
        if (mark.renderBefore && mark.renderBefore.addStrAtStart) {
            str = str.slice(mark.renderBefore.addStrAtStart.length);
        }

        let before = mark.renderAfterStartStr;
        let after = mark.renderAfterEndStr;
        if (before && str.indexOf(before) == 0) {
            str = str.slice(before.length);
        }
        if (after && str.indexOf(after) == str.length - after.length) {
            str = str.slice(0, str.length - after.length);
        }

        return str;
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
        return this.$input.val().slice(0, this.getCursortPosition());
    }

    resetCurrentCursorRect(value) {
        let result = this.currentCursorRect = null;
        const $inputOffset = this.$input.offset();
        const inputHeight = this.$input[0].offsetHeight;
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
            const coordinates = getCaretCoordinates(this.$input[0], value.length);
            result = {
                x: coordinates.left + $inputOffset.left,
                y: coordinates.top + this._calculateLineHeight() + $inputOffset.top
            };
        }

        return this.currentCursorRect = result;
    }

    _calculateLineHeight() {
        if (this._calculateLineHeight) {
            return this._calculateLineHeight;
        }
        let el = this.$input[0];
        let lineHeight = parseInt($(el).css('line-height'), 10);
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
    }
}

export default Suggest;
