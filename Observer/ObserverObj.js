/*
* 1、当前只有监听对象的逻辑
* 2、
var obj = {a:'a'};
var obs = observer(obj)
obj.b = 'b';
observer 不会起作用, 因为set模式只支持已经存在的key.
*/
import _ from 'lodash';

class Observer {
    constructor(obj, changeHandler) {
        this._data = obj;
        this.changeHandler = changeHandler;

        this.walk(obj);
    }

    walk(obj) {
        if (!_.isObject(obj)) {
            return;
        }
        if (obj.__lmob__) {
            return obj.__lmob__;
        }
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            this.defineReactive(obj, keys[i], obj[keys[i]]);
        }
        def(obj, '__lmob__', this);
    }

    hadChange() {
        let me = this;
        if (this.updateTimer) {
            clearTimeout(this.updateTimer);
            this.updateTimer = null;
        }
        this.updateTimer = setTimeout(function () {
            me.changeHandler(me._data);
            clearTimeout(this.updateTimer);
            me.updateTimer = null;
        }, 0);
    }

    defineReactive(obj, key, val) {
        const property = Object.getOwnPropertyDescriptor(obj, key);
        if (property && property.configurable === false) {
            return;
        }
        const getter = property && property.get;
        const setter = property && property.set;

        this.walk(val);
        let me = this;
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get: function reactiveGetter() {
                const value = getter ? getter.call(obj) : val;
                return value;
            },
            set: function reactiveSetter(newVal) {
                const value = getter ? getter.call(obj) : val;
                if (newVal === value) {
                    return;
                }
                if (setter) {
                    setter.call(obj, newVal);
                } else {
                    val = newVal;
                }
                me.walk(newVal);
                me.hadChange();
            }
        });
    }
}

function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    });
}

export default Observer;
