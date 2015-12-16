(function(navigation, register) {
    "use strict";
    var nav = navigation; //路由

    nav.onnavigation = function(evt) {

        var last, now,
            backStack = nav.backStack,
            forwardStack = nav.forwardStack;

        //获取上一个状态
        if (evt.type == "back") {
            //如果是回退操作，那么上一个状态是forwardStack 最后一个
            var temp = forwardStack[forwardStack.length - 1];
            temp ? last = register[temp.location] : console.log("无法后退")
        } else {
            var temp = backStack[backStack.length - 2];
            temp ? last = register[temp.location] : 0;
        }

        //获取现在的状态
        now = register[backStack[backStack.length - 1].location];

        //执行last的after,执行now的before
        if (last) {
            last.after();
        }
        now.before();

        //********************************
        //每次展示，就打印出stack
        var backhtml = "";
        var forwardhtml = "";

        console.log(navigation)

        for(var i in navigation.backStack) {
            backhtml += "<p>" +  navigation.backStack[i].location  + "</p>";
        }

        for(var j in navigation.forwardStack) {
            forwardhtml += "<p>" +  navigation.forwardStack[j].location  + "</p>";
        }

        document.getElementById("backStack").innerHTML = backhtml;
        document.getElementById("forwardStack").innerHTML = forwardhtml;
        //*********************************

    }

})(navigation, register)
