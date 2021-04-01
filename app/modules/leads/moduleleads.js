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
"use strict";var __extends=this&&this.__extends||function(){var o=function(e,t){return(o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var s in t)Object.prototype.hasOwnProperty.call(t,s)&&(e[s]=t[s])})(e,t)};return function(e,t){function s(){this.constructor=e}o(e,t),e.prototype=null===t?Object.create(t):(s.prototype=t.prototype,new s)}}(),__decorate=this&&this.__decorate||function(e,t,s,o){var i,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,s):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,s,o);else for(var l=e.length-1;0<=l;l--)(i=e[l])&&(n=(a<3?i(n):3<a?i(t,s,n):i(t,s))||n);return 3<a&&n&&Object.defineProperty(t,s,n),n},__metadata=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},__param=this&&this.__param||function(s,o){return function(e,t){o(e,t,s)}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.ModuleLeads=exports.fieldLeadClassification=exports.LeadConvertConsumerModal=exports.LeadSelectTypeModal=exports.LeadNewButton=exports.LeadConvertOpportunityModal=exports.LeadOpenLeadsDashlet=exports.LeadConvertOpportunity=exports.LeadConvertAccount=exports.LeadConvertItemDuplicate=exports.LeadConvertContact=exports.LeadConvert=exports.LeadConvertModal=exports.LeadConvertButton=void 0;var common_1=require("@angular/common"),core_1=require("@angular/core"),forms_1=require("@angular/forms"),objectfields_1=require("../../objectfields/objectfields"),globalcomponents_1=require("../../globalcomponents/globalcomponents"),objectcomponents_1=require("../../objectcomponents/objectcomponents"),systemcomponents_1=require("../../systemcomponents/systemcomponents"),directives_1=require("../../directives/directives"),router_1=require("@angular/router"),services_1=require("../../services/services"),LeadConvertButton=function(){function LeadConvertButton(e,t,s,o,i,a,n){this.injector=e,this.language=t,this.model=s,this.router=o,this.toast=i,this.modal=a,this.navigationtab=n}return LeadConvertButton.prototype.execute=function(){var e,t;"Converted"===this.model.data.status?this.toast.sendToast("Lead already Converted","warning"):this.model.getFieldValue("account_id")?this.modal.openModal("LeadConvertOpportunityModal",!0,this.injector):"b2c"==this.model.getField("lead_type")?this.modal.openModal("LeadConvertConsumerModal",!0,this.injector):(t="",null!==(e=this.navigationtab)&&void 0!==e&&e.tabid&&(t="/tab/"+this.navigationtab.tabid),this.router.navigate([t+"/module/Leads/"+this.model.id+"/convert"]))},Object.defineProperty(LeadConvertButton.prototype,"disabled",{get:function(){return"Converted"===this.model.getFieldValue("status")||!this.model.checkAccess("edit")},enumerable:!1,configurable:!0}),__decorate([core_1.Component({selector:"lead-convert-button",template:'<span><system-label label="LBL_CONVERT_LEAD"></system-label></span>'}),__param(6,core_1.Optional()),__metadata("design:paramtypes",[core_1.Injector,services_1.language,services_1.model,router_1.Router,services_1.toast,services_1.modal,services_1.navigationtab])],LeadConvertButton)}();exports.LeadConvertButton=LeadConvertButton;var LeadConvertModal=function(){function LeadConvertModal(e){this.language=e,this.saveactions=[],this.completed=new core_1.EventEmitter}return LeadConvertModal.prototype.ngOnInit=function(){this.processConvertActions()},LeadConvertModal.prototype.getStatusIcon=function(e){switch(e){case"initial":return"clock";case"completed":return"check"}},LeadConvertModal.prototype.processConvertActions=function(){var t="";this.saveactions.some(function(e){if("initial"===e.status)return t=e,!0}),t?this.processConvertAction(t):(this.completed.emit(!0),this.self.destroy())},LeadConvertModal.prototype.processConvertAction=function(t){var s=this;t.model.save().subscribe(function(e){t.model.data=t.model.utils.backendModel2spice(t.model.module,e),s.completeConvertAction(t.action)})},LeadConvertModal.prototype.completeConvertAction=function(t){this.saveactions.find(function(e){return e.action===t}).status="completed",this.processConvertActions()},__decorate([core_1.Input(),__metadata("design:type",Array)],LeadConvertModal.prototype,"saveactions",void 0),__decorate([core_1.Output(),__metadata("design:type",core_1.EventEmitter)],LeadConvertModal.prototype,"completed",void 0),__decorate([core_1.Component({selector:"lead-convert-modal",template:'<system-modal><system-modal-header><system-label label="LBL_CONVERT_LEAD"></system-label></system-modal-header><system-modal-content><div class="slds-grid slds-grid--align-spread slds-p-vertical--small slds-has-divider--bottom" *ngFor="let saveaction of saveactions"><div class="slds-truncate"><system-label [label]="saveaction.label"></system-label></div><div><system-utility-icon [icon]="getStatusIcon(saveaction.status)" size="x-small"></system-utility-icon></div></div></system-modal-content></system-modal>'}),__metadata("design:paramtypes",[services_1.language])],LeadConvertModal)}();exports.LeadConvertModal=LeadConvertModal;var LeadConvert=function(){function LeadConvert(e,t,s,o,i,a){this.language=e,this.metadata=t,this.model=s,this.navigationtab=o,this.modal=i,this.toast=a,this.moduleName="Leads",this.contact=void 0,this.account=void 0,this.opportunity=void 0,this.currentConvertStep=0,this.convertSteps=["Account","Contact","Opportunity"],this.loadLead()}return LeadConvert.prototype.loadLead=function(){var t=this;this.model.module=this.moduleName,this.model.id=this.navigationtab.activeRoute.params.id,this.model.getData(!0,"detailview").subscribe(function(e){t.model.startEdit(),t.navigationtab.setTabInfo({displayname:t.language.getLabel("LBL_CONVERT_LEAD")+": "+t.model.data.summary_text,displaymodule:"Leads"})})},LeadConvert.prototype.getStepClass=function(e){e=this.convertSteps.indexOf(e);return e==this.currentConvertStep?"slds-is-active":e<this.currentConvertStep?"slds-is-completed":void 0},LeadConvert.prototype.getStepComplete=function(e){return this.convertSteps.indexOf(e)<this.currentConvertStep},LeadConvert.prototype.getProgressBarWidth=function(){return{width:this.currentConvertStep/(this.convertSteps.length-1)*100+"%"}},LeadConvert.prototype.nextStep=function(){switch(this.currentConvertStep){case 0:this.account&&this.account.isNew&&this.account.validate(),this.currentConvertStep++;break;case 1:this.contact.isNew&&this.contact.validate(),this.currentConvertStep++;break;case 2:this.opportunity&&this.opportunity.isNew&&this.opportunity.validate(),this.convert()}},LeadConvert.prototype.prevStep=function(){0<this.currentConvertStep&&this.currentConvertStep--},LeadConvert.prototype.showNext=function(){return this.currentConvertStep<this.convertSteps.length-1},LeadConvert.prototype.showSave=function(){return this.currentConvertStep==this.convertSteps.length-1},LeadConvert.prototype.convert=function(){var e,t=this,s=[];null!==(e=this.account)&&void 0!==e&&e.isNew&&s.push({action:"createAccount",label:"LBL_LEADCONVERT_CREATEACCOUNT",status:"initial",model:this.account}),null!==(e=this.contact)&&void 0!==e&&e.isNew&&s.push({action:"createContact",label:"LBL_LEADCONVERT_CREATECONTACT",status:"initial",model:this.contact}),null!==(e=this.opportunity)&&void 0!==e&&e.isNew&&s.push({action:"createOpportunity",label:"LBL_LEADCONVERT_CREATEOPPORTUNITY",status:"initial",model:this.opportunity}),this.model.setField("status","Converted"),s.push({action:"convertLead",label:"LBL_LEADCONVERT_CONVERTLEAD",status:"initial",model:this.model}),this.modal.openModal("LeadConvertModal",!1).subscribe(function(e){e.instance.saveactions=s,e.instance.completed.subscribe(function(e){t.toast.sendToast(t.language.getLabel("LBL_LEAD")+" "+t.model.data.summary_text+" "+t.language.getLabel("LBL_CONVERTED"),"success","",30),t.navigationtab.closeTab()})})},LeadConvert.prototype.setContact=function(e){this.contact=e},LeadConvert.prototype.setAccount=function(e){this.account=e},LeadConvert.prototype.setOpportunity=function(e){this.opportunity=e},__decorate([core_1.Component({selector:"lead-convert",template:'<div class="slds-page-header"><div class="slds-grid"><div class="slds-col slds-has-flexi-truncate"><div class="slds-media slds-no-space slds-grow"><system-icon [module]="\'Leads\'"></system-icon><div class="slds-media__body"><nav role="navigation" aria-label="Breadcrumbs"><ol class="slds-breadcrumb slds-list--horizontal"><li class="slds-breadcrumb__item slds-text-title--caps"><a href="javascript:void(0);"><system-label-modulename [module]="model.module" [singular]="true"></system-label-modulename></a></li><li class="slds-breadcrumb__item slds-text-title--caps"><a href="javascript:void(0);"><system-label label="LBL_CONVERT_LEAD"></system-label></a></li></ol></nav><div><h1 class="slds-page-header__title slds-m-right--small slds-align-middle slds-truncate">{{model.data.summary_text}}</h1></div></div></div></div></div></div><div class="slds-grid slds-grid--align-spread slds-p-around--small slds-theme--shade slds-border--bottom"><button class="slds-button slds-button--neutral" [disabled]="model.isLoading || currentConvertStep == 0" (click)="prevStep()"><system-label label="LBL_PREVIOUS"></system-label></button><div class="slds-progress slds-progress--shade"><ol class="slds-progress__list"><li *ngFor="let convertStep of convertSteps" class="slds-progress__item" [ngClass]="getStepClass(convertStep)"><button class="slds-button slds-progress__marker" [ngClass]="{\'slds-button--icon slds-progress__marker--icon\': getStepComplete(convertStep)}"><span class="slds-assistive-text">{{convertStep}}</span><system-button-icon *ngIf="getStepComplete(convertStep)" [icon]="\'success\'"></system-button-icon></button></li></ol><div class="slds-progress-bar slds-progress-bar_x-small"><span class="slds-progress-bar__value" [ngStyle]="getProgressBarWidth()"></span></div></div><button *ngIf="showNext()" class="slds-button slds-button--neutral" [disabled]="model.isLoading" (click)="nextStep()"><system-label label="LBL_NEXT"></system-label></button> <button *ngIf="showSave()" class="slds-button slds-button--brand" (click)="nextStep()"><system-label label="LBL_SAVE"></system-label></button></div><div class="slds-scrollable--y" system-to-bottom [system-overlay-loading-spinner]="model.isLoading"><ng-container *ngIf="!model.isLoading"><lead-convert-account [hidden]="currentConvertStep!==0" (account)="setAccount($event)"></lead-convert-account><lead-convert-contact [hidden]="currentConvertStep!==1" (contact)="setContact($event)"></lead-convert-contact><lead-convert-opportunity [hidden]="currentConvertStep!==2" (opportunity)="setOpportunity($event)"></lead-convert-opportunity></ng-container></div>',providers:[services_1.model,services_1.view]}),__metadata("design:paramtypes",[services_1.language,services_1.metadata,services_1.model,services_1.navigationtab,services_1.modal,services_1.toast])],LeadConvert)}();exports.LeadConvert=LeadConvert;var LeadConvertContact=function(){function LeadConvertContact(e,t,s,o){this.view=e,this.metadata=t,this.lead=s,this.model=o,this.contact=new core_1.EventEmitter,this.selectedContact=void 0,this.componentconfig={},this.componentRefs=[],this.view.isEditable=!0,this.view.setEditMode()}return LeadConvertContact.prototype.ngOnInit=function(){this.initializeFromLead()},LeadConvertContact.prototype.ngAfterViewInit=function(){this.buildContainer()},LeadConvertContact.prototype.initializeFromLead=function(){var t=this;this.model.module="Contacts",this.model.id=null,this.model.isNew=!0,this.model.initialize(this.lead),this.model.initializeField("emailaddresses",[{id:this.model.generateGuid(),bean_id:this.model.id,bean_module:this.model.module,email_address:this.lead.getField("email1"),email_address_id:"",primary_address:"1"}]),this.lead.data$.subscribe(function(e){(t.selectedContact||e.account_id==t.model.getField("account_id"))&&e.account_linked_name==t.model.getField("account_linked_name")||t.model.setFields({account_id:e.account_id,account_name:e.account_linked_name})}),this.model.data$.subscribe(function(e){t.lead.getField("contact_id")!=e.id&&t.lead.setFields({contact_id:e.id})}),this.contact.emit(this.model)},LeadConvertContact.prototype.buildContainer=function(){for(var s=this,e=0,t=this.componentRefs;e<t.length;e++)t[e].destroy();for(var o=this.metadata.getComponentConfig("ObjectRecordDetails",this.model.module),i=this,a=0,n=this.metadata.getComponentSetObjects(o.componentset);a<n.length;a++)!function(t){i.metadata.addComponent(t.component,i.detailcontainer).subscribe(function(e){e.instance.componentconfig=t.componentconfig,s.componentRefs.push(e)})}(n[a])},LeadConvertContact.prototype.selectContact=function(e){this.selectedContact=e,this.model.id=e.id,this.model.isNew=!1,this.model.data=this.model.utils.backendModel2spice("Contacts",e),this.view.isEditable=!1,this.contact.emit(this.model)},LeadConvertContact.prototype.unlinkContact=function(){this.selectedContact=void 0,this.view.isEditable=!0,this.buildContainer(),this.initializeFromLead()},__decorate([core_1.ViewChild("detailcontainer",{read:core_1.ViewContainerRef,static:!0}),__metadata("design:type",core_1.ViewContainerRef)],LeadConvertContact.prototype,"detailcontainer",void 0),__decorate([core_1.Output(),__metadata("design:type",core_1.EventEmitter)],LeadConvertContact.prototype,"contact",void 0),__decorate([core_1.Component({selector:"lead-convert-contact",template:'<div *ngIf="selectedContact" class="slds-theme--shade slds-p-around--small slds-border--bottom slds-grid" [system-view-provider]="{displayLabels: false, editable: false}"><div *ngIf="selectedContact" class="slds-col_bump-left slds-grid slds-grid--vertical-align-center"><div class="slds-m-right--x-small"><system-label label="LBL_CONTACT"></system-label></div><div class="slds-pill"><span class="slds-icon_container slds-icon-standard-account slds-pill__icon_container"><system-icon [module]="model.module"></system-icon></span><a href="javascript:void(0);" class="slds-pill__label"><field-container fielddisplayclass="slds-truncate" fieldname="full_name"></field-container></a> <button class="slds-button slds-button--icon slds-pill__remove" title="Remove"><system-button-icon [icon]="\'clear\'" (click)="unlinkContact()"></system-button-icon></button></div></div></div><div class="slds-grid slds-gutters_direct-x-small slds-p-horizontal--x-small"><div class="slds-col slds-grow"><div #detailcontainer></div></div><div *ngIf="view.isEditable" class="slds-col slds-size--1-of-3 slds-border--left slds-theme--shade" system-to-bottom [system-overlay-loading-spinner]="model.duplicateChecking"><h2 class="slds-text-heading_small slds-p-around--small"><system-label label="LBL_DUPLICATES"></system-label></h2><lead-convert-item-duplicate class="slds-size--1-of-1" *ngFor="let duplicate of model.duplicates" [system-model-provider]="{module:model.module, data:duplicate}" (itemselected)="selectContact($event)"></lead-convert-item-duplicate><div *ngIf="!model.duplicateChecking && model.duplicates.length == 0" class="slds-height_full slds-align--absolute-center"><system-illustration-no-records><system-label label="LBL_NO_DUPLICATES_FOUND"></system-label></system-illustration-no-records></div></div></div>',providers:[services_1.view,services_1.model]}),__param(2,core_1.SkipSelf()),__metadata("design:paramtypes",[services_1.view,services_1.metadata,services_1.model,services_1.model])],LeadConvertContact)}();exports.LeadConvertContact=LeadConvertContact;var LeadConvertItemDuplicate=function(){function e(e,t,s){this.view=e,this.model=t,this.metadata=s,this.itemselected=new core_1.EventEmitter,this.view.isEditable=!1,this.view.displayLabels=!1}return e.prototype.ngOnInit=function(){var e=this.metadata.getComponentConfig("ObjectRelatedDuplicateTile",this.model.module);this.fieldset=e.fieldset},e.prototype.getFields=function(){return this.metadata.getFieldSetFields(this.fieldset)},e.prototype.useaccount=function(){this.itemselected.emit(this.model.data)},__decorate([core_1.Output(),__metadata("design:type",core_1.EventEmitter)],e.prototype,"itemselected",void 0),__decorate([core_1.Component({selector:"lead-convert-item-duplicate",template:'<div class="slds-tile slds-box--border slds-theme--default slds-m-bottom--x-small"><div class="slds-media slds-card__tile slds-p-horizontal--small slds-hint-parent"><system-icon [module]="model.module" [size]="\'small\'"></system-icon><div class="slds-media__body"><div class="slds-grid slds-grid--align-spread slds-has-flexi-truncate"><h3 class="slds-truncate slds-text-heading--small slds-m-bottom--small"><span>{{model.data.summary_text}}</span></h3></div><div class="slds-tile__detail slds-text-body--small"><dl class="slds-dl--horizontal"><ng-container *ngFor="let field of getFields()"><dt class="slds-dl--horizontal__label slds-truncate"><span class="slds-truncate"><system-label-fieldname [module]="model.module" [field]="field.field"></system-label-fieldname></span></dt><dd class="slds-dl--horizontal__detail slds-tile__meta"><field-container [field]="field.field" [fieldconfig]="field.fieldconfig" [fielddisplayclass]="\'slds-truncate\'"></field-container></dd></ng-container></dl></div></div></div><div class="slds-p-around--x-small slds-text-align--right"><button (click)="useaccount()" class="slds-button slds-button--neutral"><system-button-icon icon="check"></system-button-icon><system-label class="slds-p-left--xx-small" label="LBL_USE"></system-label></button></div></div>',providers:[services_1.view]}),__metadata("design:paramtypes",[services_1.view,services_1.model,services_1.metadata])],e)}();exports.LeadConvertItemDuplicate=LeadConvertItemDuplicate;var LeadConvertAccount=function(){function LeadConvertAccount(e,t,s,o,i,a,n){this.view=e,this.metadata=t,this.lead=s,this.model=o,this.modelutilities=i,this.fts=a,this.language=n,this.account=new core_1.EventEmitter,this.componentconfig={},this.componentRefs=[],this.selectedAccount=void 0,this._linktoaccount=!0}return LeadConvertAccount.prototype.ngOnInit=function(){this.initializeFromLead()},LeadConvertAccount.prototype.ngAfterViewInit=function(){this.buildContainer()},LeadConvertAccount.prototype.initializeFromLead=function(){var t=this;this.model.module="Accounts",this.view.isEditable=!0,this.view.setEditMode(),this.lead.getField("account_name")&&(this.model.id=null,this.model.initialize(this.lead),this._linktoaccount=!0),this._linktoaccount&&this.account.emit(this.model),this.model.data$.subscribe(function(e){!t._linktoaccount||t.lead.getField("account_id")==e.id&&t.lead.getField("account_linked_name")==e.name||t.lead.setFields({account_id:t.model.id,account_linked_name:t.model.getField("name")})})},Object.defineProperty(LeadConvertAccount.prototype,"linktoaccount",{get:function(){return this._linktoaccount},set:function(e){0==(this._linktoaccount=e)?(this.account.emit(null),this.lead.setFields({account_id:void 0})):this.account.emit(this.model)},enumerable:!1,configurable:!0}),LeadConvertAccount.prototype.buildContainer=function(){for(var s=this,e=0,t=this.componentRefs;e<t.length;e++)t[e].destroy();for(var o=this.metadata.getComponentConfig("ObjectRecordDetails",this.model.module),i=this,a=0,n=this.metadata.getComponentSetObjects(o.componentset);a<n.length;a++)!function(t){i.metadata.addComponent(t.component,i.detailcontainer).subscribe(function(e){e.instance.componentconfig=t.componentconfig,s.componentRefs.push(e)})}(n[a])},LeadConvertAccount.prototype.selectAccount=function(e){this.selectedAccount=e,this.model.id=e.id,this.model.isNew=!1,this.model.data=this.model.utils.backendModel2spice("Accounts",e),this.lead.setFields({account_id:this.model.id,account_linked_name:this.model.getField("name")}),this.view.isEditable=!1},LeadConvertAccount.prototype.unlinkAccount=function(){this.selectedAccount=void 0,this.buildContainer(),this.initializeFromLead()},__decorate([core_1.ViewChild("detailcontainer",{read:core_1.ViewContainerRef,static:!0}),__metadata("design:type",core_1.ViewContainerRef)],LeadConvertAccount.prototype,"detailcontainer",void 0),__decorate([core_1.Output(),__metadata("design:type",core_1.EventEmitter)],LeadConvertAccount.prototype,"account",void 0),__decorate([core_1.Component({selector:"lead-convert-account",template:'<div><div class="slds-theme--shade slds-p-around--small slds-border--bottom slds-grid slds-grid--vertical-align-center slds-grid--align-spread"><div class="slds-form--inline"><div class="slds-form-element__control"><span class="slds-checkbox"><input type="checkbox" name="options" id="createaccount" [(ngModel)]="linktoaccount"> <label class="slds-checkbox__label" for="createaccount"><span class="slds-checkbox--faux"></span> <span class="slds-form-element__label"><system-label label="LBL_LEADCONVERT_CREATEACCOUNT"></system-label></span></label></span></div></div><div *ngIf="selectedAccount && linktoaccount" class="slds-grid slds-grid--vertical-align-center"><div class="slds-m-right--x-small"><system-label label="LBL_ACCOUNT"></system-label></div><div class="slds-pill"><span class="slds-icon_container slds-icon-standard-account slds-pill__icon_container"><system-icon [module]="model.module"></system-icon></span><a href="javascript:void(0);" class="slds-pill__label">{{selectedAccount.name}}, {{selectedAccount.billing_address_city}}</a> <button class="slds-button slds-button--icon slds-pill__remove" title="Remove"><system-button-icon [icon]="\'clear\'" (click)="unlinkAccount()"></system-button-icon></button></div></div></div><div [hidden]="!linktoaccount" class="slds-grid slds-gutters_direct-x-small slds-p-horizontal--x-small"><div class="slds-col slds-grow"><div #detailcontainer></div></div><div *ngIf="view.isEditable" class="slds-col slds-size--1-of-3 slds-border--left slds-theme--shade" system-to-bottom [system-overlay-loading-spinner]="model.duplicateChecking"><h2 class="slds-text-heading_small slds-p-around--small"><system-label label="LBL_DUPLICATES"></system-label></h2><lead-convert-item-duplicate class="slds-size--1-of-1" *ngFor="let duplicate of model.duplicates" [system-model-provider]="{module:model.module, data:duplicate}" (itemselected)="selectAccount($event)"></lead-convert-item-duplicate><div *ngIf="!model.duplicateChecking && model.duplicates.length == 0" class="slds-height_full slds-align--absolute-center"><system-illustration-no-records><system-label label="LBL_NO_DUPLICATES_FOUND"></system-label></system-illustration-no-records></div></div></div></div>',providers:[services_1.view,services_1.model]}),__param(2,core_1.SkipSelf()),__metadata("design:paramtypes",[services_1.view,services_1.metadata,services_1.model,services_1.model,services_1.modelutilities,services_1.fts,services_1.language])],LeadConvertAccount)}();exports.LeadConvertAccount=LeadConvertAccount;var LeadConvertOpportunity=function(){function LeadConvertOpportunity(e,t,s,o,i){this.view=e,this.metadata=t,this.lead=s,this.model=o,this.language=i,this.opportunity=new core_1.EventEmitter,this.componentconfig={},this.componentRefs=[],this.createOpportunity=!1,this.view.isEditable=!0,this.view.setEditMode()}return Object.defineProperty(LeadConvertOpportunity.prototype,"create",{get:function(){return this.createOpportunity},set:function(e){0==(this.createOpportunity=e)?(this.opportunity.emit(null),this.lead.setFields({opportunity_id:void 0})):this.opportunity.emit(this.model)},enumerable:!1,configurable:!0}),LeadConvertOpportunity.prototype.ngOnInit=function(){this.initializeFromLead()},LeadConvertOpportunity.prototype.ngAfterViewInit=function(){this.buildContainer()},LeadConvertOpportunity.prototype.initializeFromLead=function(){var t=this;this.model.module="Opportunities",this.model.initialize(this.lead),this.lead.data$.subscribe(function(e){e.account_id==t.model.getField("account_id")&&e.account_linked_name==t.model.getField("account_linked_name")||t.model.setFields({account_id:e.account_id,account_name:e.account_linked_name})}),this.model.data$.subscribe(function(e){t.lead.getField("opportunity_id")!=e.id&&t.lead.setFields({opportunity_id:e.id})}),this.createOpportunity&&this.opportunity.emit(this.model)},LeadConvertOpportunity.prototype.buildContainer=function(){for(var s=this,e=0,t=this.componentRefs;e<t.length;e++)t[e].destroy();for(var o=this.metadata.getComponentConfig("ObjectRecordDetails",this.model.module),i=this,a=0,n=this.metadata.getComponentSetObjects(o.componentset);a<n.length;a++)!function(t){i.metadata.addComponent(t.component,i.detailcontainer).subscribe(function(e){e.instance.componentconfig=t.componentconfig,s.componentRefs.push(e)})}(n[a])},__decorate([core_1.ViewChild("detailcontainer",{read:core_1.ViewContainerRef,static:!0}),__metadata("design:type",core_1.ViewContainerRef)],LeadConvertOpportunity.prototype,"detailcontainer",void 0),__decorate([core_1.Output(),__metadata("design:type",core_1.EventEmitter)],LeadConvertOpportunity.prototype,"opportunity",void 0),__decorate([core_1.Component({selector:"lead-convert-opportunity",template:'<div><div class="slds-theme--shade slds-p-around--small slds-border--bottom"><div class="slds-form--inline"><div class="slds-form-element__control"><span class="slds-checkbox"><input type="checkbox" name="options" id="createopportunity" [(ngModel)]="create"> <label class="slds-checkbox__label" for="createopportunity"><span class="slds-checkbox--faux"></span> <span class="slds-form-element__label"><system-label label="LBL_LEADCONVERT_CREATEOPPORTUNITY"></system-label></span></label></span></div></div></div><div [hidden]="!createOpportunity"><div #detailcontainer></div></div></div>',providers:[services_1.view,services_1.model]}),__param(2,core_1.SkipSelf()),__metadata("design:paramtypes",[services_1.view,services_1.metadata,services_1.model,services_1.model,services_1.language])],LeadConvertOpportunity)}();exports.LeadConvertOpportunity=LeadConvertOpportunity;var LeadOpenLeadsDashlet=function(){function LeadOpenLeadsDashlet(e,t,s,o,i){this.language=e,this.metadata=t,this.backend=s,this.model=o,this.elementRef=i,this.myLeads=[],this.myLeadsCount=0}return LeadOpenLeadsDashlet.prototype.ngOnInit=function(){var t=this,e={searchmyitems:!0,fields:JSON.stringify(["id","first_name","last_name","account_name","status","phone_mobile"])};this.backend.getRequest("module/Leads",e).subscribe(function(e){t.myLeads=e.list,t.myLeadsCount=e.totalcount})},Object.defineProperty(LeadOpenLeadsDashlet.prototype,"containerstyle",{get:function(){if(this.dashletcontainer){var e=this.dashletcontainer.element.nativeElement.getBoundingClientRect(),t=this.tableheader.element.nativeElement.getBoundingClientRect();return{height:e.bottom-t.bottom+"px","margin-top":"-1px"}}},enumerable:!1,configurable:!0}),__decorate([core_1.ViewChild("tableheader",{read:core_1.ViewContainerRef,static:!0}),__metadata("design:type",core_1.ViewContainerRef)],LeadOpenLeadsDashlet.prototype,"tableheader",void 0),__decorate([core_1.ViewChild("dashletcontainer",{read:core_1.ViewContainerRef,static:!0}),__metadata("design:type",core_1.ViewContainerRef)],LeadOpenLeadsDashlet.prototype,"dashletcontainer",void 0),__decorate([core_1.Component({selector:"lead-openleads-dashlet",template:'<div #dashletcontainer style="height: 100%; overflow: hidden;"><h2 class="slds-text-heading--small slds-p-bottom--xx-small">My Open Leads ({{myLeadsCount}})</h2><table #tableheader class="slds-table slds-table_cell-buffer"><thead><tr class="slds-text-title_caps"><th scope="col" width="30%"><div class="slds-truncate" title="Opportunity Name">Name</div></th><th scope="col" width="20%"><div class="slds-truncate" title="Account Name">Status</div></th><th scope="col" width="30%"><div class="slds-truncate" title="Close Date">Account</div></th><th scope="col" width="20%"><div class="slds-truncate" title="Stage">Mobile</div></th></tr></thead></table><div class="slds-scrollable--y" [ngStyle]="containerstyle"><table class="slds-table slds-table_bordered slds-table_cell-buffer"><tbody><tr *ngFor="let myLead of myLeads"><td width="30%"><div class="slds-truncate">{{myLead.summary_text}}</div></td><td width="20%"><div class="slds-truncate">{{myLead.status}}</div></td><td width="30%"><div class="slds-truncate">{{myLead.account_name}}</div></td><td width="20%"><div class="slds-truncate">{{myLead.phone_mobile}}</div></td></tr></tbody></table></div></div>',providers:[services_1.model]}),__metadata("design:paramtypes",[services_1.language,services_1.metadata,services_1.backend,services_1.model,core_1.ElementRef])],LeadOpenLeadsDashlet)}();exports.LeadOpenLeadsDashlet=LeadOpenLeadsDashlet;var LeadConvertOpportunityModal=function(){function LeadConvertOpportunityModal(e,t,s,o,i,a){this.language=e,this.lead=t,this.model=s,this.metadata=o,this.view=i,this.modal=a,this.self={},this.converted=new core_1.EventEmitter,this.model.module="Opportunities",this.view.isEditable=!0,this.view.setEditMode()}return LeadConvertOpportunityModal.prototype.ngOnInit=function(){this.model.initialize(this.lead)},LeadConvertOpportunityModal.prototype.ngAfterViewInit=function(){var e=this.metadata.getComponentConfig("ObjectRecordDetails",this.model.module);this.componentSet=e.componentset},LeadConvertOpportunityModal.prototype.close=function(){this.self.destroy()},LeadConvertOpportunityModal.prototype.convert=function(){var s=this;this.model.validate()&&this.modal.openModal("SystemLoadingModal").subscribe(function(t){t.instance.messagelabel="creating Opportunity",s.model.save().subscribe(function(e){t.instance.messagelabel="updating Lead",s.lead.setField("status","Converted"),s.lead.setField("opportunity_id",s.model.id),s.lead.setField("opportunity_name",s.model.getFieldValue("name")),s.lead.save().subscribe(function(e){t.instance.self.destroy(),s.close()})})})},__decorate([core_1.ViewChild("detailcontainer",{read:core_1.ViewContainerRef,static:!0}),__metadata("design:type",core_1.ViewContainerRef)],LeadConvertOpportunityModal.prototype,"detailcontainer",void 0),__decorate([core_1.Output(),__metadata("design:type",core_1.EventEmitter)],LeadConvertOpportunityModal.prototype,"converted",void 0),__decorate([core_1.Component({selector:"lead-convert-opportunity-modal",template:'<system-modal size="large"><system-modal-header (close)="close()"><system-label label="LBL_CONVERT_TO_OPPORTUNITY"></system-label></system-modal-header><system-modal-content margin="none"><system-componentset [componentset]="componentSet"></system-componentset></system-modal-content><system-modal-footer><button class="slds-button slds-button--neutral" (click)="close()"><system-label label="LBL_CLOSE"></system-label></button> <button class="slds-button slds-button--brand" (click)="convert()"><system-label label="LBL_CONVERT_LEAD"></system-label></button></system-modal-footer></system-modal>',providers:[services_1.model,services_1.view]}),__param(1,core_1.SkipSelf()),__metadata("design:paramtypes",[services_1.language,services_1.model,services_1.model,services_1.metadata,services_1.view,services_1.modal])],LeadConvertOpportunityModal)}();exports.LeadConvertOpportunityModal=LeadConvertOpportunityModal;var LeadNewButton=function(){function LeadNewButton(e,t,s,o,i,a,n){this.injector=e,this.language=t,this.metadata=s,this.modal=o,this.model=i,this.parentmodel=a,this.relatedmodel=n,this.displayasicon=!1}return LeadNewButton.prototype.execute=function(){this.model.module="Leads",this.model.id=void 0,"Contacts"==this.parentmodel.module||"Accounts"==this.parentmodel.module?this.model.addModel("",this.parentmodel,{lead_type:"b2b"}):!this.relatedmodel||"Contacts"!=this.relatedmodel.module&&"Accounts"!=this.relatedmodel.module?"Consumer"==this.parentmodel.module?this.model.addModel("",this.parentmodel,{lead_type:"b2c"}):this.relatedmodel&&"Consumers"==this.relatedmodel.module?this.model.addModel("",this.relatedmodel.model,{lead_type:"b2c"}):(this.model.initialize(this.parentmodel),this.modal.openModal("LeadSelectTypeModal",!0,this.injector)):this.model.addModel("",this.relatedmodel.model,{lead_type:"b2b"})},Object.defineProperty(LeadNewButton.prototype,"disabled",{get:function(){return!this.metadata.checkModuleAcl("Leads","create")},enumerable:!1,configurable:!0}),__decorate([core_1.Component({selector:"lead-new-button",template:'<system-button-icon *ngIf="displayasicon" icon="add"></system-button-icon><span *ngIf="!displayasicon"><system-label label="LBL_NEW"></system-label></span>',providers:[services_1.model]}),__param(5,core_1.SkipSelf()),__param(6,core_1.Optional()),__metadata("design:paramtypes",[core_1.Injector,services_1.language,services_1.metadata,services_1.modal,services_1.model,services_1.model,services_1.relatedmodels])],LeadNewButton)}();exports.LeadNewButton=LeadNewButton;var LeadSelectTypeModal=function(){function LeadSelectTypeModal(e,t,s,o,i,a){this.injector=e,this.metadata=t,this.view=s,this.language=o,this.modal=i,this.model=a,this.view.isEditable=!0,this.view.setEditMode(),this.fieldset=this.metadata.getComponentConfig("LeadSelectTypeModal","Leads").fieldset}return Object.defineProperty(LeadSelectTypeModal.prototype,"cancreate",{get:function(){return!!this.model.getField("lead_type")},enumerable:!1,configurable:!0}),LeadSelectTypeModal.prototype.create=function(){this.cancreate&&(this.modal.openModal("ObjectEditModal",!0,this.injector),this.close())},LeadSelectTypeModal.prototype.close=function(){this.self.destroy()},__decorate([core_1.Component({template:'<system-modal><system-modal-header><system-label label="LBL_SELECT_LEAD_TYPE"></system-label></system-modal-header><system-modal-content><object-record-fieldset [fieldset]="fieldset"></object-record-fieldset></system-modal-content><system-modal-footer><button class="slds-button slds-button--neutral" (click)="close()"><system-label label="LBL_CANCEL"></system-label></button> <button class="slds-button slds-button--brand" [disabled]="!cancreate" (click)="create()"><system-label label="LBL_CREATE"></system-label></button></system-modal-footer></system-modal>',providers:[services_1.view]}),__metadata("design:paramtypes",[core_1.Injector,services_1.metadata,services_1.view,services_1.language,services_1.modal,services_1.model])],LeadSelectTypeModal)}();exports.LeadSelectTypeModal=LeadSelectTypeModal;var LeadConvertConsumerModal=function(){function LeadConvertConsumerModal(e,t,s,o,i,a){this.language=e,this.lead=t,this.model=s,this.metadata=o,this.view=i,this.modal=a,this.self={},this.converted=new core_1.EventEmitter,this.model.module="Consumers",this.view.isEditable=!0,this.view.setEditMode()}return LeadConvertConsumerModal.prototype.ngOnInit=function(){this.model.initialize(this.lead)},LeadConvertConsumerModal.prototype.ngAfterViewInit=function(){var e=this.metadata.getComponentConfig("ObjectRecordDetails",this.model.module);this.componentSet=e.componentset},LeadConvertConsumerModal.prototype.close=function(){this.self.destroy()},LeadConvertConsumerModal.prototype.convert=function(){var s=this;this.model.validate()&&this.modal.openModal("SystemLoadingModal").subscribe(function(t){t.instance.messagelabel="creating Consumer",s.model.save().subscribe(function(e){t.instance.messagelabel="updating Lead",s.lead.setField("status","Converted"),s.lead.setField("consumer_id",s.model.id),s.lead.save().subscribe(function(e){s.lead.data=s.lead.utils.backendModel2spice("Leads",e),t.instance.self.destroy(),s.close()})})})},__decorate([core_1.Output(),__metadata("design:type",core_1.EventEmitter)],LeadConvertConsumerModal.prototype,"converted",void 0),__decorate([core_1.Component({selector:"lead-convert-opportunity-modal",template:'<system-modal size="large"><system-modal-header (close)="close()"><system-label label="LBL_CONVERT_TO_CONSUMER"></system-label></system-modal-header><system-modal-content margin="none"><system-componentset [componentset]="componentSet"></system-componentset></system-modal-content><system-modal-footer><button class="slds-button slds-button--neutral" (click)="close()"><system-label label="LBL_CLOSE"></system-label></button> <button class="slds-button slds-button--brand" (click)="convert()"><system-label label="LBL_CONVERT_LEAD"></system-label></button></system-modal-footer></system-modal>',providers:[services_1.model,services_1.view]}),__param(1,core_1.SkipSelf()),__metadata("design:paramtypes",[services_1.language,services_1.model,services_1.model,services_1.metadata,services_1.view,services_1.modal])],LeadConvertConsumerModal)}();exports.LeadConvertConsumerModal=LeadConvertConsumerModal;var fieldLeadClassification=function(n){function fieldLeadClassification(e,t,s,o,i){var a=n.call(this,e,t,s,o,i)||this;return a.model=e,a.view=t,a.language=s,a.metadata=o,a.router=i,a}return __extends(fieldLeadClassification,n),Object.defineProperty(fieldLeadClassification.prototype,"trend",{get:function(){switch(this.model.getField("classification")){case"hot":return"up";case"cold":return"down";default:return"neutral"}},enumerable:!1,configurable:!0}),__decorate([core_1.Component({template:'<system-trend-indicator [trend]="trend"></system-trend-indicator>'}),__metadata("design:paramtypes",[services_1.model,services_1.view,services_1.language,services_1.metadata,router_1.Router])],fieldLeadClassification)}(objectfields_1.fieldGeneric);exports.fieldLeadClassification=fieldLeadClassification;var ModuleLeads=function(){function ModuleLeads(){}return __decorate([core_1.NgModule({imports:[common_1.CommonModule,forms_1.FormsModule,objectfields_1.ObjectFields,globalcomponents_1.GlobalComponents,objectcomponents_1.ObjectComponents,systemcomponents_1.SystemComponents,directives_1.DirectivesModule],declarations:[LeadNewButton,LeadSelectTypeModal,LeadConvertButton,LeadConvertModal,LeadConvert,LeadConvertContact,LeadConvertAccount,LeadConvertItemDuplicate,LeadConvertOpportunity,LeadOpenLeadsDashlet,LeadConvertOpportunityModal,LeadConvertConsumerModal,fieldLeadClassification]})],ModuleLeads)}();exports.ModuleLeads=ModuleLeads;