"use strict";var __extends=this&&this.__extends||function(){var r=function(e,t){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])})(e,t)};return function(e,t){function n(){this.constructor=e}r(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)}}();Object.defineProperty(exports,"__esModule",{value:!0});var innerSubscribe_1=require("../innerSubscribe");function sample(t){return function(e){return e.lift(new SampleOperator(t))}}exports.sample=sample;var SampleOperator=function(){function e(e){this.notifier=e}return e.prototype.call=function(e,t){var n=new SampleSubscriber(e),r=t.subscribe(n);return r.add(innerSubscribe_1.innerSubscribe(this.notifier,new innerSubscribe_1.SimpleInnerSubscriber(n))),r},e}(),SampleSubscriber=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.hasValue=!1,e}return __extends(e,t),e.prototype._next=function(e){this.value=e,this.hasValue=!0},e.prototype.notifyNext=function(){this.emitValue()},e.prototype.notifyComplete=function(){this.emitValue()},e.prototype.emitValue=function(){this.hasValue&&(this.hasValue=!1,this.destination.next(this.value))},e}(innerSubscribe_1.SimpleOuterSubscriber);