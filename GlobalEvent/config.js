var config = (function() {
    /**
     * on 和 trigger时的方法名和参数名，必须与接口注册时的一致，否则不能成功调用
     */
    var config = {
        "a.b.c": { // a.b.c事件
            xx: {} // a.b.c 事件所携带的参数xx
        },
        "a.b": { // a.b事件
            xx: {} // a.b 事件所携带的参数xx
        },
        "a": { // a事件
            xx: {} // a 事件所携带的参数xx
        }
    };

    return config;
})();
