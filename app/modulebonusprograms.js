/*!
 * 
 *                     aacService
 *
 *                     release: 2023.01.001
 *
 *                     date: 2023-05-30 13:31:03
 *
 *                     build: 2023.01.001.1685446263677
 *
 */
"use strict";(self.webpackChunkcore=self.webpackChunkcore||[]).push([["src_modules_bonusprograms_modulebonusprograms_ts"],{9766:(e,t,s)=>{s.r(t),s.d(t,{ModuleBonusPrograms:()=>j});var a=s(6895),d=s(433),n=s(4357),l=s(5886),i=s(3283),o=s(8363),r=s(1652),u=s(7040),c=s(1571),m=s(5710),g=s(2294),p=s(5329),f=s(4154),_=s(1933),h=s(6625),b=s(6367),B=s(3208),y=s(5638),C=s(3463);function E(e,t){if(1&e&&c._UZ(0,"field-label",3),2&e){const e=c.oxw();c.Q6J("fieldname",e.fieldname)("fieldconfig",e.fieldconfig)}}function v(e,t){if(1&e&&c._UZ(0,"system-label",7),2&e){const e=c.oxw().$implicit;c.Q6J("label",e.label)}}function x(e,t){if(1&e&&(c.ynx(0),c.YNc(1,v,1,1,"system-label",6),c.BQk()),2&e){const e=t.$implicit,s=c.oxw(2);c.xp6(1),c.Q6J("ngIf",s.value==e.method)}}function L(e,t){if(1&e&&(c.TgZ(0,"field-generic-display",4),c.YNc(1,x,2,1,"ng-container",5),c.qZA()),2&e){const e=c.oxw();c.Q6J("fielddisplayclass",e.fielddisplayclass)("fieldconfig",e.fieldconfig)("editable",e.isEditable()),c.xp6(1),c.Q6J("ngForOf",e.types)}}function M(e,t){if(1&e&&(c.TgZ(0,"option",16),c._UZ(1,"system-label",7),c.qZA()),2&e){const e=t.$implicit;c.Q6J("value",e.method),c.xp6(1),c.Q6J("label",e.label)}}function T(e,t){if(1&e){const e=c.EpF();c.TgZ(0,"div",8)(1,"div",9)(2,"div",10)(3,"div",11)(4,"select",12),c.NdJ("ngModelChange",(function(t){c.CHM(e);const s=c.oxw();return c.KtG(s.value=t)})),c._UZ(5,"option",13),c.YNc(6,M,2,2,"option",14),c.qZA()()()(),c._UZ(7,"field-messages",15),c.qZA()}if(2&e){const e=c.oxw();c.Q6J("ngClass",e.css_classes),c.xp6(4),c.Q6J("ngModel",e.value)("disabled",0===(null==e.types?null:e.types.length)),c.xp6(2),c.Q6J("ngForOf",e.types),c.xp6(1),c.Q6J("fieldname",e.fieldname)}}let Y=(()=>{class BonusProgramValidityTypesField extends u.O{constructor(e,t,s,a,d,n){super(e,t,s,a,d),this.model=e,this.view=t,this.language=s,this.metadata=a,this.router=d,this.configurationService=n,this.types=[],this.loadTypes()}set value(e){this.model.setField("validity_date_method",e),this.types.some((t=>{if(t.method==e)return this.model.setField("validity_date_editable",t.editing_allowed),!0}))}get value(){return this.model.getField("validity_date_method")}loadTypes(){this.types=this.configurationService.getData("sysbonusprogramvaliditytypes")}}return BonusProgramValidityTypesField.ɵfac=function(e){return new(e||BonusProgramValidityTypesField)(c.Y36(m.o),c.Y36(g.e),c.Y36(p.d),c.Y36(f.Pu),c.Y36(_.F0),c.Y36(h.C))},BonusProgramValidityTypesField.ɵcmp=c.Xpm({type:BonusProgramValidityTypesField,selectors:[["ng-component"]],features:[c.qOj],decls:3,vars:3,consts:[[3,"fieldname","fieldconfig",4,"ngIf"],[3,"fielddisplayclass","fieldconfig","editable",4,"ngIf"],["class","slds-form-element__control slds-m-vertical--xx-small",3,"ngClass",4,"ngIf"],[3,"fieldname","fieldconfig"],[3,"fielddisplayclass","fieldconfig","editable"],[4,"ngFor","ngForOf"],[3,"label",4,"ngIf"],[3,"label"],[1,"slds-form-element__control","slds-m-vertical--xx-small",3,"ngClass"],[1,"slds-form-element"],[1,"slds-form-element__control"],[1,"slds-select_container"],[1,"slds-select",3,"ngModel","disabled","ngModelChange"],["value",""],[3,"value",4,"ngFor","ngForOf"],[3,"fieldname"],[3,"value"]],template:function(e,t){1&e&&(c.YNc(0,E,1,2,"field-label",0),c.YNc(1,L,2,4,"field-generic-display",1),c.YNc(2,T,8,5,"div",2)),2&e&&(c.Q6J("ngIf",t.displayLabel),c.xp6(1),c.Q6J("ngIf",!t.isEditMode()),c.xp6(1),c.Q6J("ngIf",t.isEditable()&&t.isEditMode()))},dependencies:[a.mk,a.sg,a.O5,d.YN,d.Kr,d.EJ,d.JJ,d.On,b.q,B.D,y.a,C._],encapsulation:2}),BonusProgramValidityTypesField})();var N=s(3421),D=s(6538),F=s(6822);function w(e,t){if(1&e&&c._UZ(0,"field-label",5),2&e){const e=c.oxw(2);c.Q6J("fieldname",e.fieldname)("fieldconfig",e.fieldconfig)}}function A(e,t){if(1&e&&(c.ynx(0),c.YNc(1,w,1,2,"field-label",2),c.TgZ(2,"field-generic-display",3),c._UZ(3,"system-display-datetime",4),c._uU(4,"  - "),c._UZ(5,"system-display-datetime",4),c.qZA(),c.BQk()),2&e){const e=c.oxw();c.xp6(1),c.Q6J("ngIf",e.displayLabel),c.xp6(1),c.Q6J("fielddisplayclass",e.fielddisplayclass)("editable",e.isEditable())("fieldconfig",e.fieldconfig),c.xp6(1),c.Q6J("date",e.startDate)("displayTime",!1),c.xp6(2),c.Q6J("date",e.endDate)("displayTime",!1)}}function U(e,t){if(1&e){const e=c.EpF();c.TgZ(0,"div",6)(1,"div",7)(2,"div",8)(3,"div",9)(4,"label",10),c._UZ(5,"system-label",11),c.qZA(),c.TgZ(6,"system-input-date",12),c.NdJ("ngModelChange",(function(t){c.CHM(e);const s=c.oxw();return c.KtG(s.startDate=t)})),c.qZA()()(),c.TgZ(7,"div",8)(8,"div",9)(9,"label",10),c._UZ(10,"system-label",13),c.qZA(),c.TgZ(11,"system-input-date",12),c.NdJ("ngModelChange",(function(t){c.CHM(e);const s=c.oxw();return c.KtG(s.endDate=t)})),c.qZA()()()(),c._UZ(12,"field-messages",14),c.qZA()}if(2&e){const e=c.oxw();c.Q6J("ngClass",e.css_classes),c.xp6(6),c.Q6J("ngModel",e.startDate),c.xp6(5),c.Q6J("ngModel",e.endDate),c.xp6(1),c.Q6J("fieldname",e.fieldname)}}let Z=(()=>{class BonusCardValidityDateField extends N.m{constructor(e,t,s,a,d){super(e,t,s,a,d),this.model=e,this.view=t,this.language=s,this.metadata=a,this.router=d}isEditable(e=this.fieldname){return 1==this.model.getField("validity_date_editable")&&super.isEditable(e)}}return BonusCardValidityDateField.ɵfac=function(e){return new(e||BonusCardValidityDateField)(c.Y36(m.o),c.Y36(g.e),c.Y36(p.d),c.Y36(f.Pu),c.Y36(_.F0))},BonusCardValidityDateField.ɵcmp=c.Xpm({type:BonusCardValidityDateField,selectors:[["ng-component"]],features:[c.qOj],decls:2,vars:2,consts:[[4,"ngIf"],["class","slds-form-element__control slds-p-around--xx-small",3,"ngClass",4,"ngIf"],[3,"fieldname","fieldconfig",4,"ngIf"],[3,"fielddisplayclass","editable","fieldconfig"],[3,"date","displayTime"],[3,"fieldname","fieldconfig"],[1,"slds-form-element__control","slds-p-around--xx-small",3,"ngClass"],[1,"slds-grid","slds-gutters_direct-xx-small"],[1,"slds-size--1-of-2","slds-col"],[1,"slds-form-element"],[1,"slds-form-element__label"],["label","LBL_DATE_START"],[3,"ngModel","ngModelChange"],["label","LBL_DATE_END"],[3,"fieldname"]],template:function(e,t){1&e&&(c.YNc(0,A,6,8,"ng-container",0),c.YNc(1,U,13,4,"div",1)),2&e&&(c.Q6J("ngIf",!t.isEditMode()),c.xp6(1),c.Q6J("ngIf",t.isEditable()&&t.isEditMode()))},dependencies:[a.mk,a.O5,d.JJ,d.On,b.q,B.D,y.a,D.a,F.z,C._],encapsulation:2}),BonusCardValidityDateField})();var J=s(5861),I=s(9808),O=s(4044),k=s(4505),R=s(3278),P=s(6163),Q=s(2422);let S=(()=>{class BonusCardExtendButton{constructor(e,t,s,a,d,n,l,i,o,r){this.extensionModel=e,this.bonusCardModel=t,this.language=s,this.metadata=a,this.modal=d,this.backend=n,this.toast=l,this.router=i,this.modelUtilities=o,this.userpreferences=r}execute(){var e=this;const t=this.modal.await(this.language.getLabel("LBL_CALCULATING")),s=`module/BonusCards/${this.bonusCardModel.id}/extensionvaliditydate`;this.backend.getRequest(s).subscribe(function(){var s=(0,J.Z)((function*(s){if(t.next(!0),t.complete(),s.extendable){let t=s.date?e.modelUtilities.backend2spice("BonusCards","valid_until",s.date):(new moment).add("1","years");const a=e.bonusCardModel.getField("valid_until").format(e.userpreferences.getDateFormat()),d=e.bonusCardModel.getField("purchase_date").format(e.userpreferences.getDateFormat());let n,l=`${e.language.getLabel("LBL_PURCHASE_DATE")} ${d} ${e.language.getLabel("LBL_VALID_UNTIL")} ${a} \n ${e.language.getLabel("LBL_NEW_VALID_UNTIL_DATE")}`;if(s.editable?(n=yield(0,I.n)(e.modal.prompt("input_date",l,"LBL_EXTEND","shade",t)),n=yield(0,I.n)(e.modal.prompt("input_date",l,"LBL_EXTEND","shade",t)),t=n):(l+=` ${t.format(e.userpreferences.getDateFormat())}`,n=yield(0,I.n)(e.modal.confirm(l,"LBL_EXTEND"))),!n)return;e.bonusCardModel.startEdit(),e.bonusCardModel.setFields({valid_until:t,sent:0}),e.bonusCardModel.save(),e.extensionModel.reset(),e.extensionModel.module="BonusCardExtensions",e.extensionModel.initialize(),e.extensionModel.setFields({valid_until:t,bonuscard_id:e.bonusCardModel.id,name:`${e.bonusCardModel.getField("summary_text")} - ${t.format(e.userpreferences.getDateFormat())}`}),e.extensionModel.save()}else e.toast.sendToast(e.language.getLabel("MSG_EXTENDING_NOT_ALLOWED"))}));return function(e){return s.apply(this,arguments)}}(),(()=>this.toast.sendToast(this.language.getLabel("ERR_FAILED_TO_EXECUTE"))))}}return BonusCardExtendButton.ɵfac=function(e){return new(e||BonusCardExtendButton)(c.Y36(m.o),c.Y36(m.o,4),c.Y36(p.d),c.Y36(f.Pu),c.Y36(O.o),c.Y36(k.y),c.Y36(R.A),c.Y36(_.F0),c.Y36(P.A),c.Y36(Q.z))},BonusCardExtendButton.ɵcmp=c.Xpm({type:BonusCardExtendButton,selectors:[["ng-component"]],features:[c._Bn([m.o])],decls:1,vars:0,consts:[["label","LBL_EXTEND"]],template:function(e,t){1&e&&c._UZ(0,"system-label",0)},dependencies:[C._],encapsulation:2}),BonusCardExtendButton})();var X=s(2644);let q=(()=>{class BonusCardBulkExtendButton{constructor(e,t,s,a,d,n,l,i,o,r,u,c){this.model=e,this.bonusCardModel=t,this.view=s,this.language=a,this.metadata=d,this.modellist=n,this.modal=l,this.backend=i,this.toast=o,this.router=r,this.modelUtilities=u,this.userpreferences=c}get exportCount(){return this.modellist.getSelectedCount()??this.modellist.listData.totalcount}get disabled(){return 0==this.modellist.getSelectedCount()}execute(){var e=this;const t=this.modal.await(this.language.getLabel("LBL_PROCESSING")),s=this.modellist.getSelectedIDs();this.backend.getRequest("module/BonusCards/extendablecards",{cardsIds:s}).subscribe(function(){var s=(0,J.Z)((function*(s){if(t.next(!0),t.complete(),0==s.cardsIds?.length)return e.toast.sendToast(e.language.getLabel("MSG_EXTENDING_NOT_ALLOWED"));const a=`${e.language.getLabel("MSG_CARDS_TO_EXTEND")} ${s.cardsIds.length}`;(yield(0,I.n)(e.modal.confirm(a,"LBL_BULK_EXTEND")))&&e.backend.postRequest("module/BonusCards/bulkextend",null,{cardsIds:s.cardsIds}).subscribe((()=>{e.toast.sendToast(e.language.getLabel("MSG_SUCCESSFULLY_EXTENDED"))}),(()=>{e.toast.sendToast(e.language.getLabel("ERR_FAILED_TO_EXECUTE"))}))}));return function(e){return s.apply(this,arguments)}}(),(()=>this.toast.sendToast(this.language.getLabel("ERR_FAILED_TO_EXECUTE"))))}}return BonusCardBulkExtendButton.ɵfac=function(e){return new(e||BonusCardBulkExtendButton)(c.Y36(m.o),c.Y36(m.o,4),c.Y36(g.e),c.Y36(p.d),c.Y36(f.Pu),c.Y36(X.t),c.Y36(O.o),c.Y36(k.y),c.Y36(R.A),c.Y36(_.F0),c.Y36(P.A),c.Y36(Q.z))},BonusCardBulkExtendButton.ɵcmp=c.Xpm({type:BonusCardBulkExtendButton,selectors:[["ng-component"]],features:[c._Bn([m.o])],decls:3,vars:1,consts:[["label","LBL_BULK_EXTEND"]],template:function(e,t){1&e&&(c.TgZ(0,"span"),c._UZ(1,"system-label",0),c._uU(2),c.qZA()),2&e&&(c.xp6(2),c.hij(" (",t.exportCount,")"))},dependencies:[C._],encapsulation:2}),BonusCardBulkExtendButton})(),G=(()=>{class BonusCardNewButton{constructor(e,t,s,a,d,n,l,i){this.language=e,this.metadata=t,this.modal=s,this.toast=a,this.backend=d,this.model=n,this.parentModel=l,this.modelUtilities=i,this.disabled=!0}execute(){var e=this;return(0,J.Z)((function*(){let t;t="BonusPrograms"==e.parentModel.module&&e.parentModel.id?{id:e.parentModel.id,name:e.parentModel.getField("summary_text"),validity_date_editable:e.parentModel.getField("validity_date_editable")}:yield e.promptProgramSelection();let s=yield(0,I.n)(e.backend.getRequest(`module/BonusCards/program/${t.id}/validitydates`)).catch((()=>e.toast.sendToast(e.language.getLabel("ERR_FAILED_TO_EXECUTE"))));s||(s={date_start:new moment,date_end:(new moment).add(1,"years")}),e.addNew({...t,...s})}))()}ngOnInit(){this.model.module="BonusCards",this.metadata.checkModuleAcl(this.model.module,"create")&&(this.disabled=!1)}addNew(e){let t;this.model.id=void 0,this.model.initialize(),e&&(t={bonusprogram_id:e.id,bonusprogram_name:e.name,purchase_date:this.modelUtilities.backend2spice(this.model.module,"purchase_date",e.date_start),valid_until:this.modelUtilities.backend2spice(this.model.module,"valid_until",e.date_end),validity_date_editable:e.validity_date_editable}),this.model.addModel("",this.parentModel,t)}promptProgramSelection(){var e=this;return(0,J.Z)((function*(){const t=yield(0,I.n)(e.backend.getList("BonusPrograms",[{sortfield:"last_run_date",sortdirection:"DESC"}],{start:0,limit:1e3})).catch((()=>e.toast.sendToast(e.language.getLabel("ERR_FAILED_TO_EXECUTE"))));if(!t?.list||0===t.list.length)return void e.toast.sendToast("LBL_NO_PROGRAMS_FOUND","warning");const s=t.list.map((e=>({value:e.id,display:e.summary_text,validity_date_editable:e.validity_date_editable}))),a=yield(0,I.n)(e.modal.prompt("input","MSG_SELECT_PROGRAM","LBL_BONUSCARD","shade",null,s,!0));if(!a)return;const d=s.find((e=>e.value==a));return{id:a,name:d.display,validity_date_editable:d.validity_date_editable}}))()}}return BonusCardNewButton.ɵfac=function(e){return new(e||BonusCardNewButton)(c.Y36(p.d),c.Y36(f.Pu),c.Y36(O.o),c.Y36(R.A),c.Y36(k.y),c.Y36(m.o),c.Y36(m.o,4),c.Y36(P.A))},BonusCardNewButton.ɵcmp=c.Xpm({type:BonusCardNewButton,selectors:[["bonus-cards-new-button"]],features:[c._Bn([m.o])],decls:1,vars:0,consts:[["label","LBL_NEW"]],template:function(e,t){1&e&&c._UZ(0,"system-label",0)},dependencies:[C._],encapsulation:2}),BonusCardNewButton})();var $=s(6040);let V=(()=>{class BonusCardNewRelatedButton extends G{constructor(e,t,s,a,d,n,l,i,o){super(e,t,s,a,d,n,l,i),this.language=e,this.metadata=t,this.modal=s,this.toast=a,this.backend=d,this.model=n,this.parentModel=l,this.modelUtilities=i,this.relatedModels=o,this.disabled=!0}addNew(e){let t;this.model.id=void 0,e&&(t={bonusprogram_id:e.id,bonusprogram_name:e.name,validity_date_editable:e.validity_date_editable,purchase_date:this.modelUtilities.backend2spice(this.model.module,"purchase_date",e.date_start),valid_until:this.modelUtilities.backend2spice(this.model.module,"valid_until",e.date_end)}),this.parentModel.getField("id")||this.parentModel.setField("id",this.parentModel.id),this.model.addModel("",this.parentModel,t).subscribe((e=>{0!=e&&this.relatedModels.addItems([e])}))}}return BonusCardNewRelatedButton.ɵfac=function(e){return new(e||BonusCardNewRelatedButton)(c.Y36(p.d),c.Y36(f.Pu),c.Y36(O.o),c.Y36(R.A),c.Y36(k.y),c.Y36(m.o),c.Y36(m.o,4),c.Y36(P.A),c.Y36($.j))},BonusCardNewRelatedButton.ɵcmp=c.Xpm({type:BonusCardNewRelatedButton,selectors:[["bonus-cards-new-related-button"]],features:[c._Bn([m.o]),c.qOj],decls:1,vars:0,consts:[["label","LBL_NEW"]],template:function(e,t){1&e&&c._UZ(0,"system-label",0)},dependencies:[C._],encapsulation:2}),BonusCardNewRelatedButton})(),j=(()=>{class ModuleBonusPrograms{}return ModuleBonusPrograms.ɵfac=function(e){return new(e||ModuleBonusPrograms)},ModuleBonusPrograms.ɵmod=c.oAB({type:ModuleBonusPrograms}),ModuleBonusPrograms.ɵinj=c.cJS({imports:[a.ez,d.u5,l.ObjectFields,i.GlobalComponents,o.ObjectComponents,r.SystemComponents,n.o]}),ModuleBonusPrograms})();("undefined"==typeof ngJitMode||ngJitMode)&&c.kYT(j,{declarations:[Y,Z,S,q,G,V],imports:[a.ez,d.u5,l.ObjectFields,i.GlobalComponents,o.ObjectComponents,r.SystemComponents,n.o]})}}]);