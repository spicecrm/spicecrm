"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var distinctUntilChanged_1=require("./distinctUntilChanged");function distinctUntilKeyChanged(i,e){return distinctUntilChanged_1.distinctUntilChanged(function(t,n){return e?e(t[i],n[i]):t[i]===n[i]})}exports.distinctUntilKeyChanged=distinctUntilKeyChanged;