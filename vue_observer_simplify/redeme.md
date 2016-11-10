```

/**
 * 一个对象 var ob = observer(obj)(如果是一个多层嵌套对象,则无限递归下去)
 * 给obj设置get set (如果该对象本来就有get\set 则再包一层)
 * 对象一旦被set, 就调用ob.deps.notice  (deps 里维护了一个watcher队列，可以通过ob.deps.addSub添加watch)
 */
import {observe} from './observer/index';


/**
 * 管理消息队列
 * 拥有挂载类Dep上的全局唯一对象target
 */
import dep from './observer/dep';

/**
 * 消息载体
 */
import Watcher from './observer/watcher';

window.vm = {
    "key": "value",
    "_watchers": [],
    "_render": function () {
        console.log('_render : call vm data : ' + this.key)
    },
    "_update": function () {
        console.log('_update')
    }
}

observe(vm);

/**
 * Watch 内部的函数: 必须要有个对vm的get操作
 * 当生成watcher实例时:
 *  1、把当前watcher作为全局唯一的target, 挂载到Dep类上 (Dep.pushTarget(this))
 *  2、执行handler
 *      hander 必须执行下对vm对象的get操作
 *      因为在get的时候, 如果 Dep.target 存在, 才会把当前watcher实例dep实例的队列里(dep.addSub(this))
 *  3、执行Dep.popTarget, 把Dep类上的唯一target移除
 *  4、当有对vm的set操作的时候, 直接执行dep实例上的watcher队列(dep.notify())
 *
 *
 *  注意: Dep 是消息队列的类, dep是消息队列的实例对象
 */
new Watcher(vm, () => {
    vm._update(vm._render())
}, () => {})

new Watcher(vm, () => {
    vm._update(vm._render())
    // console.log("xx")
}, () => {})



```
