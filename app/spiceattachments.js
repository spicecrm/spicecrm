/*!
 * 
 *                     aacService
 *
 *                     release: 2023.01.001
 *
 *                     date: 2023-05-08 11:03:49
 *
 *                     build: 2023.01.001.1683536629965
 *
 */
"use strict";(self.webpackChunkcore=self.webpackChunkcore||[]).push([["src_include_spiceattachments_spiceattachments_ts"],{3030:(e,t,s)=>{s.r(t),s.d(t,{ModuleSpiceAttachments:()=>Ye});var i=s(6895),l=s(433),n=s(4357),a=s(5886),o=s(3283),d=s(8363),c=s(1652),m=s(1571),r=s(323),h=s(5329),p=s(4044),u=s(5710),f=s(2294),g=s(3278),b=s(4154),_=s(3463),y=s(4664),A=s(9774),x=s(2422),v=s(3441),Z=s(2656),S=s(7693);function w(e,t){if(1&e&&m._UZ(0,"system-file-icon",10),2&e){const e=m.oxw();m.Q6J("filename",e.file.filename)("filemimetype",e.file.file_mime_type)}}function T(e,t){if(1&e&&(m.TgZ(0,"div"),m._UZ(1,"img",11),m.qZA()),2&e){const e=m.oxw();m.xp6(1),m.Q6J("src","data:image/jpg;base64,"+e.file.thumbnail,m.LSH)}}function L(e,t){if(1&e){const e=m.EpF();m.TgZ(0,"div",12)(1,"button",13),m.NdJ("click",(function(){m.CHM(e);const t=m.oxw();return m.KtG(t.deleteFile())})),m._UZ(2,"system-button-icon",14),m.qZA()()}}function F(e,t){if(1&e&&(m.TgZ(0,"div",15)(1,"ul",16)(2,"li",17),m._uU(3),m.qZA(),m.TgZ(4,"li",17),m._uU(5),m.qZA()()()),2&e){const e=m.oxw();m.xp6(3),m.Oqu(e.filedate),m.xp6(2),m.Oqu(e.humanFileSize)}}function M(e,t){if(1&e&&(m.TgZ(0,"div",4)(1,"div",18)(2,"span",19)(3,"span",20),m._uU(4,"Progress: 25%"),m.qZA()()(),m.TgZ(5,"div",21),m._uU(6),m.qZA()()),2&e){const e=m.oxw();m.xp6(2),m.Q6J("ngStyle",e.progressbarstyle),m.xp6(4),m.hij(" ",e.file.uploadprogress," % ")}}let C=(()=>{class SpiceAttachmentFile{constructor(e,t,s,i,l){this.userpreferences=e,this.modal=t,this.toast=s,this.helper=i,this.injector=l,this.file={},this.editmode=!0}get humanFileSize(){return this.modelattachments.humanFileSize(this.file.filesize)}get filedate(){return this.file.date?this.file.date.format(this.userpreferences.getDateFormat()):""}get uploading(){return this.file.hasOwnProperty("uploadprogress")}get progressbarstyle(){return{width:this.file.uploadprogress+"%"}}downloadFile(){this.uploading||this.modelattachments.downloadAttachment(this.file.id,this.file.filename)}previewFile(e){if(e.preventDefault(),e.stopPropagation(),this.uploading)this.toast.sendToast("upload still in progress","info");else if(this.file.file_mime_type){let e=this.file.file_mime_type.toLowerCase().split("/");switch(e[0].trim()){case"image":if("svg+xml"===e[1])this.modal.openModal("SystemObjectPreviewModal").subscribe((e=>{e.instance.name=this.file.filename,e.instance.type=this.file.file_mime_type.toLowerCase(),this.modelattachments.getAttachment(this.file.id).subscribe({next:t=>{e.instance.data=atob(t)},error:t=>{e.instance.loadingerror=!0}})}));else this.modal.openModal("SystemImagePreviewModal").subscribe((e=>{e.instance.imgname=this.file.filename,e.instance.imgtype=this.file.file_mime_type.toLowerCase(),this.modelattachments.getAttachment(this.file.id).subscribe({next:t=>{e.instance.imgsrc="data:"+this.file.file_mime_type.toLowerCase()+";base64,"+t},error:t=>{e.instance.loadingerror=!0}})}));break;case"text":case"audio":case"video":this.modal.openModal("SystemObjectPreviewModal").subscribe((e=>{e.instance.name=this.file.filename,e.instance.type=this.file.file_mime_type.toLowerCase(),this.modelattachments.getAttachment(this.file.id).subscribe({next:t=>{e.instance.data=atob(t)},error:t=>{e.instance.loadingerror=!0}})}));break;case"application":if("pdf"===e[1])this.modal.openModal("SystemObjectPreviewModal").subscribe((e=>{e.instance.name=this.file.filename,e.instance.type=this.file.file_mime_type.toLowerCase(),this.modelattachments.getAttachment(this.file.id).subscribe({next:t=>{e.instance.data=atob(t)},error:t=>{e.instance.loadingerror=!0}})}));else{if("msg"===this.file.filename.split(".").splice(-1,1)[0].toLowerCase())this.modal.openModal("EmailPreviewModal",!0,this.injector).subscribe((e=>{e.instance.name=this.file.filename,e.instance.type=this.file.file_mime_type.toLowerCase(),e.instance.file=this.file}));else this.downloadFile()}break;default:this.downloadFile()}}}deleteFile(){this.editmode&&this.modelattachments.deleteAttachment(this.file.id)}}return SpiceAttachmentFile.ɵfac=function(e){return new(e||SpiceAttachmentFile)(m.Y36(x.z),m.Y36(p.o),m.Y36(g.A),m.Y36(v._),m.Y36(m.zs3))},SpiceAttachmentFile.ɵcmp=m.Xpm({type:SpiceAttachmentFile,selectors:[["spice-attachment-file"]],inputs:{file:"file",editmode:"editmode",modelattachments:"modelattachments"},decls:11,vars:6,consts:[[1,"slds-m-right--x-small","slds-align--absolute-center",2,"width","30px","height","30px"],["divClass","","size","small",3,"filename","filemimetype",4,"ngIf"],[4,"ngIf"],[1,"slds-media__body"],[1,"slds-grid","slds-grid_vertical-align-center","slds-grid--align-spread","slds-has-flexi-truncate"],[1,"slds-truncate","slds-text-heading--x-small","slds-p-right--xxx-small",3,"click"],["href","javascript:void(0);"],["class","slds-shrink-none",4,"ngIf"],["class","slds-tile__detail slds-text-body--small",4,"ngIf"],["class","slds-grid slds-grid_vertical-align-center slds-grid--align-spread slds-has-flexi-truncate",4,"ngIf"],["divClass","","size","small",3,"filename","filemimetype"],[3,"src"],[1,"slds-shrink-none"],[1,"slds-button","slds-button--icon",3,"click"],["icon","clear"],[1,"slds-tile__detail","slds-text-body--small"],[1,"slds-list--horizontal","slds-has-dividers--left"],[1,"slds-item"],[1,"slds-progress-bar"],[1,"slds-progress-bar__value",3,"ngStyle"],[1,"slds-assistive-text"],[1,"slds-text-align--right",2,"width","50px"]],template:function(e,t){1&e&&(m.TgZ(0,"div",0),m.YNc(1,w,1,2,"system-file-icon",1),m.YNc(2,T,2,1,"div",2),m.qZA(),m.TgZ(3,"div",3)(4,"div",4)(5,"h3",5),m.NdJ("click",(function(e){return t.previewFile(e)})),m.TgZ(6,"a",6),m._uU(7),m.qZA()(),m.YNc(8,L,3,0,"div",7),m.qZA(),m.YNc(9,F,6,2,"div",8),m.YNc(10,M,7,2,"div",9),m.qZA()),2&e&&(m.xp6(1),m.Q6J("ngIf",!t.file.thumbnail),m.xp6(1),m.Q6J("ngIf",t.file.thumbnail),m.xp6(5),m.Oqu(t.file.filename),m.xp6(1),m.Q6J("ngIf",!t.uploading&&t.editmode),m.xp6(1),m.Q6J("ngIf",!t.uploading),m.xp6(1),m.Q6J("ngIf",t.uploading))},dependencies:[i.O5,i.PC,Z.J,S.T],encapsulation:2}),SpiceAttachmentFile})();const q=["fileupload"];function I(e,t){if(1&e&&m._UZ(0,"spice-attachment-file",6),2&e){const e=t.$implicit,s=m.oxw(2);m.Q6J("modelattachments",s.modelattachments)("file",e)("editmode",s.editing)}}function J(e,t){1&e&&(m.TgZ(0,"div",7)(1,"div",8),m._UZ(2,"system-spinner",9)(3,"system-label",10),m.qZA()())}function Y(e,t){if(1&e){const e=m.EpF();m.TgZ(0,"button",18),m.NdJ("click",(function(){m.CHM(e);const t=m.oxw(3);return m.KtG(t.selectFile())})),m._UZ(1,"system-label",19),m.qZA()}}function O(e,t){if(1&e){const e=m.EpF();m.TgZ(0,"button",18),m.NdJ("click",(function(){m.CHM(e);const t=m.oxw(3);return m.KtG(t.addImage())})),m._UZ(1,"system-label",20),m.qZA()}}function U(e,t){if(1&e){const e=m.EpF();m.TgZ(0,"div",11)(1,"div",12),m._UZ(2,"system-label",13),m.qZA(),m.TgZ(3,"div",12),m._UZ(4,"system-label",14),m.qZA(),m.YNc(5,Y,2,0,"button",15),m.TgZ(6,"div",12),m._UZ(7,"system-label",14),m.qZA(),m.YNc(8,O,2,0,"button",15),m.TgZ(9,"input",16,17),m.NdJ("click",(function(){m.CHM(e);const t=m.MAs(10);return m.KtG(t.value=null)}))("change",(function(){m.CHM(e);const t=m.oxw(2);return m.KtG(t.uploadFile())})),m.qZA()()}if(2&e){const e=m.oxw(2);m.xp6(5),m.Q6J("ngIf",!e.componentconfig.disableupload),m.xp6(3),m.Q6J("ngIf",!e.componentconfig.disableupload)}}function N(e,t){if(1&e){const e=m.EpF();m.TgZ(0,"div",1),m.NdJ("system-drop-file",(function(t){m.CHM(e);const s=m.oxw();return m.KtG(s.fileDrop(t))})),m.TgZ(1,"div")(2,"div",2),m.YNc(3,I,1,3,"spice-attachment-file",3),m.qZA(),m.YNc(4,J,4,0,"div",4),m.qZA(),m.YNc(5,U,11,2,"div",5),m.qZA()}if(2&e){const e=m.oxw();m.xp6(3),m.Q6J("ngForOf",e.modelattachments.files),m.xp6(1),m.Q6J("ngIf",e.modelattachments.loading),m.xp6(1),m.Q6J("ngIf",e.editing&&!e.componentconfig.disableupload&&!e.modelattachments.loading)}}let k=(()=>{class SpiceAttachmentsPanel{constructor(e,t,s,i,l,n,a,o,d,c,r){this._modelattachments=e,this.parentmodelattachments=t,this.language=s,this.modal=i,this.model=l,this.view=n,this.renderer=a,this.toast=o,this.metadata=d,this.modalservice=c,this.injector=r,this.uploadfiles=[],this.attachmentsLoaded=new m.vpe,this.componentconfig={},this._modelattachments.module=this.model.module,this._modelattachments.id=this.model.id}get isHidden(){return!!this.componentconfig.requiredmodelstate&&!this.model.checkModelState(this.componentconfig.requiredmodelstate)}get modelattachments(){return this.parentmodelattachments&&this.parentmodelattachments.module==this.model.module&&this.parentmodelattachments.id==this.model.id?this.parentmodelattachments:this._modelattachments}get editing(){return this.model.isEditing&&(!this.view||this.view.isEditable)}loadFiles(){this.modelattachments.getAttachments(this.componentconfig.systemCateogryId).subscribe((e=>{this.attachmentsLoaded.emit(!0),this.loadInputFiles()}))}loadInputFiles(){this.modelattachments.uploadAttachmentsBase64FromArray(this.uploadfiles)}setUploadFiles(e){for(let e of this.uploadfiles){let t=this._modelattachments.files.find((t=>t.filename==e.name));t&&this._modelattachments.deleteAttachment(t.id)}this.uploadfiles=e,this.loadInputFiles()}ngAfterViewInit(){this.parentmodelattachments||setTimeout((()=>this.loadFiles()),10)}preventdefault(e){(e.dataTransfer.items.length>=1&&this.hasOneItemsFile(e.dataTransfer.items)||e.dataTransfer.files.length>0)&&(e.preventDefault(),e.stopPropagation(),e.dataTransfer.dropEffect="copy")}hasOneItemsFile(e){for(let t of e)if("file"==t.kind)return!0;return!1}onDrop(e){this.preventdefault(e);let t=e.dataTransfer.files;t&&t.length>=1&&this.doupload(t)}fileDrop(e){e&&e.length>=1&&this.doupload(e)}selectFile(){let e=new MouseEvent("click",{bubbles:!0});this.fileupload.element.nativeElement.dispatchEvent(e)}uploadFile(){let e=this.fileupload.element.nativeElement.files;this.doupload(e)}doupload(e){this.modelattachments.uploadAttachmentsBase64(e,this.componentconfig.systemCateogryId)}addImage(){this.modal.openModal("SpiceAttachmentAddImageModal",!0,this.injector)}}return SpiceAttachmentsPanel.ɵfac=function(e){return new(e||SpiceAttachmentsPanel)(m.Y36(r.H),m.Y36(r.H,12),m.Y36(h.d),m.Y36(p.o),m.Y36(u.o),m.Y36(f.e,8),m.Y36(m.Qsj),m.Y36(g.A),m.Y36(b.Pu),m.Y36(p.o),m.Y36(m.zs3))},SpiceAttachmentsPanel.ɵcmp=m.Xpm({type:SpiceAttachmentsPanel,selectors:[["ng-component"]],viewQuery:function(e,t){if(1&e&&m.Gf(q,5,m.s_b),2&e){let e;m.iGM(e=m.CRH())&&(t.fileupload=e.first)}},outputs:{attachmentsLoaded:"attachmentsLoaded"},features:[m._Bn([r.H])],decls:1,vars:1,consts:[["class","slds-box slds-m-around--xx-small",3,"system-drop-file",4,"ngIf"],[1,"slds-box","slds-m-around--xx-small",3,"system-drop-file"],[1,"slds-card__body--inner","slds-grid","slds-wrap","slds-grid--pull-padded"],["class","slds-media slds-size--1-of-1",3,"modelattachments","file","editmode",4,"ngFor","ngForOf"],["class","slds-p-around--x-small slds-align--absolute-center",4,"ngIf"],["class","slds-grid slds-grid--align-center slds-grid--vertical-align-center slds-gutters_direct-xx-small",4,"ngIf"],[1,"slds-media","slds-size--1-of-1",3,"modelattachments","file","editmode"],[1,"slds-p-around--x-small","slds-align--absolute-center"],[1,"slds-grid","slds-grid--vertical-align-center"],["size","14"],["label","LBL_INITIALIZING",1,"slds-p-left--x-small"],[1,"slds-grid","slds-grid--align-center","slds-grid--vertical-align-center","slds-gutters_direct-xx-small"],[1,"slds-col"],["label","LBL_DROP_FILES"],["label","LBL_OR"],["class","slds-col slds-button slds-button--neutral",3,"click",4,"ngIf"],["type","file","multiple","",2,"display","none",3,"click","change"],["fileupload",""],[1,"slds-col","slds-button","slds-button--neutral",3,"click"],["label","LBL_UPLOAD_FILES"],["label","LBL_ADD_IMAGE"]],template:function(e,t){1&e&&m.YNc(0,N,6,3,"div",0),2&e&&m.Q6J("ngIf",!t.isHidden)},dependencies:[i.sg,i.O5,_._,y.W,A.M,C],encapsulation:2}),SpiceAttachmentsPanel})();var E=s(3369);function Q(e,t){if(1&e&&(m.TgZ(0,"span",3),m._uU(1),m.qZA()),2&e){const e=m.oxw();m.xp6(1),m.Oqu(e.attachmentcount)}}let D=(()=>{class SpiceAttachmentsPanelHeader{constructor(e,t,s,i){this.model=e,this.modelattachments=t,this.language=s,this.broadcast=i,this.broadcastSubscription={},this.attachmentcount=0,this.broadcastSubscription=this.broadcast.message$.subscribe((e=>{this.handleMessage(e)}))}ngOnInit(){this.modelattachments.module=this.model.module,this.modelattachments.id=this.model.id,this.modelattachments.getCount().subscribe((e=>{this.attachmentcount=e}))}get hasAttachments(){return this.attachmentcount>0}handleMessage(e){if((e.messagedata.module===this.model.module||e.messagedata.id===this.model.id)&&"attachments.loaded"===e.messagetype)this.attachmentcount=e.messagedata.attachmentcount}ngOnDestroy(){this.broadcastSubscription.unsubscribe()}}return SpiceAttachmentsPanelHeader.ɵfac=function(e){return new(e||SpiceAttachmentsPanelHeader)(m.Y36(u.o),m.Y36(r.H),m.Y36(h.d),m.Y36(E.f))},SpiceAttachmentsPanelHeader.ɵcmp=m.Xpm({type:SpiceAttachmentsPanelHeader,selectors:[["ng-component"]],features:[m._Bn([r.H])],decls:4,vars:1,consts:[[1,"slds-grid","slds-grid--vertical-align-center"],["label","LBL_FILES"],["class","slds-theme_warning slds-m-horizontal--xx-small slds-align--absolute-center spice-counter",4,"ngIf"],[1,"slds-theme_warning","slds-m-horizontal--xx-small","slds-align--absolute-center","spice-counter"]],template:function(e,t){1&e&&(m.TgZ(0,"div",0)(1,"span"),m._UZ(2,"system-label",1),m.qZA(),m.YNc(3,Q,2,1,"span",2),m.qZA()),2&e&&(m.xp6(3),m.Q6J("ngIf",t.hasAttachments))},dependencies:[i.O5,_._],encapsulation:2}),SpiceAttachmentsPanelHeader})();function P(e,t){if(1&e&&m._UZ(0,"spice-attachment-file",3),2&e){const e=t.$implicit,s=m.oxw(2);m.Q6J("modelattachments",s.modelattachments)("file",e)("editmode",!1)("ngClass",s.getItemClass())}}function z(e,t){if(1&e&&(m.TgZ(0,"div",1),m.YNc(1,P,1,4,"spice-attachment-file",2),m.qZA()),2&e){const e=m.oxw();m.Q6J("ngStyle",e.getCompStyle())("ngClass",e.componentconfig.addClasses),m.xp6(1),m.Q6J("ngForOf",e.modelattachments.files)}}let H=(()=>{class SpiceAttachmentsList{constructor(e,t,s,i){this.modelattachments=e,this.language=t,this.model=s,this.cdRef=i,this.componentconfig={},this.modelattachments.module=this.model.module,this.modelattachments.id=this.model.id}loadFiles(){this.modelattachments.getAttachments().subscribe((e=>{this.cdRef.detectChanges()}))}ngAfterViewInit(){setTimeout((()=>this.loadFiles()),10)}getCompStyle(){return{marginRight:this.componentconfig.horizontal?"-16px":void 0,marginBottom:this.componentconfig.horizontal?"-8px":void 0}}getItemClass(){return this.componentconfig.horizontal?"slds-m-right_medium slds-m-bottom_x-small":"slds-size--1-of-1"}}return SpiceAttachmentsList.ɵfac=function(e){return new(e||SpiceAttachmentsList)(m.Y36(r.H),m.Y36(h.d),m.Y36(u.o),m.Y36(m.sBO))},SpiceAttachmentsList.ɵcmp=m.Xpm({type:SpiceAttachmentsList,selectors:[["ng-component"]],features:[m._Bn([r.H])],decls:1,vars:1,consts:[["class","slds-m-vertical--xx-small slds-card__body--inner slds-grid slds-wrap slds-grid--pull-padded",3,"ngStyle","ngClass",4,"ngIf"],[1,"slds-m-vertical--xx-small","slds-card__body--inner","slds-grid","slds-wrap","slds-grid--pull-padded",3,"ngStyle","ngClass"],["class","slds-media",3,"modelattachments","file","editmode","ngClass",4,"ngFor","ngForOf"],[1,"slds-media",3,"modelattachments","file","editmode","ngClass"]],template:function(e,t){1&e&&m.YNc(0,z,2,3,"div",0),2&e&&m.Q6J("ngIf",t.modelattachments.files.length>0)},dependencies:[i.mk,i.sg,i.O5,i.PC,C],encapsulation:2,changeDetection:0}),SpiceAttachmentsList})();function B(e,t){if(1&e&&(m.TgZ(0,"div",2),m._UZ(1,"spice-attachment-file",3),m.qZA()),2&e){const e=t.$implicit,s=m.oxw();m.xp6(1),m.Q6J("file",e)("modelattachments",s.modelattachments)("editmode",!1)}}let j=(()=>{class SpiceAttachmentsPopupList{constructor(e,t,s){this.modelattachments=e,this.language=t,this.model=s,this.componentconfig={},this.modelattachments.module=this.model.module,this.modelattachments.id=this.model.id}ngOnInit(){this.modelattachments.getAttachments()}}return SpiceAttachmentsPopupList.ɵfac=function(e){return new(e||SpiceAttachmentsPopupList)(m.Y36(r.H),m.Y36(h.d),m.Y36(u.o))},SpiceAttachmentsPopupList.ɵcmp=m.Xpm({type:SpiceAttachmentsPopupList,selectors:[["ng-component"]],features:[m._Bn([r.H])],decls:2,vars:1,consts:[[1,"slds-p-around--x-small"],["class","slds-p-vertical--x-small",4,"ngFor","ngForOf"],[1,"slds-p-vertical--x-small"],[1,"slds-media","slds-size--1-of-1",3,"file","modelattachments","editmode"]],template:function(e,t){1&e&&(m.TgZ(0,"div",0),m.YNc(1,B,2,3,"div",1),m.qZA()),2&e&&(m.xp6(1),m.Q6J("ngForOf",t.modelattachments.files))},dependencies:[i.sg,C],encapsulation:2}),SpiceAttachmentsPopupList})();var R=s(2547),G=s(9621),K=s(3499),X=s(5767),$=s(1916);let V=(()=>{class SpiceAttachmentAddImageModal{constructor(e,t){this.language=e,this.modelattachments=t,this.filecontent="",this.imagedata=new m.vpe}close(){this.self.destroy()}add(){let e=this.inputMedia.mediaMetaData;this.modelattachments.uploadFileBase64(this.filecontent,e.filename,e.mimetype),this.self.destroy()}}return SpiceAttachmentAddImageModal.ɵfac=function(e){return new(e||SpiceAttachmentAddImageModal)(m.Y36(h.d),m.Y36(r.H))},SpiceAttachmentAddImageModal.ɵcmp=m.Xpm({type:SpiceAttachmentAddImageModal,selectors:[["ng-component"]],viewQuery:function(e,t){if(1&e&&m.Gf(R.l,5),2&e){let e;m.iGM(e=m.CRH())&&(t.inputMedia=e.first)}},outputs:{imagedata:"imagedata"},decls:10,vars:2,consts:[[3,"close"],["margin","xx-small"],[3,"ngModel","ngModelChange"],[1,"slds-button","slds-button--neutral",3,"click"],["label","LBL_CANCEL"],[1,"slds-button","slds-button--brand",3,"disabled","click"],["label","LBL_ADD"]],template:function(e,t){1&e&&(m.TgZ(0,"system-modal")(1,"system-modal-header",0),m.NdJ("close",(function(){return t.close()})),m._uU(2,"Add Image"),m.qZA(),m.TgZ(3,"system-modal-content",1)(4,"system-input-media",2),m.NdJ("ngModelChange",(function(e){return t.filecontent=e})),m.qZA()(),m.TgZ(5,"system-modal-footer")(6,"button",3),m.NdJ("click",(function(){return t.close()})),m._UZ(7,"system-label",4),m.qZA(),m.TgZ(8,"button",5),m.NdJ("click",(function(){return t.add()})),m._UZ(9,"system-label",6),m.qZA()()()),2&e&&(m.xp6(4),m.Q6J("ngModel",t.filecontent),m.xp6(4),m.Q6J("disabled",!t.filecontent))},dependencies:[l.JJ,l.On,_._,G.j,K.x,X.p,$.y,R.l],encapsulation:2}),SpiceAttachmentAddImageModal})();var W=s(727),ee=s(8859);function te(e,t){1&e&&m._UZ(0,"system-utility-icon",1)}let se=(()=>{class SpiceAttachmentsCount{constructor(e,t,s,i,l,n){this.metadata=e,this.modelattachments=t,this.parentmodelattachments=s,this.language=i,this.model=l,this.cdRef=n,this.subscriptions=new W.w0,this.modelattachments.module=this.model.module,this.modelattachments.id=this.model.id}ngAfterViewInit(){this.modelHasAttachmentcount()||(this.parentmodelattachments?this.subscriptions.add(this.parentmodelattachments.getCount().subscribe((e=>{this.cdRef.detectChanges()}))):this.subscriptions.add(this.modelattachments.getCount().subscribe((e=>{this.cdRef.detectChanges()}))))}modelHasAttachmentcount(){return!!this.metadata.getModuleFields(this.model.module).attachments_count}ngOnDestroy(){this.subscriptions.unsubscribe()}get count(){return this.modelHasAttachmentcount()?this.model.getField("attachments_count"):this.parentmodelattachments?this.parentmodelattachments.count:this.modelattachments.count}}return SpiceAttachmentsCount.ɵfac=function(e){return new(e||SpiceAttachmentsCount)(m.Y36(b.Pu),m.Y36(r.H),m.Y36(r.H,12),m.Y36(h.d),m.Y36(u.o),m.Y36(m.sBO))},SpiceAttachmentsCount.ɵcmp=m.Xpm({type:SpiceAttachmentsCount,selectors:[["spice-attachments-count"]],features:[m._Bn([r.H])],decls:1,vars:1,consts:[["icon","attach","size","xx-small",4,"ngIf"],["icon","attach","size","xx-small"]],template:function(e,t){1&e&&m.YNc(0,te,1,0,"system-utility-icon",0),2&e&&m.Q6J("ngIf",t.count>0)},dependencies:[i.O5,ee.r],encapsulation:2,changeDetection:0}),SpiceAttachmentsCount})();var ie=s(7040),le=s(1933),ne=s(6367),ae=s(3208),oe=s(3548);function de(e,t){if(1&e&&m._UZ(0,"field-label",3),2&e){const e=m.oxw();m.Q6J("fieldname",e.fieldname)("fieldconfig",e.fieldconfig)}}const ce=function(e,t){return{injector:e,componentset:t}};let me=(()=>{class fieldSpiceAttachmentsCount extends ie.O{constructor(e,t,s,i,l,n){super(e,t,s,i,l),this.model=e,this.view=t,this.language=s,this.metadata=i,this.router=l,this.injector=n}get popovercomponentset(){return this.fieldconfig.popovercomponentset}}return fieldSpiceAttachmentsCount.ɵfac=function(e){return new(e||fieldSpiceAttachmentsCount)(m.Y36(u.o),m.Y36(f.e),m.Y36(h.d),m.Y36(b.Pu),m.Y36(le.F0),m.Y36(m.zs3))},fieldSpiceAttachmentsCount.ɵcmp=m.Xpm({type:fieldSpiceAttachmentsCount,selectors:[["ng-component"]],features:[m.qOj],decls:4,vars:8,consts:[[3,"fieldname","fieldconfig",4,"ngIf"],[3,"fielddisplayclass","fieldconfig","editable"],[3,"system-pop-over"],[3,"fieldname","fieldconfig"]],template:function(e,t){1&e&&(m.YNc(0,de,1,2,"field-label",0),m.TgZ(1,"field-generic-display",1)(2,"div",2),m._UZ(3,"spice-attachments-count"),m.qZA()()),2&e&&(m.Q6J("ngIf",t.displayLabel),m.xp6(1),m.Q6J("fielddisplayclass",t.fielddisplayclass)("fieldconfig",t.fieldconfig)("editable",!1),m.xp6(1),m.Q6J("system-pop-over",m.WLB(5,ce,t.injector,t.popovercomponentset)))},dependencies:[i.O5,ne.q,ae.D,oe.K,se],encapsulation:2}),fieldSpiceAttachmentsCount})();var re=s(6625),he=s(4505),pe=s(9503),ue=s(8658),fe=s(151);function ge(e,t){if(1&e&&(m.TgZ(0,"div",20)(1,"system-checkbox-group-checkbox",21),m._UZ(2,"system-label",22),m.qZA()()),2&e){const e=t.$implicit;m.Q6J("system-title",e.label),m.xp6(1),m.Q6J("value",e.id),m.xp6(1),m.Q6J("label",e.label)}}let be=(()=>{class SpiceAttachmentsEditModal{constructor(e,t,s,i,l){this.configurationService=e,this.toast=t,this.language=s,this.model=i,this.backend=l,this.attachment={},this.inputData={},this.categories=[],this.self={}}ngOnInit(){if(this.configurationService.getData("spiceattachments_categories"))return this.categories=this.configurationService.getData("spiceattachments_categories");this.backend.getRequest("common/spiceattachments/categories/"+this.model.module).subscribe((e=>{e&&Array.isArray(e)&&(this.categories=e,this.configurationService.setData("spiceattachments_categories",e))}))}close(){this.self.destroy()}save(){const e={category_ids:this.inputData.category_ids.join(","),text:this.inputData.text,display_name:this.inputData.display_name?this.inputData.display_name:""};this.backend.postRequest("common/spiceattachments/"+this.attachment.id,{},e).subscribe((e=>{e&&e.success?(this.inputData.category_ids&&this.inputData.category_ids.join(",")!=this.attachment.category_ids&&(this.attachment.category_ids=this.inputData.category_ids.join(",")),this.inputData.text!=this.attachment.text&&(this.attachment.text=this.inputData.text),this.inputData.display_name!=this.attachment.display_name&&(this.attachment.display_name=this.inputData.display_name),this.toast.sendToast(this.language.getLabel("LBL_DATA_SAVED"),"success")):this.toast.sendToast(this.language.getLabel("ERR_FAILED_TO_EXECUTE"),"error"),this.self.destroy()}),(()=>{this.toast.sendToast(this.language.getLabel("ERR_NETWORK"),"error"),this.self.destroy()}))}}return SpiceAttachmentsEditModal.ɵfac=function(e){return new(e||SpiceAttachmentsEditModal)(m.Y36(re.C),m.Y36(g.A),m.Y36(h.d),m.Y36(u.o),m.Y36(he.y))},SpiceAttachmentsEditModal.ɵcmp=m.Xpm({type:SpiceAttachmentsEditModal,selectors:[["ng-component"]],decls:30,vars:5,consts:[[3,"close"],["label","LBL_EDIT"],[1,"slds-form-element"],[1,"slds-form-element__label"],["label","LBL_FILENAME"],[1,"slds-form-element__control"],["type","text","disabled","",1,"slds-input",3,"ngModel","ngModelChange"],["label","LBL_DISPLAY_NAME"],["type","text",1,"slds-input",3,"ngModel","ngModelChange"],[1,"slds-form-element","slds-p-horizontal--xx-small"],["label","LBL_CATEGORIES"],[3,"ngModel","ngModelChange"],["class","slds-large-size--1-of-3 slds-medium-size--1-of-1 slds-truncate",3,"system-title",4,"ngFor","ngForOf"],["label","LBL_TEXT"],[1,"slds-textarea","slds-scrollable--y","slds-m-vertical--xx-small",2,"height","250px",3,"ngModel","ngModelChange"],[1,"slds-grid"],[1,"slds-button","slds-button--neutral",3,"click"],["label","LBL_CANCEL"],[1,"slds-button","slds-button--brand",3,"click"],["label","LBL_SAVE"],[1,"slds-large-size--1-of-3","slds-medium-size--1-of-1","slds-truncate",3,"system-title"],[3,"value"],[1,"slds-m-left--xx-small",3,"label"]],template:function(e,t){1&e&&(m.TgZ(0,"system-modal")(1,"system-modal-header",0),m.NdJ("close",(function(){return t.close()})),m._UZ(2,"system-label",1),m.qZA(),m.TgZ(3,"system-modal-content")(4,"div",2)(5,"label",3),m._UZ(6,"system-label",4),m.qZA(),m.TgZ(7,"div",5)(8,"input",6),m.NdJ("ngModelChange",(function(e){return t.attachment.filename=e})),m.qZA()()(),m.TgZ(9,"div",2)(10,"label",3),m._UZ(11,"system-label",7),m.qZA(),m.TgZ(12,"div",5)(13,"input",8),m.NdJ("ngModelChange",(function(e){return t.inputData.display_name=e})),m.qZA()()(),m.TgZ(14,"div",9)(15,"label",3),m._UZ(16,"system-label",10),m.qZA(),m.TgZ(17,"system-checkbox-group",11),m.NdJ("ngModelChange",(function(e){return t.inputData.category_ids=e})),m.YNc(18,ge,3,3,"div",12),m.qZA()(),m.TgZ(19,"div",9)(20,"label",3),m._UZ(21,"system-label",13),m.qZA(),m.TgZ(22,"div",5)(23,"textarea",14),m.NdJ("ngModelChange",(function(e){return t.inputData.text=e})),m.qZA()()()(),m.TgZ(24,"system-modal-footer")(25,"div",15)(26,"button",16),m.NdJ("click",(function(){return t.close()})),m._UZ(27,"system-label",17),m.qZA(),m.TgZ(28,"button",18),m.NdJ("click",(function(){return t.save()})),m._UZ(29,"system-label",19),m.qZA()()()()),2&e&&(m.xp6(8),m.Q6J("ngModel",t.attachment.filename),m.xp6(5),m.Q6J("ngModel",t.inputData.display_name),m.xp6(4),m.Q6J("ngModel",t.inputData.category_ids),m.xp6(1),m.Q6J("ngForOf",t.categories),m.xp6(5),m.Q6J("ngModel",t.inputData.text))},dependencies:[i.sg,l.Fj,l.JJ,l.On,pe.L,ue.m,_._,G.j,K.x,X.p,$.y,fe.S],encapsulation:2,changeDetection:0}),SpiceAttachmentsEditModal})();var _e=s(5698);function ye(e,t){if(1&e&&(m.TgZ(0,"tr")(1,"td")(2,"div",13),m._uU(3),m.qZA()(),m.TgZ(4,"td",20)(5,"div",13),m._uU(6),m.qZA()()()),2&e){const e=t.$implicit;m.xp6(3),m.Oqu(e.module),m.xp6(3),m.Oqu(e.count)}}function Ae(e,t){if(1&e&&(m.TgZ(0,"tr")(1,"td")(2,"div",13),m._UZ(3,"system-label",24),m.qZA()(),m.TgZ(4,"td",20)(5,"div",13),m._uU(6),m.qZA()()()),2&e){const e=t.$implicit,s=m.oxw();m.xp6(3),m.Q6J("label",s.missingFiles[e].label),m.xp6(3),m.Oqu(s.missingFiles[e].count)}}let xe=(()=>{class SpiceAttachmentStats{constructor(e,t){this.backend=e,this.modal=t,this.analysisresults=[],this.missingFilesTotalcount=0,this.fileAreas=[],this.analyze(),this.getMissingFiles()}analyze(){this.analysisresults=[],this.backend.getRequest("common/spiceattachments/admin").pipe((0,_e.q)(1)).subscribe((e=>{for(let t in e)this.analysisresults.push({module:t,count:e[t]})}))}get totalcount(){let e=0;for(let t of this.analysisresults)e+=parseInt(t.count,10);return e}delete(){this.modal.confirm("Are you sure you want to delete the data of all orphaned File Attachments?","Delete Orphaned Attachments?","warning").pipe((0,_e.q)(1)).subscribe((e=>{e&&this.backend.postRequest("common/spiceattachments/admin/cleanup").pipe((0,_e.q)(1)).subscribe((e=>{this.analyze()}))}))}getMissingFiles(){this.fileAreas=[],this.missingFilesTotalcount=0,this.backend.getRequest("common/spiceattachments/admin/missingfiles").pipe((0,_e.q)(1)).subscribe((e=>{this.missingFiles=e;for(let e in this.missingFiles)this.fileAreas.push(e),this.missingFilesTotalcount+=this.missingFiles[e].count}))}}return SpiceAttachmentStats.ɵfac=function(e){return new(e||SpiceAttachmentStats)(m.Y36(he.y),m.Y36(p.o))},SpiceAttachmentStats.ɵcmp=m.Xpm({type:SpiceAttachmentStats,selectors:[["ng-component"]],decls:48,vars:4,consts:[[1,"slds-grid","slds-grid_vertical-align-center","slds-p-around--small"],[1,"slds-text-heading_medium"],["label","LBL_ATTACHMENTSTATISTICS"],[1,"slds-col--bump-left","slds-button","slds-button_icon","slds-button_icon-border-filled",3,"click"],["icon","delete"],[1,"slds-button","slds-button_icon","slds-button_icon-border-filled",3,"click"],["icon","refresh"],[1,"slds-border--top","system-to-bottom"],[1,"slds-text-heading--small","slds-p-around--small"],["label","LBL_SPICEATTACHMENTS_ORPHANED"],[1,"slds-table","slds-table_bordered","slds-table_cell-buffer","slds-table--header-fixed"],[1,"slds-text-title_caps"],["scope","col"],[1,"slds-truncate"],["label","LBL_MODULE"],["scope","col",1,"slds-text-align--right"],["label","LBL_RECORDS"],[4,"ngFor","ngForOf"],[1,"slds-theme--alt-inverse"],["label","LBL_TOTAL"],[1,"slds-text-align--right"],["label","LBL_MISSING_FILES"],["label","LBL_AREA"],["label","LBL_FILES"],[3,"label"]],template:function(e,t){1&e&&(m.TgZ(0,"div",0)(1,"h2",1),m._UZ(2,"system-label",2),m.qZA(),m.TgZ(3,"button",3),m.NdJ("click",(function(){return t.delete()})),m._UZ(4,"system-button-icon",4),m.qZA(),m.TgZ(5,"button",5),m.NdJ("click",(function(){return t.analyze(),t.getMissingFiles()})),m._UZ(6,"system-button-icon",6),m.qZA()(),m.TgZ(7,"div",7)(8,"h3",8),m._UZ(9,"system-label",9),m.qZA(),m.TgZ(10,"table",10)(11,"thead")(12,"tr",11)(13,"th",12)(14,"div",13),m._UZ(15,"system-label",14),m.qZA()(),m.TgZ(16,"th",15)(17,"div",13),m._UZ(18,"system-label",16),m.qZA()()()(),m.TgZ(19,"tbody"),m.YNc(20,ye,7,2,"tr",17),m.TgZ(21,"tr",18)(22,"td")(23,"div",13),m._UZ(24,"system-label",19),m.qZA()(),m.TgZ(25,"td",20)(26,"div",13),m._uU(27),m.qZA()()()()(),m.TgZ(28,"h3",8),m._UZ(29,"system-label",21),m.qZA(),m.TgZ(30,"table",10)(31,"thead")(32,"tr",11)(33,"th",12)(34,"div",13),m._UZ(35,"system-label",22),m.qZA()(),m.TgZ(36,"th",15)(37,"div",13),m._UZ(38,"system-label",23),m.qZA()()()(),m.TgZ(39,"tbody"),m.YNc(40,Ae,7,2,"tr",17),m.TgZ(41,"tr",18)(42,"td")(43,"div",13),m._UZ(44,"system-label",19),m.qZA()(),m.TgZ(45,"td",20)(46,"div",13),m._uU(47),m.qZA()()()()()()),2&e&&(m.xp6(20),m.Q6J("ngForOf",t.analysisresults),m.xp6(7),m.Oqu(t.totalcount),m.xp6(13),m.Q6J("ngForOf",t.fileAreas),m.xp6(7),m.Oqu(t.missingFilesTotalcount))},dependencies:[i.sg,Z.J,_._],encapsulation:2}),SpiceAttachmentStats})();var ve=s(7579),Ze=s(5638),Se=s(4561);const we=["fileupload"];function Te(e,t){if(1&e&&m._UZ(0,"field-label",3),2&e){const e=m.oxw();m.Q6J("fieldname",e.fieldname)("fieldconfig",e.fieldconfig)}}function Le(e,t){if(1&e&&m._UZ(0,"system-file-icon",9),2&e){const e=m.oxw(2);m.Q6J("filemimetype",e.model.getField("file_mime_type"))("filename",e.value)}}function Fe(e,t){if(1&e){const e=m.EpF();m.TgZ(0,"field-generic-display",4)(1,"div",5),m.YNc(2,Le,1,2,"system-file-icon",6),m.TgZ(3,"div",7)(4,"a",8),m.NdJ("click",(function(t){m.CHM(e);const s=m.oxw();return m.KtG(s.previewFile(t))})),m._uU(5),m.qZA()()()()}if(2&e){const e=m.oxw();m.Q6J("fielddisplayclass",e.fielddisplayclass)("editable",e.isEditable())("fieldconfig",e.fieldconfig)("title",e.value)("fieldid",e.fieldid),m.xp6(2),m.Q6J("ngIf",e.value),m.xp6(3),m.Oqu(e.value)}}function Me(e,t){if(1&e){const e=m.EpF();m.TgZ(0,"div",15)(1,"div",16)(2,"span",17)(3,"span",18),m._UZ(4,"system-icon",19),m.qZA()(),m.TgZ(5,"a",20)(6,"span",21),m._uU(7),m.qZA()(),m.TgZ(8,"button",22),m.NdJ("click",(function(){m.CHM(e);const t=m.oxw(2);return m.KtG(t.removeFile())})),m._UZ(9,"system-button-icon",23),m.qZA()()()}if(2&e){const e=m.oxw(2);m.xp6(4),m.Q6J("icon",e.helper.determineFileIcon(e.mime_type)),m.xp6(3),m.Oqu(e.value)}}function Ce(e,t){if(1&e&&(m.TgZ(0,"div",24)(1,"div",25),m._UZ(2,"span",26),m.qZA(),m.TgZ(3,"div",27),m._uU(4),m.qZA()()),2&e){const e=m.oxw(2);m.xp6(2),m.Q6J("ngStyle",e.progressbarstyle),m.xp6(2),m.hij(" ",e.file.uploadprogress," % ")}}function qe(e,t){if(1&e){const e=m.EpF();m.TgZ(0,"div",28)(1,"div",29),m.NdJ("system-drop-file",(function(t){m.CHM(e);const s=m.oxw(2);return m.KtG(s.onDrop(t))})),m.TgZ(2,"input",30,31),m.NdJ("click",(function(){m.CHM(e);const t=m.MAs(3);return m.KtG(t.value=null)}))("change",(function(){m.CHM(e);const t=m.oxw(2);return m.KtG(t.uploadFile())})),m.qZA(),m.TgZ(4,"label",32)(5,"span",33),m._UZ(6,"system-button-icon",34)(7,"system-label",35),m.qZA(),m.TgZ(8,"span",36),m._UZ(9,"system-label",37)(10,"system-label",38),m.qZA()()()()}if(2&e){const e=m.oxw(2);m.xp6(2),m.Q6J("id",e.fieldid),m.xp6(2),m.uIk("for",e.fieldid),m.xp6(2),m.Q6J("icon","upload")}}function Ie(e,t){if(1&e&&(m.TgZ(0,"div",10),m.YNc(1,Me,10,2,"div",11),m.YNc(2,Ce,5,2,"div",12),m.YNc(3,qe,11,3,"div",13),m._UZ(4,"field-messages",14),m.qZA()),2&e){const e=m.oxw();m.Q6J("ngClass",e.getFieldClass()),m.xp6(1),m.Q6J("ngIf",e.value),m.xp6(1),m.Q6J("ngIf",e.uploading),m.xp6(1),m.Q6J("ngIf",!e.value&&!e.uploading),m.xp6(1),m.Q6J("fieldname",e.fieldname)}}let Je=(()=>{class fieldModelAttachment extends ie.O{constructor(e,t,s,i,l,n,a,o,d,c){super(e,t,s,i,l),this.model=e,this.view=t,this.language=s,this.metadata=i,this.router=l,this.injector=n,this.modelattachments=a,this.modal=o,this.helper=d,this.backend=c}get file(){return this.modelattachments.files[0]}get uploading(){return this.file?.hasOwnProperty("uploadprogress")}get progressbarstyle(){return{width:this.file.uploadprogress+"%"}}get mime_type(){return this.model.getFieldValue(this.prefix+"_mime_type")}get prefix(){return"filename"==this.fieldname?"file":this.fieldname.substring(0,this.fieldname.length-5)}getAttachment(){let e=new ve.x;return this.backend.getRequest(`common/spiceattachments/module/${this.model.module}/${this.model.id}/byfield/${this.prefix}`).subscribe((t=>{e.next(t.file),e.complete()}),(t=>{e.error(t),e.complete()})),e.asObservable()}previewFile(e){if(e.preventDefault(),e.stopPropagation(),this.mime_type){let e=this.mime_type.toLowerCase().split("/");switch(e[0].trim()){case"image":this.modal.openModal("SystemImagePreviewModal").subscribe((e=>{e.instance.imgname=this.value,e.instance.imgtype=this.mime_type.toLowerCase(),this.getAttachment().subscribe((t=>{e.instance.imgsrc="data:"+this.mime_type.toLowerCase()+";base64,"+t}),(t=>{e.instance.loadingerror=!0}))}));break;case"text":case"audio":case"video":this.modal.openModal("SystemObjectPreviewModal").subscribe((e=>{e.instance.name=this.value,e.instance.type=this.mime_type.toLowerCase(),this.getAttachment().subscribe((t=>{e.instance.data=atob(t)}),(t=>{e.instance.loadingerror=!0}))}));break;case"application":if("pdf"===e[1])this.modal.openModal("SystemObjectPreviewModal").subscribe((e=>{e.instance.name=this.value,e.instance.type=this.mime_type.toLowerCase(),this.getAttachment().subscribe((t=>{e.instance.data=atob(t)}),(t=>{e.instance.loadingerror=!0}))}));else this.downloadFile();break;default:this.downloadFile()}}else this.downloadFile()}removeFile(){this.modelattachments.files.length>0&&(this.modelattachments.files=[]);let e={};e[this.fieldname]=void 0,e[this.prefix+"_size"]=void 0,e[this.prefix+"_mime_type"]=void 0,e[this.prefix+"_md5"]=void 0,this.model.setFields(e)}onDrop(e){e&&e.length>=1&&this.doupload(e)}uploadFile(){let e=this.fileupload.element.nativeElement.files;this.doupload(e)}downloadFile(){this.modelattachments.downloadAttachmentForField(this.model.module,this.model.id,this.prefix,this.value)}doupload(e){this.modelattachments.uploadAttachmentsBase64(e).subscribe((e=>{}),(e=>{}),(()=>{let e=this.modelattachments.files[0],t={};t[this.fieldname]=e.filename,t[this.prefix+"_size"]=e.filesize,t[this.prefix+"_mime_type"]=e.file_mime_type,t[this.prefix+"_md5"]=e.filemd5,this.model.setFields(t)}))}}return fieldModelAttachment.ɵfac=function(e){return new(e||fieldModelAttachment)(m.Y36(u.o),m.Y36(f.e),m.Y36(h.d),m.Y36(b.Pu),m.Y36(le.F0),m.Y36(m.zs3),m.Y36(r.H),m.Y36(p.o),m.Y36(v._),m.Y36(he.y))},fieldModelAttachment.ɵcmp=m.Xpm({type:fieldModelAttachment,selectors:[["ng-component"]],viewQuery:function(e,t){if(1&e&&m.Gf(we,5,m.s_b),2&e){let e;m.iGM(e=m.CRH())&&(t.fileupload=e.first)}},features:[m._Bn([r.H]),m.qOj],decls:3,vars:3,consts:[[3,"fieldname","fieldconfig",4,"ngIf"],[3,"fielddisplayclass","editable","fieldconfig","title","fieldid",4,"ngIf"],["class","slds-form-element__control slds-p-vertical--xxx-small",3,"ngClass",4,"ngIf"],[3,"fieldname","fieldconfig"],[3,"fielddisplayclass","editable","fieldconfig","title","fieldid"],[1,"slds-grid","slds-grid--vertical-align-center"],["divClass","slds-p-right--xx-small","size","x-small",3,"filemimetype","filename",4,"ngIf"],[1,"slds-truncate","slds-grow"],["href","javascript:void(0);",3,"click"],["divClass","slds-p-right--xx-small","size","x-small",3,"filemimetype","filename"],[1,"slds-form-element__control","slds-p-vertical--xxx-small",3,"ngClass"],["class","slds-pill_container slds-size--1-of-1 slds-m-vertical--xxx-small",4,"ngIf"],["class","slds-p-around--x-small slds-grid slds-grid_vertical-align-center slds-grid--align-spread slds-has-flexi-truncate",4,"ngIf"],["class","slds-file-selector slds-file-selector_files",4,"ngIf"],[3,"fieldname"],[1,"slds-pill_container","slds-size--1-of-1","slds-m-vertical--xxx-small"],[1,"slds-pill","slds-pill_link","slds-size--1-of-1"],[1,"slds-pill__icon_container"],["title","Account",1,"slds-icon_container","slds-icon-standard-account"],["divClass","","sprite","doctype","size","x-small",3,"icon"],["href","javascript:void(0);",1,"slds-pill__action"],[1,"slds-pill__label"],["title","Remove",1,"slds-button","slds-button_icon","slds-button_icon","slds-pill__remove",3,"click"],["icon","close"],[1,"slds-p-around--x-small","slds-grid","slds-grid_vertical-align-center","slds-grid--align-spread","slds-has-flexi-truncate"],[1,"slds-progress-bar"],[1,"slds-progress-bar__value",3,"ngStyle"],[1,"slds-text-align--right",2,"width","50px"],[1,"slds-file-selector","slds-file-selector_files"],[1,"slds-file-selector__dropzone",3,"system-drop-file"],["type","file",1,"slds-file-selector__input","slds-assistive-text",3,"id","click","change"],["fileupload",""],[1,"slds-file-selector__body"],[1,"slds-file-selector__button","slds-button","slds-button_neutral"],[3,"icon"],["label","LBL_UPLOAD_FILES"],[1,"slds-file-selector__text","slds-medium-show"],["label","LBL_OR"],["label","LBL_DROP_FILES"]],template:function(e,t){1&e&&(m.YNc(0,Te,1,2,"field-label",0),m.YNc(1,Fe,6,7,"field-generic-display",1),m.YNc(2,Ie,5,5,"div",2)),2&e&&(m.Q6J("ngIf",t.displayLabel),m.xp6(1),m.Q6J("ngIf",!t.isEditMode()),m.xp6(1),m.Q6J("ngIf",t.isEditable()&&t.isEditMode()))},dependencies:[i.mk,i.O5,i.PC,ne.q,ae.D,Ze.a,Z.J,Se.f,S.T,_._,A.M],encapsulation:2}),fieldModelAttachment})(),Ye=(()=>{class ModuleSpiceAttachments{}return ModuleSpiceAttachments.ɵfac=function(e){return new(e||ModuleSpiceAttachments)},ModuleSpiceAttachments.ɵmod=m.oAB({type:ModuleSpiceAttachments}),ModuleSpiceAttachments.ɵinj=m.cJS({imports:[i.ez,l.u5,a.ObjectFields,o.GlobalComponents,d.ObjectComponents,c.SystemComponents,n.o]}),ModuleSpiceAttachments})();("undefined"==typeof ngJitMode||ngJitMode)&&m.kYT(Ye,{declarations:[k,D,C,V,H,j,se,me,be,xe,Je],imports:[i.ez,l.u5,a.ObjectFields,o.GlobalComponents,d.ObjectComponents,c.SystemComponents,n.o]})}}]);