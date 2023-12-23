/*!
 * 
 *                     aacService
 *
 *                     release: 2023.03.001
 *
 *                     date: 2023-12-23 09:36:33
 *
 *                     build: 2023.03.001.1703320593363
 *
 */
"use strict";(self.webpackChunkcore=self.webpackChunkcore||[]).push([["src_include_spicetimestream_spicetimestream_ts"],{7846:(e,t,s)=>{s.r(t),s.d(t,{ModuleSpiceTimeStream:()=>X});var i=s(4755),a=s(5030),m=s(4357),r=s(3190),d=s(4826),n=s(9784),o=s(7239),l=s(2242),c=s(4154),h=s(2422);const p=["spice-timestream-item",""];function u(e,t){if(1&e&&l._UZ(0,"div",2),2&e){const e=l.oxw();l.Q6J("ngStyle",e.getElementStyle())}}let g=(()=>{class SpiceTimestreamItem{metadata;userpreferences;timestream={};element={};module;componentconfig={};constructor(e,t){this.metadata=e,this.userpreferences=t}ngOnInit(){this.componentconfig=this.metadata.getComponentConfig(this.constructor.name,this.module)}get startFieldName(){return this.componentconfig.start?this.componentconfig.start:"date_start"}get endFieldName(){return this.componentconfig.end?this.componentconfig.end:"date_end"}get elementstart(){return this.element[this.startFieldName]}get elementend(){return this.element[this.endFieldName]}get displayItem(){return!!(this.elementstart&&this.elementend&&this.elementstart.isBefore(this.elementend)&&this.elementstart.isBefore(this.timestream.dateEnd)&&this.elementend.isAfter(this.timestream.dateStart))||(!(!this.elementstart||this.elementend||!this.elementstart.isBefore(this.timestream.dateEnd)||!this.elementstart.isAfter(this.timestream.dateStart))||!(this.elementstart||!this.elementend||!this.elementend.isBefore(this.timestream.dateEnd)||!this.elementend.isAfter(this.timestream.dateStart)))}get startdate(){return this.elementstart.isBefore(this.timestream.dateStart)?this.timestream.dateStart:this.elementstart}get enddate(){return this.elementend.isAfter(this.timestream.dateEnd)?this.timestream.dateEnd:this.elementend}getStart(){let e=this.timestream.dateEnd.diff(this.timestream.dateStart,"days");return this.startdate.diff(this.timestream.dateStart,"days")/e*100}getStartFromEnd(){let e=this.timestream.dateEnd.diff(this.timestream.dateStart,"days");return this.enddate.diff(this.timestream.dateStart,"days")/e*100}getWidth(){let e=this.timestream.dateEnd.diff(this.timestream.dateStart,"days");return this.enddate.diff(this.startdate,"days")/e*100}getElementStyle(){return this.elementstart&&this.elementend?this.timestream.dateEnd.diff(this.timestream.dateStart,"days")>0?{left:this.getStart()+"%",width:this.getWidth()+"%"}:{left:this.getStart()+"%",width:"10px",transform:"rotate(45deg)"}:this.elementstart&&this.elementstart.isAfter(this.timestream.dateStart)&&this.elementstart.isBefore(this.timestream.dateEnd)?{left:this.getStart()+"%",width:"10px",transform:"rotate(45deg)"}:this.elementend&&this.elementend.isAfter(this.timestream.dateStart)&&this.elementend.isBefore(this.timestream.dateEnd)?{left:this.getStartFromEnd()+"%",width:"10px",transform:"rotate(45deg)"}:void 0}static ɵfac=function(e){return new(e||SpiceTimestreamItem)(l.Y36(c.Pu),l.Y36(h.z))};static ɵcmp=l.Xpm({type:SpiceTimestreamItem,selectors:[["","spice-timestream-item",""]],inputs:{timestream:"timestream",element:"element",module:"module"},attrs:p,decls:2,vars:1,consts:[[1,"slds-grid","slds-border--bottom","slds-is-relative",2,"height","100%"],["class","slds-is-absolute slds-theme--shade","style","height:10px; top: 11px; border-radius: 2px; background-color: #CA1B1F;",3,"ngStyle",4,"ngIf"],[1,"slds-is-absolute","slds-theme--shade",2,"height","10px","top","11px","border-radius","2px","background-color","#CA1B1F",3,"ngStyle"]],template:function(e,t){1&e&&(l.TgZ(0,"div",0),l.YNc(1,u,1,1,"div",1),l.qZA()),2&e&&(l.xp6(1),l.Q6J("ngIf",t.displayItem))},dependencies:[i.O5,i.PC],encapsulation:2})}return SpiceTimestreamItem})();const f=["spice-timestream-header",""];function S(e,t){if(1&e&&(l.TgZ(0,"div",2)(1,"div",3),l._uU(2),l.qZA()()),2&e){const e=t.$implicit,s=l.oxw();l.Q6J("ngStyle",s.getPeriodStyle())("ngClass",e.displayclass),l.xp6(2),l.hij(" ",e.name," ")}}let b=(()=>{class SpiceTimestreamHeader{elementRef;userpreferences;timestream={};dateElements=[];constructor(e,t){this.elementRef=e,this.userpreferences=t}get startDate(){return this.timestream.datestart.format(this.userpreferences.getDateFormat())}get endDate(){return this.timestream.dateend.format(this.userpreferences.getDateFormat())}get width(){return this.elementRef.nativeElement.parentElement.getBoundingClientRect().width}get periods(){let e=[],t=0;switch(this.timestream.period){case"M":let s=moment(this.timestream.dateStart);for(;s.isSameOrBefore(this.timestream.dateEnd);)e.push({name:s.format("DD"),displayclass:0==s.day()||6==s.day()?"slds-theme_shade":""}),s.add(1,"d");break;case"Q":for(;t<3;){let s=(new moment).month(this.timestream.dateStart.month()+t);e.push({name:s.format("MMM")}),t++}break;case"y":for(;t<12;){let s=(new moment).month(t);e.push({name:s.format("MMM")}),t++}}return e}getPeriodStyle(){return{width:100/this.periods.length+"%"}}static ɵfac=function(e){return new(e||SpiceTimestreamHeader)(l.Y36(l.SBq),l.Y36(h.z))};static ɵcmp=l.Xpm({type:SpiceTimestreamHeader,selectors:[["","spice-timestream-header",""]],inputs:{timestream:"timestream"},attrs:f,decls:2,vars:1,consts:[[1,"slds-grid","slds-border--bottom",2,"height","100%"],["class","slds-border--right",3,"ngStyle","ngClass",4,"ngFor","ngForOf"],[1,"slds-border--right",3,"ngStyle","ngClass"],[1,"slds-align--absolute-center","slds-truncate",2,"height","100%"]],template:function(e,t){1&e&&(l.TgZ(0,"div",0),l.YNc(1,S,3,3,"div",1),l.qZA()),2&e&&(l.xp6(1),l.Q6J("ngForOf",t.periods))},dependencies:[i.mk,i.sg,i.PC],encapsulation:2})}return SpiceTimestreamHeader})();var x=s(5710),y=s(2294),v=s(3917),T=s(586),Z=s(1790);const w=["spice-timestream-label",""];let E=(()=>{class SpiceTimestreamLabel{elementRef;metadata;model;footer;item={};module={};constructor(e,t,s,i){this.elementRef=e,this.metadata=t,this.model=s,this.footer=i}ngOnInit(){this.model.module=this.module,this.model.id=this.item.id,this.model.setData(this.item)}static ɵfac=function(e){return new(e||SpiceTimestreamLabel)(l.Y36(l.SBq),l.Y36(c.Pu),l.Y36(x.o),l.Y36(v.M))};static ɵcmp=l.Xpm({type:SpiceTimestreamLabel,selectors:[["","spice-timestream-label",""]],inputs:{item:"item",module:"module"},features:[l._Bn([x.o,y.e])],attrs:w,decls:4,vars:4,consts:[[1,"slds-grid","slds-grid--align-spread","slds-grid_vertical-align-center"],["system-model-popover","",1,"slds-text-link_reset",3,"module","id"],[3,"buttonsize"]],template:function(e,t){1&e&&(l.TgZ(0,"div",0)(1,"div",1),l._uU(2),l.qZA(),l._UZ(3,"object-action-menu",2),l.qZA()),2&e&&(l.xp6(1),l.Q6J("module",t.model.module)("id",t.model.id),l.xp6(1),l.Oqu(t.item.name),l.xp6(1),l.Q6J("buttonsize","small"))},dependencies:[T.g,Z.g],encapsulation:2})}return SpiceTimestreamLabel})();var _=s(2656),Y=s(3463);let A=(()=>{class SpiceTimestreamSelector{userpreferences;focusDate=new moment;timestream;weekStartDay=0;constructor(e){this.userpreferences=e;let t=this.userpreferences.toUse;this.weekStartDay="Monday"==t.week_day_start?1:0}ngOnInit(){this.period="y"}get period(){return this.timestream.period}set period(e){switch(e){case"M":let e=moment(this.focusDate).month();this.timestream.dateStart=new moment(this.focusDate),this.timestream.dateStart.month(e),this.timestream.dateStart.date(1),this.timestream.dateStart.day(this.weekStartDay),this.timestream.dateStart.hour(0),this.timestream.dateStart.minute(0),this.timestream.dateEnd=new moment(this.focusDate),this.timestream.dateEnd.month(e),this.timestream.dateEnd.date(31),this.timestream.dateEnd.day(6),this.timestream.dateEnd.hour(23),this.timestream.dateEnd.minute(59),1==this.weekStartDay&&this.timestream.dateEnd.add(1,"days");break;case"Q":let t=moment(this.focusDate).month()+1;this.timestream.dateStart=new moment(this.focusDate),this.timestream.dateStart.month(3*Math.floor(t/3)),this.timestream.dateStart.date(1),this.timestream.dateStart.hour(0),this.timestream.dateStart.minute(0),this.timestream.dateEnd=new moment(this.focusDate),this.timestream.dateEnd.month(3*Math.floor(t/3)+3),this.timestream.dateEnd.date(31),this.timestream.dateEnd.hour(23),this.timestream.dateEnd.minute(59);break;case"y":this.timestream.dateStart=new moment(this.focusDate),this.timestream.dateStart.month(0),this.timestream.dateStart.date(1),this.timestream.dateStart.hour(0),this.timestream.dateStart.minute(0),this.timestream.dateEnd=new moment(this.focusDate),this.timestream.dateEnd.month(11),this.timestream.dateEnd.date(31),this.timestream.dateEnd.hour(23),this.timestream.dateEnd.minute(59)}this.timestream.period=e}get periodText(){switch(this.timestream.period){case"M":return moment(this.timestream.dateStart).day(6).format("MMM/Y");case"Q":return this.timestream.dateStart.format("Q/Y");case"y":return this.timestream.dateStart.format("Y")}}prev(){this.focusDate.subtract(1,this.timestream.period),this.period=this.timestream.period}next(){this.focusDate.add(1,this.timestream.period),this.period=this.timestream.period}static ɵfac=function(e){return new(e||SpiceTimestreamSelector)(l.Y36(h.z))};static ɵcmp=l.Xpm({type:SpiceTimestreamSelector,selectors:[["spice-timestream-selector"]],inputs:{timestream:"timestream"},decls:19,vars:4,consts:[[1,"slds-border--bottom","slds-p-vertical--xx-small","slds-p-horizontal--x-small",2,"height","40px"],[1,"slds-grid","slds-grid--align-spread","slds-grid_vertical-align-center"],[1,"slds-form-element","slds-size--1-of-2"],[1,"slds-form-element__control"],[1,"slds-select_container"],[1,"slds-select",3,"ngModel","ngModelChange"],["value","y"],["label","LBL_YEAR"],["value","Q"],["label","LBL_QUARTER"],["value","M"],["label","LBL_MONTH"],[1,"slds-grid"],[1,"slds-button","slds-button_icon",3,"click"],[3,"icon"],[1,"slds-p-horizontal--small"]],template:function(e,t){1&e&&(l.TgZ(0,"div",0)(1,"div",1)(2,"div",2)(3,"div",3)(4,"div",4)(5,"select",5),l.NdJ("ngModelChange",(function(e){return t.period=e})),l.TgZ(6,"option",6),l._UZ(7,"system-label",7),l.qZA(),l.TgZ(8,"option",8),l._UZ(9,"system-label",9),l.qZA(),l.TgZ(10,"option",10),l._UZ(11,"system-label",11),l.qZA()()()()(),l.TgZ(12,"div",12)(13,"button",13),l.NdJ("click",(function(){return t.prev()})),l._UZ(14,"system-button-icon",14),l.qZA(),l.TgZ(15,"div",15),l._uU(16),l.qZA(),l.TgZ(17,"button",13),l.NdJ("click",(function(){return t.next()})),l._UZ(18,"system-button-icon",14),l.qZA()()()()),2&e&&(l.xp6(5),l.Q6J("ngModel",t.period),l.xp6(9),l.Q6J("icon","left"),l.xp6(2),l.hij(" ",t.periodText," "),l.xp6(2),l.Q6J("icon","right"))},dependencies:[a.YN,a.Kr,a.EJ,a.JJ,a.On,_.J,Y._],encapsulation:2})}return SpiceTimestreamSelector})();var J=s(727),D=s(5329),M=s(2644),Q=s(1058);function O(e,t){if(1&e&&l._UZ(0,"div",9),2&e){const e=t.$implicit,s=l.oxw();l.Q6J("item",e)("module",s.modellist.module)}}function F(e,t){if(1&e&&l._UZ(0,"div",10),2&e){const e=t.$implicit,s=l.oxw();l.Q6J("timestream",s.timestream)("module",s.modellist.module)("element",e)}}let C=(()=>{class SpiceTimestream{language;userpreferences;modellist;cdRef;subscriptions=new J.w0;timestream={period:"y",dateStart:null,dateEnd:null};constructor(e,t,s,i){this.language=e,this.userpreferences=t,this.modellist=s,this.cdRef=i,this.subscriptions.add(this.modellist.listType$.subscribe((e=>this.handleListTypeChange(e)))),this.subscriptions.add(this.modellist.listDataChanged$.subscribe((()=>{this.cdRef.detectChanges()})))}ngOnInit(){this.modellist.buckets={},this.modellist.loadFromSession()||this.getListData()}ngOnDestroy(){this.subscriptions.unsubscribe()}getListData(){"all"!=this.modellist.currentList.id?this.modellist.getListData().subscribe((()=>this.cdRef.detectChanges())):this.modellist.resetListData()}handleListTypeChange(e){this.cdRef.detectChanges(),"SpiceTimestream"==e.listcomponent&&this.getListData()}static ɵfac=function(e){return new(e||SpiceTimestream)(l.Y36(D.d),l.Y36(h.z),l.Y36(M.t),l.Y36(l.sBO))};static ɵcmp=l.Xpm({type:SpiceTimestream,selectors:[["spice-timestream"]],decls:10,vars:4,consts:[[1,"slds-grid"],[1,"slds-border--right",2,"width","250px"],[3,"timestream"],[1,"slds-grow"],["spice-timestream-header","",2,"height","40px",3,"timestream"],[1,"slds-grid",3,"system-to-bottom"],["class","slds-border--bottom slds-p-vertical--xx-small slds-p-horizontal--x-small","style","height: 34px;","spice-timestream-label","",3,"item","module",4,"ngFor","ngForOf"],[1,"slds-grow","slds-theme--default"],["spice-timestream-item","","style","height: 34px;",3,"timestream","module","element",4,"ngFor","ngForOf"],["spice-timestream-label","",1,"slds-border--bottom","slds-p-vertical--xx-small","slds-p-horizontal--x-small",2,"height","34px",3,"item","module"],["spice-timestream-item","",2,"height","34px",3,"timestream","module","element"]],template:function(e,t){1&e&&(l.TgZ(0,"div",0)(1,"div",1),l._UZ(2,"spice-timestream-selector",2),l.qZA(),l.TgZ(3,"div",3),l._UZ(4,"div",4),l.qZA()(),l.TgZ(5,"div",5),l.NdJ("system-to-bottom",(function(){return t.modellist.loadMoreList()})),l.TgZ(6,"div",1),l.YNc(7,O,1,2,"div",6),l.qZA(),l.TgZ(8,"div",7),l.YNc(9,F,1,3,"div",8),l.qZA()()),2&e&&(l.xp6(2),l.Q6J("timestream",t.timestream),l.xp6(2),l.Q6J("timestream",t.timestream),l.xp6(3),l.Q6J("ngForOf",t.modellist.listData.list),l.xp6(2),l.Q6J("ngForOf",t.modellist.listData.list))},dependencies:[i.sg,Q.H,A,g,b,E],encapsulation:2,changeDetection:0})}return SpiceTimestream})();var q=s(9266);function k(e,t){if(1&e&&l._UZ(0,"div",7),2&e){const e=t.$implicit,s=l.oxw();l.Q6J("item",e)("module",s.module)}}function B(e,t){if(1&e&&l._UZ(0,"div",8),2&e){const e=t.$implicit,s=l.oxw();l.Q6J("timestream",s.timestream)("module",s.module)("element",e)}}let U=(()=>{class SpiceTimestreamEmbedded{language;userpreferences;modelutilities;metadata;module="";items={};timestream={period:"y",dateStart:null,dateEnd:null};subscriptions=new J.w0;constructor(e,t,s,i){this.language=e,this.userpreferences=t,this.modelutilities=s,this.metadata=i}ngOnDestroy(){this.subscriptions.unsubscribe()}static ɵfac=function(e){return new(e||SpiceTimestreamEmbedded)(l.Y36(D.d),l.Y36(h.z),l.Y36(q.A),l.Y36(c.Pu))};static ɵcmp=l.Xpm({type:SpiceTimestreamEmbedded,selectors:[["spice-timestream-embedded"]],inputs:{module:"module",items:"items"},decls:10,vars:4,consts:[[1,"slds-grid"],[1,"slds-border--right",2,"width","250px"],[3,"timestream"],[1,"slds-grow"],["spice-timestream-header","",2,"height","40px",3,"timestream"],["class","slds-border--bottom slds-p-vertical--xx-small slds-p-horizontal--x-small","style","height: 34px;","spice-timestream-label","",3,"item","module",4,"ngFor","ngForOf"],["spice-timestream-item","","style","height: 34px;",3,"timestream","module","element",4,"ngFor","ngForOf"],["spice-timestream-label","",1,"slds-border--bottom","slds-p-vertical--xx-small","slds-p-horizontal--x-small",2,"height","34px",3,"item","module"],["spice-timestream-item","",2,"height","34px",3,"timestream","module","element"]],template:function(e,t){1&e&&(l.TgZ(0,"div",0)(1,"div",1),l._UZ(2,"spice-timestream-selector",2),l.qZA(),l.TgZ(3,"div",3),l._UZ(4,"div",4),l.qZA()(),l.TgZ(5,"div",0)(6,"div",1),l.YNc(7,k,1,2,"div",5),l.qZA(),l.TgZ(8,"div",3),l.YNc(9,B,1,3,"div",6),l.qZA()()),2&e&&(l.xp6(2),l.Q6J("timestream",t.timestream),l.xp6(2),l.Q6J("timestream",t.timestream),l.xp6(3),l.Q6J("ngForOf",t.items),l.xp6(2),l.Q6J("ngForOf",t.items))},dependencies:[i.sg,A,g,b,E],encapsulation:2})}return SpiceTimestreamEmbedded})();var L=s(6040),N=s(3249),R=s(8652),z=s(4567);function I(e,t){if(1&e&&(l.ynx(0),l.TgZ(1,"div",3),l._UZ(2,"spice-timestream-embedded",4),l.qZA(),l.BQk()),2&e){const e=l.oxw();l.xp6(2),l.Q6J("items",e.relatedmodels.items)("module",e.relatedmodels.relatedModule)}}function j(e,t){1&e&&l._UZ(0,"system-illustration-no-access")}let P=(()=>{class SpiceTimestreamRelated extends N.s{language;metadata;relatedmodels;model;cdref;constructor(e,t,s,i,a){super(e,t,s,i,a),this.language=e,this.metadata=t,this.relatedmodels=s,this.model=i,this.cdref=a}static ɵfac=function(e){return new(e||SpiceTimestreamRelated)(l.Y36(D.d),l.Y36(c.Pu),l.Y36(L.j),l.Y36(x.o),l.Y36(l.sBO))};static ɵcmp=l.Xpm({type:SpiceTimestreamRelated,selectors:[["spice-timestream"]],features:[l._Bn([L.j]),l.qOj],decls:4,vars:3,consts:[[3,"componentconfig"],[4,"ngIf","ngIfElse"],["noaccess",""],[1,"slds-border--top"],[3,"items","module"]],template:function(e,t){if(1&e&&(l.TgZ(0,"object-related-card",0),l.YNc(1,I,3,2,"ng-container",1),l.YNc(2,j,1,0,"ng-template",null,2,l.W1O),l.qZA()),2&e){const e=l.MAs(3);l.Q6J("componentconfig",t.componentconfig),l.xp6(1),l.Q6J("ngIf",t.aclAccess)("ngIfElse",e)}},dependencies:[i.O5,R.E,z.s,U],encapsulation:2})}return SpiceTimestreamRelated})(),X=(()=>{class ModuleSpiceTimeStream{static ɵfac=function(e){return new(e||ModuleSpiceTimeStream)};static ɵmod=l.oAB({type:ModuleSpiceTimeStream});static ɵinj=l.cJS({imports:[i.ez,a.u5,r.ObjectFields,d.GlobalComponents,n.ObjectComponents,o.SystemComponents,m.o]})}return ModuleSpiceTimeStream})();("undefined"==typeof ngJitMode||ngJitMode)&&l.kYT(X,{declarations:[C,U,A,g,b,E,P],imports:[i.ez,a.u5,r.ObjectFields,d.GlobalComponents,n.ObjectComponents,o.SystemComponents,m.o]})}}]);