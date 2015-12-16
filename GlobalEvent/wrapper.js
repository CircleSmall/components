/**
 * 对配置文件config.js和插件event.js 进行封装
 */
var GlobalEvent = (function(testEvent, config) {
    var te = testEvent;
    var config = config;

    function GE() {};

    GE.on = function(str, para) {
        if (!GE.check(str)) return; //on的时候不用校验方法
        te("metro").on(str, para);
    }

    GE.trigger = function(str, para) {
        if (!GE.check(str, para)) return;
        te("metro").trigger(str, para);
    }

    //校验数据合法性
    GE.check = function(str, para) {
        var interf, method, result;

        interf = GE.checkInterface(str);
        if (para) {
            method = GE.checkMethod(str, para);
            result = interf && method;
        } else {
            result = interf
        }

        !result ? console.log("参数不合法 " + str + " " + JSON.stringify(para)) : 0;
        return result;
    }

    GE.checkInterface = function(str) {
        return config[str] ? true : false;
    }

    GE.checkMethod = function(str, method) {
        if (!config[str]) return false;

        for (var i in method) {
            if (!config[str][i]) return false;
        }
        return true;
    }

    return GE;
})(testEvent, config);
