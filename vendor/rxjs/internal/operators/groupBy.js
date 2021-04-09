"use strict";var __extends=this&&this.__extends||function(){var o=function(t,e){return(o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])})(t,e)};return function(t,e){function r(){this.constructor=t}o(t,e),t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)}}();Object.defineProperty(exports,"__esModule",{value:!0});var Subscriber_1=require("../Subscriber"),Subscription_1=require("../Subscription"),Observable_1=require("../Observable"),Subject_1=require("../Subject");function groupBy(e,r,o,n){return function(t){return t.lift(new GroupByOperator(e,r,o,n))}}exports.groupBy=groupBy;var GroupByOperator=function(){function t(t,e,r,o){this.keySelector=t,this.elementSelector=e,this.durationSelector=r,this.subjectSelector=o}return t.prototype.call=function(t,e){return e.subscribe(new GroupBySubscriber(t,this.keySelector,this.elementSelector,this.durationSelector,this.subjectSelector))},t}(),GroupBySubscriber=function(u){function t(t,e,r,o,n){var i=u.call(this,t)||this;return i.keySelector=e,i.elementSelector=r,i.durationSelector=o,i.subjectSelector=n,i.groups=null,i.attemptedToUnsubscribe=!1,i.count=0,i}return __extends(t,u),t.prototype._next=function(t){var e;try{e=this.keySelector(t)}catch(t){return void this.error(t)}this._group(t,e)},t.prototype._group=function(t,e){var r,o=this.groups,n=(o=o||(this.groups=new Map)).get(e);if(this.elementSelector)try{r=this.elementSelector(t)}catch(t){this.error(t)}else r=t;if(!n){n=this.subjectSelector?this.subjectSelector():new Subject_1.Subject,o.set(e,n);var i=new GroupedObservable(e,n,this);if(this.destination.next(i),this.durationSelector){var u=void 0;try{u=this.durationSelector(new GroupedObservable(e,n))}catch(t){return void this.error(t)}this.add(u.subscribe(new GroupDurationSubscriber(e,n,this)))}}n.closed||n.next(r)},t.prototype._error=function(r){var t=this.groups;t&&(t.forEach(function(t,e){t.error(r)}),t.clear()),this.destination.error(r)},t.prototype._complete=function(){var t=this.groups;t&&(t.forEach(function(t,e){t.complete()}),t.clear()),this.destination.complete()},t.prototype.removeGroup=function(t){this.groups.delete(t)},t.prototype.unsubscribe=function(){this.closed||(this.attemptedToUnsubscribe=!0,0===this.count&&u.prototype.unsubscribe.call(this))},t}(Subscriber_1.Subscriber),GroupDurationSubscriber=function(n){function t(t,e,r){var o=n.call(this,e)||this;return o.key=t,o.group=e,o.parent=r,o}return __extends(t,n),t.prototype._next=function(t){this.complete()},t.prototype._unsubscribe=function(){var t=this.parent,e=this.key;this.key=this.parent=null,t&&t.removeGroup(e)},t}(Subscriber_1.Subscriber),GroupedObservable=function(n){function t(t,e,r){var o=n.call(this)||this;return o.key=t,o.groupSubject=e,o.refCountSubscription=r,o}return __extends(t,n),t.prototype._subscribe=function(t){var e=new Subscription_1.Subscription,r=this.refCountSubscription,o=this.groupSubject;return r&&!r.closed&&e.add(new InnerRefCountSubscription(r)),e.add(o.subscribe(t)),e},t}(Observable_1.Observable);exports.GroupedObservable=GroupedObservable;var InnerRefCountSubscription=function(r){function t(t){var e=r.call(this)||this;return(e.parent=t).count++,e}return __extends(t,r),t.prototype.unsubscribe=function(){var t=this.parent;t.closed||this.closed||(r.prototype.unsubscribe.call(this),t.count-=1,0===t.count&&t.attemptedToUnsubscribe&&t.unsubscribe())},t}(Subscription_1.Subscription);