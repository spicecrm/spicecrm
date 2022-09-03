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
"use strict";(self.webpackChunkcore=self.webpackChunkcore||[]).push([["src_modules_opportunities_moduleopportunities_ts"],{2257:(e,t,n)=>{n.r(t),n.d(t,{ModuleOpportunities:()=>V});var i=n(6895),s=n(433),l=n(4357),o=n(3121),d=n(3283),a=n(4518),u=n(5478),r=n(1571);let p=(()=>{class OpportunityRevenueLinesActiveLinesPipe{transform(e){let t=[];for(let n of e)1!=n.deleted&&t.push(n);return t}}return OpportunityRevenueLinesActiveLinesPipe.ɵfac=function(e){return new(e||OpportunityRevenueLinesActiveLinesPipe)},OpportunityRevenueLinesActiveLinesPipe.ɵpipe=r.Yjl({name:"opportunityrevenuelinesactivelinespipe",type:OpportunityRevenueLinesActiveLinesPipe,pure:!1}),OpportunityRevenueLinesActiveLinesPipe})();var c=n(5329),m=n(4154),g=n(5710),h=n(1553),v=n(3463),f=n(2294),y=n(4044),L=n(3634),b=n(5638),_=n(2656),Z=n(7674);const A=["opportunity-revenue-line-item",""],R=function(){return{hidelabel:!0}};let O=(()=>{class OpportunityRevenueLineItem{constructor(e,t,n){this.model=e,this.view=t,this.language=n,this.update=new r.vpe,this.delete=new r.vpe,this.model.module="OpportunityRevenueLines",this.model.data$.subscribe((e=>{this.update.emit(!0)}))}ngOnChanges(){this.model.id=this.revenueLine.id,this.model.setData(this.revenueLine)}get disabled(){return!this.view.isEditMode()}deleteitem(){this.delete.emit(!0)}}return OpportunityRevenueLineItem.ɵfac=function(e){return new(e||OpportunityRevenueLineItem)(r.Y36(g.o),r.Y36(f.e),r.Y36(c.d))},OpportunityRevenueLineItem.ɵcmp=r.Xpm({type:OpportunityRevenueLineItem,selectors:[["","opportunity-revenue-line-item",""]],inputs:{revenueLine:"revenueLine",closeDate:"closeDate",totalAmount:"totalAmount"},outputs:{update:"update",delete:"delete"},features:[r._Bn([g.o]),r.TTD],attrs:A,decls:7,vars:7,consts:[["field","revenue_date","fielddisplayclass","fielddisplayclass",3,"fieldconfig"],["field","amount","fielddisplayclass","fielddisplayclass",3,"fieldconfig"],[1,"slds-button","slds-button_icon",3,"disabled","click"],["icon","clear"]],template:function(e,t){1&e&&(r.TgZ(0,"td"),r._UZ(1,"field-container",0),r.qZA(),r.TgZ(2,"td"),r._UZ(3,"field-container",1),r.qZA(),r.TgZ(4,"td")(5,"button",2),r.NdJ("click",(function(){return t.deleteitem()})),r._UZ(6,"system-button-icon",3),r.qZA()()),2&e&&(r.uIk("data-label",t.language.getFieldDisplayName("OpportunityRevenueLines","revenue_date")),r.xp6(1),r.Q6J("fieldconfig",r.DdM(5,R)),r.xp6(1),r.uIk("data-label",t.language.getFieldDisplayName("OpportunityRevenueLines","amount")),r.xp6(1),r.Q6J("fieldconfig",r.DdM(6,R)),r.xp6(2),r.Q6J("disabled",t.disabled))},dependencies:[L.j,_.J],encapsulation:2}),OpportunityRevenueLineItem})();function T(e,t){if(1&e){const e=r.EpF();r.TgZ(0,"tr",16),r.NdJ("update",(function(){r.CHM(e);const t=r.oxw(3);return r.KtG(t.revalidate())}))("delete",(function(){const t=r.CHM(e).$implicit,n=r.oxw(3);return r.KtG(n.deleteLine(t.id))})),r.qZA()}if(2&e){const e=t.$implicit,n=r.oxw(3);r.Q6J("revenueLine",e)("closeDate",n.closeDate)("totalAmount",n.totalAmount)}}function M(e,t){if(1&e&&(r.TgZ(0,"table",8)(1,"thead")(2,"tr",9)(3,"th",10)(4,"div",11),r._UZ(5,"system-label-fieldname",12),r.qZA()(),r.TgZ(6,"th",10)(7,"div",11),r._UZ(8,"system-label-fieldname",13),r.qZA()(),r._UZ(9,"th",14),r.qZA()(),r.TgZ(10,"tbody"),r.YNc(11,T,1,3,"tr",15),r.ALo(12,"opportunityrevenuelinesactivelinespipe"),r.qZA()()),2&e){const e=r.oxw(2);r.xp6(11),r.Q6J("ngForOf",r.lcZ(12,1,e.revenueLines))}}function E(e,t){if(1&e){const e=r.EpF();r.TgZ(0,"div",17)(1,"div",18),r._UZ(2,"field-messages",19),r.qZA(),r.TgZ(3,"div",20)(4,"button",21),r.NdJ("click",(function(){r.CHM(e);const t=r.oxw(2);return r.KtG(t.addLine())})),r._UZ(5,"system-button-icon",22),r.qZA()()()}2&e&&(r.xp6(5),r.Q6J("icon","add"))}const C=function(){return{readonly:!0}};function N(e,t){if(1&e&&(r.TgZ(0,"div")(1,"div",2),r._UZ(2,"field-container",3)(3,"field-container",4)(4,"field-container",5),r.qZA(),r.YNc(5,M,13,3,"table",6),r.YNc(6,E,6,1,"div",7),r.qZA()),2&e){const e=r.oxw();r.xp6(2),r.Q6J("fieldconfig",r.DdM(5,C)),r.xp6(1),r.Q6J("fieldconfig",r.DdM(6,C)),r.xp6(1),r.Q6J("fieldconfig",r.DdM(7,C)),r.xp6(1),r.Q6J("ngIf",e.hasActiveLines),r.xp6(1),r.Q6J("ngIf",e.isEditing)}}function U(e,t){if(1&e){const e=r.EpF();r.TgZ(0,"div",23)(1,"button",24),r.NdJ("click",(function(){r.CHM(e);const t=r.oxw();return r.KtG(t.initalizeLines())})),r._uU(2,"initialize"),r.qZA()()}if(2&e){const e=r.oxw();r.xp6(1),r.Q6J("disabled",!e.view.isEditMode())}}let J=(()=>{class OpportunityRevenueLines{constructor(e,t,n,i,s,l,o){this.language=e,this.metadata=t,this.model=n,this.view=i,this.modal=s,this.changeDetectorRef=l,this.viewContainerRef=o,this.revenueLines=[],this.model.data$.subscribe((e=>{this.loadRevenueLines(),this.checkCloseDate(),this.checkAmount(),this.checkConsistency()})),this.view.mode$.subscribe((e=>{this.loadRevenueLines(),this.checkConsistency()}))}ngOnInit(){this.loadRevenueLines(),this.checkCloseDate(),this.checkAmount(),this.checkConsistency()}get canSplit(){return this.closeDate&&this.totalAmount}get hasActiveLines(){return this.revenueLines.filter((e=>1!=e.deleted)).length>0}loadRevenueLines(){this.revenueLines=[];let e=this.model.getRelatedRecords("opportunityrevenuelines");for(let t of e)this.revenueLines.push(t);this.sortRevenueLines()}checkConsistency(){if(this.view.isEditMode()){let e=this.model.getField("amount");switch(this.model.getFieldValue("opportunityrevenuesplit")){case"split":let t=0;for(let e of this.revenueLines)1!=e.deleted&&(t+=e.amount);e!=t?this.model.setFieldMessage("error","total amount does not match","opportunityrevenuelines","opportunityrevenuelines"):this.model.resetFieldMessages("opportunityrevenuelines");break;case"rampup":let n=this.revenueLines.filter((e=>1!=e.delete)).slice(-1).pop();n&&n.amount==e?this.model.resetFieldMessages("opportunityrevenuelines"):this.model.setFieldMessage("error","rampup amount does not match","opportunityrevenuelines","opportunityrevenuelines");break;default:this.model.resetFieldMessages("opportunityrevenuelines")}}}checkCloseDate(){this.closeDate?"none"==this.model.getFieldValue("opportunityrevenuesplit")||this.model.getFieldValue("date_closed").isSame(this.closeDate,"day")||this.modal.confirm(this.language.getLabel("MSG_UPDATE_CHANGED_DATE",null,"long"),this.language.getLabel("MSG_UPDATE_CHANGED_DATE"),"shade").subscribe((e=>{if(e){let e=moment.duration(this.model.getFieldValue("date_closed").diff(this.closeDate));for(let t of this.revenueLines)1!=t.deleted&&t.revenue_date.add(e);this.changeDetectorRef.detectChanges()}this.closeDate=this.model.getFieldValue("date_closed")})):this.closeDate=this.model.getFieldValue("date_closed")}checkAmount(){this.totalAmount?"none"!=this.model.getFieldValue("opportunityrevenuesplit")&&this.model.getFieldValue("amount")!=this.totalAmount&&this.modal.confirm(this.language.getLabel("MSG_UPDATE_CHANGED_AMOUNT",null,"long"),this.language.getLabel("MSG_UPDATE_CHANGED_AMOUNT"),"shade").subscribe((e=>{if(e){let e=this.model.getFieldValue("amount")/this.totalAmount;for(let t of this.revenueLines)1!=t.deleted&&(t.amount=Math.round(t.amount*e*100)/100);this.changeDetectorRef.detectChanges()}this.totalAmount=this.model.getFieldValue("amount"),this.checkConsistency()})):this.totalAmount=this.model.getFieldValue("amount")}sortRevenueLines(){this.revenueLines.sort(((e,t)=>new moment(e.revenue_date).isBefore(new moment(t.revenue_date))?-1:1))}get fieldMessages(){if(this.view.isEditMode()){let e=this.model.getFieldMessages("opportunityrevenuelines");return e||[]}return[]}revalidate(){this.loadRevenueLines(),this.checkConsistency()}get isEditing(){return this.view.isEditMode()}initalizeLines(){this.modal.openModal("OpportunityRevenueLinesCreator",!0,this.viewContainerRef.injector).subscribe((e=>{e.instance.generatorResult.subscribe((e=>{this.model.setField("opportunityrevenuesplit",e.opportunityrevenuesplit),this.model.setRelatedRecords("opportunityrevenuelines",e.revenueLines),this.loadRevenueLines(),this.checkConsistency()}))}))}addLine(){let e={id:this.model.utils.generateGuid(),amount:0,amount_usdollar:0,amount_base:0,revenue_date:this.closeDate,deleted:!1};this.revenueLines.push(e),this.sortRevenueLines(),this.model.setRelatedRecords("opportunityrevenuelines",this.revenueLines)}deleteLine(e){this.revenueLines.some((t=>{if(t.id==e)return t.deleted=!0,this.model.setRelatedRecords("opportunityrevenuelines",this.revenueLines),!0;0})),this.hasActiveLines?(this.loadRevenueLines(),this.checkConsistency()):(this.model.setField("opportunityrevenuesplit","none"),this.checkConsistency())}}return OpportunityRevenueLines.ɵfac=function(e){return new(e||OpportunityRevenueLines)(r.Y36(c.d),r.Y36(m.Pu),r.Y36(g.o),r.Y36(f.e),r.Y36(y.o),r.Y36(r.sBO),r.Y36(r.s_b))},OpportunityRevenueLines.ɵcmp=r.Xpm({type:OpportunityRevenueLines,selectors:[["opportunity-revenue-lines"]],decls:3,vars:2,consts:[[4,"ngIf","ngIfElse"],["initialize",""],[1,"slds-p-around--x-small","slds-grid","slds-grid--vertical-align-center","slds-grid--align-spread"],["field","opportunityrevenuesplit",3,"fieldconfig"],["field","amount",3,"fieldconfig"],["field","date_closed",3,"fieldconfig"],["class","slds-table slds-table_cell-buffer slds-table_bordered",4,"ngIf"],["class","slds-p-around--small slds-grid slds-grid--vertical-align-center slds-grid--align-spread slds-wrap",4,"ngIf"],[1,"slds-table","slds-table_cell-buffer","slds-table_bordered"],[1,"slds-line-height_reset"],["scope","col",1,""],[1,"slds-truncate"],["module","OpportunityRevenueLines","field","revenue_date"],["module","OpportunityRevenueLines","field","amount"],["scope","col",1,"slds-cell-shrink"],["class","slds-hint-parent","opportunity-revenue-line-item","",3,"revenueLine","closeDate","totalAmount","update","delete",4,"ngFor","ngForOf"],["opportunity-revenue-line-item","",1,"slds-hint-parent",3,"revenueLine","closeDate","totalAmount","update","delete"],[1,"slds-p-around--small","slds-grid","slds-grid--vertical-align-center","slds-grid--align-spread","slds-wrap"],[1,"slds-size--1-of-1","slds-large-size--1-of-2"],["fieldname","opportunityrevenuelines"],[1,"slds-size--1-of-1","slds-large-size--1-of-2","slds-text-align--right"],[1,"slds-button","slds-button_icon","slds-button_icon","slds-button--icon-border",3,"click"],[3,"icon"],[1,"slds-p-around--small","slds-align--absolute-center"],[1,"slds-button","slds-button--neutral",3,"disabled","click"]],template:function(e,t){if(1&e&&(r.YNc(0,N,7,8,"div",0),r.YNc(1,U,3,1,"ng-template",null,1,r.W1O)),2&e){const e=r.MAs(2);r.Q6J("ngIf",t.hasActiveLines)("ngIfElse",e)}},dependencies:[i.sg,i.O5,L.j,b.a,_.J,Z.h,O,p],encapsulation:2}),OpportunityRevenueLines})();function D(e,t){1&e&&(r.TgZ(0,"div"),r._UZ(1,"opportunity-revenue-lines"),r.qZA())}function w(e,t){1&e&&(r.TgZ(0,"div",3),r._UZ(1,"system-label",4),r.qZA())}let x=(()=>{class OpportunityRevenueLinesTab{constructor(e,t,n){this.language=e,this.metadata=t,this.model=n}ngOnInit(){}get canSplit(){return this.model.getFieldValue("amount")&&this.model.getFieldValue("date_closed")}}return OpportunityRevenueLinesTab.ɵfac=function(e){return new(e||OpportunityRevenueLinesTab)(r.Y36(c.d),r.Y36(m.Pu),r.Y36(g.o))},OpportunityRevenueLinesTab.ɵcmp=r.Xpm({type:OpportunityRevenueLinesTab,selectors:[["ng-component"]],decls:4,vars:2,consts:[["tabtitle","LBL_OPPORTUNITYREVENUELINES"],[4,"ngIf","ngIfElse"],["notready",""],[1,"slds-p-around--small","slds-align--absolute-center"],["label","MSG_ENTERDATEANDAMOUNT"]],template:function(e,t){if(1&e&&(r.TgZ(0,"system-collapsable-tab",0),r.YNc(1,D,2,0,"div",1),r.YNc(2,w,2,0,"ng-template",null,2,r.W1O),r.qZA()),2&e){const e=r.MAs(3);r.xp6(1),r.Q6J("ngIf",t.canSplit)("ngIfElse",e)}},dependencies:[i.O5,h.z,v._,J],encapsulation:2}),OpportunityRevenueLinesTab})();var F=n(6367),k=n(9062),q=n(9621),Y=n(3499),I=n(5767),P=n(1916);function Q(e,t){if(1&e){const e=r.EpF();r.TgZ(0,"tr",47),r.NdJ("delete",(function(){const t=r.CHM(e).$implicit,n=r.oxw();return r.KtG(n.deleteLine(t.id))})),r.qZA()}if(2&e){const e=t.$implicit,n=r.oxw();r.Q6J("revenueLine",e)("closeDate",n.model.data.date_closed)("totalAmount",n.model.data.amount)}}let G=(()=>{class OpportunityRevenueLinesCreator{constructor(e,t,n){this.language=e,this.metadata=t,this.model=n,this.revenueLines=[],this.splittype="split",this.nooflines=1,this.periodcount=1,this.periodtype="M",this.generatorResult=new r.vpe,this.componentconfig=this.metadata.getComponentConfig("OpportunityRevenueLinesCreator","OpportunityRevenueLines"),this.generate()}get canGenerate(){return this.nooflines&&this.periodcount}close(){this.self.destroy()}generate(){this.revenueLines=[];let e=new moment(this.model.getFieldValue("date_closed")),t=0;for(;t<this.nooflines;){let n=this.model.getFieldValue("amount")/this.nooflines;"rampup"==this.splittype&&(n*=t+1);let i={id:this.model.utils.generateGuid(),amount:n,revenue_date:new moment(e),deleted:!1};this.revenueLines.push(i),e.add(this.periodcount,this.periodtype),t++}}deleteLine(e){this.revenueLines.some((t=>{if(t.id==e)return t.deleted=!0,this.model.setRelatedRecords("opportunityrevenuelines",this.revenueLines),!0;0}))}save(){this.generatorResult.emit({opportunityrevenuesplit:this.splittype,revenueLines:this.revenueLines}),this.close()}}return OpportunityRevenueLinesCreator.ɵfac=function(e){return new(e||OpportunityRevenueLinesCreator)(r.Y36(c.d),r.Y36(m.Pu),r.Y36(g.o))},OpportunityRevenueLinesCreator.ɵcmp=r.Xpm({type:OpportunityRevenueLinesCreator,selectors:[["ng-component"]],decls:69,vars:11,consts:[[3,"close"],["label","LBL_OPPORTUNITYREVENUELINES"],["margin","none",3,"grow"],["tabtitle","LBL_OPPORTUNITY"],[1,"slds-p-around--small"],[3,"fieldset"],["tabtitle","LBL_GENERATOR"],[1,"slds-grid","slds-grid--vertical-align-center","slds-gutters_direct-x-small"],["fieldname","opportunityrevenuesplit"],[1,"slds-col","slds-grid","slds-grid--vertical-align-center"],[1,"slds-radio"],["type","radio","id","splittypesplit","value","split","name","splittype",3,"ngModel","ngModelChange"],["for","splittypesplit",1,"slds-radio__label"],[1,"slds-radio_faux"],[1,"slds-form-element__label"],["label","LBL_SPLIT"],["type","radio","id","splittyperampup","value","rampup","name","splittype",3,"ngModel","ngModelChange"],["for","splittyperampup",1,"slds-radio__label"],["label","LBL_RAMPUP"],[1,"slds-col"],[1,"slds-form-element"],[1,"slds-form-element__control"],["type","text",1,"slds-input",3,"placeholder","ngModel","ngModelChange"],["label","LBL_EVERY"],["label","LBL_PERIOD"],[1,"slds-select_container"],[1,"slds-select",3,"ngModel","ngModelChange"],["value","M"],["label","LBL_MONTH"],["value","y"],["label","LBL_YEAR"],[1,"slds-p-top--x-small","slds-text-align_right"],[1,"slds-button","slds-button--brand",3,"disabled","click"],["label","LBL_GENERATE"],["tabtitle","LBL_OPPORTUNITYREVENUELINES"],[1,"slds-table","slds-table_cell-buffer","slds-table_bordered"],[1,"slds-line-height_reset"],["scope","col",1,""],[1,"slds-truncate"],["module","OpportunityRevenueLines","field","revenue_date"],["module","OpportunityRevenueLines","field","amount"],["scope","col",1,"slds-cell-shrink"],["class","slds-hint-parent","opportunity-revenue-line-item","",3,"revenueLine","closeDate","totalAmount","delete",4,"ngFor","ngForOf"],[1,"slds-button","slds-button--neutral",3,"click"],["label","LBL_CLOSE"],[1,"slds-button","slds-button--brand",3,"click"],["label","LBL_OK"],["opportunity-revenue-line-item","",1,"slds-hint-parent",3,"revenueLine","closeDate","totalAmount","delete"]],template:function(e,t){1&e&&(r.TgZ(0,"system-modal")(1,"system-modal-header",0),r.NdJ("close",(function(){return t.close()})),r._UZ(2,"system-label",1),r.qZA(),r.TgZ(3,"system-modal-content",2)(4,"system-collapsable-tab",3)(5,"div",4),r._UZ(6,"object-record-fieldset",5),r.qZA()(),r.TgZ(7,"system-collapsable-tab",6)(8,"div",4)(9,"div",7)(10,"div"),r._UZ(11,"field-label",8),r.TgZ(12,"div",9)(13,"div",10)(14,"input",11),r.NdJ("ngModelChange",(function(e){return t.splittype=e})),r.qZA(),r.TgZ(15,"label",12),r._UZ(16,"span",13),r.TgZ(17,"span",14),r._UZ(18,"system-label",15),r.qZA()()(),r.TgZ(19,"div",10)(20,"input",16),r.NdJ("ngModelChange",(function(e){return t.splittype=e})),r.qZA(),r.TgZ(21,"label",17),r._UZ(22,"span",13),r.TgZ(23,"span",14),r._UZ(24,"system-label",18),r.qZA()()()()(),r.TgZ(25,"div",19)(26,"div",20)(27,"label",14),r._UZ(28,"system-label",1),r.qZA(),r.TgZ(29,"div",21)(30,"input",22),r.NdJ("ngModelChange",(function(e){return t.nooflines=e})),r.qZA()()()(),r.TgZ(31,"div",19)(32,"div",20)(33,"label",14),r._UZ(34,"system-label",23),r.qZA(),r.TgZ(35,"div",21)(36,"input",22),r.NdJ("ngModelChange",(function(e){return t.periodcount=e})),r.qZA()()()(),r.TgZ(37,"div",19)(38,"div",20)(39,"label",14),r._UZ(40,"system-label",24),r.qZA(),r.TgZ(41,"div",21)(42,"div",25)(43,"select",26),r.NdJ("ngModelChange",(function(e){return t.periodtype=e})),r.TgZ(44,"option",27),r._UZ(45,"system-label",28),r.qZA(),r.TgZ(46,"option",29),r._UZ(47,"system-label",30),r.qZA()()()()()()(),r.TgZ(48,"div",31)(49,"button",32),r.NdJ("click",(function(){return t.generate()})),r._UZ(50,"system-label",33),r.qZA()()()(),r.TgZ(51,"system-collapsable-tab",34)(52,"table",35)(53,"thead")(54,"tr",36)(55,"th",37)(56,"div",38),r._UZ(57,"system-label-fieldname",39),r.qZA()(),r.TgZ(58,"th",37)(59,"div",38),r._UZ(60,"system-label-fieldname",40),r.qZA()(),r._UZ(61,"th",41),r.qZA()(),r.TgZ(62,"tbody"),r.YNc(63,Q,1,3,"tr",42),r.qZA()()()(),r.TgZ(64,"system-modal-footer")(65,"button",43),r.NdJ("click",(function(){return t.close()})),r._UZ(66,"system-label",44),r.qZA(),r.TgZ(67,"button",45),r.NdJ("click",(function(){return t.save()})),r._UZ(68,"system-label",46),r.qZA()()()),2&e&&(r.xp6(3),r.Q6J("grow",!0),r.xp6(3),r.Q6J("fieldset",t.componentconfig.fieldset),r.xp6(8),r.Q6J("ngModel",t.splittype),r.xp6(6),r.Q6J("ngModel",t.splittype),r.xp6(10),r.Q6J("placeholder",t.language.getLabel("LBL_OPPORTUNITYREVENUELINES"))("ngModel",t.nooflines),r.xp6(6),r.Q6J("placeholder",t.language.getLabel("LBL_EVERY"))("ngModel",t.periodcount),r.xp6(7),r.Q6J("ngModel",t.periodtype),r.xp6(6),r.Q6J("disabled",!t.canGenerate),r.xp6(14),r.Q6J("ngForOf",t.revenueLines))},dependencies:[i.sg,s.YN,s.Kr,s.Fj,s.EJ,s._,s.JJ,s.On,F.q,k.d,h.z,v._,Z.h,q.j,Y.x,I.p,P.y,O],encapsulation:2}),OpportunityRevenueLinesCreator})(),V=(()=>{class ModuleOpportunities{}return ModuleOpportunities.ɵfac=function(e){return new(e||ModuleOpportunities)},ModuleOpportunities.ɵmod=r.oAB({type:ModuleOpportunities}),ModuleOpportunities.ɵinj=r.cJS({imports:[i.ez,s.u5,o.ObjectFields,d.GlobalComponents,a.ObjectComponents,u.SystemComponents,l.o]}),ModuleOpportunities})();("undefined"==typeof ngJitMode||ngJitMode)&&r.kYT(V,{declarations:[p,x,J,G,O],imports:[i.ez,s.u5,o.ObjectFields,d.GlobalComponents,a.ObjectComponents,u.SystemComponents,l.o]})}}]);