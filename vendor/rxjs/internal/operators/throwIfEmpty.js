"use strict";var __extends=this&&this.__extends||function(){var o=function(r,t){return(o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(r,t){r.__proto__=t}||function(r,t){for(var e in t)t.hasOwnProperty(e)&&(r[e]=t[e])})(r,t)};return function(r,t){function e(){this.constructor=r}o(r,t),r.prototype=null===t?Object.create(t):(e.prototype=t.prototype,new e)}}();Object.defineProperty(exports,"__esModule",{value:!0});var EmptyError_1=require("../util/EmptyError"),Subscriber_1=require("../Subscriber");function throwIfEmpty(t){return void 0===t&&(t=defaultErrorFactory),function(r){return r.lift(new ThrowIfEmptyOperator(t))}}exports.throwIfEmpty=throwIfEmpty;var ThrowIfEmptyOperator=function(){function r(r){this.errorFactory=r}return r.prototype.call=function(r,t){return t.subscribe(new ThrowIfEmptySubscriber(r,this.errorFactory))},r}(),ThrowIfEmptySubscriber=function(o){function r(r,t){var e=o.call(this,r)||this;return e.errorFactory=t,e.hasValue=!1,e}return __extends(r,o),r.prototype._next=function(r){this.hasValue=!0,this.destination.next(r)},r.prototype._complete=function(){if(this.hasValue)return this.destination.complete();var t=void 0;try{t=this.errorFactory()}catch(r){t=r}this.destination.error(t)},r}(Subscriber_1.Subscriber);function defaultErrorFactory(){return new EmptyError_1.EmptyError}