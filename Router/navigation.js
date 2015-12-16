var navigation = (function() {
    /**
     * navigation 对象
     */
    function navigation() {
        if (!(this instanceof navigation)) return new navigation();
        this.backStack = []; //导航队列
        this.forwardStack = []; //前进队列
    };

    navigation.prototype = {

        get current() {
            var backStack = this.backStack;
            return backStack[backStack.length - 1]
        },

        get location() {
            return this.current.location;
        },

        get state() {
            return this.current.state;
        },

        //导航到taget, 并携带数据data
        //  target是一个字符串,data是一个数据对象
        navigate: function(target, data) {
            this.backStack.push({
                location: target,
                state: data
            })
            this.forwardStack = [];// 重置forwardStack队列
            this.trigger("navigation");
        },

        /**
         * 从当前位置跳到指定位置
         * @param {num} [pos] [要跳转的距离]
         */
        go: function(pos) {
            var backStack = this.backStack;
            var forwardStack = this.forwardStack;
            //边界检测
            if (!pos || pos < 0 && Math.abs(pos) > backStack.length //
                || pos > 0 && pos > forwardStack.length) return;

            if(pos < 0) {
                //回退时候的操作
                pos = Math.abs(pos);
                while(pos > 0 && backStack.length) {
                    forwardStack.push(backStack.pop());
                    pos--;
                }
            }

            if(pos > 0) {
                //前进时候的操作
                while(pos > 0 && forwardStack.length) {
                    backStack.push(forwardStack.pop());
                    pos--;
                }
            }

        },

        back: function(){
            if(this.backStack.length < 2) return;
            this.go(-1);
            this.trigger("navigation", "back");
        },

        forward: function(){
            this.go(1);
            this.trigger("navigation", "forward");
        },

        trigger: function(methodname, type) {
            var that = this;
            that["on" + methodname].apply(that, [{
                backStack: that.backStack,
                forwardStack: that.forwardStack,
                location: that.location,
                state: that.state,
                type: type || "navigate"
            }]);
        }

    }

    return navigation();
})();

// test
// navigation.onnavigation = function(para) {

// }
// navigation.navigate("test1", {
//     test1: "ttt1"
// });

// navigation.navigate("test2", {
//     test2: "ttt2"
// });

// navigation.navigate("test3", {
//     test3: "ttt3"
// });

// navigation.navigate("test4", {
//     test4: "ttt4"
// });

// navigation.navigate("test5", {
//     test5: "ttt5"
// });


