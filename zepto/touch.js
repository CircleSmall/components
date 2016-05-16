/**
 * touch.js , 依赖于zepto.js , event.js
 * zepto自带的touch.js 满足不了需求。（因为他只对document进行监听，中间要是有组件阻止冒泡就不起作用了）
 * 而且那个touch.js在ios webview中会有问题
 * ps: 这个插件目前只截取了touch.js 的部分事件, 而且没有清除的事件
 */

//el 是要事件代理要挂在的位置，target是要处理的目标元素
function touch(el, target) {
    this.el = $(el);
    this.target = target;
    this.touch = {};
    this.status = ""; //status 有三种状态："touchstart"、"touchmove"、"touchend"
    this.init();
}

touch.prototype.init = function(e) {
    var $el = this.el,
        touch = this.touch,
        that = this;
    var now, delta, deltaX = 0,
        deltaY = 0,
        firstTouch;
    $el.on('touchstart', function(e) {
        if (that.status == "touchmove") {
            return; //fix bug ，在androdid 的webview里会出现偶尔touchstart->touchmove->touchstart->touchend
        }
        that.status = "touchstart";
        firstTouch = e.touches[0];

        if (e.touches && e.touches.length === 1 && that.touch.x2) {
            // Clear out touch movement data if we have it sticking around
            // This can occur if touchcancel doesn't fire due to preventDefault, etc.
            that.touch.x2 = undefined
            that.touch.y2 = undefined
        }
        now = Date.now()
        delta = now - (touch.last || now);
        touch.el = $('tagName' in firstTouch.target ?
            firstTouch.target : firstTouch.target.parentNode);
        // if (that.target) {
        //     var finalTarget = $(touch.el.find(that.target));
        //     if (finalTarget.length > 0) touch.el = finalTarget;
        // }
        touch.x1 = firstTouch.pageX;
        touch.y1 = firstTouch.pageY;
        touch.last = now;
        touch.el.trigger('swipeStart', {
            e: e,
            deltaX: deltaX,
            deltaY: deltaY,
        });
    }).on('touchmove', function(e) {
        that.status = "touchmove";
        firstTouch = e.touches[0]
        touch.x2 = firstTouch.pageX;
        touch.y2 = firstTouch.pageY;
        //这里以前是累加, 靠,明显逻辑是错的
        //同时，也把绝对值改成了相对值
        deltaX = touch.x2 - touch.x1
        deltaY = touch.y2 - touch.y1
            //把移动的距离绑定到
        touch.el.trigger('swipeMove', {
            e: e,
            deltaX: deltaX,
            deltaY: deltaY,
        });

    }).on('touchend', function(e) {
        that.status = "touchend";
        // alert(touch.x1 +  ":" + touch.x2 + ":" + touch.y1 + ":" + touch.y2 )
        // swipe
        if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 70) ||
            (touch.y2 && Math.abs(touch.y1 - touch.y2) > 70)) {
            // swipeTimeout = setTimeout(function() {
            touch.el.trigger('swipe')
            touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)), {
                e: e,
                deltaX: deltaX,
                deltaY: deltaY,
            })
            touch.el.trigger('swipeEnd', {
                e: e,
                deltaX: deltaX,
                deltaY: deltaY,
            });
            touch = {}
                // }, 0)
        } else if ('last' in touch)
        // don't fire tap when delta position changed by more than 30 pixels,
        // for instance when moving to a point and back to origin
        {
            if (Math.abs(deltaX) < 30 && Math.abs(deltaY) < 30) {
                // delay by one tick so we can cancel the 'tap' event if 'scroll' fires
                // ('tap' fires before 'scroll')
                // tapTimeout = setTimeout(function() {

                // trigger universal 'tap' with the option to cancelTouch()
                // (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
                var event = $.Event('tap')
                touch.el.trigger(event, {
                    e: e,
                    deltaX: deltaX,
                    deltaY: deltaY,
                });

                // trigger double tap immediately
                if (touch.isDoubleTap) {
                    if (touch.el) touch.el.trigger('doubleTap')
                    touch = {}
                }

                // trigger single tap after 250ms of inactivity
                else {
                    touchTimeout = setTimeout(function() {
                        touchTimeout = null
                        if (touch.el) touch.el.trigger('singleTap')
                        touch = {}
                    }, 250)
                }
                // }, 0) //注释掉计时器是为了让他可以冒泡
            } else {
                touch = {}
            }
        }
        deltaX = deltaY = 0;
    });

    ['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown',
        'doubleTap', 'tap', 'singleTap', 'longTap'
    ].forEach(function(eventName) {
        $el[eventName] = function(callback) {
            return this.on(eventName, callback)
        }
    })
}

function swipeDirection(x1, x2, y1, y2) {
    return Math.abs(x1 - x2) >=
        Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
}
module.exports = touch;
