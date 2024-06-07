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
"use strict";(self.webpackChunkcore=self.webpackChunkcore||[]).push([["src_include_spicemerge_spicemerge_ts"],{90950:(e,t,s)=>{s.r(t),s.d(t,{ModuleSpiceMerge:()=>H});var l=s(60177),i=s(84341),d=s(71341),r=s(7745),o=s(12948),a=s(37328),n=s(70569),c=s(35911),m=s(75103),g=s(54438),u=s(83935);let h=(()=>{class objectmerge{constructor(e){this.metadata=e,this.masterId="",this.allowSwitchMaster=!0,this.masterModule="",this.mergeFields=[],this.mergeSource={}}setModule(e){this.masterModule=e,this.getMergeFields()}getMergeFields(){this.mergeFields=[];let e=this.metadata.getModuleFields(this.masterModule);for(let t in e){("1"==e[t].duplicate_merge||!0===e[t].duplicate_merge||void 0===e[t].duplicate_merge||"enabled"==e[t].duplicate_merge)&&"id"!=e[t].type&&("non-db"!=e[t].source||"linked"==e[t].type||"linkedparent"==e[t].type||e[t].name.endsWith("_address"))&&this.mergeFields.push(e[t])}}setAllfieldSources(e){this.mergeSource={};for(let t of this.mergeFields)this.mergeSource[t.name]=e}static#e=this.ɵfac=function(e){return new(e||objectmerge)(g.KVO(u.yu))};static#t=this.ɵprov=g.jDH({token:objectmerge,factory:objectmerge.ɵfac})}return objectmerge})();var b=s(40553),p=s(57363),f=s(49722),M=s(50531),j=s(32062),S=s(40713),y=s(25028),F=s(88418),k=s(83524),G=s(72793),O=s(94861),R=s(76115);const v=e=>({"slds-theme--success":e});function w(e,t){if(1&e&&g.nrm(0,"tr",3),2&e){const e=t.$implicit,s=g.XpG();g.Y8G("ngClass",g.eq3(6,v,s.isCurrentModel(e.id)))("displaylinks",!1)("rowselect",!0)("rowselectdisabled",s.disableSelect(e))("listItem",e)("showActionMenu",!1)}}let C=(()=>{class ObjectMergeModalRecords{constructor(e,t,s){this.metadata=e,this.model=t,this.modellist=s,this.listFields=[];let l=this.metadata.getComponentConfig("ObjectMergeModalRecords",this.model.module),i=this.metadata.getFieldSetFields(l.fieldset);for(let e of i)e.fieldconfig.hidden||this.listFields.push(e)}isCurrentModel(e){return this.model.id&&this.model.id==e}disableSelect(e){return e.id==this.model.id||!e.acl?.delete}static#e=this.ɵfac=function(e){return new(e||ObjectMergeModalRecords)(g.rXU(u.yu),g.rXU(c.g),g.rXU(m.K))};static#t=this.ɵcmp=g.VBU({type:ObjectMergeModalRecords,selectors:[["object-merge-modal-records"]],decls:5,vars:2,consts:[[1,"slds-table","slds-table--bordered","slds-table--cell-buffer"],["object-list-header","",1,"slds-text-title--caps",3,"showRowActionMenu"],["object-list-item","","class","slds-hint-parent",3,"ngClass","displaylinks","rowselect","rowselectdisabled","listItem","showActionMenu",4,"ngFor","ngForOf"],["object-list-item","",1,"slds-hint-parent",3,"ngClass","displaylinks","rowselect","rowselectdisabled","listItem","showActionMenu"]],template:function(e,t){1&e&&(g.j41(0,"table",0)(1,"thead"),g.nrm(2,"tr",1),g.k0s(),g.j41(3,"tbody"),g.DNE(4,w,1,8,"tr",2),g.k0s()()),2&e&&(g.R7$(2),g.Y8G("showRowActionMenu",!1),g.R7$(2),g.Y8G("ngForOf",t.modellist.listData.list))},dependencies:[l.YU,l.Sq,O.R,R.Z],encapsulation:2})}return ObjectMergeModalRecords})();var $=s(41731),I=s(66589),D=s(45915),X=s(15091);let E=(()=>{class ObjectMergeModalDataField{constructor(e,t){this.model=e,this.modellist=t,this.fieldname="",this.fielddata={},this.model.module=this.modellist.module}ngOnInit(){this.model.setData(this.fielddata,!1)}static#e=this.ɵfac=function(e){return new(e||ObjectMergeModalDataField)(g.rXU(c.g),g.rXU(m.K))};static#t=this.ɵcmp=g.VBU({type:ObjectMergeModalDataField,selectors:[["object-merge-modal-data-field"]],inputs:{fieldname:"fieldname",fieldConfig:"fieldConfig",fielddata:"fielddata"},features:[g.Jv_([c.g])],decls:1,vars:3,consts:[[3,"field","fieldconfig","fielddisplayclass"]],template:function(e,t){1&e&&g.nrm(0,"field-container",0),2&e&&g.Y8G("field",t.fieldname)("fieldconfig",t.fieldConfig)("fielddisplayclass","slds-truncate")},dependencies:[X.y],encapsulation:2})}return ObjectMergeModalDataField})();function U(e,t){if(1&e){const e=g.RV6();g.j41(0,"td",7)(1,"a",8),g.bIt("click",(function(){const t=g.eBV(e).$implicit,s=g.XpG();return g.Njj(s.selectAllFields(t.id))})),g.nrm(2,"system-label",9),g.k0s()()}}function x(e,t){if(1&e){const e=g.RV6();g.j41(0,"td",7)(1,"div",10)(2,"div",11)(3,"system-input-radio",12),g.mxI("ngModelChange",(function(t){g.eBV(e);const s=g.XpG();return g.DH7(s.objectmerge.masterId,t)||(s.objectmerge.masterId=t),g.Njj(t)})),g.nrm(4,"system-label",13),g.k0s()()()()}if(2&e){const e=t.$implicit,s=g.XpG();g.R7$(3),g.Y8G("value",e.id)("disabled",!s.canSwitchMaster),g.R50("ngModel",s.objectmerge.masterId)}}const B=e=>({"slds-text-color_success":e});function Y(e,t){if(1&e&&(g.j41(0,"th",4)(1,"div",14),g.EFF(2),g.k0s()()),2&e){const e=t.$implicit,s=g.XpG();g.R7$(),g.Y8G("ngClass",g.eq3(2,B,s.isCurrentModel(e.id))),g.R7$(),g.JRh(e.summary_text)}}const A=()=>({}),L=e=>({fieldtype:"address",key:e});function N(e,t){if(1&e){const e=g.RV6();g.j41(0,"td",17)(1,"div",20)(2,"system-input-radio",21),g.bIt("ngModelChange",(function(t){g.eBV(e);const s=g.XpG(2).$implicit,l=g.XpG();return g.Njj(l.setMergeSource(s,t))})),g.k0s(),g.nrm(3,"object-merge-modal-data-field",22),g.k0s()()}if(2&e){const e=t.$implicit,s=g.XpG(2).$implicit,l=g.XpG();g.R7$(2),g.Y8G("name",s.name)("value",e.id)("ngModel",l.objectmerge.mergeSource[s.name]),g.R7$(),g.Y8G("fieldname",s.name)("fieldConfig",l.isAddressGroupField(s)?g.eq3(7,L,s.name.split("_")[0]):g.lJ4(6,A))("fielddata",e)}}function V(e,t){if(1&e&&(g.j41(0,"tr",16)(1,"td",17),g.nrm(2,"system-label-fieldname",18),g.k0s(),g.DNE(3,N,4,9,"td",19),g.k0s()),2&e){const e=g.XpG().$implicit,t=g.XpG();g.R7$(2),g.Y8G("module",t.modellist.module)("field",e.name),g.R7$(),g.Y8G("ngForOf",t.getSelected())("ngForTrackBy",t.trackByFn)}}function T(e,t){if(1&e&&(g.qex(0),g.DNE(1,V,4,4,"tr",15),g.bVm()),2&e){const e=t.$implicit,s=g.XpG();g.R7$(),g.Y8G("ngIf",s.showField(e))}}let J=(()=>{class ObjectMergeModalData{constructor(e,t,s,l,i){this.view=e,this.metadata=t,this.modellist=s,this.objectmerge=l,this.model=i,this.view.displayLabels=!1}get canSwitchMaster(){return this.objectmerge.allowSwitchMaster}getSelected(){return this.modellist.listData.list.filter((e=>e.selected))}isCurrentModel(e){return this.model.id&&this.model.id==e}selectAllFields(e){this.objectmerge.setAllfieldSources(e)}showField(e){for(let t of this.getSelected()){if(!!t[e.name]&&!_.isObject(t[e.name])||_.isObject(t[e.name])&&!_.isEmpty(t[e.name]))return!("assigned_user_id"==e.name||"parent_id"==e.name||this.isAddressField(e.name));if(this.isAddressGroupField(e)){if(Object.keys(t).some((s=>s.startsWith(`${e.name}_`)&&!!t[s])))return!0}}return!1}isAddressField(e){return e.includes("_address_")}setMergeSource(e,t){this.isAddressGroupField(e)?this.objectmerge.mergeFields.forEach((s=>{s.name.startsWith(`${e.name}_`)&&(this.objectmerge.mergeSource[s.name]=t)})):this.objectmerge.mergeSource[e.name]=t}isAddressGroupField(e){return e.name.endsWith("_address")&&"non-db"==e.source}trackByFn(e){return e}static#e=this.ɵfac=function(e){return new(e||ObjectMergeModalData)(g.rXU($.U),g.rXU(u.yu),g.rXU(m.K),g.rXU(h),g.rXU(c.g))};static#t=this.ɵcmp=g.VBU({type:ObjectMergeModalData,selectors:[["object-merge-modal-data"]],features:[g.Jv_([$.U])],decls:15,vars:7,consts:[[1,"slds-table","slds-table--col-bordered","slds-no-row-hover","slds-table--fixed-layout"],["class","slds-text-align--center",4,"ngFor","ngForOf","ngForTrackBy"],[1,"slds-table","slds-table--col-bordered","slds-no-row-hover","slds-table--fixed-layout","slds-table--striped","slds-border--bottom"],[1,"slds-text-title_bold","slds-border--bottom","slds-border--top"],["scope","col"],["scope","col",4,"ngFor","ngForOf","ngForTrackBy"],[4,"ngFor","ngForOf"],[1,"slds-text-align--center"],["href","javascript:void(0)",3,"click"],["label","LBL_SELECT_ALL_FIELDS"],[1,"slds-form-element"],[1,"slds-form-element__control"],["name","master",3,"value","disabled","ngModel","ngModelChange"],["label","LBL_USE_AS_MASTER",1,"slds-p-left--xx-small"],[1,"slds-truncate","slds-text-align--center",3,"ngClass"],["class","slds-align-top",4,"ngIf"],[1,"slds-align-top"],[1,"slds-truncate"],[3,"module","field"],["class","slds-truncate",4,"ngFor","ngForOf","ngForTrackBy"],[1,"slds-grid"],["name","master",3,"name","value","ngModel","ngModelChange"],[3,"fieldname","fieldConfig","fielddata"]],template:function(e,t){1&e&&(g.j41(0,"table",0)(1,"tbody")(2,"tr"),g.nrm(3,"td"),g.DNE(4,U,3,0,"td",1),g.k0s(),g.j41(5,"tr"),g.nrm(6,"td"),g.DNE(7,x,5,3,"td",1),g.k0s()()(),g.j41(8,"table",2)(9,"thead")(10,"tr",3),g.nrm(11,"th",4),g.DNE(12,Y,3,4,"th",5),g.k0s()(),g.j41(13,"tbody"),g.DNE(14,T,2,1,"ng-container",6),g.k0s()()),2&e&&(g.R7$(4),g.Y8G("ngForOf",t.getSelected())("ngForTrackBy",t.trackByFn),g.R7$(3),g.Y8G("ngForOf",t.getSelected())("ngForTrackBy",t.trackByFn),g.R7$(5),g.Y8G("ngForOf",t.getSelected())("ngForTrackBy",t.trackByFn),g.R7$(2),g.Y8G("ngForOf",t.objectmerge.mergeFields))},dependencies:[l.YU,l.Sq,l.bT,i.BC,i.vS,I.J,j.W,D.P,E],encapsulation:2})}return ObjectMergeModalData})(),q=(()=>{class ObjectMergeModalExecute{static#e=this.ɵfac=function(e){return new(e||ObjectMergeModalExecute)};static#t=this.ɵcmp=g.VBU({type:ObjectMergeModalExecute,selectors:[["object-merge-modal-execute"]],decls:5,vars:0,consts:[[1,"slds-p-around--medium"],[1,"slds-grid","slds-grid--align-center","slds-text-heading--medium","slds-p-vertical--medium"],["label","MSG_CONFIRM_MERGE"],[1,"slds-grid","slds-grid--align-center","slds-p-vertical--medium"],["label","MSG_CONFIRM_MERGE","length","long"]],template:function(e,t){1&e&&(g.j41(0,"div",0)(1,"div",1),g.nrm(2,"system-label",2),g.k0s(),g.j41(3,"div",3),g.nrm(4,"system-label",4),g.k0s()())},dependencies:[j.W],encapsulation:2})}return ObjectMergeModalExecute})();function W(e,t){if(1&e&&(g.j41(0,"span"),g.EFF(1),g.k0s()),2&e){const e=g.XpG();g.R7$(),g.SpI(" - ",e.model.data.summary_text,"")}}let K=(()=>{class ObjectMergeModal{constructor(e,t,s,l,i,d,r,o,a){this.broadcast=e,this.router=t,this.metadata=s,this.objectmerge=l,this.parentmodel=i,this.model=d,this.modellist=r,this.backend=o,this.modal=a,this.mergemodels=[],this.currentMergeStep=0,this.mergeSteps=["records","fields","execute"]}ngOnInit(){this.model.module=this.parentmodel.module,this.modellist.module=this.model.module,this.modellist.setListType("all",!1),this.objectmerge.setModule(this.model.module),this.parentmodel.id?(this.model.id=this.parentmodel.id,this.model.setData(this.parentmodel.data,!1),this.objectmerge.masterId=this.model.id,this.objectmerge.setAllfieldSources(this.model.id),this.objectmerge.allowSwitchMaster=this.parentmodel.checkAccess("delete"),this.model.setField("selected",!0),this.modellist.listData.list.push(this.model.data)):(this.mergeSteps=["fields","execute"],this.mergemodels.length==this.mergemodels.filter((e=>e.acl?.delete)).length?this.objectmerge.masterId=this.mergemodels[0].id:(this.objectmerge.masterId=this.mergemodels.find((e=>!e.acl?.delete)).id,this.objectmerge.allowSwitchMaster=!1),this.objectmerge.setAllfieldSources(this.objectmerge.masterId));for(let e of this.mergemodels)this.modellist.listData.list.push(e)}closeModal(){this.self.destroy()}getCurrentStep(){return this.mergeSteps[this.currentMergeStep]}nextStep(){if(this.currentMergeStep<this.mergeSteps.length-1)this.currentMergeStep,this.currentMergeStep++;else{let e={};for(let t of this.objectmerge.mergeFields)this.objectmerge.mergeSource[t.name]!=this.objectmerge.masterId&&(e[t.name]=this.objectmerge.mergeSource[t.name]);let t=[];for(let e of this.modellist.listData.list)e.id!=this.objectmerge.masterId&&e.selected&&t.push(e.id);this.modal.openModal("SystemLoadingModal").subscribe((s=>{s.instance.messagelabel="LBL_MERGING",this.backend.postRequest(`module/${this.model.module}/${this.objectmerge.masterId}/mergebeans`,{},{fields:e,duplicates:t}).subscribe((e=>{s.instance.self.destroy(),this.broadcast.broadcastMessage("model.save",{id:this.objectmerge.masterId,module:this.model.module,data:e.data}),this.broadcast.broadcastMessage("model.merge",{id:this.objectmerge.masterId,module:this.model.module});for(let e of t)this.broadcast.broadcastMessage("model.delete",{id:e,module:this.model.module});this.model.id&&this.model.id!=this.objectmerge.masterId&&this.router.navigate([`/module/${this.model.module}/${this.objectmerge.masterId}`]),this.closeModal()}))}))}}get prevDisabled(){return 0===this.currentMergeStep}get nextDisabled(){return 0===this.currentMergeStep&&this.modellist.getSelectedCount()<=1}prevStep(){this.currentMergeStep>0&&this.currentMergeStep--}static#e=this.ɵfac=function(e){return new(e||ObjectMergeModal)(g.rXU(b.m),g.rXU(p.Ix),g.rXU(u.yu),g.rXU(h),g.rXU(c.g,4),g.rXU(c.g),g.rXU(m.K),g.rXU(f.H),g.rXU(M.y))};static#t=this.ɵcmp=g.VBU({type:ObjectMergeModal,selectors:[["object-merge-modal"]],inputs:{mergemodels:"mergemodels"},features:[g.Jv_([c.g,m.K,h])],decls:15,vars:9,consts:[["size","large"],[3,"close"],["label","LBL_MERGE_RECORD"],[4,"ngIf"],["margin","none",3,"grow"],[3,"hidden"],[1,"slds-grid","slds-grid--align-spread","slds-grid--vertical-align-center"],[1,"slds-button","slds-button--neutral","slds-order--1",3,"disabled","click"],["label","LBL_PREVIOUS"],["system-progress-list-shade","",1,"slds-grow","slds-order--2",3,"steps","step"],[1,"slds-button","slds-button--brand","slds-order--3",3,"disabled","click"],["label","LBL_NEXT"]],template:function(e,t){1&e&&(g.j41(0,"system-modal",0)(1,"system-modal-header",1),g.bIt("close",(function(){return t.closeModal()})),g.nrm(2,"system-label",2),g.DNE(3,W,2,1,"span",3),g.k0s(),g.j41(4,"system-modal-content",4),g.nrm(5,"object-merge-modal-records",5)(6,"object-merge-modal-data",5)(7,"object-merge-modal-execute",5),g.k0s(),g.j41(8,"system-modal-footer")(9,"div",6)(10,"button",7),g.bIt("click",(function(){return t.prevStep()})),g.nrm(11,"system-label",8),g.k0s(),g.nrm(12,"system-progress-list",9),g.j41(13,"button",10),g.bIt("click",(function(){return t.nextStep()})),g.nrm(14,"system-label",11),g.k0s()()()()),2&e&&(g.R7$(3),g.Y8G("ngIf",t.model.id),g.R7$(),g.Y8G("grow",!0),g.R7$(),g.Y8G("hidden","records"!=t.getCurrentStep()),g.R7$(),g.Y8G("hidden","fields"!=t.getCurrentStep()),g.R7$(),g.Y8G("hidden","execute"!=t.getCurrentStep()),g.R7$(3),g.Y8G("disabled",t.prevDisabled),g.R7$(2),g.Y8G("steps",t.mergeSteps)("step",t.currentMergeStep),g.R7$(),g.Y8G("disabled",t.nextDisabled))},dependencies:[l.bT,j.W,S.D,y.I,F.Q,k.C,G.B,C,J,q],encapsulation:2})}return ObjectMergeModal})(),H=(()=>{class ModuleSpiceMerge{static#e=this.ɵfac=function(e){return new(e||ModuleSpiceMerge)};static#t=this.ɵmod=g.$C({type:ModuleSpiceMerge});static#s=this.ɵinj=g.G2t({imports:[l.MD,i.YN,r.ObjectFields,o.GlobalComponents,a.ObjectComponents,n.SystemComponents,d.h]})}return ModuleSpiceMerge})();("undefined"==typeof ngJitMode||ngJitMode)&&g.Obh(H,{declarations:[K,C,J,E,q],imports:[l.MD,i.YN,r.ObjectFields,o.GlobalComponents,a.ObjectComponents,n.SystemComponents,d.h]})}}]);