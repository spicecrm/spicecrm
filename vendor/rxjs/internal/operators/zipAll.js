"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var zip_1=require("../observable/zip");function zipAll(r){return function(e){return e.lift(new zip_1.ZipOperator(r))}}exports.zipAll=zipAll;