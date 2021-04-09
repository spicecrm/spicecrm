"use strict";var __extends=this&&this.__extends||function(){var i=function(t,n){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n}||function(t,n){for(var o in n)n.hasOwnProperty(o)&&(t[o]=n[o])})(t,n)};return function(t,n){function o(){this.constructor=t}i(t,n),t.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}}();Object.defineProperty(exports,"__esModule",{value:!0});var Subscriber_1=require("../Subscriber"),Subject_1=require("../Subject");function windowCount(n,o){return void 0===o&&(o=0),function(t){return t.lift(new WindowCountOperator(n,o))}}exports.windowCount=windowCount;var WindowCountOperator=function(){function t(t,n){this.windowSize=t,this.startWindowEvery=n}return t.prototype.call=function(t,n){return n.subscribe(new WindowCountSubscriber(t,this.windowSize,this.startWindowEvery))},t}(),WindowCountSubscriber=function(e){function t(t,n,o){var i=e.call(this,t)||this;return i.destination=t,i.windowSize=n,i.startWindowEvery=o,i.windows=[new Subject_1.Subject],i.count=0,t.next(i.windows[0]),i}return __extends(t,e),t.prototype._next=function(t){for(var n=0<this.startWindowEvery?this.startWindowEvery:this.windowSize,o=this.destination,i=this.windowSize,e=this.windows,r=e.length,s=0;s<r&&!this.closed;s++)e[s].next(t);var u=this.count-i+1;if(0<=u&&u%n==0&&!this.closed&&e.shift().complete(),++this.count%n==0&&!this.closed){var c=new Subject_1.Subject;e.push(c),o.next(c)}},t.prototype._error=function(t){var n=this.windows;if(n)for(;0<n.length&&!this.closed;)n.shift().error(t);this.destination.error(t)},t.prototype._complete=function(){var t=this.windows;if(t)for(;0<t.length&&!this.closed;)t.shift().complete();this.destination.complete()},t.prototype._unsubscribe=function(){this.count=0,this.windows=null},t}(Subscriber_1.Subscriber);