# 关于项目中的事件通信机制

项目中不同模块之间的通信，很多时候采用自定义事件的方式。
我认为自定义事件应该具备的功能如下
> 事件基本的功能：可以携带参数、异步调用、on/trigger
>
> 附加功能：可以像原生事件一样支持冒泡和阻止冒泡、可以拥有命名空间（更好的管理事件）
> 
> 额外约束：事件的注册与执行，必须按照指定的规则（防止滥用事件）

## event.js

- event 插件, 可以拥有命名空间、事件冒泡等机制。

 ``` 
    //使用方式
    
    //on
    testEvent(namespace).on("xx.xx", fn(para){
        console.log(para);//para 是trigge时传递过来的
    });
    
    testEvent(namespace).on("xx", fn(para){
        console.log(para);//因为xx是xx.xx的父级,所以xx.xxtrigger的时候，会冒泡到这里执行
    });
    
    //trigger
    testEvent(namespace).trigger("xx.xx", para);
 ``` 



## config.js

- 配置文件。需要用到的事件，必须在里面注册

 ```
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
 ```


## wrapper.js

对event的封装，完成功能如下：
-  根据config.js ，完成对参数的校验，拒绝非法的参数调用
-  这里临时统一用“metro”这一命名空间


## TODO
.........

