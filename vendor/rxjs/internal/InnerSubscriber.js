"use strict";var __extends=this&&this.__extends||function(){var n=function(t,e){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])})(t,e)};return function(t,e){function r(){this.constructor=t}n(t,e),t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)}}();Object.defineProperty(exports,"__esModule",{value:!0});var Subscriber_1=require("./Subscriber"),InnerSubscriber=function(o){function t(t,e,r){var n=o.call(this)||this;return n.parent=t,n.outerValue=e,n.outerIndex=r,n.index=0,n}return __extends(t,o),t.prototype._next=function(t){this.parent.notifyNext(this.outerValue,t,this.outerIndex,this.index++,this)},t.prototype._error=function(t){this.parent.notifyError(t,this),this.unsubscribe()},t.prototype._complete=function(){this.parent.notifyComplete(this),this.unsubscribe()},t}(Subscriber_1.Subscriber);exports.InnerSubscriber=InnerSubscriber;