import _ from 'lodash';

function FastScroll(ops) {
    this.init(ops);
};

FastScroll.prototype = {
    init: function (ops) {
        this.items = ops.items;
        this.visualArea = ops.visualArea || {};
        this.container = ops.container.length > 0 ? ops.container[0] : ops.container;

        this.width = this.visualArea.width || this.container.clientWidth;
        this.offsetNum = ops.offsetNum || 3;
        this.offsetWidth = this.offsetNum * this.width;
        this.areaMap = {};

        this._initContainerStyle();
        this._initPosition();
        this._initScrollHelperDiv();
        this.draw(0, this.offsetWidth);
        this._onScrollHandler = this.onScroll.bind(this);

        this.container.addEventListener('scroll', this._onScrollHandler);
    },

    _initContainerStyle: function () {
        this.container.style.position = 'relative';
        this.container.style.overflow = 'auto';
        if (this.visualArea.width) {
            this.container.style.width = `${this.visualArea.width}px`;
        }
        if (this.visualArea.height) {
            this.container.style.height = `${this.visualArea.height}px`;
        }
    },

    _initScrollHelperDiv: function () {
        let scrollHelper = this.scrollHelper = document.createElement('div');
        scrollHelper.textContent = ' ';
        scrollHelper.style.position = 'absolute';
        scrollHelper.style.height = '1px';
        scrollHelper.style.width = `${this.totalWidth}px`;
        this.container.appendChild(scrollHelper);
    },

    _initPosition: function () {
        var counter = 0;
        for (let i = 0; i < this.items.length; i++) {
            this.items[i]._pos = counter;
            counter += this.items[i].getWidth();
        }
        this.totalWidth = counter;
    },

    onScroll: function () {
        let scrollLeft = this.container.scrollLeft;
        let mid = scrollLeft + this.width / 2;
        let start = Math.max(mid - this.offsetWidth / 2, 0);
        let end = start + this.offsetWidth;
        this.draw(start, end);
    },

    draw: function (start, end) {
        let me = this;
        _.each(this.items, function (item, index) {
            if (item._pos >= start && item._pos <= end) {
                if (!item._node) {
                    let node = me._buildItemTemplate(item);
                    item._node = node;
                }
                if (!me.areaMap[index]) {
                    me.areaMap[index] = true;
                    item._node.style.transform = `translateX(${item._pos}px)`;
                    me.container.appendChild(item._node);
                }
            } else {
                if (item._node && me.areaMap[index]) {
                    me.container.removeChild(item._node);
                    me.areaMap[index] = false;
                }
            }
        });
    },

    _buildItemTemplate: function (item) {
        let node = item.template();
        if (node.length > 0) {
            node = node[0];
        }
        node.style.position = 'absolute';
        return node;
    },

    remove: function () {
        //remove scroll event
        this.container.removeEventListener('scroll', this._onScrollHandler);
        this.container.innerHTML = '';
    }
};

export default FastScroll;
