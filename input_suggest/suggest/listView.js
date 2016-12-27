class ListView {
    constructor(opts = {}) {

        this.$el = opts.$el || $('<ul></ul>');
        this.data = opts.data || [];

        this.itemClassName = opts.itemClassName || 'ui-menu-item';
        this.HOVER_CLASSNAME = 'ui-state-focus';

        this.template = opts.template || function (data) {
                let str = '';
                for (let i = 0, l = data.length; i < l; i++) {
                    if(data[i].constructor === Object) {
                        str += `<li class="${this.itemClassName}" data-str="${data[i]['replace']}" isReplace="true" data-order="${i}"><a href="javascript:;">${data[i]['origin']}</a></li>`;
                    } else {
                        str += `<li class="${this.itemClassName}" data-order="${i}" data-str="${data[i]}"><a href="javascript:;">${data[i]}</a></li>`;
                    }
                }
                return str;
            };

        this._index = -1;

        this.init();
    }

    set index(val) {
        if (val > this.data.length - 1) {
            val = this.data.length - 1;
        } else if (val < 0) {
            val = -1;
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
        return this.getIndexItem().attr('data-str');
    }

    get currentItemIsReplace() {
        return this.getIndexItem().attr('isReplace')
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
        this.$el.on('mouseover', '.' + this.itemClassName, function () {
            me._mouseoverHandler($(this));
        });
    }

    render() {
        this.$el.html(this.template(this.data));
        return this;
    }

    refresh(data, template) {
        this.index = -1;

        if (data) {
            this.updateData(data);
        }

        if (template) {
            this.updateTemplate(template);
        }

        this.render().show();

        return this;
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
        $(this).trigger('selectItem');
    }

    _mouseoverHandler($item) {
        this.getAllItems().removeClass(this.HOVER_CLASSNAME);
        $item.addClass(this.HOVER_CLASSNAME);
    }

    getIndexItem() {
        return this.$('.' + this.itemClassName).eq(this.index);
    }

    getAllItems() {
        return this.$('.' + this.itemClassName);
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