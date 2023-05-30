/*!
 * 
 *                     aacService
 *
 *                     release: 2023.01.001
 *
 *                     date: 2023-05-30 16:23:05
 *
 *                     build: 2023.01.001.1685456585396
 *
 */
"use strict";(self.webpackChunkcore=self.webpackChunkcore||[]).push([["src_include_spicenotes_spicenotes_ts"],{8467:(e,t,s)=>{s.r(t),s.d(t,{ModuleSpiceNotes:()=>z});var i=s(6895),o=s(433),n=s(4357),l=s(5886),c=s(3283),d=s(8363),a=s(1652),r=s(1571),u=s(5710),p=s(5329),g=s(5920),m=s(4505),h=s(3369),f=s(2656),b=s(8859),N=s(1481);function x(e,t){1&e&&(r.TgZ(0,"span",7),r._UZ(1,"system-utility-icon",8),r.qZA()),2&e&&(r.xp6(1),r.Q6J("icon","user")("size","x-small")("addclasses","slds-icon")("colorclass",""))}function _(e,t){if(1&e&&r._UZ(0,"img",9),2&e){const e=r.oxw();r.Q6J("src",e.note.user_image,r.LSH)}}function Z(e,t){1&e&&(r.ynx(0),r._uU(1," • "),r._UZ(2,"system-utility-icon",18),r.BQk()),2&e&&(r.xp6(2),r.Q6J("icon","lock")("size","xx-small"))}function v(e,t){if(1&e){const e=r.EpF();r.TgZ(0,"system-utility-icon",19),r.NdJ("click",(function(){r.CHM(e);const t=r.oxw(2);return r.KtG(t.edit())})),r.qZA()}}function y(e,t){if(1&e){const e=r.EpF();r.TgZ(0,"system-utility-icon",20),r.NdJ("click",(function(){r.CHM(e);const t=r.oxw(2);return r.KtG(t.delete())})),r.qZA()}}function J(e,t){if(1&e&&(r.TgZ(0,"div",10)(1,"div",11)(2,"p")(3,"a",12),r._uU(4),r.qZA(),r.YNc(5,Z,3,2,"ng-container",13),r.qZA(),r.YNc(6,v,1,0,"system-utility-icon",14),r.YNc(7,y,1,0,"system-utility-icon",15),r.qZA(),r.TgZ(8,"p",16)(9,"a",17),r._uU(10),r.qZA()()()),2&e){const e=r.oxw();r.xp6(4),r.Oqu(e.note.user_name),r.xp6(1),r.Q6J("ngIf",!e.note.global),r.xp6(1),r.Q6J("ngIf",!e.hideDeleteButton()),r.xp6(1),r.Q6J("ngIf",!e.hideDeleteButton()),r.xp6(3),r.Oqu(e.getNoteTimeFromNow())}}function S(e,t){if(1&e){const e=r.EpF();r.TgZ(0,"div",10)(1,"div",21)(2,"textarea",22),r.NdJ("ngModelChange",(function(t){r.CHM(e);const s=r.oxw();return r.KtG(s.note.text=t)})),r.qZA(),r.TgZ(3,"div",23)(4,"ul",24)(5,"li")(6,"button",25),r.NdJ("click",(function(){r.CHM(e);const t=r.oxw();return r.KtG(t.togglePrivate())})),r._UZ(7,"system-utility-icon",18),r.qZA()()(),r.TgZ(8,"ul",24)(9,"li")(10,"button",25),r.NdJ("click",(function(){r.CHM(e);const t=r.oxw();return r.KtG(t.saveNote())})),r._UZ(11,"system-button-icon",26),r.qZA()()()()()()}if(2&e){const e=r.oxw();r.xp6(2),r.Q6J("ngModel",e.note.text),r.xp6(5),r.Q6J("icon",e.getPrivateIcon())("size","xx-small")}}function k(e,t){if(1&e&&r._UZ(0,"div",27),2&e){const e=r.oxw();r.Q6J("innerHTML",e.htmlValue,r.oJD)}}let w=(()=>{class SpiceNote{constructor(e,t,s,i){this.sanitized=e,this.session=t,this.backend=s,this.model=i,this.note={},this.isEditing=!1,this.deleteNote=new r.vpe}getNoteTimeFromNow(){return moment(this.note.date).fromNow()}delete(){this.deleteNote.emit()}saveNote(){this.isEditing=!1,this.backend.postRequest(`module/${this.model.module}/${this.model.id}/note/${this.note.id}`,{},{text:this.note.text,global:!this.note.global})}edit(){this.isEditing=!0}get htmlValue(){return this.sanitized.bypassSecurityTrustHtml(this.note.text)}hideDeleteButton(){return this.note.user_id!=this.session.authData.userId&&!this.session.authData.admin}togglePrivate(){this.note.global=!this.note.global}getPrivateIcon(){return this.note.global?"unlock":"lock"}}return SpiceNote.ɵfac=function(e){return new(e||SpiceNote)(r.Y36(N.H7),r.Y36(g.n),r.Y36(m.y),r.Y36(u.o))},SpiceNote.ɵcmp=r.Xpm({type:SpiceNote,selectors:[["spice-note"]],inputs:{note:"note"},outputs:{deleteNote:"deleteNote"},decls:8,vars:5,consts:[[1,"slds-post","slds-border--bottom","slds-p-top--small"],[1,"slds-post__header","slds-media"],[1,"slds-media__figure"],["class","slds-icon_container slds-icon-standard-empty slds-icon_container--circle",4,"ngIf"],["style","height: 40px; width: 40px",3,"src",4,"ngIf"],["class","slds-media__body",4,"ngIf"],[3,"innerHTML",4,"ngIf"],[1,"slds-icon_container","slds-icon-standard-empty","slds-icon_container--circle"],[3,"icon","size","addclasses","colorclass"],[2,"height","40px","width","40px",3,"src"],[1,"slds-media__body"],[1,"slds-grid","slds-grid--align-spread","slds-has-flexi-truncate"],["href","javascript:void(0);"],[4,"ngIf"],["class","slds-col--bump-left slds-p-horizontal--x-small","icon","edit","size","xx-small",3,"click",4,"ngIf"],["icon","delete","size","xx-small",3,"click",4,"ngIf"],[1,"slds-text-body--small"],["href","javascript:void(0);",1,"slds-text-link--reset"],[3,"icon","size"],["icon","edit","size","xx-small",1,"slds-col--bump-left","slds-p-horizontal--x-small",3,"click"],["icon","delete","size","xx-small",3,"click"],[1,"slds-publisher","slds-publisher_comment","slds-is-active"],[1,"slds-publisher__input","slds-input_bare","slds-text-longform",2,"height","10rem",3,"ngModel","ngModelChange"],[1,"slds-publisher__actions","slds-grid","slds-grid_align-spread"],[1,"slds-grid"],[1,"slds-button","slds-button_icon","slds-button_icon-container",3,"click"],["sprite","utility","icon","check"],[3,"innerHTML"]],template:function(e,t){1&e&&(r.TgZ(0,"article",0)(1,"header",1)(2,"div",2),r.YNc(3,x,2,4,"span",3),r.YNc(4,_,1,1,"img",4),r.qZA(),r.YNc(5,J,11,5,"div",5),r.YNc(6,S,12,3,"div",5),r.qZA(),r.YNc(7,k,1,1,"div",6),r.qZA()),2&e&&(r.xp6(3),r.Q6J("ngIf",!t.note.user_image),r.xp6(1),r.Q6J("ngIf",t.note.user_image),r.xp6(1),r.Q6J("ngIf",!t.isEditing),r.xp6(1),r.Q6J("ngIf",t.isEditing),r.xp6(1),r.Q6J("ngIf",!t.isEditing))},dependencies:[i.O5,o.Fj,o.JJ,o.On,f.J,b.r],encapsulation:2}),SpiceNote})();function q(e,t){1&e&&(r.TgZ(0,"span",16),r._UZ(1,"system-utility-icon",17),r.qZA()),2&e&&(r.xp6(1),r.Q6J("icon","user")("size","x-small")("addclasses","slds-icon")("colorclass",""))}function M(e,t){if(1&e&&r._UZ(0,"img",18),2&e){const e=r.oxw();r.Q6J("src",e.userimage,r.LSH)}}function T(e,t){if(1&e){const e=r.EpF();r.TgZ(0,"spice-note",19),r.NdJ("deleteNote",(function(){const t=r.CHM(e).$implicit,s=r.oxw();return r.KtG(s.deleteNote(t.id))})),r.qZA()}if(2&e){const e=t.$implicit;r.Q6J("note",e)}}const A=function(e){return{"slds-is-active":e}};let I=(()=>{class SpiceNotes{constructor(e,t,s,i,o){this.model=e,this.language=t,this.session=s,this.backend=i,this.broadcast=o,this.newNote="",this._active=!1,this.isPrivate=!1,this.notes=[]}ngOnInit(){this.getNotes()}getNotes(){this.backend.getRequest(`module/${this.model.module}/${this.model.id}/note`).subscribe((e=>{for(let t of e)t.date=moment.utc(t.date),t.global="1"===t.global||!0===t.global,this.notes.push(t);this.broadcastCount()}))}addNote(){this.backend.postRequest(`module/${this.model.module}/${this.model.id}/note`,{},{text:this.newNote,global:!this.isPrivate}).subscribe((e=>{for(let t of e)t.date=moment.utc(t.date),t.global="1"===t.global||!0===t.global,this.notes.unshift(t),this.newNote="",this.broadcastCount()}))}deleteNote(e){this.backend.deleteRequest(`module/${this.model.module}/${this.model.id}/note/${e}`).subscribe((t=>{this.notes.some(((t,s)=>{if(t.id===e)return this.notes.splice(s,1),this.broadcastCount(),!0}))}))}broadcastCount(){this.broadcast.broadcastMessage("spicenotes.loaded",{module:this.model.module,id:this.model.id,spicenotescount:this.notes.length})}clearNote(){this.newNote="",this.isPrivate=!0}togglePrivate(){this.isPrivate=!this.isPrivate}getPrivateIcon(){return this.isPrivate?"lock":"unlock"}get userimage(){return this.session.authData.user.user_image}get isActive(){return this._active||""!==this.newNote}onFocus(){this._active=!0}onBlur(){this._active=!1}}return SpiceNotes.ɵfac=function(e){return new(e||SpiceNotes)(r.Y36(u.o),r.Y36(p.d),r.Y36(g.n),r.Y36(m.y),r.Y36(h.f))},SpiceNotes.ɵcmp=r.Xpm({type:SpiceNotes,selectors:[["ng-component"]],decls:22,vars:10,consts:[[1,"slds-feed__item-comments"],[1,"slds-media","slds-comment","slds-hint-parent"],[1,"slds-media__figure"],["class","slds-icon_container slds-icon-standard-empty slds-icon_container--circle",4,"ngIf"],["style","height: 40px; width: 40px",3,"src",4,"ngIf"],[1,"slds-media__body"],[1,"slds-publisher","slds-publisher_comment",3,"ngClass"],[1,"slds-publisher__input","slds-input_bare","slds-text-longform",3,"placeholder","ngModel","focus","blur","ngModelChange"],[1,"slds-publisher__actions","slds-grid","slds-grid_align-spread"],[1,"slds-grid"],[1,"slds-button","slds-button_icon","slds-button_icon-container",3,"click"],[3,"icon","size"],["sprite","utility","icon","clear"],["sprite","utility","icon","check"],[1,"slds-feed","slds-p-top--small"],[3,"note","deleteNote",4,"ngFor","ngForOf"],[1,"slds-icon_container","slds-icon-standard-empty","slds-icon_container--circle"],[3,"icon","size","addclasses","colorclass"],[2,"height","40px","width","40px",3,"src"],[3,"note","deleteNote"]],template:function(e,t){1&e&&(r.TgZ(0,"div",0)(1,"div",1)(2,"div",2),r.YNc(3,q,2,4,"span",3),r.YNc(4,M,1,1,"img",4),r.qZA(),r.TgZ(5,"div",5)(6,"div",6)(7,"textarea",7),r.NdJ("focus",(function(){return t.onFocus()}))("blur",(function(){return t.onBlur()}))("ngModelChange",(function(e){return t.newNote=e})),r.qZA(),r.TgZ(8,"div",8)(9,"ul",9)(10,"li")(11,"button",10),r.NdJ("click",(function(){return t.togglePrivate()})),r._UZ(12,"system-utility-icon",11),r.qZA()()(),r.TgZ(13,"ul",9)(14,"li")(15,"button",10),r.NdJ("click",(function(){return t.clearNote()})),r._UZ(16,"system-button-icon",12),r.qZA()(),r.TgZ(17,"li")(18,"button",10),r.NdJ("click",(function(){return t.addNote()})),r._UZ(19,"system-button-icon",13),r.qZA()()()()()()()(),r.TgZ(20,"div",14),r.YNc(21,T,1,1,"spice-note",15),r.qZA()),2&e&&(r.xp6(3),r.Q6J("ngIf",!t.userimage),r.xp6(1),r.Q6J("ngIf",t.userimage),r.xp6(2),r.Q6J("ngClass",r.VKq(8,A,t.isActive)),r.xp6(1),r.Q6J("placeholder",t.language.getLabel("LBL_CREATENOTE"))("ngModel",t.newNote),r.xp6(5),r.Q6J("icon",t.getPrivateIcon())("size","xx-small"),r.xp6(9),r.Q6J("ngForOf",t.notes))},dependencies:[i.mk,i.sg,i.O5,o.Fj,o.JJ,o.On,f.J,b.r,w],encapsulation:2}),SpiceNotes})();var C=s(3463);function Q(e,t){if(1&e&&(r.TgZ(0,"span",3),r._uU(1),r.qZA()),2&e){const e=r.oxw();r.xp6(1),r.Oqu(e.notecount)}}let Y=(()=>{class SpiceNotesPanelHeader{constructor(e,t,s){this.model=e,this.language=t,this.broadcast=s,this.broadcastSubscription={},this.notecount=0,this.broadcastSubscription=this.broadcast.message$.subscribe((e=>{this.handleMessage(e)}))}get hasNotes(){return this.notecount>0}handleMessage(e){if((e.messagedata.module===this.model.module||e.messagedata.id===this.model.id)&&"spicenotes.loaded"===e.messagetype)this.notecount=e.messagedata.spicenotescount}ngOnDestroy(){this.broadcastSubscription.unsubscribe()}}return SpiceNotesPanelHeader.ɵfac=function(e){return new(e||SpiceNotesPanelHeader)(r.Y36(u.o),r.Y36(p.d),r.Y36(h.f))},SpiceNotesPanelHeader.ɵcmp=r.Xpm({type:SpiceNotesPanelHeader,selectors:[["ng-component"]],decls:4,vars:1,consts:[[1,"slds-grid","slds-grid--vertical-align-center"],["label","LBL_QUICKNOTES"],["class","slds-badge slds-theme_info slds-m-horizontal--xx-small",4,"ngIf"],[1,"slds-badge","slds-theme_info","slds-m-horizontal--xx-small"]],template:function(e,t){1&e&&(r.TgZ(0,"div",0)(1,"span"),r._UZ(2,"system-label",1),r.qZA(),r.YNc(3,Q,2,1,"span",2),r.qZA()),2&e&&(r.xp6(3),r.Q6J("ngIf",t.hasNotes))},dependencies:[i.O5,C._],encapsulation:2}),SpiceNotesPanelHeader})(),z=(()=>{class ModuleSpiceNotes{}return ModuleSpiceNotes.ɵfac=function(e){return new(e||ModuleSpiceNotes)},ModuleSpiceNotes.ɵmod=r.oAB({type:ModuleSpiceNotes}),ModuleSpiceNotes.ɵinj=r.cJS({imports:[i.ez,o.u5,l.ObjectFields,c.GlobalComponents,d.ObjectComponents,a.SystemComponents,n.o]}),ModuleSpiceNotes})();("undefined"==typeof ngJitMode||ngJitMode)&&r.kYT(z,{declarations:[I,w,Y],imports:[i.ez,o.u5,l.ObjectFields,c.GlobalComponents,d.ObjectComponents,a.SystemComponents,n.o]})}}]);