/** 
 * © 2015 - 2021 aac services k.s. All rights reserved.
 * release: 2021.01.001
 * date: 2021-04-05 21:11:34
 * build: 2021.01.001.1617649894752
 **/
"use strict";var __decorate=this&&this.__decorate||function(e,t,s,i){var o,r=arguments.length,d=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)d=Reflect.decorate(e,t,s,i);else for(var n=e.length-1;0<=n;n--)(o=e[n])&&(d=(r<3?o(d):3<r?o(t,s,d):o(t,s))||d);return 3<r&&d&&Object.defineProperty(t,s,d),d},__metadata=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};Object.defineProperty(exports,"__esModule",{value:!0}),exports.ModuleSpiceTimeline=exports.SpiceTimelineEvent=exports.SpiceTimeline=void 0;var common_1=require("@angular/common"),core_1=require("@angular/core"),forms_1=require("@angular/forms"),directives_1=require("../../directives/directives"),objectfields_1=require("../../objectfields/objectfields"),globalcomponents_1=require("../../globalcomponents/globalcomponents"),objectcomponents_1=require("../../objectcomponents/objectcomponents"),systemcomponents_1=require("../../systemcomponents/systemcomponents"),services_1=require("../../services/services"),rxjs_1=require("rxjs"),SpiceTimeline=function(){function SpiceTimeline(e,t,s,i,o,r){this.renderer=e,this.cdRef=t,this.language=s,this.broadcast=i,this.userpreferences=o,this.metadata=r,this.focusColor="#ffc700",this.todayColor="#eb7092",this.defaultPeriodUnitWidth=50,this.defaultPeriodTimelineWidth=250,this.periodUnitWidth=50,this.periodTimelineWidth=250,this.periodDataWidth=250,this.periodDuration=[],this.records=[],this.headerFields=["name"],this.recordFieldsetFields=[],this.dateChange=new core_1.EventEmitter,this.eventClick=new core_1.EventEmitter,this.periodUnit="day",this.headerDateText="",this.eventColor="#039be5",this.eventHeight=25,this.startHour=0,this.endHour=23,this.hoursCount=24,this.pickerIsOpen=!1,this.currentDate=moment(),this.endDate=moment(),this.startDate=moment(),this.recordsUnavailableTimes={},this.onlyWorkingHoursEnabled=!1,this.onlyWorkingHours=!1,this.subscriptions=new rxjs_1.Subscription,this.loadFieldset()}return SpiceTimeline.prototype.ngOnChanges=function(e){e.recordModule&&this.loadFieldset(),e.records&&(this.setRecordsEventStyle(),this.setRecordsUnavailable())},SpiceTimeline.prototype.ngAfterViewInit=function(){this.setOnlyWorkingHoursEnabled(),this.setDate(),this.addResizeListener(),this.addTodayHourInterval(),this.subscribeToChanges()},SpiceTimeline.prototype.ngOnDestroy=function(){this.todayMarkerHourInterval&&window.clearInterval(this.todayMarkerHourInterval),this.subscriptions.unsubscribe()},SpiceTimeline.prototype.trackByItemFn=function(e,t){return t.id},SpiceTimeline.prototype.subscribeToChanges=function(){var t=this;this.subscriptions.add(this.broadcast.message$.subscribe(function(e){"timezone.changed"===e.messagetype&&(t.setTodayHourMarkerStyle(),t.setRecordsEventStyle(),t.cdRef.detectChanges())}))},SpiceTimeline.prototype.shiftDate=function(e){this.startDate=new moment(this.startDate[e](moment.duration(1,this.periodUnit+"s"))),this.endDate=new moment(this.endDate[e](moment.duration(1,this.periodUnit+"s"))),this.buildPeriodDuration(),this.setHeaderDateText(),this.emitDateChange(),this.cdRef.detectChanges()},SpiceTimeline.prototype.addTodayHourInterval=function(){var e=this;this.todayMarkerHourInterval=window.setInterval(function(){e.setTodayHourMarkerStyle(),e.cdRef.detectChanges()},6e4)},SpiceTimeline.prototype.toggleOnlyWorkingHours=function(){this.onlyWorkingHours=!this.onlyWorkingHours,this.startHour=this.onlyWorkingHours?+this.userpreferences.toUse.calendar_day_start_hour:0,this.endHour=this.onlyWorkingHours?+this.userpreferences.toUse.calendar_day_end_hour-1:23,this.hoursCount=this.endHour-this.startHour,this.setDate(),this.buildPeriodDuration(),this.setTodayHourMarkerStyle()},SpiceTimeline.prototype.setOnlyWorkingHoursEnabled=function(){var e=this.userpreferences.toUse.calendar_day_start_hour,t=this.userpreferences.toUse.calendar_day_end_hour;e&&0!=e&&t&&23!=t&&(this.onlyWorkingHoursEnabled=!0)},SpiceTimeline.prototype.addResizeListener=function(){var e=this;this.resizeListener=this.renderer.listen("window","resize",function(){return e.setDefaultWidth()})},SpiceTimeline.prototype.setDefaultWidth=function(){var e=this.contentContainer.element.nativeElement.getBoundingClientRect().width;this.periodDataWidth=.25*e,this.defaultPeriodTimelineWidth=.75*e,this.defaultPeriodUnitWidth=(this.defaultPeriodTimelineWidth-1)/this.periodDuration.length,this.resetPeriodUnitWidth(),this.cdRef.detectChanges()},SpiceTimeline.prototype.emitDateChange=function(){this.dateChange.emit({start:new moment(this.startDate.format()),end:new moment(this.endDate.format())})},SpiceTimeline.prototype.loadFieldset=function(){var t=this,e=this.metadata.getComponentConfig("SpiceTimeline",this.recordModule);e&&e.recordFieldset&&((e=this.metadata.getFieldSetFields(e.recordFieldset))&&(this.recordFieldsetFields=e,this.headerFields=e.map(function(e){return t.language.getFieldDisplayName(t.recordModule,e.field)})))},SpiceTimeline.prototype.trackByIndexFn=function(e,t){return e},SpiceTimeline.prototype.buildPeriodDuration=function(){this.periodDuration=[];var e,t,s=new moment(this.startDate).hour(this.startHour);switch(this.periodUnit){case"day":e="hours",t="H:00";break;case"week":s=new moment(this.startDate).day(0),e="days",t="ddd D";break;case"month":s=new moment(this.startDate).date(1),e="days",t="D"}for(var i=new moment(s).endOf(this.periodUnit).hour(this.endHour),o=s;o.isBefore(i);o.add(1,e)){var r={fullDate:o.format(),text:o.format(t),color:"day"!=this.periodUnit&&(new moment).isSame(o,"day")?this.todayColor:"#343434"};"week"!=this.periodUnit&&"day"!=this.periodUnit||(r.hours=this.buildDayHours(o)),this.periodDuration.push(r)}this.setDefaultWidth(),this.setTodayHourMarkerStyle()},SpiceTimeline.prototype.buildDayHours=function(e){for(var t=[],s=new moment(e).hour(this.startHour),i=new moment(e).hour(this.endHour),o=s;o.isSameOrBefore(i);o.add(1,"hours"))t.push(o.format());return t},SpiceTimeline.prototype.setRecordsEventStyle=function(){var r=this;this.records.forEach(function(e){var o={};"month"==r.periodUnit&&e.events.forEach(function(e){var t=e.start.date();o[t]||(o[t]=[]),o[t].push(e.id)}),e.events.forEach(function(e){e.style={"background-color":e.color||r.eventColor,display:"block",height:"80%",position:"absolute","border-radius":".2rem",top:"10%"};var t=(t=60*(e.start.hour()-r.startHour)+e.start.minute())<0?0:t,s=(s=60*(e.end.hour()-r.startHour)+e.end.minute())>60*r.hoursCount?60*r.hoursCount:s;switch(r.periodUnit){case"day":e.style.left=r.periodUnitWidth/60*t+"px",e.style.width=r.periodUnitWidth/60*(s-t)-1+"px";break;case"week":e.style.left=r.periodUnitWidth*e.start.day()+r.periodUnitWidth/(60*r.hoursCount)*t+"px",e.style.width=r.periodUnitWidth/(60*r.hoursCount)*(s-t)-1+"px";break;case"month":var i=e.start.date();e.style.left=r.periodUnitWidth*i+o[i].indexOf(e.id)*(r.periodUnitWidth/o[i].length)+"px",e.style.width=r.periodUnitWidth/o[i].length-1+"px"}})}),this.cdRef.detectChanges()},SpiceTimeline.prototype.setRecordsUnavailable=function(){var r=this;this.records.forEach(function(o){o.unavailable&&o.unavailable.length&&(r.recordsUnavailableTimes[o.id]={},o.unavailable.forEach(function(e){for(var t=new moment(e.from),s=new moment(e.to),i=t;i.isSameOrBefore(s);i.add(1,"hours"))r.recordsUnavailableTimes[o.id][i.format()]=!0}),r.cdRef.detectChanges())})},SpiceTimeline.prototype.setPeriodUnit=function(e){this.periodUnit=e,this.setDate(this.currentDate)},SpiceTimeline.prototype.zoomIn=function(){this.periodUnitWidth+=10,this.periodTimelineWidth+=10*this.periodDuration.length,this.setRecordsEventStyle(),this.setTodayHourMarkerStyle(),this.cdRef.detectChanges()},SpiceTimeline.prototype.zoomOut=function(){this.periodUnitWidth-=10,this.periodTimelineWidth-=10*this.periodDuration.length,this.setRecordsEventStyle(),this.setTodayHourMarkerStyle(),this.cdRef.detectChanges()},SpiceTimeline.prototype.resetZoom=function(){this.resetPeriodUnitWidth(),this.setRecordsEventStyle(),this.setTodayHourMarkerStyle(),this.cdRef.detectChanges()},SpiceTimeline.prototype.resetPeriodUnitWidth=function(){this.periodUnitWidth=this.defaultPeriodUnitWidth,this.periodTimelineWidth=this.defaultPeriodTimelineWidth},SpiceTimeline.prototype.setHeaderDateText=function(){switch(this.periodUnit){case"week":this.headerDateText=this.startDate.format("MMMM D")+" - "+this.endDate.format("MMMM D");break;case"month":this.headerDateText=this.startDate.format("MMMM YYYY");break;case"day":this.headerDateText=this.startDate.format("MMMM D")}},SpiceTimeline.prototype.setDate=function(e){switch(void 0===e&&(e=new moment),this.currentDate=new moment(e),this.periodUnit){case"day":this.startDate=new moment(e).hour(this.startHour).minute(0).second(0);break;case"week":this.startDate=new moment(e).day(0).hour(this.startHour).minute(0).second(0);break;case"month":this.startDate=new moment(e).date(1).hour(this.startHour).minute(0).second(0)}this.endDate=new moment(this.startDate).endOf(this.periodUnit).hour(this.endHour),this.buildPeriodDuration(),this.setHeaderDateText(),this.emitDateChange(),this.pickerIsOpen=!1},SpiceTimeline.prototype.toggleOpenPicker=function(){this.pickerIsOpen=!this.pickerIsOpen},SpiceTimeline.prototype.setTodayHourMarkerStyle=function(){var e=new moment;if("month"==this.periodUnit||!e.isSameOrAfter(this.startDate,"day")||!e.isSameOrBefore(this.endDate,"day"))return this.todayHourMarkerStyle={display:"none"};var t=60*(e.hour()-this.startHour)+e.minute();switch(this.todayHourMarkerStyle={width:"3px",height:"100%","z-index":"10",background:this.todayColor,position:"absolute"},this.periodUnit){case"day":this.todayHourMarkerStyle.left=this.periodUnitWidth/60*t-1.5+"px";break;case"week":this.todayHourMarkerStyle.left=this.periodUnitWidth*e.day()+this.periodUnitWidth/(60*this.hoursCount)*t-1.5+"px"}},SpiceTimeline.prototype.emitEvent=function(e,t){t&&(t.color=this.focusColor),this.focusedId=t||e.id==this.focusedId?void 0:e.id,this.eventClick.emit({record:e,event:t})},__decorate([core_1.ViewChild("contentContainer",{read:core_1.ViewContainerRef,static:!0}),__metadata("design:type",core_1.ViewContainerRef)],SpiceTimeline.prototype,"contentContainer",void 0),__decorate([core_1.Input(),__metadata("design:type",Array)],SpiceTimeline.prototype,"records",void 0),__decorate([core_1.Input(),__metadata("design:type",String)],SpiceTimeline.prototype,"recordModule",void 0),__decorate([core_1.Output(),__metadata("design:type",Object)],SpiceTimeline.prototype,"dateChange",void 0),__decorate([core_1.Output(),__metadata("design:type",Object)],SpiceTimeline.prototype,"eventClick",void 0),__decorate([core_1.Component({selector:"spice-timeline",template:'<div class="slds-grid slds-grid--vertical slds-height_full slds-size--1-of-1 slds-theme--default"><div class="slds-grid slds-size--1-of-1 slds-page-header" style="border-bottom-left-radius: 0; border-bottom-right-radius: 0; padding: .5rem;"><div class="slds-col slds-grid"><div class="slds-dropdown-trigger slds-dropdown-trigger--click slds-m-left--xx-small" [class.slds-is-open]="pickerIsOpen"><button class="slds-button slds-button--icon-border" (click)="toggleOpenPicker()"><system-utility-icon icon="event" size="x-small"></system-utility-icon></button><div class="slds-dropdown slds-dropdown_left"><system-input-date-picker [setDate]="currentDate" [weekStartDay]="0" (datePicked)="setDate($event)"></system-input-date-picker></div></div><div class="slds-page-header__title slds-m-horizontal--x-small slds-align-middle slds-truncate">{{headerDateText}}</div></div><button *ngIf="periodUnit !== \'month\'" (click)="toggleOnlyWorkingHours()" [disabled]="!onlyWorkingHoursEnabled" [class.slds-button--brand]="onlyWorkingHours" system-title="LBL_ONLY_WORKING_HOURS" class="slds-button slds-button--icon-border slds-m-left--xx-small" style="height: 32px;padding: 0;width: 32px;"><system-button-icon icon="clock" size="medium"></system-button-icon></button><div class="slds-button-group" role="group"><button class="slds-button slds-button--icon-border" (click)="shiftDate(\'subtract\')"><system-button-icon icon="chevronleft"></system-button-icon></button> <button class="slds-button slds-button--icon-border" (click)="shiftDate(\'add\')"><system-button-icon icon="chevronright"></system-button-icon></button></div><div class="slds-button-group slds-m-left--x-small" role="group"><button class="slds-button slds-button--icon-border" (click)="zoomOut()" [disabled]="periodUnitWidth <= 30"><system-button-icon [icon]="\'zoomout\'"></system-button-icon></button> <button class="slds-button slds-button--icon-border" (click)="resetZoom()" [disabled]="periodUnitWidth == defaultPeriodUnitWidth"><system-button-icon [icon]="\'undo\'"></system-button-icon></button> <button class="slds-button slds-button--icon-border" (click)="zoomIn()" [disabled]="periodUnitWidth >= 400"><system-button-icon [icon]="\'zoomin\'"></system-button-icon></button></div><div class="slds-dropdown-trigger slds-dropdown-trigger--click slds-m-left--xx-small" system-dropdown-trigger><button class="slds-button slds-button--neutral slds-p-horizontal--x-small"><system-label [label]="\'LBL_\'+ periodUnit|uppercase"></system-label><system-button-icon [icon]="\'down\'"></system-button-icon></button><div class="slds-dropdown slds-dropdown--right slds-dropdown--x-small"><ul class="slds-dropdown__list" role="menu"><li class="slds-dropdown__item" role="presentation"><a href="javascript:void(0);" role="menuitem" (click)="setPeriodUnit(\'day\')"><span class="slds-truncate"><system-label label="LBL_DAY"></system-label></span></a></li><li class="slds-dropdown__item" role="presentation" (click)="setPeriodUnit(\'week\')"><a href="javascript:void(0);" role="menuitem"><span class="slds-truncate"><system-label label="LBL_WEEK"></system-label></span></a></li><li class="slds-dropdown__item" role="presentation" (click)="setPeriodUnit(\'month\')"><a href="javascript:void(0);" role="menuitem"><span class="slds-truncate"><system-label label="LBL_MONTH"></system-label></span></a></li></ul></div></div></div><div #contentContainer class="slds-grid slds-grow slds-scrollable" style="width: 100%; min-height: 0"><div class="slds-grid slds-grid--vertical slds-theme--default" style="position: sticky; left: 0; z-index: 21" [ngStyle]="{width: periodDataWidth +\'px\', \'min-width\': periodDataWidth +\'px\'}"><div [style.height.px]="eventHeight" class="slds-border--bottom slds-border--right slds-grid slds-theme--default" style="top: 0; z-index: 20; position: sticky"><div style="width: 30px"></div><div *ngFor="let headerField of headerFields; let first = first" [style.width.%]="100 / headerFields.length" [class.slds-border--left]="!first" class="slds-p-around--xx-small slds-truncate">{{headerField}}</div></div><div><div *ngFor="let record of records; trackBy: trackByItemFn" class="slds-grid slds-size--1-of-1 slds-border--bottom" [style.height.px]="eventHeight"><div [style.height.px]="eventHeight" [style.background-color]="focusedId == record.id ? focusColor : \'initial\'" class="slds-border--right slds-size--1-of-1 slds-grid slds-grid--vertical-align-center"><div class="slds-p-left--xx-small" style="width: 30px"><system-checkbox [ngModel]="focusedId == record.id" (ngModelChange)="emitEvent(record)" [value]="record.id" class="slds-align--absolute-center"></system-checkbox></div><div *ngIf="recordFieldsetFields?.length > 0; else summaryTemplate" [system-model-provider]="{id: record.id, module: recordModule, data: record}" class="slds-grid slds-height_full"><field-container *ngFor="let recordFieldsetField of recordFieldsetFields" [field]="recordFieldsetField.field" [fieldconfig]="recordFieldsetField.fieldconfig" [style.width.%]="100 / headerFields.length" class="slds-border--left spice-timeline-record-row-data"></field-container></div><ng-template #summaryTemplate><span system-model-popover module="Users" [id]="record.id" class="slds-text-link--reset slds-p-horizontal--xx-small">{{record.name}}</span></ng-template></div></div></div></div><div class="slds-grid slds-grid--vertical" [style.width.px]="periodTimelineWidth"><div class="slds-grid slds-border--bottom slds-size--1-of-1 slds-theme--default" [style.height.px]="eventHeight" style="top: 0; z-index: 20; position: sticky"><div *ngFor="let part of periodDuration; trackBy: trackByIndexFn" [system-title]="part.text" [ngStyle]="{width: periodUnitWidth +\'px\', color: part.color}" class="slds-border--right slds-p-around--xx-small slds-truncate slds-height_full">{{part.text}}</div></div><div class="slds-is-relative"><div [ngStyle]="todayHourMarkerStyle"></div><div *ngFor="let record of records; trackBy: trackByItemFn" [style.background-color]="focusedId == record.id ? focusColor : \'initial\'" [style.height.px]="eventHeight" class="slds-grid slds-border--bottom slds-size--1-of-1 slds-is-relative slds-text-color--inverse"><div *ngFor="let part of periodDuration; trackBy: trackByIndexFn" [style.width.px]="periodUnitWidth" [class.slds-theme--shade]="periodUnit === \'day\' && recordsUnavailableTimes[record.id] && recordsUnavailableTimes[record.id][part.fullDate]" class="slds-border--right slds-height_full slds-grid"><ng-container *ngIf="periodUnit === \'week\' && recordsUnavailableTimes[record.id]"><div *ngFor="let hour of part.hours; trackBy: trackByIndexFn" [style.width.%]="100 / part.hours.length" [class.slds-theme--shade]="recordsUnavailableTimes[record.id][hour]" class="slds-height_full"></div></ng-container></div><spice-timeline-event *ngFor="let event of record.events; trackBy: trackByItemFn" [event]="event" [ngStyle]="event.style" (click)="emitEvent(record, event)" class="slds-truncate slds-p-around--xx-small"></spice-timeline-event></div></div></div></div></div>',changeDetection:core_1.ChangeDetectionStrategy.OnPush}),__metadata("design:paramtypes",[core_1.Renderer2,core_1.ChangeDetectorRef,services_1.language,services_1.broadcast,services_1.userpreferences,services_1.metadata])],SpiceTimeline)}();exports.SpiceTimeline=SpiceTimeline;var SpiceTimelineEvent=function(){function SpiceTimelineEvent(e,t){this.metadata=e,this.model=t}return SpiceTimelineEvent.prototype.ngOnInit=function(){this.loadFieldset()},SpiceTimelineEvent.prototype.ngOnChanges=function(){this.setModelData()},SpiceTimelineEvent.prototype.loadFieldset=function(){var e=this.metadata.getComponentConfig("SpiceTimelineEvent",this.model.module);e&&e.fieldset&&(this.fieldset=e.fieldset)},SpiceTimelineEvent.prototype.setModelData=function(){this.model.id=this.event.id,this.model.module=this.event.module,this.model.data=this.model.utils.backendModel2spice(this.model.module,this.event.data)},__decorate([core_1.Input(),__metadata("design:type",Object)],SpiceTimelineEvent.prototype,"event",void 0),__decorate([core_1.Component({selector:"spice-timeline-event",template:'<object-record-fieldset-horizontal-list *ngIf="!!fieldset; else summaryContainer" [fieldset]="fieldset"></object-record-fieldset-horizontal-list><ng-template #summaryContainer><span system-model-popover [enablelink]="false" class="slds-text-link--reset">{{event.data.summary_text}}</span></ng-template>',providers:[services_1.model]}),__metadata("design:paramtypes",[services_1.metadata,services_1.model])],SpiceTimelineEvent)}();exports.SpiceTimelineEvent=SpiceTimelineEvent;var ModuleSpiceTimeline=function(){function ModuleSpiceTimeline(){}return __decorate([core_1.NgModule({imports:[common_1.CommonModule,forms_1.FormsModule,objectfields_1.ObjectFields,globalcomponents_1.GlobalComponents,objectcomponents_1.ObjectComponents,systemcomponents_1.SystemComponents,directives_1.DirectivesModule],declarations:[SpiceTimeline,SpiceTimelineEvent],exports:[SpiceTimeline]})],ModuleSpiceTimeline)}();exports.ModuleSpiceTimeline=ModuleSpiceTimeline;