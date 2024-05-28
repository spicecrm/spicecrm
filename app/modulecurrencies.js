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
"use strict";(self.webpackChunkcore=self.webpackChunkcore||[]).push([["src_modules_currencies_modulecurrencies_ts"],{17088:(e,s,t)=>{t.r(s),t.d(s,{ModuleCurrencies:()=>$});var n=t(60177),i=t(7745),r=t(12948),l=t(37328),o=t(70569),c=t(71341),a=t(84341),d=t(35911),u=t(41731),m=t(54438),h=t(83935),g=t(69904),b=t(49722),y=t(88421),p=t(50531),f=t(41081),v=t(32062);function R(e,s){if(1&e&&(m.j41(0,"tr",10)(1,"td"),m.EFF(2),m.k0s(),m.j41(3,"td"),m.EFF(4),m.k0s(),m.j41(5,"td"),m.EFF(6),m.k0s(),m.j41(7,"td"),m.EFF(8),m.k0s()()),2&e){const e=s.$implicit;m.R7$(2),m.JRh(e.name),m.R7$(2),m.JRh(e.iso),m.R7$(2),m.JRh(e.symbol),m.R7$(2),m.JRh(e.conversion_rate)}}let _=(()=>{class CurrencyList{constructor(e,s,t,n){this.metadata=e,this.language=s,this.backend=t,this.modal=n,this.currencies=[]}ngOnInit(){this.currencies.shift()}static#e=this.ɵfac=function(e){return new(e||CurrencyList)(m.rXU(h.yu),m.rXU(g.B),m.rXU(b.H),m.rXU(p.y))};static#s=this.ɵcmp=m.VBU({type:CurrencyList,selectors:[["currency-list"]],inputs:{currencies:"currencies"},decls:16,vars:1,consts:[[1,"slds-p-around--medium"],[1,"slds-text-title--caps"],["label","LBL_CURRENCIES"],[1,"slds-table","slds-table--bordered","slds-table--cell-buffer"],["scope","col"],["label","LBL_NAME"],["label","LBL_ISO"],["label","LBL_SYMBOL"],["label","LBL_CONVERSION_RATE"],["style","vertical-align: middle","class","slds-align-top",4,"ngFor","ngForOf"],[1,"slds-align-top",2,"vertical-align","middle"]],template:function(e,s){1&e&&(m.j41(0,"div",0)(1,"h2",1),m.nrm(2,"system-label",2),m.k0s()(),m.j41(3,"table",3)(4,"thead")(5,"tr",1)(6,"th",4),m.nrm(7,"system-label",5),m.k0s(),m.j41(8,"th",4),m.nrm(9,"system-label",6),m.k0s(),m.j41(10,"th",4),m.nrm(11,"system-label",7),m.k0s(),m.j41(12,"th",4),m.nrm(13,"system-label",8),m.k0s()()(),m.j41(14,"tbody"),m.DNE(15,R,9,4,"tr",9),m.k0s()()),2&e&&(m.R7$(15),m.Y8G("ngForOf",s.currencies))},dependencies:[n.Sq,v.W],encapsulation:2})}return CurrencyList})();var C=t(25863);function j(e,s){if(1&e){const e=m.RV6();m.j41(0,"div",5)(1,"div",6),m.nrm(2,"system-label",2),m.j41(3,"div",7)(4,"input",8),m.mxI("ngModelChange",(function(s){m.eBV(e);const t=m.XpG();return m.DH7(t.name,s)||(t.name=s),m.Njj(s)})),m.k0s()()(),m.j41(5,"div",6),m.nrm(6,"system-label",2),m.j41(7,"div",7)(8,"input",8),m.mxI("ngModelChange",(function(s){m.eBV(e);const t=m.XpG();return m.DH7(t.iso,s)||(t.iso=s),m.Njj(s)})),m.k0s()()(),m.j41(9,"div",6),m.nrm(10,"system-label",2),m.j41(11,"div",7)(12,"input",8),m.mxI("ngModelChange",(function(s){m.eBV(e);const t=m.XpG();return m.DH7(t.symbol,s)||(t.symbol=s),m.Njj(s)})),m.k0s()()(),m.j41(13,"div",6),m.nrm(14,"system-label",2),m.j41(15,"div",7)(16,"input",9),m.mxI("ngModelChange",(function(s){m.eBV(e);const t=m.XpG();return m.DH7(t.conversion_rate,s)||(t.conversion_rate=s),m.Njj(s)})),m.k0s()()(),m.j41(17,"button",10),m.bIt("click",(function(){m.eBV(e);const s=m.XpG();return m.Njj(s.addCurrencyItem())})),m.nrm(18,"system-button-icon",11),m.k0s()()}if(2&e){const e=m.XpG();m.R7$(2),m.Y8G("label","LBL_NAME"),m.R7$(2),m.R50("ngModel",e.name),m.R7$(2),m.Y8G("label","LBL_ISO"),m.R7$(2),m.R50("ngModel",e.iso),m.R7$(2),m.Y8G("label","LBL_SYMBOL"),m.R7$(2),m.R50("ngModel",e.symbol),m.R7$(2),m.Y8G("label","LBL_CONVERSION_RATE"),m.R7$(2),m.R50("ngModel",e.conversion_rate)}}let L=(()=>{class AddCurrencyItem{constructor(e,s,t,n){this.metadata=e,this.language=s,this.backend=t,this.toast=n,this.new=new m.bkB,this.conversion_rate=1,this.show=!1}toggleShow(){this.show=!this.show}addCurrencyItem(){let e={name:this.name,iso:this.iso,symbol:this.symbol,conversion_rate:this.conversion_rate};this.isMoreZero(this.conversion_rate)?this.backend.postRequest("module/Currencies/add",{},e).subscribe((e=>{e.status?this.new.emit(!0):this.toast.sendToast(this.language.getLabel("LBL_ERROR"),"error")})):this.toast.sendToast(this.language.getLabel("LBL_ERROR"),"error")}isMoreZero(e){return!!(0<e&&e)}static#e=this.ɵfac=function(e){return new(e||AddCurrencyItem)(m.rXU(h.yu),m.rXU(g.B),m.rXU(b.H),m.rXU(f.o))};static#s=this.ɵcmp=m.VBU({type:AddCurrencyItem,selectors:[["add-currency-item"]],outputs:{new:"new"},decls:5,vars:3,consts:[[1,"slds-p-around--medium"],[1,"slds-text-title--caps"],[3,"label"],[1,"slds-p-left--small",3,"icon","click"],["class","slds-grid slds-grid--align-spread slds-p-vertical--xx-small",4,"ngIf"],[1,"slds-grid","slds-grid--align-spread","slds-p-vertical--xx-small"],[1,"slds-form-element"],[1,"slds-form-element__control"],["type","text",1,"slds-input",3,"ngModel","ngModelChange"],["type","number",1,"slds-input",3,"ngModel","ngModelChange"],[1,"slds-button","slds-button-icon","slds-m-right_x-small",3,"click"],["icon","add"]],template:function(e,s){1&e&&(m.j41(0,"div",0)(1,"h2",1),m.nrm(2,"system-label",2),m.j41(3,"system-button-icon",3),m.bIt("click",(function(){return s.toggleShow()})),m.k0s()(),m.DNE(4,j,19,8,"div",4),m.k0s()),2&e&&(m.R7$(2),m.Y8G("label","LBL_ADD"),m.R7$(),m.Y8G("icon",s.show?"chevrondown":"chevronright"),m.R7$(),m.Y8G("ngIf",s.show))},dependencies:[n.bT,a.me,a.Q0,a.BC,a.vS,C.t,v.W],encapsulation:2})}return AddCurrencyItem})();var M=t(48717);function k(e,s){1&e&&m.nrm(0,"system-spinner")}function B(e,s){if(1&e){const e=m.RV6();m.j41(0,"div"),m.EFF(1),m.j41(2,"system-button-icon",6),m.bIt("click",(function(){m.eBV(e);const s=m.XpG(2);return m.Njj(s.edit())})),m.k0s()()}if(2&e){const e=m.XpG(2);m.R7$(),m.Lme(" ",e.defaultCurrency.name," (",e.defaultCurrency.symbol,") ")}}function G(e,s){if(1&e){const e=m.RV6();m.j41(0,"div",7)(1,"div",8),m.nrm(2,"system-label",9),m.j41(3,"div",10)(4,"input",11),m.mxI("ngModelChange",(function(s){m.eBV(e);const t=m.XpG(2);return m.DH7(t.name,s)||(t.name=s),m.Njj(s)})),m.k0s()()(),m.j41(5,"div",8),m.nrm(6,"system-label",9),m.j41(7,"div",10)(8,"input",11),m.mxI("ngModelChange",(function(s){m.eBV(e);const t=m.XpG(2);return m.DH7(t.iso,s)||(t.iso=s),m.Njj(s)})),m.k0s()()(),m.j41(9,"div",8),m.nrm(10,"system-label",9),m.j41(11,"div",10)(12,"input",11),m.mxI("ngModelChange",(function(s){m.eBV(e);const t=m.XpG(2);return m.DH7(t.symbol,s)||(t.symbol=s),m.Njj(s)})),m.k0s()()(),m.j41(13,"button",12),m.bIt("click",(function(){m.eBV(e);const s=m.XpG(2);return m.Njj(s.cancel())})),m.nrm(14,"system-button-icon",13),m.k0s(),m.j41(15,"button",12),m.bIt("click",(function(){m.eBV(e);const s=m.XpG(2);return m.Njj(s.savePreference())})),m.nrm(16,"system-button-icon",14),m.k0s()()}if(2&e){const e=m.XpG(2);m.R7$(2),m.Y8G("label","LBL_NAME"),m.R7$(2),m.R50("ngModel",e.name),m.R7$(2),m.Y8G("label","LBL_ISO"),m.R7$(2),m.R50("ngModel",e.iso),m.R7$(2),m.Y8G("label","LBL_SYMBOL"),m.R7$(2),m.R50("ngModel",e.symbol)}}function I(e,s){if(1&e&&(m.j41(0,"div",2)(1,"div")(2,"h2",3),m.nrm(3,"system-label",4),m.k0s()(),m.DNE(4,B,3,2,"div",0)(5,G,17,6,"div",5),m.k0s()),2&e){const e=m.XpG();m.R7$(4),m.Y8G("ngIf",!e.editMode&&e.defaultCurrency),m.R7$(),m.Y8G("ngIf",e.editMode)}}let X=(()=>{class SystemCurrency{constructor(e,s,t,n,i,r){this.metadata=e,this.language=s,this.backend=t,this.modal=n,this.view=i,this.toast=r,this.currencies=[],this.loading=!1,this.defaultCurrency={},this.iso="",this.name="",this.symbol="",this.conversion_rate=""}ngOnInit(){for(let e of this.currencies)-99==e.id&&(this.defaultCurrency=e);this.iso=this.defaultCurrency.iso,this.name=this.defaultCurrency.name,this.symbol=this.defaultCurrency.symbol,this.conversion_rate=this.defaultCurrency.conversion_rate}get editMode(){return this.view.isEditMode()}edit(){this.view.isEditable=!0,this.view.setEditMode()}cancel(){this.view.setViewMode()}savePreference(){let e={currencies:{default_currency_iso4217:this.iso,default_currency_name:this.name,default_currency_symbol:this.symbol,default_currency_conversion_rate:this.conversion_rate}};this.backend.postRequest("configuration/settings",{},e).subscribe((e=>{e.status?this.defaultCurrency={iso:this.iso,name:this.name,symbol:this.symbol,conversion_rate:this.conversion_rate}:this.toast.sendToast(this.language.getLabel("LBL_ERROR"),"error")})),this.view.setViewMode()}static#e=this.ɵfac=function(e){return new(e||SystemCurrency)(m.rXU(h.yu),m.rXU(g.B),m.rXU(b.H),m.rXU(p.y),m.rXU(u.U),m.rXU(f.o))};static#s=this.ɵcmp=m.VBU({type:SystemCurrency,selectors:[["system-currency"]],inputs:{currencies:"currencies"},decls:2,vars:2,consts:[[4,"ngIf"],["class","slds-p-around--medium",4,"ngIf"],[1,"slds-p-around--medium"],[1,"slds-text-title--caps"],["label","LBL_SYSTEM_CURRENCY"],["class","slds-grid slds-grid--align-spread slds-p-vertical--xx-small",4,"ngIf"],["icon","edit",1,"slds-p-left--small",3,"click"],[1,"slds-grid","slds-grid--align-spread","slds-p-vertical--xx-small"],[1,"slds-form-element"],[3,"label"],[1,"slds-form-element__control"],["type","text",1,"slds-input",3,"ngModel","ngModelChange"],[1,"slds-button","slds-button-icon","slds-m-right_x-small",3,"click"],["icon","close"],["icon","save"]],template:function(e,s){1&e&&m.DNE(0,k,1,0,"system-spinner",0)(1,I,6,2,"div",1),2&e&&(m.Y8G("ngIf",s.loading),m.R7$(),m.Y8G("ngIf",!s.loading))},dependencies:[n.bT,a.me,a.BC,a.vS,C.t,v.W,M.P],encapsulation:2})}return SystemCurrency})();function U(e,s){if(1&e){const e=m.RV6();m.j41(0,"div")(1,"div",1)(2,"div",2)(3,"h2",3),m.nrm(4,"system-label",4),m.k0s()()(),m.j41(5,"div",5),m.nrm(6,"system-currency",6),m.k0s(),m.j41(7,"add-currency-item",7),m.bIt("new",(function(s){m.eBV(e);const t=m.XpG();return m.Njj(t.reload(s))})),m.k0s(),m.nrm(8,"currency-list",6),m.k0s()}if(2&e){const e=m.XpG();m.R7$(4),m.Y8G("label","LBL_CURRENCY"),m.R7$(2),m.Y8G("currencies",e.currencies),m.R7$(2),m.Y8G("currencies",e.currencies)}}let w=(()=>{class CurrencyManager{constructor(e,s,t,n,i,r,l,o){this.metadata=e,this.language=s,this.backend=t,this.currency=n,this.model=i,this.modal=r,this.toast=l,this.view=o,this.currencies=[],this.loading=!0}ngOnInit(){this.modal.openModal("SystemLoadingModal").subscribe((e=>{this.backend.getRequest("module/Currencies").subscribe((s=>{if(s)for(let e of s)this.currencies.push({id:e.id,name:e.name,iso:e.iso4217,symbol:e.symbol,conversion_rate:e.conversion_rate});else this.toast.sendToast(this.language.getLabel("LBL_ERROR"),"error");this.loading=!1,e.instance.self.destroy()}))}))}reload(e){e&&this.modal.openModal("SystemLoadingModal").subscribe((e=>{this.backend.getRequest("module/Currencies").subscribe((s=>{s?(this.currencies=s,this.currencies.shift()):this.toast.sendToast(this.language.getLabel("LBL_ERROR"),"error"),this.loading=!1,e.instance.self.destroy()}))}))}static#e=this.ɵfac=function(e){return new(e||CurrencyManager)(m.rXU(h.yu),m.rXU(g.B),m.rXU(b.H),m.rXU(y.G),m.rXU(d.g),m.rXU(p.y),m.rXU(f.o),m.rXU(u.U))};static#s=this.ɵcmp=m.VBU({type:CurrencyManager,selectors:[["currency-manager"]],features:[m.Jv_([u.U,d.g])],decls:1,vars:1,consts:[[4,"ngIf"],[1,"slds-p-around--medium"],[1,"slds-grid","slds-grid--align-spread"],[1,"slds-text-heading--medium"],[3,"label"],[1,"slds-p-vertical--small"],[3,"currencies"],[3,"new"]],template:function(e,s){1&e&&m.DNE(0,U,9,3,"div",0),2&e&&m.Y8G("ngIf",!s.loading)},dependencies:[n.bT,v.W,_,L,X],encapsulation:2})}return CurrencyManager})(),$=(()=>{class ModuleCurrencies{static#e=this.ɵfac=function(e){return new(e||ModuleCurrencies)};static#s=this.ɵmod=m.$C({type:ModuleCurrencies});static#t=this.ɵinj=m.G2t({imports:[n.MD,a.YN,i.ObjectFields,r.GlobalComponents,l.ObjectComponents,o.SystemComponents,c.h]})}return ModuleCurrencies})();("undefined"==typeof ngJitMode||ngJitMode)&&m.Obh($,{declarations:[w,_,L,X],imports:[n.MD,a.YN,i.ObjectFields,r.GlobalComponents,l.ObjectComponents,o.SystemComponents,c.h]})}}]);