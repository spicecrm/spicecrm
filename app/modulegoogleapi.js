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
"use strict";(self.webpackChunkcore=self.webpackChunkcore||[]).push([["src_modules_googleapi_modulegoogleapi_ts"],{8725:(e,s,o)=>{o.r(s),o.d(s,{ModuleGoogleAPI:()=>y});var l=o(1180),t=o(4755),a=o(5030),i=o(4357),n=o(3190),c=o(4826),g=o(6490),d=o(3735),r=o(2242),u=o(5329),p=o(4154),m=o(4505),h=o(3278),b=o(4044),_=o(7514),v=o(3463),f=o(3194),Z=o(4021);let L=(()=>{var e;class GoogleAPISettings{constructor(e,s,o,t,a){(0,l.Z)(this,"language",void 0),(0,l.Z)(this,"metadata",void 0),(0,l.Z)(this,"backend",void 0),(0,l.Z)(this,"toast",void 0),(0,l.Z)(this,"modal",void 0),(0,l.Z)(this,"configvalues",{}),(0,l.Z)(this,"loading",!1),(0,l.Z)(this,"serviceuserscope",{calendar:!1,gmail_radonly:!1,gmail_compose:!1,gmail_modify:!1,contacts:!1}),this.language=e,this.metadata=s,this.backend=o,this.toast=t,this.modal=a}ngOnInit(){this.loading=!0,this.backend.getRequest("configuration/configurator/editor/googleapi").subscribe((e=>{this.configvalues=e,this.loadScope(),this.loading=!1}))}save(){this.backend.postRequest("configuration/configurator/editor/googleapi",[],{config:this.configvalues}).subscribe({next:()=>this.toast.sendToast(this.language.getLabel("LBL_DATA_SAVED"),"success"),error:()=>this.toast.sendToast(this.language.getLabel("ERR_FAILED_TO_EXECUTE"),"error")})}loadScope(){let e=[];this.configvalues.hasOwnProperty("serviceuserscope")&&(e=this.configvalues.serviceuserscope.split(" "));for(let s of e)switch(s){case"https://www.googleapis.com/auth/calendar":this.serviceuserscope.calendar=!0;break;case"https://www.googleapis.com/auth/contacts":this.serviceuserscope.contacts=!0;break;case"https://www.googleapis.com/auth/gmail.readonly":this.serviceuserscope.gmail_radonly=!0;break;case"https://www.googleapis.com/auth/gmail.compose":this.serviceuserscope.gmail_compose=!0;break;case"https://www.googleapis.com/auth/gmail.modify":this.serviceuserscope.gmail_modify=!0}}setScope(){let e=[];this.serviceuserscope.calendar&&e.push("https://www.googleapis.com/auth/calendar"),this.serviceuserscope.contacts&&e.push("https://www.googleapis.com/auth/contacts"),this.serviceuserscope.gmail_radonly&&e.push("https://www.googleapis.com/auth/gmail.readonly"),this.serviceuserscope.gmail_compose&&e.push("https://www.googleapis.com/auth/gmail.compose"),this.serviceuserscope.gmail_modify&&e.push("https://www.googleapis.com/auth/gmail.modify"),this.configvalues.serviceuserscope=e.join(" ")}}return e=GoogleAPISettings,(0,l.Z)(GoogleAPISettings,"ɵfac",(function(s){return new(s||e)(r.Y36(u.d),r.Y36(p.Pu),r.Y36(m.y),r.Y36(h.A),r.Y36(b.o))})),(0,l.Z)(GoogleAPISettings,"ɵcmp",r.Xpm({type:e,selectors:[["ng-component"]],decls:37,vars:23,consts:[[1,"slds-grid","slds-grid_vertical-align-center","slds-grid--align-spread","slds-p-around--small","slds-border--bottom"],[1,"slds-text-heading_medium"],["label","LBL_GOOGLEAPI_SETTINGS"],[1,"slds-button","slds-button--brand",3,"click"],["label","LBL_SAVE"],["system-to-bottom-noscroll","",1,"slds-p-horizontal--small","slds-theme--default",3,"system-overlay-loading-spinner"],[1,"slds-grid","slds-grid--vertical-align-center","slds-p-vertical--xx-small"],["label","LBL_GOOGLE_MAPS_KEY",1,"slds-size--1-of-4"],["type","text",1,"slds-input","slds-grow",3,"disabled","ngModel","ngModelChange"],["label","LBL_GOOGLE_TRANSLATE_KEY",1,"slds-size--1-of-4"],["label","LBL_GOOGLE_CLIENTID",1,"slds-size--1-of-4"],[1,"slds-grid","slds-p-vertical--xx-small"],["label","LBL_GOOGLE_CLIENTJSON",1,"slds-size--1-of-4","slds-p-vertical--xx-small"],["rows","7",1,"slds-input","slds-grow",3,"disabled","ngModel","ngModelChange"],["label","LBL_GOOGLE_SERVICEUSERKEY",1,"slds-size--1-of-4","slds-p-vertical--xx-small"],["label","LBL_GOOGLE_SERVICEUSERSCOPE",1,"slds-size--1-of-4","slds-p-vertical--xx-small"],[1,"slds-grow","slds-form-element__control"],[3,"ngModel","disabled","ngModelChange","change"],["label","LBL_GOOGLE_CALENDAR"],["label","LBL_GOOGLE_GMAIL_READONLY"],["label","LBL_GOOGLE_GMAIL_COMPOSE"],["label","LBL_GOOGLE_GMAIL_MODIFY"],["label","LBL_GOOGLE_CONTACTS"],["label","LBL_GOOGLE_NOTIFICATIONHOST",1,"slds-size--1-of-4"]],template:function(e,s){1&e&&(r.TgZ(0,"div",0)(1,"h2",1),r._UZ(2,"system-label",2),r.qZA(),r.TgZ(3,"button",3),r.NdJ("click",(function(){return s.save()})),r._UZ(4,"system-label",4),r.qZA()(),r.TgZ(5,"div",5)(6,"div",6),r._UZ(7,"system-label",7),r.TgZ(8,"input",8),r.NdJ("ngModelChange",(function(e){return s.configvalues.mapskey=e})),r.qZA()(),r.TgZ(9,"div",6),r._UZ(10,"system-label",9),r.TgZ(11,"input",8),r.NdJ("ngModelChange",(function(e){return s.configvalues.languagekey=e})),r.qZA()(),r.TgZ(12,"div",6),r._UZ(13,"system-label",10),r.TgZ(14,"input",8),r.NdJ("ngModelChange",(function(e){return s.configvalues.clientid=e})),r.qZA()(),r.TgZ(15,"div",11),r._UZ(16,"system-label",12),r.TgZ(17,"textarea",13),r.NdJ("ngModelChange",(function(e){return s.configvalues.calendarconfig=e})),r.qZA()(),r.TgZ(18,"div",11),r._UZ(19,"system-label",14),r.TgZ(20,"textarea",13),r.NdJ("ngModelChange",(function(e){return s.configvalues.serviceuserkey=e})),r.qZA()(),r.TgZ(21,"div",11),r._UZ(22,"system-label",15),r.TgZ(23,"div",16)(24,"system-checkbox",17),r.NdJ("ngModelChange",(function(e){return s.serviceuserscope.calendar=e}))("change",(function(){return s.setScope()})),r._UZ(25,"system-label",18),r.qZA(),r.TgZ(26,"system-checkbox",17),r.NdJ("ngModelChange",(function(e){return s.serviceuserscope.gmail_radonly=e}))("change",(function(){return s.setScope()})),r._UZ(27,"system-label",19),r.qZA(),r.TgZ(28,"system-checkbox",17),r.NdJ("ngModelChange",(function(e){return s.serviceuserscope.gmail_compose=e}))("change",(function(){return s.setScope()})),r._UZ(29,"system-label",20),r.qZA(),r.TgZ(30,"system-checkbox",17),r.NdJ("ngModelChange",(function(e){return s.serviceuserscope.gmail_modify=e}))("change",(function(){return s.setScope()})),r._UZ(31,"system-label",21),r.qZA(),r.TgZ(32,"system-checkbox",17),r.NdJ("ngModelChange",(function(e){return s.serviceuserscope.contacts=e}))("change",(function(){return s.setScope()})),r._UZ(33,"system-label",22),r.qZA()()(),r.TgZ(34,"div",6),r._UZ(35,"system-label",23),r.TgZ(36,"input",8),r.NdJ("ngModelChange",(function(e){return s.configvalues.notificationhost=e})),r.qZA()()()),2&e&&(r.xp6(5),r.Q6J("system-overlay-loading-spinner",s.loading),r.xp6(3),r.Q6J("disabled",s.loading)("ngModel",s.configvalues.mapskey),r.xp6(3),r.Q6J("disabled",s.loading)("ngModel",s.configvalues.languagekey),r.xp6(3),r.Q6J("disabled",s.loading)("ngModel",s.configvalues.clientid),r.xp6(3),r.Q6J("disabled",s.loading)("ngModel",s.configvalues.calendarconfig),r.xp6(3),r.Q6J("disabled",s.loading)("ngModel",s.configvalues.serviceuserkey),r.xp6(4),r.Q6J("ngModel",s.serviceuserscope.calendar)("disabled",s.loading),r.xp6(2),r.Q6J("ngModel",s.serviceuserscope.gmail_radonly)("disabled",s.loading),r.xp6(2),r.Q6J("ngModel",s.serviceuserscope.gmail_compose)("disabled",s.loading),r.xp6(2),r.Q6J("ngModel",s.serviceuserscope.gmail_modify)("disabled",s.loading),r.xp6(2),r.Q6J("ngModel",s.serviceuserscope.contacts)("disabled",s.loading),r.xp6(4),r.Q6J("disabled",s.loading)("ngModel",s.configvalues.notificationhost))},dependencies:[a.Fj,a.JJ,a.On,_.U,v._,f.t,Z._],encapsulation:2})),GoogleAPISettings})(),y=(()=>{var e;class ModuleGoogleAPI{}return e=ModuleGoogleAPI,(0,l.Z)(ModuleGoogleAPI,"ɵfac",(function(s){return new(s||e)})),(0,l.Z)(ModuleGoogleAPI,"ɵmod",r.oAB({type:e})),(0,l.Z)(ModuleGoogleAPI,"ɵinj",r.cJS({imports:[t.ez,a.u5,n.ObjectFields,c.GlobalComponents,g.ObjectComponents,d.SystemComponents,i.o]})),ModuleGoogleAPI})();("undefined"==typeof ngJitMode||ngJitMode)&&r.kYT(y,{declarations:[L],imports:[t.ez,a.u5,n.ObjectFields,c.GlobalComponents,g.ObjectComponents,d.SystemComponents,i.o]})}}]);