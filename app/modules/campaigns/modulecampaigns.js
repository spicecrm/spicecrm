/** 
 * © 2015 - 2021 aac services k.s. All rights reserved.
 * release: 2021.01.001
 * date: 2021-04-05 21:11:34
 * build: 2021.01.001.1617649894752
 **/
"use strict";var __decorate=this&&this.__decorate||function(e,t,s,i){var a,o=arguments.length,l=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(e,t,s,i);else for(var n=e.length-1;0<=n;n--)(a=e[n])&&(l=(o<3?a(l):3<o?a(t,s,l):a(t,s))||l);return 3<o&&l&&Object.defineProperty(t,s,l),l},__metadata=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};Object.defineProperty(exports,"__esModule",{value:!0}),exports.ModuleCampaigns=exports.CampaignTaskEmailPanel=exports.CampaignExportModal=exports.CampaignExportButton=exports.CampaignSendTestMailButton=exports.CampaignSendMailButton=exports.CampaignTaskExportButton=exports.CampaignTaskActivateButton=void 0;var common_1=require("@angular/common"),core_1=require("@angular/core"),forms_1=require("@angular/forms"),objectfields_1=require("../../objectfields/objectfields"),globalcomponents_1=require("../../globalcomponents/globalcomponents"),objectcomponents_1=require("../../objectcomponents/objectcomponents"),systemcomponents_1=require("../../systemcomponents/systemcomponents"),services_1=require("../../services/services"),platform_browser_1=require("@angular/platform-browser"),rxjs_1=require("rxjs"),CampaignTaskActivateButton=function(){function CampaignTaskActivateButton(e,t,s,i,a){var o=this;this.language=e,this.metadata=t,this.model=s,this.toast=i,this.backend=a,this.activating=!1,this.disabled=!0,this.model.mode$.subscribe(function(e){o.handleDisabled()}),this.model.data$.subscribe(function(e){o.handleDisabled()})}return Object.defineProperty(CampaignTaskActivateButton.prototype,"hidden",{get:function(){return"Email"==this.model.data.campaigntask_type},enumerable:!1,configurable:!0}),CampaignTaskActivateButton.prototype.handleDisabled=function(){"Email"==this.model.getFieldValue("campaigntask_type")||this.model.getFieldValue("activated")?this.disabled=!0:this.disabled=!(!this.model.isEditing&&!0!==this.model.data.activated)},CampaignTaskActivateButton.prototype.execute=function(){var t=this;this.activating||(this.activating=!0,this.backend.postRequest("module/CampaignTasks/"+this.model.id+"/activate").subscribe(function(e){t.activating=!1,e.success?(t.toast.sendToast("Activated"),t.model.setField("activated",!0)):t.toast.sendToast("Error")}))},__decorate([core_1.Component({template:'<div class="slds-grid slds-grid--vertical-align-center"><div *ngIf="activating" class="slds-p-right--x-small"><system-spinner [size]="12"></system-spinner></div><span><system-label label="LBL_ACTIVATE"></system-label></span></div>'}),__metadata("design:paramtypes",[services_1.language,services_1.metadata,services_1.model,services_1.toast,services_1.backend])],CampaignTaskActivateButton)}();exports.CampaignTaskActivateButton=CampaignTaskActivateButton;var CampaignTaskExportButton=function(){function e(e,t,s,i,a,o){var l=this;this.language=e,this.metadata=t,this.model=s,this.toast=i,this.backend=a,this.domsanitizer=o,this.exporting=!1,this.disabled=!0,this.model.mode$.subscribe(function(e){l.handleDisabled()}),this.model.data$.subscribe(function(e){l.handleDisabled()})}return Object.defineProperty(e.prototype,"hidden",{get:function(){return"Email"==this.model.data.campaigntask_type},enumerable:!1,configurable:!0}),e.prototype.handleDisabled=function(){this.model.getFieldValue("activated")?this.disabled=!0:this.disabled=!!this.model.isEditing},e.prototype.execute=function(){var s=this;this.exporting||(this.exporting=!0,this.backend.getDownloadPostRequestFile("/module/CampaignTasks/"+this.model.id+"/export",{}).subscribe(function(e){var t=document.createElement("a");t.href=e,t.setAttribute("download",s.model.getField("name").replace(" ","_")+"_"+moment().format("YYYY_MM_DD_HH_mm_ss")+".csv"),document.body.appendChild(t),t.click(),document.body.removeChild(t),s.exporting=!1}))},__decorate([core_1.Component({template:'<div class="slds-grid slds-grid--vertical-align-center"><div *ngIf="exporting" class="slds-p-right--x-small"><system-spinner [size]="12"></system-spinner></div><span><system-label label="LBL_EXPORT"></system-label></span></div>'}),__metadata("design:paramtypes",[services_1.language,services_1.metadata,services_1.model,services_1.toast,services_1.backend,platform_browser_1.DomSanitizer])],e)}();exports.CampaignTaskExportButton=CampaignTaskExportButton;var CampaignSendMailButton=function(){function CampaignSendMailButton(e,t,s,i){var a=this;this.language=e,this.model=t,this.backend=s,this.toast=i,this.sending=!1,this.disabled=!0,this.model.mode$.subscribe(function(e){a.handleDisabled()}),this.model.data$.subscribe(function(e){a.handleDisabled()})}return CampaignSendMailButton.prototype.execute=function(){var t=this;this.sending||(this.sending=!0,this.backend.postRequest("module/CampaignTasks/"+this.model.id+"/queuemail").subscribe(function(e){t.sending=!1,t.toast.sendToast("Mails queued"),t.model.setField("activated",!0)}))},Object.defineProperty(CampaignSendMailButton.prototype,"hidden",{get:function(){return"Email"!==this.model.data.campaigntask_type},enumerable:!1,configurable:!0}),CampaignSendMailButton.prototype.handleDisabled=function(){!this.model.getField("activated")&&(!this.model.data.acl||this.model.data.acl.edit)&&"Email"===this.model.data.campaigntask_type&&this.model.data.mailbox_id?this.disabled=!!this.model.isEditing:this.disabled=!0},__decorate([core_1.Component({selector:"campaign-send-mail-button",template:'<div class="slds-grid slds-grid--vertical-align-center"><div style="min-width: 26px;"><system-icon *ngIf="!sending" [sprite]="\'utility\'" [icon]="\'email\'" [size]="\'xx-small\'" [addclasses]="\'\'"></system-icon><system-spinner *ngIf="sending" [size]="10" [border]="1"></system-spinner></div><span><system-label label="LBL_QUEUE\'"></system-label></span></div>'}),__metadata("design:paramtypes",[services_1.language,services_1.model,services_1.backend,services_1.toast])],CampaignSendMailButton)}();exports.CampaignSendMailButton=CampaignSendMailButton;var CampaignSendTestMailButton=function(){function CampaignSendTestMailButton(e,t,s,i,a){var o=this;this.language=e,this.model=t,this.modal=s,this.backend=i,this.toast=a,this.sending=!1,this.disabled=!0,this.model.mode$.subscribe(function(e){o.handleDisabled()}),this.model.data$.subscribe(function(e){o.handleDisabled()})}return CampaignSendTestMailButton.prototype.execute=function(){var t=this,s=this.modal.await("LBL_SENDING");this.sending||(this.sending=!0,this.backend.postRequest("module/CampaignTasks/"+this.model.id+"/sendtestmail").subscribe(function(e){t.sending=!1,s.emit(!0),"success"==e.status?t.toast.sendToast("Mails sent"):t.toast.sendToast(e.msg,"error")},function(e){s.emit(!0),t.sending=!1,t.toast.sendToast("ERROR")}))},Object.defineProperty(CampaignSendTestMailButton.prototype,"hidden",{get:function(){return"Email"!==this.model.data.campaigntask_type},enumerable:!1,configurable:!0}),CampaignSendTestMailButton.prototype.handleDisabled=function(){!this.model.getField("activated")&&(!this.model.data.acl||this.model.data.acl.edit)&&"Email"===this.model.data.campaigntask_type&&this.model.data.mailbox_id?this.disabled=!!this.model.isEditing:this.disabled=!0},__decorate([core_1.Component({selector:"campaign-send-test-mail-button",template:'<div class="slds-grid slds-grid--vertical-align-center"><div style="min-width: 26px;"><system-icon *ngIf="!sending" [sprite]="\'utility\'" [icon]="\'email\'" [size]="\'xx-small\'" [addclasses]="\'\'"></system-icon><system-spinner *ngIf="sending" [size]="10" [border]="1"></system-spinner></div><span><system-label label="LBL_TEST"></system-label></span></div>'}),__metadata("design:paramtypes",[services_1.language,services_1.model,services_1.modal,services_1.backend,services_1.toast])],CampaignSendTestMailButton)}();exports.CampaignSendTestMailButton=CampaignSendTestMailButton;var CampaignExportButton=function(){function CampaignExportButton(e,t,s,i){this.language=e,this.model=t,this.injector=s,this.modal=i}return CampaignExportButton.prototype.execute=function(){this.modal.openModal("CampaignExportModal",!0,this.injector)},__decorate([core_1.Component({selector:"campaign-export-button",template:'<span><system-label label="LBL_EXPORT"></system-label></span>'}),__metadata("design:paramtypes",[services_1.language,services_1.model,core_1.Injector,services_1.modal])],CampaignExportButton)}();exports.CampaignExportButton=CampaignExportButton;var CampaignExportModal=function(){function CampaignExportModal(e,t,s,i){var a=this;this.language=e,this.model=t,this.backend=s,this.modal=i,this.exportReports=[],this.backend.getRequest("module/CampaignTasks/export/reports").subscribe(function(e){a.exportReports=e})}return CampaignExportModal.prototype.close=function(){this.self.destroy()},CampaignExportModal.prototype.downloadCSV=function(e){var t=this,s=this.modal.await(this.language.getLabel("LBL_DOWNLOADING"));this.backend.getDownloadPostRequestFile("KReporter/plugins/action/kcsvexport/export",{record:e,parentbeanId:this.model.id,parentbeanModule:this.model.module}).subscribe(function(e){t.downloadURL(e,"csv"),s.emit(!0),t.close()},function(e){s.emit(!0)})},CampaignExportModal.prototype.downloadXLS=function(e){var t=this,s=this.modal.await(this.language.getLabel("LBL_DOWNLOADING"));this.backend.getDownloadPostRequestFile("KReporter/plugins/action/kexcelexport/export",{record:e,parentbeanId:this.model.id,parentbeanModule:this.model.module}).subscribe(function(e){t.downloadURL(e,"xlsx"),s.emit(!0),t.close()},function(e){s.emit(!0)})},CampaignExportModal.prototype.downloadURL=function(e,t){var s=document.createElement("a");s.href=e,s.setAttribute("download",this.model.getField("name").replace(" ","_")+"_"+moment().format("YYYY_MM_DD_HH_mm_ss")+"."+t),document.body.appendChild(s),s.click(),document.body.removeChild(s)},__decorate([core_1.Component({template:'<system-modal size="small"><system-modal-header (close)="close()"><system-label label="LBL_EXPORT"></system-label> <system-label label="LBL_CAMPAIGNTASK"></system-label></system-modal-header><system-modal-content margin="none"><div class="slds-p-horizontal--small"><div *ngFor="let exportReport of exportReports" class="slds-grid slds-grid--vertical-align-center slds-p-around--xx-small"><div class="slds-grow">{{exportReport.name}}</div><button class="slds-button slds-button--neutral" [disabled]="!exportReport.xls" (click)="downloadXLS(exportReport.id)"><system-button-icon icon="download"></system-button-icon>xls</button> <button class="slds-button slds-button--neutral" [disabled]="!exportReport.csv" (click)="downloadCSV(exportReport.id)"><system-button-icon icon="download"></system-button-icon>csv</button></div></div></system-modal-content><system-modal-footer><button class="slds-button slds-button--neutral" (click)="close()"><system-label label="LBL_CANCEL"></system-label></button></system-modal-footer></system-modal>'}),__metadata("design:paramtypes",[services_1.language,services_1.model,services_1.backend,services_1.modal])],CampaignExportModal)}();exports.CampaignExportModal=CampaignExportModal;var CampaignTaskEmailPanel=function(){function CampaignTaskEmailPanel(e,t,s,i,a,o,l,n){this.language=e,this.model=t,this.injector=s,this.view=i,this.sanitizer=a,this.backend=o,this.metadata=l,this.modal=n,this.componentconfig={},this.activeTab="details",this.subscription=new rxjs_1.Subscription}return Object.defineProperty(CampaignTaskEmailPanel.prototype,"hidden",{get:function(){return this.componentconfig.requiredmodelstate&&!this.model.checkModelState(this.componentconfig.requiredmodelstate)},enumerable:!1,configurable:!0}),CampaignTaskEmailPanel.prototype.ngOnInit=function(){this.setInitialValues(),this.setSanitizedHTMLValue(),this.subscribeToModelChanges()},CampaignTaskEmailPanel.prototype.ngOnDestroy=function(){this.subscription.unsubscribe()},CampaignTaskEmailPanel.prototype.buildHtmlDom=function(e,t){return'<html lang="en">\n                    <head>\n                        <style>'+t.stylesheet+"</style>\n                    </head>\n                    <body>\n                        <div>"+t.header+"</div>\n                        <div>"+(e||"")+"</div> \n                        <div>"+t.footer+"</div>\n                    </body>\n                </html>"},CampaignTaskEmailPanel.prototype.setInitialValues=function(){this.emailBody=this.model.getField("email_body"),this.mailboxId=this.model.getField("mailbox_id")},CampaignTaskEmailPanel.prototype.subscribeToModelChanges=function(){var t=this;this.subscription.add(this.model.data$.subscribe(function(e){e.mailbox_id!==t.mailboxId&&(t.mailboxId=e.mailbox_id,t.loadMailboxData()),e.email_body!==t.emailBody&&(t.emailBody=e.email_body,t.setSanitizedHTMLValue())}))},CampaignTaskEmailPanel.prototype.copyFromTemplate=function(){var t=this;this.modal.openModal("ObjectModalModuleLookup",!0,this.injector).subscribe(function(e){e.instance.module="EmailTemplates",e.instance.multiselect=!1,e.instance.selectedItems.subscribe(function(e){e.length&&(t.model.setField("email_subject",e[0].subject),t.model.setField("email_body",e[0].body_html),t.setSanitizedHTMLValue())})})},CampaignTaskEmailPanel.prototype.setActiveTab=function(e){this.activeTab=e},CampaignTaskEmailPanel.prototype.setSanitizedHTMLValue=function(){var e;this.mailboxId?this.mailboxData&&(e=this.buildHtmlDom(this.emailBody,this.mailboxData),this.sanitizedHTML=this.sanitizer.bypassSecurityTrustHtml(e)):this.sanitizedHTML=this.sanitizer.bypassSecurityTrustHtml(this.emailBody||"")},CampaignTaskEmailPanel.prototype.loadMailboxData=function(){var t=this;this.mailboxId&&(this.mailboxData=void 0,this.backend.get("Mailboxes",this.mailboxId,"details").subscribe(function(e){e&&(t.mailboxData={header:e.mailbox_header||"",footer:e.mailbox_footer||"",stylesheet:t.metadata.getHtmlStylesheetCode(e.stylesheet)||""},t.setSanitizedHTMLValue())}))},__decorate([core_1.Component({selector:"campaign-task-email-panel",template:'<div *ngIf="!hidden" class="slds-tabs--default slds-grid slds-grid--vertical"><ul class="slds-tabs--default__nav" role="tablist"><li (click)="setActiveTab(\'details\')" [class.slds-active]="activeTab == \'details\'" class="slds-tabs--default__item slds-text-title--caps" role="presentation"><a class="slds-tabs--default__link" href="javascript:void(0);" role="tab" aria-selected="false"><system-label label="LBL_DETAILS"></system-label></a></li><li (click)="setActiveTab(\'preview\')" [class.slds-active]="activeTab == \'preview\'" class="slds-tabs--default__item slds-text-title--caps" role="presentation"><a class="slds-tabs--default__link" href="javascript:void(0);" role="tab" aria-selected="false"><system-label label="LBL_PREVIEW"></system-label></a></li></ul><div class="slds-grow"><div class="slds-p-around--x-small slds-height_full" [class.slds-hide]="activeTab != \'details\'"><field-container field="mailbox_id" [fieldconfig]="{fieldtype: \'mailboxes\', scope: \'outboundmass\'}" fielddisplayclass="slds-has-divider--bottom slds-p-vertical--x-small spice-fieldminheight"></field-container><div class="slds-grid"><field-container field="email_subject" class="slds-grow" fielddisplayclass="slds-has-divider--bottom slds-p-vertical--x-small spice-fieldminheight"></field-container><div class="slds-align-bottom slds-col--bump-left slds-m-left--small slds-p-bottom--xx-small"><button [disabled]="!view.isEditMode()" (click)="copyFromTemplate()" class="slds-button slds-button--neutral"><system-button-icon icon="copy" position="left"></system-button-icon><system-label label="LBL_COPY_TEMPLATE"></system-label></button></div></div><field-container field="email_body" [fieldconfig]="{fieldtype: \'richtext\', asiframe:true, \'simplemode\': true, height: \'250px\'}" fielddisplayclass="slds-has-divider--bottom slds-p-vertical--x-small spice-fieldminheight"></field-container></div><div [class.slds-hide]="activeTab != \'preview\'" class="slds-height_full"><iframe *ngIf="sanitizedHTML" class="slds-size--1-of-1" style="height: 400px; border: 0; resize: vertical;" [srcdoc]="sanitizedHTML"></iframe></div></div></div>'}),__metadata("design:paramtypes",[services_1.language,services_1.model,core_1.Injector,services_1.view,platform_browser_1.DomSanitizer,services_1.backend,services_1.metadata,services_1.modal])],CampaignTaskEmailPanel)}();exports.CampaignTaskEmailPanel=CampaignTaskEmailPanel;var ModuleCampaigns=function(){function ModuleCampaigns(){}return __decorate([core_1.NgModule({imports:[common_1.CommonModule,forms_1.FormsModule,objectfields_1.ObjectFields,globalcomponents_1.GlobalComponents,objectcomponents_1.ObjectComponents,systemcomponents_1.SystemComponents],declarations:[CampaignTaskActivateButton,CampaignTaskExportButton,CampaignSendMailButton,CampaignSendTestMailButton,CampaignExportButton,CampaignExportModal,CampaignTaskEmailPanel]})],ModuleCampaigns)}();exports.ModuleCampaigns=ModuleCampaigns;