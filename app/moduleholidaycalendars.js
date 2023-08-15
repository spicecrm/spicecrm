/*!
 * 
 *                     aacService
 *
 *                     release: 2023.02.001
 *
 *                     date: 2023-08-15 08:42:29
 *
 *                     build: 2023.02.001.1692081749029
 *
 */
"use strict";(self.webpackChunkcore=self.webpackChunkcore||[]).push([["src_modules_holidaycalendars_moduleholidaycalendars_ts"],{8395:(e,t,s)=>{s.r(t),s.d(t,{ModuleHolidayCalendars:()=>w});var a=s(1180),l=s(4755),d=s(5030),i=s(4357),o=s(3190),n=s(4826),r=s(6490),c=s(3735),m=s(5710),u=s(2644),y=s(2242),h=s(5329),g=s(4154),C=s(586),Z=s(2656),p=s(3463),b=s(3333),f=s(7763),v=s(3194),H=s(3814),L=s(6040),_=s(7588),M=s(1058);let x=(()=>{var e;class HolidayCalendarListDays{constructor(e,t,s,l){(0,a.Z)(this,"language",void 0),(0,a.Z)(this,"model",void 0),(0,a.Z)(this,"metadata",void 0),(0,a.Z)(this,"relatedmodels",void 0),(0,a.Z)(this,"calendarid",void 0),(0,a.Z)(this,"componentconfig",void 0),(0,a.Z)(this,"listfields",void 0),this.language=e,this.model=t,this.metadata=s,this.relatedmodels=l,this.relatedmodels.module="SystemHolidayCalendars",this.relatedmodels.relatedModule="SystemHolidayCalendarDays",this.relatedmodels.linkName="systemholidaycalendardays",this.relatedmodels.loaditems=1e3,this.componentconfig=this.metadata.getComponentConfig("HolidayCalendarListDays","SystemHolidayCalendarDays"),this.listfields=this.metadata.getFieldSetFields(this.componentconfig.fieldset)}ngOnChanges(e){this.relatedmodels.id=this.calendarid,this.relatedmodels.resetData(),this.relatedmodels.getData().subscribe((e=>{this.relatedmodels.items.sort(((e,t)=>moment(e.holiday_date).isBefore(moment(t.holiday_date))?1:-1))}))}}return e=HolidayCalendarListDays,(0,a.Z)(HolidayCalendarListDays,"ɵfac",(function(t){return new(t||e)(y.Y36(h.d),y.Y36(m.o),y.Y36(g.Pu),y.Y36(L.j))})),(0,a.Z)(HolidayCalendarListDays,"ɵcmp",y.Xpm({type:e,selectors:[["holiday-calendar-list-days"]],inputs:{calendarid:"calendarid"},features:[y._Bn([L.j]),y.TTD],decls:2,vars:2,consts:[["system-to-bottom",""],[3,"listfields","listitemactionset"]],template:function(e,t){1&e&&(y.TgZ(0,"div",0),y._UZ(1,"object-relatedlist-table",1),y.qZA()),2&e&&(y.xp6(1),y.Q6J("listfields",t.listfields)("listitemactionset",t.componentconfig.actionset))},dependencies:[_.K,M.H],encapsulation:2})),HolidayCalendarListDays})();const D=function(e){return{"slds-theme--inverse":e}},A=function(e){return{module:"SystemHolidayCalendars",data:e}};function J(e,t){if(1&e){const e=y.EpF();y.TgZ(0,"div",15),y.NdJ("click",(function(){const t=y.CHM(e).$implicit,s=y.oxw();return y.KtG(s.activeCalendar=t.id)})),y.TgZ(1,"div",16)(2,"span"),y._uU(3),y.qZA(),y._UZ(4,"object-action-menu",17),y.qZA()()}if(2&e){const e=t.$implicit,s=y.oxw();y.Q6J("ngClass",y.VKq(5,D,e.id==s.activeCalendar)),y.xp6(1),y.Q6J("system-model-provider",y.VKq(7,A,e)),y.xp6(2),y.Oqu(e.name),y.xp6(1),y.Q6J("buttonsize","x-small")("actionset",s.actionset)}}function k(e,t){if(1&e&&y._UZ(0,"holiday-calendar-list-days",18),2&e){const e=y.oxw();y.Q6J("calendarid",e.activeCalendar)}}let Y=(()=>{var e;class HolidayCalendarList{constructor(e,t,s,l){(0,a.Z)(this,"language",void 0),(0,a.Z)(this,"modellist",void 0),(0,a.Z)(this,"model",void 0),(0,a.Z)(this,"metadata",void 0),(0,a.Z)(this,"_activeCalendarID",void 0),(0,a.Z)(this,"actionset",void 0),this.language=e,this.modellist=t,this.model=s,this.metadata=l;let d=this.metadata.getComponentConfig("HolidayCalendarList","SystemHolidayCalendars");this.actionset=d.actionset}ngOnInit(){this.modellist.initialize("SystemHolidayCalendars"),this.modellist.getListData(),this.model.module="SystemHolidayCalendars"}refresh(){this.activeCalendar=void 0,this.modellist.reLoadList()}set activeCalendar(e){this._activeCalendarID=e}get activeCalendar(){return this._activeCalendarID}addCalendar(){this.model.module="SystemHolidayCalendars",this.model.id="",this.model.initialize(),this.model.addModel()}addDay(){this.model.module="SystemHolidayCalendarDays",this.model.id="",this.model.initialize(),this.model.addModel(null,null,{systemholidaycalendar_id:this.activeCalendar})}}return e=HolidayCalendarList,(0,a.Z)(HolidayCalendarList,"ɵfac",(function(t){return new(t||e)(y.Y36(h.d),y.Y36(u.t),y.Y36(m.o),y.Y36(g.Pu))})),(0,a.Z)(HolidayCalendarList,"ɵcmp",y.Xpm({type:e,selectors:[["holiday-calendar-list"]],features:[y._Bn([u.t,m.o])],decls:17,vars:3,consts:[[1,"slds-grid","slds-grid_vertical-align-center","slds-grid--align-spread","slds-p-around--small"],[1,"slds-text-heading_medium"],["module","SystemHolidayCalendars"],[1,"slds-grid"],[1,"slds-button","slds-button--neutral",3,"click"],["icon","add"],["label","LBL_CALENDAR"],[1,"slds-button","slds-button--neutral",3,"disabled","click"],["label","LBL_DAY"],[1,"slds-button","slds-button_icon","slds-button_icon-border-filled",3,"click"],["icon","refresh"],["system-to-bottom-noscroll","","system-view-provider","",1,"slds-size--1-of-4","slds-theme--default"],["class","slds-box--border slds-m-around--xx-small",3,"ngClass","click",4,"ngFor","ngForOf"],[1,"slds-size--3-of-4","slds-border--left","slds-theme--shade"],[3,"calendarid",4,"ngIf"],[1,"slds-box--border","slds-m-around--xx-small",3,"ngClass","click"],[1,"slds-p-around--x-small","slds-grid","slds-grid--vertical-align-center","slds-grid--align-spread",3,"system-model-provider"],[3,"buttonsize","actionset"],[3,"calendarid"]],template:function(e,t){1&e&&(y.TgZ(0,"div",0)(1,"h2",1),y._UZ(2,"system-label-modulename",2),y.qZA(),y.TgZ(3,"div",3)(4,"button",4),y.NdJ("click",(function(){return t.addCalendar()})),y._UZ(5,"system-button-icon",5)(6,"system-label",6),y.qZA(),y.TgZ(7,"button",7),y.NdJ("click",(function(){return t.addDay()})),y._UZ(8,"system-button-icon",5)(9,"system-label",8),y.qZA(),y.TgZ(10,"button",9),y.NdJ("click",(function(){return t.refresh()})),y._UZ(11,"system-button-icon",10),y.qZA()()(),y.TgZ(12,"div",3)(13,"div",11),y.YNc(14,J,5,9,"div",12),y.qZA(),y.TgZ(15,"div",13),y.YNc(16,k,1,1,"holiday-calendar-list-days",14),y.qZA()()),2&e&&(y.xp6(7),y.Q6J("disabled",!t.activeCalendar),y.xp6(7),y.Q6J("ngForOf",t.modellist.listData.list),y.xp6(2),y.Q6J("ngIf",t.activeCalendar))},dependencies:[l.mk,l.sg,l.O5,C.g,Z.J,p._,b.M,f.u,v.t,H.V,x],encapsulation:2})),HolidayCalendarList})();var T=s(4505),B=s(3278),q=s(9621),O=s(3499),S=s(5767),z=s(1916);let N=(()=>{var e;class HolidayCalendarListGetHolidaysModal{constructor(e,t,s){(0,a.Z)(this,"backend",void 0),(0,a.Z)(this,"model",void 0),(0,a.Z)(this,"toast",void 0),(0,a.Z)(this,"self",void 0),(0,a.Z)(this,"country",void 0),(0,a.Z)(this,"year",void 0),this.backend=e,this.model=t,this.toast=s}close(){this.self.destroy()}load(){this.backend.getRequest(`module/SystemHolidayCalendars/${this.model.id}/calendarific/${this.country}/${this.year}`).subscribe((e=>{this.close()}),(e=>{this.toast.sendToast("Error loading Holidays","error"),console.log(e)}))}}return e=HolidayCalendarListGetHolidaysModal,(0,a.Z)(HolidayCalendarListGetHolidaysModal,"ɵfac",(function(t){return new(t||e)(y.Y36(T.y),y.Y36(m.o),y.Y36(B.A))})),(0,a.Z)(HolidayCalendarListGetHolidaysModal,"ɵcmp",y.Xpm({type:e,selectors:[["holiday-calendar-list-get-holidays-modal"]],decls:16,vars:2,consts:[["size","prompt"],[3,"close"],["label","LBL_LOAD_HOLIDAYS"],[1,"slds-grid","slds-grid--vertical"],[1,"slds-grid","slds-p-vertical--x-small"],["label","LBL_COUNTRY",1,"slds-size--1-of-2"],["maxlength","2","type","text",1,"slds-input","slds-size--1-of-2",3,"ngModel","ngModelChange"],["label","LBL_YEAR",1,"slds-size--1-of-2"],["maxlength","4","type","number",1,"slds-input","slds-size--1-of-2",3,"ngModel","ngModelChange"],[1,"slds-button","slds-button--neutral",3,"click"],["label","LBL_CANCEL"],[1,"slds-button","slds-button--brand",3,"click"],["label","LBL_LOAD"]],template:function(e,t){1&e&&(y.TgZ(0,"system-modal",0)(1,"system-modal-header",1),y.NdJ("close",(function(){return t.close()})),y._UZ(2,"system-label",2),y.qZA(),y.TgZ(3,"system-modal-content")(4,"div",3)(5,"div",4),y._UZ(6,"system-label",5),y.TgZ(7,"input",6),y.NdJ("ngModelChange",(function(e){return t.country=e})),y.qZA()(),y.TgZ(8,"div",4),y._UZ(9,"system-label",7),y.TgZ(10,"input",8),y.NdJ("ngModelChange",(function(e){return t.year=e})),y.qZA()()()(),y.TgZ(11,"system-modal-footer")(12,"button",9),y.NdJ("click",(function(){return t.close()})),y._UZ(13,"system-label",10),y.qZA(),y.TgZ(14,"button",11),y.NdJ("click",(function(){return t.load()})),y._UZ(15,"system-label",12),y.qZA()()()),2&e&&(y.xp6(7),y.Q6J("ngModel",t.country),y.xp6(3),y.Q6J("ngModel",t.year))},dependencies:[d.Fj,d.wV,d.JJ,d.nD,d.On,p._,q.j,O.x,S.p,z.y],encapsulation:2})),HolidayCalendarListGetHolidaysModal})();var U=s(4044),j=s(6625);let G=(()=>{var e;class HolidayCalendarListGetHolidaysButton{constructor(e,t,s,l){(0,a.Z)(this,"model",void 0),(0,a.Z)(this,"modal",void 0),(0,a.Z)(this,"configuration",void 0),(0,a.Z)(this,"injector",void 0),(0,a.Z)(this,"disabled",!0),this.model=e,this.modal=t,this.configuration=s,this.injector=l,this.enableButton()}enableButton(){let e=this.configuration.getCapabilityConfig("holidaycalendars");e?.calendarific&&(this.disabled=!1)}execute(){this.modal.openModal("HolidayCalendarListGetHolidaysModal",!0,this.injector)}}return e=HolidayCalendarListGetHolidaysButton,(0,a.Z)(HolidayCalendarListGetHolidaysButton,"ɵfac",(function(t){return new(t||e)(y.Y36(m.o),y.Y36(U.o),y.Y36(j.C),y.Y36(y.zs3))})),(0,a.Z)(HolidayCalendarListGetHolidaysButton,"ɵcmp",y.Xpm({type:e,selectors:[["holiday-calendar-list-get-holidays-button"]],decls:1,vars:0,consts:[["label","LBL_LOAD_HOLIDAYS"]],template:function(e,t){1&e&&y._UZ(0,"system-label",0)},dependencies:[p._],encapsulation:2})),HolidayCalendarListGetHolidaysButton})(),w=(()=>{var e;class ModuleHolidayCalendars{}return e=ModuleHolidayCalendars,(0,a.Z)(ModuleHolidayCalendars,"ɵfac",(function(t){return new(t||e)})),(0,a.Z)(ModuleHolidayCalendars,"ɵmod",y.oAB({type:e})),(0,a.Z)(ModuleHolidayCalendars,"ɵinj",y.cJS({imports:[l.ez,d.u5,o.ObjectFields,n.GlobalComponents,r.ObjectComponents,c.SystemComponents,i.o]})),ModuleHolidayCalendars})();("undefined"==typeof ngJitMode||ngJitMode)&&y.kYT(w,{declarations:[Y,x,N,G],imports:[l.ez,d.u5,o.ObjectFields,n.GlobalComponents,r.ObjectComponents,c.SystemComponents,i.o],exports:[x]})}}]);