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
"use strict";(self.webpackChunkcore=self.webpackChunkcore||[]).push([["src_include_spicefavorites_spicefavorites_ts"],{8009:(e,t,i)=>{i.r(t),i.d(t,{ModuleSpiceFavorites:()=>Y});var s=i(1180),o=i(4755),l=i(5030),d=i(4357),n=i(3190),a=i(4826),c=i(6490),r=i(3735),m=i(2242),u=i(4376),f=i(5329),p=i(3463),v=i(9621),g=i(3499),h=i(5767),Z=i(1916),_=i(5710),b=i(2294),F=i(4154),S=i(3634),y=i(5931),x=i(2656),J=i(4561),M=i(3333);function I(e,t){if(1&e&&(m.TgZ(0,"span"),m._uU(1),m.qZA()),2&e){const e=m.oxw();m.xp6(1),m.Oqu(e.model.data.summary_text)}}function k(e,t){if(1&e&&(m.TgZ(0,"li",8),m._UZ(1,"field-container",14),m.qZA()),2&e){const e=m.oxw().$implicit;m.xp6(1),m.Q6J("field",e.field)("fieldconfig",e.fieldconfig)}}function w(e,t){if(1&e&&(m.ynx(0),m.YNc(1,k,2,2,"li",13),m.BQk()),2&e){const e=t.$implicit,i=m.oxw();m.xp6(1),m.Q6J("ngIf",i.model.getField(e.field))}}let C=(()=>{var e;class SpiceFavoritesItem{constructor(e,t,i,o,l){(0,s.Z)(this,"model",void 0),(0,s.Z)(this,"language",void 0),(0,s.Z)(this,"metadata",void 0),(0,s.Z)(this,"view",void 0),(0,s.Z)(this,"favorite",void 0),(0,s.Z)(this,"item",{}),(0,s.Z)(this,"mainfieldset",void 0),(0,s.Z)(this,"subfieldsetfields",void 0),this.model=e,this.language=t,this.metadata=i,this.view=o,this.favorite=l,this.view.displayLabels=!1}ngOnInit(){this.initializeModel(),this.loadConfig()}initializeModel(){this.model.module=this.item.module_name,this.model.id=this.item.item_id,this.model.setData(this.item.data)}loadConfig(){let e=this.metadata.getComponentConfig("GlobalHeaderSearchResultsItem",this.model.module);this.mainfieldset=e.mainfieldset,e&&e.subfieldset&&(this.subfieldsetfields=this.metadata.getFieldSetItems(e.subfieldset))}deleteFavorite(){this.favorite.deleteFavorite(this.model.module,this.model.id)}}return e=SpiceFavoritesItem,(0,s.Z)(SpiceFavoritesItem,"ɵfac",(function(t){return new(t||e)(m.Y36(_.o),m.Y36(f.d),m.Y36(F.Pu),m.Y36(b.e),m.Y36(u.G))})),(0,s.Z)(SpiceFavoritesItem,"ɵcmp",m.Xpm({type:e,selectors:[["spice-favorites-item"]],inputs:{item:"item"},features:[m._Bn([_.o,b.e])],decls:13,vars:6,consts:[["role","option",1,"slds-lookup__item-action","slds-media","slds-media--center"],["size","small",3,"module"],[1,"slds-media__body"],[1,"slds-lookup__result-text"],[4,"ngIf"],[3,"fieldset"],[1,"slds-lookup__result-meta","slds-text-body--small"],[1,"slds-list_horizontal","slds-has-dividers_right","slds-truncate"],[1,"slds-item"],[3,"module","singular"],[4,"ngFor","ngForOf"],[1,"slds-button","slds-button--icon","slds-button--icon-border",3,"click"],["icon","delete"],["class","slds-item",4,"ngIf"],["fielddisplayclass","slds-truncate",3,"field","fieldconfig"]],template:function(e,t){1&e&&(m.TgZ(0,"div",0),m._UZ(1,"system-icon",1),m.TgZ(2,"div",2)(3,"div",3),m.YNc(4,I,2,1,"span",4),m._UZ(5,"object-record-fieldset-horizontal-list",5),m.qZA(),m.TgZ(6,"span",6)(7,"ul",7)(8,"li",8),m._UZ(9,"system-label-modulename",9),m.qZA(),m.YNc(10,w,2,1,"ng-container",10),m.qZA()()(),m.TgZ(11,"button",11),m.NdJ("click",(function(){return t.deleteFavorite()})),m._UZ(12,"system-button-icon",12),m.qZA()()),2&e&&(m.xp6(1),m.Q6J("module",t.model.module),m.xp6(3),m.Q6J("ngIf",!t.mainfieldset),m.xp6(1),m.Q6J("fieldset",t.mainfieldset),m.xp6(4),m.Q6J("module",t.model.module)("singular",!0),m.xp6(1),m.Q6J("ngForOf",t.subfieldsetfields))},dependencies:[o.sg,o.O5,S.j,y.Z,x.J,J.f,M.M],encapsulation:2})),SpiceFavoritesItem})();function O(e,t){if(1&e&&m._UZ(0,"spice-favorites-item",6),2&e){const e=t.$implicit;m.Q6J("item",e)}}let T=(()=>{var e;class SpiceFavoritesEditModal{constructor(e,t){(0,s.Z)(this,"favorite",void 0),(0,s.Z)(this,"language",void 0),(0,s.Z)(this,"self",void 0),this.favorite=e,this.language=t}close(){this.self.destroy()}}return e=SpiceFavoritesEditModal,(0,s.Z)(SpiceFavoritesEditModal,"ɵfac",(function(t){return new(t||e)(m.Y36(u.G),m.Y36(f.d))})),(0,s.Z)(SpiceFavoritesEditModal,"ɵcmp",m.Xpm({type:e,selectors:[["ng-component"]],decls:8,vars:2,consts:[[3,"close"],["label","LBL_EDIT_FAVORITES"],["margin","none",3,"grow"],["role","presentation","class","slds-listbox__item",3,"item",4,"ngFor","ngForOf"],[1,"slds-button","slds-button--neutral",3,"click"],["label","LBL_CLOSE"],["role","presentation",1,"slds-listbox__item",3,"item"]],template:function(e,t){1&e&&(m.TgZ(0,"system-modal")(1,"system-modal-header",0),m.NdJ("close",(function(){return t.close()})),m._UZ(2,"system-label",1),m.qZA(),m.TgZ(3,"system-modal-content",2),m.YNc(4,O,1,1,"spice-favorites-item",3),m.qZA(),m.TgZ(5,"system-modal-footer")(6,"button",4),m.NdJ("click",(function(){return t.close()})),m._UZ(7,"system-label",5),m.qZA()()()),2&e&&(m.xp6(3),m.Q6J("grow",!0),m.xp6(1),m.Q6J("ngForOf",t.favorite.favorites))},dependencies:[o.sg,p._,v.j,g.x,h.p,Z.y,C],encapsulation:2})),SpiceFavoritesEditModal})(),Y=(()=>{var e;class ModuleSpiceFavorites{}return e=ModuleSpiceFavorites,(0,s.Z)(ModuleSpiceFavorites,"ɵfac",(function(t){return new(t||e)})),(0,s.Z)(ModuleSpiceFavorites,"ɵmod",m.oAB({type:e})),(0,s.Z)(ModuleSpiceFavorites,"ɵinj",m.cJS({imports:[o.ez,l.u5,n.ObjectFields,a.GlobalComponents,c.ObjectComponents,r.SystemComponents,d.o]})),ModuleSpiceFavorites})();("undefined"==typeof ngJitMode||ngJitMode)&&m.kYT(Y,{declarations:[T,C],imports:[o.ez,l.u5,n.ObjectFields,a.GlobalComponents,c.ObjectComponents,r.SystemComponents,d.o]})}}]);