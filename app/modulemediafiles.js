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
"use strict";(self.webpackChunkcore=self.webpackChunkcore||[]).push([["src_modules_mediafiles_modulemediafiles_ts"],{49036:(e,t,i)=>{i.r(t),i.d(t,{ModuleMediaFiles:()=>Pe});var s=i(60177),l=i(84341),n=i(7745),a=i(12948),d=i(37328),r=i(70569),o=i(71341),c=i(21413),m=i(54438),h=i(345),g=i(21626),u=i(49722),f=i(53584),b=i(29994),p=i(83935),y=i(4921),I=i(41081),v=i(69904),M=i(50531);let F=(()=>{class mediafiles{constructor(e,t,i,s,l,n,a,d,r,o){this.sanitizer=e,this.http=t,this.backend=i,this.configurationService=s,this.session=l,this.metadata=n,this.footer=a,this.toast=d,this.language=r,this.modalservice=o,this.categoriesLoaded=!1,this.categories={},this.categoriesSorted=[]}_getImage(e,t=""){let i=new c.B;return this.backend.getRawRequest("module/MediaFiles/"+e+"/file"+(""!=t?"/":"")+t,{},null,{}).subscribe((e=>{let t=URL.createObjectURL(e);i.next(this.sanitizer.bypassSecurityTrustUrl(t)),i.complete()})),i.asObservable()}_getImageBase64(e){let t=new c.B;return this.backend.getRequest("module/MediaFiles/"+e+"/base64").subscribe((e=>{t.next(e),t.complete()})),t.asObservable()}getImageVariant(e,t){return this._getImage(e,t)}getImage(e){return this._getImage(e,"")}getImageBase64(e){return this._getImageBase64(e)}getImageThumb(e,t){return this._getImage(e,"th/"+t)}getImageSquare(e,t){return this._getImage(e,"sq/"+t)}getMediaFile(e=!1,t=!1,i){let s=new c.B;return e?this.uploadMediaFile([],t,i).subscribe((e=>{e&&(s.next(e),s.complete())})):this.pickMediaFile().subscribe((e=>{e.id?(s.next(e.id),s.complete()):!0===e.upload&&this.uploadMediaFile([],t,i).subscribe((e=>{e&&(s.next(e),s.complete())}))})),s.asObservable()}pickMediaFile(){let e=new c.B;return this.modalservice.openModal("MediaFilePicker").subscribe((t=>{t.instance.answer.subscribe((t=>{e.next(t),e.complete()}))})),e.asObservable()}uploadMediaFile(e,t=!1,i){let s=new c.B;return this.modalservice.openModal("MediaFileUploader").subscribe((l=>{l.instance.acceptFileTypes=e,l.instance.noMetaData=t,l.instance.category=i,l.instance.answer.subscribe((e=>{s.next(e),s.complete()}))})),s.asObservable()}static#e=this.ɵfac=function(e){return new(e||mediafiles)(m.KVO(h.up),m.KVO(g.Qq),m.KVO(u.H),m.KVO(f.i),m.KVO(b.d),m.KVO(p.yu),m.KVO(y.q),m.KVO(I.o),m.KVO(v.B),m.KVO(M.y))};static#t=this.ɵprov=m.jDH({token:mediafiles,factory:mediafiles.ɵfac})}return mediafiles})();function x(e,t){if(1&e){const e=m.RV6();m.j41(0,"img",2),m.bIt("click",(function(){m.eBV(e);const t=m.XpG();return m.Njj(t.openImagePreview())})),m.k0s()}if(2&e){const e=m.XpG();m.HbH(e.classImage),m.Y8G("src",e.imageUrl,m.B4B)("title",e.title)("alt",e.alttext)("ngStyle",e.styleImg)}}let G=(()=>{class MediaFileImage{constructor(e,t,i){this.mediafiles=e,this.elRef=t,this.modal=i,this.size=null,this.width=null,this.height=null,this.classImage="",this.classOuter="",this.align="",this.frameWidth=null,this.frameHeight=null,this.frameSize=null,this.displayInline=!1,this.title="",this.alttext="",this.dimensions={width:void 0,height:void 0},this.isFirstChange=!0,this.lastMediaId="",this.withFrameHeight=!0}ngOnChanges(){this.isFirstChange&&(this.isFirstChange=!1,this.variantStatic=this.variant),"mw"===this.variantStatic||"mwh"===this.variantStatic?(null!=this.width&&(this.dimensions.width=this.width),null!=this.height&&(this.dimensions.height=this.height),null===this.frameWidth&&(this.frameWidth=this.determineMaxWidthOfImage()),"mwh"===this.variantStatic&&null===this.frameHeight&&(this.frameHeight=this.determineMaxHeightOfImage()),"mw"===this.variantStatic&&(this.withFrameHeight=!1)):(null!=this.size&&(this.dimensions.height=this.dimensions.width=this.size),null===this.frameSize&&(this.frameSize=this.determineMaxWidthOfImage())),this.media_id&&(this.lastMediaId!==this.media_id?this.showImage():this.imageUrl="")}showImage(){let e;switch(this.variantStatic){case"mw":e=this.frameWidth;break;case"mwh":e=this.frameWidth+"/"+this.frameHeight;break;case"th":e=this.frameSize}this.mediafiles.getImageVariant(this.media_id,this.variantStatic+"/"+e).subscribe((e=>{this.imageUrl=e}))}get styleDisplay(){return this.displayInline?"inline-block":"block"}get styleOuter(){switch(this.align){case"left":return{"margin-left":0,"margin-right":"auto"};case"right":return{"margin-left":"auto","margin-right":0};case"center":return{"margin-left":"auto","margin-right":"auto"};default:return{}}}get styleImg(){let e={...this.dimensions};return this.withFrameHeight&&(e.position="absolute",e.top=e.left=e.bottom=e.right=0,e.margin="auto"),e}getWidthOfParent(){return Number(getComputedStyle(this.elRef.nativeElement.parentElement,null).width.replace(/px$/,""))-Number(getComputedStyle(this.elRef.nativeElement.parentElement,null).paddingLeft.replace(/px$/,""))-Number(getComputedStyle(this.elRef.nativeElement.parentElement,null).paddingRight.replace(/px$/,""))-Number(getComputedStyle(this.elRef.nativeElement.parentElement,null).borderLeftWidth.replace(/px$/,""))-Number(getComputedStyle(this.elRef.nativeElement.parentElement,null).borderRightWidth.replace(/px$/,""))}determineMaxWidthOfImage(){return Math.round(this.getWidthOfParent())}getHeightOfParent(){return Number(getComputedStyle(this.elRef.nativeElement.parentElement,null).height.replace(/px$/,""))-Number(getComputedStyle(this.elRef.nativeElement.parentElement,null).paddingTop.replace(/px$/,""))-Number(getComputedStyle(this.elRef.nativeElement.parentElement,null).paddingBottom.replace(/px$/,""))-Number(getComputedStyle(this.elRef.nativeElement.parentElement,null).borderTopWidth.replace(/px$/,""))-Number(getComputedStyle(this.elRef.nativeElement.parentElement,null).borderBottomWidth.replace(/px$/,""))}determineMaxHeightOfImage(){return Math.round(this.getHeightOfParent())}openImagePreview(){this.modal.openModal("SystemImagePreviewModal").subscribe((e=>{this.mediafiles.getImageBase64(this.media_id).subscribe((t=>{e.instance.imgtype=t.filetype,e.instance.imgsrc="data:"+t.filetype+";base64,"+t.img}))}))}static#e=this.ɵfac=function(e){return new(e||MediaFileImage)(m.rXU(F),m.rXU(m.aKT),m.rXU(M.y))};static#t=this.ɵcmp=m.VBU({type:MediaFileImage,selectors:[["media-file-image"]],inputs:{media_id:"media_id",variant:"variant",size:"size",width:"width",height:"height",classImage:"classImage",classOuter:"classOuter",align:"align",frameWidth:"frameWidth",frameHeight:"frameHeight",frameSize:"frameSize",displayInline:"displayInline",title:"title",alttext:"alttext"},features:[m.Jv_([F]),m.OA$],decls:2,vars:9,consts:[[1,"slds-is-relative",3,"ngClass","ngStyle"],["style","max-width:100%;max-height:100%",3,"src","title","alt","ngStyle","class","click",4,"ngIf"],[2,"max-width","100%","max-height","100%",3,"src","title","alt","ngStyle","click"]],template:function(e,t){1&e&&(m.j41(0,"span",0),m.DNE(1,x,1,7,"img",1),m.k0s()),2&e&&(m.xc7("maxwidth",t.frameWidth)("height",t.frameHeight)("display",t.styleDisplay),m.Y8G("ngClass",t.classOuter)("ngStyle",t.styleOuter),m.R7$(),m.Y8G("ngIf",t.imageUrl))},dependencies:[s.YU,s.bT,s.B3],styles:["\n\n\n\n\n\n\n\n\n\n\nimg[_ngcontent-%COMP%]:hover{cursor:pointer}"]})}return MediaFileImage})();var w=i(35911),_=i(75103),E=i(41731),k=i(82379),R=i(92462),U=i(71692),X=i(33778),S=i(6815),j=i(58461),V=i(32062),O=i(40713),$=i(25028),Y=i(88418),B=i(83524),C=i(23855),N=i(29895),D=i(25863),L=i(67469);function z(e,t){1&e&&m.nrm(0,"img",14)}function T(e,t){if(1&e&&m.nrm(0,"img",15),2&e){const e=m.XpG();m.Y8G("src",e.thumbnail,m.B4B)}}function P(e,t){1&e&&m.nrm(0,"object-action-menu",16)}let W=(()=>{class MediaFilesTile{constructor(e,t,i,s,l,n){this.metadata=e,this.model=t,this.view=i,this.sanitizer=s,this.modal=l,this.mediafiles=n,this.selectbox=!1,this.getConfig()}ngOnInit(){this.initializeView(),this.initializeModel()}initializeView(){this.view.isEditable=!1,this.view.displayLabels=!1,1==this.selectbox&&(this.view.displayLinks=!1)}getConfig(){let e=this.metadata.getComponentConfig("MediaFilesTile","MediaFiles");this.fieldset=e.fieldset,this.actionset=e.actionset}initializeModel(){this.model.module="MediaFiles",this.model.id=this.data.id,this.model.setData(this.data)}get thumbnail(){let e=this.model.getField("thumbnail");return!!e&&this.sanitizer.bypassSecurityTrustResourceUrl("data:"+this.model.getField("filetype")+";base64,"+e)}expand(){this.modal.openModal("SystemImagePreviewModal").subscribe((e=>{e.instance.imgname=this.model.getFieldValue("name"),e.instance.imgtype=this.model.getFieldValue("filetype"),this.mediafiles.getImageBase64(this.model.id).subscribe((t=>{e.instance.imgsrc="data:"+this.model.getFieldValue("filetype")+";base64,"+t.img}))}))}static#e=this.ɵfac=function(e){return new(e||MediaFilesTile)(m.rXU(p.yu),m.rXU(w.g),m.rXU(E.U),m.rXU(h.up),m.rXU(M.y),m.rXU(F))};static#t=this.ɵcmp=m.VBU({type:MediaFilesTile,selectors:[["media-files-tile"]],inputs:{data:"data",selectbox:"selectbox"},features:[m.Jv_([F,w.g,E.U])],decls:15,vars:6,consts:[[1,"slds-p-around--small",2,"width","20rem"],[1,"slds-file","slds-file_card","slds-has-title"],[1,"slds-align--absolute-center",2,"height","165px","width","294px"],["src","./vendor/sldassets/images/placeholder-img@16x9.jpg",4,"ngIf"],["style","max-height: 100%;max-width: 100%;","alt","Description of the image",3,"src",4,"ngIf"],[1,"slds-file__title","slds-is-relative","slds-file__title_card"],[1,"slds-grid","slds-grid--vertical-align-center","slds-size--1-of-1"],[1,"slds-p-right--xx-small"],["size","x-small","divClass","",3,"filename","filemimetype"],[1,"slds-media__body","slds-grow","slds-truncate"],[3,"fieldset"],[1,"slds-button","slds-button_icon","slds-button_icon-border-filled","slds-button_icon-small","slds-m-horizontal--xx-small",3,"click"],["icon","expand","size","small"],["buttonsize","small",4,"ngIf"],["src","./vendor/sldassets/images/placeholder-img@16x9.jpg"],["alt","Description of the image",2,"max-height","100%","max-width","100%",3,"src"],["buttonsize","small"]],template:function(e,t){1&e&&(m.j41(0,"div",0)(1,"div",1)(2,"figure")(3,"div",2),m.DNE(4,z,1,0,"img",3)(5,T,1,1,"img",4),m.k0s(),m.j41(6,"figcaption",5)(7,"div",6)(8,"div",7),m.nrm(9,"system-file-icon",8),m.k0s(),m.j41(10,"div",9),m.nrm(11,"object-record-fieldset-horizontal-list",10),m.k0s(),m.j41(12,"button",11),m.bIt("click",(function(){return t.expand()})),m.nrm(13,"system-button-icon",12),m.k0s(),m.DNE(14,P,1,0,"object-action-menu",13),m.k0s()()()()()),2&e&&(m.R7$(4),m.Y8G("ngIf",!t.thumbnail),m.R7$(),m.Y8G("ngIf",t.thumbnail),m.R7$(4),m.Y8G("filename",t.model.getField("name"))("filemimetype",t.model.getField("filetype")),m.R7$(2),m.Y8G("fieldset",t.fieldset),m.R7$(3),m.Y8G("ngIf",!t.selectbox))},dependencies:[s.bT,C.P,N.b,D.t,L.z],encapsulation:2,changeDetection:0})}return MediaFilesTile})();function H(e,t){if(1&e){const e=m.RV6();m.j41(0,"media-files-tile",12),m.bIt("click",(function(){const t=m.eBV(e).$implicit,i=m.XpG();return m.Njj(i.pick(t.id))})),m.k0s()}if(2&e){const e=t.$implicit;m.Y8G("data",e)("selectbox",!0)}}function K(e,t){1&e&&(m.j41(0,"div",13)(1,"system-illustration-no-records"),m.nrm(2,"system-label",14),m.k0s()())}let A=(()=>{class MediaFilePicker extends k.d{constructor(e,t,i,s,l,n,a){super(e,t,i,s,l,n),this.language=e,this.modellist=t,this.metadata=i,this.modelutilities=s,this.model=l,this.layout=n,this.elementRef=a,this.module="MediaFiles",this.answer=new m.bkB}get containerStyle(){let e=this.elementRef.nativeElement.getBoundingClientRect(),t=Math.floor((e.width-10)/320),i=Math.floor((e.width-10-320*t)/2);return{"padding-left":i+"px","padding-right":i+"px"}}pick(e){this.answer.emit({id:e}),this.self.destroy()}upload(){this.metadata.checkModuleAcl("MediaFiles","create")&&(this.model.module="MediaFiles",this.model.id=void 0,this.model.initialize(),this.model.addModel().subscribe((e=>{this.answer.emit({id:this.model.id}),this.self.destroy()})))}static#e=this.ɵfac=function(e){return new(e||MediaFilePicker)(m.rXU(v.B),m.rXU(_.K),m.rXU(p.yu),m.rXU(R.g),m.rXU(w.g),m.rXU(U.Z),m.rXU(m.aKT))};static#t=this.ɵcmp=m.VBU({type:MediaFilePicker,selectors:[["media-file-picker"]],outputs:{answer:"answer"},features:[m.Jv_([E.U,_.K,w.g]),m.Vt3],decls:17,vars:7,consts:[["size","large"],[3,"close"],["margin","none",3,"grow"],[1,"slds-height_full"],[1,"slds-is-relative",3,"ngStyle"],[1,"slds-grid","slds-wrap",3,"ngStyle"],[3,"data","selectbox","click",4,"ngFor","ngForOf"],["class","slds-align--absolute-center","style","height: calc(100% - 35px)",4,"ngIf"],[1,"slds-button","slds-button--neutral",3,"click"],["label","LBL_CANCEL"],[1,"slds-button","slds-button--brand",3,"disabled","click"],["label","LBL_UPLOAD_NEW_FILE"],[3,"data","selectbox","click"],[1,"slds-align--absolute-center",2,"height","calc(100% - 35px)"],["label","MSG_NO_RECORDS_FOUND"]],template:function(e,t){1&e&&(m.j41(0,"system-modal",0)(1,"system-modal-header",1),m.bIt("close",(function(){return t.closePopup()})),m.EFF(2),m.k0s(),m.j41(3,"system-modal-content",2)(4,"div",3),m.nrm(5,"object-modal-module-lookup-header"),m.j41(6,"div",4)(7,"div",5),m.DNE(8,H,1,2,"media-files-tile",6),m.k0s(),m.DNE(9,K,3,0,"div",7),m.nrm(10,"object-modal-module-lookup-aggregates"),m.k0s()()(),m.j41(11,"system-modal-footer")(12,"button",8),m.bIt("click",(function(){return t.closePopup()})),m.nrm(13,"system-label",9),m.k0s(),m.j41(14,"button",10),m.bIt("click",(function(){return t.upload()})),m.nrm(15,"system-label",11),m.EFF(16," …"),m.k0s()()()),2&e&&(m.R7$(2),m.JRh(t.language.getModuleCombinedLabel("LBL_SEARCH",t.modellist.module)),m.R7$(),m.Y8G("grow",!0),m.R7$(3),m.Y8G("ngStyle",t.contentStyle()),m.R7$(),m.Y8G("ngStyle",t.containerStyle),m.R7$(),m.Y8G("ngForOf",t.modellist.listData.list),m.R7$(),m.Y8G("ngIf",!t.modellist.isLoading&&0==t.modellist.listData.totalcount),m.R7$(5),m.Y8G("disabled",!t.metadata.checkModuleAcl("MediaFiles","create")))},dependencies:[s.Sq,s.bT,s.B3,X.W,S.H,j.b,V.W,O.D,$.I,Y.Q,B.C,W],encapsulation:2})}return MediaFilePicker})();var q=i(28114),J=i(3719),Q=i(37804);function Z(e,t){if(1&e&&(m.j41(0,"div",8),m.nrm(1,"object-record-fieldset",9),m.k0s()),2&e){const e=m.XpG();m.R7$(),m.Y8G("fieldset",e.fieldsetId)}}function ee(e,t){if(1&e){const e=m.RV6();m.j41(0,"div")(1,"button",10),m.bIt("click",(function(){m.eBV(e);const t=m.XpG();return m.Njj(t.save())})),m.nrm(2,"system-label",11),m.k0s(),m.j41(3,"button",12),m.bIt("click",(function(){m.eBV(e);const t=m.XpG();return m.Njj(t.cancel())})),m.nrm(4,"system-label",13),m.k0s()()}if(2&e){const e=m.XpG();m.R7$(),m.Y8G("disabled",!e.canSave)}}function te(e,t){if(1&e&&(m.j41(0,"div")(1,"system-progress-bar",14),m.nrm(2,"system-label",15),m.k0s()()),2&e){const e=m.XpG();m.R7$(),m.Y8G("progress",e.theProgress)}}const ie=(e,t)=>({"slds-size--1-of-1":e,"slds-size--1-of-2":t});let se=(()=>{class MediaFileUploader{constructor(e,t,i,s,l,n,a){this.mediafiles=e,this.metadata=t,this.backend=i,this.lang=s,this.toast=l,this.model=n,this.view=a,this.theProgress=0,this.noMetaData=!1,this.answer=null,this.answerSubject=null,this.isSaving=!1,this.isEditing=!0,this.answerSubject=new c.B,this.answer=this.answerSubject.asObservable(),this.model.module="MediaFiles",this.model.id=this.model.generateGuid(),this.model.initialize(),this.model.setField("id",this.model.id),this.view.isEditable=!0,this.view.setEditMode();let d=this.metadata.getComponentConfig("MediaFileUploader","MediaFiles");this.fieldsetId=d.fieldset}cancel(){this.model.cancelEdit(),this.answerSubject.next(!1),this.answerSubject.complete(),this.self.destroy()}get canSave(){return this.mediaMetaData&&!this.isSaving}get image(){let e=this.model.getField("file");return e?this.model.getField("filetype")+"|"+e:void 0}set image(e){let t=e.indexOf("|");this.model.setField("file",e.substring(t+1)),this.mediaMetaData=this.inputMedia.mediaMetaData,this.model.getField("name")||this.model.setField("name",this.mediaMetaData.filename.replace(/\.[^\.]+$/,"").replace(/_/," ")),this.model.setField("filetype",e.substring(0,t))}save(){this.canSave&&(this.isSaving=!0,this.model.savingProgress.subscribe((e=>this.theProgress=e)),this.model.validate()?(this.view.setViewMode(),this.isEditing=!1,this.model.save().subscribe((()=>{this.answerSubject.next(this.model.id),this.answerSubject.complete(),window.setTimeout((()=>this.self.destroy()),2e3)}))):this.isSaving=!1)}onModalEscX(){return this.isSaving||this.cancel(),!1}static#e=this.ɵfac=function(e){return new(e||MediaFileUploader)(m.rXU(F),m.rXU(p.yu),m.rXU(u.H),m.rXU(v.B),m.rXU(I.o),m.rXU(w.g),m.rXU(E.U))};static#t=this.ɵcmp=m.VBU({type:MediaFileUploader,selectors:[["media-file-uploader"]],viewQuery:function(e,t){if(1&e&&m.GBs(q.A,5),2&e){let e;m.mGM(e=m.lsd())&&(t.inputMedia=e.first)}},features:[m.Jv_([F,w.g,E.U])],decls:11,vars:8,consts:[["size","large"],[3,"close"],["label","LBL_NEW_IMAGE"],[1,"slds-grid"],[1,"slds-box","slds-box_x-small","slds-size--1-of-2",3,"ngClass"],[1,"slds-height_full",3,"ngModel","ngModelChange"],["class","slds-p-left--medium slds-size--1-of-2",4,"ngIf"],[4,"ngIf"],[1,"slds-p-left--medium","slds-size--1-of-2"],["direction","vertical",3,"fieldset"],[1,"slds-button","slds-button--brand",3,"disabled","click"],["label","LBL_SAVE"],[1,"slds-button","slds-button--neutral",3,"click"],["label","LBL_CANCEL"],[3,"progress"],["label","LBL_UPLOADING_MEDIA_FILE"]],template:function(e,t){1&e&&(m.j41(0,"system-modal",0)(1,"system-modal-header",1),m.bIt("close",(function(){return t.cancel()})),m.nrm(2,"system-label",2),m.k0s(),m.j41(3,"system-modal-content")(4,"div",3)(5,"div",4)(6,"system-input-media",5),m.mxI("ngModelChange",(function(e){return m.DH7(t.image,e)||(t.image=e),e})),m.k0s()(),m.DNE(7,Z,2,1,"div",6),m.k0s()(),m.j41(8,"system-modal-footer"),m.DNE(9,ee,5,1,"div",7)(10,te,3,1,"div",7),m.k0s()()),2&e&&(m.R7$(5),m.Y8G("ngClass",m.l_i(5,ie,t.noMetaData,!t.noMetaData)),m.R7$(),m.R50("ngModel",t.image),m.R7$(),m.Y8G("ngIf",!t.noMetaData),m.R7$(2),m.Y8G("ngIf",!t.isSaving),m.R7$(),m.Y8G("ngIf",t.isSaving))},dependencies:[s.YU,s.bT,l.BC,l.vS,J.D,V.W,O.D,$.I,Y.Q,B.C,Q.Y,q.A],encapsulation:2})}return MediaFileUploader})();var le=i(64914),ne=i(57363),ae=i(28933);function de(e,t){if(1&e&&m.nrm(0,"media-files-tile",4),2&e){const e=t.$implicit;m.Y8G("data",e)}}function re(e,t){1&e&&(m.j41(0,"div",5)(1,"system-illustration-no-records"),m.nrm(2,"system-label",6),m.k0s()())}let oe=(()=>{class MediaFilesList extends le.Y{constructor(e,t,i,s,l,n,a,d,r,o){super(e,t,i,s,l,n,a,d),this.router=e,this.cdRef=t,this.metadata=i,this.modellist=s,this.language=l,this.injector=n,this.modal=a,this.layout=d,this.renderer=r,this.elementRef=o,this.resizeHandler=this.renderer.listen("window","resize",(()=>this.onResize()))}ngOnDestroy(){super.ngOnDestroy(),this.resizeHandler()}onResize(){this.cdRef.detectChanges()}get containerStyle(){let e=this.elementRef.nativeElement.getBoundingClientRect(),t=Math.floor((e.width-10)/320),i=Math.floor((e.width-10-320*t)/2);return{"padding-left":i+"px","padding-right":i+"px"}}static#e=this.ɵfac=function(e){return new(e||MediaFilesList)(m.rXU(ne.Ix),m.rXU(m.gRc),m.rXU(p.yu),m.rXU(_.K),m.rXU(v.B),m.rXU(m.zZn),m.rXU(M.y),m.rXU(U.Z),m.rXU(m.sFG),m.rXU(m.aKT))};static#t=this.ɵcmp=m.VBU({type:MediaFilesList,selectors:[["media-files-list"]],features:[m.Vt3],decls:4,vars:3,consts:[[2,"min-height","250px",3,"system-to-bottom"],[1,"slds-grid","slds-wrap",3,"ngStyle"],[3,"data",4,"ngFor","ngForOf"],["class","slds-align--absolute-center","style","height: calc(100% - 35px)",4,"ngIf"],[3,"data"],[1,"slds-align--absolute-center",2,"height","calc(100% - 35px)"],["label","MSG_NO_RECORDS_FOUND"]],template:function(e,t){1&e&&(m.j41(0,"div",0),m.bIt("system-to-bottom",(function(){return t.onScroll()})),m.j41(1,"div",1),m.DNE(2,de,1,1,"media-files-tile",2),m.k0s(),m.DNE(3,re,3,0,"div",3),m.k0s()),2&e&&(m.R7$(),m.Y8G("ngStyle",t.containerStyle),m.R7$(),m.Y8G("ngForOf",t.modellist.listData.list),m.R7$(),m.Y8G("ngIf",!t.modellist.isLoading&&0==t.modellist.listData.totalcount))},dependencies:[s.Sq,s.bT,s.B3,j.b,V.W,ae.b,W],encapsulation:2,changeDetection:0})}return MediaFilesList})();var ce=i(13921),me=i(766),he=i(66935);function ge(e,t){if(1&e&&m.nrm(0,"field-label",3),2&e){const e=m.XpG();m.Y8G("fieldname",e.fieldname)("fieldconfig",e.fieldconfig)}}function ue(e,t){if(1&e&&m.nrm(0,"img",6),2&e){const e=m.XpG(2);m.Y8G("src","data:image/jpg;base64,"+e.value,m.B4B)}}function fe(e,t){if(1&e&&(m.j41(0,"field-generic-display",4),m.DNE(1,ue,1,1,"img",5),m.k0s()),2&e){const e=m.XpG();m.Y8G("fielddisplayclass",e.fielddisplayclass)("editable",e.isEditable())("fieldconfig",e.fieldconfig)("title",e.value)("fieldid",e.fieldid),m.R7$(),m.Y8G("ngIf",e.value)}}function be(e,t){if(1&e){const e=m.RV6();m.j41(0,"div",7)(1,"system-input-media",8),m.mxI("ngModelChange",(function(t){m.eBV(e);const i=m.XpG();return m.DH7(i.value,t)||(i.value=t),m.Njj(t)})),m.k0s()()}if(2&e){const e=m.XpG();m.Y8G("ngClass",e.css_classes),m.R7$(),m.R50("ngModel",e.value),m.Y8G("mimetype","image/jpeg")}}let pe=(()=>{class fieldMediaFilesImage extends ce.s{constructor(e,t,i,s,l,n,a){super(e,i,s,l,n),this.model=e,this.modal=t,this.view=i,this.language=s,this.metadata=l,this.router=n,this.mediafiles=a,this.initialize()}get value(){return this._value}set value(e){let t={};t.file=e,t.filetype=this.systemInputMedia.mediaMetaData.mimetype,this.model.getField("name")?this._value||this.modal.prompt("confirm",this.language.getLabel("MSG_OVERWRITE_FILENAME","","long"),this.language.getLabel("MSG_OVERWRITE_FILENAME")).subscribe((e=>{e&&(t.name=this.systemInputMedia.mediaMetaData.filename),this.model.setFields(t)})):(t.name=this.systemInputMedia.mediaMetaData.filename,this.model.setFields(t)),this._value=e}initialize(){this.model.isNew||(this.loadImage(),this.subscriptions.add(this.model.canceledit$.subscribe((e=>{this._value=null,this.loadImage()}))))}loadImage(){this.mediafiles.getImageBase64(this.model.id).subscribe((e=>{this._value=e.img}))}static#e=this.ɵfac=function(e){return new(e||fieldMediaFilesImage)(m.rXU(w.g),m.rXU(M.y),m.rXU(E.U),m.rXU(v.B),m.rXU(p.yu),m.rXU(ne.Ix),m.rXU(F))};static#t=this.ɵcmp=m.VBU({type:fieldMediaFilesImage,selectors:[["ng-component"]],viewQuery:function(e,t){if(1&e&&m.GBs(q.A,5),2&e){let e;m.mGM(e=m.lsd())&&(t.systemInputMedia=e.first)}},features:[m.Jv_([F]),m.Vt3],decls:3,vars:3,consts:[[3,"fieldname","fieldconfig",4,"ngIf"],[3,"fielddisplayclass","editable","fieldconfig","title","fieldid",4,"ngIf"],["class","slds-form-element__control slds-m-vertical--xx-small",3,"ngClass",4,"ngIf"],[3,"fieldname","fieldconfig"],[3,"fielddisplayclass","editable","fieldconfig","title","fieldid"],[3,"src",4,"ngIf"],[3,"src"],[1,"slds-form-element__control","slds-m-vertical--xx-small",3,"ngClass"],[1,"slds-height_full",3,"ngModel","mimetype","ngModelChange"]],template:function(e,t){1&e&&m.DNE(0,ge,1,2,"field-label",0)(1,fe,2,6,"field-generic-display",1)(2,be,2,3,"div",2),2&e&&(m.Y8G("ngIf",t.displayLabel),m.R7$(),m.Y8G("ngIf",!t.isEditMode()),m.R7$(),m.Y8G("ngIf",t.isEditable()&&t.isEditMode()))},dependencies:[s.YU,s.bT,l.BC,l.vS,me.b,he.K,q.A],encapsulation:2})}return fieldMediaFilesImage})();var ye=i(48717);const Ie=["imgFrame"];function ve(e,t){1&e&&m.nrm(0,"system-spinner",5)}function Me(e,t){if(1&e){const e=m.RV6();m.j41(0,"system-input-media",6),m.mxI("ngModelChange",(function(t){m.eBV(e);const i=m.XpG(2);return m.DH7(i.imageUrlOriginal,t)||(i.imageUrlOriginal=t),m.Njj(t)})),m.k0s()}if(2&e){const e=m.XpG(2);m.R50("ngModel",e.imageUrlOriginal)}}function Fe(e,t){if(1&e&&(m.qex(0),m.DNE(1,ve,1,0,"system-spinner",3)(2,Me,1,1,"system-input-media",4),m.bVm()),2&e){const e=m.XpG();m.R7$(),m.Y8G("ngIf",e.isLoadingOriginal),m.R7$(),m.Y8G("ngIf",!e.isLoadingOriginal)}}function xe(e,t){if(1&e&&m.nrm(0,"img",14),2&e){const e=m.XpG(3);m.Y8G("src",e.imageUrlVariant,m.B4B)}}function Ge(e,t){if(1&e){const e=m.RV6();m.qex(0),m.DNE(1,xe,1,1,"img",10),m.j41(2,"button",11),m.bIt("click",(function(){m.eBV(e);const t=m.XpG(2);return m.Njj(t.openLightbox())})),m.nrm(3,"system-button-icon",12),m.k0s(),m.j41(4,"button",13),m.bIt("click",(function(){m.eBV(e);const t=m.XpG(2);return m.Njj(t.setEditMode())})),m.nrm(5,"system-button-icon",12),m.k0s(),m.bVm()}if(2&e){const e=m.XpG(2);m.R7$(),m.Y8G("ngIf",e.imageUrlVariant),m.R7$(2),m.Y8G("icon","expand"),m.R7$(2),m.Y8G("icon","edit")}}function we(e,t){1&e&&m.nrm(0,"system-spinner",5)}function _e(e,t){if(1&e&&(m.j41(0,"div",7,8)(2,"div",9),m.DNE(3,Ge,6,3,"ng-container",1)(4,we,1,0,"system-spinner",3),m.k0s()()),2&e){const e=m.XpG();m.R7$(3),m.Y8G("ngIf",!e.isLoadingVariant),m.R7$(),m.Y8G("ngIf",e.isLoadingVariant)}}let Ee=(()=>{class fieldMediaFile extends ce.s{constructor(e,t,i,s,l,n,a,d,r,o,c){super(e,t,i,s,l),this.model=e,this.view=t,this.language=i,this.metadata=s,this.router=l,this.elementRef=n,this.renderer=a,this.mediafiles=d,this.backend=r,this.elRef=o,this.modalservice=c,this.isLoadingVariant=!1,this.isLoadingOriginal=!1}ngAfterViewInit(){this.widthOfImgFrame=this.getWidthOfImgFrame(),this.heightOfImgFrame=this.getHeightOfImgFrame(),this.view.mode$.subscribe((e=>{this.currentViewMode!==e&&("view"===e&&this.loadImageVariant(),"edit"===e&&this.loadImageOriginal(),this.currentViewMode=e)}))}loadImageVariant(){this.imageUrlVariant="",this.model.isNew||(this.isLoadingVariant=!0,this.mediafiles.getImageVariant(this.model.id,"mwh/"+this.widthOfImgFrame+"/"+this.heightOfImgFrame).subscribe((e=>{this.imageUrlVariant=e,this.isLoadingVariant=!1})))}loadImageOriginal(){this.imageUrlOriginal="",this.model.isNew||(this.isLoadingOriginal=!0,this.mediafiles.getImage(this.model.id).subscribe((e=>{this.imageUrlOriginal=e,this.isLoadingOriginal=!1}),(e=>{this.isLoadingOriginal=!1})))}getWidthOfImgFrame(){return this.imgFrame?Math.ceil(Number(getComputedStyle(this.imgFrame.nativeElement,null).width.replace(/px$/,""))):0}getHeightOfImgFrame(){return this.imgFrame?Math.ceil(Number(getComputedStyle(this.imgFrame.nativeElement,null).height.replace(/px$/,""))):0}openLightbox(){this.modalservice.openModal("SystemImagePreviewModal",!0).subscribe((e=>{e.instance.imgname=this.model.getField("name"),e.instance.imgtype=this.model.getField("filetype"),this.mediafiles.getImage(this.model.id).subscribe((t=>{e.instance.imgsrc=t}))}))}mediaChange(e){e.isDirty&&(this.model.setField(this.fieldname,e.image),this.fileformat=e.metaData.fileformat,e.isImported&&this.fieldconfig.copyFilenameToFieldName&&e.metaData.filename&&!this.model.getField(this.fieldForName)&&this.model.setField(this.fieldForName,e.metaData.filename.replace(/\.[^\.]+$/,"").replace(/_/," ")))}get fieldForFileformat(){return this.fieldconfig.fieldForFileformat?this.fieldconfig.fieldForFileformat:"filetype"}get fieldForName(){return this.fieldconfig.fieldForName?this.fieldconfig.fieldForName:"name"}set fileformat(e){this.model.setField(this.fieldForFileformat,e)}get fileformat(){return this.model.getField(this.fieldForFileformat)}static#e=this.ɵfac=function(e){return new(e||fieldMediaFile)(m.rXU(w.g),m.rXU(E.U),m.rXU(v.B),m.rXU(p.yu),m.rXU(ne.Ix),m.rXU(m.aKT),m.rXU(m.sFG),m.rXU(F),m.rXU(u.H),m.rXU(m.aKT),m.rXU(M.y))};static#t=this.ɵcmp=m.VBU({type:fieldMediaFile,selectors:[["field-media-file"]],viewQuery:function(e,t){if(1&e&&m.GBs(Ie,5),2&e){let e;m.mGM(e=m.lsd())&&(t.imgFrame=e.first)}},features:[m.Jv_([F]),m.Vt3],decls:3,vars:3,consts:[[2,"margin-right","-0.75rem","text-align","center","height","400px",3,"ngClass"],[4,"ngIf"],["class","slds-grid slds-grid--vertical","style","height:100%",4,"ngIf"],["size","large","class","spice-vertically-centered",4,"ngIf"],["style","height:100%",3,"ngModel","ngModelChange",4,"ngIf"],["size","large",1,"spice-vertically-centered"],[2,"height","100%",3,"ngModel","ngModelChange"],[1,"slds-grid","slds-grid--vertical",2,"height","100%"],["imgFrame",""],[1,"spice-vertically-centered",2,"max-height","100%","margin-right","auto","margin-left","auto"],["style","max-width:100%;max-height:100%",3,"src",4,"ngIf"],[1,"slds-button","slds-button_icon","slds-button_icon-container","slds-button_icon-border-filled","toLightbox",2,"position","absolute","top","0.25rem","right","0.25rem","margin","0",3,"click"],[3,"icon"],[1,"slds-button","slds-button_icon","slds-button_icon-container","slds-button_icon-border-filled","toLightbox",2,"position","absolute","bottom","0.25rem","right","0.25rem","margin","0",3,"click"],[2,"max-width","100%","max-height","100%",3,"src"]],template:function(e,t){1&e&&(m.j41(0,"div",0),m.DNE(1,Fe,3,2,"ng-container",1)(2,_e,5,2,"div",2),m.k0s()),2&e&&(m.Y8G("ngClass",t.fielddisplayclass+" format-"+t.fieldconfig.format),m.R7$(),m.Y8G("ngIf",t.isEditMode()),m.R7$(),m.Y8G("ngIf",!t.isEditMode()))},dependencies:[s.YU,s.bT,l.BC,l.vS,D.t,ye.P,q.A],encapsulation:2})}return fieldMediaFile})();const ke=["buttonToEnlargement"],Re=["buttonToPicker"];function Ue(e,t){if(1&e){const e=m.RV6();m.j41(0,"button",5,6),m.bIt("click",(function(){m.eBV(e);const t=m.XpG(2);return m.Njj(t.getImage())})),m.nrm(2,"system-button-icon",7),m.k0s()}if(2&e){const e=m.XpG(2);m.Y8G("disabled",!e.isEditMode()),m.R7$(2),m.Y8G("icon","image")}}function Xe(e,t){if(1&e&&m.nrm(0,"img",13),2&e){const e=m.XpG(3);m.Y8G("src",e.imageUrl,m.B4B)}}function Se(e,t){if(1&e){const e=m.RV6();m.j41(0,"button",8,9),m.bIt("click",(function(){m.eBV(e);const t=m.XpG(2);return m.Njj(t.openEnlarged())})),m.DNE(2,Xe,1,1,"img",10),m.j41(3,"span",11),m.nrm(4,"system-button-icon",12),m.k0s()()}if(2&e){const e=m.XpG(2);m.R7$(2),m.Y8G("ngIf",e.imageUrl),m.R7$(2),m.Y8G("icon","threedots")}}function je(e,t){if(1&e&&m.nrm(0,"img",20),2&e){const e=m.XpG(3);m.Y8G("src",e.imageUrlEnlarged,m.B4B)}}function Ve(e,t){if(1&e){const e=m.RV6();m.j41(0,"button",21),m.bIt("click",(function(){m.eBV(e);const t=m.XpG(3);return m.Njj(t.clearField4button())})),m.nrm(1,"system-button-icon",7),m.k0s()}2&e&&(m.R7$(),m.Y8G("icon","delete"))}function Oe(e,t){if(1&e){const e=m.RV6();m.j41(0,"div",14),m.DNE(1,je,1,1,"img",15),m.j41(2,"button",16,17),m.bIt("click",(function(){m.eBV(e);const t=m.XpG(2);return m.Njj(t.closeEnlarged())})),m.nrm(4,"system-button-icon",18),m.k0s(),m.DNE(5,Ve,2,1,"button",19),m.EFF(6),m.k0s()}if(2&e){const e=m.sdS(3),t=m.XpG(2);m.R7$(),m.Y8G("ngIf",t.imageUrlEnlarged),m.R7$(3),m.Y8G("icon","close")("size","small"),m.R7$(),m.Y8G("ngIf",t.isEditMode()),m.R7$(),m.SpI(" ",e.focus()," ")}}function $e(e,t){if(1&e&&(m.qex(0),m.DNE(1,Ue,3,2,"button",2)(2,Se,5,2,"button",3)(3,Oe,7,5,"div",4),m.bVm()),2&e){const e=m.XpG();m.R7$(),m.Y8G("ngIf",e.fieldIsEmpty),m.R7$(),m.Y8G("ngIf",!e.fieldIsEmpty),m.R7$(),m.Y8G("ngIf",e.enlarged)}}function Ye(e,t){if(1&e&&m.nrm(0,"img",24),2&e){const e=m.XpG(2);m.Y8G("src",e.imageUrl,m.B4B)}}function Be(e,t){if(1&e){const e=m.RV6();m.j41(0,"button",27,6),m.bIt("click",(function(){m.eBV(e);const t=m.XpG(4);return m.Njj(t.getImage())})),m.nrm(2,"system-button-icon",7),m.k0s()}if(2&e){const e=m.XpG(4);m.Y8G("disabled",!e.isEditMode()),m.R7$(2),m.Y8G("icon","image")}}function Ce(e,t){if(1&e){const e=m.RV6();m.j41(0,"div",28)(1,"button",29),m.bIt("click",(function(){m.eBV(e);const t=m.XpG(4);return m.Njj(t.clearField4image())})),m.nrm(2,"system-button-icon",7),m.k0s()()}2&e&&(m.R7$(2),m.Y8G("icon","delete"))}function Ne(e,t){if(1&e&&(m.qex(0),m.DNE(1,Be,3,2,"button",25)(2,Ce,3,1,"div",26),m.bVm()),2&e){const e=m.XpG(3);m.R7$(),m.Y8G("ngIf",e.fieldIsEmpty),m.R7$(),m.Y8G("ngIf",!e.fieldIsEmpty)}}function De(e,t){if(1&e){const e=m.RV6();m.qex(0),m.j41(1,"button",30),m.bIt("click",(function(){m.eBV(e);const t=m.XpG(3);return m.Njj(t.setEditMode())})),m.nrm(2,"system-button-icon",7),m.k0s(),m.bVm()}2&e&&(m.R7$(2),m.Y8G("icon","edit"))}function Le(e,t){if(1&e&&(m.qex(0),m.DNE(1,Ne,3,2,"ng-container",1)(2,De,3,1,"ng-container",1),m.bVm()),2&e){const e=m.XpG(2);m.R7$(),m.Y8G("ngIf",e.isEditMode()),m.R7$(),m.Y8G("ngIf",!e.isEditMode())}}function ze(e,t){if(1&e&&(m.qex(0),m.j41(1,"div",22),m.DNE(2,Ye,1,1,"img",23)(3,Le,3,2,"ng-container",1),m.k0s(),m.bVm()),2&e){const e=m.XpG();m.R7$(),m.Y8G("ngStyle",e.imageStyle),m.R7$(),m.Y8G("ngIf",!e.fieldIsEmpty&&e.imageUrl),m.R7$(),m.Y8G("ngIf",!e.model.isLoading)}}let Te=(()=>{class fieldMediaFileImage extends ce.s{constructor(e,t,i,s,l,n,a,d,r,o){super(e,t,i,s,l),this.model=e,this.view=t,this.language=i,this.metadata=s,this.router=l,this.elementRef=n,this.renderer=a,this.mediafiles=d,this.backend=r,this.elRef=o,this.enlarged=!1,this.fieldIsEmpty=!0,this.lastValue="",this.height=""}ngOnInit(){"image"!==this.fieldconfig.format&&(this.fieldconfig.format="button")}ngAfterViewInit(){this.size1rem=this.getSize1rem(),this.thumbSize=2*this.size1rem-2,this.widthOfParent=this.getWidthOfParent(),this.fieldconfig.height&&(this.height="calc("+this.fieldconfig.height+" - 2px - 0.5rem )"),this.model.data$.subscribe((()=>{this.afterLoadingModel()}))}afterLoadingModel(){this.lastValue=this.model.getField(this.fieldname),this.loadImages(),this.model.data$.subscribe((()=>{this.model.getField(this.fieldname)!==this.lastValue&&(this.lastValue=this.model.getField(this.fieldname),this.loadImages())}))}onClick(e){this.elementRef.nativeElement.contains(e.target)||(this.enlarged=!1)}openEnlarged(){this.unsubscribeClickListener=this.renderer.listen("document","click",(e=>this.onClick(e))),this.enlarged=!0}closeEnlarged(){this.enlarged=!1,this.buttonToEnlargement&&this.buttonToEnlargement.nativeElement.focus(),this.unsubscribeClickListener()}loadImages(){this.model.getField(this.fieldname)?(this.fieldIsEmpty=!1,"button"===this.fieldconfig.format?(this.mediafiles.getImageVariant(this.model.getField(this.fieldname),"th/"+this.thumbSize).subscribe((e=>{this.imageUrl=e})),this.mediafiles.getImageVariant(this.model.getField(this.fieldname),"th/200").subscribe((e=>{this.imageUrlEnlarged=e}))):this.mediafiles.getImageVariant(this.model.getField(this.fieldname),"mw/"+this.determineWidthOfImage()).subscribe((e=>{this.imageUrl=e}))):this.fieldIsEmpty=!0}clearField4button(){this.imageUrl=this.imageUrlEnlarged=this.value="",this.enlarged=!1,this.buttonToPicker&&this.buttonToPicker.nativeElement.focus(),this.fieldIsEmpty=!0}clearField4image(){this.imageUrl="",this.model.setField(this.fieldname,""),this.fieldIsEmpty=!0}getImage(){this.mediafiles.getMediaFile(this.fieldconfig.noImagePicker||!1,this.fieldconfig.noMetaData||!1,this.fieldconfig.category).subscribe((e=>{e&&(this.value=e,this.loadImages())}))}editImage(){}getSize1rem(){return Math.ceil(Number(getComputedStyle(document.documentElement,null).fontSize.replace(/px$/,"")))}getWidthOfParent(){return Number(getComputedStyle(this.elRef.nativeElement.parentElement.parentElement,null).width.replace(/px$/,""))-Number(getComputedStyle(this.elRef.nativeElement.parentElement.parentElement,null).paddingLeft.replace(/px$/,""))-Number(getComputedStyle(this.elRef.nativeElement.parentElement.parentElement,null).paddingRight.replace(/px$/,""))}determineWidthOfImage(){return Math.round(this.widthOfParent)}get imageStyle(){return{height:this.height}}setEditMode(){this.isEditable()&&(this.model.startEdit(),this.view.setEditMode(this.fieldid))}isEditable(){return this.getStati(this.fieldname).editable&&!this.getStati(this.fieldname).readonly&&!this.getStati(this.fieldname).disabled&&!this.getStati(this.fieldname).hidden}ngOnDestroy(){this.unsubscribeClickListener&&this.unsubscribeClickListener(),super.ngOnDestroy()}static#e=this.ɵfac=function(e){return new(e||fieldMediaFileImage)(m.rXU(w.g),m.rXU(E.U),m.rXU(v.B),m.rXU(p.yu),m.rXU(ne.Ix),m.rXU(m.aKT),m.rXU(m.sFG),m.rXU(F),m.rXU(u.H),m.rXU(m.aKT))};static#t=this.ɵcmp=m.VBU({type:fieldMediaFileImage,selectors:[["field-media-file-image"]],viewQuery:function(e,t){if(1&e&&(m.GBs(ke,7),m.GBs(Re,7)),2&e){let e;m.mGM(e=m.lsd())&&(t.buttonToEnlargement=e.first),m.mGM(e=m.lsd())&&(t.buttonToPicker=e.first)}},features:[m.Jv_([F]),m.Vt3],decls:3,vars:3,consts:[[1,"slds-is-relative",3,"ngClass"],[4,"ngIf"],["class","slds-button slds-button_icon slds-button_icon-container slds-button_icon-border-filled",3,"disabled","click",4,"ngIf"],["class","slds-button slds-button slds-button_icon slds-button_icon-border-filled slds-button_icon-container","style","width:4rem",3,"click",4,"ngIf"],["class","slds-is-absolute","style","width:160px; height:160px; left: calc(50% - 80px); top: calc(50% - 80px); z-index: 1; background-color: #ccc; border-radius:0.25rem; background-color: #fdfdfd; box-shadow: 0 2px 3px 0 rgba(0,0,0,.16); border: 1px solid #d8dde6",4,"ngIf"],[1,"slds-button","slds-button_icon","slds-button_icon-container","slds-button_icon-border-filled",3,"disabled","click"],["buttonToPicker",""],[3,"icon"],[1,"slds-button","slds-button","slds-button_icon","slds-button_icon-border-filled","slds-button_icon-container",2,"width","4rem",3,"click"],["buttonToEnlargement",""],["class","imgInButton","style","border-radius: 0.25rem 0 0 0.25rem; padding: 1px 0 1px 1px; height: calc(2rem - 2px); width: calc(2rem - 1px)",3,"src",4,"ngIf"],[1,"slds-text-align_center"],[2,"width","calc(2rem - 2px)",3,"icon"],[1,"imgInButton",2,"border-radius","0.25rem 0 0 0.25rem","padding","1px 0 1px 1px","height","calc(2rem - 2px)","width","calc(2rem - 1px)",3,"src"],[1,"slds-is-absolute",2,"width","160px","height","160px","left","calc(50% - 80px)","top","calc(50% - 80px)","z-index","1","background-color","#ccc","border-radius","0.25rem","background-color","#fdfdfd","box-shadow","0 2px 3px 0 rgba(0,0,0,.16)","border","1px solid #d8dde6"],["class","slds-image","style","border: 1px solid #999","width","160","height","160",3,"src",4,"ngIf"],["title","Close",1,"slds-button","slds-button_icon","slds-is-absolute",2,"top","0.25rem","right","0.25rem","cursor","pointer","margin","0","filter","drop-shadow( 0px 0px 3px #fff)",3,"click"],["closebutton",""],[3,"icon","size"],["class","slds-button slds-button_icon slds-button_icon-container slds-button_icon-border-filled slds-is-absolute","title","Delete","style","bottom: 0.25rem; left: 0.25rem; margin: 0;",3,"click",4,"ngIf"],["width","160","height","160",1,"slds-image",2,"border","1px solid #999",3,"src"],["title","Delete",1,"slds-button","slds-button_icon","slds-button_icon-container","slds-button_icon-border-filled","slds-is-absolute",2,"bottom","0.25rem","left","0.25rem","margin","0",3,"click"],[1,"slds-box--border","slds-align_absolute-center",3,"ngStyle"],["style","max-height:100%;padding:0.25rem",3,"src",4,"ngIf"],[2,"max-height","100%","padding","0.25rem",3,"src"],["class","slds-button slds-button_icon slds-button_icon-container slds-button_icon-border-filled slds-align--absolute-center",3,"disabled","click",4,"ngIf"],["class","slds-is-absolute spice-button-group-vertical slds-is-absolute","style","bottom:1.25rem; right:0.75rem",4,"ngIf"],[1,"slds-button","slds-button_icon","slds-button_icon-container","slds-button_icon-border-filled","slds-align--absolute-center",3,"disabled","click"],[1,"slds-is-absolute","spice-button-group-vertical","slds-is-absolute",2,"bottom","1.25rem","right","0.75rem"],["title","Delete",1,"slds-button","slds-button_icon","slds-button_icon-container","slds-button_icon-border-filled",3,"click"],[1,"slds-button","slds-button_icon","slds-is-absolute",2,"bottom","1.25rem","right","0.75rem",3,"click"]],template:function(e,t){1&e&&(m.j41(0,"div",0),m.DNE(1,$e,4,3,"ng-container",1)(2,ze,4,3,"ng-container",1),m.k0s()),2&e&&(m.Y8G("ngClass",t.fielddisplayclass),m.R7$(),m.Y8G("ngIf","button"===t.fieldconfig.format),m.R7$(),m.Y8G("ngIf","button"!==t.fieldconfig.format))},dependencies:[s.YU,s.bT,s.B3,D.t],encapsulation:2})}return fieldMediaFileImage})(),Pe=(()=>{class ModuleMediaFiles{static#e=this.ɵfac=function(e){return new(e||ModuleMediaFiles)};static#t=this.ɵmod=m.$C({type:ModuleMediaFiles});static#i=this.ɵinj=m.G2t({imports:[s.MD,l.YN,n.ObjectFields,a.GlobalComponents,d.ObjectComponents,r.SystemComponents,o.h]})}return ModuleMediaFiles})();("undefined"==typeof ngJitMode||ngJitMode)&&m.Obh(Pe,{declarations:[G,A,se,oe,W,pe,Ee,Te],imports:[s.MD,l.YN,n.ObjectFields,a.GlobalComponents,d.ObjectComponents,r.SystemComponents,o.h],exports:[G,A,se]})}}]);