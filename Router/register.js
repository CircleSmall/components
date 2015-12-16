var register = (function() {
    //todo: 更好的方式使用promise写这里，而不是用回调的方式
    function item(config) {
        var that = this;
        this.url = config.url; //对应的url

        this.data = config.data; //携带的数据
        this.be = config.be; //切入视图之前的动作
        this.af = config.af; //离开视图之后的动作
        this.isLoaded = false; //是否加载过

        this.getElFn = config.getElFn;
        this.getNavElFn = config.getNavElFn;
    }

    item.prototype = {
        before: function(opt) {
            var that = this;
            that.be && that.be();
            that.el.style.display = "block";
        },

        after: function() {
            this.af && this.af();
            this.el.style.display = "none";
        },

        get el() {
            return this.elTemp ? this.elTemp : this.elTemp = this.getElFn(); //避免多次的dom查找
        }
    }

    var view = { //视图
        dict: new item({
            url: "/app/dict/dict.html",
            getElFn: function() {
                return document.getElementById("dictPanel")
            }
        }),

        trans: new item({
            url: "/app/trans/trans.html",
            getElFn: function() {
                return document.getElementById("transPanel")
            }
        }),

        setting: new item({
            url: "/app/setting/setting.html",
            getElFn: function() {
                return document.getElementById("settingPanel")
            }
        })
    }

    return view;
})()
