"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var Subscriber_1=require("../Subscriber"),rxSubscriber_1=require("../symbol/rxSubscriber"),Observer_1=require("../Observer");function toSubscriber(r,e,b){if(r){if(r instanceof Subscriber_1.Subscriber)return r;if(r[rxSubscriber_1.rxSubscriber])return r[rxSubscriber_1.rxSubscriber]()}return r||e||b?new Subscriber_1.Subscriber(r,e,b):new Subscriber_1.Subscriber(Observer_1.empty)}exports.toSubscriber=toSubscriber;