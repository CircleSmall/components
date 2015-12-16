# router

router 是web app开发一个很重要的模块，负责app的全局view的切换。
之前写过一个用 **状态机** 实现router，现在用另外一种思路，感觉这种方式更灵活。

> router 一般用于app 里面的tab切换。
    >>  比如pc词典的tab。当点击“词典”、“例句”、“百科”、“翻译”等tab时，展示相应的tab的内容。
> 
> tab 切换时, 可以
    > > 携带数据（可以通过数据，对相应的展示内容进行业务操作）
    >>  携带切换动画
    >>  可以有更好的性能优化(比如移除dom节点)
    >>  带有前进、后退的功能
>
> 将router整个大功能块拆分成三个：
    >>  navigation 驱动核心，管理router队列。
    >>  register  注册router视图
    >>  index 控制整个router的切换逻辑

## navigation
- 内部通过维护两个队列（  **backStack** 和  **forwardStack** ）来进行视图切换时的历史记录的管理。
    -   每个队列都一个是数组。数组中每一项的value是一个包含location(当前项的名字)和state(当前项携带的数据)的对象。
    
-  navigation是一个插件，在这里为router的视图切换服务，其实 **任何有用到队列管理** 的地方都可以用到他。
    -    因为navigation还自带前进和后退，所以词典查词逻辑，也很适合用navigation。
    
-  这里的navigation 是一个最简单的版本。以后若要用到，直接拿过来再次基础上修改。
``` 
    // test
    // navigation 队列一旦有所变动，就出发这个事件
    navigation.onnavigation = function(para) {
        //队列变动时，要处理的逻辑。
        //para 说明:
          //   backStack:  backStack 队列,
          //   forwardStack: forwardStack 队列,
          //   location: location 当前location,
          //   state: 当前state（数据）,
          //   type: 当前操作类型（back 是回退、forward 是前进、navigation 是正常的跳转）
    }
    //像队列数组中加入一个item: location为test1, state为{test1: "ttt1"}
    navigation.navigate("test1", {
        test1: "ttt1"
    });
    
    navigation.navigate("test2", {
        test2: "ttt2"
    });
    
    navigation.navigate("test3", {
        test3: "ttt3"
    });
    
    navigation.back(); //回退
    navigation.forward(); //前进
``` 

## register

- 注册视图实例
    -  每个视图具有before(视图进入前) 和 after(视图离开后)两种操作
    -  每个视图对应页面一个div容器
    -  每个视图可以携带数据

```
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
```

## index.js

- 通过navigation.onnavigation 实现具体的视图切换逻辑
```
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
    }
```

## 补充
-  给出的例子里，没有携带数据，且没有与事件机制相结合。
-  其实router这块的事情还是很多的，以后需要慢慢完善。。

