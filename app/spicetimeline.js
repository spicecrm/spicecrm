/*!
 * 
 *                     aacService
 *
 *                     release: 2023.01.001
 *
 *                     date: 2023-05-30 13:31:03
 *
 *                     build: 2023.01.001.1685446263677
 *
 */
"use strict";(self.webpackChunkcore=self.webpackChunkcore||[]).push([["src_include_spicetimeline_spicetimeline_ts"],{7135:(e,t,i)=>{i.r(t),i.d(t,{ModuleSpiceTimeline:()=>$});var s=i(6895),o=i(433),d=i(4357),n=i(5886),r=i(3283),l=i(8363),a=i(1652),h=i(1571),c=i(727),u=i(5329),p=i(3369),m=i(2422),g=i(4154),f=i(3634),y=i(2656),b=i(7514),x=i(4114),k=i(3463),v=i(8859),w=i(1790),T=i(7763),U=i(5681),D=i(151),Z=i(5710),F=i(5931);function _(e,t){if(1&e&&h._UZ(0,"object-record-fieldset-horizontal-list",2),2&e){const e=h.oxw();h.Q6J("fieldset",e.fieldset)}}function H(e,t){if(1&e&&(h.TgZ(0,"span",3),h._uU(1),h.qZA()),2&e){const e=h.oxw();h.Q6J("enablelink",!1),h.xp6(1),h.Oqu(e.event.data.summary_text)}}let C=(()=>{class SpiceTimelineEvent{constructor(e,t){this.metadata=e,this.model=t}ngOnInit(){this.loadFieldset()}ngOnChanges(){this.setModelData()}loadFieldset(){let e=this.metadata.getComponentConfig("SpiceTimelineEvent",this.model.module);e&&e.fieldset&&(this.fieldset=e.fieldset)}setModelData(){this.model.id=this.event.id,this.model.module=this.event.module,this.model.setData(this.event.data)}}return SpiceTimelineEvent.ɵfac=function(e){return new(e||SpiceTimelineEvent)(h.Y36(g.Pu),h.Y36(Z.o))},SpiceTimelineEvent.ɵcmp=h.Xpm({type:SpiceTimelineEvent,selectors:[["spice-timeline-event"]],inputs:{event:"event"},features:[h._Bn([Z.o]),h.TTD],decls:3,vars:2,consts:[[3,"fieldset",4,"ngIf","ngIfElse"],["summaryContainer",""],[3,"fieldset"],["system-model-popover","",1,"slds-text-link--reset",3,"enablelink"]],template:function(e,t){if(1&e&&(h.YNc(0,_,1,1,"object-record-fieldset-horizontal-list",0),h.YNc(1,H,2,2,"ng-template",null,1,h.W1O)),2&e){const e=h.MAs(2);h.Q6J("ngIf",!!t.fieldset)("ngIfElse",e)}},dependencies:[s.O5,F.Z,w.g],encapsulation:2}),SpiceTimelineEvent})();const S=["contentContainer"];function W(e,t){if(1&e){const e=h.EpF();h.TgZ(0,"button",42),h.NdJ("click",(function(){h.CHM(e);const t=h.oxw();return h.KtG(t.toggleOnlyWorkingHours())})),h._UZ(1,"system-button-icon",43),h.qZA()}if(2&e){const e=h.oxw();h.ekj("slds-button--brand",e.onlyWorkingHours),h.Q6J("disabled",!e.onlyWorkingHoursEnabled)}}function M(e,t){if(1&e&&(h.TgZ(0,"div",44),h._uU(1),h.qZA()),2&e){const e=t.$implicit,i=t.first,s=h.oxw();h.Udp("width",100/s.headerFields.length,"%"),h.ekj("slds-border--left",!i),h.xp6(1),h.hij(" ",e," ")}}function O(e,t){if(1&e&&h._UZ(0,"field-container",53),2&e){const e=t.$implicit,i=h.oxw(3);h.Udp("width",100/i.headerFields.length,"%"),h.Q6J("field",e.field)("fieldconfig",e.fieldconfig)}}const J=function(e,t,i){return{id:e,module:t,data:i}};function I(e,t){if(1&e&&(h.TgZ(0,"div",51),h.YNc(1,O,1,4,"field-container",52),h.qZA()),2&e){const e=h.oxw().$implicit,t=h.oxw();h.Q6J("system-model-provider",h.kEZ(2,J,e.id,t.recordModule,e)),h.xp6(1),h.Q6J("ngForOf",t.recordFieldsetFields)}}function B(e,t){if(1&e&&(h.TgZ(0,"span",54),h._uU(1),h.qZA()),2&e){const e=h.oxw().$implicit;h.Q6J("id",e.id),h.xp6(1),h.Oqu(e.name)}}function E(e,t){if(1&e){const e=h.EpF();h.TgZ(0,"div",45)(1,"div",46)(2,"div",47)(3,"system-checkbox",48),h.NdJ("ngModelChange",(function(){const t=h.CHM(e).$implicit,i=h.oxw();return h.KtG(i.emitEvent(t))})),h.qZA()(),h.YNc(4,I,2,6,"div",49),h.YNc(5,B,2,2,"ng-template",null,50,h.W1O),h.qZA()()}if(2&e){const e=t.$implicit,i=h.MAs(6),s=h.oxw();h.Udp("height",s.eventHeight,"px"),h.xp6(1),h.Udp("height",s.eventHeight,"px")("background-color",s.focusedId==e.id?s.focusColor:"initial"),h.xp6(2),h.Q6J("ngModel",s.focusedId==e.id)("value",e.id),h.xp6(1),h.Q6J("ngIf",(null==s.recordFieldsetFields?null:s.recordFieldsetFields.length)>0)("ngIfElse",i)}}const Q=function(e,t){return{width:e,color:t}};function A(e,t){if(1&e&&(h.TgZ(0,"div",55),h._uU(1),h.qZA()),2&e){const e=t.$implicit,i=h.oxw();h.Q6J("system-title",e.text)("ngStyle",h.WLB(3,Q,i.periodUnitWidth+"px",e.color)),h.xp6(1),h.hij(" ",e.text," ")}}function z(e,t){if(1&e&&h._UZ(0,"div",62),2&e){const e=t.$implicit,i=h.oxw(2).$implicit,s=h.oxw().$implicit,o=h.oxw();h.Udp("width",100/i.hours.length,"%"),h.ekj("slds-theme--shade",o.recordsUnavailableTimes[s.id][e])}}function N(e,t){if(1&e&&(h.ynx(0),h.YNc(1,z,1,4,"div",61),h.BQk()),2&e){const e=h.oxw().$implicit,t=h.oxw(2);h.xp6(1),h.Q6J("ngForOf",e.hours)("ngForTrackBy",t.trackByIndexFn)}}function Y(e,t){if(1&e&&(h.TgZ(0,"div",59),h.YNc(1,N,2,2,"ng-container",60),h.qZA()),2&e){const e=t.$implicit,i=h.oxw().$implicit,s=h.oxw();h.Udp("width",s.periodUnitWidth,"px"),h.ekj("slds-theme--shade","day"===s.periodUnit&&s.recordsUnavailableTimes[i.id]&&s.recordsUnavailableTimes[i.id][e.fullDate]),h.xp6(1),h.Q6J("ngIf","week"===s.periodUnit&&s.recordsUnavailableTimes[i.id])}}function q(e,t){if(1&e){const e=h.EpF();h.TgZ(0,"spice-timeline-event",63),h.NdJ("click",(function(){const t=h.CHM(e).$implicit,i=h.oxw().$implicit,s=h.oxw();return h.KtG(s.emitEvent(i,t))})),h.qZA()}if(2&e){const e=t.$implicit;h.Q6J("event",e)("ngStyle",e.style)}}function P(e,t){if(1&e&&(h.TgZ(0,"div",56),h.YNc(1,Y,2,5,"div",57),h.YNc(2,q,1,2,"spice-timeline-event",58),h.qZA()),2&e){const e=t.$implicit,i=h.oxw();h.Udp("background-color",i.focusedId==e.id?i.focusColor:"initial")("height",i.eventHeight,"px"),h.xp6(1),h.Q6J("ngForOf",i.periodDuration)("ngForTrackBy",i.trackByIndexFn),h.xp6(1),h.Q6J("ngForOf",e.events)("ngForTrackBy",i.trackByItemFn)}}const R=function(e,t){return{width:e,"min-width":t}};let L=(()=>{class SpiceTimeline{constructor(e,t,i,s,o,d){this.renderer=e,this.cdRef=t,this.language=i,this.broadcast=s,this.userpreferences=o,this.metadata=d,this.focusColor="#ffc700",this.todayColor="#eb7092",this.defaultPeriodUnitWidth=50,this.defaultPeriodTimelineWidth=250,this.periodUnitWidth=50,this.periodTimelineWidth=250,this.periodDataWidth=250,this.periodDuration=[],this.records=[],this.headerFields=["name"],this.recordFieldsetFields=[],this.dateChange=new h.vpe,this.eventClick=new h.vpe,this.periodUnit="day",this.headerDateText="",this.eventColor="#039be5",this.eventHeight=25,this.startHour=0,this.endHour=23,this.hoursCount=24,this.pickerIsOpen=!1,this.currentDate=moment(),this.endDate=moment(),this.startDate=moment(),this.recordsUnavailableTimes={},this.onlyWorkingHoursEnabled=!1,this.onlyWorkingHours=!1,this.subscriptions=new c.w0,this.loadFieldset()}ngOnChanges(e){e.recordModule&&this.loadFieldset(),e.records&&(this.setRecordsEventStyle(),this.setRecordsUnavailable())}ngAfterViewInit(){this.setOnlyWorkingHoursEnabled(),this.setDate(),this.addResizeListener(),this.addTodayHourInterval(),this.subscribeToChanges()}ngOnDestroy(){this.todayMarkerHourInterval&&window.clearInterval(this.todayMarkerHourInterval),this.subscriptions.unsubscribe()}trackByItemFn(e,t){return t.id}subscribeToChanges(){this.subscriptions.add(this.broadcast.message$.subscribe((e=>{"timezone.changed"===e.messagetype&&(this.setTodayHourMarkerStyle(),this.setRecordsEventStyle(),this.cdRef.detectChanges())})))}shiftDate(e){this.startDate=new moment(this.startDate[e](moment.duration(1,this.periodUnit+"s"))),this.endDate=new moment(this.endDate[e](moment.duration(1,this.periodUnit+"s"))),this.buildPeriodDuration(),this.setHeaderDateText(),this.emitDateChange(),this.cdRef.detectChanges()}addTodayHourInterval(){this.todayMarkerHourInterval=window.setInterval((()=>{this.setTodayHourMarkerStyle(),this.cdRef.detectChanges()}),6e4)}toggleOnlyWorkingHours(){this.onlyWorkingHours=!this.onlyWorkingHours,this.startHour=this.onlyWorkingHours?+this.userpreferences.toUse.calendar_day_start_hour:0,this.endHour=this.onlyWorkingHours?+this.userpreferences.toUse.calendar_day_end_hour-1:23,this.hoursCount=this.endHour-this.startHour,this.setDate(),this.buildPeriodDuration(),this.setTodayHourMarkerStyle()}setOnlyWorkingHoursEnabled(){const e=this.userpreferences.toUse.calendar_day_start_hour,t=this.userpreferences.toUse.calendar_day_end_hour;e&&0!=e&&t&&23!=t&&(this.onlyWorkingHoursEnabled=!0)}addResizeListener(){this.resizeListener=this.renderer.listen("window","resize",(()=>this.setDefaultWidth()))}setDefaultWidth(){const e=this.contentContainer.element.nativeElement.getBoundingClientRect().width;this.periodDataWidth=.25*e,this.defaultPeriodTimelineWidth=.75*e,this.defaultPeriodUnitWidth=(this.defaultPeriodTimelineWidth-1)/this.periodDuration.length,this.resetPeriodUnitWidth(),this.cdRef.detectChanges()}emitDateChange(){this.dateChange.emit({start:new moment(this.startDate.format()),end:new moment(this.endDate.format())})}loadFieldset(){let e=this.metadata.getComponentConfig("SpiceTimeline",this.recordModule);if(!e||!e.recordFieldset)return;const t=this.metadata.getFieldSetFields(e.recordFieldset);t&&(this.recordFieldsetFields=t,this.headerFields=t.map((e=>this.language.getFieldDisplayName(this.recordModule,e.field))))}trackByIndexFn(e,t){return e}buildPeriodDuration(){this.periodDuration=[];let e,t,i=new moment(this.startDate).hour(this.startHour);switch(this.periodUnit){case"day":e="hours",t="H:00";break;case"week":i=new moment(this.startDate).day(0),e="days",t="ddd D";break;case"month":i=new moment(this.startDate).date(1),e="days",t="D"}const s=new moment(i).endOf(this.periodUnit).hour(this.endHour);for(let o=i;o.isBefore(s);o.add(1,e)){const e={fullDate:o.format(),text:o.format(t),color:"day"!=this.periodUnit&&(new moment).isSame(o,"day")?this.todayColor:"#343434"};"week"!=this.periodUnit&&"day"!=this.periodUnit||(e.hours=this.buildDayHours(o)),this.periodDuration.push(e)}this.setDefaultWidth(),this.setTodayHourMarkerStyle()}buildDayHours(e){const t=[],i=new moment(e).hour(this.startHour),s=new moment(e).hour(this.endHour);for(let e=i;e.isSameOrBefore(s);e.add(1,"hours"))t.push(e.format());return t}setRecordsEventStyle(){this.records.forEach((e=>{const t={};"month"==this.periodUnit&&e.events.forEach((e=>{const i=e.start.date();t[i]||(t[i]=[]),t[i].push(e.id)})),e.events.forEach((e=>{e.style={"background-color":e.color||this.eventColor,display:"block",height:"80%",position:"absolute","border-radius":".2rem",top:"10%"};let i=60*(e.start.hour()-this.startHour)+e.start.minute();i=i<0?0:i;let s=60*(e.end.hour()-this.startHour)+e.end.minute();switch(s=s>60*this.hoursCount?60*this.hoursCount:s,this.periodUnit){case"day":e.style.left=this.periodUnitWidth/60*i+"px",e.style.width=this.periodUnitWidth/60*(s-i)-1+"px";break;case"week":e.style.left=this.periodUnitWidth*e.start.day()+this.periodUnitWidth/(60*this.hoursCount)*i+"px",e.style.width=this.periodUnitWidth/(60*this.hoursCount)*(s-i)-1+"px";break;case"month":const o=e.start.date();e.style.left=this.periodUnitWidth*o+t[o].indexOf(e.id)*(this.periodUnitWidth/t[o].length)+"px",e.style.width=this.periodUnitWidth/t[o].length-1+"px"}}))})),this.cdRef.detectChanges()}setRecordsUnavailable(){this.records.forEach((e=>{e.unavailable&&e.unavailable.length&&(this.recordsUnavailableTimes[e.id]={},e.unavailable.forEach((t=>{const i=new moment(t.from),s=new moment(t.to);for(let t=i;t.isSameOrBefore(s);t.add(1,"hours"))this.recordsUnavailableTimes[e.id][t.format()]=!0})),this.cdRef.detectChanges())}))}setPeriodUnit(e){this.periodUnit=e,this.setDate(this.currentDate)}zoomIn(){this.periodUnitWidth+=10,this.periodTimelineWidth+=10*this.periodDuration.length,this.setRecordsEventStyle(),this.setTodayHourMarkerStyle(),this.cdRef.detectChanges()}zoomOut(){this.periodUnitWidth-=10,this.periodTimelineWidth-=10*this.periodDuration.length,this.setRecordsEventStyle(),this.setTodayHourMarkerStyle(),this.cdRef.detectChanges()}resetZoom(){this.resetPeriodUnitWidth(),this.setRecordsEventStyle(),this.setTodayHourMarkerStyle(),this.cdRef.detectChanges()}resetPeriodUnitWidth(){this.periodUnitWidth=this.defaultPeriodUnitWidth,this.periodTimelineWidth=this.defaultPeriodTimelineWidth}setHeaderDateText(){switch(this.periodUnit){case"week":this.headerDateText=`${this.startDate.format("MMMM D")} - ${this.endDate.format("MMMM D")}`;break;case"month":this.headerDateText=this.startDate.format("MMMM YYYY");break;case"day":this.headerDateText=this.startDate.format("MMMM D")}}setDate(e=new moment){switch(this.currentDate=new moment(e),this.periodUnit){case"day":this.startDate=new moment(e).hour(this.startHour).minute(0).second(0);break;case"week":this.startDate=new moment(e).day(0).hour(this.startHour).minute(0).second(0);break;case"month":this.startDate=new moment(e).date(1).hour(this.startHour).minute(0).second(0)}this.endDate=new moment(this.startDate).endOf(this.periodUnit).hour(this.endHour),this.buildPeriodDuration(),this.setHeaderDateText(),this.emitDateChange(),this.pickerIsOpen=!1}toggleOpenPicker(){this.pickerIsOpen=!this.pickerIsOpen}setTodayHourMarkerStyle(){const e=new moment;if("month"==this.periodUnit||!e.isSameOrAfter(this.startDate,"day")||!e.isSameOrBefore(this.endDate,"day"))return this.todayHourMarkerStyle={display:"none"};const t=60*(e.hour()-this.startHour)+e.minute();switch(this.todayHourMarkerStyle={width:"3px",height:"100%","z-index":"10",background:this.todayColor,position:"absolute"},this.periodUnit){case"day":this.todayHourMarkerStyle.left=this.periodUnitWidth/60*t-1.5+"px";break;case"week":this.todayHourMarkerStyle.left=this.periodUnitWidth*e.day()+this.periodUnitWidth/(60*this.hoursCount)*t-1.5+"px"}}emitEvent(e,t){t&&(t.color=this.focusColor),this.focusedId=t||e.id==this.focusedId?void 0:e.id,this.eventClick.emit({record:e,event:t})}}return SpiceTimeline.ɵfac=function(e){return new(e||SpiceTimeline)(h.Y36(h.Qsj),h.Y36(h.sBO),h.Y36(u.d),h.Y36(p.f),h.Y36(m.z),h.Y36(g.Pu))},SpiceTimeline.ɵcmp=h.Xpm({type:SpiceTimeline,selectors:[["spice-timeline"]],viewQuery:function(e,t){if(1&e&&h.Gf(S,7,h.s_b),2&e){let e;h.iGM(e=h.CRH())&&(t.contentContainer=e.first)}},inputs:{records:"records",recordModule:"recordModule"},outputs:{dateChange:"dateChange",eventClick:"eventClick"},features:[h.TTD],decls:56,vars:34,consts:[[1,"slds-grid","slds-grid--vertical","slds-height_full","slds-size--1-of-1","slds-theme--default"],[1,"slds-grid","slds-size--1-of-1","slds-page-header",2,"border-bottom-left-radius","0","border-bottom-right-radius","0","padding",".5rem"],[1,"slds-col","slds-grid"],[1,"slds-dropdown-trigger","slds-dropdown-trigger--click","slds-m-left--xx-small"],[1,"slds-button","slds-button--icon-border",3,"click"],["icon","event","size","x-small"],[1,"slds-dropdown","slds-dropdown_left"],[3,"setDate","weekStartDay","datePicked"],[1,"slds-page-header__title","slds-m-horizontal--x-small","slds-align-middle","slds-truncate"],["system-title","LBL_ONLY_WORKING_HOURS","class","slds-button slds-button--icon-border slds-m-left--xx-small","style","height: 32px;padding: 0;width: 32px;",3,"disabled","slds-button--brand","click",4,"ngIf"],["role","group",1,"slds-button-group"],["icon","chevronleft"],["icon","chevronright"],["role","group",1,"slds-button-group","slds-m-left--x-small"],[1,"slds-button","slds-button--icon-border",3,"disabled","click"],[3,"icon"],["system-dropdown-trigger","",1,"slds-dropdown-trigger","slds-dropdown-trigger--click","slds-m-left--xx-small"],[1,"slds-button","slds-button--neutral","slds-p-horizontal--x-small"],[3,"label"],[1,"slds-dropdown","slds-dropdown--right","slds-dropdown--x-small"],["role","menu",1,"slds-dropdown__list"],["role","presentation",1,"slds-dropdown__item"],["href","javascript:void(0);","role","menuitem",3,"click"],[1,"slds-truncate"],["label","LBL_DAY"],["role","presentation",1,"slds-dropdown__item",3,"click"],["href","javascript:void(0);","role","menuitem"],["label","LBL_WEEK"],["label","LBL_MONTH"],[1,"slds-grid","slds-grow","slds-scrollable",2,"width","100%","min-height","0"],["contentContainer",""],[1,"slds-grid","slds-grid--vertical","slds-theme--default",2,"position","sticky","left","0","z-index","21",3,"ngStyle"],[1,"slds-border--bottom","slds-border--right","slds-grid","slds-theme--default",2,"top","0","z-index","20","position","sticky"],[2,"width","30px"],["class","slds-p-around--xx-small slds-truncate",3,"width","slds-border--left",4,"ngFor","ngForOf"],["class","slds-grid slds-size--1-of-1 slds-border--bottom",3,"height",4,"ngFor","ngForOf","ngForTrackBy"],[1,"slds-grid","slds-grid--vertical"],[1,"slds-grid","slds-border--bottom","slds-size--1-of-1","slds-theme--default",2,"top","0","z-index","20","position","sticky"],["class","slds-border--right slds-p-around--xx-small slds-truncate slds-height_full",3,"system-title","ngStyle",4,"ngFor","ngForOf","ngForTrackBy"],[1,"slds-is-relative"],[3,"ngStyle"],["class","slds-grid slds-border--bottom slds-size--1-of-1 slds-is-relative slds-text-color--inverse",3,"background-color","height",4,"ngFor","ngForOf","ngForTrackBy"],["system-title","LBL_ONLY_WORKING_HOURS",1,"slds-button","slds-button--icon-border","slds-m-left--xx-small",2,"height","32px","padding","0","width","32px",3,"disabled","click"],["icon","clock","size","medium"],[1,"slds-p-around--xx-small","slds-truncate"],[1,"slds-grid","slds-size--1-of-1","slds-border--bottom"],[1,"slds-border--right","slds-size--1-of-1","slds-grid","slds-grid--vertical-align-center"],[1,"slds-p-left--xx-small",2,"width","30px"],[1,"slds-align--absolute-center",3,"ngModel","value","ngModelChange"],["class","slds-grid slds-height_full",3,"system-model-provider",4,"ngIf","ngIfElse"],["summaryTemplate",""],[1,"slds-grid","slds-height_full",3,"system-model-provider"],["class","slds-border--left spice-timeline-record-row-data",3,"field","fieldconfig","width",4,"ngFor","ngForOf"],[1,"slds-border--left","spice-timeline-record-row-data",3,"field","fieldconfig"],["system-model-popover","","module","Users",1,"slds-text-link--reset","slds-p-horizontal--xx-small",3,"id"],[1,"slds-border--right","slds-p-around--xx-small","slds-truncate","slds-height_full",3,"system-title","ngStyle"],[1,"slds-grid","slds-border--bottom","slds-size--1-of-1","slds-is-relative","slds-text-color--inverse"],["class","slds-border--right slds-height_full slds-grid",3,"width","slds-theme--shade",4,"ngFor","ngForOf","ngForTrackBy"],["class","slds-truncate slds-p-around--xx-small",3,"event","ngStyle","click",4,"ngFor","ngForOf","ngForTrackBy"],[1,"slds-border--right","slds-height_full","slds-grid"],[4,"ngIf"],["class","slds-height_full",3,"width","slds-theme--shade",4,"ngFor","ngForOf","ngForTrackBy"],[1,"slds-height_full"],[1,"slds-truncate","slds-p-around--xx-small",3,"event","ngStyle","click"]],template:function(e,t){1&e&&(h.TgZ(0,"div",0)(1,"div",1)(2,"div",2)(3,"div",3)(4,"button",4),h.NdJ("click",(function(){return t.toggleOpenPicker()})),h._UZ(5,"system-utility-icon",5),h.qZA(),h.TgZ(6,"div",6)(7,"system-input-date-picker",7),h.NdJ("datePicked",(function(e){return t.setDate(e)})),h.qZA()()(),h.TgZ(8,"div",8),h._uU(9),h.qZA()(),h.YNc(10,W,2,3,"button",9),h.TgZ(11,"div",10)(12,"button",4),h.NdJ("click",(function(){return t.shiftDate("subtract")})),h._UZ(13,"system-button-icon",11),h.qZA(),h.TgZ(14,"button",4),h.NdJ("click",(function(){return t.shiftDate("add")})),h._UZ(15,"system-button-icon",12),h.qZA()(),h.TgZ(16,"div",13)(17,"button",14),h.NdJ("click",(function(){return t.zoomOut()})),h._UZ(18,"system-button-icon",15),h.qZA(),h.TgZ(19,"button",14),h.NdJ("click",(function(){return t.resetZoom()})),h._UZ(20,"system-button-icon",15),h.qZA(),h.TgZ(21,"button",14),h.NdJ("click",(function(){return t.zoomIn()})),h._UZ(22,"system-button-icon",15),h.qZA()(),h.TgZ(23,"div",16)(24,"button",17),h._UZ(25,"system-label",18),h.ALo(26,"uppercase"),h._UZ(27,"system-button-icon",15),h.qZA(),h.TgZ(28,"div",19)(29,"ul",20)(30,"li",21)(31,"a",22),h.NdJ("click",(function(){return t.setPeriodUnit("day")})),h.TgZ(32,"span",23),h._UZ(33,"system-label",24),h.qZA()()(),h.TgZ(34,"li",25),h.NdJ("click",(function(){return t.setPeriodUnit("week")})),h.TgZ(35,"a",26)(36,"span",23),h._UZ(37,"system-label",27),h.qZA()()(),h.TgZ(38,"li",25),h.NdJ("click",(function(){return t.setPeriodUnit("month")})),h.TgZ(39,"a",26)(40,"span",23),h._UZ(41,"system-label",28),h.qZA()()()()()()(),h.TgZ(42,"div",29,30)(44,"div",31)(45,"div",32),h._UZ(46,"div",33),h.YNc(47,M,2,5,"div",34),h.qZA(),h.TgZ(48,"div"),h.YNc(49,E,7,10,"div",35),h.qZA()(),h.TgZ(50,"div",36)(51,"div",37),h.YNc(52,A,2,6,"div",38),h.qZA(),h.TgZ(53,"div",39),h._UZ(54,"div",40),h.YNc(55,P,3,8,"div",41),h.qZA()()()()),2&e&&(h.xp6(3),h.ekj("slds-is-open",t.pickerIsOpen),h.xp6(4),h.Q6J("setDate",t.currentDate)("weekStartDay",0),h.xp6(2),h.hij(" ",t.headerDateText," "),h.xp6(1),h.Q6J("ngIf","month"!==t.periodUnit),h.xp6(7),h.Q6J("disabled",t.periodUnitWidth<=30),h.xp6(1),h.Q6J("icon","zoomout"),h.xp6(1),h.Q6J("disabled",t.periodUnitWidth==t.defaultPeriodUnitWidth),h.xp6(1),h.Q6J("icon","undo"),h.xp6(1),h.Q6J("disabled",t.periodUnitWidth>=400),h.xp6(1),h.Q6J("icon","zoomin"),h.xp6(3),h.Q6J("label",h.lcZ(26,29,"LBL_"+t.periodUnit)),h.xp6(2),h.Q6J("icon","down"),h.xp6(17),h.Q6J("ngStyle",h.WLB(31,R,t.periodDataWidth+"px",t.periodDataWidth+"px")),h.xp6(1),h.Udp("height",t.eventHeight,"px"),h.xp6(2),h.Q6J("ngForOf",t.headerFields),h.xp6(2),h.Q6J("ngForOf",t.records)("ngForTrackBy",t.trackByItemFn),h.xp6(1),h.Udp("width",t.periodTimelineWidth,"px"),h.xp6(1),h.Udp("height",t.eventHeight,"px"),h.xp6(1),h.Q6J("ngForOf",t.periodDuration)("ngForTrackBy",t.trackByIndexFn),h.xp6(2),h.Q6J("ngStyle",t.todayHourMarkerStyle),h.xp6(1),h.Q6J("ngForOf",t.records)("ngForTrackBy",t.trackByItemFn))},dependencies:[s.sg,s.O5,s.PC,o.JJ,o.On,f.j,y.J,b.U,x.e,k._,v.r,w.g,T.u,U.l,D.S,C,s.gd],encapsulation:2,changeDetection:0}),SpiceTimeline})(),$=(()=>{class ModuleSpiceTimeline{}return ModuleSpiceTimeline.ɵfac=function(e){return new(e||ModuleSpiceTimeline)},ModuleSpiceTimeline.ɵmod=h.oAB({type:ModuleSpiceTimeline}),ModuleSpiceTimeline.ɵinj=h.cJS({imports:[s.ez,o.u5,n.ObjectFields,r.GlobalComponents,l.ObjectComponents,a.SystemComponents,d.o]}),ModuleSpiceTimeline})();("undefined"==typeof ngJitMode||ngJitMode)&&h.kYT($,{declarations:[L,C],imports:[s.ez,o.u5,n.ObjectFields,r.GlobalComponents,l.ObjectComponents,a.SystemComponents,d.o],exports:[L]})}}]);