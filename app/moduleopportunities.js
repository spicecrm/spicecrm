/*!
 * 
 *                     SpiceCRM
 *
 *                     release: 2024.01.001
 *
 *                     date: 2024-06-07 18:53:45
 *
 *                     build: 2024.01.001.1717779225604
 *
 */
"use strict";(self.webpackChunkcore=self.webpackChunkcore||[]).push([["src_modules_opportunities_moduleopportunities_ts"],{71647:(e,t,s)=>{s.r(t),s.d(t,{ModuleOpportunities:()=>S});var n=s(60177),i=s(84341),l=s(71341),o=s(7745),d=s(12948),a=s(37328),r=s(70569),u=s(54438);let c=(()=>{class OpportunityRevenueLinesActiveLinesPipe{transform(e){let t=[];for(let s of e)1!=s.deleted&&t.push(s);return t}static#e=this.ɵfac=function(e){return new(e||OpportunityRevenueLinesActiveLinesPipe)};static#t=this.ɵpipe=u.EJ8({name:"opportunityrevenuelinesactivelinespipe",type:OpportunityRevenueLinesActiveLinesPipe,pure:!1})}return OpportunityRevenueLinesActiveLinesPipe})();var p=s(69904),m=s(83935),h=s(35911),g=s(2187),v=s(32062),f=s(41731),b=s(50531),y=s(15091),L=s(89166),R=s(25863),_=s(45915);const k=["opportunity-revenue-line-item",""],O=()=>({hidelabel:!0});let E=(()=>{class OpportunityRevenueLineItem{constructor(e,t,s){this.model=e,this.view=t,this.language=s,this.update=new u.bkB,this.delete=new u.bkB,this.model.module="OpportunityRevenueLines",this.model.data$.subscribe((e=>{this.update.emit(!0)}))}ngOnChanges(){this.model.id=this.revenueLine.id,this.model.setData(this.revenueLine)}get disabled(){return!this.view.isEditMode()}deleteitem(){this.delete.emit(!0)}static#e=this.ɵfac=function(e){return new(e||OpportunityRevenueLineItem)(u.rXU(h.g),u.rXU(f.U),u.rXU(p.B))};static#t=this.ɵcmp=u.VBU({type:OpportunityRevenueLineItem,selectors:[["","opportunity-revenue-line-item",""]],inputs:{revenueLine:"revenueLine",closeDate:"closeDate",totalAmount:"totalAmount"},outputs:{update:"update",delete:"delete"},features:[u.Jv_([h.g]),u.OA$],attrs:k,decls:7,vars:7,consts:[["field","revenue_date","fielddisplayclass","fielddisplayclass",3,"fieldconfig"],["field","amount","fielddisplayclass","fielddisplayclass",3,"fieldconfig"],[1,"slds-button","slds-button_icon",3,"disabled","click"],["icon","clear"]],template:function(e,t){1&e&&(u.j41(0,"td"),u.nrm(1,"field-container",0),u.k0s(),u.j41(2,"td"),u.nrm(3,"field-container",1),u.k0s(),u.j41(4,"td")(5,"button",2),u.bIt("click",(function(){return t.deleteitem()})),u.nrm(6,"system-button-icon",3),u.k0s()()),2&e&&(u.BMQ("data-label",t.language.getFieldDisplayName("OpportunityRevenueLines","revenue_date")),u.R7$(),u.Y8G("fieldconfig",u.lJ4(5,O)),u.R7$(),u.BMQ("data-label",t.language.getFieldDisplayName("OpportunityRevenueLines","amount")),u.R7$(),u.Y8G("fieldconfig",u.lJ4(6,O)),u.R7$(2),u.Y8G("disabled",t.disabled))},dependencies:[y.y,R.t],encapsulation:2})}return OpportunityRevenueLineItem})();function M(e,t){if(1&e){const e=u.RV6();u.j41(0,"tr",16),u.bIt("update",(function(){u.eBV(e);const t=u.XpG(3);return u.Njj(t.revalidate())}))("delete",(function(){const t=u.eBV(e).$implicit,s=u.XpG(3);return u.Njj(s.deleteLine(t.id))})),u.k0s()}if(2&e){const e=t.$implicit,s=u.XpG(3);u.Y8G("revenueLine",e)("closeDate",s.closeDate)("totalAmount",s.totalAmount)}}function j(e,t){if(1&e&&(u.j41(0,"table",8)(1,"thead")(2,"tr",9)(3,"th",10)(4,"div",11),u.nrm(5,"system-label-fieldname",12),u.k0s()(),u.j41(6,"th",10)(7,"div",11),u.nrm(8,"system-label-fieldname",13),u.k0s()(),u.nrm(9,"th",14),u.k0s()(),u.j41(10,"tbody"),u.DNE(11,M,1,3,"tr",15),u.nI1(12,"opportunityrevenuelinesactivelinespipe"),u.k0s()()),2&e){const e=u.XpG(2);u.R7$(11),u.Y8G("ngForOf",u.bMT(12,1,e.revenueLines))}}function C(e,t){if(1&e){const e=u.RV6();u.j41(0,"div",17)(1,"div",18),u.nrm(2,"field-messages",19),u.k0s(),u.j41(3,"div",20)(4,"button",21),u.bIt("click",(function(){u.eBV(e);const t=u.XpG(2);return u.Njj(t.addLine())})),u.nrm(5,"system-button-icon",22),u.k0s()()()}2&e&&(u.R7$(5),u.Y8G("icon","add"))}const D=()=>({readonly:!0});function G(e,t){if(1&e&&(u.j41(0,"div")(1,"div",2),u.nrm(2,"field-container",3)(3,"field-container",4)(4,"field-container",5),u.k0s(),u.DNE(5,j,13,3,"table",6)(6,C,6,1,"div",7),u.k0s()),2&e){const e=u.XpG();u.R7$(2),u.Y8G("fieldconfig",u.lJ4(5,D)),u.R7$(),u.Y8G("fieldconfig",u.lJ4(6,D)),u.R7$(),u.Y8G("fieldconfig",u.lJ4(7,D)),u.R7$(),u.Y8G("ngIf",e.hasActiveLines),u.R7$(),u.Y8G("ngIf",e.isEditing)}}function A(e,t){if(1&e){const e=u.RV6();u.j41(0,"div",23)(1,"button",24),u.bIt("click",(function(){u.eBV(e);const t=u.XpG();return u.Njj(t.initalizeLines())})),u.EFF(2,"initialize"),u.k0s()()}if(2&e){const e=u.XpG();u.R7$(),u.Y8G("disabled",!e.view.isEditMode())}}let I=(()=>{class OpportunityRevenueLines{constructor(e,t,s,n,i,l,o){this.language=e,this.metadata=t,this.model=s,this.view=n,this.modal=i,this.changeDetectorRef=l,this.viewContainerRef=o,this.revenueLines=[],this.model.data$.subscribe((e=>{this.loadRevenueLines(),this.checkCloseDate(),this.checkAmount(),this.checkConsistency()})),this.view.mode$.subscribe((e=>{this.loadRevenueLines(),this.checkConsistency()}))}ngOnInit(){this.loadRevenueLines(),this.checkCloseDate(),this.checkAmount(),this.checkConsistency()}get canSplit(){return this.closeDate&&this.totalAmount}get hasActiveLines(){return this.revenueLines.filter((e=>1!=e.deleted)).length>0}loadRevenueLines(){this.revenueLines=[];let e=this.model.getRelatedRecords("opportunityrevenuelines");for(let t of e)this.revenueLines.push(t);this.sortRevenueLines()}checkConsistency(){if(this.view.isEditMode()){let e=this.model.getField("amount");switch(this.model.getFieldValue("opportunityrevenuesplit")){case"split":let t=0;for(let e of this.revenueLines)1!=e.deleted&&(t+=e.amount);e!=t?this.model.setFieldMessage("error","total amount does not match","opportunityrevenuelines","opportunityrevenuelines"):this.model.resetFieldMessages("opportunityrevenuelines");break;case"rampup":let s=this.revenueLines.filter((e=>1!=e.delete)).slice(-1).pop();s&&s.amount==e?this.model.resetFieldMessages("opportunityrevenuelines"):this.model.setFieldMessage("error","rampup amount does not match","opportunityrevenuelines","opportunityrevenuelines");break;default:this.model.resetFieldMessages("opportunityrevenuelines")}}}checkCloseDate(){this.closeDate?"none"==this.model.getFieldValue("opportunityrevenuesplit")||this.model.getFieldValue("date_closed").isSame(this.closeDate,"day")||this.modal.confirm(this.language.getLabel("MSG_UPDATE_CHANGED_DATE",null,"long"),this.language.getLabel("MSG_UPDATE_CHANGED_DATE"),"shade").subscribe((e=>{if(e){let e=moment.duration(this.model.getFieldValue("date_closed").diff(this.closeDate));for(let t of this.revenueLines)1!=t.deleted&&t.revenue_date.add(e);this.changeDetectorRef.detectChanges()}this.closeDate=this.model.getFieldValue("date_closed")})):this.closeDate=this.model.getFieldValue("date_closed")}checkAmount(){this.totalAmount?"none"!=this.model.getFieldValue("opportunityrevenuesplit")&&this.model.getFieldValue("amount")!=this.totalAmount&&this.modal.confirm(this.language.getLabel("MSG_UPDATE_CHANGED_AMOUNT",null,"long"),this.language.getLabel("MSG_UPDATE_CHANGED_AMOUNT"),"shade").subscribe((e=>{if(e){let e=this.model.getFieldValue("amount")/this.totalAmount;for(let t of this.revenueLines)1!=t.deleted&&(t.amount=Math.round(t.amount*e*100)/100);this.changeDetectorRef.detectChanges()}this.totalAmount=this.model.getFieldValue("amount"),this.checkConsistency()})):this.totalAmount=this.model.getFieldValue("amount")}sortRevenueLines(){this.revenueLines.sort(((e,t)=>new moment(e.revenue_date).isBefore(new moment(t.revenue_date))?-1:1))}get fieldMessages(){if(this.view.isEditMode()){let e=this.model.getFieldMessages("opportunityrevenuelines");return e||[]}return[]}revalidate(){this.loadRevenueLines(),this.checkConsistency()}get isEditing(){return this.view.isEditMode()}initalizeLines(){this.modal.openModal("OpportunityRevenueLinesCreator",!0,this.viewContainerRef.injector).subscribe((e=>{e.instance.generatorResult.subscribe((e=>{this.model.setField("opportunityrevenuesplit",e.opportunityrevenuesplit),this.model.setRelatedRecords("opportunityrevenuelines",e.revenueLines),this.loadRevenueLines(),this.checkConsistency()}))}))}addLine(){let e={id:this.model.utils.generateGuid(),amount:0,amount_usdollar:0,amount_base:0,revenue_date:this.closeDate,deleted:!1};this.revenueLines.push(e),this.sortRevenueLines(),this.model.setRelatedRecords("opportunityrevenuelines",this.revenueLines)}deleteLine(e){this.revenueLines.some((t=>{if(t.id==e)return t.deleted=!0,this.model.setRelatedRecords("opportunityrevenuelines",this.revenueLines),!0;0})),this.hasActiveLines?(this.loadRevenueLines(),this.checkConsistency()):(this.model.setField("opportunityrevenuesplit","none"),this.checkConsistency())}static#e=this.ɵfac=function(e){return new(e||OpportunityRevenueLines)(u.rXU(p.B),u.rXU(m.yu),u.rXU(h.g),u.rXU(f.U),u.rXU(b.y),u.rXU(u.gRc),u.rXU(u.c1b))};static#t=this.ɵcmp=u.VBU({type:OpportunityRevenueLines,selectors:[["opportunity-revenue-lines"]],decls:3,vars:2,consts:[[4,"ngIf","ngIfElse"],["initialize",""],[1,"slds-p-around--x-small","slds-grid","slds-grid--vertical-align-center","slds-grid--align-spread"],["field","opportunityrevenuesplit",3,"fieldconfig"],["field","amount",3,"fieldconfig"],["field","date_closed",3,"fieldconfig"],["class","slds-table slds-table_cell-buffer slds-table_bordered",4,"ngIf"],["class","slds-p-around--small slds-grid slds-grid--vertical-align-center slds-grid--align-spread slds-wrap",4,"ngIf"],[1,"slds-table","slds-table_cell-buffer","slds-table_bordered"],[1,"slds-line-height_reset"],["scope","col",1,""],[1,"slds-truncate"],["module","OpportunityRevenueLines","field","revenue_date"],["module","OpportunityRevenueLines","field","amount"],["scope","col",1,"slds-cell-shrink"],["class","slds-hint-parent","opportunity-revenue-line-item","",3,"revenueLine","closeDate","totalAmount","update","delete",4,"ngFor","ngForOf"],["opportunity-revenue-line-item","",1,"slds-hint-parent",3,"revenueLine","closeDate","totalAmount","update","delete"],[1,"slds-p-around--small","slds-grid","slds-grid--vertical-align-center","slds-grid--align-spread","slds-wrap"],[1,"slds-size--1-of-1","slds-large-size--1-of-2"],["fieldname","opportunityrevenuelines"],[1,"slds-size--1-of-1","slds-large-size--1-of-2","slds-text-align--right"],[1,"slds-button","slds-button_icon","slds-button_icon","slds-button--icon-border",3,"click"],[3,"icon"],[1,"slds-p-around--small","slds-align--absolute-center"],[1,"slds-button","slds-button--neutral",3,"disabled","click"]],template:function(e,t){if(1&e&&u.DNE(0,G,7,8,"div",0)(1,A,3,1,"ng-template",null,1,u.C5r),2&e){const e=u.sdS(2);u.Y8G("ngIf",t.hasActiveLines)("ngIfElse",e)}},dependencies:[n.Sq,n.bT,y.y,L.A,R.t,_.P,E,c],encapsulation:2})}return OpportunityRevenueLines})();function N(e,t){1&e&&(u.j41(0,"div"),u.nrm(1,"opportunity-revenue-lines"),u.k0s())}function U(e,t){1&e&&(u.j41(0,"div",3),u.nrm(1,"system-label",4),u.k0s())}let F=(()=>{class OpportunityRevenueLinesTab{constructor(e,t,s){this.language=e,this.metadata=t,this.model=s}ngOnInit(){}get canSplit(){return this.model.getFieldValue("amount")&&this.model.getFieldValue("date_closed")}static#e=this.ɵfac=function(e){return new(e||OpportunityRevenueLinesTab)(u.rXU(p.B),u.rXU(m.yu),u.rXU(h.g))};static#t=this.ɵcmp=u.VBU({type:OpportunityRevenueLinesTab,selectors:[["ng-component"]],decls:4,vars:2,consts:[["tabtitle","LBL_OPPORTUNITYREVENUELINES"],[4,"ngIf","ngIfElse"],["notready",""],[1,"slds-p-around--small","slds-align--absolute-center"],["label","MSG_ENTERDATEANDAMOUNT"]],template:function(e,t){if(1&e&&(u.j41(0,"system-collapsable-tab",0),u.DNE(1,N,2,0,"div",1)(2,U,2,0,"ng-template",null,2,u.C5r),u.k0s()),2&e){const e=u.sdS(3);u.R7$(),u.Y8G("ngIf",t.canSplit)("ngIfElse",e)}},dependencies:[n.bT,g.p,v.W,I],encapsulation:2})}return OpportunityRevenueLinesTab})();var B=s(766),V=s(3719),T=s(40713),w=s(25028),Y=s(88418),$=s(83524);function X(e,t){if(1&e){const e=u.RV6();u.j41(0,"tr",47),u.bIt("delete",(function(){const t=u.eBV(e).$implicit,s=u.XpG();return u.Njj(s.deleteLine(t.id))})),u.k0s()}if(2&e){const e=t.$implicit,s=u.XpG();u.Y8G("revenueLine",e)("closeDate",s.model.data.date_closed)("totalAmount",s.model.data.amount)}}let P=(()=>{class OpportunityRevenueLinesCreator{constructor(e,t,s){this.language=e,this.metadata=t,this.model=s,this.revenueLines=[],this.splittype="split",this.nooflines=1,this.periodcount=1,this.periodtype="M",this.generatorResult=new u.bkB,this.componentconfig=this.metadata.getComponentConfig("OpportunityRevenueLinesCreator","OpportunityRevenueLines"),this.generate()}get canGenerate(){return this.nooflines&&this.periodcount}close(){this.self.destroy()}generate(){this.revenueLines=[];let e=new moment(this.model.getFieldValue("date_closed")),t=0;for(;t<this.nooflines;){let s=this.model.getFieldValue("amount")/this.nooflines;"rampup"==this.splittype&&(s*=t+1);let n={id:this.model.utils.generateGuid(),amount:s,revenue_date:new moment(e),deleted:!1};this.revenueLines.push(n),e.add(this.periodcount,this.periodtype),t++}}deleteLine(e){this.revenueLines.some((t=>{if(t.id==e)return t.deleted=!0,this.model.setRelatedRecords("opportunityrevenuelines",this.revenueLines),!0;0}))}save(){this.generatorResult.emit({opportunityrevenuesplit:this.splittype,revenueLines:this.revenueLines}),this.close()}static#e=this.ɵfac=function(e){return new(e||OpportunityRevenueLinesCreator)(u.rXU(p.B),u.rXU(m.yu),u.rXU(h.g))};static#t=this.ɵcmp=u.VBU({type:OpportunityRevenueLinesCreator,selectors:[["ng-component"]],decls:69,vars:11,consts:[[3,"close"],["label","LBL_OPPORTUNITYREVENUELINES"],["margin","none",3,"grow"],["tabtitle","LBL_OPPORTUNITY"],[1,"slds-p-around--small"],[3,"fieldset"],["tabtitle","LBL_GENERATOR"],[1,"slds-grid","slds-grid--vertical-align-center","slds-gutters_direct-x-small"],["fieldname","opportunityrevenuesplit"],[1,"slds-col","slds-grid","slds-grid--vertical-align-center"],[1,"slds-radio"],["type","radio","id","splittypesplit","value","split","name","splittype",3,"ngModel","ngModelChange"],["for","splittypesplit",1,"slds-radio__label"],[1,"slds-radio_faux"],[1,"slds-form-element__label"],["label","LBL_SPLIT"],["type","radio","id","splittyperampup","value","rampup","name","splittype",3,"ngModel","ngModelChange"],["for","splittyperampup",1,"slds-radio__label"],["label","LBL_RAMPUP"],[1,"slds-col"],[1,"slds-form-element"],[1,"slds-form-element__control"],["type","text",1,"slds-input",3,"placeholder","ngModel","ngModelChange"],["label","LBL_EVERY"],["label","LBL_PERIOD"],[1,"slds-select_container"],[1,"slds-select",3,"ngModel","ngModelChange"],["value","M"],["label","LBL_MONTH"],["value","y"],["label","LBL_YEAR"],[1,"slds-p-top--x-small","slds-text-align_right"],[1,"slds-button","slds-button--brand",3,"disabled","click"],["label","LBL_GENERATE"],["tabtitle","LBL_OPPORTUNITYREVENUELINES"],[1,"slds-table","slds-table_cell-buffer","slds-table_bordered"],[1,"slds-line-height_reset"],["scope","col",1,""],[1,"slds-truncate"],["module","OpportunityRevenueLines","field","revenue_date"],["module","OpportunityRevenueLines","field","amount"],["scope","col",1,"slds-cell-shrink"],["class","slds-hint-parent","opportunity-revenue-line-item","",3,"revenueLine","closeDate","totalAmount","delete",4,"ngFor","ngForOf"],[1,"slds-button","slds-button--neutral",3,"click"],["label","LBL_CLOSE"],[1,"slds-button","slds-button--brand",3,"click"],["label","LBL_OK"],["opportunity-revenue-line-item","",1,"slds-hint-parent",3,"revenueLine","closeDate","totalAmount","delete"]],template:function(e,t){1&e&&(u.j41(0,"system-modal")(1,"system-modal-header",0),u.bIt("close",(function(){return t.close()})),u.nrm(2,"system-label",1),u.k0s(),u.j41(3,"system-modal-content",2)(4,"system-collapsable-tab",3)(5,"div",4),u.nrm(6,"object-record-fieldset",5),u.k0s()(),u.j41(7,"system-collapsable-tab",6)(8,"div",4)(9,"div",7)(10,"div"),u.nrm(11,"field-label",8),u.j41(12,"div",9)(13,"div",10)(14,"input",11),u.mxI("ngModelChange",(function(e){return u.DH7(t.splittype,e)||(t.splittype=e),e})),u.k0s(),u.j41(15,"label",12),u.nrm(16,"span",13),u.j41(17,"span",14),u.nrm(18,"system-label",15),u.k0s()()(),u.j41(19,"div",10)(20,"input",16),u.mxI("ngModelChange",(function(e){return u.DH7(t.splittype,e)||(t.splittype=e),e})),u.k0s(),u.j41(21,"label",17),u.nrm(22,"span",13),u.j41(23,"span",14),u.nrm(24,"system-label",18),u.k0s()()()()(),u.j41(25,"div",19)(26,"div",20)(27,"label",14),u.nrm(28,"system-label",1),u.k0s(),u.j41(29,"div",21)(30,"input",22),u.mxI("ngModelChange",(function(e){return u.DH7(t.nooflines,e)||(t.nooflines=e),e})),u.k0s()()()(),u.j41(31,"div",19)(32,"div",20)(33,"label",14),u.nrm(34,"system-label",23),u.k0s(),u.j41(35,"div",21)(36,"input",22),u.mxI("ngModelChange",(function(e){return u.DH7(t.periodcount,e)||(t.periodcount=e),e})),u.k0s()()()(),u.j41(37,"div",19)(38,"div",20)(39,"label",14),u.nrm(40,"system-label",24),u.k0s(),u.j41(41,"div",21)(42,"div",25)(43,"select",26),u.mxI("ngModelChange",(function(e){return u.DH7(t.periodtype,e)||(t.periodtype=e),e})),u.j41(44,"option",27),u.nrm(45,"system-label",28),u.k0s(),u.j41(46,"option",29),u.nrm(47,"system-label",30),u.k0s()()()()()()(),u.j41(48,"div",31)(49,"button",32),u.bIt("click",(function(){return t.generate()})),u.nrm(50,"system-label",33),u.k0s()()()(),u.j41(51,"system-collapsable-tab",34)(52,"table",35)(53,"thead")(54,"tr",36)(55,"th",37)(56,"div",38),u.nrm(57,"system-label-fieldname",39),u.k0s()(),u.j41(58,"th",37)(59,"div",38),u.nrm(60,"system-label-fieldname",40),u.k0s()(),u.nrm(61,"th",41),u.k0s()(),u.j41(62,"tbody"),u.DNE(63,X,1,3,"tr",42),u.k0s()()()(),u.j41(64,"system-modal-footer")(65,"button",43),u.bIt("click",(function(){return t.close()})),u.nrm(66,"system-label",44),u.k0s(),u.j41(67,"button",45),u.bIt("click",(function(){return t.save()})),u.nrm(68,"system-label",46),u.k0s()()()),2&e&&(u.R7$(3),u.Y8G("grow",!0),u.R7$(3),u.Y8G("fieldset",t.componentconfig.fieldset),u.R7$(8),u.R50("ngModel",t.splittype),u.R7$(6),u.R50("ngModel",t.splittype),u.R7$(10),u.Y8G("placeholder",t.language.getLabel("LBL_OPPORTUNITYREVENUELINES")),u.R50("ngModel",t.nooflines),u.R7$(6),u.Y8G("placeholder",t.language.getLabel("LBL_EVERY")),u.R50("ngModel",t.periodcount),u.R7$(7),u.R50("ngModel",t.periodtype),u.R7$(6),u.Y8G("disabled",!t.canGenerate),u.R7$(14),u.Y8G("ngForOf",t.revenueLines))},dependencies:[n.Sq,i.xH,i.y7,i.me,i.wz,i.Fm,i.BC,i.vS,B.b,V.D,g.p,v.W,_.P,T.D,w.I,Y.Q,$.C,E],encapsulation:2})}return OpportunityRevenueLinesCreator})(),S=(()=>{class ModuleOpportunities{static#e=this.ɵfac=function(e){return new(e||ModuleOpportunities)};static#t=this.ɵmod=u.$C({type:ModuleOpportunities});static#s=this.ɵinj=u.G2t({imports:[n.MD,i.YN,o.ObjectFields,d.GlobalComponents,a.ObjectComponents,r.SystemComponents,l.h]})}return ModuleOpportunities})();("undefined"==typeof ngJitMode||ngJitMode)&&u.Obh(S,{declarations:[c,F,I,P,E],imports:[n.MD,i.YN,o.ObjectFields,d.GlobalComponents,a.ObjectComponents,r.SystemComponents,l.h]})}}]);