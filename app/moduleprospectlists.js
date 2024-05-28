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
"use strict";(self.webpackChunkcore=self.webpackChunkcore||[]).push([["src_modules_prospectlists_moduleprospectlists_ts"],{71202:(e,s,t)=>{t.r(s),t.d(s,{ModuleProspectLists:()=>me});var l=t(60177),i=t(84341),n=t(71341),o=t(7745),d=t(12948),a=t(37328),r=t(70569),c=t(35911),m=t(41068),u=t(54438),p=t(69904),f=t(50531),b=t(49722),g=t(57363),h=t(41081),_=t(84359),L=t(68823),v=t(32062),y=t(44985),k=t(40713),E=t(25028),R=t(88418),I=t(83524);function M(e,s){if(1&e){const e=u.RV6();u.j41(0,"div",24)(1,"div",25)(2,"div")(3,"system-checkbox",26),u.mxI("ngModelChange",(function(s){const t=u.eBV(e).$implicit;return u.DH7(t.selected,s)||(t.selected=s),u.Njj(s)})),u.k0s()(),u.j41(4,"div"),u.nrm(5,"system-icon",27),u.k0s(),u.j41(6,"div",28),u.nrm(7,"system-label-modulename",29),u.k0s(),u.j41(8,"div",28),u.EFF(9),u.k0s()(),u.j41(10,"div",13)(11,"div",30)(12,"system-checkbox",26),u.mxI("ngModelChange",(function(s){const t=u.eBV(e).$implicit;return u.DH7(t.inclRejGDPR,s)||(t.inclRejGDPR=s),u.Njj(s)})),u.k0s()()(),u.j41(13,"div",13)(14,"div",30)(15,"system-checkbox",26),u.mxI("ngModelChange",(function(s){const t=u.eBV(e).$implicit;return u.DH7(t.inclInactive,s)||(t.inclInactive=s),u.Njj(s)})),u.k0s()()()()}if(2&e){const e=s.$implicit;u.Y8G("ngClass",0==e.bean_count?"slds-text-color--inverse-weak":"slds-text-color_default"),u.R7$(3),u.R50("ngModel",e.selected),u.Y8G("disabled",0==e.bean_count),u.R7$(2),u.Y8G("module",e.module),u.R7$(2),u.Y8G("module",e.module),u.R7$(2),u.SpI("(",e.bean_count,")"),u.R7$(3),u.R50("ngModel",e.inclRejGDPR),u.Y8G("disabled",0==e.bean_count||!e.selected),u.R7$(3),u.R50("ngModel",e.inclInactive),u.Y8G("disabled",0==e.bean_count||!e.selected)}}let G=(()=>{class ProspectListsCreateTargetListFromModuleModal{constructor(e,s,t,l,i,n){this.language=e,this.model=s,this.modal=t,this.backend=l,this.router=i,this.toast=n,this.prospectListName="",this.self={},this.result={},this.beans=[],this.checkedCount=0,this.model.initialize()}ngOnInit(){this.beans=m.Ay.toArray(this.result.modules),this.beans.sort(((e,s)=>e.sort_order&&s.sort_order?e.sort_order>s.sort_order?1:-1:e.module>s.module?1:-1))}closeModal(){this.self.destroy()}get canAdd(){return this.beans.filter((e=>e.selected)).length>0}add(e=!1){if(this.prospectListName){const s=this.modal.await("LBL_SAVING_DATA");let t=this.beans.filter((e=>e.selected)).map((e=>({module:e.module,link_names:e.link_names,inclRejGDPR:e.inclRejGDPR,inclInactive:e.inclInactive})));this.backend.postRequest("module/ProspectLists/fromModule",{},{prospectListName:this.prospectListName,data:t,parentBeanId:this.parentBeanId,parentModule:this.parentModule}).subscribe({next:t=>{e?this.router.navigate(["/module/ProspectLists/"+t.prospectlistid]):this.toast.sendToast(this.language.getLabel("LBL_DATA_SAVED"),"success"),s.emit(!0),s.complete()},error:()=>{s.emit(!0),this.toast.sendToast(this.language.getLabel("ERR_FAILED_TO_EXECUTE"),"error")}}),this.closeModal()}else this.toast.sendToast(this.language.getLabel("LBL_ENTER_NAME"),"error")}static#e=this.ɵfac=function(e){return new(e||ProspectListsCreateTargetListFromModuleModal)(u.rXU(p.B),u.rXU(c.g),u.rXU(f.y),u.rXU(b.H),u.rXU(g.Ix),u.rXU(h.o))};static#s=this.ɵcmp=u.VBU({type:ProspectListsCreateTargetListFromModuleModal,selectors:[["object-create-targetlist-from-module-modal"]],inputs:{prospectListName:"prospectListName"},features:[u.Jv_([c.g])],decls:32,vars:4,consts:[["size","medium"],[3,"close"],["label","LBL_SELECT_MODULE"],[1,"slds-form-element"],[1,"slds-form-element","slds-p-bottom--small-small","slds-p-vertical"],[1,"slds-form-element__label"],["title","required",1,"slds-required"],["label","LBL_PROSPECTLIST"],[1,"slds-form-element__control"],["type","text","required","required",1,"slds-input",3,"ngModel","ngModelChange"],[1,"slds-grid","slds-p-top--small","slds-form-element"],[1,"slds-form-element","slds-p-horizontal--small","slds-size_4-of-6"],["label","LBL_MODULE"],[1,"slds-form-element","slds-p-horizontal--small","slds-size_1-of-6"],["label","LBL_SELECT_GDPR_REJECTED"],["label","LBL_SELECT_INACTIVE"],[1,"slds-form-element","slds-p-horizontal"],["class","slds-grid slds-p-vertical--small",3,"ngClass",4,"ngFor","ngForOf"],[1,"slds-grid","slds-grid--vertical-align-center"],[1,"slds-col--bump-left","slds-button","slds-button--neutral",3,"click"],["label","LBL_CANCEL"],[1,"slds-col--bump-left","slds-button","slds-button--brand",3,"disabled","click"],["label","LBL_SAVE"],["label","LBL_SAVE_AND_GO_TO_RECORD"],[1,"slds-grid","slds-p-vertical--small",3,"ngClass"],[1,"slds-grid","slds-form-element","slds-p-horizontal--small","slds-size_4-of-6"],[3,"ngModel","disabled","ngModelChange"],["size","x-small",3,"module"],[1,"slds-p-right--small"],[3,"module"],[1,"slds-size--1-of-2","slds-form-element__control"]],template:function(e,s){1&e&&(u.j41(0,"system-modal",0)(1,"system-modal-header",1),u.bIt("close",(function(){return s.closeModal()})),u.nrm(2,"system-label",2),u.k0s(),u.j41(3,"system-modal-content")(4,"div",3)(5,"div",4)(6,"label",5)(7,"abbr",6),u.EFF(8,"* "),u.k0s(),u.nrm(9,"system-label",7),u.k0s(),u.j41(10,"div",8)(11,"input",9),u.mxI("ngModelChange",(function(e){return u.DH7(s.prospectListName,e)||(s.prospectListName=e),e})),u.k0s()()(),u.j41(12,"div",10)(13,"div",11)(14,"label",5),u.nrm(15,"system-label",12),u.k0s()(),u.j41(16,"div",13)(17,"label",5),u.nrm(18,"system-label",14),u.k0s()(),u.j41(19,"div",13)(20,"label",5),u.nrm(21,"system-label",15),u.k0s()()(),u.j41(22,"div",16),u.DNE(23,M,16,10,"div",17),u.k0s()()(),u.j41(24,"system-modal-footer")(25,"div",18)(26,"button",19),u.bIt("click",(function(){return s.closeModal()})),u.nrm(27,"system-label",20),u.k0s(),u.j41(28,"button",21),u.bIt("click",(function(){return s.add()})),u.nrm(29,"system-label",22),u.k0s(),u.j41(30,"button",21),u.bIt("click",(function(){return s.add(!0)})),u.nrm(31,"system-label",23),u.k0s()()()()),2&e&&(u.R7$(11),u.R50("ngModel",s.prospectListName),u.R7$(12),u.Y8G("ngForOf",s.beans),u.R7$(5),u.Y8G("disabled",!s.canAdd),u.R7$(2),u.Y8G("disabled",!s.canAdd))},dependencies:[l.YU,l.Sq,i.me,i.BC,i.YS,i.vS,_.f,L.J,v.W,y.r,k.D,E.I,R.Q,I.C],encapsulation:2})}return ProspectListsCreateTargetListFromModuleModal})();var j=t(83935);let x=(()=>{class ProspectListsCreateTargetListFromModuleButton{constructor(e,s,t,l,i,n,o){this.language=e,this.metadata=s,this.model=t,this.modal=l,this.backend=i,this.injector=n,this.toast=o,this.actionconfig={},this.beans=[],this.loading=!0,this.disabled=!0}ngOnInit(){this.model.module&&this.metadata.checkModuleAcl("ProspectLists","create")&&(this.disabled=!1)}execute(){const e=this.modal.await(this.language.getLabel("LBL_LOADING"));this.backend.getRequest("module/ProspectLists/getrelated/"+this.model.module+"/"+this.model.id,{modules:this.actionconfig.modules}).subscribe({next:s=>{e.emit(!0),this.beans=s,this.modal.openModal("ProspectListsCreateTargetListFromModuleModal",!0,this.injector).subscribe((e=>{e.instance.result=this.beans,e.instance.parentBeanId=this.model.id,e.instance.parentModule=this.model.module}))},error:()=>{e.emit(!0),this.toast.sendToast(this.language.getLabel("LBL_ERROR_LOADING_DATA"),"error")}})}static#e=this.ɵfac=function(e){return new(e||ProspectListsCreateTargetListFromModuleButton)(u.rXU(p.B),u.rXU(j.yu),u.rXU(c.g),u.rXU(f.y),u.rXU(b.H),u.rXU(u.zZn),u.rXU(h.o))};static#s=this.ɵcmp=u.VBU({type:ProspectListsCreateTargetListFromModuleButton,selectors:[["prospectlists-create-targetlist-from-module-button"]],decls:2,vars:0,consts:[["label","LBL_TARGETLIST_FROM_MODULE"]],template:function(e,s){1&e&&(u.j41(0,"span"),u.nrm(1,"system-label",0),u.k0s())},dependencies:[v.W],encapsulation:2})}return ProspectListsCreateTargetListFromModuleButton})();var F=t(21413),B=t(41731),C=t(15091),P=t(98427);const A=(e,s,t)=>({module:e,data:s,id:t}),$=()=>({fieldtype:"prospectListsPersonEmailAddress"});function T(e,s){if(1&e&&(u.j41(0,"tr",14)(1,"td")(2,"div",6),u.EFF(3),u.k0s()(),u.j41(4,"td")(5,"div",6),u.nrm(6,"field-container",15),u.k0s()()()),2&e){const e=s.$implicit,t=u.XpG();u.Y8G("system-model-provider",u.sMw(4,A,t.model.module,e,e.id)),u.R7$(3),u.JRh(e.summary_text),u.R7$(3),u.Y8G("field",t.emailAddressFieldName)("fieldconfig",u.lJ4(8,$))}}let D=(()=>{class ProspectListsSetTargetsEmailAddressModal{constructor(e,s){this.model=e,this.view=s,this.items=[],this.response=new F.B,this.view.isEditable=!0,this.view.displayLabels=!1,this.view.setEditMode()}close(){this.response.complete(),this.self.destroy()}confirm(){this.response.next(this.items),this.close()}ngOnDestroy(){this.response.complete()}static#e=this.ɵfac=function(e){return new(e||ProspectListsSetTargetsEmailAddressModal)(u.rXU(c.g),u.rXU(B.U))};static#s=this.ɵcmp=u.VBU({type:ProspectListsSetTargetsEmailAddressModal,selectors:[["prospect-lists-set-targets-email-address-modal"]],features:[u.Jv_([B.U])],decls:20,vars:1,consts:[["size","medium"],[3,"close"],["label","LBL_SELECT_EMAIL_PERSONS_EMAIL_ADDRESS"],[1,"slds-table","slds-table_bordered","slds-table--fixed-layout"],[1,"slds-line-height_reset"],["scope","col",1,""],[1,"slds-truncate"],["label","LBL_NAME"],["label","LBL_EMAIL_ADDRESS"],["class","slds-hint-parent",3,"system-model-provider",4,"ngFor","ngForOf"],[1,"slds-button","slds-button--neutral",3,"click"],["label","LBL_CANCEL"],[1,"slds-button","slds-button--brand",3,"click"],["label","LBL_CONFIRM"],[1,"slds-hint-parent",3,"system-model-provider"],[3,"field","fieldconfig"]],template:function(e,s){1&e&&(u.j41(0,"system-modal",0)(1,"system-modal-header",1),u.bIt("close",(function(){return s.close()})),u.nrm(2,"system-label",2),u.k0s(),u.j41(3,"system-modal-content")(4,"table",3)(5,"thead")(6,"tr",4)(7,"th",5)(8,"div",6),u.nrm(9,"system-label",7),u.k0s()(),u.j41(10,"th",5)(11,"div",6),u.nrm(12,"system-label",8),u.k0s()()()(),u.j41(13,"tbody"),u.DNE(14,T,7,9,"tr",9),u.k0s()()(),u.j41(15,"system-modal-footer")(16,"button",10),u.bIt("click",(function(){return s.close()})),u.nrm(17,"system-label",11),u.k0s(),u.j41(18,"button",12),u.bIt("click",(function(){return s.confirm()})),u.nrm(19,"system-label",13),u.k0s()()()),2&e&&(u.R7$(14),u.Y8G("ngForOf",s.items))},dependencies:[l.Sq,C.y,v.W,k.D,E.I,R.Q,I.C,P.v],encapsulation:2})}return ProspectListsSetTargetsEmailAddressModal})();var N=t(81332);let Y=(()=>{class ProspectListsActionSelectButton extends N.O{addSelectedItems(e){const s=e.filter((e=>1==Object.keys(e.email_addresses.beans).filter((s=>1!=e.email_addresses.beans[s].invalid_email)).length)),t=e.filter((e=>Object.keys(e.email_addresses.beans).filter((s=>1!=e.email_addresses.beans[s].invalid_email)).length>1));this.relatedmodels.addItems(e).subscribe((()=>{const e=this.actionconfig?.email_address_field_name??"prospectlists_person_email_addr_bean_rel_id";s.length>0&&(s.forEach((s=>{s[e]=Object.values(s.email_addresses.beans).find((e=>1!=e.invalid_email)).id})),this.relatedmodels.updateItems(s)),0!=t.length&&this.modal.openStaticModal(D,!0,this.model.injector).subscribe((s=>{s.instance.items=t,s.instance.emailAddressFieldName=e,s.instance.response.subscribe((e=>{this.relatedmodels.updateItems(e)}))}))}))}static#e=this.ɵfac=(()=>{let e;return function(s){return(e||(e=u.xGo(ProspectListsActionSelectButton)))(s||ProspectListsActionSelectButton)}})();static#s=this.ɵcmp=u.VBU({type:ProspectListsActionSelectButton,selectors:[["prospect-lists-action-select-button"]],features:[u.Jv_([c.g]),u.Vt3],decls:2,vars:0,consts:[["label","LBL_SELECT"]],template:function(e,s){1&e&&(u.j41(0,"span"),u.nrm(1,"system-label",0),u.k0s())},dependencies:[v.W],encapsulation:2})}return ProspectListsActionSelectButton})();var S=t(13921),O=t(766),U=t(66935),X=t(89166),V=t(11022),w=t(25863),z=t(18521),q=t(80256),J=t(22465);function H(e,s){if(1&e&&u.nrm(0,"field-label",3),2&e){const e=u.XpG();u.Y8G("fieldname",e.fieldname)("fieldconfig",e.fieldconfig)}}function W(e,s){if(1&e&&(u.j41(0,"span",7),u.EFF(1),u.k0s()),2&e){const e=u.XpG().$implicit;u.Y8G("title",e.value.email_address),u.R7$(),u.SpI(" ",e.value.email_address," ")}}function K(e,s){if(1&e&&(u.qex(0),u.DNE(1,W,2,2,"span",6),u.bVm()),2&e){const e=s.$implicit,t=u.XpG(2);u.R7$(),u.Y8G("ngIf",e.value.relid==t.value)}}function Q(e,s){if(1&e&&(u.j41(0,"field-generic-display",4),u.DNE(1,K,2,1,"ng-container",5),u.nI1(2,"keyvalue"),u.k0s()),2&e){const e=u.XpG();u.Y8G("fielddisplayclass",e.fielddisplayclass)("editable",e.isEditable())("fieldconfig",e.fieldconfig)("fieldid",e.fieldid),u.R7$(),u.Y8G("ngForOf",u.bMT(2,6,e.model.data.email_addresses.beans))("ngForTrackBy",e.trackByFn)}}function Z(e,s){if(1&e&&(u.qex(0),u.j41(1,"span",22),u.EFF(2),u.k0s(),u.bVm()),2&e){const e=u.XpG().$implicit;u.R7$(),u.Y8G("system-title",e.value.email_address),u.R7$(),u.SpI(" ",e.value.email_address," ")}}function ee(e,s){if(1&e&&(u.qex(0),u.DNE(1,Z,3,2,"ng-container",21),u.bVm()),2&e){const e=s.$implicit,t=u.XpG(2);u.R7$(),u.Y8G("ngIf",e.value.relid==t.value)}}function se(e,s){if(1&e){const e=u.RV6();u.j41(0,"button",23),u.bIt("click",(function(s){u.eBV(e);return u.XpG(2).value=void 0,u.Njj(s.stopImmediatePropagation())})),u.nrm(1,"system-button-icon",24),u.k0s()}}function te(e,s){1&e&&u.nrm(0,"system-utility-icon",31)}function le(e,s){if(1&e){const e=u.RV6();u.j41(0,"li",25),u.bIt("click",(function(){const s=u.eBV(e).$implicit,t=u.XpG(2);return u.Njj(t.value=s.value)})),u.j41(1,"div",26)(2,"span",27),u.DNE(3,te,1,0,"system-utility-icon",28),u.k0s(),u.j41(4,"span",29)(5,"span",22),u.EFF(6),u.k0s(),u.nrm(7,"field-email-emailaddress-status",30),u.k0s()()()}if(2&e){const e=s.$implicit,t=u.XpG(2);u.R7$(),u.AVh("slds-text-color--inverse-weak","1"==e.value.invalid_email),u.R7$(2),u.Y8G("ngIf",e.value.relid==t.value),u.R7$(2),u.xc7("text-decoration","1"==e.value.invalid_email?"line-through":"initial"),u.Y8G("system-title",e.value.email_address),u.R7$(),u.SpI(" ",e.value.email_address," "),u.R7$(),u.Y8G("status",e.value.opt_in_status)}}function ie(e,s){if(1&e&&(u.j41(0,"div",8)(1,"div",9)(2,"div",10)(3,"div",11)(4,"div",12),u.nI1(5,"keyvalue"),u.j41(6,"div",13)(7,"div",14),u.nI1(8,"keyvalue"),u.DNE(9,ee,2,1,"ng-container",5),u.nI1(10,"keyvalue"),u.DNE(11,se,2,0,"button",15),u.k0s(),u.nrm(12,"system-utility-icon",16),u.k0s(),u.j41(13,"div",17)(14,"ul",18),u.DNE(15,le,8,8,"li",19),u.nI1(16,"keyvalue"),u.k0s()()()()()(),u.nrm(17,"field-messages",20),u.k0s()),2&e){const e=u.XpG();u.Y8G("ngClass",e.css_classes),u.R7$(4),u.Y8G("system-dropdown-trigger",0==u.bMT(5,9,e.model.data.email_addresses.beans).length),u.R7$(3),u.AVh("slds-theme--shade",0==u.bMT(8,11,e.model.data.email_addresses.beans).length),u.R7$(2),u.Y8G("ngForOf",u.bMT(10,13,e.model.data.email_addresses.beans))("ngForTrackBy",e.trackByFn),u.R7$(2),u.Y8G("ngIf",!!e.value),u.R7$(4),u.Y8G("ngForOf",u.bMT(16,15,e.model.data.email_addresses.beans)),u.R7$(2),u.Y8G("fieldname",e.fieldname)}}let ne=(()=>{class ProspectListsPersonEmailAddressField extends S.s{set value(e){"1"!=e?.invalid_email&&this.model.setField(this.fieldname,e?.relid??"")}get value(){return this.model.getField(this.fieldname)}trackByFn(e){return e}static#e=this.ɵfac=(()=>{let e;return function(s){return(e||(e=u.xGo(ProspectListsPersonEmailAddressField)))(s||ProspectListsPersonEmailAddressField)}})();static#s=this.ɵcmp=u.VBU({type:ProspectListsPersonEmailAddressField,selectors:[["prospect-lists-person-email-address-field"]],features:[u.Vt3],decls:3,vars:3,consts:[[3,"fieldname","fieldconfig",4,"ngIf"],[3,"fielddisplayclass","editable","fieldconfig","fieldid",4,"ngIf"],["class","slds-form-element__control slds-m-vertical--xx-small",3,"ngClass",4,"ngIf"],[3,"fieldname","fieldconfig"],[3,"fielddisplayclass","editable","fieldconfig","fieldid"],[4,"ngFor","ngForOf","ngForTrackBy"],[3,"title",4,"ngIf"],[3,"title"],[1,"slds-form-element__control","slds-m-vertical--xx-small",3,"ngClass"],[1,"slds-form-element"],[1,"slds-form-element__control"],[1,"slds-combobox_container"],[1,"slds-combobox","slds-dropdown-trigger","slds-dropdown-trigger_click",3,"system-dropdown-trigger"],["role","none",1,"slds-combobox__form-element","slds-input-has-icon","slds-input-has-icon_right"],["role","combobox","tabindex","0","aria-expanded","false","aria-haspopup","listbox",1,"slds-input_faux","slds-combobox__input"],["class","slds-button slds-button--icon",3,"click",4,"ngIf"],["size","x-small","icon","down","addclasses","slds-input__icon slds-input__icon_right"],["role","listbox","tabindex","0","aria-busy","false",1,"slds-dropdown","slds-dropdown_length-10","slds-dropdown_fluid",2,"max-width","350px"],["role","presentation",1,"slds-listbox","slds-listbox_vertical"],["role","presentation","class","slds-listbox__item",3,"click",4,"ngFor","ngForOf"],[3,"fieldname"],[4,"ngIf"],[1,"slds-truncate","slds-grow",3,"system-title"],[1,"slds-button","slds-button--icon",3,"click"],["icon","clear"],["role","presentation",1,"slds-listbox__item",3,"click"],["role","option",1,"slds-media","slds-listbox__option","slds-listbox__option_plain","slds-media_small"],[1,"slds-media__figure","slds-listbox__option-icon"],["icon","check","size","x-small","colorclass","slds-icon-text-success",4,"ngIf"],[1,"slds-media__body","slds-grid"],[1,"slds-m-left--x-small",3,"status"],["icon","check","size","x-small","colorclass","slds-icon-text-success"]],template:function(e,s){1&e&&u.DNE(0,H,1,2,"field-label",0)(1,Q,3,8,"field-generic-display",1)(2,ie,18,17,"div",2),2&e&&(u.Y8G("ngIf",s.displayLabel),u.R7$(),u.Y8G("ngIf",!s.isEditMode()),u.R7$(),u.Y8G("ngIf",s.isEditable()&&s.isEditMode()))},dependencies:[l.YU,l.Sq,l.bT,O.b,U.K,X.A,V.N,w.t,z.B,q.q,J.L,l.lG],encapsulation:2})}return ProspectListsPersonEmailAddressField})();var oe=t(43308);function de(e,s){if(1&e&&u.nrm(0,"field-label",4),2&e){const e=u.XpG();u.Y8G("fieldname",e.fieldname)("fieldconfig",e.fieldconfig)}}function ae(e,s){if(1&e&&(u.j41(0,"div"),u.EFF(1),u.k0s()),2&e){const e=u.XpG();u.R7$(),u.JRh(e.value)}}function re(e,s){1&e&&u.nrm(0,"system-stencil")}let ce=(()=>{class ProspectListCountField extends S.s{constructor(){super(...arguments),this.isLoading=!1}ngOnInit(){super.ngOnInit(),this.isLoading=!0,this.model.backend.getRequest(`module/ProspectLists/${this.model.id}/count`).subscribe({next:e=>{this.value=e,this.isLoading=!1},error:()=>{this.isLoading=!1}})}static#e=this.ɵfac=(()=>{let e;return function(s){return(e||(e=u.xGo(ProspectListCountField)))(s||ProspectListCountField)}})();static#s=this.ɵcmp=u.VBU({type:ProspectListCountField,selectors:[["prospect-list-count-field"]],features:[u.Vt3],decls:5,vars:7,consts:[[3,"fieldname","fieldconfig",4,"ngIf"],[3,"fielddisplayclass","fieldconfig","title","fieldid"],[1,"slds-grid","slds-grid--vertical-align-center","slds-grid--align-spread"],[4,"ngIf"],[3,"fieldname","fieldconfig"]],template:function(e,s){1&e&&(u.DNE(0,de,1,2,"field-label",0),u.j41(1,"field-generic-display",1)(2,"div",2),u.DNE(3,ae,2,1,"div",3)(4,re,1,0,"system-stencil",3),u.k0s()()),2&e&&(u.Y8G("ngIf",s.displayLabel),u.R7$(),u.Y8G("fielddisplayclass",s.fielddisplayclass)("fieldconfig",s.fieldconfig)("title",s.value)("fieldid",s.fieldid),u.R7$(2),u.Y8G("ngIf",!s.isLoading),u.R7$(),u.Y8G("ngIf",s.isLoading))},dependencies:[l.bT,O.b,U.K,oe.O],encapsulation:2})}return ProspectListCountField})(),me=(()=>{class ModuleProspectLists{static#e=this.ɵfac=function(e){return new(e||ModuleProspectLists)};static#s=this.ɵmod=u.$C({type:ModuleProspectLists});static#t=this.ɵinj=u.G2t({imports:[l.MD,i.YN,o.ObjectFields,d.GlobalComponents,a.ObjectComponents,r.SystemComponents,n.h]})}return ModuleProspectLists})();("undefined"==typeof ngJitMode||ngJitMode)&&u.Obh(me,{declarations:[G,x,Y,D,ne,ce],imports:[l.MD,i.YN,o.ObjectFields,d.GlobalComponents,a.ObjectComponents,r.SystemComponents,n.h]})}}]);