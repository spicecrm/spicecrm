"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var mergeMap_1=require("./mergeMap"),identity_1=require("../util/identity");function mergeAll(e){return void 0===e&&(e=Number.POSITIVE_INFINITY),mergeMap_1.mergeMap(identity_1.identity,e)}exports.mergeAll=mergeAll;