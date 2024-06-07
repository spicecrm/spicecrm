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
"use strict";(self.webpackChunkcore=self.webpackChunkcore||[]).push([["src_modules_documents_moduledocuments_ts"],{49072:(e,t,s)=>{s.r(t),s.d(t,{ModuleDocuments:()=>z});var i=s(60177),n=s(7745),l=s(12948),o=s(37328),a=s(70569),d=s(71341),c=s(84341),r=s(13921),u=s(54438),m=s(35911),h=s(60968),p=s(41731),f=s(69904),g=s(83935),b=s(57363),v=s(50531),_=s(91107),R=s(49722),y=s(766),U=s(66935),D=s(25863);function k(e,t){if(1&e&&u.nrm(0,"field-label",4),2&e){const e=u.XpG();u.Y8G("fieldname",e.fieldname)("fieldconfig",e.fieldconfig)}}function C(e,t){if(1&e){const e=u.RV6();u.j41(0,"button",5),u.bIt("click",(function(){u.eBV(e);const t=u.XpG();return u.Njj(t.activateRevision())})),u.nrm(1,"system-button-icon",6),u.k0s()}}let X=(()=>{class fieldDocumentRevisionStatus extends r.s{constructor(e,t,s,i,n,l,o,a,d){super(e,s,i,n,l),this.model=e,this.navigation=t,this.language=i,this.metadata=n,this.router=l,this.modal=o,this.relatedmodels=a,this.backend=d}ngOnInit(){super.ngOnInit(),this.parent=this.navigation.getRegisteredModel(this.model.getField("document_id"),"Documents"),this.subscriptions.add(this.parent.observeFieldChanges("status_id").subscribe((e=>{"Expired"==e&&(this.value="a")})))}getValue(){return this.language.getFieldDisplayOptionValue(this.model.module,this.fieldname,this.value)}get canActivate(){return!this.model.isEditing&&"c"==this.value&&this.model.checkAccess("edit")&&"Expired"!=this.parent.getField("status_id")}activateRevision(){this.modal.prompt("confirm",this.language.getLabel("MSG_ACTIVATE_REVISION","","long")).subscribe((e=>{e&&(this.model.startEdit(),this.value="r",this.model.save().subscribe((e=>{this.parent&&this.parent.setField("revision",this.model.getField("revision"))})))}))}static#e=this.ɵfac=function(e){return new(e||fieldDocumentRevisionStatus)(u.rXU(m.g),u.rXU(h.L),u.rXU(p.U),u.rXU(f.B),u.rXU(g.yu),u.rXU(b.Ix),u.rXU(v.y),u.rXU(_.K),u.rXU(R.H))};static#t=this.ɵcmp=u.VBU({type:fieldDocumentRevisionStatus,selectors:[["ng-component"]],features:[u.Vt3],decls:6,vars:7,consts:[[3,"fieldname","fieldconfig",4,"ngIf"],[3,"fielddisplayclass","editable","fieldconfig","fieldid"],[1,"slds-grid","slds-grid--vertical-align-center"],["class","slds-button slds-button--icon slds-theme--warning slds-m-left--x-small",3,"click",4,"ngIf"],[3,"fieldname","fieldconfig"],[1,"slds-button","slds-button--icon","slds-theme--warning","slds-m-left--x-small",3,"click"],["icon","light_bulb"]],template:function(e,t){1&e&&(u.DNE(0,k,1,2,"field-label",0),u.j41(1,"field-generic-display",1)(2,"div",2)(3,"span"),u.EFF(4),u.k0s(),u.DNE(5,C,2,0,"button",3),u.k0s()()),2&e&&(u.Y8G("ngIf",t.displayLabel),u.R7$(),u.Y8G("fielddisplayclass",t.fielddisplayclass)("editable",t.isEditable())("fieldconfig",t.fieldconfig)("fieldid",t.fieldid),u.R7$(3),u.JRh(t.getValue()),u.R7$(),u.Y8G("ngIf",t.canActivate))},dependencies:[i.bT,y.b,U.K,D.t],encapsulation:2})}return fieldDocumentRevisionStatus})();var E=s(18359),I=s(53584),M=s(32062);let B=(()=>{class DocumentCreateRevisionButton{constructor(e,t,s,i,n,l,o){this.language=e,this.model=t,this.modal=s,this.backend=i,this.configuration=n,this.viewContainerRef=l,this.relatedmodels=o,this.templates=[],this.subscriptions=new E.yU}openOutput(){this.templates.length>0?(this.templates.sort(((e,t)=>e.name>t.name?1:-1)),this.modal.openModal("DocumentCreateRevisionModal",!0,this.viewContainerRef.injector).subscribe((e=>{let t=new u.bkB;e.instance.templates=this.templates,e.instance.modalTitle="LBL_CREATE_REVISION",e.instance.handBack=t,this.subscriptions.add(t.subscribe((e=>{this.backend.postRequest(`module/Documents/${this.model.id}/revisionfrombase64`,"",{file_name:e.name+".pdf",file:e.content,file_mime_type:"application/pdf",documentrevisionstatus:"r"}).subscribe((e=>{this.relatedmodels.getData(),this.model.getData(!1,"",!0)}))})))}))):this.modal.info("No Templates Found","there are no Output templates defined for the Module")}ngOnDestroy(){this.subscriptions.unsubscribe()}execute(){let e=this.configuration.getData("OutputTemplates");e&&e[this.model.module]?(this.templates=e[this.model.module],this.openOutput()):(e={},this.modal.openModal("SystemLoadingModal",!1).subscribe((e=>{e.instance.messagelabel="Loading Templates",this.backend.getRequest("module/OutputTemplates/formodule/"+this.model.module,{}).subscribe((t=>{e.instance.self.destroy(),this.configuration.setData("OutputTemplates",t),this.templates=t,this.openOutput()}),(t=>{e.instance.self.destroy()}))})))}static#e=this.ɵfac=function(e){return new(e||DocumentCreateRevisionButton)(u.rXU(f.B),u.rXU(m.g),u.rXU(v.y),u.rXU(R.H),u.rXU(I.i),u.rXU(u.c1b),u.rXU(_.K))};static#t=this.ɵcmp=u.VBU({type:DocumentCreateRevisionButton,selectors:[["document-create-revision-button"]],decls:1,vars:0,consts:[["label","LBL_CREATE_REVISION"]],template:function(e,t){1&e&&u.nrm(0,"system-label",0)},dependencies:[M.W],encapsulation:2})}return DocumentCreateRevisionButton})();var G=s(28679),j=s(345),w=s(27863),L=s(92462),O=s(40713),T=s(25028),Y=s(88418),F=s(83524),V=s(48717);function $(e,t){if(1&e&&(u.j41(0,"option",20),u.EFF(1),u.k0s()),2&e){const e=t.$implicit;u.Y8G("ngValue",e),u.R7$(),u.Lme("",e.name," (",e.language,")")}}function S(e,t){if(1&e&&u.nrm(0,"iframe",21),2&e){const e=u.XpG();u.Y8G("srcdoc",e.sanitizedTemplated,u.npT)}}function x(e,t){if(1&e&&u.nrm(0,"object",22),2&e){const e=u.XpG();u.Y8G("data",e.blobUrl,u.f$h)}}function N(e,t){1&e&&(u.j41(0,"div",23),u.nrm(1,"system-spinner"),u.k0s())}function A(e,t){1&e&&(u.j41(0,"div",23),u.nrm(1,"system-label",24),u.k0s())}let H=(()=>{class DocumentCreateRevisionModal extends G.y{constructor(e,t,s,i,n,l,o,a,d,c){super(e,t,s,i,n,l,d,o,a,c),this.language=e,this.model=t,this.metadata=s,this.modal=i,this.view=n,this.backend=l,this.sanitizer=o,this.viewContainerRef=a,this.outputModalService=d,this.modelutilities=c}create(){this.handBack.emit({name:this.selected_template.name,content:this.contentForHandBack}),this.close()}static#e=this.ɵfac=function(e){return new(e||DocumentCreateRevisionModal)(u.rXU(f.B),u.rXU(m.g),u.rXU(g.yu),u.rXU(v.y),u.rXU(p.U),u.rXU(R.H),u.rXU(j.up),u.rXU(u.c1b),u.rXU(w.c),u.rXU(L.g))};static#t=this.ɵcmp=u.VBU({type:DocumentCreateRevisionModal,selectors:[["object-action-output-bean-modal"]],features:[u.Jv_([p.U]),u.Vt3],decls:22,vars:10,consts:[["size","large"],[3,"close"],[3,"label"],["margin","none"],[1,"slds-modal__content"],[1,"slds-form-element__control","slds-grid","slds-grid--vertical-align-center","slds-p-around--small"],[1,"slds-col","slds-p-right--x-small"],["label","LBL_TEMPLATE"],[1,"slds-col","slds-select","slds-grow",3,"ngModel","disabled","ngModelChange"],[3,"ngValue",4,"ngFor","ngForOf"],[1,"slds-grid",2,"height","70vh"],[1,"slds-p-around--small",2,"height","100%","width","200%"],[1,"slds-m-top--small","slds-border--top","slds-border--right","slds-border--left","slds-border--bottom",2,"width","100%","height","calc(100% - 50px)"],["frameBorder","0","style","width: 100%;height: 100%;",3,"srcdoc",4,"ngIf"],["type","application/pdf","width","100%","height","100%",3,"data",4,"ngIf"],["class","slds-align--absolute-center","style","height: 100%;",4,"ngIf"],[1,"slds-button","slds-button--neutral",3,"click"],["label","LBL_CANCEL"],[1,"slds-button","slds-button--brand",3,"disabled","click"],["label","LBL_CREATE"],[3,"ngValue"],["frameBorder","0",2,"width","100%","height","100%",3,"srcdoc"],["type","application/pdf","width","100%","height","100%",3,"data"],[1,"slds-align--absolute-center",2,"height","100%"],["label","LBL_SELECT_TEMPLATE"]],template:function(e,t){1&e&&(u.j41(0,"system-modal",0)(1,"system-modal-header",1),u.bIt("close",(function(){return t.close()})),u.nrm(2,"system-label",2),u.k0s(),u.j41(3,"system-modal-content",3)(4,"div",4)(5,"div",5)(6,"label",6),u.nrm(7,"system-label",7),u.k0s(),u.j41(8,"select",8),u.mxI("ngModelChange",(function(e){return u.DH7(t.selected_template,e)||(t.selected_template=e),e})),u.DNE(9,$,2,3,"option",9),u.k0s()(),u.j41(10,"div",10)(11,"div",11)(12,"div",12),u.DNE(13,S,1,1,"iframe",13)(14,x,1,1,"object",14)(15,N,2,0,"div",15)(16,A,2,0,"div",15),u.k0s()()()()(),u.j41(17,"system-modal-footer")(18,"button",16),u.bIt("click",(function(){return t.close()})),u.nrm(19,"system-label",17),u.k0s(),u.j41(20,"button",18),u.bIt("click",(function(){return t.create()})),u.nrm(21,"system-label",19),u.k0s()()()),2&e&&(u.R7$(2),u.Y8G("label",t.modalTitle),u.R7$(6),u.R50("ngModel",t.selected_template),u.Y8G("disabled",0==t.templates.length),u.R7$(),u.Y8G("ngForOf",t.templates),u.R7$(2),u.Y8G("@slideInOut",t.expanded?"open":"closed"),u.R7$(2),u.Y8G("ngIf","html"===t.selected_format&&!t.loading_output&&t.selected_template),u.R7$(),u.Y8G("ngIf","pdf"===t.selected_format&&!t.loading_output&&t.blobUrl),u.R7$(),u.Y8G("ngIf",t.loading_output),u.R7$(),u.Y8G("ngIf",!t.selected_template&&!t.loading_output),u.R7$(4),u.Y8G("disabled",!t.selected_template||t.loading_output))},dependencies:[i.Sq,i.bT,c.xH,c.y7,c.wz,c.BC,c.vS,M.W,O.D,T.I,Y.Q,F.C,V.P],encapsulation:2})}return DocumentCreateRevisionModal})(),z=(()=>{class ModuleDocuments{static#e=this.ɵfac=function(e){return new(e||ModuleDocuments)};static#t=this.ɵmod=u.$C({type:ModuleDocuments});static#s=this.ɵinj=u.G2t({imports:[i.MD,c.YN,n.ObjectFields,l.GlobalComponents,o.ObjectComponents,a.SystemComponents,d.h]})}return ModuleDocuments})();("undefined"==typeof ngJitMode||ngJitMode)&&u.Obh(z,{declarations:[X,B,H],imports:[i.MD,c.YN,n.ObjectFields,l.GlobalComponents,o.ObjectComponents,a.SystemComponents,d.h]})}}]);