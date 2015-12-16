var testEvent = (function() {
    /**
     * 事件工具
     * feature
     *     1、拥有命名空间的概念
     *     2、xx.xx 的定义方式,事件之间可以阻止冒泡(同级之间的事件不能阻止)
     *     3、事件的注册与定义可以携带参数
     */
    function CE() {
        if (!(this instanceof CE)) return new CE();
        /**
         * data = {
         *     namespace: {
         *         xx.xx: [],//事件队列
         *         xx: [] // 事件队列
         *     }
         * }
         */
        this.data = {};
        this.DEFAULT_NAMESPANCE = "global";
        this.currentNameSpace = this.DEFAULT_NAMESPANCE; //当前命名空间(默认为global)
        this.init();
    };

    CE.prototype = {
        init: function() {

        },

        // 注册事件
        on: function(method, handler) {
            if (!method) {
                console.log("请输入正确的on method")
                return false;
            }

            var that = this;
            var data = this.data;
            var currentNameSpace = this.currentNameSpace; //获取当前命名空间

            data[currentNameSpace] || (data[currentNameSpace] = {});
            data[currentNameSpace][method] || (data[currentNameSpace][method] = []);
            

            data[currentNameSpace][method].push({
                handler: handler
            })

        },

        trigger: function(method, para) {
            if (!method) {
                console.log("请输入正确的trigger method")
                return false;
            }

            var data = this.data;

            //如果方法没有注册 
            if (!data[this.currentNameSpace][method]) {
                console.log(method + "  方法没有注册，无法trigger");
            }

            //事件冒泡
            var originArr = method.split(".");
            var targetArr = []

            //拿到需要遍历的method 队列
            while (originArr.length) {
                targetArr.push(originArr.join("."));
                originArr.pop();
            }

            for (var i = 0, l = targetArr.length; i < l ; i++) {

                var methodObj = data[this.currentNameSpace][targetArr[i]];

                var stopPropagation = false;//默认不阻止冒泡

                //遍历注册事件队列
                for (var j in methodObj) {
                    var handler = methodObj[j].handler;
                    if(handler(para) === false) {//依次执行每个事件队列
                        //阻止冒泡
                        stopPropagation = true;
                    }
                }

                if(stopPropagation) return;

            }
        },

        //命名空间的注册(命名空间不能包含".")
        namespace: function(namespace) {
            if (!namespace) {
                this.currentNameSpace = this.DEFAULT_NAMESPANCE;
            } else if (!(namespace.indexOf(".") == -1)) {
                console.log("warning:  namespace 中不能包含'.' ")
            } else {
                this.data[namespace] || (this.data[namespace] = {});
                this.currentNameSpace = namespace
            }
            return this;
        }
    }

    var ce = CE();

    return function(namespace) {
        return ce.namespace(namespace);
    };

})()

//测试
// var method = void(0);
// var method1 = "a";
// var method2 = "a.b";
// var method3 = "a.b.c";

// testEvent().on(method, function(para) {
//     console.log(method, para);
// });

// testEvent().on(method1, function(para) {
//     console.log(method1, para);
// });

// testEvent().on(method2, function(para) {
//     console.log(method2, para);
// });

// testEvent().on(method3, function(para) {
//     console.log(method3, para);
//     return false;
// });

// testEvent().on(method3, function(para) {
//     console.log(method3, para);
//     return false;
// });

// testEvent().trigger(method, {
//     test: "xx"
// });
// // testEvent().trigger(method1,{test1:"xx"});
// // testEvent().trigger(method2,{test2:"xx"});
// testEvent().trigger(method3, {
//     test3: "xx"
// });
