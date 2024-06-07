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
"use strict";(self.webpackChunkcore=self.webpackChunkcore||[]).push([["src_include_spicenotes_spicenotes_ts"],{78585:(t,e,s)=>{s.r(e),s.d(e,{ModuleSpiceNotes:()=>E});var i=s(60177),n=s(84341),o=s(71341),l=s(7745),c=s(12948),d=s(37328),a=s(70569),r=s(54438),u=s(35911),m=s(69904),h=s(29994),g=s(49722),p=s(40553),b=s(25863),f=s(18521),N=s(345);function _(t,e){1&t&&(r.j41(0,"span",7),r.nrm(1,"system-utility-icon",8),r.k0s()),2&t&&(r.R7$(),r.Y8G("icon","user")("size","x-small")("addclasses","slds-icon")("colorclass",""))}function k(t,e){if(1&t&&r.nrm(0,"img",9),2&t){const t=r.XpG();r.Y8G("src",t.note.user_image,r.B4B)}}function v(t,e){1&t&&(r.qex(0),r.EFF(1," • "),r.nrm(2,"system-utility-icon",18),r.bVm()),2&t&&(r.R7$(2),r.Y8G("icon","lock")("size","xx-small"))}function x(t,e){if(1&t){const t=r.RV6();r.j41(0,"system-utility-icon",19),r.bIt("click",(function(){r.eBV(t);const e=r.XpG(2);return r.Njj(e.edit())})),r.k0s()}}function y(t,e){if(1&t){const t=r.RV6();r.j41(0,"system-utility-icon",20),r.bIt("click",(function(){r.eBV(t);const e=r.XpG(2);return r.Njj(e.delete())})),r.k0s()}}function I(t,e){if(1&t&&(r.j41(0,"div",10)(1,"div",11)(2,"p")(3,"a",12),r.EFF(4),r.k0s(),r.DNE(5,v,3,2,"ng-container",13),r.k0s(),r.DNE(6,x,1,0,"system-utility-icon",14)(7,y,1,0,"system-utility-icon",15),r.k0s(),r.j41(8,"p",16)(9,"a",17),r.EFF(10),r.k0s()()()),2&t){const t=r.XpG();r.R7$(4),r.JRh(t.note.user_name),r.R7$(),r.Y8G("ngIf",!t.note.global),r.R7$(),r.Y8G("ngIf",!t.hideDeleteButton()),r.R7$(),r.Y8G("ngIf",!t.hideDeleteButton()),r.R7$(3),r.JRh(t.getNoteTimeFromNow())}}function j(t,e){if(1&t){const t=r.RV6();r.j41(0,"div",10)(1,"div",21)(2,"textarea",22),r.mxI("ngModelChange",(function(e){r.eBV(t);const s=r.XpG();return r.DH7(s.note.text,e)||(s.note.text=e),r.Njj(e)})),r.k0s(),r.j41(3,"div",23)(4,"ul",24)(5,"li")(6,"button",25),r.bIt("click",(function(){r.eBV(t);const e=r.XpG();return r.Njj(e.togglePrivate())})),r.nrm(7,"system-utility-icon",18),r.k0s()()(),r.j41(8,"ul",24)(9,"li")(10,"button",25),r.bIt("click",(function(){r.eBV(t);const e=r.XpG();return r.Njj(e.saveNote())})),r.nrm(11,"system-button-icon",26),r.k0s()()()()()()}if(2&t){const t=r.XpG();r.R7$(2),r.R50("ngModel",t.note.text),r.R7$(5),r.Y8G("icon",t.getPrivateIcon())("size","xx-small")}}function G(t,e){if(1&t&&r.nrm(0,"div",27),2&t){const t=r.XpG();r.Y8G("innerHTML",t.htmlValue,r.npT)}}let R=(()=>{class SpiceNote{constructor(t,e,s,i){this.sanitized=t,this.session=e,this.backend=s,this.model=i,this.note={},this.isEditing=!1,this.deleteNote=new r.bkB}getNoteTimeFromNow(){return moment(this.note.date).fromNow()}delete(){this.deleteNote.emit()}saveNote(){this.isEditing=!1,this.backend.postRequest(`module/${this.model.module}/${this.model.id}/note/${this.note.id}`,{},{text:this.note.text,global:!this.note.global})}edit(){this.isEditing=!0}get htmlValue(){return this.sanitized.bypassSecurityTrustHtml(this.note.text)}hideDeleteButton(){return this.note.user_id!=this.session.authData.userId&&!this.session.authData.admin}togglePrivate(){this.note.global=!this.note.global}getPrivateIcon(){return this.note.global?"unlock":"lock"}static#t=this.ɵfac=function(t){return new(t||SpiceNote)(r.rXU(N.up),r.rXU(h.d),r.rXU(g.H),r.rXU(u.g))};static#e=this.ɵcmp=r.VBU({type:SpiceNote,selectors:[["spice-note"]],inputs:{note:"note"},outputs:{deleteNote:"deleteNote"},decls:8,vars:5,consts:[[1,"slds-post","slds-border--bottom","slds-p-top--small"],[1,"slds-post__header","slds-media"],[1,"slds-media__figure"],["class","slds-icon_container slds-icon-standard-empty slds-icon_container--circle",4,"ngIf"],["style","height: 40px; width: 40px",3,"src",4,"ngIf"],["class","slds-media__body",4,"ngIf"],[3,"innerHTML",4,"ngIf"],[1,"slds-icon_container","slds-icon-standard-empty","slds-icon_container--circle"],[3,"icon","size","addclasses","colorclass"],[2,"height","40px","width","40px",3,"src"],[1,"slds-media__body"],[1,"slds-grid","slds-grid--align-spread","slds-has-flexi-truncate"],["href","javascript:void(0);"],[4,"ngIf"],["class","slds-col--bump-left slds-p-horizontal--x-small","icon","edit","size","xx-small",3,"click",4,"ngIf"],["icon","delete","size","xx-small",3,"click",4,"ngIf"],[1,"slds-text-body--small"],["href","javascript:void(0);",1,"slds-text-link--reset"],[3,"icon","size"],["icon","edit","size","xx-small",1,"slds-col--bump-left","slds-p-horizontal--x-small",3,"click"],["icon","delete","size","xx-small",3,"click"],[1,"slds-publisher","slds-publisher_comment","slds-is-active"],[1,"slds-publisher__input","slds-input_bare","slds-text-longform",2,"height","10rem",3,"ngModel","ngModelChange"],[1,"slds-publisher__actions","slds-grid","slds-grid_align-spread"],[1,"slds-grid"],[1,"slds-button","slds-button_icon","slds-button_icon-container",3,"click"],["sprite","utility","icon","check"],[3,"innerHTML"]],template:function(t,e){1&t&&(r.j41(0,"article",0)(1,"header",1)(2,"div",2),r.DNE(3,_,2,4,"span",3)(4,k,1,1,"img",4),r.k0s(),r.DNE(5,I,11,5,"div",5)(6,j,12,3,"div",5),r.k0s(),r.DNE(7,G,1,1,"div",6),r.k0s()),2&t&&(r.R7$(3),r.Y8G("ngIf",!e.note.user_image),r.R7$(),r.Y8G("ngIf",e.note.user_image),r.R7$(),r.Y8G("ngIf",!e.isEditing),r.R7$(),r.Y8G("ngIf",e.isEditing),r.R7$(),r.Y8G("ngIf",!e.isEditing))},dependencies:[i.bT,n.me,n.BC,n.vS,b.t,f.B],encapsulation:2})}return SpiceNote})();function $(t,e){1&t&&(r.j41(0,"span",16),r.nrm(1,"system-utility-icon",17),r.k0s()),2&t&&(r.R7$(),r.Y8G("icon","user")("size","x-small")("addclasses","slds-icon")("colorclass",""))}function B(t,e){if(1&t&&r.nrm(0,"img",18),2&t){const t=r.XpG();r.Y8G("src",t.userimage,r.B4B)}}function S(t,e){if(1&t){const t=r.RV6();r.j41(0,"spice-note",19),r.bIt("deleteNote",(function(){const e=r.eBV(t).$implicit,s=r.XpG();return r.Njj(s.deleteNote(e.id))})),r.k0s()}if(2&t){const t=e.$implicit;r.Y8G("note",t)}}const Y=t=>({"slds-is-active":t});let X=(()=>{class SpiceNotes{constructor(t,e,s,i,n){this.model=t,this.language=e,this.session=s,this.backend=i,this.broadcast=n,this.newNote="",this._active=!1,this.isPrivate=!1,this.notes=[]}ngOnInit(){this.getNotes()}getNotes(){this.backend.getRequest(`module/${this.model.module}/${this.model.id}/note`).subscribe((t=>{for(let e of t)e.date=moment.utc(e.date),e.global="1"===e.global||!0===e.global,this.notes.push(e);this.broadcastCount()}))}addNote(){this.backend.postRequest(`module/${this.model.module}/${this.model.id}/note`,{},{text:this.newNote,global:!this.isPrivate}).subscribe((t=>{for(let e of t)e.date=moment.utc(e.date),e.global="1"===e.global||!0===e.global,this.notes.unshift(e),this.newNote="",this.broadcastCount()}))}deleteNote(t){this.backend.deleteRequest(`module/${this.model.module}/${this.model.id}/note/${t}`).subscribe((e=>{this.notes.some(((e,s)=>{if(e.id===t)return this.notes.splice(s,1),this.broadcastCount(),!0}))}))}broadcastCount(){this.broadcast.broadcastMessage("spicenotes.loaded",{module:this.model.module,id:this.model.id,spicenotescount:this.notes.length})}clearNote(){this.newNote="",this.isPrivate=!0}togglePrivate(){this.isPrivate=!this.isPrivate}getPrivateIcon(){return this.isPrivate?"lock":"unlock"}get userimage(){return this.session.authData.user.user_image}get isActive(){return this._active||""!==this.newNote}onFocus(){this._active=!0}onBlur(){this._active=!1}static#t=this.ɵfac=function(t){return new(t||SpiceNotes)(r.rXU(u.g),r.rXU(m.B),r.rXU(h.d),r.rXU(g.H),r.rXU(p.m))};static#e=this.ɵcmp=r.VBU({type:SpiceNotes,selectors:[["ng-component"]],decls:22,vars:10,consts:[[1,"slds-feed__item-comments"],[1,"slds-media","slds-comment","slds-hint-parent"],[1,"slds-media__figure"],["class","slds-icon_container slds-icon-standard-empty slds-icon_container--circle",4,"ngIf"],["style","height: 40px; width: 40px",3,"src",4,"ngIf"],[1,"slds-media__body"],[1,"slds-publisher","slds-publisher_comment",3,"ngClass"],[1,"slds-publisher__input","slds-input_bare","slds-text-longform",3,"placeholder","ngModel","focus","blur","ngModelChange"],[1,"slds-publisher__actions","slds-grid","slds-grid_align-spread"],[1,"slds-grid"],[1,"slds-button","slds-button_icon","slds-button_icon-container",3,"click"],[3,"icon","size"],["sprite","utility","icon","clear"],["sprite","utility","icon","check"],[1,"slds-feed","slds-p-top--small"],[3,"note","deleteNote",4,"ngFor","ngForOf"],[1,"slds-icon_container","slds-icon-standard-empty","slds-icon_container--circle"],[3,"icon","size","addclasses","colorclass"],[2,"height","40px","width","40px",3,"src"],[3,"note","deleteNote"]],template:function(t,e){1&t&&(r.j41(0,"div",0)(1,"div",1)(2,"div",2),r.DNE(3,$,2,4,"span",3)(4,B,1,1,"img",4),r.k0s(),r.j41(5,"div",5)(6,"div",6)(7,"textarea",7),r.bIt("focus",(function(){return e.onFocus()}))("blur",(function(){return e.onBlur()})),r.mxI("ngModelChange",(function(t){return r.DH7(e.newNote,t)||(e.newNote=t),t})),r.k0s(),r.j41(8,"div",8)(9,"ul",9)(10,"li")(11,"button",10),r.bIt("click",(function(){return e.togglePrivate()})),r.nrm(12,"system-utility-icon",11),r.k0s()()(),r.j41(13,"ul",9)(14,"li")(15,"button",10),r.bIt("click",(function(){return e.clearNote()})),r.nrm(16,"system-button-icon",12),r.k0s()(),r.j41(17,"li")(18,"button",10),r.bIt("click",(function(){return e.addNote()})),r.nrm(19,"system-button-icon",13),r.k0s()()()()()()()(),r.j41(20,"div",14),r.DNE(21,S,1,1,"spice-note",15),r.k0s()),2&t&&(r.R7$(3),r.Y8G("ngIf",!e.userimage),r.R7$(),r.Y8G("ngIf",e.userimage),r.R7$(2),r.Y8G("ngClass",r.eq3(8,Y,e.isActive)),r.R7$(),r.Y8G("placeholder",e.language.getLabel("LBL_CREATENOTE")),r.R50("ngModel",e.newNote),r.R7$(5),r.Y8G("icon",e.getPrivateIcon())("size","xx-small"),r.R7$(9),r.Y8G("ngForOf",e.notes))},dependencies:[i.YU,i.Sq,i.bT,n.me,n.BC,n.vS,b.t,f.B,R],encapsulation:2})}return SpiceNotes})();var C=s(32062);function M(t,e){if(1&t&&(r.j41(0,"span",3),r.EFF(1),r.k0s()),2&t){const t=r.XpG();r.R7$(),r.JRh(t.notecount)}}let w=(()=>{class SpiceNotesPanelHeader{constructor(t,e,s){this.model=t,this.language=e,this.broadcast=s,this.broadcastSubscription={},this.notecount=0,this.broadcastSubscription=this.broadcast.message$.subscribe((t=>{this.handleMessage(t)}))}get hasNotes(){return this.notecount>0}handleMessage(t){if((t.messagedata.module===this.model.module||t.messagedata.id===this.model.id)&&"spicenotes.loaded"===t.messagetype)this.notecount=t.messagedata.spicenotescount}ngOnDestroy(){this.broadcastSubscription.unsubscribe()}static#t=this.ɵfac=function(t){return new(t||SpiceNotesPanelHeader)(r.rXU(u.g),r.rXU(m.B),r.rXU(p.m))};static#e=this.ɵcmp=r.VBU({type:SpiceNotesPanelHeader,selectors:[["ng-component"]],decls:4,vars:1,consts:[[1,"slds-grid","slds-grid--vertical-align-center"],["label","LBL_QUICKNOTES"],["class","slds-badge slds-theme_info slds-m-horizontal--xx-small",4,"ngIf"],[1,"slds-badge","slds-theme_info","slds-m-horizontal--xx-small"]],template:function(t,e){1&t&&(r.j41(0,"div",0)(1,"span"),r.nrm(2,"system-label",1),r.k0s(),r.DNE(3,M,2,1,"span",2),r.k0s()),2&t&&(r.R7$(3),r.Y8G("ngIf",e.hasNotes))},dependencies:[i.bT,C.W],encapsulation:2})}return SpiceNotesPanelHeader})(),E=(()=>{class ModuleSpiceNotes{static#t=this.ɵfac=function(t){return new(t||ModuleSpiceNotes)};static#e=this.ɵmod=r.$C({type:ModuleSpiceNotes});static#s=this.ɵinj=r.G2t({imports:[i.MD,n.YN,l.ObjectFields,c.GlobalComponents,d.ObjectComponents,a.SystemComponents,o.h]})}return ModuleSpiceNotes})();("undefined"==typeof ngJitMode||ngJitMode)&&r.Obh(E,{declarations:[X,R,w],imports:[i.MD,n.YN,l.ObjectFields,c.GlobalComponents,d.ObjectComponents,a.SystemComponents,o.h]})}}]);