"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var config_1=require("./config"),hostReportError_1=require("./util/hostReportError");exports.empty={closed:!0,next:function(r){},error:function(r){if(config_1.config.useDeprecatedSynchronousErrorHandling)throw r;hostReportError_1.hostReportError(r)},complete:function(){}};