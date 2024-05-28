/*!
 * 
 *                     SpiceCRM
 *
 *                     release: 2024.01.001
 *
 *                     date: 2024-05-28 17:40:40
 *
 *                     build: 2024.01.001.1716910840504
 *
 */
"use strict";(self.webpackChunkcore=self.webpackChunkcore||[]).push([["src_include_spicetimeline_spicetimeline_ts"],{48146:(t,e,i)=>{i.r(e),i.d(e,{ModuleSpiceTimeline:()=>A});var s=i(60177),n=i(84341),r=i(71341),o=i(7745),d=i(12948),l=i(37328),a=i(70569),h=i(54438),c=i(18359),u=i(69904),m=i(40553),p=i(48849),f=i(83935),g=i(15091),b=i(25863),y=i(84359),k=i(1626),v=i(32062),D=i(18521),x=i(33325),w=i(98427),F=i(80256),U=i(22465),T=i(35911),C=i(29895);function R(t,e){if(1&t&&h.nrm(0,"object-record-fieldset-horizontal-list",2),2&t){const t=h.XpG();h.Y8G("fieldset",t.fieldset)}}function S(t,e){if(1&t&&(h.j41(0,"span",3),h.EFF(1),h.k0s()),2&t){const t=h.XpG();h.Y8G("enablelink",!1),h.R7$(),h.JRh(t.event.data.summary_text)}}let H=(()=>{class SpiceTimelineEvent{constructor(t,e){this.metadata=t,this.model=e}ngOnInit(){this.loadFieldset()}ngOnChanges(){this.setModelData()}loadFieldset(){let t=this.metadata.getComponentConfig("SpiceTimelineEvent",this.model.module);t&&t.fieldset&&(this.fieldset=t.fieldset)}setModelData(){this.model.id=this.event.id,this.model.module=this.event.module,this.model.setData(this.event.data)}static#t=this.ɵfac=function(t){return new(t||SpiceTimelineEvent)(h.rXU(f.yu),h.rXU(T.g))};static#e=this.ɵcmp=h.VBU({type:SpiceTimelineEvent,selectors:[["spice-timeline-event"]],inputs:{event:"event"},features:[h.Jv_([T.g]),h.OA$],decls:3,vars:2,consts:[[3,"fieldset",4,"ngIf","ngIfElse"],["summaryContainer",""],[3,"fieldset"],["system-model-popover","",1,"slds-text-link--reset",3,"enablelink"]],template:function(t,e){if(1&t&&h.DNE(0,R,1,1,"object-record-fieldset-horizontal-list",0)(1,S,2,2,"ng-template",null,1,h.C5r),2&t){const t=h.sdS(2);h.Y8G("ngIf",!!e.fieldset)("ngIfElse",t)}},dependencies:[s.bT,C.b,x.j],encapsulation:2})}return SpiceTimelineEvent})();const G=["contentContainer"];function I(t,e){if(1&t){const t=h.RV6();h.j41(0,"button",42),h.bIt("click",(function(){h.eBV(t);const e=h.XpG();return h.Njj(e.toggleOnlyWorkingHours())})),h.nrm(1,"system-button-icon",43),h.k0s()}if(2&t){const t=h.XpG();h.AVh("slds-button--brand",t.onlyWorkingHours),h.Y8G("disabled",!t.onlyWorkingHoursEnabled)}}function W(t,e){if(1&t&&(h.j41(0,"div",44),h.EFF(1),h.k0s()),2&t){const t=e.$implicit,i=e.first,s=h.XpG();h.xc7("width",100/s.headerFields.length,"%"),h.AVh("slds-border--left",!i),h.R7$(),h.SpI(" ",t," ")}}function M(t,e){if(1&t&&h.nrm(0,"field-container",53),2&t){const t=e.$implicit,i=h.XpG(3);h.xc7("width",100/i.headerFields.length,"%"),h.Y8G("field",t.field)("fieldconfig",t.fieldconfig)}}const $=(t,e,i)=>({id:t,module:e,data:i});function _(t,e){if(1&t&&(h.j41(0,"div",51),h.DNE(1,M,1,4,"field-container",52),h.k0s()),2&t){const t=h.XpG().$implicit,e=h.XpG();h.Y8G("system-model-provider",h.sMw(2,$,t.id,e.recordModule,t)),h.R7$(),h.Y8G("ngForOf",e.recordFieldsetFields)}}function O(t,e){if(1&t&&(h.j41(0,"span",54),h.EFF(1),h.k0s()),2&t){const t=h.XpG().$implicit;h.Y8G("id",t.id),h.R7$(),h.JRh(t.name)}}function E(t,e){if(1&t){const t=h.RV6();h.j41(0,"div",45)(1,"div",46)(2,"div",47)(3,"system-checkbox",48),h.bIt("ngModelChange",(function(){const e=h.eBV(t).$implicit,i=h.XpG();return h.Njj(i.emitEvent(e))})),h.k0s()(),h.DNE(4,_,2,6,"div",49)(5,O,2,2,"ng-template",null,50,h.C5r),h.k0s()()}if(2&t){const t=e.$implicit,i=h.sdS(6),s=h.XpG();h.xc7("height",s.eventHeight,"px"),h.R7$(),h.xc7("height",s.eventHeight,"px")("background-color",s.focusedId==t.id?s.focusColor:"initial"),h.R7$(2),h.Y8G("ngModel",s.focusedId==t.id)("value",t.id),h.R7$(),h.Y8G("ngIf",(null==s.recordFieldsetFields?null:s.recordFieldsetFields.length)>0)("ngIfElse",i)}}const j=(t,e)=>({width:t,color:e});function B(t,e){if(1&t&&(h.j41(0,"div",55),h.EFF(1),h.k0s()),2&t){const t=e.$implicit,i=h.XpG();h.Y8G("system-title",t.text)("ngStyle",h.l_i(3,j,i.periodUnitWidth+"px",t.color)),h.R7$(),h.SpI(" ",t.text," ")}}function Y(t,e){if(1&t&&h.nrm(0,"div",62),2&t){const t=e.$implicit,i=h.XpG(2).$implicit,s=h.XpG().$implicit,n=h.XpG();h.xc7("width",100/i.hours.length,"%"),h.AVh("slds-theme--shade",n.recordsUnavailableTimes[s.id][t])}}function z(t,e){if(1&t&&(h.qex(0),h.DNE(1,Y,1,4,"div",61),h.bVm()),2&t){const t=h.XpG().$implicit,e=h.XpG(2);h.R7$(),h.Y8G("ngForOf",t.hours)("ngForTrackBy",e.trackByIndexFn)}}function X(t,e){if(1&t&&(h.j41(0,"div",59),h.DNE(1,z,2,2,"ng-container",60),h.k0s()),2&t){const t=e.$implicit,i=h.XpG().$implicit,s=h.XpG();h.xc7("width",s.periodUnitWidth,"px"),h.AVh("slds-theme--shade","day"===s.periodUnit&&s.recordsUnavailableTimes[i.id]&&s.recordsUnavailableTimes[i.id][t.fullDate]),h.R7$(),h.Y8G("ngIf","week"===s.periodUnit&&s.recordsUnavailableTimes[i.id])}}function P(t,e){if(1&t){const t=h.RV6();h.j41(0,"spice-timeline-event",63),h.bIt("click",(function(){const e=h.eBV(t).$implicit,i=h.XpG().$implicit,s=h.XpG();return h.Njj(s.emitEvent(i,e))})),h.k0s()}if(2&t){const t=e.$implicit;h.Y8G("event",t)("ngStyle",t.style)}}function N(t,e){if(1&t&&(h.j41(0,"div",56),h.DNE(1,X,2,5,"div",57)(2,P,1,2,"spice-timeline-event",58),h.k0s()),2&t){const t=e.$implicit,i=h.XpG();h.xc7("background-color",i.focusedId==t.id?i.focusColor:"initial")("height",i.eventHeight,"px"),h.R7$(),h.Y8G("ngForOf",i.periodDuration)("ngForTrackBy",i.trackByIndexFn),h.R7$(),h.Y8G("ngForOf",t.events)("ngForTrackBy",i.trackByItemFn)}}const L=(t,e)=>({width:t,"min-width":e});let V=(()=>{class SpiceTimeline{constructor(t,e,i,s,n,r){this.renderer=t,this.cdRef=e,this.language=i,this.broadcast=s,this.userpreferences=n,this.metadata=r,this.focusColor="#ffc700",this.todayColor="#eb7092",this.defaultPeriodUnitWidth=50,this.defaultPeriodTimelineWidth=250,this.periodUnitWidth=50,this.periodTimelineWidth=250,this.periodDataWidth=250,this.periodDuration=[],this.records=[],this.headerFields=["name"],this.recordFieldsetFields=[],this.dateChange=new h.bkB,this.eventClick=new h.bkB,this.periodUnit="day",this.headerDateText="",this.eventColor="#039be5",this.eventHeight=25,this.startHour=0,this.endHour=23,this.hoursCount=24,this.pickerIsOpen=!1,this.currentDate=moment(),this.endDate=moment(),this.startDate=moment(),this.recordsUnavailableTimes={},this.onlyWorkingHoursEnabled=!1,this.onlyWorkingHours=!1,this.subscriptions=new c.yU,this.loadFieldset()}ngOnChanges(t){t.recordModule&&this.loadFieldset(),t.records&&(this.setRecordsEventStyle(),this.setRecordsUnavailable())}ngAfterViewInit(){this.setOnlyWorkingHoursEnabled(),this.setDate(),this.addResizeListener(),this.addTodayHourInterval(),this.subscribeToChanges()}ngOnDestroy(){this.todayMarkerHourInterval&&window.clearInterval(this.todayMarkerHourInterval),this.subscriptions.unsubscribe()}trackByItemFn(t,e){return e.id}subscribeToChanges(){this.subscriptions.add(this.broadcast.message$.subscribe((t=>{"timezone.changed"===t.messagetype&&(this.setTodayHourMarkerStyle(),this.setRecordsEventStyle(),this.cdRef.detectChanges())})))}shiftDate(t){this.startDate=new moment(this.startDate[t](moment.duration(1,this.periodUnit+"s"))),this.endDate=new moment(this.endDate[t](moment.duration(1,this.periodUnit+"s"))),this.buildPeriodDuration(),this.setHeaderDateText(),this.emitDateChange(),this.cdRef.detectChanges()}addTodayHourInterval(){this.todayMarkerHourInterval=window.setInterval((()=>{this.setTodayHourMarkerStyle(),this.cdRef.detectChanges()}),6e4)}toggleOnlyWorkingHours(){this.onlyWorkingHours=!this.onlyWorkingHours,this.startHour=this.onlyWorkingHours?+this.userpreferences.toUse.calendar_day_start_hour:0,this.endHour=this.onlyWorkingHours?+this.userpreferences.toUse.calendar_day_end_hour-1:23,this.hoursCount=this.endHour-this.startHour,this.setDate(),this.buildPeriodDuration(),this.setTodayHourMarkerStyle()}setOnlyWorkingHoursEnabled(){const t=this.userpreferences.toUse.calendar_day_start_hour,e=this.userpreferences.toUse.calendar_day_end_hour;t&&0!=t&&e&&23!=e&&(this.onlyWorkingHoursEnabled=!0)}addResizeListener(){this.resizeListener=this.renderer.listen("window","resize",(()=>this.setDefaultWidth()))}setDefaultWidth(){const t=this.contentContainer.element.nativeElement.getBoundingClientRect().width;this.periodDataWidth=.25*t,this.defaultPeriodTimelineWidth=.75*t,this.defaultPeriodUnitWidth=(this.defaultPeriodTimelineWidth-1)/this.periodDuration.length,this.resetPeriodUnitWidth(),this.cdRef.detectChanges()}emitDateChange(){this.dateChange.emit({start:new moment(this.startDate.format()),end:new moment(this.endDate.format())})}loadFieldset(){let t=this.metadata.getComponentConfig("SpiceTimeline",this.recordModule);if(!t||!t.recordFieldset)return;const e=this.metadata.getFieldSetFields(t.recordFieldset);e&&(this.recordFieldsetFields=e,this.headerFields=e.map((t=>this.language.getFieldDisplayName(this.recordModule,t.field))))}trackByIndexFn(t,e){return t}buildPeriodDuration(){this.periodDuration=[];let t,e,i=new moment(this.startDate).hour(this.startHour);switch(this.periodUnit){case"day":t="hours",e="H:00";break;case"week":i=new moment(this.startDate).day(0),t="days",e="ddd D";break;case"month":i=new moment(this.startDate).date(1),t="days",e="D"}const s=new moment(i).endOf(this.periodUnit).hour(this.endHour);for(let n=i;n.isBefore(s);n.add(1,t)){const t={fullDate:n.format(),text:n.format(e),color:"day"!=this.periodUnit&&(new moment).isSame(n,"day")?this.todayColor:"#343434"};"week"!=this.periodUnit&&"day"!=this.periodUnit||(t.hours=this.buildDayHours(n)),this.periodDuration.push(t)}this.setDefaultWidth(),this.setTodayHourMarkerStyle()}buildDayHours(t){const e=[],i=new moment(t).hour(this.startHour),s=new moment(t).hour(this.endHour);for(let t=i;t.isSameOrBefore(s);t.add(1,"hours"))e.push(t.format());return e}setRecordsEventStyle(){this.records.forEach((t=>{const e={};"month"==this.periodUnit&&t.events.forEach((t=>{const i=t.start.date();e[i]||(e[i]=[]),e[i].push(t.id)})),t.events.forEach((t=>{t.style={"background-color":t.color||this.eventColor,display:"block",height:"80%",position:"absolute","border-radius":".2rem",top:"10%"};let i=60*(t.start.hour()-this.startHour)+t.start.minute();i=i<0?0:i;let s=60*(t.end.hour()-this.startHour)+t.end.minute();switch(s=s>60*this.hoursCount?60*this.hoursCount:s,this.periodUnit){case"day":t.style.left=this.periodUnitWidth/60*i+"px",t.style.width=this.periodUnitWidth/60*(s-i)-1+"px";break;case"week":t.style.left=this.periodUnitWidth*t.start.day()+this.periodUnitWidth/(60*this.hoursCount)*i+"px",t.style.width=this.periodUnitWidth/(60*this.hoursCount)*(s-i)-1+"px";break;case"month":const n=t.start.date();t.style.left=this.periodUnitWidth*n+e[n].indexOf(t.id)*(this.periodUnitWidth/e[n].length)+"px",t.style.width=this.periodUnitWidth/e[n].length-1+"px"}}))})),this.cdRef.detectChanges()}setRecordsUnavailable(){this.records.forEach((t=>{t.unavailable&&t.unavailable.length&&(this.recordsUnavailableTimes[t.id]={},t.unavailable.forEach((e=>{const i=new moment(e.from),s=new moment(e.to);for(let e=i;e.isSameOrBefore(s);e.add(1,"hours"))this.recordsUnavailableTimes[t.id][e.format()]=!0})),this.cdRef.detectChanges())}))}setPeriodUnit(t){this.periodUnit=t,this.setDate(this.currentDate)}zoomIn(){this.periodUnitWidth+=10,this.periodTimelineWidth+=10*this.periodDuration.length,this.setRecordsEventStyle(),this.setTodayHourMarkerStyle(),this.cdRef.detectChanges()}zoomOut(){this.periodUnitWidth-=10,this.periodTimelineWidth-=10*this.periodDuration.length,this.setRecordsEventStyle(),this.setTodayHourMarkerStyle(),this.cdRef.detectChanges()}resetZoom(){this.resetPeriodUnitWidth(),this.setRecordsEventStyle(),this.setTodayHourMarkerStyle(),this.cdRef.detectChanges()}resetPeriodUnitWidth(){this.periodUnitWidth=this.defaultPeriodUnitWidth,this.periodTimelineWidth=this.defaultPeriodTimelineWidth}setHeaderDateText(){switch(this.periodUnit){case"week":this.headerDateText=`${this.startDate.format("MMMM D")} - ${this.endDate.format("MMMM D")}`;break;case"month":this.headerDateText=this.startDate.format("MMMM YYYY");break;case"day":this.headerDateText=this.startDate.format("MMMM D")}}setDate(t=new moment){switch(this.currentDate=new moment(t),this.periodUnit){case"day":this.startDate=new moment(t).hour(this.startHour).minute(0).second(0);break;case"week":this.startDate=new moment(t).day(0).hour(this.startHour).minute(0).second(0);break;case"month":this.startDate=new moment(t).date(1).hour(this.startHour).minute(0).second(0)}this.endDate=new moment(this.startDate).endOf(this.periodUnit).hour(this.endHour),this.buildPeriodDuration(),this.setHeaderDateText(),this.emitDateChange(),this.pickerIsOpen=!1}toggleOpenPicker(){this.pickerIsOpen=!this.pickerIsOpen}setTodayHourMarkerStyle(){const t=new moment;if("month"==this.periodUnit||!t.isSameOrAfter(this.startDate,"day")||!t.isSameOrBefore(this.endDate,"day"))return this.todayHourMarkerStyle={display:"none"};const e=60*(t.hour()-this.startHour)+t.minute();switch(this.todayHourMarkerStyle={width:"3px",height:"100%","z-index":"10",background:this.todayColor,position:"absolute"},this.periodUnit){case"day":this.todayHourMarkerStyle.left=this.periodUnitWidth/60*e-1.5+"px";break;case"week":this.todayHourMarkerStyle.left=this.periodUnitWidth*t.day()+this.periodUnitWidth/(60*this.hoursCount)*e-1.5+"px"}}emitEvent(t,e){e&&(e.color=this.focusColor),this.focusedId=e||t.id==this.focusedId?void 0:t.id,this.eventClick.emit({record:t,event:e})}static#t=this.ɵfac=function(t){return new(t||SpiceTimeline)(h.rXU(h.sFG),h.rXU(h.gRc),h.rXU(u.B),h.rXU(m.m),h.rXU(p.S),h.rXU(f.yu))};static#e=this.ɵcmp=h.VBU({type:SpiceTimeline,selectors:[["spice-timeline"]],viewQuery:function(t,e){if(1&t&&h.GBs(G,7,h.c1b),2&t){let t;h.mGM(t=h.lsd())&&(e.contentContainer=t.first)}},inputs:{records:"records",recordModule:"recordModule"},outputs:{dateChange:"dateChange",eventClick:"eventClick"},features:[h.OA$],decls:56,vars:34,consts:[[1,"slds-grid","slds-grid--vertical","slds-height_full","slds-size--1-of-1","slds-theme--default"],[1,"slds-grid","slds-size--1-of-1","slds-page-header",2,"border-bottom-left-radius","0","border-bottom-right-radius","0","padding",".5rem"],[1,"slds-col","slds-grid"],[1,"slds-dropdown-trigger","slds-dropdown-trigger--click","slds-m-left--xx-small"],[1,"slds-button","slds-button--icon-border",3,"click"],["icon","event","size","x-small"],[1,"slds-dropdown","slds-dropdown_left"],[3,"setDate","weekStartDay","datePicked"],[1,"slds-page-header__title","slds-m-horizontal--x-small","slds-align-middle","slds-truncate"],["system-title","LBL_ONLY_WORKING_HOURS","class","slds-button slds-button--icon-border slds-m-left--xx-small","style","height: 32px;padding: 0;width: 32px;",3,"disabled","slds-button--brand","click",4,"ngIf"],["role","group",1,"slds-button-group"],["icon","chevronleft"],["icon","chevronright"],["role","group",1,"slds-button-group","slds-m-left--x-small"],[1,"slds-button","slds-button--icon-border",3,"disabled","click"],[3,"icon"],["system-dropdown-trigger","",1,"slds-dropdown-trigger","slds-dropdown-trigger--click","slds-m-left--xx-small"],[1,"slds-button","slds-button--neutral","slds-p-horizontal--x-small"],[3,"label"],[1,"slds-dropdown","slds-dropdown--right","slds-dropdown--x-small"],["role","menu",1,"slds-dropdown__list"],["role","presentation",1,"slds-dropdown__item"],["href","javascript:void(0);","role","menuitem",3,"click"],[1,"slds-truncate"],["label","LBL_DAY"],["role","presentation",1,"slds-dropdown__item",3,"click"],["href","javascript:void(0);","role","menuitem"],["label","LBL_WEEK"],["label","LBL_MONTH"],[1,"slds-grid","slds-grow","slds-scrollable",2,"width","100%","min-height","0"],["contentContainer",""],[1,"slds-grid","slds-grid--vertical","slds-theme--default",2,"position","sticky","left","0","z-index","21",3,"ngStyle"],[1,"slds-border--bottom","slds-border--right","slds-grid","slds-theme--default",2,"top","0","z-index","20","position","sticky"],[2,"width","30px"],["class","slds-p-around--xx-small slds-truncate",3,"width","slds-border--left",4,"ngFor","ngForOf"],["class","slds-grid slds-size--1-of-1 slds-border--bottom",3,"height",4,"ngFor","ngForOf","ngForTrackBy"],[1,"slds-grid","slds-grid--vertical"],[1,"slds-grid","slds-border--bottom","slds-size--1-of-1","slds-theme--default",2,"top","0","z-index","20","position","sticky"],["class","slds-border--right slds-p-around--xx-small slds-truncate slds-height_full",3,"system-title","ngStyle",4,"ngFor","ngForOf","ngForTrackBy"],[1,"slds-is-relative"],[3,"ngStyle"],["class","slds-grid slds-border--bottom slds-size--1-of-1 slds-is-relative slds-text-color--inverse",3,"background-color","height",4,"ngFor","ngForOf","ngForTrackBy"],["system-title","LBL_ONLY_WORKING_HOURS",1,"slds-button","slds-button--icon-border","slds-m-left--xx-small",2,"height","32px","padding","0","width","32px",3,"disabled","click"],["icon","clock","size","medium"],[1,"slds-p-around--xx-small","slds-truncate"],[1,"slds-grid","slds-size--1-of-1","slds-border--bottom"],[1,"slds-border--right","slds-size--1-of-1","slds-grid","slds-grid--vertical-align-center"],[1,"slds-p-left--xx-small",2,"width","30px"],[1,"slds-align--absolute-center",3,"ngModel","value","ngModelChange"],["class","slds-grid slds-height_full",3,"system-model-provider",4,"ngIf","ngIfElse"],["summaryTemplate",""],[1,"slds-grid","slds-height_full",3,"system-model-provider"],["class","slds-border--left spice-timeline-record-row-data",3,"field","fieldconfig","width",4,"ngFor","ngForOf"],[1,"slds-border--left","spice-timeline-record-row-data",3,"field","fieldconfig"],["system-model-popover","","module","Users",1,"slds-text-link--reset","slds-p-horizontal--xx-small",3,"id"],[1,"slds-border--right","slds-p-around--xx-small","slds-truncate","slds-height_full",3,"system-title","ngStyle"],[1,"slds-grid","slds-border--bottom","slds-size--1-of-1","slds-is-relative","slds-text-color--inverse"],["class","slds-border--right slds-height_full slds-grid",3,"width","slds-theme--shade",4,"ngFor","ngForOf","ngForTrackBy"],["class","slds-truncate slds-p-around--xx-small",3,"event","ngStyle","click",4,"ngFor","ngForOf","ngForTrackBy"],[1,"slds-border--right","slds-height_full","slds-grid"],[4,"ngIf"],["class","slds-height_full",3,"width","slds-theme--shade",4,"ngFor","ngForOf","ngForTrackBy"],[1,"slds-height_full"],[1,"slds-truncate","slds-p-around--xx-small",3,"event","ngStyle","click"]],template:function(t,e){1&t&&(h.j41(0,"div",0)(1,"div",1)(2,"div",2)(3,"div",3)(4,"button",4),h.bIt("click",(function(){return e.toggleOpenPicker()})),h.nrm(5,"system-utility-icon",5),h.k0s(),h.j41(6,"div",6)(7,"system-input-date-picker",7),h.bIt("datePicked",(function(t){return e.setDate(t)})),h.k0s()()(),h.j41(8,"div",8),h.EFF(9),h.k0s()(),h.DNE(10,I,2,3,"button",9),h.j41(11,"div",10)(12,"button",4),h.bIt("click",(function(){return e.shiftDate("subtract")})),h.nrm(13,"system-button-icon",11),h.k0s(),h.j41(14,"button",4),h.bIt("click",(function(){return e.shiftDate("add")})),h.nrm(15,"system-button-icon",12),h.k0s()(),h.j41(16,"div",13)(17,"button",14),h.bIt("click",(function(){return e.zoomOut()})),h.nrm(18,"system-button-icon",15),h.k0s(),h.j41(19,"button",14),h.bIt("click",(function(){return e.resetZoom()})),h.nrm(20,"system-button-icon",15),h.k0s(),h.j41(21,"button",14),h.bIt("click",(function(){return e.zoomIn()})),h.nrm(22,"system-button-icon",15),h.k0s()(),h.j41(23,"div",16)(24,"button",17),h.nrm(25,"system-label",18),h.nI1(26,"uppercase"),h.nrm(27,"system-button-icon",15),h.k0s(),h.j41(28,"div",19)(29,"ul",20)(30,"li",21)(31,"a",22),h.bIt("click",(function(){return e.setPeriodUnit("day")})),h.j41(32,"span",23),h.nrm(33,"system-label",24),h.k0s()()(),h.j41(34,"li",25),h.bIt("click",(function(){return e.setPeriodUnit("week")})),h.j41(35,"a",26)(36,"span",23),h.nrm(37,"system-label",27),h.k0s()()(),h.j41(38,"li",25),h.bIt("click",(function(){return e.setPeriodUnit("month")})),h.j41(39,"a",26)(40,"span",23),h.nrm(41,"system-label",28),h.k0s()()()()()()(),h.j41(42,"div",29,30)(44,"div",31)(45,"div",32),h.nrm(46,"div",33),h.DNE(47,W,2,5,"div",34),h.k0s(),h.j41(48,"div"),h.DNE(49,E,7,10,"div",35),h.k0s()(),h.j41(50,"div",36)(51,"div",37),h.DNE(52,B,2,6,"div",38),h.k0s(),h.j41(53,"div",39),h.nrm(54,"div",40),h.DNE(55,N,3,8,"div",41),h.k0s()()()()),2&t&&(h.R7$(3),h.AVh("slds-is-open",e.pickerIsOpen),h.R7$(4),h.Y8G("setDate",e.currentDate)("weekStartDay",0),h.R7$(2),h.SpI(" ",e.headerDateText," "),h.R7$(),h.Y8G("ngIf","month"!==e.periodUnit),h.R7$(7),h.Y8G("disabled",e.periodUnitWidth<=30),h.R7$(),h.Y8G("icon","zoomout"),h.R7$(),h.Y8G("disabled",e.periodUnitWidth==e.defaultPeriodUnitWidth),h.R7$(),h.Y8G("icon","undo"),h.R7$(),h.Y8G("disabled",e.periodUnitWidth>=400),h.R7$(),h.Y8G("icon","zoomin"),h.R7$(3),h.Y8G("label",h.bMT(26,29,"LBL_"+e.periodUnit)),h.R7$(2),h.Y8G("icon","down"),h.R7$(17),h.Y8G("ngStyle",h.l_i(31,L,e.periodDataWidth+"px",e.periodDataWidth+"px")),h.R7$(),h.xc7("height",e.eventHeight,"px"),h.R7$(2),h.Y8G("ngForOf",e.headerFields),h.R7$(2),h.Y8G("ngForOf",e.records)("ngForTrackBy",e.trackByItemFn),h.R7$(),h.xc7("width",e.periodTimelineWidth,"px"),h.R7$(),h.xc7("height",e.eventHeight,"px"),h.R7$(),h.Y8G("ngForOf",e.periodDuration)("ngForTrackBy",e.trackByIndexFn),h.R7$(2),h.Y8G("ngStyle",e.todayHourMarkerStyle),h.R7$(),h.Y8G("ngForOf",e.records)("ngForTrackBy",e.trackByItemFn))},dependencies:[s.Sq,s.bT,s.B3,n.BC,n.vS,g.y,b.t,y.f,k.Q,v.W,D.B,x.j,w.v,F.q,U.L,H,s.Pc],encapsulation:2,changeDetection:0})}return SpiceTimeline})(),A=(()=>{class ModuleSpiceTimeline{static#t=this.ɵfac=function(t){return new(t||ModuleSpiceTimeline)};static#e=this.ɵmod=h.$C({type:ModuleSpiceTimeline});static#i=this.ɵinj=h.G2t({imports:[s.MD,n.YN,o.ObjectFields,d.GlobalComponents,l.ObjectComponents,a.SystemComponents,r.h]})}return ModuleSpiceTimeline})();("undefined"==typeof ngJitMode||ngJitMode)&&h.Obh(A,{declarations:[V,H],imports:[s.MD,n.YN,o.ObjectFields,d.GlobalComponents,l.ObjectComponents,a.SystemComponents,r.h],exports:[V]})}}]);