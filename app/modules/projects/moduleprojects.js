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
"use strict";var __extends=this&&this.__extends||function(){var s=function(e,t){return(s=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i])})(e,t)};return function(e,t){function i(){this.constructor=e}s(e,t),e.prototype=null===t?Object.create(t):(i.prototype=t.prototype,new i)}}(),__decorate=this&&this.__decorate||function(e,t,i,s){var a,o=arguments.length,l=o<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(e,t,i,s);else for(var d=e.length-1;0<=d;d--)(a=e[d])&&(l=(o<3?a(l):3<o?a(t,i,l):a(t,i))||l);return 3<o&&l&&Object.defineProperty(t,i,l),l},__metadata=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};Object.defineProperty(exports,"__esModule",{value:!0}),exports.ModuleProjects=exports.fieldProjectActivityDropdown=exports.fieldProjectPlannedActivityConsumption=exports.fieldProjectActivityEffort=exports.ProjectActivityDashlet=exports.ProjectActivityDashletActivity=exports.ProjectWBSHierarchyNode=exports.ProjectWBSHierarchy=exports.projectwbsHierarchy=void 0;var common_1=require("@angular/common"),core_1=require("@angular/core"),forms_1=require("@angular/forms"),directives_1=require("../../directives/directives"),objectfields_1=require("../../objectfields/objectfields"),globalcomponents_1=require("../../globalcomponents/globalcomponents"),objectcomponents_1=require("../../objectcomponents/objectcomponents"),systemcomponents_1=require("../../systemcomponents/systemcomponents"),services_1=require("../../services/services"),rxjs_1=require("rxjs"),router_1=require("@angular/router"),projectwbsHierarchy=function(){function e(e,t){this.backend=e,this.modelutilities=t,this.project_id="",this.members=[],this.membersList=[],this.isloading=!1}return e.prototype.loadHierarchy=function(e,t){var a=this;if(void 0===e&&(e=this.project_id),void 0===t&&(t=!1),!this.isloading){this.isloading=!0;for(var o=[],i=0,s=this.members;i<s.length;i++){var l=s[i];l.expanded&&o.push(l.id)}this.members=[],this.membersList=[],this.backend.getRequest("ProjectWBSsHierarchy/"+e).subscribe(function(e){for(var t=0,i=e;t<i.length;t++){var s=i[t];a.members.push({parent_id:s.parent_id,id:s.id,member_count:s.member_count,expanded:0<=o.indexOf(s.id),summary_text:s.summary_text,data:a.modelutilities.backendModel2spice("ProjectWBSs",s.data)})}a.members.sort(function(e,t){return""==e.data.date_start&&""==t.data.date_start?e.data.name>t.data.name?-1:1:""!=t.data.date_start&&(""==e.data.date_start||e.data.date_start.isBefore(t.data.date_start))?1:-1}),a.rebuildMembersList(),a.isloading=!1})}},e.prototype.expand=function(t){this.members.some(function(e){if(e.id===t)return e.expanded=!0}),this.rebuildMembersList()},e.prototype.collapse=function(t){this.members.some(function(e){if(e.id===t)return!(e.expanded=!1)}),this.rebuildMembersList()},e.prototype.rebuildMembersList=function(){this.membersList=[];for(var e=0,t=this.members;e<t.length;e++){var i=t[e];i.parent_id||(this.membersList.push({level:1,id:i.id,parent_id:"",member_count:parseInt(i.member_count,10),summary_text:i.summary_text,data:i.data,expanded:i.expanded}),i.expanded&&this.buildMembersList(i.id,1))}},e.prototype.buildMembersList=function(e,t){void 0===t&&(t=0);for(var i=0,s=this.members;i<s.length;i++){var a=s[i];a.parent_id==e&&(this.membersList.push({level:t+1,id:a.id,parent_id:e,member_count:parseInt(a.member_count,10),summary_text:a.summary_text,data:a.data,expanded:a.expanded}),a.expanded&&this.buildMembersList(a.id,t+1))}},__decorate([core_1.Injectable(),__metadata("design:paramtypes",[services_1.backend,services_1.modelutilities])],e)}();exports.projectwbsHierarchy=projectwbsHierarchy;var ProjectWBSHierarchy=function(){function ProjectWBSHierarchy(e,t,i,s,a,o){var l=this;this.language=e,this.metadata=t,this.projectwbsHierarchy=i,this.model=s,this.relatedmodels=a,this.broadcast=o,this.componentconfig={},this.fieldsetFields=[],this.relatedmodels.relatedModule="ProjectWBSs",this.broadcast.message$.subscribe(function(e){l.handleMessage(e)})}return ProjectWBSHierarchy.prototype.handleMessage=function(e){-1===e.messagetype.indexOf("model")||"ProjectWBSs"!==e.messagedata.module||"ProjectWBSs"===e.messagedata.module&&"model.loaded"===e.messagetype||this.loadHierarchy()},ProjectWBSHierarchy.prototype.loadHierarchy=function(){this.projectwbsHierarchy.project_id=this.model.id,this.projectwbsHierarchy.loadHierarchy()},ProjectWBSHierarchy.prototype.ngOnInit=function(){this.fieldsetFields=this.metadata.getFieldSetFields(this.componentconfig.fieldset),this.componentconfig.link&&(this.relatedmodels.linkName=this.componentconfig.link),this.relatedmodels.module=this.model.module,this.relatedmodels.id=this.model.id,this.loadHierarchy()},ProjectWBSHierarchy.prototype.isLoading=function(){return this.projectwbsHierarchy.isloading},__decorate([core_1.Component({selector:"projectwbs-hierarchy",template:'<article class="slds-card slds-card_boundary slds-m-bottom--medium"><div class="slds-card__header slds-grid"><header class="slds-media slds-media--center slds-has-flexi-truncate"><system-icon [icon]="\'hierarchy\'" [size]="\'small\'"></system-icon><div class="slds-media__body slds-truncate"><h2><a href="javascript:void(0);" class="slds-text-link--reset"><span class="slds-text-heading--small"><system-label label="LBL_PROJECTWBSS"></system-label></span></a></h2></div></header><object-action-container *ngIf="componentconfig.actionset" [actionset]="componentconfig.actionset"></object-action-container></div><div class="slds-card__body"><table class="slds-table slds-table--bordered slds-tree slds-table--tree" role="treegrid" aria-owns="tree0-node0 tree0-node1 tree0-node2 tree0-node3" aria-readonly="true"><thead><tr class="slds-text-title--caps"><th *ngFor="let field of fieldsetFields" scope="col"><div class="slds-truncate"><system-label-fieldname module="ProjectWBSs" [field]="field.field"></system-label-fieldname></div></th><th class="slds-cell-shrink" scope="col"></th></tr></thead><tbody><tr projectwbs-hierarchy-node class="slds-hint-parent" role="row" aria-expanded="true" *ngFor="let node of projectwbsHierarchy.membersList" [nodedata]="node" [fields]="fieldsetFields"></tr></tbody><tbody system-table-stencils *ngIf="isLoading()" [columns]="fieldsetFields.length"></tbody></table></div><div class="slds-card__footer slds-grid"><button class="slds-button slds-button_icon" (click)="loadHierarchy()"><system-button-icon icon="refresh"></system-button-icon></button></div></article>',providers:[projectwbsHierarchy,services_1.relatedmodels]}),__metadata("design:paramtypes",[services_1.language,services_1.metadata,projectwbsHierarchy,services_1.model,services_1.relatedmodels,services_1.broadcast])],ProjectWBSHierarchy)}();exports.ProjectWBSHierarchy=ProjectWBSHierarchy;var ProjectWBSHierarchyNode=function(){function e(e,t,i,s,a){this.language=e,this.metadata=t,this.projectwbsHierarchy=i,this.model=s,this.view=a,this.nodedata={},this.fields=[],this.loading=!1,this.view.displayLabels=!1}return e.prototype.ngOnInit=function(){this.model.module="ProjectWBSs",this.model.id=this.nodedata.id,this.model.data=this.model.utils.backendModel2spice(this.model.module,this.nodedata.data)},Object.defineProperty(e.prototype,"expandable",{get:function(){return 0<this.nodedata.member_count},enumerable:!1,configurable:!0}),e.prototype.isExpandedNode=function(){return this.nodedata.expanded},e.prototype.expandNode=function(){this.isExpandedNode()?this.projectwbsHierarchy.collapse(this.nodedata.id):(this.loading=!0,this.projectwbsHierarchy.expand(this.nodedata.id))},__decorate([core_1.Input(),__metadata("design:type",Object)],e.prototype,"nodedata",void 0),__decorate([core_1.Input(),__metadata("design:type",Array)],e.prototype,"fields",void 0),__decorate([core_1.Component({selector:"[projectwbs-hierarchy-node]",template:'<ng-container *ngFor="let field of fields; let i = index"><td *ngIf="i === 0" scope="row" class="slds-tree__item"><button class="slds-button slds-button--icon slds-button--icon-x-small slds-m-bottom--x-small" [disabled]="!expandable" (click)="expandNode()"><system-button-icon [icon]="loading ? \'spinner\' : (isExpandedNode() ? \'chevronright\' : \'chevronup\')"></system-button-icon></button><div class="slds-truncate"><field-container [field]="field.field" [fieldconfig]="field.fieldconfig" [fielddisplayclass]="\'slds-truncate\'"></field-container></div></td><td *ngIf="i > 0"><div class="slds-truncate"><field-container [field]="field.field" [fieldconfig]="field.fieldconfig" [fielddisplayclass]="\'slds-truncate\'"></field-container></div></td></ng-container><td role="gridcell" class="slds-cell-shrink" data-label="Actions"><object-action-menu [buttonsize]="\'x-small\'"></object-action-menu></td>',providers:[services_1.model,services_1.view],host:{"[attr.aria-level]":"nodedata.level"}}),__metadata("design:paramtypes",[services_1.language,services_1.metadata,projectwbsHierarchy,services_1.model,services_1.view])],e)}();exports.ProjectWBSHierarchyNode=ProjectWBSHierarchyNode;var ProjectActivityDashletActivity=function(){function e(e,t,i,s,a,o,l){var d=this;this.language=e,this.metadata=t,this.model=i,this.view=s,this.backend=a,this.toast=o,this.modellist=l,this.plannedActivities=[],this.selected_wbs=null,this.wbs_search_term="",this.show_wbs_results=!1,this.activityminutes=15,this.activitiyhours=0,this.subscriptions=new rxjs_1.Subscription,this.view.displayLabels=!1,this.model.module="ProjectActivities",this.reset(),this.view.isEditable=!0,this.view.setEditMode(),this.subscriptions.add(this.model.data$.subscribe(function(e){d.modelchanged(e)}))}return e.prototype.ngOnInit=function(){var t=this;this.backend.getRequest("module/ProjectPlannedActivities/my/open").subscribe(function(e){t.plannedActivities=e})},e.prototype.ngOnDestroy=function(){this.subscriptions.unsubscribe()},Object.defineProperty(e.prototype,"activities",{get:function(){var t=this;return this.wbs_search_term?this.plannedActivities.filter(function(e){return e.summary_text.toLowerCase().includes(t.wbs_search_term)}):this.plannedActivities},enumerable:!1,configurable:!0}),e.prototype.modelchanged=function(e){this.activityminutes!=e.duration_minutes||this.activitiyhours!=e.duration_hours?(this.activityminutes=e.duration_minutes,this.activitiyhours=e.duration_hours,this.activitiyDateEnd=moment(this.model.data.activity_start),this.activitiyDateEnd.add(this.activityminutes,"m"),this.activitiyDateEnd.add(this.activitiyhours,"h"),this.model.setField("activity_end",this.activitiyDateEnd)):e.activity_start&&0!=Math.round(moment.duration(e.activity_start.diff(this.activitiyDateStart)).asMinutes())?(this.activitiyDateStart=new moment(e.activity_start),this.activitiyDateEnd=moment(this.model.data.activity_start),this.activitiyDateEnd.add(this.activityminutes,"m"),this.activitiyDateEnd.add(this.activitiyhours,"h"),this.model.setField("activity_end",this.activitiyDateEnd)):e.activity_end&&Math.round(moment.duration(e.activity_end.diff(e.activity_start)).asMinutes())<0?this.model.setField("activity_end",this.activitiyDateEnd):e.activity_end&&0!=Math.round(moment.duration(e.activity_end.diff(this.activitiyDateEnd)).asMinutes())&&(this.activitiyDateEnd=moment(this.model.data.activity_end),0<(e=Math.round(moment.duration(this.model.data.activity_end.diff(e.activity_start)).asMinutes()))?(this.activitiyhours=Math.floor(e/60),this.activityminutes=e-60*this.activitiyhours):(this.activitiyhours=Math.ceil(e/60),this.activityminutes=e+60*this.activitiyhours),this.model.setFields({duration_hours:this.activitiyhours,duration_minutes:this.activityminutes}))},e.prototype.validate=function(){return!!this.selected_wbs&&(!(this.model.data.duration_hours<1&&this.model.data.duration_minutes<1)&&(!(this.model.data.duration_hours<0||this.model.data.duration_minutes<0)&&(!!this.model.data.name&&this.model.data.activity_start.dayOfYear()==this.model.data.activity_end.dayOfYear())))},e.prototype.save=function(){var t=this;if(!this.validate())return!1;var e={projectwbs_id:this.selected_wbs.projectwbs_id,projectplannedactivity_id:this.selected_wbs.id,projectactivitytype_id:this.selected_wbs.projectactivitytype_id,activity_type:this.selected_wbs.type,activity_level:this.selected_wbs.level};this.model.setFields(e),this.model.save().subscribe(function(e){t.reset(),t.toast.sendToast(t.language.getLabel("LBL_DATA_SAVED"),"success")})},e.prototype.reset=function(){this.model.id="",this.model.initializeModel(),this.selected_wbs=null,this.wbs_search_term=null,this.show_wbs_results=!1,this.activitiyDateStart=new moment,this.activitiyDateStart.minute(15*Math.floor(this.activitiyDateStart.minute()/15)),this.activitiyDateStart.second(0),this.activitiyhours=0,this.activityminutes=15,this.activitiyDateEnd=new moment(this.activitiyDateStart),this.activitiyDateEnd.add(this.activityminutes,"m"),this.model.setFields({activity_start:new moment(this.activitiyDateStart),activity_end:new moment(this.activitiyDateEnd),duration_hours:this.activitiyhours,duration_minutes:this.activityminutes})},__decorate([core_1.Component({selector:"project-activity-dashlet-activity",template:'<div class="slds-p-vertical--x-small"><div class="slds-grid"><div class="slds-form-element slds-size--1-of-2"><label class="slds-form-element__label"><system-label label="LBL_PROJECTPLANNEDACTIVITY"></system-label></label><div class="slds-form-element__control"><div *ngIf="selected_wbs" class="slds-combobox__form-element slds-input-has-icon slds-input-has-icon_right"><div class="slds-pill_container"><span class="slds-pill slds-size--1-of-1"><span class="slds-pill__label">{{selected_wbs.summary_text}}</span> <button class="slds-button slds-button--icon slds-pill__remove" (click)="selected_wbs = null"><system-button-icon [icon]="\'close\'"></system-button-icon></button></span></div></div><div *ngIf="!selected_wbs" class="slds-combobox_container"><div class="slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click" aria-haspopup="listbox" role="combobox"><div class="slds-combobox__form-element"><input type="text" class="slds-input slds-combobox__input" aria-autocomplete="list" autocomplete="off" role="textbox" placeholder="{{language.getLabel(\'LBL_SEARCH_HERE\')}}" [(ngModel)]="wbs_search_term" (focus)="show_wbs_results = true" (focusout)="show_wbs_results = false" (keyup.escape)="show_wbs_results = false"></div></div><div *ngIf="show_wbs_results" role="listbox"><ul class="slds-listbox slds-listbox_vertical slds-dropdown slds-dropdown_fluid" role="presentation"><li *ngFor="let activity of activities" class="slds-listbox__item" role="presentation"><div class="slds-listbox__option slds-p-vertical--xx-small slds-p-horizontal--x-small" role="option" (mousedown)="selected_wbs = activity"><span>{{activity.summary_text}}</span></div></li><li *ngIf="activities.length == 0" class="slds-listbox__item" role="presentation"><div class="slds-listbox__option slds-p-vertical--xx-small slds-p-horizontal--x-small" role="option"><system-label label="MSG_NO_RECORDS_FOUND"></system-label></div></li></ul></div></div></div></div><div class="slds-m-left--xx-small slds-size--1-of-2"><field-label addclasses="slds-p-horizontal--xx-small" fieldname="name"></field-label><field-container fieldname="name"></field-container></div></div><div class="slds-grid slds-grid_vertical-align-end"><div class="slds-size--1-of-2"><field-label addclasses="slds-p-horizontal--xx-small" fieldname="activity_start"></field-label><field-container fieldname="activity_start"></field-container></div><div class="slds-grow slds-grid"><div class="slds-size--1-of-2"><field-label addclasses="slds-p-horizontal--xx-small" fieldname="activity_end"></field-label><field-container fieldname="activity_end" [fieldconfig]="{fieldtype:\'time\'}"></field-container></div><div class="slds-m-left--xx-small slds-size--1-of-2"><field-label addclasses="slds-p-horizontal--xx-small" fieldname="duration_hours"></field-label><field-container fieldname="activity_end" [fieldconfig]="{fieldtype:\'duration\', freeentry: true}"></field-container></div></div><div class="slds-p-left--x-small slds-p-vertical--xx-small"><button class="slds-button slds-button--brand" [disabled]="!validate()" (click)="save()"><system-label label="LBL_SAVE"></system-label></button></div></div></div>',providers:[services_1.model,services_1.view]}),__metadata("design:paramtypes",[services_1.language,services_1.metadata,services_1.model,services_1.view,services_1.backend,services_1.toast,services_1.modellist])],e)}();exports.ProjectActivityDashletActivity=ProjectActivityDashletActivity;var ProjectActivityDashlet=function(){function ProjectActivityDashlet(e,t,i,s,a,o,l){this.language=e,this.metadata=t,this.model=i,this.view=s,this.backend=a,this.toast=o,this.modellist=l,this.module="ProjectActivities",this.modellistsubscribe=void 0,this.componentconfig={},this.componentconfig=this.metadata.getComponentConfig("ProjectActivityDashlet"),this.modellist.loadlimit=this.limit,this.modellist.module=this.module,this.modellist.currentList.sortfields||(this.modellist.currentList.sortfields=btoa('{"sortfield": "date_entered", "sortdirection": "DESC"}'))}return ProjectActivityDashlet.prototype.ngOnInit=function(){this.loadRecentActivities()},Object.defineProperty(ProjectActivityDashlet.prototype,"sortfield",{get:function(){var e;return null!==(e=this.componentconfig)&&void 0!==e&&e.sortfield?this.componentconfig.sortfield:""},enumerable:!1,configurable:!0}),Object.defineProperty(ProjectActivityDashlet.prototype,"sortdirection",{get:function(){var e;return void 0!==(null===(e=this.componentconfig)||void 0===e?void 0:e.sortdirection)?this.componentconfig.sortdirection:""},enumerable:!1,configurable:!0}),Object.defineProperty(ProjectActivityDashlet.prototype,"limit",{get:function(){var e;return void 0!==(null===(e=this.componentconfig)||void 0===e?void 0:e.limit)?this.componentconfig.limit:10},enumerable:!1,configurable:!0}),Object.defineProperty(ProjectActivityDashlet.prototype,"isloading",{get:function(){return this.modellist.isLoading},enumerable:!1,configurable:!0}),ProjectActivityDashlet.prototype.trackbyfn=function(e,t){return t.id},ProjectActivityDashlet.prototype.loadRecentActivities=function(){this.modellist.setListType("owner",!1,[{sortfield:"date_entered",sortdirection:"DESC"}])},__decorate([core_1.Component({selector:"project-activity-dashlet",template:'<div class="slds-p-around--x-small"><div class="slds-grid slds-grid--vertical-align-center slds-p-bottom--x-small"><system-icon [module]="\'Projects\'" [size]="\'small\'"></system-icon><h2 class="slds-text-heading--medium slds-p-bottom--xx-small"><system-label label="LBL_RECORD_PROJECTACTIVITY"></system-label></h2></div><project-activity-dashlet-activity></project-activity-dashlet-activity><div class="slds-select_container"><table class="slds-table slds-table--fixed-layout slds-max-medium-table--stacked-horizontal slds-table--striped slds-table--header-fixed" [ngClass] role="grid"><thead><tr class="slds-text-title--caps" object-list-header [showSelectColumn]="false"></tr></thead><tbody><tr object-list-item *ngFor="let listItem of modellist.listData.list; trackBy: trackbyfn" [listItem]="listItem" [rowselect]="false" class="slds-hint-parent"></tr></tbody><tbody system-table-stencils [columns]="modellist.listfields.length" [select]="false" [tools]="false" [rows]="limit" *ngIf="isloading"></tbody></table><div *ngIf="!modellist.isLoading && modellist.listData.totalcount == 0" class="slds-align--absolute-center" style="height: calc(100% - 35px)"><system-illustration-no-records><system-label label="MSG_NO_RECORDS_FOUND"></system-label></system-illustration-no-records></div></div></div>',providers:[services_1.modellist]}),__metadata("design:paramtypes",[services_1.language,services_1.metadata,services_1.model,services_1.view,services_1.backend,services_1.toast,services_1.modellist])],ProjectActivityDashlet)}();exports.ProjectActivityDashlet=ProjectActivityDashlet;var fieldProjectActivityEffort=function(l){function fieldProjectActivityEffort(e,t,i,s,a){var o=l.call(this,e,t,i,s,a)||this;return o.model=e,o.view=t,o.language=i,o.metadata=s,o.router=a,o}return __extends(fieldProjectActivityEffort,l),Object.defineProperty(fieldProjectActivityEffort.prototype,"fieldstart",{get:function(){return this.fieldconfig.fieldstart||"activity_start"},enumerable:!1,configurable:!0}),Object.defineProperty(fieldProjectActivityEffort.prototype,"fieldend",{get:function(){return this.fieldconfig.fieldend||"activity_end"},enumerable:!1,configurable:!0}),Object.defineProperty(fieldProjectActivityEffort.prototype,"value",{get:function(){var e=this.model.getField(this.fieldstart),t=this.model.getField(this.fieldend);if(e&&t){e=moment.duration(t.diff(e));return e.get("hours")+":"+e.get("minutes")}return""},enumerable:!1,configurable:!0}),__decorate([core_1.Component({selector:"field-project-activity-effort",template:'<field-label *ngIf="displayLabel" [fieldname]="fieldname" [fieldconfig]="fieldconfig"></field-label><field-generic-display [fielddisplayclass]="fielddisplayclass" [editable]="isEditable()" [fieldconfig]="fieldconfig" [title]="value" [fieldid]="fieldid">{{value}}</field-generic-display>'}),__metadata("design:paramtypes",[services_1.model,services_1.view,services_1.language,services_1.metadata,router_1.Router])],fieldProjectActivityEffort)}(objectfields_1.fieldGeneric);exports.fieldProjectActivityEffort=fieldProjectActivityEffort;var fieldProjectPlannedActivityConsumption=function(l){function fieldProjectPlannedActivityConsumption(e,t,i,s,a){var o=l.call(this,e,t,i,s,a)||this;return o.model=e,o.view=t,o.language=i,o.metadata=s,o.router=a,o}return __extends(fieldProjectPlannedActivityConsumption,l),Object.defineProperty(fieldProjectPlannedActivityConsumption.prototype,"duration",{get:function(){var e=moment.duration(this.value,"minutes");return e.get("hours")+(e.get("minutes")<10?":0":":")+e.get("minutes")},enumerable:!1,configurable:!0}),Object.defineProperty(fieldProjectPlannedActivityConsumption.prototype,"percentage",{get:function(){return Math.round(this.value/60/this.model.getField("effort")*100)},enumerable:!1,configurable:!0}),__decorate([core_1.Component({selector:"field-project-activity-effort",template:'<field-label *ngIf="displayLabel" [fieldname]="fieldname" [fieldconfig]="fieldconfig"></field-label><field-generic-display [fielddisplayclass]="fielddisplayclass" [editable]="isEditable()" [fieldconfig]="fieldconfig" [title]="value" [fieldid]="fieldid"><div class="slds-align_absolute-center"><ul class="slds-list_horizontal slds-badge slds-has-dividers_left" [ngClass]="{\'slds-theme--warning\': percentage > 80,\'slds-theme--error\': percentage > 100}"><li class="slds-item">{{duration}}</li><li class="slds-item">{{percentage}}%</li></ul></div></field-generic-display>'}),__metadata("design:paramtypes",[services_1.model,services_1.view,services_1.language,services_1.metadata,router_1.Router])],fieldProjectPlannedActivityConsumption)}(objectfields_1.fieldGeneric);exports.fieldProjectPlannedActivityConsumption=fieldProjectPlannedActivityConsumption;var fieldProjectActivityDropdown=function(d){function fieldProjectActivityDropdown(e,t,i,s,a,o){var l=d.call(this,t,i,s,a,o)||this;return l.backend=e,l.model=t,l.view=i,l.language=s,l.metadata=a,l.router=o,l.options=[],l}return __extends(fieldProjectActivityDropdown,d),fieldProjectActivityDropdown.prototype.ngOnInit=function(){d.prototype.ngOnInit.call(this),this.getActivityTypes()},Object.defineProperty(fieldProjectActivityDropdown.prototype,"idField",{get:function(){return this.metadata.getFieldDefs(this.model.module,this.fieldname).id_name},enumerable:!1,configurable:!0}),Object.defineProperty(fieldProjectActivityDropdown.prototype,"isDisabled",{get:function(){return!this.model.getField("projectwbs_id")},enumerable:!1,configurable:!0}),fieldProjectActivityDropdown.prototype.getActivityTypes=function(){var t=this,e=this.model.getField("projectwbs_id");this.backend.getRequest("modules/ProjectWBSs/"+e+"/activitytypes").subscribe(function(e){0<e.activitytypes.length&&(t.options=e.activitytypes)})},__decorate([core_1.Component({selector:"field-project-activity-dropdown",template:'<field-label *ngIf="displayLabel" [fieldname]="fieldname" [fieldconfig]="fieldconfig"></field-label><field-generic-display *ngIf="!this.isEditMode()" [fielddisplayclass]="fielddisplayclass" [editable]="isEditable()" [fieldconfig]="fieldconfig" [title]="value" [fieldid]="fieldid">{{value}}</field-generic-display><div *ngIf="this.isEditMode()"><div class="slds-form-element__control" [ngClass]="getFieldClass()"><div class="slds-select_container slds-m-vertical--xx-small"><select [disabled]="isDisabled" #focus class="slds-select" [(ngModel)]="model.data[this.idField]"><option *ngFor="let o of options" [value]="o.id">{{o.name}}</option></select></div><field-messages [fieldname]="fieldname"></field-messages></div></div>'}),__metadata("design:paramtypes",[services_1.backend,services_1.model,services_1.view,services_1.language,services_1.metadata,router_1.Router])],fieldProjectActivityDropdown)}(objectfields_1.fieldGeneric);exports.fieldProjectActivityDropdown=fieldProjectActivityDropdown;var ModuleProjects=function(){function ModuleProjects(){}return __decorate([core_1.NgModule({imports:[common_1.CommonModule,forms_1.FormsModule,objectfields_1.ObjectFields,globalcomponents_1.GlobalComponents,objectcomponents_1.ObjectComponents,systemcomponents_1.SystemComponents,directives_1.DirectivesModule],declarations:[ProjectWBSHierarchy,ProjectWBSHierarchyNode,ProjectActivityDashlet,ProjectActivityDashletActivity,fieldProjectActivityDropdown,fieldProjectActivityEffort,fieldProjectPlannedActivityConsumption]})],ModuleProjects)}();exports.ModuleProjects=ModuleProjects;