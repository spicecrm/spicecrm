/*!
 * 
 *                     aacService
 *
 *                     release: 2022.02.001
 *
 *                     date: 2022-09-03 11:05:02
 *
 *                     build: 2022.02.001.1662195902704
 *
 */
"use strict";(self.webpackChunkcore=self.webpackChunkcore||[]).push([["src_modules_systemcalendars_modulesystemcalendars_ts"],{9109:(e,t,s)=>{s.r(t),s.d(t,{ModuleSystemCalendars:()=>j});var a=s(6895),l=s(433),d=s(4357),n=s(3121),i=s(3283),o=s(4518),r=s(5478),c=s(5710),m=s(2644),u=s(1571),y=s(5329),C=s(4154),g=s(586),h=s(2656),p=s(3463),b=s(3333),f=s(7763),L=s(3194),S=s(3814),Z=s(6040),v=s(7588),_=s(1058);let H=(()=>{class SystemCalendarListDays{constructor(e,t,s,a){this.language=e,this.model=t,this.metadata=s,this.relatedmodels=a,this.relatedmodels.module="SystemHolidayCalendars",this.relatedmodels.relatedModule="SystemHolidayCalendarDays",this.relatedmodels.linkName="systemholidaycalendardays",this.relatedmodels.loaditems=1e3,this.componentconfig=this.metadata.getComponentConfig("HolidayCalendarListDays","SystemHolidayCalendarDays"),this.listfields=this.metadata.getFieldSetFields(this.componentconfig.fieldset)}ngOnChanges(e){this.relatedmodels.id=this.calendarid,this.relatedmodels.resetData(),this.relatedmodels.getData()}}return SystemCalendarListDays.ɵfac=function(e){return new(e||SystemCalendarListDays)(u.Y36(y.d),u.Y36(c.o),u.Y36(C.Pu),u.Y36(Z.j))},SystemCalendarListDays.ɵcmp=u.Xpm({type:SystemCalendarListDays,selectors:[["system-calendar-list-days"]],inputs:{calendarid:"calendarid"},features:[u._Bn([Z.j,c.o]),u.TTD],decls:2,vars:2,consts:[["system-to-bottom",""],[3,"listfields","listitemactionset"]],template:function(e,t){1&e&&(u.TgZ(0,"div",0),u._UZ(1,"object-relatedlist-table",1),u.qZA()),2&e&&(u.xp6(1),u.Q6J("listfields",t.listfields)("listitemactionset",t.componentconfig.actionset))},dependencies:[v.K,_.H],encapsulation:2}),SystemCalendarListDays})();const M=function(e){return{"slds-theme--inverse":e}},x=function(e){return{module:"SystemHolidayCalendars",data:e}};function A(e,t){if(1&e){const e=u.EpF();u.TgZ(0,"div",15),u.NdJ("click",(function(){const t=u.CHM(e).$implicit,s=u.oxw();return u.KtG(s.activeCalendar=t.id)})),u.TgZ(1,"div",16)(2,"span"),u._uU(3),u.qZA(),u._UZ(4,"object-action-menu",17),u.qZA()()}if(2&e){const e=t.$implicit,s=u.oxw();u.Q6J("ngClass",u.VKq(5,M,e.id==s.activeCalendar)),u.xp6(1),u.Q6J("system-model-provider",u.VKq(7,x,e)),u.xp6(2),u.Oqu(e.name),u.xp6(1),u.Q6J("buttonsize","x-small")("actionset",s.actionset)}}function D(e,t){if(1&e&&u._UZ(0,"system-calendar-list-days",18),2&e){const e=u.oxw();u.Q6J("calendarid",e.activeCalendar)}}let J=(()=>{class SystemCalendarList{constructor(e,t,s,a){this.language=e,this.modellist=t,this.model=s,this.metadata=a;let l=this.metadata.getComponentConfig("HolidayCalendarList","SystemHolidayCalendars");this.actionset=l.actionset}ngOnInit(){this.modellist.initialize("SystemHolidayCalendars")}refresh(){this.activeCalendar=void 0,this.modellist.reLoadList()}set activeCalendar(e){this._activeCalendarID=e}get activeCalendar(){return this._activeCalendarID}addCalendar(){this.model.module="SystemHolidayCalendars",this.model.initialize(),this.model.addModel()}addDay(){this.model.module="SystemHolidayCalendarDays",this.model.initialize(),this.model.addModel(null,null,{systemholidaycalendar_id:this.activeCalendar})}}return SystemCalendarList.ɵfac=function(e){return new(e||SystemCalendarList)(u.Y36(y.d),u.Y36(m.t),u.Y36(c.o),u.Y36(C.Pu))},SystemCalendarList.ɵcmp=u.Xpm({type:SystemCalendarList,selectors:[["system-calendar-list"]],features:[u._Bn([m.t,c.o])],decls:17,vars:3,consts:[[1,"slds-grid","slds-grid_vertical-align-center","slds-grid--align-spread","slds-p-around--small"],[1,"slds-text-heading_medium"],["module","SystemHolidayCalendars"],[1,"slds-grid"],[1,"slds-button","slds-button--neutral",3,"click"],["icon","add"],["label","LBL_CALENDAR"],[1,"slds-button","slds-button--neutral",3,"disabled","click"],["label","LBL_DAY"],[1,"slds-button","slds-button_icon","slds-button_icon-border-filled",3,"click"],["icon","refresh"],["system-to-bottom-noscroll","","system-view-provider","",1,"slds-size--1-of-4","slds-theme--default"],["class","slds-box--border slds-m-around--xx-small",3,"ngClass","click",4,"ngFor","ngForOf"],[1,"slds-size--3-of-4","slds-border--left","slds-theme--shade"],[3,"calendarid",4,"ngIf"],[1,"slds-box--border","slds-m-around--xx-small",3,"ngClass","click"],[1,"slds-p-around--x-small","slds-grid","slds-grid--vertical-align-center","slds-grid--align-spread",3,"system-model-provider"],[3,"buttonsize","actionset"],[3,"calendarid"]],template:function(e,t){1&e&&(u.TgZ(0,"div",0)(1,"h2",1),u._UZ(2,"system-label-modulename",2),u.qZA(),u.TgZ(3,"div",3)(4,"button",4),u.NdJ("click",(function(){return t.addCalendar()})),u._UZ(5,"system-button-icon",5)(6,"system-label",6),u.qZA(),u.TgZ(7,"button",7),u.NdJ("click",(function(){return t.addDay()})),u._UZ(8,"system-button-icon",5)(9,"system-label",8),u.qZA(),u.TgZ(10,"button",9),u.NdJ("click",(function(){return t.refresh()})),u._UZ(11,"system-button-icon",10),u.qZA()()(),u.TgZ(12,"div",3)(13,"div",11),u.YNc(14,A,5,9,"div",12),u.qZA(),u.TgZ(15,"div",13),u.YNc(16,D,1,1,"system-calendar-list-days",14),u.qZA()()),2&e&&(u.xp6(7),u.Q6J("disabled",!t.activeCalendar),u.xp6(7),u.Q6J("ngForOf",t.modellist.listData.list),u.xp6(2),u.Q6J("ngIf",t.activeCalendar))},dependencies:[a.mk,a.sg,a.O5,g.g,h.J,p._,b.M,f.u,L.t,S.V,H],encapsulation:2}),SystemCalendarList})();var Y=s(4505),k=s(3278),T=s(9621),B=s(3499),q=s(5767),O=s(1916);let G=(()=>{class SystemCalendarListGetHolidaysModal{constructor(e,t,s){this.backend=e,this.model=t,this.toast=s}close(){this.self.destroy()}load(){this.backend.getRequest(`module/SystemHolidayCalendars/${this.model.id}/calendarific/${this.country}/${this.year}`).subscribe((e=>{this.close()}),(e=>{this.toast.sendToast("Error loading Holidays","error"),console.log(e)}))}}return SystemCalendarListGetHolidaysModal.ɵfac=function(e){return new(e||SystemCalendarListGetHolidaysModal)(u.Y36(Y.y),u.Y36(c.o),u.Y36(k.A))},SystemCalendarListGetHolidaysModal.ɵcmp=u.Xpm({type:SystemCalendarListGetHolidaysModal,selectors:[["system-calendar-list-get-holidays-modal"]],decls:16,vars:2,consts:[["size","prompt"],[3,"close"],["label","LBL_LOAD_HOLIDAYS"],[1,"slds-grid","slds-grid--vertical"],[1,"slds-grid","slds-p-vertical--x-small"],["label","LBL_COUNTRY",1,"slds-size--1-of-2"],["maxlength","2","type","text",1,"slds-input","slds-size--1-of-2",3,"ngModel","ngModelChange"],["label","LBL_YEAR",1,"slds-size--1-of-2"],["maxlength","4","type","number",1,"slds-input","slds-size--1-of-2",3,"ngModel","ngModelChange"],[1,"slds-button","slds-button--neutral",3,"click"],["label","LBL_CANCEL"],[1,"slds-button","slds-button--brand",3,"click"],["label","LBL_LOAD"]],template:function(e,t){1&e&&(u.TgZ(0,"system-modal",0)(1,"system-modal-header",1),u.NdJ("close",(function(){return t.close()})),u._UZ(2,"system-label",2),u.qZA(),u.TgZ(3,"system-modal-content")(4,"div",3)(5,"div",4),u._UZ(6,"system-label",5),u.TgZ(7,"input",6),u.NdJ("ngModelChange",(function(e){return t.country=e})),u.qZA()(),u.TgZ(8,"div",4),u._UZ(9,"system-label",7),u.TgZ(10,"input",8),u.NdJ("ngModelChange",(function(e){return t.year=e})),u.qZA()()()(),u.TgZ(11,"system-modal-footer")(12,"button",9),u.NdJ("click",(function(){return t.close()})),u._UZ(13,"system-label",10),u.qZA(),u.TgZ(14,"button",11),u.NdJ("click",(function(){return t.load()})),u._UZ(15,"system-label",12),u.qZA()()()),2&e&&(u.xp6(7),u.Q6J("ngModel",t.country),u.xp6(3),u.Q6J("ngModel",t.year))},dependencies:[l.Fj,l.wV,l.JJ,l.nD,l.On,p._,T.j,B.x,q.p,O.y],encapsulation:2}),SystemCalendarListGetHolidaysModal})();var z=s(4044),N=s(6625);let U=(()=>{class SystemCalendarListGetHolidaysButton{constructor(e,t,s,a){this.model=e,this.modal=t,this.configuration=s,this.injector=a,this.disabled=!0,this.enableButton()}enableButton(){this.configuration.getCapabilityConfig("holidaycalendars")?.calendarific&&(this.disabled=!1)}execute(){this.modal.openModal("HolidayCalendarListGetHolidaysModal",!0,this.injector)}}return SystemCalendarListGetHolidaysButton.ɵfac=function(e){return new(e||SystemCalendarListGetHolidaysButton)(u.Y36(c.o),u.Y36(z.o),u.Y36(N.C),u.Y36(u.zs3))},SystemCalendarListGetHolidaysButton.ɵcmp=u.Xpm({type:SystemCalendarListGetHolidaysButton,selectors:[["system-calendar-list-get-holidays-button"]],decls:1,vars:0,consts:[["label","LBL_LOAD_HOLIDAYS"]],template:function(e,t){1&e&&u._UZ(0,"system-label",0)},dependencies:[p._],encapsulation:2}),SystemCalendarListGetHolidaysButton})(),j=(()=>{class ModuleSystemCalendars{}return ModuleSystemCalendars.ɵfac=function(e){return new(e||ModuleSystemCalendars)},ModuleSystemCalendars.ɵmod=u.oAB({type:ModuleSystemCalendars}),ModuleSystemCalendars.ɵinj=u.cJS({imports:[a.ez,l.u5,n.ObjectFields,i.GlobalComponents,o.ObjectComponents,r.SystemComponents,d.o]}),ModuleSystemCalendars})();("undefined"==typeof ngJitMode||ngJitMode)&&u.kYT(j,{declarations:[J,H,G,U],imports:[a.ez,l.u5,n.ObjectFields,i.GlobalComponents,o.ObjectComponents,r.SystemComponents,d.o]})}}]);