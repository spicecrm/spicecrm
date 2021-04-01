/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/** 
 * © 2015 - 2021 aac services k.s. All rights reserved.
 * release: 2021.01.001
 * date: 2021-03-18 21:30:15
 * build: 2021.01.001.1616099416007
 **/
"use strict";var __decorate=this&&this.__decorate||function(e,t,s,a){var n,i=arguments.length,o=i<3?t:null===a?a=Object.getOwnPropertyDescriptor(t,s):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,s,a);else for(var r=e.length-1;0<=r;r--)(n=e[r])&&(o=(i<3?n(o):3<i?n(t,s,o):n(t,s))||o);return 3<i&&o&&Object.defineProperty(t,s,o),o},__metadata=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};Object.defineProperty(exports,"__esModule",{value:!0}),exports.ModuleSystemTenants=exports.SystemTenantHeaderBar=exports.SystemTenantHeaderBarSummary=exports.SystemTenantHeaderBarValidity=exports.SystemTenantLoadDemoDataButton=exports.SystemTenantActivateModal=exports.SystemTenantActivateButton=void 0;var common_1=require("@angular/common"),core_1=require("@angular/core"),forms_1=require("@angular/forms"),objectfields_1=require("../../objectfields/objectfields"),globalcomponents_1=require("../../globalcomponents/globalcomponents"),objectcomponents_1=require("../../objectcomponents/objectcomponents"),systemcomponents_1=require("../../systemcomponents/systemcomponents"),directives_1=require("../../directives/directives"),services_1=require("../../services/services"),SystemTenantActivateButton=function(){function SystemTenantActivateButton(e,t,s,a){this.model=e,this.modal=t,this.backend=s,this.injector=a}return SystemTenantActivateButton.prototype.execute=function(){var t=this.modal.await("Initialize Tenant");this.backend.postRequest("module/SystemTenants/"+this.model.id+"/initialize").subscribe(function(e){t.emit(!0)})},__decorate([core_1.Component({template:'<system-label label="LBL_INITIALIZE"></system-label>'}),__metadata("design:paramtypes",[services_1.model,services_1.modal,services_1.backend,core_1.Injector])],SystemTenantActivateButton)}();exports.SystemTenantActivateButton=SystemTenantActivateButton;var SystemTenantActivateModal=function(){function e(e,t,s){this.model=e,this.modal=t,this.backend=s}return e.prototype.close=function(){this.self.destroy()},e.prototype.initialize=function(){var t=this,s=this.modal.await("initializing");this.backend.postRequest("module/SystemTenants/"+this.model.id+"/initialize").subscribe(function(e){s.emit(!0),t.close()})},__decorate([core_1.Component({selector:"systemtenant-activate-modal",template:'<system-modal><system-modal-header (close)="close()"><system-label label="LBL_ACTIVATE"></system-label></system-modal-header><system-modal-content>activate</system-modal-content><system-modal-footer><button class="slds-button slds-button--neutral" (click)="close()"><system-label label="LBL_CANCEL"></system-label></button> <button class="slds-button slds-button--brand" (click)="initialize()"><system-label label="LBL_OK"></system-label></button></system-modal-footer></system-modal>'}),__metadata("design:paramtypes",[services_1.model,services_1.modal,services_1.backend])],e)}();exports.SystemTenantActivateModal=SystemTenantActivateModal;var SystemTenantLoadDemoDataButton=function(){function SystemTenantLoadDemoDataButton(e,t,s){this.model=e,this.modal=t,this.backend=s}return SystemTenantLoadDemoDataButton.prototype.execute=function(){var t=this.modal.await("Loading Demo Data");this.backend.postRequest("module/SystemTenants/"+this.model.id+"/loaddemodata").subscribe(function(e){t.emit(!0)})},__decorate([core_1.Component({template:'<system-label label="LBL_LOAD_DEMODATA"></system-label>'}),__metadata("design:paramtypes",[services_1.model,services_1.modal,services_1.backend])],SystemTenantLoadDemoDataButton)}();exports.SystemTenantLoadDemoDataButton=SystemTenantLoadDemoDataButton;var SystemTenantHeaderBarValidity=function(){function SystemTenantHeaderBarValidity(e){this.configuration=e,this.isTrial=!1,this.hasExpiration=!1}return SystemTenantHeaderBarValidity.prototype.ngOnInit=function(){this.getExpiration(),this.getTrial(),this.hasExpiration&&this.getDaysLeft()},SystemTenantHeaderBarValidity.prototype.getTrial=function(){var e=this.configuration.getData("tenantconfig");this.isTrial="1"==(null==e?void 0:e.is_trial)},SystemTenantHeaderBarValidity.prototype.getExpiration=function(){var e=this.configuration.getData("tenantconfig");this.hasExpiration=!(null==e||!e.valid_until)},SystemTenantHeaderBarValidity.prototype.getDaysLeft=function(){var e=new moment(this.configuration.getData("tenantconfig").valid_until),e=moment.duration(e.diff(new moment));this.daysLeft=Math.round(e.as("days"))},__decorate([core_1.Component({selector:"systemtenant-header-bar-validity",template:'<div *ngIf="hasExpiration" class="slds-grid slds-grid_vertical-align-center"><span *ngIf="isTrial" class="slds-m-horizontal_x-small"><system-label label="LBL_TRIAL_EXPIRES_IN_BEFORE"></system-label></span> <span *ngIf="!isTrial" class="slds-m-horizontal_x-small"><system-label label="LBL_LICENSE_EXPIRES_IN_BEFORE"></system-label></span> <span class="slds-box slds-box_xx-small slds-theme_default">{{daysLeft}}</span> <span class="slds-m-horizontal_x-small"><system-label label="LBL_TRIAL_EXPIRES_IN_AFTER"></system-label></span></div>'}),__metadata("design:paramtypes",[services_1.configurationService])],SystemTenantHeaderBarValidity)}();exports.SystemTenantHeaderBarValidity=SystemTenantHeaderBarValidity;var SystemTenantHeaderBarSummary=function(){function SystemTenantHeaderBarSummary(e,t){this.configuration=e,this.backend=t,this.usage={database:0,elastic:0,uploadfiles:0,users:0},this.limits={database:0,elastic:0,uploadfiles:0,users:0}}return SystemTenantHeaderBarSummary.prototype.ngOnInit=function(){this.getConfig(),this.getStats()},SystemTenantHeaderBarSummary.prototype.getConfig=function(){var e=this.configuration.getData("tenantconfig");this.limits.database=e.limit_database?parseInt(e.limit_database,10):0,this.limits.elastic=e.limit_elastic||0,this.limits.uploadfiles=e.limit_uploads||0,this.limits.users=e.limit_users||0},SystemTenantHeaderBarSummary.prototype.getStats=function(){var t=this;(0<this.limits.database||0<this.limits.elastic||0<this.limits.users||0<this.limits.uploadfiles)&&this.backend.getRequest("admin/systemstats",{summary:!0}).subscribe(function(e){0<t.limits.database&&(t.usage.database=Math.round(e.database.size/1024/1e3/t.limits.database*100))})},__decorate([core_1.Component({selector:"systemtenant-header-bar-summary",template:'<div class="slds-grid slds-grid_vertical-align-center"><span class="slds-m-horizontal_x-small"><system-label label="LBL_SUMMARY"></system-label></span><system-progress-ring [percentage]="usage.database" backgroundcolor="var(--color-grey-9)"></system-progress-ring><system-progress-ring [percentage]="usage.database" backgroundcolor="var(--color-grey-9)" status="warning"></system-progress-ring><system-progress-ring [percentage]="usage.database" backgroundcolor="var(--color-grey-9)" status="expired"></system-progress-ring></div>'}),__metadata("design:paramtypes",[services_1.configurationService,services_1.backend])],SystemTenantHeaderBarSummary)}();exports.SystemTenantHeaderBarSummary=SystemTenantHeaderBarSummary;var SystemTenantHeaderBar=function(){function SystemTenantHeaderBar(e){this.metadata=e}return __decorate([core_1.Component({selector:"systemtenant-header-bar",template:'<div class="slds-trial-header slds-theme--info slds-grid slds-grid--vertical-align-center"><div class="slds-grid"><button class="slds-button slds-m-right_small"><system-label label="LBL_WELCOME_TRIAL"></system-label></button><div class="slds-grid slds-dropdown-trigger slds-dropdown-trigger_click"><button class="slds-button" aria-haspopup="true"><system-button-icon icon="right"></system-button-icon><system-label label="LBL_CHOOSE_YOUR_TOUR"></system-label></button></div></div><div class="slds-col_bump-left"><systemtenant-header-bar-validity></systemtenant-header-bar-validity></div></div>'}),__metadata("design:paramtypes",[services_1.metadata])],SystemTenantHeaderBar)}();exports.SystemTenantHeaderBar=SystemTenantHeaderBar;var ModuleSystemTenants=function(){function ModuleSystemTenants(){}return __decorate([core_1.NgModule({imports:[common_1.CommonModule,forms_1.FormsModule,objectfields_1.ObjectFields,globalcomponents_1.GlobalComponents,objectcomponents_1.ObjectComponents,systemcomponents_1.SystemComponents,directives_1.DirectivesModule],exports:[SystemTenantHeaderBarSummary],declarations:[SystemTenantHeaderBar,SystemTenantHeaderBarValidity,SystemTenantHeaderBarSummary,SystemTenantActivateButton,SystemTenantActivateModal,SystemTenantLoadDemoDataButton]})],ModuleSystemTenants)}();exports.ModuleSystemTenants=ModuleSystemTenants;