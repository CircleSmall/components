class ListView {
    constructor(opts = {}) {

        this.$el = opts.$el || $('<ul></ul>');
        this.data = opts.data || [];

        this.itemClassName = opts.itemClassName || 'item';
        this.HOVER_CLASSNAME = 'selected';

        this.template = opts.template || function (data) {
                let str = '';
                for (let i = 0, l = data.length; i < l; i++) {
                    str += `<li class="${this.itemClassName}" data-order="${i}">${data[i]}</li>`;
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
            val = -1
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
        return this.getIndexItem().html();
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

    getIndexItem() {
        return this.$('.' + this.itemClassName).eq(this.index);
    }

    getAllItems() {
        return this.$('.' + this.itemClassName);
    }

    hide() {
        this.$el.hide();
        return this;
    }

    show() {
        this.$el.show();
        return this;
    }

    remove() {
        this.$el.remove();
        return this;
    }
}

export default ListView;