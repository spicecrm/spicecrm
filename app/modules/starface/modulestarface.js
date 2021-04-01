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
"use strict";var __decorate=this&&this.__decorate||function(e,t,s,i){var n,o=arguments.length,r=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,s,i);else for(var a=e.length-1;0<=a;a--)(n=e[a])&&(r=(o<3?n(r):3<o?n(t,s,r):n(t,s))||r);return 3<o&&r&&Object.defineProperty(t,s,r),r},__metadata=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};Object.defineProperty(exports,"__esModule",{value:!0}),exports.ModuleStarFace=exports.StarfacePreferences=exports.StarfaceToolbarIndicator=void 0;var common_1=require("@angular/common"),core_1=require("@angular/core"),forms_1=require("@angular/forms"),services_1=require("../../services/services"),objectfields_1=require("../../objectfields/objectfields"),globalcomponents_1=require("../../globalcomponents/globalcomponents"),objectcomponents_1=require("../../objectcomponents/objectcomponents"),systemcomponents_1=require("../../systemcomponents/systemcomponents"),directives_1=require("../../directives/directives"),rxjs_1=require("rxjs"),StarfaceToolbarIndicator=function(){function StarfaceToolbarIndicator(e,t,s,i,n,o,r,a){this.language=e,this.configuration=t,this.modal=s,this.modelutilities=i,this.backend=n,this.toast=o,this.session=r,this.telephony=a,this.starfacestatus="initial",this.socketconnected=!1,this.subscriptions=new rxjs_1.Subscription,this.starfacesubscription=!1,this._enabled=!0,this.initialize()}return StarfaceToolbarIndicator.prototype.ngOnDestroy=function(){"connected"==this.starfacestatus&&this.socket.disconnect(),this.subscriptions.unsubscribe(),this.keepAlive&&clearInterval(this.keepAlive),this.disconnectSocket(),this.telephony.isActive=!1},Object.defineProperty(StarfaceToolbarIndicator.prototype,"iconClass",{get:function(){switch(this.starfacestatus){case"connecting":return"slds-icon-text-warning";case"connected":return"slds-icon-text-success";case"disconnected":return"slds-icon-text-error";default:return"slds-icon-text-light"}},enumerable:!1,configurable:!0}),StarfaceToolbarIndicator.prototype.toggleconnection=function(){this.enabled=!this.enabled},Object.defineProperty(StarfaceToolbarIndicator.prototype,"enabled",{get:function(){return this._enabled},set:function(e){this._enabled=e,this.enabled?this.login():this.disconnect()},enumerable:!1,configurable:!0}),StarfaceToolbarIndicator.prototype.initialize=function(){var t=this,e=this.configuration.getCapabilityConfig("socket");this.socketurl=e.socket_frontend,this.socketid=e.socket_id,this.getPreferences().subscribe(function(e){t.login()})},StarfaceToolbarIndicator.prototype.getPreferences=function(){var t=this,s=new rxjs_1.Subject;return this.backend.getRequest("StarFaceVOIP/preferences").subscribe(function(e){e.username&&(t.username=e.username,s.next(t.username)),s.complete()}),s.asObservable()},StarfaceToolbarIndicator.prototype.setPreferences=function(){var t=this;this.modal.openModal("StarfacePreferences").subscribe(function(e){e.instance.saved$.subscribe(function(e){t.getPreferences().subscribe(function(e){t.login()})})})},StarfaceToolbarIndicator.prototype.login=function(){var t=this;this.subscriptions.unsubscribe(),this.subscriptions=new rxjs_1.Subscription,this.starfacestatus="connecting",this.backend.postRequest("StarFaceVOIP/login").subscribe(function(e){e.login&&(t.starfacestatus="connected",t.telephony.isActive=!0,t.subscriptions.add(t.telephony.initiateCall$.subscribe(function(e){t.initiateCall(e.msisdn,e.relatedmodule,e.relatedid,e.relateddata)})),t.subscriptions.add(t.telephony.terminateCall$.subscribe(function(e){t.terminateCall(e)})),t.keepAlive=setInterval(function(){t.keepalive()},45e3),t.starfacesubscription=e.subscription,t.starfacesubscription&&t.connectSocket())})},StarfaceToolbarIndicator.prototype.disconnect=function(){this.starfacestatus="disconnected",this.starfacesubscription=!1,this.keepAlive&&(clearInterval(this.keepAlive),this.keepAlive=void 0),this.disconnectSocket(),this.telephony.isActive=!1,this.subscriptions.unsubscribe()},StarfaceToolbarIndicator.prototype.keepalive=function(){var t=this;this.backend.postRequest("StarFaceVOIP/keepalive").subscribe(function(e){"success"!=e.status&&(t.starfacestatus="disconnected",clearInterval(t.keepAlive),t.login())},function(e){t.disconnect(),t.login()})},StarfaceToolbarIndicator.prototype.connectSocket=function(){var t=this;if(!this.socketurl)return!1;this.socket=io(this.socketurl+"?sysid="+this.socketid+"&room=starface"+this.username+"&token="+this.session.authData.sessionId),this.socket.on("connect",function(e){t.socketconnected=!0}),this.socket.on("disconnect",function(){t.socketconnected=!1}),this.socket.on("message",function(e){t.handleCallEvent(e.message)})},StarfaceToolbarIndicator.prototype.disconnectSocket=function(){this.socket&&(this.socket.destroy(),this.socket=void 0,this.socketconnected=!1)},StarfaceToolbarIndicator.prototype.handleCallEvent=function(t){var e=this.telephony.calls.find(function(e){return e.callid==t.id});e?(e.status=this.translateStatus(t.state),"CONNECTED"!=t.state||e.start||(e.start=moment()),"HANGUP"!=t.state||e.end||(e.end=moment())):this.addCall(t)},StarfaceToolbarIndicator.prototype.addCall=function(e){this.telephony.calls.push({id:this.modelutilities.generateGuid(),callid:e.id,status:this.translateStatus(e.state),msisdn:"inbound"==e.direction?e.callernumber:e.callednumber,direction:e.direction})},StarfaceToolbarIndicator.prototype.translateStatus=function(e){switch(e){case"PROCEEDING":return"initial";case"RINGBACK":case"INCOMING":return"connecting";case"RINGING":return"ringing";case"CONNECTED":return"connected";case"HANGUP":return"disconnected"}},StarfaceToolbarIndicator.prototype.initiateCall=function(e,t,s,i){var n=this,o=this.modelutilities.generateGuid(),i={id:o,status:"initial",callid:void 0,msisdn:e,direction:"outbound",relatedid:s,relatedmodule:t,relateddata:i};this.telephony.calls.push(i),this.backend.postRequest("StarFaceVOIP/call",{},{msisdn:e}).subscribe(function(e){"success"!=e.status?(n.toast.sendToast("error placing call","error"),n.telephony.removeCallById(o)):n.telephony.calls.find(function(e){return e.id==o}).callid=e.callid})},StarfaceToolbarIndicator.prototype.terminateCall=function(t){t.callid&&this.backend.deleteRequest("StarFaceVOIP/call/"+t.callid).subscribe(function(e){t.status="disconnected"})},__decorate([core_1.Component({template:'<div class="slds-show--medium slds-dropdown-trigger slds-dropdown-trigger_click slds-p-horizontal--xxx-small" system-dropdown-trigger-simple><div class="slds-p-around--xx-small slds-grid"><system-utility-icon icon="call" size="x-small" [addclasses]="iconClass" (dblclick)="toggleconnection()"></system-utility-icon></div><div class="slds-is-absolute slds-dropdown slds-dropdown_right slds-dropdown--small slds-nubbin_top-right" style="right:-10px;top:25px;"><ul class="slds-dropdown__list" role="menu"><li class="slds-dropdown__header slds-has-divider--bottom" role="separator"><span class="slds-text-title_caps slds-grid slds-grid--vertical-align-center slds-grid--align-spread"><system-label label="LBL_USER"></system-label><span>{{username}}</span></span></li><li class="slds-dropdown__item" role="separator"><a href="javascript:void(0);"><system-label label="LBL_CONNECTED"></system-label><system-checkbox [ngModel]="starfacestatus == \'connected\'" [disabled]="true"></system-checkbox></a></li><li class="slds-dropdown__item" role="separator"><a href="javascript:void(0);"><system-label label="LBL_SUBSCRIBED"></system-label><system-checkbox [ngModel]="starfacesubscription" [disabled]="true"></system-checkbox></a></li><li class="slds-dropdown__item" role="separator"><a href="javascript:void(0);"><system-label label="LBL_SOCKET"></system-label><system-checkbox [ngModel]="socketconnected" [disabled]="true"></system-checkbox></a></li><li class="slds-dropdown__item slds-has-divider--top" role="separator" (click)="setPreferences()"><a href="javascript:void(0);"><system-label label="LBL_PREFERENCES"></system-label></a></li></ul></div></div>'}),__metadata("design:paramtypes",[services_1.language,services_1.configurationService,services_1.modal,services_1.modelutilities,services_1.backend,services_1.toast,services_1.session,services_1.telephony])],StarfaceToolbarIndicator)}();exports.StarfaceToolbarIndicator=StarfaceToolbarIndicator;var StarfacePreferences=function(){function StarfacePreferences(e,t,s){this.language=e,this.backend=t,this.toast=s,this.verifying=!1,this.saved$=new core_1.EventEmitter,this.preferences={username:"",userpass:""},this.getPreferences()}return StarfacePreferences.prototype.close=function(){this.verifying||this.self.destroy()},StarfacePreferences.prototype.getPreferences=function(){var t=this;this.backend.getRequest("StarFaceVOIP/preferences").subscribe(function(e){t.preferences.username=e.username})},Object.defineProperty(StarfacePreferences.prototype,"canSet",{get:function(){return this.preferences.username&&this.preferences.userpass},enumerable:!1,configurable:!0}),StarfacePreferences.prototype.setPreferences=function(){var t=this;this.canSet&&(this.verifying=!0,this.backend.postRequest("StarFaceVOIP/preferences",{},this.preferences).subscribe(function(e){t.verifying=!1,"success"==e.status?(t.saved$.emit(!0),t.close()):t.toast.sendToast(t.language.getLabel("MSG_STARFACE_UNABLE_TO_LOGIN"),"error")},function(e){t.verifying=!1}))},__decorate([core_1.Component({template:'<system-modal><system-modal-header (close)="close()"><system-label label="LBL_PREFERENCES"></system-label></system-modal-header><system-modal-content><div [system-overlay-loading-spinner]="verifying"><div class="slds-form-element"><label class="slds-form-element__label"><abbr class="slds-required" title="required">*</abbr> <system-label label="LBL_USER_NAME"></system-label></label><div class="slds-form-element__control"><input type="text" autocomplete="off" [(ngModel)]="preferences.username" required class="slds-input"></div></div><div class="slds-form-element"><label class="slds-form-element__label"><abbr class="slds-required" title="required">*</abbr> <system-label label="LBL_PASSWORD"></system-label></label><div class="slds-form-element__control"><system-input-password [(ngModel)]="preferences.userpass"></system-input-password></div></div></div></system-modal-content><system-modal-footer><button class="slds-button slds-button--neutral" [disabled]="verifying" (click)="close()"><system-label label="LBL_CANCEL"></system-label></button> <button class="slds-button slds-button--brand" [disabled]="!canSet || verifying" (click)="setPreferences()"><system-label label="LBL_SAVE"></system-label></button></system-modal-footer></system-modal>'}),__metadata("design:paramtypes",[services_1.language,services_1.backend,services_1.toast])],StarfacePreferences)}();exports.StarfacePreferences=StarfacePreferences;var ModuleStarFace=function(){function ModuleStarFace(){}return __decorate([core_1.NgModule({imports:[common_1.CommonModule,forms_1.FormsModule,objectfields_1.ObjectFields,globalcomponents_1.GlobalComponents,objectcomponents_1.ObjectComponents,systemcomponents_1.SystemComponents,directives_1.DirectivesModule],declarations:[StarfaceToolbarIndicator,StarfacePreferences]})],ModuleStarFace)}();exports.ModuleStarFace=ModuleStarFace;