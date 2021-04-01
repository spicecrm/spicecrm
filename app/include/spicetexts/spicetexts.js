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
"use strict";var __decorate=this&&this.__decorate||function(e,t,s,l){var i,a=arguments.length,n=a<3?t:null===l?l=Object.getOwnPropertyDescriptor(t,s):l;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,s,l);else for(var o=e.length-1;0<=o;o--)(i=e[o])&&(n=(a<3?i(n):3<a?i(t,s,n):i(t,s))||n);return 3<a&&n&&Object.defineProperty(t,s,n),n},__metadata=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};Object.defineProperty(exports,"__esModule",{value:!0}),exports.SpiceTextsModule=exports.SpiceTextsAddModal=exports.SpiceTextsAddButton=exports.SpiceTexts=void 0;var core_1=require("@angular/core"),platform_browser_1=require("@angular/platform-browser"),http_1=require("@angular/common/http"),forms_1=require("@angular/forms"),rxjs_1=require("rxjs"),systemcomponents_1=require("../../systemcomponents/systemcomponents"),globalcomponents_1=require("../../globalcomponents/globalcomponents"),objectcomponents_1=require("../../objectcomponents/objectcomponents"),objectfields_1=require("../../objectfields/objectfields"),directives_1=require("../../directives/directives"),services_1=require("../../services/services"),SpiceTexts=function(){function SpiceTexts(e,t,s,l,i,a){this.model=e,this.language=t,this.backend=s,this.session=l,this.metadata=i,this.relatedModels=a,this.searchTerm="",this.languageFilter="all"}return Object.defineProperty(SpiceTexts.prototype,"moduleTexts",{get:function(){var i=this;return this.relatedModels.items.filter(function(e){var t=e.name.toLowerCase(),s=e.description.toLowerCase(),l=i.searchTerm.toLowerCase(),l=0==i.searchTerm.length||t.includes(l)||s.includes(l),e=i.languageFilter==e.text_language;return l&&("all"==i.languageFilter||e)})},enumerable:!1,configurable:!0}),Object.defineProperty(SpiceTexts.prototype,"sysLanguages",{get:function(){return this.language.getAvialableLanguages()},enumerable:!1,configurable:!0}),SpiceTexts.prototype.ngOnInit=function(){this.loadModuleTexts()},SpiceTexts.prototype.loadModuleTexts=function(){this.relatedModels.id=this.model.id,this.relatedModels.module=this.model.module,this.relatedModels.loaditems=-1,this.relatedModels.relatedModule="SpiceTexts",this.relatedModels.getData()},SpiceTexts.prototype.trackByFn=function(e,t){return t.id},__decorate([core_1.Component({template:'<div class="slds-grid slds-grid--vertical-align-center slds-p-around--x-small"><label for="searchField" class="slds-item_label"><system-label label="LBL_SEARCH"></system-label></label><div class="slds-col slds-form-element slds-m-left--x-small"><div class="slds-form-element__control slds-input-has-icon slds-input-has-icon_right"><system-utility-icon icon="search" addclasses="slds-input__icon slds-input__icon--right"></system-utility-icon><input id="searchField" type="text" class="slds-input" placeholder="search by" [(ngModel)]="searchTerm"></div></div><label for="languageFilter" class="slds-item_label slds-m-left--small slds-m-right--xx-small"><system-label label="LBL_FILTER"></system-label></label><div class="slds-form-element slds-m-right--small"><div class="slds-form-element__control"><div class="slds-select_container"><select id="languageFilter" class="slds-select" [(ngModel)]="languageFilter" [disabled]="sysLanguages?.length == 0"><option value="all"><system-label label="LBL_ALL"></system-label></option><option *ngFor="let sysLanguage of sysLanguages; trackBy: trackByFn" [value]="sysLanguage.language">{{language.getLabel(sysLanguage?.text)}}</option></select></div></div></div><spice-texts-add-button [parent]="model" [spiceTexts]="relatedModels.items"></spice-texts-add-button></div><div *ngIf="relatedModels.isloading" class="slds-align--absolute-center slds-m-top--large"><system-spinner></system-spinner></div><div class="slds-m-vertical--small" *ngFor="let moduleText of moduleTexts; trackBy: trackByFn"><div class="slds-box--border" style="padding: 0 .50rem;" [system-model-provider]="{module: \'SpiceTexts\', id: moduleText.id, data: moduleText}"><object-record-details></object-record-details></div></div><div *ngIf="!relatedModels.isloading && relatedModels.items?.length == 0" class="slds-align--absolute-center slds-m-top--large"><system-label label="MSG_NO_RECORDS_FOUND"></system-label></div>',providers:[services_1.relatedmodels]}),__metadata("design:paramtypes",[services_1.model,services_1.language,services_1.backend,services_1.session,services_1.metadata,services_1.relatedmodels])],SpiceTexts)}();exports.SpiceTexts=SpiceTexts;var SpiceTextsAddButton=function(){function e(e,t,s,l,i,a){this.model=e,this.modal=t,this.configurationService=s,this.language=l,this.metadata=i,this.relatedModels=a,this.spiceTexts=[],this.model.module="SpiceTexts"}return Object.defineProperty(e.prototype,"sysTextIds",{get:function(){var t=this,e=this.configurationService.getData("systextids");return e?_.values(e).filter(function(e){return e.module==t.parent.module}):[]},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"canAdd",{get:function(){return this.metadata.checkModuleAcl("SpiceTexts","create")&&!this.allTranslated},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"allTranslated",{get:function(){return this.relatedModels.isloading||0==this.sysTextIds.length||this.spiceTexts.length>=this.sysTextIds.length*this.language.getAvialableLanguages().length},enumerable:!1,configurable:!0}),e.prototype.addModel=function(){var t=this;this.parent&&!this.allTranslated&&this.modal.openModal("SpiceTextsAddModal",!0).subscribe(function(e){e&&(e.instance.spiceTexts=t.spiceTexts,e.instance.sysTextIds=t.sysTextIds,e.instance.parent=t.parent,e.instance.response.subscribe(function(e){e&&"object"==typeof e&&t.relatedModels.items.push(e)}))})},__decorate([core_1.Input(),__metadata("design:type",Object)],e.prototype,"parent",void 0),__decorate([core_1.Input(),__metadata("design:type",Array)],e.prototype,"spiceTexts",void 0),__decorate([core_1.Component({selector:"spice-texts-add-button",template:'<button class="slds-button slds-button--neutral" title="add item" (click)="addModel()" [disabled]="!canAdd"><system-label label="LBL_ADD"></system-label> <system-label-modulename module="SpiceTexts" [singular]="true"></system-label-modulename></button>',providers:[services_1.model]}),__metadata("design:paramtypes",[services_1.model,services_1.modal,services_1.configurationService,services_1.language,services_1.metadata,services_1.relatedmodels])],e)}();exports.SpiceTextsAddButton=SpiceTextsAddButton;var SpiceTextsAddModal=function(){function SpiceTextsAddModal(e,t,s,l,i){this.model=e,this.configurationService=t,this.view=s,this.backend=l,this.language=i,this.spiceTexts=[],this.sysTextIds=[],this.parent={},this.response=new rxjs_1.Subject,this.self={},this.saveTriggered=!1,this.loading="",this.model.module="SpiceTexts"}return Object.defineProperty(SpiceTextsAddModal.prototype,"textId",{get:function(){return this.model.getField("text_id")},set:function(e){var t=this;this.model.setField("text_id",e),this.model.resetFieldMessages("text_id","error","validation"),this.loading="text_language",window.setTimeout(function(){return t.loading=""},500)},enumerable:!1,configurable:!0}),Object.defineProperty(SpiceTextsAddModal.prototype,"textLanguage",{get:function(){return this.model.getField("text_language")},set:function(e){var t=this;this.model.setField("text_language",e),this.model.resetFieldMessages("text_language","error","validation"),this.loading="text_id",window.setTimeout(function(){return t.loading=""},500)},enumerable:!1,configurable:!0}),Object.defineProperty(SpiceTextsAddModal.prototype,"availableSysLanguages",{get:function(){var a=this;return this.language.getAvialableLanguages().filter(function(t){var e,s=_.groupBy(a.spiceTexts,"text_id"),l=0;for(e in s)s.hasOwnProperty(e)&&(l+=s[e].find(function(e){return e.text_language==t.language})?1:0);var i=a.spiceTexts.find(function(e){return e.text_id==a.textId&&e.text_language==t.language});return l<a.sysTextIds.length&&!i})},enumerable:!1,configurable:!0}),Object.defineProperty(SpiceTextsAddModal.prototype,"availableSysTexts",{get:function(){var l=this;return this.sysTextIds.filter(function(t){var e=l.spiceTexts.filter(function(e){return e.text_id==t.text_id}),s=l.spiceTexts.find(function(e){return e.text_id==t.text_id&&e.text_language==l.textLanguage});return e.length<l.language.getAvialableLanguages().length&&!s})},enumerable:!1,configurable:!0}),Object.defineProperty(SpiceTextsAddModal.prototype,"isDisabledText",{get:function(){return!this.availableSysTexts||0==this.availableSysTexts.length||"text_id"==this.loading},enumerable:!1,configurable:!0}),Object.defineProperty(SpiceTextsAddModal.prototype,"isDisabledLang",{get:function(){return!this.availableSysLanguages||0==this.availableSysLanguages.length||"text_language"==this.loading},enumerable:!1,configurable:!0}),SpiceTextsAddModal.prototype.ngOnInit=function(){this.initializeModel(),this.view.isEditable=!0,this.view.setEditMode()},SpiceTextsAddModal.prototype.getFieldStyle=function(e){return this.model.getFieldMessages(e,"error")?"slds-has-error":""},SpiceTextsAddModal.prototype.initializeModel=function(){this.model.initialize(),this.model.data.parent_id=this.parent.id,this.model.data.parent_type=this.parent.module},SpiceTextsAddModal.prototype.trackByFn=function(e,t){return t.id},SpiceTextsAddModal.prototype.isLoading=function(e){return this.loading==e},SpiceTextsAddModal.prototype.save=function(){var t=this;if(this.saveTriggered=!0,!this.model.validate())return this.saveTriggered=!1;var e=this.model.getField("description").slice(0,100);this.model.setField("name",e),this.model.save(!0).subscribe(function(e){t.response.next(e),t.response.complete(),t.self.destroy()},function(e){t.cancel()}),this.saveTriggered=!1},SpiceTextsAddModal.prototype.cancel=function(){this.response.next(!1),this.response.complete(),this.self.destroy()},__decorate([core_1.Component({template:'<system-modal size="large"><system-modal-header (close)="cancel()"><system-label-modulename module="SpiceTexts" [singular]="true"></system-label-modulename></system-modal-header><system-modal-content><div class="slds-grid"><div class="slds-size--1-of-2 slds-p-right--small"><field-label fieldname="text_id" [fieldconfig]="{required: true}"></field-label><div class="slds-form-element" [ngClass]="getFieldStyle(\'text_id\')"><div class="slds-form-element__control"><div class="slds-select_container"><select id="text_id" class="slds-select" [(ngModel)]="textId" [disabled]="isDisabledText"><option *ngFor="let sysText of availableSysTexts; trackBy: trackByFn" [value]="sysText.text_id"><system-label [label]="sysText.label"></system-label></option></select></div></div><field-messages fieldname="text_id"></field-messages><system-spinner *ngIf="isLoading(\'text_id\')" class="slds-is-absolute" size="15" style="right: 25px; top: 8px"></system-spinner></div></div><div class="slds-size--1-of-2"><field-label fieldname="text_language" [fieldconfig]="{required: true}"></field-label><div class="slds-form-element" [ngClass]="getFieldStyle(\'text_language\')"><div class="slds-form-element__control"><div class="slds-select_container"><select id="text_language" class="slds-select" [(ngModel)]="textLanguage" [disabled]="isDisabledLang"><option *ngFor="let sysLanguage of availableSysLanguages; trackBy: trackByFn" [value]="sysLanguage.language">{{sysLanguage.text}}</option></select></div></div><field-messages fieldname="text_language"></field-messages><system-spinner *ngIf="isLoading(\'text_language\')" class="slds-is-absolute" size="15" style="right: 25px; top: 8px"></system-spinner></div></div></div><field-container field="description" fielddisplayclass="slds-truncate"></field-container></system-modal-content><system-modal-footer><button class="slds-button slds-button--neutral" (click)="cancel()"><system-label label="LBL_CANCEL"></system-label></button> <button class="slds-button slds-button--brand" (click)="save()"><system-label label="LBL_SAVE"></system-label></button></system-modal-footer></system-modal>',providers:[services_1.model,services_1.view]}),__metadata("design:paramtypes",[services_1.model,services_1.configurationService,services_1.view,services_1.backend,services_1.language])],SpiceTextsAddModal)}();exports.SpiceTextsAddModal=SpiceTextsAddModal;var SpiceTextsModule=function(){function SpiceTextsModule(){}return __decorate([core_1.NgModule({imports:[platform_browser_1.BrowserModule,http_1.HttpClientModule,forms_1.FormsModule,systemcomponents_1.SystemComponents,globalcomponents_1.GlobalComponents,objectcomponents_1.ObjectComponents,objectfields_1.ObjectFields,directives_1.DirectivesModule],declarations:[SpiceTexts,SpiceTextsAddButton,SpiceTextsAddModal],entryComponents:[SpiceTexts]})],SpiceTextsModule)}();exports.SpiceTextsModule=SpiceTextsModule;