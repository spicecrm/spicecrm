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
"use strict";(self.webpackChunkcore=self.webpackChunkcore||[]).push([["src_include_spicetimestream_spicetimestream_ts"],{63591:(t,e,s)=>{s.r(e),s.d(e,{ModuleSpiceTimeStream:()=>Q});var i=s(60177),r=s(84341),m=s(71341),a=s(7745),n=s(12948),d=s(37328),o=s(70569),l=s(54438),c=s(83935),h=s(48849);const p=["spice-timestream-item",""];function u(t,e){if(1&t&&l.nrm(0,"div",2),2&t){const t=l.XpG();l.Y8G("ngStyle",t.getElementStyle())}}let f=(()=>{class SpiceTimestreamItem{constructor(t,e){this.metadata=t,this.userpreferences=e,this.timestream={},this.element={},this.componentconfig={}}ngOnInit(){this.componentconfig=this.metadata.getComponentConfig(this.constructor.name,this.module)}get startFieldName(){return this.componentconfig.start?this.componentconfig.start:"date_start"}get endFieldName(){return this.componentconfig.end?this.componentconfig.end:"date_end"}get elementstart(){return this.element[this.startFieldName]}get elementend(){return this.element[this.endFieldName]}get displayItem(){return!!(this.elementstart&&this.elementend&&this.elementstart.isBefore(this.elementend)&&this.elementstart.isBefore(this.timestream.dateEnd)&&this.elementend.isAfter(this.timestream.dateStart))||(!(!this.elementstart||this.elementend||!this.elementstart.isBefore(this.timestream.dateEnd)||!this.elementstart.isAfter(this.timestream.dateStart))||!(this.elementstart||!this.elementend||!this.elementend.isBefore(this.timestream.dateEnd)||!this.elementend.isAfter(this.timestream.dateStart)))}get startdate(){return this.elementstart.isBefore(this.timestream.dateStart)?this.timestream.dateStart:this.elementstart}get enddate(){return this.elementend.isAfter(this.timestream.dateEnd)?this.timestream.dateEnd:this.elementend}getStart(){let t=this.timestream.dateEnd.diff(this.timestream.dateStart,"days");return this.startdate.diff(this.timestream.dateStart,"days")/t*100}getStartFromEnd(){let t=this.timestream.dateEnd.diff(this.timestream.dateStart,"days");return this.enddate.diff(this.timestream.dateStart,"days")/t*100}getWidth(){let t=this.timestream.dateEnd.diff(this.timestream.dateStart,"days");return this.enddate.diff(this.startdate,"days")/t*100}getElementStyle(){return this.elementstart&&this.elementend?this.timestream.dateEnd.diff(this.timestream.dateStart,"days")>0?{left:this.getStart()+"%",width:this.getWidth()+"%"}:{left:this.getStart()+"%",width:"10px",transform:"rotate(45deg)"}:this.elementstart&&this.elementstart.isAfter(this.timestream.dateStart)&&this.elementstart.isBefore(this.timestream.dateEnd)?{left:this.getStart()+"%",width:"10px",transform:"rotate(45deg)"}:this.elementend&&this.elementend.isAfter(this.timestream.dateStart)&&this.elementend.isBefore(this.timestream.dateEnd)?{left:this.getStartFromEnd()+"%",width:"10px",transform:"rotate(45deg)"}:void 0}static#t=this.ɵfac=function(t){return new(t||SpiceTimestreamItem)(l.rXU(c.yu),l.rXU(h.S))};static#e=this.ɵcmp=l.VBU({type:SpiceTimestreamItem,selectors:[["","spice-timestream-item",""]],inputs:{timestream:"timestream",element:"element",module:"module"},attrs:p,decls:2,vars:1,consts:[[1,"slds-grid","slds-border--bottom","slds-is-relative",2,"height","100%"],["class","slds-is-absolute slds-theme--shade","style","height:10px; top: 11px; border-radius: 2px; background-color: #CA1B1F;",3,"ngStyle",4,"ngIf"],[1,"slds-is-absolute","slds-theme--shade",2,"height","10px","top","11px","border-radius","2px","background-color","#CA1B1F",3,"ngStyle"]],template:function(t,e){1&t&&(l.j41(0,"div",0),l.DNE(1,u,1,1,"div",1),l.k0s()),2&t&&(l.R7$(),l.Y8G("ngIf",e.displayItem))},dependencies:[i.bT,i.B3],encapsulation:2})}return SpiceTimestreamItem})();const g=["spice-timestream-header",""];function S(t,e){if(1&t&&(l.j41(0,"div",2)(1,"div",3),l.EFF(2),l.k0s()()),2&t){const t=e.$implicit,s=l.XpG();l.Y8G("ngStyle",s.getPeriodStyle())("ngClass",t.displayclass),l.R7$(2),l.SpI(" ",t.name," ")}}let b=(()=>{class SpiceTimestreamHeader{constructor(t,e){this.elementRef=t,this.userpreferences=e,this.timestream={},this.dateElements=[]}get startDate(){return this.timestream.datestart.format(this.userpreferences.getDateFormat())}get endDate(){return this.timestream.dateend.format(this.userpreferences.getDateFormat())}get width(){return this.elementRef.nativeElement.parentElement.getBoundingClientRect().width}get periods(){let t=[],e=0;switch(this.timestream.period){case"M":let s=moment(this.timestream.dateStart);for(;s.isSameOrBefore(this.timestream.dateEnd);)t.push({name:s.format("DD"),displayclass:0==s.day()||6==s.day()?"slds-theme_shade":""}),s.add(1,"d");break;case"Q":for(;e<3;){let s=(new moment).month(this.timestream.dateStart.month()+e);t.push({name:s.format("MMM")}),e++}break;case"y":for(;e<12;){let s=(new moment).month(e);t.push({name:s.format("MMM")}),e++}}return t}getPeriodStyle(){return{width:100/this.periods.length+"%"}}static#t=this.ɵfac=function(t){return new(t||SpiceTimestreamHeader)(l.rXU(l.aKT),l.rXU(h.S))};static#e=this.ɵcmp=l.VBU({type:SpiceTimestreamHeader,selectors:[["","spice-timestream-header",""]],inputs:{timestream:"timestream"},attrs:g,decls:2,vars:1,consts:[[1,"slds-grid","slds-border--bottom",2,"height","100%"],["class","slds-border--right",3,"ngStyle","ngClass",4,"ngFor","ngForOf"],[1,"slds-border--right",3,"ngStyle","ngClass"],[1,"slds-align--absolute-center","slds-truncate",2,"height","100%"]],template:function(t,e){1&t&&(l.j41(0,"div",0),l.DNE(1,S,3,3,"div",1),l.k0s()),2&t&&(l.R7$(),l.Y8G("ngForOf",e.periods))},dependencies:[i.YU,i.Sq,i.B3],encapsulation:2})}return SpiceTimestreamHeader})();var y=s(35911),v=s(41731),E=s(4921),x=s(23855),T=s(33325);const D=["spice-timestream-label",""];let w=(()=>{class SpiceTimestreamLabel{constructor(t,e,s,i){this.elementRef=t,this.metadata=e,this.model=s,this.footer=i,this.item={},this.module={}}ngOnInit(){this.model.module=this.module,this.model.id=this.item.id,this.model.setData(this.item)}static#t=this.ɵfac=function(t){return new(t||SpiceTimestreamLabel)(l.rXU(l.aKT),l.rXU(c.yu),l.rXU(y.g),l.rXU(E.q))};static#e=this.ɵcmp=l.VBU({type:SpiceTimestreamLabel,selectors:[["","spice-timestream-label",""]],inputs:{item:"item",module:"module"},features:[l.Jv_([y.g,v.U])],attrs:D,decls:4,vars:4,consts:[[1,"slds-grid","slds-grid--align-spread","slds-grid_vertical-align-center"],["system-model-popover","",1,"slds-text-link_reset",3,"module","id"],[3,"buttonsize"]],template:function(t,e){1&t&&(l.j41(0,"div",0)(1,"div",1),l.EFF(2),l.k0s(),l.nrm(3,"object-action-menu",2),l.k0s()),2&t&&(l.R7$(),l.Y8G("module",e.model.module)("id",e.model.id),l.R7$(),l.JRh(e.item.name),l.R7$(),l.Y8G("buttonsize","small"))},dependencies:[x.P,T.j],encapsulation:2})}return SpiceTimestreamLabel})();var k=s(25863),R=s(32062);let _=(()=>{class SpiceTimestreamSelector{constructor(t){this.userpreferences=t,this.focusDate=new moment,this.weekStartDay=0;let e=this.userpreferences.toUse;this.weekStartDay="Monday"==e.week_day_start?1:0}ngOnInit(){this.period="y"}get period(){return this.timestream.period}set period(t){switch(t){case"M":let t=moment(this.focusDate).month();this.timestream.dateStart=new moment(this.focusDate),this.timestream.dateStart.month(t),this.timestream.dateStart.date(1),this.timestream.dateStart.day(this.weekStartDay),this.timestream.dateStart.hour(0),this.timestream.dateStart.minute(0),this.timestream.dateEnd=new moment(this.focusDate),this.timestream.dateEnd.month(t),this.timestream.dateEnd.date(31),this.timestream.dateEnd.day(6),this.timestream.dateEnd.hour(23),this.timestream.dateEnd.minute(59),1==this.weekStartDay&&this.timestream.dateEnd.add(1,"days");break;case"Q":let e=moment(this.focusDate).month()+1;this.timestream.dateStart=new moment(this.focusDate),this.timestream.dateStart.month(3*Math.floor(e/3)),this.timestream.dateStart.date(1),this.timestream.dateStart.hour(0),this.timestream.dateStart.minute(0),this.timestream.dateEnd=new moment(this.focusDate),this.timestream.dateEnd.month(3*Math.floor(e/3)+3),this.timestream.dateEnd.date(31),this.timestream.dateEnd.hour(23),this.timestream.dateEnd.minute(59);break;case"y":this.timestream.dateStart=new moment(this.focusDate),this.timestream.dateStart.month(0),this.timestream.dateStart.date(1),this.timestream.dateStart.hour(0),this.timestream.dateStart.minute(0),this.timestream.dateEnd=new moment(this.focusDate),this.timestream.dateEnd.month(11),this.timestream.dateEnd.date(31),this.timestream.dateEnd.hour(23),this.timestream.dateEnd.minute(59)}this.timestream.period=t}get periodText(){switch(this.timestream.period){case"M":return moment(this.timestream.dateStart).day(6).format("MMM/Y");case"Q":return this.timestream.dateStart.format("Q/Y");case"y":return this.timestream.dateStart.format("Y")}}prev(){this.focusDate.subtract(1,this.timestream.period),this.period=this.timestream.period}next(){this.focusDate.add(1,this.timestream.period),this.period=this.timestream.period}static#t=this.ɵfac=function(t){return new(t||SpiceTimestreamSelector)(l.rXU(h.S))};static#e=this.ɵcmp=l.VBU({type:SpiceTimestreamSelector,selectors:[["spice-timestream-selector"]],inputs:{timestream:"timestream"},decls:19,vars:4,consts:[[1,"slds-border--bottom","slds-p-vertical--xx-small","slds-p-horizontal--x-small",2,"height","40px"],[1,"slds-grid","slds-grid--align-spread","slds-grid_vertical-align-center"],[1,"slds-form-element","slds-size--1-of-2"],[1,"slds-form-element__control"],[1,"slds-select_container"],[1,"slds-select",3,"ngModel","ngModelChange"],["value","y"],["label","LBL_YEAR"],["value","Q"],["label","LBL_QUARTER"],["value","M"],["label","LBL_MONTH"],[1,"slds-grid"],[1,"slds-button","slds-button_icon",3,"click"],[3,"icon"],[1,"slds-p-horizontal--small"]],template:function(t,e){1&t&&(l.j41(0,"div",0)(1,"div",1)(2,"div",2)(3,"div",3)(4,"div",4)(5,"select",5),l.mxI("ngModelChange",(function(t){return l.DH7(e.period,t)||(e.period=t),t})),l.j41(6,"option",6),l.nrm(7,"system-label",7),l.k0s(),l.j41(8,"option",8),l.nrm(9,"system-label",9),l.k0s(),l.j41(10,"option",10),l.nrm(11,"system-label",11),l.k0s()()()()(),l.j41(12,"div",12)(13,"button",13),l.bIt("click",(function(){return e.prev()})),l.nrm(14,"system-button-icon",14),l.k0s(),l.j41(15,"div",15),l.EFF(16),l.k0s(),l.j41(17,"button",13),l.bIt("click",(function(){return e.next()})),l.nrm(18,"system-button-icon",14),l.k0s()()()()),2&t&&(l.R7$(5),l.R50("ngModel",e.period),l.R7$(9),l.Y8G("icon","left"),l.R7$(2),l.SpI(" ",e.periodText," "),l.R7$(2),l.Y8G("icon","right"))},dependencies:[r.xH,r.y7,r.wz,r.BC,r.vS,k.t,R.W],encapsulation:2})}return SpiceTimestreamSelector})();var F=s(18359),U=s(69904),G=s(75103),M=s(28933);function j(t,e){if(1&t&&l.nrm(0,"div",9),2&t){const t=e.$implicit,s=l.XpG();l.Y8G("item",t)("module",s.modellist.module)}}function Y(t,e){if(1&t&&l.nrm(0,"div",10),2&t){const t=e.$implicit,s=l.XpG();l.Y8G("timestream",s.timestream)("module",s.modellist.module)("element",t)}}let X=(()=>{class SpiceTimestream{constructor(t,e,s,i){this.language=t,this.userpreferences=e,this.modellist=s,this.cdRef=i,this.subscriptions=new F.yU,this.timestream={period:"y",dateStart:null,dateEnd:null},this.subscriptions.add(this.modellist.listType$.subscribe((t=>this.handleListTypeChange(t)))),this.subscriptions.add(this.modellist.listDataChanged$.subscribe((()=>{this.cdRef.detectChanges()})))}ngOnInit(){this.modellist.buckets={},this.modellist.loadFromSession()||this.getListData()}ngOnDestroy(){this.subscriptions.unsubscribe()}getListData(){"all"!=this.modellist.currentList.id?this.modellist.getListData().subscribe((()=>this.cdRef.detectChanges())):this.modellist.resetListData()}handleListTypeChange(t){this.cdRef.detectChanges(),"SpiceTimestream"==t.listcomponent&&this.getListData()}static#t=this.ɵfac=function(t){return new(t||SpiceTimestream)(l.rXU(U.B),l.rXU(h.S),l.rXU(G.K),l.rXU(l.gRc))};static#e=this.ɵcmp=l.VBU({type:SpiceTimestream,selectors:[["spice-timestream"]],decls:10,vars:4,consts:[[1,"slds-grid"],[1,"slds-border--right",2,"width","250px"],[3,"timestream"],[1,"slds-grow"],["spice-timestream-header","",2,"height","40px",3,"timestream"],[1,"slds-grid",3,"system-to-bottom"],["class","slds-border--bottom slds-p-vertical--xx-small slds-p-horizontal--x-small","style","height: 34px;","spice-timestream-label","",3,"item","module",4,"ngFor","ngForOf"],[1,"slds-grow","slds-theme--default"],["spice-timestream-item","","style","height: 34px;",3,"timestream","module","element",4,"ngFor","ngForOf"],["spice-timestream-label","",1,"slds-border--bottom","slds-p-vertical--xx-small","slds-p-horizontal--x-small",2,"height","34px",3,"item","module"],["spice-timestream-item","",2,"height","34px",3,"timestream","module","element"]],template:function(t,e){1&t&&(l.j41(0,"div",0)(1,"div",1),l.nrm(2,"spice-timestream-selector",2),l.k0s(),l.j41(3,"div",3),l.nrm(4,"div",4),l.k0s()(),l.j41(5,"div",5),l.bIt("system-to-bottom",(function(){return e.modellist.loadMoreList()})),l.j41(6,"div",1),l.DNE(7,j,1,2,"div",6),l.k0s(),l.j41(8,"div",7),l.DNE(9,Y,1,3,"div",8),l.k0s()()),2&t&&(l.R7$(2),l.Y8G("timestream",e.timestream),l.R7$(2),l.Y8G("timestream",e.timestream),l.R7$(3),l.Y8G("ngForOf",e.modellist.listData.list),l.R7$(2),l.Y8G("ngForOf",e.modellist.listData.list))},dependencies:[i.Sq,M.b,_,f,b,w],encapsulation:2,changeDetection:0})}return SpiceTimestream})();var B=s(92462);function $(t,e){if(1&t&&l.nrm(0,"div",7),2&t){const t=e.$implicit,s=l.XpG();l.Y8G("item",t)("module",s.module)}}function C(t,e){if(1&t&&l.nrm(0,"div",8),2&t){const t=e.$implicit,s=l.XpG();l.Y8G("timestream",s.timestream)("module",s.module)("element",t)}}let O=(()=>{class SpiceTimestreamEmbedded{constructor(t,e,s,i){this.language=t,this.userpreferences=e,this.modelutilities=s,this.metadata=i,this.module="",this.items={},this.timestream={period:"y",dateStart:null,dateEnd:null},this.subscriptions=new F.yU}ngOnDestroy(){this.subscriptions.unsubscribe()}static#t=this.ɵfac=function(t){return new(t||SpiceTimestreamEmbedded)(l.rXU(U.B),l.rXU(h.S),l.rXU(B.g),l.rXU(c.yu))};static#e=this.ɵcmp=l.VBU({type:SpiceTimestreamEmbedded,selectors:[["spice-timestream-embedded"]],inputs:{module:"module",items:"items"},decls:10,vars:4,consts:[[1,"slds-grid"],[1,"slds-border--right",2,"width","250px"],[3,"timestream"],[1,"slds-grow"],["spice-timestream-header","",2,"height","40px",3,"timestream"],["class","slds-border--bottom slds-p-vertical--xx-small slds-p-horizontal--x-small","style","height: 34px;","spice-timestream-label","",3,"item","module",4,"ngFor","ngForOf"],["spice-timestream-item","","style","height: 34px;",3,"timestream","module","element",4,"ngFor","ngForOf"],["spice-timestream-label","",1,"slds-border--bottom","slds-p-vertical--xx-small","slds-p-horizontal--x-small",2,"height","34px",3,"item","module"],["spice-timestream-item","",2,"height","34px",3,"timestream","module","element"]],template:function(t,e){1&t&&(l.j41(0,"div",0)(1,"div",1),l.nrm(2,"spice-timestream-selector",2),l.k0s(),l.j41(3,"div",3),l.nrm(4,"div",4),l.k0s()(),l.j41(5,"div",0)(6,"div",1),l.DNE(7,$,1,2,"div",5),l.k0s(),l.j41(8,"div",3),l.DNE(9,C,1,3,"div",6),l.k0s()()),2&t&&(l.R7$(2),l.Y8G("timestream",e.timestream),l.R7$(2),l.Y8G("timestream",e.timestream),l.R7$(3),l.Y8G("ngForOf",e.items),l.R7$(2),l.Y8G("ngForOf",e.items))},dependencies:[i.Sq,_,f,b,w],encapsulation:2})}return SpiceTimestreamEmbedded})();var I=s(91107),L=s(6179),N=s(57949),A=s(13269);function z(t,e){if(1&t&&(l.qex(0),l.j41(1,"div",3),l.nrm(2,"spice-timestream-embedded",4),l.k0s(),l.bVm()),2&t){const t=l.XpG();l.R7$(2),l.Y8G("items",t.relatedmodels.items)("module",t.relatedmodels.relatedModule)}}function V(t,e){1&t&&l.nrm(0,"system-illustration-no-access")}let H=(()=>{class SpiceTimestreamRelated extends L.F{constructor(t,e,s,i,r){super(t,e,s,i,r),this.language=t,this.metadata=e,this.relatedmodels=s,this.model=i,this.cdref=r}static#t=this.ɵfac=function(t){return new(t||SpiceTimestreamRelated)(l.rXU(U.B),l.rXU(c.yu),l.rXU(I.K),l.rXU(y.g),l.rXU(l.gRc))};static#e=this.ɵcmp=l.VBU({type:SpiceTimestreamRelated,selectors:[["spice-timestream"]],features:[l.Jv_([I.K]),l.Vt3],decls:4,vars:3,consts:[[3,"componentconfig"],[4,"ngIf","ngIfElse"],["noaccess",""],[1,"slds-border--top"],[3,"items","module"]],template:function(t,e){if(1&t&&(l.j41(0,"object-related-card",0),l.DNE(1,z,3,2,"ng-container",1)(2,V,1,0,"ng-template",null,2,l.C5r),l.k0s()),2&t){const t=l.sdS(3);l.Y8G("componentconfig",e.componentconfig),l.R7$(),l.Y8G("ngIf",e.aclAccess)("ngIfElse",t)}},dependencies:[i.bT,N.B,A.r,O],encapsulation:2})}return SpiceTimestreamRelated})(),Q=(()=>{class ModuleSpiceTimeStream{static#t=this.ɵfac=function(t){return new(t||ModuleSpiceTimeStream)};static#e=this.ɵmod=l.$C({type:ModuleSpiceTimeStream});static#s=this.ɵinj=l.G2t({imports:[i.MD,r.YN,a.ObjectFields,n.GlobalComponents,d.ObjectComponents,o.SystemComponents,m.h]})}return ModuleSpiceTimeStream})();("undefined"==typeof ngJitMode||ngJitMode)&&l.Obh(Q,{declarations:[X,O,_,f,b,w,H],imports:[i.MD,r.YN,a.ObjectFields,n.GlobalComponents,d.ObjectComponents,o.SystemComponents,m.h]})}}]);