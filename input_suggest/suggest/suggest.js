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
        this.listView = new listView({
            $el: $inputWrapper.find('.ui-autocomplete')
        });
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

        $('body').on('click', $.proxy(this.clickOutsideHandler, this));
        $(window).on('resize', $.proxy(this.resizeHandler, this));

        $(this.listView).on('selectItem', function () {
            let value = me.listView.value;
            if (me.listView.currentItemIsReplace) {
                me.currentMark.replaceValue = value;
            }
            me.selectListViewItem(value, {
                id: me.listView.getCurrentItemAttr('id'),
                data: me.listView.currentItemData
            });
        });
    }

    clickOutsideHandler() {
        this.listView.hide();
        if (this.$input.val().length == 0) {
            $(this).trigger('clickOutSideAndNoValue');
        }
    }

    resizeHandler() {
        let me = this;
        if (this.resizeTimer) {
            clearTimeout(this.resizeTimer);
        }
        this.resizeTimer = setTimeout(function () {
            me.resetCurrentCursorRect(me.strBeforeCursor);
            me.refreshListView();
        }, 100);
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
            autoNext: item.autoNext,
            next: false,
            renderReplaceValue: item.renderReplaceValue,
            replaceValue: '',
            placeHolder: item.placeHolder,
            data: null
        });
        this.makeDataObj[markName] = item.getData;
    }

    resetMark(mark) {
        mark.leftPos = '';
        mark.rightPos = '';
        mark.value = '';
        mark.str = '';
        mark.next = false;
        mark.id = '';
        mark.data = null;
    }

    resetMarks(tempos) {
        if (this.marks.length > 0) {
            for (let i = tempos || 0, l = this.marks.length; i < l; i++) {
                this.resetMark(this.marks[i]);
            }
        }
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
                if (this.listView.display == 'hide') {
                    $(this).trigger('enter', this.currentMark);
                } else {
                    this.selectListViewItem(this.listView.value, {
                        id: this.listView.getCurrentItemAttr('id'),
                        data: this.listView.currentItemData
                    });
                    this.listView.hide();
                }
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
            let value = me.getStrBeforeCursor();
            const parseResult = me.resetParseResult(me.$input.val(), value.length);
            me.resetCurrentMark(parseResult);
            value = me.strBeforeCursor = me.getStrBeforeCursor();
            me.resetCurrentCursorRect(value);
            me.resetPlaceHolder();
            me.refreshListView();
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

    resetPlaceHolder() {
        if (this.currentMark.placeHolder && this.currentMark.placeHolder()) {
            this.$input.attr('placeholder', this.currentMark.placeHolder());
        } else {
            this.$input.attr('placeholder', '');
        }
    }

    resetCurrentMark(parseResult) {
        this.currentMark = null;
        this.strCache = '';
        this.inputUtilObj = {};
        let markPos = -1;
        let me = this;

        /***
         * match parseResult and marks
         * markPos record last pos of match success
         */
        if (this.marks && this.marks.length > 0 && parseResult.length > 0) {
            let reset = false;
            //match str with marks queues
            for (let i = 0, l = this.marks.length; i < l; i++) {
                let mark = this.marks[i];
                if (reset || !parseResult[i] || parseResult[i].type == 'unmark') {
                    break;
                }

                if (mark.markName == parseResult[i].markName) {
                    mark.next = parseResult[i].next;
                    if (!parseResult[i].atPosRight) {
                        markPos = i;
                    }
                } else {
                    reset = true;
                }
            }
        }

        /***
         * get currentMark by match result
         */
        if (markPos !== -1) {
            if (this.marks[markPos]['next']) {
                if (markPos == this.marks.length - 1) {
                    this.strCache = buildStrCache(this.marks.length - 2);
                    this.currentMark = this.marks[markPos];
                } else {
                    this.currentMark = this.marks[markPos + 1];// current mark is next mark
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
                this.currentMark = this.marks[markPos];
                this.strCache = buildStrCache(markPos - 1);
            }

        } else {
            this.currentMark = this.marks[0];
            this.strCache = '';
        }

        let temPos = this.marks.indexOf(this.currentMark);

        if (parseResult[temPos] && parseResult[temPos].str == this.currentMark.str) {
            this.inputUtilObj.isComplete = true;
            this.inputUtilObj.inputStr = makeInputStr(temPos);
        } else if (parseResult[temPos] && parseResult[temPos].type == 'unmark') {
            this.inputUtilObj.inputStr = makeInputStr(temPos);
        } else {
            this.inputUtilObj.inputStr = '';
        }

        function makeInputStr(temPos) {
            let lastStr = '';
            let str = parseResult[temPos].str;
            for (let i = temPos + 1, l = me.marks.length; i < l; i++) {
                lastStr += me.marks[i].str;
            }

            if (str.indexOf(lastStr) > -1) {
                //-1 : Subtract the length of space between last and str
                str = str.slice(0, str.length - lastStr.length - 1);
            }

            return me.getMarkStrExceptExternalStr(str, me.currentMark);
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
        let me = this;
        if (this.currentCursorRect) {
            this.listView.$el.css({
                left: this.currentCursorRect.x,
                top: this.currentCursorRect.y
            });
        }
        if (this.currentMark) {
            this.makeDataObj[this.currentMark.markName](this.inputUtilObj).then((data, template) => {
                this.listView.refresh(data, template, me.inputUtilObj.inputStr).show();
            });
        }
    }

    resetParseResult(str, pos) {
        let marks = $.extend(true, [], this.marks);
        let result = [];
        let count = 0;
        for (let i = 0, l = str.length; i < l; i) {
            if (count++ > l) {
                break;
            }

            let s = str[i];
            if (s == ' ') { //
                if (result.length > 0) {
                    result[result.length - 1]['next'] = true;
                }
                i++;
                continue;
            }

            let mark = marks[0];
            let markStr = mark.str;

            let matchValue = i + markStr.length === l ? markStr : markStr + ' ';
            if (str.slice(i).indexOf(matchValue) === 0) {
                let obj = {
                    markName: mark.markName,
                    type: 'mark',
                    str: mark.str
                };

                result.push(obj);

                if (i + matchValue.length > pos) {
                    obj.atPosRight = true;
                    // return this.currentParseResult = result;
                }

                marks.splice(0, 1);
                i += markStr.length;
            } else {
                result.push({
                    type: 'unmark',
                    str: str.slice(i)
                });
                return this.currentParseResult = result;
            }
        }
        return this.currentParseResult = result;
    }

    //markstr exclude renderBefore.addStrAtStart
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
        let strAtStart = mark.renderBefore.addStrAtStart();
        if (mark.renderBefore && strAtStart && str.indexOf(strAtStart) === 0) {
            //before render
            str = str.slice(strAtStart.length);
        }
        if (mark.renderAfter) {
            //after render
            let before = mark.renderAfterStartStr;
            let after = mark.renderAfterEndStr;
            if (before && str.indexOf(before) == 0) {
                str = str.slice(before.length);
            }
            if (after && str.indexOf(after) == str.length - after.length) {
                str = str.slice(0, str.length - after.length);
            }
        }
        return str;
    }

    selectListViewItem(val, item) {
        if (!this.listView.noResult) {
            this.currentMark.value = val;
            this.currentMark.id = item.id;
            this.currentMark.data = item.data;
            let str = this.currentMark.str = this.makeMarkStr(this.currentMark);
            let nextStr = this.currentMark.autoNext() ? ' ' : '';
            this.$input.val(this.strCache + str + nextStr);
            $(this).trigger('markChange', $.extend({}, this.currentMark));
            if (this.currentMark.autoNext()) {
                this.updateListView();
            }
            this.setCaretPosition(this.$input.val().length);
            //reset Mark
            let temPos = this.marks.indexOf(this.currentMark);
            this.resetMarks(temPos + 1);
        } else {
            this.$input.val(this.strCache);
            this.setCaretPosition(this.$input.val().length);
        }
    }

    getCursortPosition() {
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

    setCaretPosition(pos) {
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
            const coordinates = getCaretCoordinates(this.$input[0], value.length, {debug: true});
            if (coordinates.left > this.$input.width()) {
                coordinates.left = this.$input.width();
            }
            result = {
                x: coordinates.left + $inputOffset.left,
                y: coordinates.top + this._calculateLineHeight() + $inputOffset.top
            };
        }

        return this.currentCursorRect = result;
    }

    _calculateLineHeight() {
        if (this._lineHeight) {
            return this._lineHeight;
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
        return this._lineHeight = lineHeight;
    }

    remove() {
        $('body').off('click', this.clickOutsideHandler);
        $(window).off('resize', this.resizeHandler);
    }

    setMarksByPresetData(arr) {
        let str = '';
        this.resetMarks();
        if (arr.length) {
            for (let i = 0, l = arr.length; i < l; i++) {
                let current = arr[i];
                let mark = this.marks[i];
                mark.id = current.id;
                mark.value = current.value;
                mark.str = this.makeMarkStr(mark);
                str += mark.str + ' ';
            }
        }
        this.$input.val(this.strCache = str);
    }
}

export default Suggest;
