class ListView {
    constructor(opts = {}) {

        this.$el = opts.$el || $('<ul></ul>');
        this.data = opts.data || [];

        this.itemClassName = opts.itemClassName || 'ui-menu-item';
        this.HOVER_CLASSNAME = 'ui-state-focus';

        this.template = opts.template || function (data) {
                let str = '';
                if (data.length == 0) {
                    return ' <strong class="no-result" style="font-weight: bold;">  no result.  </strong>';
                }
                for (let i = 0, l = data.length; i < l; i++) {
                    let item = this.parseDataItem(data[i]);
                    str += `<li 
                                class="${this.itemClassName}" 
                                data-id="${item.id}" 
                                data-origin="${item.origin}"
                                data-value="${item.value}"
                                data-is-replace="${item.isReplace}" 
                                data-str="${item.datastr}" 
                                data-order="${i}">
                                    <a href="javascript:;">${item.value}</a>
                            </li>`;
                }
                return str;
            };

        this._index = 0;

        this.init();
    }

    set index(val) {
        if (val > this.data.length - 1) {
            val = this.data.length - 1;
        } else if (val < 0) {
            val = 0;
        }
        this.updateViewByIndex(this._index = val);
    }

    get index() {
        return this._index;
    }

    get $selectItem() {
        return this.getIndexItem();
    }

    get $allItem() {
        return this.getAllItems();
    }

    get value() {
        let $currentItem = this.getIndexItem();
        if ($currentItem.length == 0) {
            return '';
        }
        return $currentItem.attr('data-value');
    }

    get currentItemData() {
        let $currentItem = this.getIndexItem();
        if ($currentItem.length == 0) {
            return '';
        }
        let data = JSON.parse(decodeURIComponent($currentItem.attr('data-str')));
        return data;
    }

    get currentItemIsReplace() {
        return this.getIndexItem().attr('data-is-replace') === 'true';
    }

    $(selector) {
        return this.$el.find(selector);
    }

    init() {
        this.initEvent();
        this.render();
    }

    initEvent() {
        let me = this;
        this.$el.on('click', '.' + this.itemClassName, function () {
            me._clickHandler($(this));
        });
        this.$el.on('click', '.no-result', function () {
            me._clickHandler($(this));
        });
    }

    render() {
        this.$el.html(this.template(this.data));
        this.getIndexItem().addClass(this.HOVER_CLASSNAME);
        return this;
    }

    refresh(data, template, str) {
        if (data) {
            this.updateData(data);
            if (data.length == 0) {
                this.noResult = true;
            } else {
                this.noResult = false;
            }
        }

        if (template) {
            this.updateTemplate(template);
        }

        this.index = this.getIndexByInputStrAndData(data, str);

        this.render().show();

        this.updateViewByIndex(this.index);

        return this;
    }

    getIndexByInputStrAndData(data, str) {
        for (let i = 0, l = data.length; i < l; i++) {
            let item = this.parseDataItem(data[i]);
            if (item.value == str) {
                return i;
            }
        }
        return 0;
    }

    parseDataItem(item) {
        let id = typeof item == 'object' && item['id'] ? item['id'] : '';
        let replace = typeof item == 'object' ? (item['replace'] || '') : '';
        let origin = typeof item == 'object' ? (item['origin'] || '') : (item || '');
        let isReplace = replace.length == 0 ? false : true;
        let value = isReplace ? replace : origin;
        let datastr = encodeURIComponent(JSON.stringify(item));
        return {id, replace, origin, isReplace, value, datastr};
    }

    updateViewByIndex(index) {
        if (index < 0 || index > this.data.length) return;
        this.$allItem.removeClass(this.HOVER_CLASSNAME);
        this.$selectItem.addClass(this.HOVER_CLASSNAME);
        this.scrollByIndex();
    }

    updateData(data) {
        this.data = data;
    }

    updateTemplate(templateFn) {
        this.template = templateFn;
    }

    scrollByIndex() {

        if (!this.$selectItem[0]) return;

        const containerHeight = this.$el.height();
        const itemHeight = this.$selectItem[0].offsetHeight;
        const scrollTop = this.$el.scrollTop();
        const offsetTop = this.$selectItem[0].offsetTop;
        let scrollToValue = 0;

        if (offsetTop > (scrollTop + containerHeight - itemHeight)) {

            //if current item under the container view area
            scrollToValue = offsetTop - containerHeight + itemHeight;
            this.$el.scrollTop(scrollToValue);

        } else if (offsetTop < scrollTop) {

            //if current item on the container view area
            scrollToValue = offsetTop;
            this.$el.scrollTop(scrollToValue);
        }

    }

    _clickHandler($item) {
        this.hide();
        const tempIndex = +($item.attr('data-order'));
        this.index = tempIndex;
        $(this).trigger('selectItem', {
            id: $item.attr('data-id'),
            data: JSON.parse(decodeURIComponent($item.attr('data-str')))
        });
    }

    getIndexItem() {
        const targetIndex = this.index < 0 ? 0 : this.index;
        return this.$('.' + this.itemClassName).eq(targetIndex);
    }

    getAllItems() {
        return this.$('.' + this.itemClassName);
    }

    getCurrentItemAttr(key) {
        let $currentItem = this.getIndexItem();
        if ($currentItem.length == 0) {
            return '';
        }
        if (key.indexOf('data-') != 0) {
            key = 'data-' + key;
        }
        return $currentItem.attr(key);
    }

    hide() {
        this.$el.hide();
        this.display = 'hide';
        return this;
    }

    show() {
        this.$el.show();
        this.display = 'show';
        return this;
    }

    remove() {
        this.$el.remove();
        this.display = 'remove';
        return this;
    }
}

export default ListView;