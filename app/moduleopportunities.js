/*!
 * 
 *                     aacService
 *
 *                     release: 2023.02.001
 *
 *                     date: 2023-08-14 15:59:23
 *
 *                     build: 2023.02.001.1692021563445
 *
 */
"use strict";(self.webpackChunkcore=self.webpackChunkcore||[]).push([["src_modules_opportunities_moduleopportunities_ts"],{2257:(e,t,i)=>{i.r(t),i.d(t,{ModuleOpportunities:()=>B});var n=i(1180),s=i(4755),l=i(5030),o=i(4357),d=i(3190),a=i(4826),u=i(6490),r=i(3735),p=i(2242);let c=(()=>{var e;class OpportunityRevenueLinesActiveLinesPipe{transform(e){let t=[];for(let i of e)1!=i.deleted&&t.push(i);return t}}return e=OpportunityRevenueLinesActiveLinesPipe,(0,n.Z)(OpportunityRevenueLinesActiveLinesPipe,"ɵfac",(function(t){return new(t||e)})),(0,n.Z)(OpportunityRevenueLinesActiveLinesPipe,"ɵpipe",p.Yjl({name:"opportunityrevenuelinesactivelinespipe",type:e,pure:!1})),OpportunityRevenueLinesActiveLinesPipe})();var h=i(5329),m=i(4154),g=i(5710),v=i(1553),f=i(3463),Z=i(2294),y=i(4044),b=i(3634),L=i(5638),_=i(2656),A=i(7674);const R=["opportunity-revenue-line-item",""],O=function(){return{hidelabel:!0}};let T=(()=>{var e;class OpportunityRevenueLineItem{constructor(e,t,i){(0,n.Z)(this,"model",void 0),(0,n.Z)(this,"view",void 0),(0,n.Z)(this,"language",void 0),(0,n.Z)(this,"revenueLine",void 0),(0,n.Z)(this,"closeDate",void 0),(0,n.Z)(this,"totalAmount",void 0),(0,n.Z)(this,"update",new p.vpe),(0,n.Z)(this,"delete",new p.vpe),this.model=e,this.view=t,this.language=i,this.model.module="OpportunityRevenueLines",this.model.data$.subscribe((e=>{this.update.emit(!0)}))}ngOnChanges(){this.model.id=this.revenueLine.id,this.model.setData(this.revenueLine)}get disabled(){return!this.view.isEditMode()}deleteitem(){this.delete.emit(!0)}}return e=OpportunityRevenueLineItem,(0,n.Z)(OpportunityRevenueLineItem,"ɵfac",(function(t){return new(t||e)(p.Y36(g.o),p.Y36(Z.e),p.Y36(h.d))})),(0,n.Z)(OpportunityRevenueLineItem,"ɵcmp",p.Xpm({type:e,selectors:[["","opportunity-revenue-line-item",""]],inputs:{revenueLine:"revenueLine",closeDate:"closeDate",totalAmount:"totalAmount"},outputs:{update:"update",delete:"delete"},features:[p._Bn([g.o]),p.TTD],attrs:R,decls:7,vars:7,consts:[["field","revenue_date","fielddisplayclass","fielddisplayclass",3,"fieldconfig"],["field","amount","fielddisplayclass","fielddisplayclass",3,"fieldconfig"],[1,"slds-button","slds-button_icon",3,"disabled","click"],["icon","clear"]],template:function(e,t){1&e&&(p.TgZ(0,"td"),p._UZ(1,"field-container",0),p.qZA(),p.TgZ(2,"td"),p._UZ(3,"field-container",1),p.qZA(),p.TgZ(4,"td")(5,"button",2),p.NdJ("click",(function(){return t.deleteitem()})),p._UZ(6,"system-button-icon",3),p.qZA()()),2&e&&(p.uIk("data-label",t.language.getFieldDisplayName("OpportunityRevenueLines","revenue_date")),p.xp6(1),p.Q6J("fieldconfig",p.DdM(5,O)),p.xp6(1),p.uIk("data-label",t.language.getFieldDisplayName("OpportunityRevenueLines","amount")),p.xp6(1),p.Q6J("fieldconfig",p.DdM(6,O)),p.xp6(2),p.Q6J("disabled",t.disabled))},dependencies:[b.j,_.J],encapsulation:2})),OpportunityRevenueLineItem})();function M(e,t){if(1&e){const e=p.EpF();p.TgZ(0,"tr",16),p.NdJ("update",(function(){p.CHM(e);const t=p.oxw(3);return p.KtG(t.revalidate())}))("delete",(function(){const t=p.CHM(e).$implicit,i=p.oxw(3);return p.KtG(i.deleteLine(t.id))})),p.qZA()}if(2&e){const e=t.$implicit,i=p.oxw(3);p.Q6J("revenueLine",e)("closeDate",i.closeDate)("totalAmount",i.totalAmount)}}function E(e,t){if(1&e&&(p.TgZ(0,"table",8)(1,"thead")(2,"tr",9)(3,"th",10)(4,"div",11),p._UZ(5,"system-label-fieldname",12),p.qZA()(),p.TgZ(6,"th",10)(7,"div",11),p._UZ(8,"system-label-fieldname",13),p.qZA()(),p._UZ(9,"th",14),p.qZA()(),p.TgZ(10,"tbody"),p.YNc(11,M,1,3,"tr",15),p.ALo(12,"opportunityrevenuelinesactivelinespipe"),p.qZA()()),2&e){const e=p.oxw(2);p.xp6(11),p.Q6J("ngForOf",p.lcZ(12,1,e.revenueLines))}}function C(e,t){if(1&e){const e=p.EpF();p.TgZ(0,"div",17)(1,"div",18),p._UZ(2,"field-messages",19),p.qZA(),p.TgZ(3,"div",20)(4,"button",21),p.NdJ("click",(function(){p.CHM(e);const t=p.oxw(2);return p.KtG(t.addLine())})),p._UZ(5,"system-button-icon",22),p.qZA()()()}2&e&&(p.xp6(5),p.Q6J("icon","add"))}const N=function(){return{readonly:!0}};function D(e,t){if(1&e&&(p.TgZ(0,"div")(1,"div",2),p._UZ(2,"field-container",3)(3,"field-container",4)(4,"field-container",5),p.qZA(),p.YNc(5,E,13,3,"table",6),p.YNc(6,C,6,1,"div",7),p.qZA()),2&e){const e=p.oxw();p.xp6(2),p.Q6J("fieldconfig",p.DdM(5,N)),p.xp6(1),p.Q6J("fieldconfig",p.DdM(6,N)),p.xp6(1),p.Q6J("fieldconfig",p.DdM(7,N)),p.xp6(1),p.Q6J("ngIf",e.hasActiveLines),p.xp6(1),p.Q6J("ngIf",e.isEditing)}}function U(e,t){if(1&e){const e=p.EpF();p.TgZ(0,"div",23)(1,"button",24),p.NdJ("click",(function(){p.CHM(e);const t=p.oxw();return p.KtG(t.initalizeLines())})),p._uU(2,"initialize"),p.qZA()()}if(2&e){const e=p.oxw();p.xp6(1),p.Q6J("disabled",!e.view.isEditMode())}}let J=(()=>{var e;class OpportunityRevenueLines{constructor(e,t,i,s,l,o,d){(0,n.Z)(this,"language",void 0),(0,n.Z)(this,"metadata",void 0),(0,n.Z)(this,"model",void 0),(0,n.Z)(this,"view",void 0),(0,n.Z)(this,"modal",void 0),(0,n.Z)(this,"changeDetectorRef",void 0),(0,n.Z)(this,"viewContainerRef",void 0),(0,n.Z)(this,"revenueLines",[]),(0,n.Z)(this,"closeDate",void 0),(0,n.Z)(this,"totalAmount",void 0),this.language=e,this.metadata=t,this.model=i,this.view=s,this.modal=l,this.changeDetectorRef=o,this.viewContainerRef=d,this.model.data$.subscribe((e=>{this.loadRevenueLines(),this.checkCloseDate(),this.checkAmount(),this.checkConsistency()})),this.view.mode$.subscribe((e=>{this.loadRevenueLines(),this.checkConsistency()}))}ngOnInit(){this.loadRevenueLines(),this.checkCloseDate(),this.checkAmount(),this.checkConsistency()}get canSplit(){return this.closeDate&&this.totalAmount}get hasActiveLines(){return this.revenueLines.filter((e=>1!=e.deleted)).length>0}loadRevenueLines(){this.revenueLines=[];let e=this.model.getRelatedRecords("opportunityrevenuelines");for(let t of e)this.revenueLines.push(t);this.sortRevenueLines()}checkConsistency(){if(this.view.isEditMode()){let e=this.model.getField("amount");switch(this.model.getFieldValue("opportunityrevenuesplit")){case"split":let t=0;for(let e of this.revenueLines)1!=e.deleted&&(t+=e.amount);e!=t?this.model.setFieldMessage("error","total amount does not match","opportunityrevenuelines","opportunityrevenuelines"):this.model.resetFieldMessages("opportunityrevenuelines");break;case"rampup":let i=this.revenueLines.filter((e=>1!=e.delete)).slice(-1).pop();i&&i.amount==e?this.model.resetFieldMessages("opportunityrevenuelines"):this.model.setFieldMessage("error","rampup amount does not match","opportunityrevenuelines","opportunityrevenuelines");break;default:this.model.resetFieldMessages("opportunityrevenuelines")}}}checkCloseDate(){this.closeDate?"none"==this.model.getFieldValue("opportunityrevenuesplit")||this.model.getFieldValue("date_closed").isSame(this.closeDate,"day")||this.modal.confirm(this.language.getLabel("MSG_UPDATE_CHANGED_DATE",null,"long"),this.language.getLabel("MSG_UPDATE_CHANGED_DATE"),"shade").subscribe((e=>{if(e){let e=moment.duration(this.model.getFieldValue("date_closed").diff(this.closeDate));for(let t of this.revenueLines)1!=t.deleted&&t.revenue_date.add(e);this.changeDetectorRef.detectChanges()}this.closeDate=this.model.getFieldValue("date_closed")})):this.closeDate=this.model.getFieldValue("date_closed")}checkAmount(){this.totalAmount?"none"!=this.model.getFieldValue("opportunityrevenuesplit")&&this.model.getFieldValue("amount")!=this.totalAmount&&this.modal.confirm(this.language.getLabel("MSG_UPDATE_CHANGED_AMOUNT",null,"long"),this.language.getLabel("MSG_UPDATE_CHANGED_AMOUNT"),"shade").subscribe((e=>{if(e){let e=this.model.getFieldValue("amount")/this.totalAmount;for(let t of this.revenueLines)1!=t.deleted&&(t.amount=Math.round(t.amount*e*100)/100);this.changeDetectorRef.detectChanges()}this.totalAmount=this.model.getFieldValue("amount"),this.checkConsistency()})):this.totalAmount=this.model.getFieldValue("amount")}sortRevenueLines(){this.revenueLines.sort(((e,t)=>new moment(e.revenue_date).isBefore(new moment(t.revenue_date))?-1:1))}get fieldMessages(){if(this.view.isEditMode()){let e=this.model.getFieldMessages("opportunityrevenuelines");return e||[]}return[]}revalidate(){this.loadRevenueLines(),this.checkConsistency()}get isEditing(){return this.view.isEditMode()}initalizeLines(){this.modal.openModal("OpportunityRevenueLinesCreator",!0,this.viewContainerRef.injector).subscribe((e=>{e.instance.generatorResult.subscribe((e=>{this.model.setField("opportunityrevenuesplit",e.opportunityrevenuesplit),this.model.setRelatedRecords("opportunityrevenuelines",e.revenueLines),this.loadRevenueLines(),this.checkConsistency()}))}))}addLine(){let e={id:this.model.utils.generateGuid(),amount:0,amount_usdollar:0,amount_base:0,revenue_date:this.closeDate,deleted:!1};this.revenueLines.push(e),this.sortRevenueLines(),this.model.setRelatedRecords("opportunityrevenuelines",this.revenueLines)}deleteLine(e){this.revenueLines.some((t=>{if(t.id==e)return t.deleted=!0,this.model.setRelatedRecords("opportunityrevenuelines",this.revenueLines),!0;0})),this.hasActiveLines?(this.loadRevenueLines(),this.checkConsistency()):(this.model.setField("opportunityrevenuesplit","none"),this.checkConsistency())}}return e=OpportunityRevenueLines,(0,n.Z)(OpportunityRevenueLines,"ɵfac",(function(t){return new(t||e)(p.Y36(h.d),p.Y36(m.Pu),p.Y36(g.o),p.Y36(Z.e),p.Y36(y.o),p.Y36(p.sBO),p.Y36(p.s_b))})),(0,n.Z)(OpportunityRevenueLines,"ɵcmp",p.Xpm({type:e,selectors:[["opportunity-revenue-lines"]],decls:3,vars:2,consts:[[4,"ngIf","ngIfElse"],["initialize",""],[1,"slds-p-around--x-small","slds-grid","slds-grid--vertical-align-center","slds-grid--align-spread"],["field","opportunityrevenuesplit",3,"fieldconfig"],["field","amount",3,"fieldconfig"],["field","date_closed",3,"fieldconfig"],["class","slds-table slds-table_cell-buffer slds-table_bordered",4,"ngIf"],["class","slds-p-around--small slds-grid slds-grid--vertical-align-center slds-grid--align-spread slds-wrap",4,"ngIf"],[1,"slds-table","slds-table_cell-buffer","slds-table_bordered"],[1,"slds-line-height_reset"],["scope","col",1,""],[1,"slds-truncate"],["module","OpportunityRevenueLines","field","revenue_date"],["module","OpportunityRevenueLines","field","amount"],["scope","col",1,"slds-cell-shrink"],["class","slds-hint-parent","opportunity-revenue-line-item","",3,"revenueLine","closeDate","totalAmount","update","delete",4,"ngFor","ngForOf"],["opportunity-revenue-line-item","",1,"slds-hint-parent",3,"revenueLine","closeDate","totalAmount","update","delete"],[1,"slds-p-around--small","slds-grid","slds-grid--vertical-align-center","slds-grid--align-spread","slds-wrap"],[1,"slds-size--1-of-1","slds-large-size--1-of-2"],["fieldname","opportunityrevenuelines"],[1,"slds-size--1-of-1","slds-large-size--1-of-2","slds-text-align--right"],[1,"slds-button","slds-button_icon","slds-button_icon","slds-button--icon-border",3,"click"],[3,"icon"],[1,"slds-p-around--small","slds-align--absolute-center"],[1,"slds-button","slds-button--neutral",3,"disabled","click"]],template:function(e,t){if(1&e&&(p.YNc(0,D,7,8,"div",0),p.YNc(1,U,3,1,"ng-template",null,1,p.W1O)),2&e){const e=p.MAs(2);p.Q6J("ngIf",t.hasActiveLines)("ngIfElse",e)}},dependencies:[s.sg,s.O5,b.j,L.a,_.J,A.h,T,c],encapsulation:2})),OpportunityRevenueLines})();function w(e,t){1&e&&(p.TgZ(0,"div"),p._UZ(1,"opportunity-revenue-lines"),p.qZA())}function x(e,t){1&e&&(p.TgZ(0,"div",3),p._UZ(1,"system-label",4),p.qZA())}let F=(()=>{var e;class OpportunityRevenueLinesTab{constructor(e,t,i){(0,n.Z)(this,"language",void 0),(0,n.Z)(this,"metadata",void 0),(0,n.Z)(this,"model",void 0),this.language=e,this.metadata=t,this.model=i}ngOnInit(){}get canSplit(){return this.model.getFieldValue("amount")&&this.model.getFieldValue("date_closed")}}return e=OpportunityRevenueLinesTab,(0,n.Z)(OpportunityRevenueLinesTab,"ɵfac",(function(t){return new(t||e)(p.Y36(h.d),p.Y36(m.Pu),p.Y36(g.o))})),(0,n.Z)(OpportunityRevenueLinesTab,"ɵcmp",p.Xpm({type:e,selectors:[["ng-component"]],decls:4,vars:2,consts:[["tabtitle","LBL_OPPORTUNITYREVENUELINES"],[4,"ngIf","ngIfElse"],["notready",""],[1,"slds-p-around--small","slds-align--absolute-center"],["label","MSG_ENTERDATEANDAMOUNT"]],template:function(e,t){if(1&e&&(p.TgZ(0,"system-collapsable-tab",0),p.YNc(1,w,2,0,"div",1),p.YNc(2,x,2,0,"ng-template",null,2,p.W1O),p.qZA()),2&e){const e=p.MAs(3);p.xp6(1),p.Q6J("ngIf",t.canSplit)("ngIfElse",e)}},dependencies:[s.O5,v.z,f._,J],encapsulation:2})),OpportunityRevenueLinesTab})();var k=i(6367),q=i(9062),Y=i(9621),I=i(3499),P=i(5767),Q=i(1916);function G(e,t){if(1&e){const e=p.EpF();p.TgZ(0,"tr",47),p.NdJ("delete",(function(){const t=p.CHM(e).$implicit,i=p.oxw();return p.KtG(i.deleteLine(t.id))})),p.qZA()}if(2&e){const e=t.$implicit,i=p.oxw();p.Q6J("revenueLine",e)("closeDate",i.model.data.date_closed)("totalAmount",i.model.data.amount)}}let V=(()=>{var e;class OpportunityRevenueLinesCreator{constructor(e,t,i){(0,n.Z)(this,"language",void 0),(0,n.Z)(this,"metadata",void 0),(0,n.Z)(this,"model",void 0),(0,n.Z)(this,"self",void 0),(0,n.Z)(this,"componentconfig",void 0),(0,n.Z)(this,"revenueLines",[]),(0,n.Z)(this,"splittype","split"),(0,n.Z)(this,"nooflines",1),(0,n.Z)(this,"periodcount",1),(0,n.Z)(this,"periodtype","M"),(0,n.Z)(this,"generatorResult",new p.vpe),this.language=e,this.metadata=t,this.model=i,this.componentconfig=this.metadata.getComponentConfig("OpportunityRevenueLinesCreator","OpportunityRevenueLines"),this.generate()}get canGenerate(){return this.nooflines&&this.periodcount}close(){this.self.destroy()}generate(){this.revenueLines=[];let e=new moment(this.model.getFieldValue("date_closed")),t=0;for(;t<this.nooflines;){let i=this.model.getFieldValue("amount")/this.nooflines;"rampup"==this.splittype&&(i*=t+1);let n={id:this.model.utils.generateGuid(),amount:i,revenue_date:new moment(e),deleted:!1};this.revenueLines.push(n),e.add(this.periodcount,this.periodtype),t++}}deleteLine(e){this.revenueLines.some((t=>{if(t.id==e)return t.deleted=!0,this.model.setRelatedRecords("opportunityrevenuelines",this.revenueLines),!0;0}))}save(){this.generatorResult.emit({opportunityrevenuesplit:this.splittype,revenueLines:this.revenueLines}),this.close()}}return e=OpportunityRevenueLinesCreator,(0,n.Z)(OpportunityRevenueLinesCreator,"ɵfac",(function(t){return new(t||e)(p.Y36(h.d),p.Y36(m.Pu),p.Y36(g.o))})),(0,n.Z)(OpportunityRevenueLinesCreator,"ɵcmp",p.Xpm({type:e,selectors:[["ng-component"]],decls:69,vars:11,consts:[[3,"close"],["label","LBL_OPPORTUNITYREVENUELINES"],["margin","none",3,"grow"],["tabtitle","LBL_OPPORTUNITY"],[1,"slds-p-around--small"],[3,"fieldset"],["tabtitle","LBL_GENERATOR"],[1,"slds-grid","slds-grid--vertical-align-center","slds-gutters_direct-x-small"],["fieldname","opportunityrevenuesplit"],[1,"slds-col","slds-grid","slds-grid--vertical-align-center"],[1,"slds-radio"],["type","radio","id","splittypesplit","value","split","name","splittype",3,"ngModel","ngModelChange"],["for","splittypesplit",1,"slds-radio__label"],[1,"slds-radio_faux"],[1,"slds-form-element__label"],["label","LBL_SPLIT"],["type","radio","id","splittyperampup","value","rampup","name","splittype",3,"ngModel","ngModelChange"],["for","splittyperampup",1,"slds-radio__label"],["label","LBL_RAMPUP"],[1,"slds-col"],[1,"slds-form-element"],[1,"slds-form-element__control"],["type","text",1,"slds-input",3,"placeholder","ngModel","ngModelChange"],["label","LBL_EVERY"],["label","LBL_PERIOD"],[1,"slds-select_container"],[1,"slds-select",3,"ngModel","ngModelChange"],["value","M"],["label","LBL_MONTH"],["value","y"],["label","LBL_YEAR"],[1,"slds-p-top--x-small","slds-text-align_right"],[1,"slds-button","slds-button--brand",3,"disabled","click"],["label","LBL_GENERATE"],["tabtitle","LBL_OPPORTUNITYREVENUELINES"],[1,"slds-table","slds-table_cell-buffer","slds-table_bordered"],[1,"slds-line-height_reset"],["scope","col",1,""],[1,"slds-truncate"],["module","OpportunityRevenueLines","field","revenue_date"],["module","OpportunityRevenueLines","field","amount"],["scope","col",1,"slds-cell-shrink"],["class","slds-hint-parent","opportunity-revenue-line-item","",3,"revenueLine","closeDate","totalAmount","delete",4,"ngFor","ngForOf"],[1,"slds-button","slds-button--neutral",3,"click"],["label","LBL_CLOSE"],[1,"slds-button","slds-button--brand",3,"click"],["label","LBL_OK"],["opportunity-revenue-line-item","",1,"slds-hint-parent",3,"revenueLine","closeDate","totalAmount","delete"]],template:function(e,t){1&e&&(p.TgZ(0,"system-modal")(1,"system-modal-header",0),p.NdJ("close",(function(){return t.close()})),p._UZ(2,"system-label",1),p.qZA(),p.TgZ(3,"system-modal-content",2)(4,"system-collapsable-tab",3)(5,"div",4),p._UZ(6,"object-record-fieldset",5),p.qZA()(),p.TgZ(7,"system-collapsable-tab",6)(8,"div",4)(9,"div",7)(10,"div"),p._UZ(11,"field-label",8),p.TgZ(12,"div",9)(13,"div",10)(14,"input",11),p.NdJ("ngModelChange",(function(e){return t.splittype=e})),p.qZA(),p.TgZ(15,"label",12),p._UZ(16,"span",13),p.TgZ(17,"span",14),p._UZ(18,"system-label",15),p.qZA()()(),p.TgZ(19,"div",10)(20,"input",16),p.NdJ("ngModelChange",(function(e){return t.splittype=e})),p.qZA(),p.TgZ(21,"label",17),p._UZ(22,"span",13),p.TgZ(23,"span",14),p._UZ(24,"system-label",18),p.qZA()()()()(),p.TgZ(25,"div",19)(26,"div",20)(27,"label",14),p._UZ(28,"system-label",1),p.qZA(),p.TgZ(29,"div",21)(30,"input",22),p.NdJ("ngModelChange",(function(e){return t.nooflines=e})),p.qZA()()()(),p.TgZ(31,"div",19)(32,"div",20)(33,"label",14),p._UZ(34,"system-label",23),p.qZA(),p.TgZ(35,"div",21)(36,"input",22),p.NdJ("ngModelChange",(function(e){return t.periodcount=e})),p.qZA()()()(),p.TgZ(37,"div",19)(38,"div",20)(39,"label",14),p._UZ(40,"system-label",24),p.qZA(),p.TgZ(41,"div",21)(42,"div",25)(43,"select",26),p.NdJ("ngModelChange",(function(e){return t.periodtype=e})),p.TgZ(44,"option",27),p._UZ(45,"system-label",28),p.qZA(),p.TgZ(46,"option",29),p._UZ(47,"system-label",30),p.qZA()()()()()()(),p.TgZ(48,"div",31)(49,"button",32),p.NdJ("click",(function(){return t.generate()})),p._UZ(50,"system-label",33),p.qZA()()()(),p.TgZ(51,"system-collapsable-tab",34)(52,"table",35)(53,"thead")(54,"tr",36)(55,"th",37)(56,"div",38),p._UZ(57,"system-label-fieldname",39),p.qZA()(),p.TgZ(58,"th",37)(59,"div",38),p._UZ(60,"system-label-fieldname",40),p.qZA()(),p._UZ(61,"th",41),p.qZA()(),p.TgZ(62,"tbody"),p.YNc(63,G,1,3,"tr",42),p.qZA()()()(),p.TgZ(64,"system-modal-footer")(65,"button",43),p.NdJ("click",(function(){return t.close()})),p._UZ(66,"system-label",44),p.qZA(),p.TgZ(67,"button",45),p.NdJ("click",(function(){return t.save()})),p._UZ(68,"system-label",46),p.qZA()()()),2&e&&(p.xp6(3),p.Q6J("grow",!0),p.xp6(3),p.Q6J("fieldset",t.componentconfig.fieldset),p.xp6(8),p.Q6J("ngModel",t.splittype),p.xp6(6),p.Q6J("ngModel",t.splittype),p.xp6(10),p.Q6J("placeholder",t.language.getLabel("LBL_OPPORTUNITYREVENUELINES"))("ngModel",t.nooflines),p.xp6(6),p.Q6J("placeholder",t.language.getLabel("LBL_EVERY"))("ngModel",t.periodcount),p.xp6(7),p.Q6J("ngModel",t.periodtype),p.xp6(6),p.Q6J("disabled",!t.canGenerate),p.xp6(14),p.Q6J("ngForOf",t.revenueLines))},dependencies:[s.sg,l.YN,l.Kr,l.Fj,l.EJ,l._,l.JJ,l.On,k.q,q.d,v.z,f._,A.h,Y.j,I.x,P.p,Q.y,T],encapsulation:2})),OpportunityRevenueLinesCreator})(),B=(()=>{var e;class ModuleOpportunities{}return e=ModuleOpportunities,(0,n.Z)(ModuleOpportunities,"ɵfac",(function(t){return new(t||e)})),(0,n.Z)(ModuleOpportunities,"ɵmod",p.oAB({type:e})),(0,n.Z)(ModuleOpportunities,"ɵinj",p.cJS({imports:[s.ez,l.u5,d.ObjectFields,a.GlobalComponents,u.ObjectComponents,r.SystemComponents,o.o]})),ModuleOpportunities})();("undefined"==typeof ngJitMode||ngJitMode)&&p.kYT(B,{declarations:[c,F,J,V,T],imports:[s.ez,l.u5,d.ObjectFields,a.GlobalComponents,u.ObjectComponents,r.SystemComponents,o.o]})}}]);