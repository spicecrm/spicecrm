/*!
 * 
 *                     SpiceCRM
 *
 *                     release: 2024.01.001
 *
 *                     date: 2024-05-28 17:40:40
 *
 *                     build: 2024.01.001.1716910840504
 *
 */
"use strict";(self.webpackChunkcore=self.webpackChunkcore||[]).push([["src_modules_agreements_moduleagreements_ts"],{2108:(e,t,s)=>{s.r(t),s.d(t,{ModuleAgreements:()=>j});var i=s(60177),n=s(84341),o=s(7745),d=s(12948),l=s(37328),a=s(70569),r=s(71341),m=s(35911),h=s(41731),c=s(21413),u=s(54438),b=s(69904),v=s(41081),g=s(83935),p=s(49722),A=s(50531),_=s(74547),R=s(57363),M=s(60595),f=s(32062),C=s(40713),N=s(25028),y=s(88418),k=s(83524);let U=(()=>{class AgreementsAddRevisionModal{constructor(e,t,s,i,n,o,d,l,a,r){this.language=e,this.model=t,this.parentModel=s,this.view=i,this.toast=n,this.metadata=o,this.backend=d,this.modal=l,this.modelattachments=a,this.router=r,this.componentset="",this.spiceattachment={},this.files={},this.revComponent={},this.revNumber=1,this.responseSubject=new c.B,this.model.module="AgreementRevisions",this.model.initialize()}ngOnInit(){this.metadata.getComponentConfig("AgreementsAddRevisionModal",this.model.module);this.componentset=this.revComponent.revComponent,this.view.isEditable=!0,this.view.setEditMode(),this.model.initialize(this.parentModel),this.model.startEdit(),this.modelattachments.module=this.model.module,this.modelattachments.id=this.model.id,this.generateRevNumb(),this.generateRevName()}generateRevNumb(){let e=this.parentModel.getRelatedRecords("agreementrevisions").sort(((e,t)=>e.version_number-t.version_number)).reverse();return e.length>0&&(this.revNumber=e[0].version_number+1),this.model.setField("version_number",this.revNumber),this.revNumber}generateRevName(){return this.revName=this.revNumber+"_"+this.spiceattachment.filename,this.model.setField("name",this.revName),this.revName}get canAdd(){return this.model.validate()}addRevision(e=!1){let t=this.model.data;this.model.validate()&&(this.modelattachments.files=[],this.modelattachments.uploadAttachmentsBase64(this.files).subscribe({next:s=>{this.model.data=t,this.model.save(),this.model.setField("id",this.model.id),this.parentModel.addRelatedRecords("agreementrevisions",[this.model.data],!1),this.responseSubject.next(!0),e&&this.router.navigate(["/module/AgreementRevisions/"+this.model.id])},error:()=>{this.toast.sendToast(this.language.getLabel("LBL_CREATING_REVISION_ATTACHMENT"),"error")}}),this.closeModal())}closeModal(){this.model.cancelEdit(),this.self.destroy()}static#e=this.ɵfac=function(e){return new(e||AgreementsAddRevisionModal)(u.rXU(b.B),u.rXU(m.g),u.rXU(m.g,4),u.rXU(h.U),u.rXU(v.o),u.rXU(g.yu),u.rXU(p.H),u.rXU(A.y),u.rXU(_.S),u.rXU(R.Ix))};static#t=this.ɵcmp=u.VBU({type:AgreementsAddRevisionModal,selectors:[["agreements-add-revision-modal"]],features:[u.Jv_([h.U,m.g])],decls:13,vars:3,consts:[["size","medium"],[3,"close"],["label","LBL_ADD_REVISION"],[3,"componentset"],[1,"slds-grid","slds-grid--vertical-align-center"],[1,"slds-col--bump-left","slds-button","slds-button--neutral",3,"click"],["label","LBL_CANCEL"],[1,"slds-col--bump-left","slds-button","slds-button--brand",3,"disabled","click"],["label","LBL_SAVE"],["label","LBL_SAVE_AND_GO_TO_RECORD"]],template:function(e,t){1&e&&(u.j41(0,"system-modal",0)(1,"system-modal-header",1),u.bIt("close",(function(){return t.closeModal()})),u.nrm(2,"system-label",2),u.k0s(),u.j41(3,"system-modal-content"),u.nrm(4,"system-componentset",3),u.k0s(),u.j41(5,"system-modal-footer")(6,"div",4)(7,"button",5),u.bIt("click",(function(){return t.closeModal()})),u.nrm(8,"system-label",6),u.k0s(),u.j41(9,"button",7),u.bIt("click",(function(){return t.addRevision()})),u.nrm(10,"system-label",8),u.k0s(),u.j41(11,"button",7),u.bIt("click",(function(){return t.addRevision(!0)})),u.nrm(12,"system-label",9),u.k0s()()()()),2&e&&(u.R7$(4),u.Y8G("componentset",t.componentset),u.R7$(5),u.Y8G("disabled",!t.canAdd),u.R7$(2),u.Y8G("disabled",!t.canAdd))},dependencies:[M.F,f.W,C.D,N.I,y.Q,k.C],encapsulation:2})}return AgreementsAddRevisionModal})(),j=(()=>{class ModuleAgreements{static#e=this.ɵfac=function(e){return new(e||ModuleAgreements)};static#t=this.ɵmod=u.$C({type:ModuleAgreements});static#s=this.ɵinj=u.G2t({imports:[i.MD,n.YN,o.ObjectFields,d.GlobalComponents,l.ObjectComponents,a.SystemComponents,r.h]})}return ModuleAgreements})();("undefined"==typeof ngJitMode||ngJitMode)&&u.Obh(j,{declarations:[U],imports:[i.MD,n.YN,o.ObjectFields,d.GlobalComponents,l.ObjectComponents,a.SystemComponents,r.h]})}}]);