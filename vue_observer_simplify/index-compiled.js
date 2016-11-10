/**
 * Created by shengqing on 11/10/16.
 */
import { observe } from './observer/index';
import dep from './observer/dep';
import Watcher from './observer/watcher';

window.vm = {
    "key": "value",
    "_watchers": [],
    "_render": function () {
        console.log('_render : call vm data : ' + this.key);
    },
    "_update": function () {
        console.log('_update');
    }
};

observe(vm);

new Watcher(vm, () => {
    vm._update(vm._render());
}, () => {});

//# sourceMappingURL=index-compiled.js.map