# WinJs的对象定义和继承

WinJs的核心Winjs.base 是由两部分组成： **对象定义** 与 **继承**

> 对象定义：利用 **Object.defineProperties** 实现内部的定义过程
>
> 继承：利用 **Object.defineProperties**  加  **Object.create** 实现
> 
> 命名空间： 对象定义与继承都挂在命名空间上

## 对象定义
- 因为内部是用Object.defineProperties定义的，所以在使用时，也是用Object.defineProperties的方式去使用。

``` 
    base.Namespace.define("testnamespace", {
        location: {
            get: function() {
                return this.xx;
            }
        },
        xx: {
            get: function(){
                return "xx"
            }
        }
    });
    console.log(base.testnamespace.location);
``` 

## 继承

```
    //定义类
    var testClass = base.Class.define(function(){
        this.xx = "xx";
    }, {
        location: {
            get: function() {
                return this.xx;
            }
        },
    });

    var item = new testClass();
    console.log(item.location)

    // 定义具有继承关系的类
    var testClass2 = base.Class.derive(testClass,function(){
        this.xx = "xx";
    }, {});

    var item2 = new testClass2();
    console.log(item2.location)
```

## 补充
-  base.js 是我从Winjs里面抽出来的一个基础库，做了一点修改和删除。
-  很喜欢这种Object.defineProperties的方式。
-  这里把base.js拿出来，一是为了借鉴其思想，二是为了以后有机会可以直接在项目里使用。

