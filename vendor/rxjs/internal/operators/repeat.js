"use strict";var __extends=this&&this.__extends||function(){var n=function(t,e){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])})(t,e)};return function(t,e){function r(){this.constructor=t}n(t,e),t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)}}();Object.defineProperty(exports,"__esModule",{value:!0});var Subscriber_1=require("../Subscriber"),empty_1=require("../observable/empty");function repeat(e){return void 0===e&&(e=-1),function(t){return 0===e?empty_1.empty():e<0?t.lift(new RepeatOperator(-1,t)):t.lift(new RepeatOperator(e-1,t))}}exports.repeat=repeat;var RepeatOperator=function(){function t(t,e){this.count=t,this.source=e}return t.prototype.call=function(t,e){return e.subscribe(new RepeatSubscriber(t,this.count,this.source))},t}(),RepeatSubscriber=function(o){function t(t,e,r){var n=o.call(this,t)||this;return n.count=e,n.source=r,n}return __extends(t,o),t.prototype.complete=function(){if(!this.isStopped){var t=this.source,e=this.count;if(0===e)return o.prototype.complete.call(this);-1<e&&(this.count=e-1),t.subscribe(this._unsubscribeAndRecycle())}},t}(Subscriber_1.Subscriber);