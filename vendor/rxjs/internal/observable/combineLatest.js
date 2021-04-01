"use strict";var __extends=this&&this.__extends||function(){var o=function(t,e){return(o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])})(t,e)};return function(t,e){function r(){this.constructor=t}o(t,e),t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)}}();Object.defineProperty(exports,"__esModule",{value:!0});var isScheduler_1=require("../util/isScheduler"),isArray_1=require("../util/isArray"),OuterSubscriber_1=require("../OuterSubscriber"),subscribeToResult_1=require("../util/subscribeToResult"),fromArray_1=require("./fromArray"),NONE={};function combineLatest(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];var r=void 0,o=void 0;return isScheduler_1.isScheduler(t[t.length-1])&&(o=t.pop()),"function"==typeof t[t.length-1]&&(r=t.pop()),1===t.length&&isArray_1.isArray(t[0])&&(t=t[0]),fromArray_1.fromArray(t,o).lift(new CombineLatestOperator(r))}exports.combineLatest=combineLatest;var CombineLatestOperator=function(){function t(t){this.resultSelector=t}return t.prototype.call=function(t,e){return e.subscribe(new CombineLatestSubscriber(t,this.resultSelector))},t}();exports.CombineLatestOperator=CombineLatestOperator;var CombineLatestSubscriber=function(o){function t(t,e){var r=o.call(this,t)||this;return r.resultSelector=e,r.active=0,r.values=[],r.observables=[],r}return __extends(t,o),t.prototype._next=function(t){this.values.push(NONE),this.observables.push(t)},t.prototype._complete=function(){var t=this.observables,e=t.length;if(0===e)this.destination.complete();else{this.active=e,this.toRespond=e;for(var r=0;r<e;r++){var o=t[r];this.add(subscribeToResult_1.subscribeToResult(this,o,void 0,r))}}},t.prototype.notifyComplete=function(t){0==(this.active-=1)&&this.destination.complete()},t.prototype.notifyNext=function(t,e,r){var o=this.values,i=o[r],s=this.toRespond?i===NONE?--this.toRespond:this.toRespond:0;o[r]=e,0===s&&(this.resultSelector?this._tryResultSelector(o):this.destination.next(o.slice()))},t.prototype._tryResultSelector=function(t){var e;try{e=this.resultSelector.apply(this,t)}catch(t){return void this.destination.error(t)}this.destination.next(e)},t}(OuterSubscriber_1.OuterSubscriber);exports.CombineLatestSubscriber=CombineLatestSubscriber;