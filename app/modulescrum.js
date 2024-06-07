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
"use strict";(self.webpackChunkcore=self.webpackChunkcore||[]).push([["src_modules_scrum_modulescrum_ts"],{6516:(e,t,s)=>{s.r(t),s.d(t,{ModuleScrum:()=>z});var i=s(60177),r=s(18039),c=s(7745),o=s(12948),n=s(37328),d=s(70569),l=s(71341),a=s(54438),u=s(49722);let m=(()=>{class scrum{constructor(e){this.backend=e,this.selectedObject$=new a.bkB,this._selectedObject={id:void 0,type:""}}get selectedObject(){return this._selectedObject}set selectedObject(e){this._selectedObject=e,this.selectedObject$.emit(this._selectedObject)}onDrop(e,t,s){(0,r.HD)(e.container.data,e.previousIndex,e.currentIndex);const i=e.container.data.map(((e,t)=>({id:e.id,sequence:t})));this.backend.postRequest("module/"+t,{},i).subscribe((e=>{e&&e.length&&(s.items=s.items.map(((e,t)=>(e.sequence=t,e))))}))}static#e=this.ɵfac=function(e){return new(e||scrum)(a.KVO(u.H))};static#t=this.ɵprov=a.jDH({token:scrum,factory:scrum.ɵfac})}return scrum})();var h=s(35911),p=s(25863);let g=(()=>{class ScrumTreeAddItem{constructor(e,t){this.parent=e,this.model=t,this.title="",this.module="",this.newitem=new a.bkB}addItem(){this.model.id=void 0,this.model.module=this.module,this.model.addModel("",this.parent).subscribe((e=>{this.newitem.emit(e)}))}static#e=this.ɵfac=function(e){return new(e||ScrumTreeAddItem)(a.rXU(h.g,4),a.rXU(h.g))};static#t=this.ɵcmp=a.VBU({type:ScrumTreeAddItem,selectors:[["scrum-tree-additem"]],inputs:{title:"title",module:"module"},outputs:{newitem:"newitem"},features:[a.Jv_([h.g])],decls:2,vars:1,consts:[[1,"slds-button","slds-button-icon","slds-m-right_x-small",3,"title","click"],["icon","add"]],template:function(e,t){1&e&&(a.j41(0,"button",0),a.bIt("click",(function(){return t.addItem()})),a.nrm(1,"system-button-icon",1),a.k0s()),2&e&&a.Y8G("title",t.title)},dependencies:[p.t],encapsulation:2})}return ScrumTreeAddItem})();var f=s(91107),b=s(69904),y=s(75103),S=s(83935),D=s(48717);const k=["scrum-tree-userstory",""],_=e=>({"slds-is-selected":e});let U=(()=>{class ScrumTreeUserStory{constructor(e,t,s,i){this.metadata=e,this.model=t,this.modellist=s,this.scrum=i,this.userstory={}}ngOnInit(){this.model.module="ScrumUserStories",this.model.initialize(),this.model.id=this.userstory.id,this.model.setData(this.userstory)}selectUserStory(e){e.stopPropagation(),this.scrum.selectedObject={id:this.userstory.id,type:"ScrumUserStories"}}ngOnDestroy(){this.scrum.selectedObject.id==this.userstory.id&&"ScrumUserStories"==this.scrum.selectedObject.type&&(this.scrum.selectedObject={id:void 0,type:""})}static#e=this.ɵfac=function(e){return new(e||ScrumTreeUserStory)(a.rXU(S.yu),a.rXU(h.g),a.rXU(y.K),a.rXU(m))};static#t=this.ɵcmp=a.VBU({type:ScrumTreeUserStory,selectors:[["","scrum-tree-userstory",""]],hostBindings:function(e,t){1&e&&a.bIt("click",(function(e){return t.selectUserStory(e)}))},inputs:{userstory:"userstory"},features:[a.Jv_([h.g])],attrs:k,decls:4,vars:4,consts:[[1,"slds-tree__item",3,"ngClass"],[1,"slds-has-flexi-truncate","slds-p-left--medium"],[1,"slds-tree__item-label","slds-truncate"]],template:function(e,t){1&e&&(a.j41(0,"div",0)(1,"span",1)(2,"span",2),a.EFF(3),a.k0s()()()),2&e&&(a.Y8G("ngClass",a.eq3(2,_,t.userstory.id==t.scrum.selectedObject.id)),a.R7$(3),a.JRh(t.userstory.name))},dependencies:[i.YU],encapsulation:2})}return ScrumTreeUserStory})();const O=["scrum-tree-epic",""];function j(e,t){1&e&&a.nrm(0,"system-spinner",8)}function v(e,t){if(1&e&&a.nrm(0,"li",11),2&e){const e=t.$implicit;a.Y8G("userstory",e)}}function T(e,t){if(1&e){const e=a.RV6();a.j41(0,"ul",9),a.bIt("cdkDropListDropped",(function(t){a.eBV(e);const s=a.XpG();return a.Njj(s.scrum.onDrop(t,"ScrumUserStories",s.userstories))})),a.DNE(1,v,1,1,"li",10),a.k0s()}if(2&e){const e=a.XpG();a.Y8G("cdkDropListData",e.userstories.items),a.R7$(),a.Y8G("ngForOf",e.userstories.items)}}const L=e=>({"slds-is-selected":e}),G=e=>({"slds-hidden":e});let x=(()=>{class ScrumTreeEpic{constructor(e,t,s,i,r,c){this.language=e,this.metadata=t,this.model=s,this.modellist=i,this.scrum=r,this.userstories=c,this.userstoriesloaded=!1,this.expanded=!1,this.disabled=!0,this.epic={}}ngOnInit(){this.model.module="ScrumEpics",this.model.initialize(),this.model.id=this.epic.id,this.model.setData(this.epic),this.userstories.module=this.model.module,this.userstories.id=this.model.id,this.userstories.relatedModule="ScrumUserStories",this.model.module&&this.metadata.checkModuleAcl(this.model.module,"create")&&(this.disabled=!1),this.has_stories=this.model.getField("has_stories")}loadRelatedUserStories(){this.userstories.sort.sortfield="sequence",this.userstories.loaditems=-99,this.userstories.getData().subscribe((e=>{this.userstoriesloaded=!0}))}ngOnDestroy(){this.scrum.selectedObject.id==this.epic.id&&"ScrumEpics"==this.scrum.selectedObject.type&&(this.scrum.selectedObject={id:void 0,type:""})}toggleExpand(){this.userstoriesloaded||this.loadRelatedUserStories(),this.expanded=!this.expanded}selectEpic(e){e.stopPropagation(),this.scrum.selectedObject={id:this.epic.id,type:"ScrumEpics"}}loadChanges(e){this.has_stories=!0,this.loadRelatedUserStories()}get title(){return this.language.getLabel("LBL_ADD_USERSTORY")}static#e=this.ɵfac=function(e){return new(e||ScrumTreeEpic)(a.rXU(b.B),a.rXU(S.yu),a.rXU(h.g),a.rXU(y.K),a.rXU(m),a.rXU(f.K))};static#t=this.ɵcmp=a.VBU({type:ScrumTreeEpic,selectors:[["","scrum-tree-epic",""]],hostVars:1,hostBindings:function(e,t){1&e&&a.bIt("click",(function(e){return t.selectEpic(e)})),2&e&&a.BMQ("aria-expanded",t.expanded)},inputs:{epic:"epic"},features:[a.Jv_([h.g,f.K])],attrs:O,decls:9,vars:12,consts:[[1,"slds-tree__item",2,"align-items","center",3,"ngClass"],[1,"slds-button","slds-button-icon","slds-m-right_x-small",3,"disabled","ngClass","click"],[3,"icon"],[1,"slds-has-flexi-truncate"],[1,"slds-tree__item-label","slds-truncate"],["module","ScrumUserStories",3,"title","newitem"],["class","slds-p-around--xx-small",4,"ngIf"],["role","group","class","scrum-tree-epic-drop-list","cdkDropList","","cdkDropListLockAxis","y",3,"cdkDropListData","cdkDropListDropped",4,"ngIf"],[1,"slds-p-around--xx-small"],["role","group","cdkDropList","","cdkDropListLockAxis","y",1,"scrum-tree-epic-drop-list",3,"cdkDropListData","cdkDropListDropped"],["cdkDrag","","cdkDragBoundary",".scrum-tree-epic-drop-list","class","slds-drag--preview","style","list-style: none","scrum-tree-userstory","","aria-level","3","role","treeitem",3,"userstory",4,"ngFor","ngForOf"],["cdkDrag","","cdkDragBoundary",".scrum-tree-epic-drop-list","scrum-tree-userstory","","aria-level","3","role","treeitem",1,"slds-drag--preview",2,"list-style","none",3,"userstory"]],template:function(e,t){1&e&&(a.j41(0,"div",0)(1,"button",1),a.bIt("click",(function(){return t.toggleExpand()})),a.nrm(2,"system-button-icon",2),a.k0s(),a.j41(3,"span",3)(4,"span",4),a.EFF(5),a.k0s()(),a.j41(6,"scrum-tree-additem",5),a.bIt("newitem",(function(e){return t.loadChanges(e)})),a.k0s()(),a.DNE(7,j,1,0,"system-spinner",6)(8,T,2,2,"ul",7)),2&e&&(a.Y8G("ngClass",a.eq3(8,L,t.epic.id==t.scrum.selectedObject.id)),a.R7$(),a.Y8G("disabled",!t.has_stories)("ngClass",a.eq3(10,G,!t.has_stories)),a.R7$(),a.Y8G("icon",t.userstories.isloading?"spinner":"chevronright"),a.R7$(3),a.JRh(t.epic.name),a.R7$(),a.Y8G("title",t.title),a.R7$(),a.Y8G("ngIf",t.userstories.isloading&&t.has_stories),a.R7$(),a.Y8G("ngIf",t.userstories.items.length>0))},dependencies:[i.YU,i.Sq,i.bT,p.t,D.P,r.O7,r.T1,g,U],encapsulation:2})}return ScrumTreeEpic})();const E=["scrum-tree-theme",""];function I(e,t){1&e&&a.nrm(0,"system-spinner",8)}function X(e,t){if(1&e&&a.nrm(0,"li",11),2&e){const e=t.$implicit;a.Y8G("epic",e)}}function R(e,t){if(1&e){const e=a.RV6();a.j41(0,"ul",9),a.bIt("cdkDropListDropped",(function(t){a.eBV(e);const s=a.XpG();return a.Njj(s.scrum.onDrop(t,"ScrumEpics",s.epics))})),a.DNE(1,X,1,1,"li",10),a.k0s()}if(2&e){const e=a.XpG();a.Y8G("cdkDropListData",e.epics.items),a.R7$(),a.Y8G("ngForOf",e.epics.items)}}const C=e=>({"slds-is-selected":e}),Y=e=>({"slds-hidden":e});let B=(()=>{class ScrumTreeTheme{constructor(e,t,s,i,r,c,o){this.scrum=e,this.language=t,this.modellist=s,this.metadata=i,this.model=r,this.backend=c,this.epics=o,this.epicsloaded=!1,this.theme={},this.disabled=!0,this.expanded=!1}get title(){return this.language.getLabel("LBL_ADD_EPIC")}ngOnInit(){this.model.module="ScrumThemes",this.model.initialize(),this.model.id=this.theme.id,this.model.setData(this.theme),this.epics.module=this.model.module,this.epics.id=this.model.id,this.epics.relatedModule="ScrumEpics",this.model.module&&this.metadata.checkModuleAcl(this.model.module,"create")&&(this.disabled=!1),this.has_epics=this.model.getField("has_epics")}ngOnDestroy(){this.scrum.selectedObject.id==this.theme.id&&"ScrumThemes"==this.scrum.selectedObject.type&&(this.scrum.selectedObject={id:void 0,type:""})}selectTheme(){this.scrum.selectedObject={id:this.theme.id,type:"ScrumThemes"}}loadRelatedEpics(){this.epics.sort.sortfield="sequence",this.epics.loaditems=-99,this.epics.getData().subscribe((e=>{this.epicsloaded=!0}))}toggleExpand(){this.epicsloaded||this.loadRelatedEpics(),this.expanded=!this.expanded}loadChanges(e){this.has_epics=!0,this.loadRelatedEpics()}static#e=this.ɵfac=function(e){return new(e||ScrumTreeTheme)(a.rXU(m),a.rXU(b.B),a.rXU(y.K),a.rXU(S.yu),a.rXU(h.g),a.rXU(u.H),a.rXU(f.K))};static#t=this.ɵcmp=a.VBU({type:ScrumTreeTheme,selectors:[["","scrum-tree-theme",""]],hostVars:1,hostBindings:function(e,t){1&e&&a.bIt("click",(function(){return t.selectTheme()})),2&e&&a.BMQ("aria-expanded",t.expanded)},inputs:{theme:"theme"},features:[a.Jv_([h.g,f.K])],attrs:E,decls:9,vars:12,consts:[[1,"slds-tree__item",2,"align-items","center",3,"ngClass"],[1,"slds-button","slds-button-icon","slds-m-right_x-small",3,"disabled","ngClass","click"],[3,"icon"],[1,"slds-has-flexi-truncate"],[1,"slds-tree__item-label","slds-truncate"],["module","ScrumEpics",3,"title","newitem"],["class","slds-p-around--xx-small",4,"ngIf"],["role","group","class","scrum-tree-theme-drop-list","cdkDropList","","cdkDropListLockAxis","y",3,"cdkDropListData","cdkDropListDropped",4,"ngIf"],[1,"slds-p-around--xx-small"],["role","group","cdkDropList","","cdkDropListLockAxis","y",1,"scrum-tree-theme-drop-list",3,"cdkDropListData","cdkDropListDropped"],["cdkDrag","","cdkDragBoundary",".scrum-tree-theme-drop-list","scrum-tree-epic","","aria-level","2","role","treeitem","class","slds-drag--preview","style","list-style: none",3,"epic",4,"ngFor","ngForOf"],["cdkDrag","","cdkDragBoundary",".scrum-tree-theme-drop-list","scrum-tree-epic","","aria-level","2","role","treeitem",1,"slds-drag--preview",2,"list-style","none",3,"epic"]],template:function(e,t){1&e&&(a.j41(0,"div",0)(1,"button",1),a.bIt("click",(function(){return t.toggleExpand()})),a.nrm(2,"system-button-icon",2),a.k0s(),a.j41(3,"span",3)(4,"span",4),a.EFF(5),a.k0s()(),a.j41(6,"scrum-tree-additem",5),a.bIt("newitem",(function(e){return t.loadChanges(e)})),a.k0s()(),a.DNE(7,I,1,0,"system-spinner",6)(8,R,2,2,"ul",7)),2&e&&(a.Y8G("ngClass",a.eq3(8,C,t.theme.id==t.scrum.selectedObject.id)),a.R7$(),a.Y8G("disabled",!t.has_epics)("ngClass",a.eq3(10,Y,!t.has_epics)),a.R7$(),a.Y8G("icon",t.epics.isloading?"spinner":"chevronright"),a.R7$(3),a.JRh(t.theme.name),a.R7$(),a.Y8G("title",t.title),a.R7$(),a.Y8G("ngIf",t.epics.isloading&&t.has_epics),a.R7$(),a.Y8G("ngIf",t.epics.items.length>0))},dependencies:[i.YU,i.Sq,i.bT,p.t,D.P,r.O7,r.T1,g,x],encapsulation:2})}return ScrumTreeTheme})();var w=s(41731),$=s(50531),F=s(60595);let M=(()=>{class ScrumTreeDetail{constructor(e,t,s,i,r,c){this.scrum=e,this.metadata=t,this.model=s,this.view=i,this.modal=r,this.language=c,this.focusid="",this.focustype=""}ngOnChanges(){this.focusid&&this.focusid!=this.model.id?this.model.isDirty()?this.modal.confirm(this.language.getLabel("MSG_NAVIGATIONSTOP","","long"),this.language.getLabel("MSG_NAVIGATIONSTOP")).subscribe((e=>{e?(this.model.cancelEdit(),this.renderComponent(this.focusid)):this.scrum.selectedObject.id=this.model.id})):this.renderComponent(this.focusid):this.focusid||this.destroyContainer()}renderComponent(e){this.model.id=e,this.model.module=this.focustype,this.model.getData();let t=this.metadata.getComponentConfig("ScrumTreeDetail",this.model.module);this.componentset=t.componentset}destroyContainer(){this.componentset&&(this.componentset=null,this.model.reset())}get canEdit(){try{return this.model.checkAccess("edit")}catch(e){return!1}}static#e=this.ɵfac=function(e){return new(e||ScrumTreeDetail)(a.rXU(m),a.rXU(S.yu),a.rXU(h.g),a.rXU(w.U),a.rXU($.y),a.rXU(b.B))};static#t=this.ɵcmp=a.VBU({type:ScrumTreeDetail,selectors:[["scrum-tree-detail"]],inputs:{focusid:"focusid",focustype:"focustype"},features:[a.Jv_([h.g,w.U]),a.OA$],decls:1,vars:1,consts:[[3,"componentset"]],template:function(e,t){1&e&&a.nrm(0,"system-componentset",0),2&e&&a.Y8G("componentset",t.componentset)},dependencies:[F.F],encapsulation:2})}return ScrumTreeDetail})();var A=s(70923),V=s(28933),q=s(69139),J=s(32130);function N(e,t){if(1&e&&a.nrm(0,"li",3),2&e){const e=t.$implicit;a.Y8G("theme",e)}}let K=(()=>{class ScrumTree{constructor(e,t){this.scrum=e,this.modellist=t}trackbyfn(e,t){return t.id}static#e=this.ɵfac=function(e){return new(e||ScrumTree)(a.rXU(m),a.rXU(y.K))};static#t=this.ɵcmp=a.VBU({type:ScrumTree,selectors:[["scrum-tree"]],decls:3,vars:2,consts:[[1,"slds-tree_container"],["role","tree",1,"slds-tree"],["role","treeitem","aria-level","1","scrum-tree-theme","",3,"theme",4,"ngFor","ngForOf","ngForTrackBy"],["role","treeitem","aria-level","1","scrum-tree-theme","",3,"theme"]],template:function(e,t){1&e&&(a.j41(0,"div",0)(1,"ul",1),a.DNE(2,N,1,1,"li",2),a.k0s()()),2&e&&(a.R7$(2),a.Y8G("ngForOf",t.modellist.listData.list)("ngForTrackBy",t.trackbyfn))},dependencies:[i.Sq,B],encapsulation:2})}return ScrumTree})();function P(e,t){if(1&e&&(a.j41(0,"div",6)(1,"system-illustration-no-data"),a.EFF(2),a.k0s()()),2&e){const e=a.XpG();a.R7$(2),a.JRh(e.text)}}let H=(()=>{class ScrumMain{constructor(e,t,s){this.scrum=e,this.modellist=t,this.language=s,this.loadList()}loadList(){this.modellist.getListData()}get text(){return this.language.getLabel("LBL_SELECT_THEME")}static#e=this.ɵfac=function(e){return new(e||ScrumMain)(a.rXU(m),a.rXU(y.K),a.rXU(b.B))};static#t=this.ɵcmp=a.VBU({type:ScrumMain,selectors:[["scrum-main"]],features:[a.Jv_([m])],decls:6,vars:4,consts:[["system-to-bottom-noscroll","",1,"slds-grid",3,"system-overlay-loading-spinner"],["system-to-bottom","",1,"slds-border--right","slds-theme_shade",2,"min-width","250px"],["role","tree"],["system-to-bottom","",1,"slds-grow"],["class","slds-align_absolute-center","system-to-bottom-noscroll","",4,"ngIf"],[3,"focusid","focustype"],["system-to-bottom-noscroll","",1,"slds-align_absolute-center"]],template:function(e,t){1&e&&(a.j41(0,"div",0)(1,"div",1),a.nrm(2,"scrum-tree",2),a.k0s(),a.j41(3,"div",3),a.DNE(4,P,3,1,"div",4),a.nrm(5,"scrum-tree-detail",5),a.k0s()()),2&e&&(a.Y8G("system-overlay-loading-spinner",t.modellist.isLoading),a.R7$(4),a.Y8G("ngIf",!t.scrum.selectedObject.id&&!t.modellist.isLoading),a.R7$(),a.Y8G("focusid",t.scrum.selectedObject.id)("focustype",t.scrum.selectedObject.type))},dependencies:[i.bT,A.L,V.b,q.p,J.M,K,M],encapsulation:2})}return ScrumMain})(),z=(()=>{class ModuleScrum{static#e=this.ɵfac=function(e){return new(e||ModuleScrum)};static#t=this.ɵmod=a.$C({type:ModuleScrum});static#s=this.ɵinj=a.G2t({providers:[m],imports:[i.MD,c.ObjectFields,o.GlobalComponents,n.ObjectComponents,d.SystemComponents,l.h,r.ad]})}return ModuleScrum})();("undefined"==typeof ngJitMode||ngJitMode)&&a.Obh(z,{declarations:[H,K,g,B,x,U,M],imports:[i.MD,c.ObjectFields,o.GlobalComponents,n.ObjectComponents,d.SystemComponents,l.h,r.ad]})}}]);