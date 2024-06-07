/*!
 * 
 *                     SpiceCRM
 *
 *                     release: 2024.01.001
 *
 *                     date: 2024-06-07 18:47:00
 *
 *                     build: 2024.01.001.1717778820753
 *
 */
"use strict";(self.webpackChunkcore=self.webpackChunkcore||[]).push([["src_modules_googleapi_modulegoogleapi_ts"],{72680:(e,s,o)=>{o.r(s),o.d(s,{ModuleGoogleAPI:()=>G});var l=o(60177),i=o(84341),n=o(71341),a=o(7745),t=o(12948),c=o(37328),r=o(70569),g=o(54438),d=o(69904),u=o(83935),m=o(49722),p=o(41081),h=o(50531),f=o(84359),b=o(32062),v=o(69139),_=o(32130);let y=(()=>{class GoogleAPISettings{constructor(e,s,o,l,i){this.language=e,this.metadata=s,this.backend=o,this.toast=l,this.modal=i,this.configvalues={},this.loading=!1,this.serviceuserscope={calendar:!1,gmail_radonly:!1,gmail_compose:!1,gmail_modify:!1,contacts:!1}}ngOnInit(){this.loading=!0,this.backend.getRequest("configuration/configurator/editor/googleapi").subscribe((e=>{this.configvalues=e,this.loadScope(),this.loading=!1}))}save(){this.backend.postRequest("configuration/configurator/editor/googleapi",[],{config:this.configvalues}).subscribe({next:()=>this.toast.sendToast(this.language.getLabel("LBL_DATA_SAVED"),"success"),error:()=>this.toast.sendToast(this.language.getLabel("ERR_FAILED_TO_EXECUTE"),"error")})}loadScope(){let e=[];this.configvalues.hasOwnProperty("serviceuserscope")&&(e=this.configvalues.serviceuserscope.split(" "));for(let s of e)switch(s){case"https://www.googleapis.com/auth/calendar":this.serviceuserscope.calendar=!0;break;case"https://www.googleapis.com/auth/contacts":this.serviceuserscope.contacts=!0;break;case"https://www.googleapis.com/auth/gmail.readonly":this.serviceuserscope.gmail_radonly=!0;break;case"https://www.googleapis.com/auth/gmail.compose":this.serviceuserscope.gmail_compose=!0;break;case"https://www.googleapis.com/auth/gmail.modify":this.serviceuserscope.gmail_modify=!0}}setScope(){let e=[];this.serviceuserscope.calendar&&e.push("https://www.googleapis.com/auth/calendar"),this.serviceuserscope.contacts&&e.push("https://www.googleapis.com/auth/contacts"),this.serviceuserscope.gmail_radonly&&e.push("https://www.googleapis.com/auth/gmail.readonly"),this.serviceuserscope.gmail_compose&&e.push("https://www.googleapis.com/auth/gmail.compose"),this.serviceuserscope.gmail_modify&&e.push("https://www.googleapis.com/auth/gmail.modify"),this.configvalues.serviceuserscope=e.join(" ")}static#e=this.ɵfac=function(e){return new(e||GoogleAPISettings)(g.rXU(d.B),g.rXU(u.yu),g.rXU(m.H),g.rXU(p.o),g.rXU(h.y))};static#s=this.ɵcmp=g.VBU({type:GoogleAPISettings,selectors:[["ng-component"]],decls:40,vars:25,consts:[[1,"slds-grid","slds-grid_vertical-align-center","slds-grid--align-spread","slds-p-around--small","slds-border--bottom"],[1,"slds-text-heading_medium"],["label","LBL_GOOGLEAPI_SETTINGS"],[1,"slds-button","slds-button--brand",3,"click"],["label","LBL_SAVE"],["system-to-bottom-noscroll","",1,"slds-p-horizontal--small","slds-theme--default",3,"system-overlay-loading-spinner"],[1,"slds-grid","slds-grid--vertical-align-center","slds-p-vertical--xx-small"],["label","LBL_GOOGLE_MAPS_KEY",1,"slds-size--1-of-4"],["type","text",1,"slds-input","slds-grow",3,"disabled","ngModel","ngModelChange"],["label","LBL_GOOGLE_GEOCODING_KEY",1,"slds-size--1-of-4"],["label","LBL_GOOGLE_TRANSLATE_KEY",1,"slds-size--1-of-4"],["label","LBL_GOOGLE_CLIENTID",1,"slds-size--1-of-4"],[1,"slds-grid","slds-p-vertical--xx-small"],["label","LBL_GOOGLE_CLIENTJSON",1,"slds-size--1-of-4","slds-p-vertical--xx-small"],["rows","7",1,"slds-input","slds-grow",3,"disabled","ngModel","ngModelChange"],["label","LBL_GOOGLE_SERVICEUSERKEY",1,"slds-size--1-of-4","slds-p-vertical--xx-small"],["label","LBL_GOOGLE_SERVICEUSERSCOPE",1,"slds-size--1-of-4","slds-p-vertical--xx-small"],[1,"slds-grow","slds-form-element__control"],[3,"ngModel","disabled","ngModelChange","change"],["label","LBL_GOOGLE_CALENDAR"],["label","LBL_GOOGLE_GMAIL_READONLY"],["label","LBL_GOOGLE_GMAIL_COMPOSE"],["label","LBL_GOOGLE_GMAIL_MODIFY"],["label","LBL_GOOGLE_CONTACTS"],["label","LBL_GOOGLE_NOTIFICATIONHOST",1,"slds-size--1-of-4"]],template:function(e,s){1&e&&(g.j41(0,"div",0)(1,"h2",1),g.nrm(2,"system-label",2),g.k0s(),g.j41(3,"button",3),g.bIt("click",(function(){return s.save()})),g.nrm(4,"system-label",4),g.k0s()(),g.j41(5,"div",5)(6,"div",6),g.nrm(7,"system-label",7),g.j41(8,"input",8),g.mxI("ngModelChange",(function(e){return g.DH7(s.configvalues.mapskey,e)||(s.configvalues.mapskey=e),e})),g.k0s()(),g.j41(9,"div",6),g.nrm(10,"system-label",9),g.j41(11,"input",8),g.mxI("ngModelChange",(function(e){return g.DH7(s.configvalues.geocodingkey,e)||(s.configvalues.geocodingkey=e),e})),g.k0s()(),g.j41(12,"div",6),g.nrm(13,"system-label",10),g.j41(14,"input",8),g.mxI("ngModelChange",(function(e){return g.DH7(s.configvalues.languagekey,e)||(s.configvalues.languagekey=e),e})),g.k0s()(),g.j41(15,"div",6),g.nrm(16,"system-label",11),g.j41(17,"input",8),g.mxI("ngModelChange",(function(e){return g.DH7(s.configvalues.clientid,e)||(s.configvalues.clientid=e),e})),g.k0s()(),g.j41(18,"div",12),g.nrm(19,"system-label",13),g.j41(20,"textarea",14),g.mxI("ngModelChange",(function(e){return g.DH7(s.configvalues.calendarconfig,e)||(s.configvalues.calendarconfig=e),e})),g.k0s()(),g.j41(21,"div",12),g.nrm(22,"system-label",15),g.j41(23,"textarea",14),g.mxI("ngModelChange",(function(e){return g.DH7(s.configvalues.serviceuserkey,e)||(s.configvalues.serviceuserkey=e),e})),g.k0s()(),g.j41(24,"div",12),g.nrm(25,"system-label",16),g.j41(26,"div",17)(27,"system-checkbox",18),g.mxI("ngModelChange",(function(e){return g.DH7(s.serviceuserscope.calendar,e)||(s.serviceuserscope.calendar=e),e})),g.bIt("change",(function(){return s.setScope()})),g.nrm(28,"system-label",19),g.k0s(),g.j41(29,"system-checkbox",18),g.mxI("ngModelChange",(function(e){return g.DH7(s.serviceuserscope.gmail_radonly,e)||(s.serviceuserscope.gmail_radonly=e),e})),g.bIt("change",(function(){return s.setScope()})),g.nrm(30,"system-label",20),g.k0s(),g.j41(31,"system-checkbox",18),g.mxI("ngModelChange",(function(e){return g.DH7(s.serviceuserscope.gmail_compose,e)||(s.serviceuserscope.gmail_compose=e),e})),g.bIt("change",(function(){return s.setScope()})),g.nrm(32,"system-label",21),g.k0s(),g.j41(33,"system-checkbox",18),g.mxI("ngModelChange",(function(e){return g.DH7(s.serviceuserscope.gmail_modify,e)||(s.serviceuserscope.gmail_modify=e),e})),g.bIt("change",(function(){return s.setScope()})),g.nrm(34,"system-label",22),g.k0s(),g.j41(35,"system-checkbox",18),g.mxI("ngModelChange",(function(e){return g.DH7(s.serviceuserscope.contacts,e)||(s.serviceuserscope.contacts=e),e})),g.bIt("change",(function(){return s.setScope()})),g.nrm(36,"system-label",23),g.k0s()()(),g.j41(37,"div",6),g.nrm(38,"system-label",24),g.j41(39,"input",8),g.mxI("ngModelChange",(function(e){return g.DH7(s.configvalues.notificationhost,e)||(s.configvalues.notificationhost=e),e})),g.k0s()()()),2&e&&(g.R7$(5),g.Y8G("system-overlay-loading-spinner",s.loading),g.R7$(3),g.Y8G("disabled",s.loading),g.R50("ngModel",s.configvalues.mapskey),g.R7$(3),g.Y8G("disabled",s.loading),g.R50("ngModel",s.configvalues.geocodingkey),g.R7$(3),g.Y8G("disabled",s.loading),g.R50("ngModel",s.configvalues.languagekey),g.R7$(3),g.Y8G("disabled",s.loading),g.R50("ngModel",s.configvalues.clientid),g.R7$(3),g.Y8G("disabled",s.loading),g.R50("ngModel",s.configvalues.calendarconfig),g.R7$(3),g.Y8G("disabled",s.loading),g.R50("ngModel",s.configvalues.serviceuserkey),g.R7$(4),g.R50("ngModel",s.serviceuserscope.calendar),g.Y8G("disabled",s.loading),g.R7$(2),g.R50("ngModel",s.serviceuserscope.gmail_radonly),g.Y8G("disabled",s.loading),g.R7$(2),g.R50("ngModel",s.serviceuserscope.gmail_compose),g.Y8G("disabled",s.loading),g.R7$(2),g.R50("ngModel",s.serviceuserscope.gmail_modify),g.Y8G("disabled",s.loading),g.R7$(2),g.R50("ngModel",s.serviceuserscope.contacts),g.Y8G("disabled",s.loading),g.R7$(4),g.Y8G("disabled",s.loading),g.R50("ngModel",s.configvalues.notificationhost))},dependencies:[i.me,i.BC,i.vS,f.f,b.W,v.p,_.M],encapsulation:2})}return GoogleAPISettings})(),G=(()=>{class ModuleGoogleAPI{static#e=this.ɵfac=function(e){return new(e||ModuleGoogleAPI)};static#s=this.ɵmod=g.$C({type:ModuleGoogleAPI});static#o=this.ɵinj=g.G2t({imports:[l.MD,i.YN,a.ObjectFields,t.GlobalComponents,c.ObjectComponents,r.SystemComponents,n.h]})}return ModuleGoogleAPI})();("undefined"==typeof ngJitMode||ngJitMode)&&g.Obh(G,{declarations:[y],imports:[l.MD,i.YN,a.ObjectFields,t.GlobalComponents,c.ObjectComponents,r.SystemComponents,n.h]})}}]);