var base = (function() {
    /**
     * base.js 主要包含定义模块、定义类与继承
     */
    var root = {};

    //定义属性
    function initializeProperties(target, members, prefix) {
        var keys = Object.keys(members);
        var isArray = Array.isArray(target);
        var properties;
        var i, len;
        for (i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            var enumerable = key.charCodeAt(0) !== 95; /*默认：_是私有属性*/
            var member = members[key];

            if (member && typeof member === 'object') {

                //member filter 
                if (member.value !== undefined || typeof member.get === 'function' || typeof member.set === 'function') {
                    if (member.enumerable === undefined) {
                        member.enumerable = enumerable;
                    }

                    if (prefix && member.setName && typeof member.setName === 'function') {
                        member.setName(prefix + "." + key);
                    }

                    properties = properties || {};
                    properties[key] = member;
                    continue;
                }
            }

            if (!enumerable) {
                properties = properties || {};
                properties[key] = {
                    value: member,
                    enumerable: enumerable,
                    configurable: true,
                    writable: true
                };
                continue;
            }
            if (isArray) {
                target.forEach(function(target) {
                    target[key] = member;
                });
            } else {
                target[key] = member;
            }
        }
        if (properties) {
            if (isArray) {
                target.forEach(function(target) {
                    Object.defineProperties(target, properties);
                });
            } else {
                Object.defineProperties(target, properties);
            }
        }
    }

    (function() {
        //创建命名空间
        function createNamespace(parentNamespace, name) {
            var currentNamespace = parentNamespace || {};
            if (name) {
                var namespaceFragments = name.split(".");

                //默认命名空间的根节点
                if (currentNamespace !== root) {
                    currentNamespace = root[currentNamespace] = {};
                }

                //递归定义命名空间
                for (var i = 0, len = namespaceFragments.length; i < len; i++) {
                    var namespaceName = namespaceFragments[i];
                    if (!currentNamespace[namespaceName]) {
                        Object.defineProperty(currentNamespace, namespaceName, {
                            value: {},
                            writable: false,
                            enumerable: true,
                            configurable: true
                        });
                    }
                    currentNamespace = currentNamespace[namespaceName];
                }
            }
            return currentNamespace;
        };

        function defineWithParent(parentNamespace, name, members) {

            var currentNamespace = createNamespace(parentNamespace, name);

            if (members) {
                initializeProperties(currentNamespace, members, name || "<ANONYMOUS>");
            }

            return currentNamespace;
        }

        function define(name, members) {
            //默认的parent是root
            return defineWithParent(root, name, members);
        }

        Object.defineProperties(root.Namespace = {}, {

            defineWithParent: {
                value: defineWithParent,
                writable: true,
                enumerable: true,
                configurable: true
            },
            define: {
                value: define,
                writable: true,
                enumerable: true,
                configurable: true
            },
        });

    })();

    (function() {

        /**
         * 类的定义
         * @param  {[type]} constructor     [构造函数]
         * @param  {[type]} instanceMembers [构造函数原型链上的属性(实例成员)]
         * @param  {[type]} staticMembers   [构造函数上的属性(静态成员)]
         * @return {[type]}                 [返回一个构造函数]
         */
        function define(constructor, instanceMembers, staticMembers) {

            constructor = constructor || function() {};

            if (instanceMembers) {
                initializeProperties(constructor.prototype, instanceMembers);
            }
            if (staticMembers) {
                initializeProperties(constructor, staticMembers);
            }
            return constructor;
        }

        /**
         * 继承的实现
         * @param  {[type]} baseClass       [父类]
         * @param  {[type]} constructor     [构造函数]
         * @param  {[type]} instanceMembers [构造函数原型链上的属性(实例成员)]
         * @param  {[type]} staticMembers   [构造函数上的属性(静态成员)]
         * @return {[type]}                 [返回该构造函数]
         */
        function derive(baseClass, constructor, instanceMembers, staticMembers) {
            if (baseClass) {
                constructor = constructor || function() {};
                var basePrototype = baseClass.prototype;

                //用object.create实现继承
                constructor.prototype = Object.create(basePrototype);

                //重新指定contructor
                Object.defineProperty(constructor.prototype, "constructor", {
                    value: constructor,
                    writable: true,
                    configurable: true,
                    enumerable: true
                });

                //通过super访问父类原型
                Object.defineProperty(constructor.prototype, "super", {
                    value: basePrototype,
                    writable: false, //不可写
                    configurable: true,
                    enumerable: true
                });

                if (instanceMembers) {
                    initializeProperties(constructor.prototype, instanceMembers);
                }
                if (staticMembers) {
                    initializeProperties(constructor, staticMembers);
                }
                return constructor;

            } else {
                return define(constructor, instanceMembers, staticMembers);
            }
        }

        function mix(constructor) {
            constructor = constructor || function() {};
            var i, len;
            for (i = 1, len = arguments.length; i < len; i++) {
                initializeProperties(constructor.prototype, arguments[i]);
            }
            return constructor;
        }

        // Establish members of "WinJS.Class" namespace
        root.Namespace.define("Class", {
            define: define,
            derive: derive,
            mix: mix
        });

    })();

    // return {
    //     Namespace: root.Namespace,
    //     Class: root.Class
    // };

    return root;
})();
