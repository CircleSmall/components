import $ from 'jquery';

class StickyHelper {
    constructor(ops) {
        this.$container = $(ops.container);
        this.$stickyItem = $(ops.stickyItem);
        this.init();
    }

    init() {
        let me = this;
        this.item = new Item(this.$stickyItem, me.$container);
        this.$container.on('scroll.sticky', function () {
            me.checkWhetherSticky();
        });
    }

    checkWhetherSticky() {
        let scrollTop = this.$container.scrollTop();

        if (!this.initDone) {
            // for let jquery get more preciser offset
            this.item.setOffset(scrollTop);
            this.initDone = true;
        }

        if (scrollTop > this.item.offsetScrollTop) {
            this.item.sticky();
        } else {
            this.item.unSticky();
        }
    }

    //will use in DEV-30702
    refresh() {
        this.item.refresh();
    }

    remove() {
        this.$container.off('scroll.sticky');
    }
}

class Item {
    constructor($el, $container) {
        this.status = 'normal';
        this.$el = $el;
        this.$container = $container;
        this.wrapperClassName = 'stickying';
        this.$helperDiv = $('<div class="stickyHelper"></div>');
        this.originWidth = $el[0].style.width;
        this.originTop = $el[0].style.top;
        this.originLeft = $el[0].style.left;
        this.originRight = $el[0].style.right;
    }

    setOffset(scrollTop) {
        //offsetScrollTop is a distance from this.$el to this.$container
        this.offsetScrollTop = this.getTop(this.$el) - this.getTop(this.$container, true) + scrollTop;
    }

    getTop($el, needPadding = false) {
        let elOffset = $el.offset();
        let elTop = elOffset.top - this.getMargin($el, 'top');
        if (needPadding) {
            elTop += this.getPadding($el, 'top');
        }
        return elTop;
    }

    getLeft($el, needPadding = false) {
        let elOffset = $el.offset();
        let elLeft = elOffset.left - this.getMargin($el, 'left');
        if (needPadding) {
            elLeft += this.getPadding($el, 'left');
        }
        return elLeft;
    }

    getRight($el, needPadding = false) {
        let elOffset = $el.offset();
        let elRight = window.innerWidth - elOffset.left - $el.width();
        if (needPadding) {
            elRight += this.getPadding($el, 'right');
        }
        return elRight;
    }

    getMargin($el, value) {
        return parseInt($el.css('margin-' + value)) || 0;
    }

    getPadding($el, value) {
        return parseInt($el.css('padding-' + value)) || 0;
    }

    sticky() {
        if (this.status == 'sticky') {
            return;
        }
        this.status = 'sticky';

        let elHeight = this.$el[0].offsetHeight;
        let elMarginTop = this.getMargin(this.$el, 'top');
        let elMarginBottom = this.getMargin(this.$el, 'bottom');

        this.$el.before(this.$helperDiv);
        this.$helperDiv.css({
            height: elHeight,
            'margin-top': elMarginTop,
            'margin-bottom': elMarginBottom
        });

        //ignore el margin
        this.marginTopOffset = this.getMargin(this.$el, 'top');
        this.marginLeftOffset = this.getMargin(this.$el, 'left');

        this.$el.addClass(this.wrapperClassName);
        this.$el.css({
            top: this.getTop(this.$container, true) - this.marginTopOffset,
            left: this.getLeft(this.$container, true) - this.marginLeftOffset,
            right: this.getRight(this.$container, true),
            width: 'auto'
        });
    }

    refresh() {
        this.$el.css({
            top: this.getTop(this.$container, true) - this.marginTopOffset,
            left: this.getLeft(this.$container, true) - this.marginLeftOffset,
            right: this.getRight(this.$container, true)
        });
    }

    unSticky() {
        if (this.status == 'normal') {
            return;
        }
        this.status = 'normal';
        this.$el.css({
            width: this.originWidth,
            left: this.originLeft,
            top: this.originTop,
            right: this.originRight
        });
        this.$el.removeClass(this.wrapperClassName);
        this.$helperDiv.remove();
    }
}

export default StickyHelper;
