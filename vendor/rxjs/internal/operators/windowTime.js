"use strict";var __extends=this&&this.__extends||function(){var t=function(e,i){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,i){e.__proto__=i}||function(e,i){for(var n in i)i.hasOwnProperty(n)&&(e[n]=i[n])})(e,i)};return function(e,i){function n(){this.constructor=e}t(e,i),e.prototype=null===i?Object.create(i):(n.prototype=i.prototype,new n)}}();Object.defineProperty(exports,"__esModule",{value:!0});var Subject_1=require("../Subject"),async_1=require("../scheduler/async"),Subscriber_1=require("../Subscriber"),isNumeric_1=require("../util/isNumeric"),isScheduler_1=require("../util/isScheduler");function windowTime(i){var n=async_1.async,t=null,r=Number.POSITIVE_INFINITY;return isScheduler_1.isScheduler(arguments[3])&&(n=arguments[3]),isScheduler_1.isScheduler(arguments[2])?n=arguments[2]:isNumeric_1.isNumeric(arguments[2])&&(r=Number(arguments[2])),isScheduler_1.isScheduler(arguments[1])?n=arguments[1]:isNumeric_1.isNumeric(arguments[1])&&(t=Number(arguments[1])),function(e){return e.lift(new WindowTimeOperator(i,t,r,n))}}exports.windowTime=windowTime;var WindowTimeOperator=function(){function e(e,i,n,t){this.windowTimeSpan=e,this.windowCreationInterval=i,this.maxWindowSize=n,this.scheduler=t}return e.prototype.call=function(e,i){return i.subscribe(new WindowTimeSubscriber(e,this.windowTimeSpan,this.windowCreationInterval,this.maxWindowSize,this.scheduler))},e}(),CountedSubject=function(i){function e(){var e=null!==i&&i.apply(this,arguments)||this;return e._numberOfNextedValues=0,e}return __extends(e,i),e.prototype.next=function(e){this._numberOfNextedValues++,i.prototype.next.call(this,e)},Object.defineProperty(e.prototype,"numberOfNextedValues",{get:function(){return this._numberOfNextedValues},enumerable:!0,configurable:!0}),e}(Subject_1.Subject),WindowTimeSubscriber=function(a){function e(e,i,n,t,r){var o=a.call(this,e)||this;o.destination=e,o.windowTimeSpan=i,o.windowCreationInterval=n,o.maxWindowSize=t,o.scheduler=r,o.windows=[];var s=o.openWindow();if(null!==n&&0<=n){var u={subscriber:o,window:s,context:null},c={windowTimeSpan:i,windowCreationInterval:n,subscriber:o,scheduler:r};o.add(r.schedule(dispatchWindowClose,i,u)),o.add(r.schedule(dispatchWindowCreation,n,c))}else{var d={subscriber:o,window:s,windowTimeSpan:i};o.add(r.schedule(dispatchWindowTimeSpanOnly,i,d))}return o}return __extends(e,a),e.prototype._next=function(e){for(var i=this.windows,n=i.length,t=0;t<n;t++){var r=i[t];r.closed||(r.next(e),r.numberOfNextedValues>=this.maxWindowSize&&this.closeWindow(r))}},e.prototype._error=function(e){for(var i=this.windows;0<i.length;)i.shift().error(e);this.destination.error(e)},e.prototype._complete=function(){for(var e=this.windows;0<e.length;){var i=e.shift();i.closed||i.complete()}this.destination.complete()},e.prototype.openWindow=function(){var e=new CountedSubject;return this.windows.push(e),this.destination.next(e),e},e.prototype.closeWindow=function(e){e.complete();var i=this.windows;i.splice(i.indexOf(e),1)},e}(Subscriber_1.Subscriber);function dispatchWindowTimeSpanOnly(e){var i=e.subscriber,n=e.windowTimeSpan,t=e.window;t&&i.closeWindow(t),e.window=i.openWindow(),this.schedule(e,n)}function dispatchWindowCreation(e){var i=e.windowTimeSpan,n=e.subscriber,t=e.scheduler,r=e.windowCreationInterval,o=n.openWindow(),s={action:this,subscription:null},u={subscriber:n,window:o,context:s};s.subscription=t.schedule(dispatchWindowClose,i,u),this.add(s.subscription),this.schedule(e,r)}function dispatchWindowClose(e){var i=e.subscriber,n=e.window,t=e.context;t&&t.action&&t.subscription&&t.action.remove(t.subscription),i.closeWindow(n)}