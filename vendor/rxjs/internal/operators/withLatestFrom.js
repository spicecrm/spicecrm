"use strict";var __extends=this&&this.__extends||function(){var o=function(t,e){return(o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])})(t,e)};return function(t,e){function r(){this.constructor=t}o(t,e),t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)}}();Object.defineProperty(exports,"__esModule",{value:!0});var OuterSubscriber_1=require("../OuterSubscriber"),subscribeToResult_1=require("../util/subscribeToResult");function withLatestFrom(){for(var o=[],t=0;t<arguments.length;t++)o[t]=arguments[t];return function(t){var e;"function"==typeof o[o.length-1]&&(e=o.pop());var r=o;return t.lift(new WithLatestFromOperator(r,e))}}exports.withLatestFrom=withLatestFrom;var WithLatestFromOperator=function(){function t(t,e){this.observables=t,this.project=e}return t.prototype.call=function(t,e){return e.subscribe(new WithLatestFromSubscriber(t,this.observables,this.project))},t}(),WithLatestFromSubscriber=function(u){function t(t,e,r){var o=u.call(this,t)||this;o.observables=e,o.project=r,o.toRespond=[];var n=e.length;o.values=new Array(n);for(var i=0;i<n;i++)o.toRespond.push(i);for(i=0;i<n;i++){var s=e[i];o.add(subscribeToResult_1.subscribeToResult(o,s,void 0,i))}return o}return __extends(t,u),t.prototype.notifyNext=function(t,e,r){this.values[r]=e;var o=this.toRespond;if(0<o.length){var n=o.indexOf(r);-1!==n&&o.splice(n,1)}},t.prototype.notifyComplete=function(){},t.prototype._next=function(t){if(0===this.toRespond.length){var e=[t].concat(this.values);this.project?this._tryProject(e):this.destination.next(e)}},t.prototype._tryProject=function(t){var e;try{e=this.project.apply(this,t)}catch(t){return void this.destination.error(t)}this.destination.next(e)},t}(OuterSubscriber_1.OuterSubscriber);