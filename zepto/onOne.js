/**
 * onOne.js , 依赖于zepto.js , event.js
 * zepto自带的event.js 满足不了需求：
 *   他的事件代理不挂在同一个dom节点上，这样子元素无法再其相应的事件处理程序上阻止向父元素冒泡
 * 注意： 这个插件的缓存，
 */
define(function(require, exports, module) {

    //缓存挂在的代理节点
    //数组的item是多组key/value: 
    //_ele(挂在的dom节点),_sel(key是selector，value是handler)
    var delegationQueue = [];

    $.fn.onOne = function(event, selector, handler) {
        this.each(function(_, element) {
            if (!updateItem(element, selector, handler)) {
                //如果是一个新的挂载节点
                add(element, event)
            }
        });
    }

    function add(element, event) {
        if ('addEventListener' in element) {
            (function(element, event) {
                element.addEventListener(event, function(e) {
                    //在这里依次遍历所有代理的handler
                    delegatorHandler(element, e)
                }, false)
            })(element, event)
        }
    }

    function delegatorHandler(element, e) {
        var delegationItem = getItem(element);
        var selObj = delegationItem["_sel"];

        var eObj = delegationItem["_e"];
        eObj.stopPropagation = false;
        var eventObj = {
            "native": e,
            "target": e.target,
            "stopPropagation": function(){
                e.stopPropagation();
                eObj.stopPropagation = true;
            },
            "preventDefault": function(){
                e.preventDefault();
            }
        }

        var node = e.target;
        while (node && node != element && !eObj.stopPropagation) {
            //直到遍历到委托的那个节点
            for (var i in selObj) {
                var match = $(node).is(i); //判断当前节点是不是匹配selector
                if (match) {
                    for (var j = 0, l = selObj[i].length; j < l; j++) {
                        //依次执行每个注册函数
                        selObj[i][j].call(node, eventObj);
                    }
                } else {
                    continue;
                };
            }
            node = node.parentNode;
        }
        console.log(delegationQueue)
    }

    function updateItem(element, selector, handler) {

        var isItem = false;

        for (var i = 0, l = delegationQueue.length; i < l; i++) {
            var ele = delegationQueue[i]["_ele"];
            var sel = delegationQueue[i]["_sel"]; //sel 是个key位slector，value是handler的对象
            if (ele === element) {
                //如果这个节点已经挂载了事件
                addSelector(delegationQueue[i], selector, handler)
                isItem = true;
                break;
            }
        }

        if (!isItem) {
            //如果是一个新的挂载的节点
            var delegationItem = {}; //全新的对象
            var selObj = {}; //缓存selector(key) 与 handler(value)的对象
            delegationItem._ele = element;

            selObj[selector] = [];
            selObj[selector].push(handler);
            delegationItem._sel = selObj;

            delegationItem._e = {stopPropagation: false};

            delegationQueue.push(delegationItem);
        }

        return isItem;
    }

    function addSelector(delegationItem, selector, handler) {
        delegationItem["_sel"][selector] ? 0 : delegationItem["_sel"][selector] = [];
        delegationItem["_sel"][selector].push(handler)
    }

    function getItem(element) {
        for (var i = 0, l = delegationQueue.length; i < l; i++) {
            if (element === delegationQueue[i]["_ele"]) {
                return delegationQueue[i];
            }
        }
        return null;
    }
});
