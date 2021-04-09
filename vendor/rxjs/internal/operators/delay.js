"use strict";var __extends=this&&this.__extends||function(){var r=function(e,t){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var i in t)t.hasOwnProperty(i)&&(e[i]=t[i])})(e,t)};return function(e,t){function i(){this.constructor=e}r(e,t),e.prototype=null===t?Object.create(t):(i.prototype=t.prototype,new i)}}();Object.defineProperty(exports,"__esModule",{value:!0});var async_1=require("../scheduler/async"),isDate_1=require("../util/isDate"),Subscriber_1=require("../Subscriber"),Notification_1=require("../Notification");function delay(e,t){void 0===t&&(t=async_1.async);var i=isDate_1.isDate(e)?+e-t.now():Math.abs(e);return function(e){return e.lift(new DelayOperator(i,t))}}exports.delay=delay;var DelayOperator=function(){function e(e,t){this.delay=e,this.scheduler=t}return e.prototype.call=function(e,t){return t.subscribe(new DelaySubscriber(e,this.delay,this.scheduler))},e}(),DelaySubscriber=function(n){function t(e,t,i){var r=n.call(this,e)||this;return r.delay=t,r.scheduler=i,r.queue=[],r.active=!1,r.errored=!1,r}return __extends(t,n),t.dispatch=function(e){for(var t=e.source,i=t.queue,r=e.scheduler,n=e.destination;0<i.length&&i[0].time-r.now()<=0;)i.shift().notification.observe(n);if(0<i.length){var o=Math.max(0,i[0].time-r.now());this.schedule(e,o)}else this.unsubscribe(),t.active=!1},t.prototype._schedule=function(e){this.active=!0,this.destination.add(e.schedule(t.dispatch,this.delay,{source:this,destination:this.destination,scheduler:e}))},t.prototype.scheduleNotification=function(e){if(!0!==this.errored){var t=this.scheduler,i=new DelayMessage(t.now()+this.delay,e);this.queue.push(i),!1===this.active&&this._schedule(t)}},t.prototype._next=function(e){this.scheduleNotification(Notification_1.Notification.createNext(e))},t.prototype._error=function(e){this.errored=!0,this.queue=[],this.destination.error(e),this.unsubscribe()},t.prototype._complete=function(){this.scheduleNotification(Notification_1.Notification.createComplete()),this.unsubscribe()},t}(Subscriber_1.Subscriber),DelayMessage=function(e,t){this.time=e,this.notification=t};