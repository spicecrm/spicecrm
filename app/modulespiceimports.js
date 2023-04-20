/*!
 * 
 *                     aacService
 *
 *                     release: 2023.01.001
 *
 *                     date: 2023-04-20 15:21:12
 *
 *                     build: 2023.01.001.1681996872955
 *
 */
"use strict";(self.webpackChunkcore=self.webpackChunkcore||[]).push([["src_modules_spiceimports_modulespiceimports_ts"],{9678:(e,t,s)=>{s.r(t),s.d(t,{ModuleSpiceImports:()=>w});var i=s(6895),o=s(433),l=s(5886),r=s(3283),n=s(8363),c=s(1652),a=s(1571),d=s(4505);let p=(()=>{class spiceimportsservice{constructor(e){this.backend=e,this.isloading=!1,this.isloadingLogs=!1,this.canLoadMore=!0,this.activeimportdata=void 0,this.loadLimit=25,this.activeimportdata$=new a.vpe,this.items=[],this.activeItemLogs=void 0}get activeImportData(){return this.activeimportdata}set activeImportData(e){this.activeimportdata=e,this.activeimportdata$.emit(e)}getItemLogs(){this.activeItemLogs=void 0,this.isloadingLogs=!0,this.backend.getRequest(`module/SpiceImports/${this.activeImportData.id}/logs`).subscribe((e=>{e.map((e=>e.data=e.data.split('";"'))),this.activeItemLogs=e,this.isloadingLogs=!1}))}loadData(){this.isloading=!0,this.backend.getRequest("module/SpiceImports",{orderby:"date_entered DESC",limit:this.loadLimit,offset:0,fields:"*"}).subscribe((e=>{this.parseItemsStatus(e.list),this.items=e.list,this.isloading=!1}))}loadMoreData(){if(this.isloading||!this.canLoadMore)return!1;this.isloading=!0,this.backend.getRequest("module/SpiceImports",{orderby:"date_entered DESC",limit:this.loadLimit,offset:this.items.length,fields:"*"}).subscribe((e=>{this.parseItemsStatus(e.list),this.items=this.items.concat(e.list),e.list.length<this.loadLimit&&(this.canLoadMore=!1),this.isloading=!1}))}deleteImport(){this.items.every((e=>{let t=this.items.indexOf(e);return e.id==this.activeImportData.id&&this.items.splice(t,1),!0}))}parseItemsStatus(e){e.map((e=>{let t=JSON.parse(e.data);switch(e.status){case"c":"new"==t.importAction?e.statusdisplay="LBL_IMPORTED":e.statusdisplay="LBL_UPDATED";break;case"e":"new"==t.importAction?e.statusdisplay="LBL_IMPORTED":e.statusdisplay="LBL_UPDATE_FAILED";break;default:e.statusdisplay="LBL_SCHEDULED"}return e}))}}return spiceimportsservice.ɵfac=function(e){return new(e||spiceimportsservice)(a.LFG(d.y))},spiceimportsservice.ɵprov=a.Yz7({token:spiceimportsservice,factory:spiceimportsservice.ɵfac}),spiceimportsservice})();var m=s(5329),u=s(6898),g=s(3463),h=s(4664),v=s(4561);const f=function(e){return{"slds-theme_shade":e}};let b=(()=>{class SpiceImportsListItem{constructor(e,t){this.language=e,this.spiceimportsservice=t,this.item=void 0}}return SpiceImportsListItem.ɵfac=function(e){return new(e||SpiceImportsListItem)(a.Y36(m.d),a.Y36(p))},SpiceImportsListItem.ɵcmp=a.Xpm({type:SpiceImportsListItem,selectors:[["spice-imports-list-item"]],inputs:{item:"item"},decls:15,vars:13,consts:[[1,"slds-p-around--medium","slds-border--bottom","slds-border--right","slds-grid",2,"cursor","pointer",3,"ngClass","click"],[1,"slds-icon_container","slds-col","slds-size--1-of-12",3,"title"],["size","medium",3,"module"],[1,"slds-col","slds-size--11-of-12"],[1,"slds-grid","slds-grid--align-spread"],[1,"slds-text-title_caps"],[1,"slds-col--bump-left","slds-truncate"],[1,"slds-truncate"]],template:function(e,t){1&e&&(a.TgZ(0,"div",0),a.NdJ("click",(function(){return t.spiceimportsservice.activeImportData={id:t.item.id,name:t.item.name}})),a.TgZ(1,"div",1),a._UZ(2,"system-icon",2),a.qZA(),a.TgZ(3,"div",3)(4,"div",4)(5,"div",5),a._uU(6),a.qZA(),a.TgZ(7,"div",6),a._uU(8),a.ALo(9,"slice"),a.qZA()(),a.TgZ(10,"div",4)(11,"div",7),a._uU(12),a.qZA(),a.TgZ(13,"div",6),a._uU(14),a.qZA()()()()),2&e&&(a.Q6J("ngClass",a.VKq(11,f,(null==t.spiceimportsservice.activeImportData?null:t.spiceimportsservice.activeImportData.id)==t.item.id)),a.xp6(1),a.s9C("title",t.item.model),a.xp6(1),a.Q6J("module",t.item.module),a.xp6(4),a.Oqu(t.item.name),a.xp6(2),a.Oqu(a.Dn7(9,7,t.item.date_entered,0,16)),a.xp6(4),a.Oqu(t.language.getLabel(t.item.statusdisplay)),a.xp6(2),a.Oqu(t.item.created_by_name))},dependencies:[i.mk,v.f,i.OU],encapsulation:2}),SpiceImportsListItem})();const L=["listcontainer"];function I(e,t){if(1&e&&(a.TgZ(0,"option",12),a._UZ(1,"system-label",13),a.qZA()),2&e){const e=t.$implicit;a.Q6J("value",e.value),a.xp6(1),a.Q6J("label",e.label)}}function _(e,t){1&e&&(a.TgZ(0,"div",14)(1,"span"),a._UZ(2,"system-label",15),a.qZA()())}function S(e,t){if(1&e&&a._UZ(0,"spice-imports-list-item",16),2&e){const e=t.$implicit;a.Q6J("item",e)}}function Z(e,t){1&e&&a._UZ(0,"system-spinner")}let x=(()=>{class SpiceImportsList{constructor(e,t){this.language=e,this.spiceimportsservice=t,this.filtermodule="",this.filterstatus="",this.filterstatusoptions=[],this.filterstatusoptions.push({value:"c",label:"LBL_IMPORTED"},{value:"q",label:"LBL_SCHEDULED"},{value:"e",label:"LBL_ERROR"})}listStyle(){return{height:"calc(100vh - "+this.listcontainer.element.nativeElement.getBoundingClientRect().top+"px)"}}get items(){return this.filtermodule&&this.filterstatus?this.spiceimportsservice.items.filter((e=>e.module===this.filtermodule&&e.status===this.filterstatus)):this.filtermodule?this.spiceimportsservice.items.filter((e=>e.module===this.filtermodule)):this.filterstatus?this.spiceimportsservice.items.filter((e=>e.status===this.filterstatus)):this.spiceimportsservice.items}onScroll(e){let t=this.listcontainer.element.nativeElement;t.scrollTop+t.clientHeight+50>t.scrollHeight&&this.spiceimportsservice.loadMoreData()}}return SpiceImportsList.ɵfac=function(e){return new(e||SpiceImportsList)(a.Y36(m.d),a.Y36(p))},SpiceImportsList.ɵcmp=a.Xpm({type:SpiceImportsList,selectors:[["spice-imports-list"]],viewQuery:function(e,t){if(1&e&&a.Gf(L,7,a.s_b),2&e){let e;a.iGM(e=a.CRH())&&(t.listcontainer=e.first)}},decls:12,vars:8,consts:[[1,"slds-p-around--xx-small","slds-grid","slds-grid--vertical-align-center"],["label","LBL_MODULE"],[1,"slds-select",3,"ngModel","displayEmptyOption","ngModelChange"],["label","LBL_STATUS"],[1,"slds-select",3,"ngModel","ngModelChange"],["value",""],[3,"value",4,"ngFor","ngForOf"],[1,"slds-scrollable--y",3,"ngStyle","scroll"],["listcontainer",""],["class","slds-text-align_center slds-p-vertical--medium",4,"ngIf"],[3,"item",4,"ngFor","ngForOf"],[4,"ngIf"],[3,"value"],[3,"label"],[1,"slds-text-align_center","slds-p-vertical--medium"],["label","LBL_NO_ENTRIES"],[3,"item"]],template:function(e,t){1&e&&(a.TgZ(0,"div",0),a._UZ(1,"system-label",1),a.TgZ(2,"system-input-module",2),a.NdJ("ngModelChange",(function(e){return t.filtermodule=e})),a.qZA(),a._UZ(3,"system-label",3),a.TgZ(4,"select",4),a.NdJ("ngModelChange",(function(e){return t.filterstatus=e})),a._UZ(5,"option",5),a.YNc(6,I,2,2,"option",6),a.qZA()(),a.TgZ(7,"div",7,8),a.NdJ("scroll",(function(e){return t.onScroll(e)})),a.YNc(9,_,3,0,"div",9),a.YNc(10,S,1,1,"spice-imports-list-item",10),a.YNc(11,Z,1,0,"system-spinner",11),a.qZA()),2&e&&(a.xp6(2),a.Q6J("ngModel",t.filtermodule)("displayEmptyOption",!0),a.xp6(2),a.Q6J("ngModel",t.filterstatus),a.xp6(2),a.Q6J("ngForOf",t.filterstatusoptions),a.xp6(1),a.Q6J("ngStyle",t.listStyle()),a.xp6(2),a.Q6J("ngIf",!t.spiceimportsservice.isloading&&0==(null==t.items?null:t.items.length)),a.xp6(1),a.Q6J("ngForOf",t.items),a.xp6(1),a.Q6J("ngIf",t.spiceimportsservice.isloading))},dependencies:[i.sg,i.O5,i.PC,o.YN,o.Kr,o.EJ,o.JJ,o.On,u.a,g._,h.W,b],encapsulation:2}),SpiceImportsList})();var y=s(4044),E=s(3278),T=s(2656);const O=["logscontainer"];function D(e,t){if(1&e){const e=a.EpF();a.TgZ(0,"button",9),a.NdJ("click",(function(){a.CHM(e);const t=a.oxw();return a.KtG(t.delete())})),a._UZ(1,"system-label",10),a.qZA()}}function q(e,t){1&e&&(a.TgZ(0,"div",11),a._UZ(1,"system-label",12),a.qZA())}function J(e,t){1&e&&(a.TgZ(0,"div",11),a._UZ(1,"system-label",13),a.qZA())}function A(e,t){1&e&&a._UZ(0,"system-spinner")}function M(e,t){if(1&e&&(a.TgZ(0,"div",19)(1,"button",20),a._UZ(2,"system-button-icon",21),a.qZA()()),2&e){const e=a.oxw().$implicit,t=a.oxw();a.xp6(2),a.Q6J("icon",t.getButtonicon(e.id))}}function U(e,t){if(1&e&&(a.TgZ(0,"tr")(1,"td",23),a._uU(2),a.qZA(),a.TgZ(3,"td",23),a._uU(4),a.qZA()()),2&e){const e=t.$implicit,s=t.index,i=a.oxw(3);a.xp6(2),a.Oqu(i.itemHeader[s]),a.xp6(2),a.Oqu(e)}}function C(e,t){if(1&e&&(a.TgZ(0,"table",22)(1,"tbody"),a.YNc(2,U,5,2,"tr",8),a.qZA()()),2&e){const e=a.oxw().$implicit;a.xp6(2),a.Q6J("ngForOf",e.data)}}function N(e,t){if(1&e){const e=a.EpF();a.TgZ(0,"div")(1,"div",14),a.NdJ("click",(function(){const t=a.CHM(e).$implicit,s=a.oxw();return a.KtG(s.toggleOpen(t.id))})),a.TgZ(2,"div",15),a._uU(3),a.qZA(),a.TgZ(4,"div",16),a._uU(5),a.qZA(),a.YNc(6,M,3,1,"div",17),a.qZA(),a.YNc(7,C,3,1,"table",18),a.qZA()}if(2&e){const e=t.$implicit,s=a.oxw();a.xp6(3),a.hij(" ",e.msg," "),a.xp6(1),a.Q6J("hidden",s.opened&&e.id==s.activeLogId&&s.itemHeader),a.xp6(1),a.hij(" ",e.data.join(" , ")," "),a.xp6(1),a.Q6J("ngIf",s.itemHeader),a.xp6(1),a.Q6J("ngIf",s.opened&&e.id==s.activeLogId&&s.itemHeader)}}let Y=(()=>{class Spiceimportslogs{constructor(e,t,s,i,o){this.language=e,this.modal=t,this.backend=s,this.toast=i,this.spiceimportsservice=o,this.itemHeader=void 0,this.activeLogId=void 0,this.activelogname=void 0,this.opened=!1,this.spiceimportsservice.activeimportdata$.subscribe((e=>{e&&(this.activeLogName=e.name,this.spiceimportsservice.getItemLogs(),this.setItemHeader(e.id)),this.opened=!1}))}get itemLogs(){return this.spiceimportsservice.activeItemLogs}get activeLogName(){return this.activelogname}set activeLogName(e){this.activelogname=e}getButtonicon(e){return this.opened&&this.activeLogId==e?"chevronup":"chevrondown"}setItemHeader(e){this.spiceimportsservice.items.some((t=>{let s=JSON.parse(t.data);return t.id==e&&(this.itemHeader=s.fileHeader),!0}))}mainStyle(){return{height:"calc(100vh - "+this.logscontainer.element.nativeElement.getBoundingClientRect().top+"px)",overflow:"auto"}}toggleOpen(e){this.opened&&e!=this.activeLogId||(this.opened=!this.opened),this.activeLogId=e}delete(){this.modal.confirm(this.language.getLabel("MSG_DELETE_RECORD","","long"),this.language.getLabel("MSG_DELETE_RECORD")).subscribe((e=>{e&&this.backend.deleteRequest(`module/SpiceImports/${this.spiceimportsservice.activeImportData.id}`).subscribe((e=>{e?(this.toast.sendToast(this.language.getLabel("MSG_SUCCESSFULLY_DELETED"),"success"),this.spiceimportsservice.deleteImport(),this.resetData()):this.toast.sendToast(this.language.getLabel("ERR_CANT_DELETE"),"error")}))}))}resetData(){this.spiceimportsservice.activeImportData=void 0,this.spiceimportsservice.activeItemLogs=void 0,this.activeLogName=void 0}}return Spiceimportslogs.ɵfac=function(e){return new(e||Spiceimportslogs)(a.Y36(m.d),a.Y36(y.o),a.Y36(d.y),a.Y36(E.A),a.Y36(p))},Spiceimportslogs.ɵcmp=a.Xpm({type:Spiceimportslogs,selectors:[["spice-imports-logs"]],viewQuery:function(e,t){if(1&e&&a.Gf(O,7,a.s_b),2&e){let e;a.iGM(e=a.CRH())&&(t.logscontainer=e.first)}},decls:11,vars:7,consts:[[1,"slds-grid","slds-page-header","slds-p-horizontal--none","slds-p-vertical--xx-small","slds-grid--vertical-align-center",2,"border-radius","0","border-left","0","height","50px"],[1,"slds-text-title_caps","slds-p-left--small"],[1,"slds-p-around_xx-small","slds-col--bump-left"],["class","slds-button slds-button--brand",3,"click",4,"ngIf"],[1,"slds-scrollable--y",3,"ngStyle"],["logscontainer",""],["class","slds-align_absolute-center slds-m-around--xx-large slds-text-heading--medium",4,"ngIf"],[4,"ngIf"],[4,"ngFor","ngForOf"],[1,"slds-button","slds-button--brand",3,"click"],["label","LBL_DELETE"],[1,"slds-align_absolute-center","slds-m-around--xx-large","slds-text-heading--medium"],["label","MSG_NO_LOGS_FOUND"],["label","LBL_MAKE_SELECTION"],[1,"slds-p-left--small","slds-border--bottom","slds-border--right","slds-grid",2,"cursor","pointer",3,"click"],[1,"slds-p-vertical--small","slds-col","slds-size--2-of-12","slds-border--right"],[1,"slds-p-around--small","slds-col","slds-size--9-of-12","slds-truncate",3,"hidden"],["class","slds-p-around--small slds-size--1-of-12 slds-col_bump-left",4,"ngIf"],["class","slds-table slds-table--bordered slds-table--cell-buffer",4,"ngIf"],[1,"slds-p-around--small","slds-size--1-of-12","slds-col_bump-left"],[1,"slds-button","slds-button_icon"],[3,"icon"],[1,"slds-table","slds-table--bordered","slds-table--cell-buffer"],[1,"slds-truncate"]],template:function(e,t){1&e&&(a.TgZ(0,"div",0)(1,"div",1),a._uU(2),a.qZA(),a.TgZ(3,"div",2),a.YNc(4,D,2,0,"button",3),a.qZA()(),a.TgZ(5,"div",4,5),a.YNc(7,q,2,0,"div",6),a.YNc(8,J,2,0,"div",6),a.YNc(9,A,1,0,"system-spinner",7),a.YNc(10,N,8,5,"div",8),a.qZA()),2&e&&(a.xp6(2),a.Oqu(t.activeLogName),a.xp6(2),a.Q6J("ngIf",t.activeLogName),a.xp6(1),a.Q6J("ngStyle",t.mainStyle()),a.xp6(2),a.Q6J("ngIf",!t.spiceimportsservice.isloadingLogs&&t.spiceimportsservice.activeImportData&&(null==t.itemLogs?null:t.itemLogs.length)<=0),a.xp6(1),a.Q6J("ngIf",!t.spiceimportsservice.isloadingLogs&&!t.spiceimportsservice.activeImportData),a.xp6(1),a.Q6J("ngIf",t.spiceimportsservice.isloadingLogs),a.xp6(1),a.Q6J("ngForOf",t.itemLogs))},dependencies:[i.sg,i.O5,i.PC,T.J,g._,h.W],encapsulation:2}),Spiceimportslogs})(),Q=(()=>{class SpiceImports{constructor(e,t){this.language=e,this.spiceimportsservice=t}ngOnInit(){this.spiceimportsservice.loadData()}}return SpiceImports.ɵfac=function(e){return new(e||SpiceImports)(a.Y36(m.d),a.Y36(p))},SpiceImports.ɵcmp=a.Xpm({type:SpiceImports,selectors:[["ng-component"]],features:[a._Bn([p])],decls:5,vars:0,consts:[[1,"slds-grid"],[1,"slds-size--1-of-2"],[1,"slds-scrollable"],[1,"slds-size--1-of-2","slds-theme--shade"]],template:function(e,t){1&e&&(a.TgZ(0,"div",0)(1,"spice-imports-list",1),a._UZ(2,"div",2),a.qZA(),a.TgZ(3,"spice-imports-logs",3),a._UZ(4,"div",2),a.qZA()())},dependencies:[x,Y],encapsulation:2}),SpiceImports})(),w=(()=>{class ModuleSpiceImports{}return ModuleSpiceImports.ɵfac=function(e){return new(e||ModuleSpiceImports)},ModuleSpiceImports.ɵmod=a.oAB({type:ModuleSpiceImports}),ModuleSpiceImports.ɵinj=a.cJS({providers:[p],imports:[i.ez,o.u5,l.ObjectFields,r.GlobalComponents,n.ObjectComponents,c.SystemComponents]}),ModuleSpiceImports})();("undefined"==typeof ngJitMode||ngJitMode)&&a.kYT(w,{declarations:[Q,x,b,Y],imports:[i.ez,o.u5,l.ObjectFields,r.GlobalComponents,n.ObjectComponents,c.SystemComponents]})}}]);