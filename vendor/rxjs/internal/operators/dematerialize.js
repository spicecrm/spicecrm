"use strict";var __extends=this&&this.__extends||function(){var n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)};return function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}}();Object.defineProperty(exports,"__esModule",{value:!0});var Subscriber_1=require("../Subscriber");function dematerialize(){return function(e){return e.lift(new DeMaterializeOperator)}}exports.dematerialize=dematerialize;var DeMaterializeOperator=function(){function e(){}return e.prototype.call=function(e,t){return t.subscribe(new DeMaterializeSubscriber(e))},e}(),DeMaterializeSubscriber=function(t){function e(e){return t.call(this,e)||this}return __extends(e,t),e.prototype._next=function(e){e.observe(this.destination)},e}(Subscriber_1.Subscriber);