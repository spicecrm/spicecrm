/** 
 * © 2015 - 2021 aac services k.s. All rights reserved.
 * release: 2021.01.001
 * date: 2021-04-05 21:11:34
 * build: 2021.01.001.1617649894752
 **/
"use strict";var __decorate=this&&this.__decorate||function(e,t,r,o){var i,n=arguments.length,s=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;0<=a;a--)(i=e[a])&&(s=(n<3?i(s):3<n?i(t,r,s):i(t,r))||s);return 3<n&&s&&Object.defineProperty(t,r,s),s},__metadata=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},__param=this&&this.__param||function(r,o){return function(e,t){o(e,t,r)}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.DirectivesModule=exports.SystemPlaceholderDirective=exports.SystemTitleDirective=exports.SystemResizeDirective=exports.SystemOverlayLoadingSpinnerDirective=exports.SystemDropFile=exports.SystemViewProviderDirective=exports.SystemTrimInputDirective=exports.SystemToBottomNoScrollDirective=exports.SystemToBottomDirective=exports.SystemDropdownTriggerSimpleDirective=exports.SystemDropdownTriggerDirective=exports.SystemAutofocusDirective=exports.SystemModelProviderDirective=exports.SystemPopOverDirective=exports.SystemModelPopOverDirective=void 0;var common_1=require("@angular/common"),core_1=require("@angular/core"),router_1=require("@angular/router"),services_1=require("../services/services"),rxjs_1=require("rxjs"),SystemModelPopOverDirective=function(){function e(e,t,r,o,i,n,s){this.metadata=e,this.footer=t,this.model=r,this.navigationtab=o,this.popovermodel=i,this.elementRef=n,this.router=s,this.enablelink=!0,this.modelPopOver=!0,this.popoverCmp=null,this.showPopoverTimeout={}}return e.prototype.onMouseOver=function(){var e=this;!1!==this.modelPopOver&&(this.showPopoverTimeout=window.setTimeout(function(){return e.renderPopover()},500))},e.prototype.onMouseOut=function(){this.showPopoverTimeout&&window.clearTimeout(this.showPopoverTimeout),this.popoverCmp&&this.popoverCmp.closePopover()},e.prototype.goRelated=function(){var r=this;if(!1===this.modelPopOver||!this.enablelink)return!1;this.popoverCmp&&this.popoverCmp.closePopover(),this.showPopoverTimeout&&window.clearTimeout(this.showPopoverTimeout),this.popovermodel.id=this.id,this.popovermodel.module=this.module,this.popovermodel.getData(!0).subscribe(function(e){var t;r.popovermodel.goDetail(null===(t=r.navigationtab)||void 0===t?void 0:t.tabid)})},e.prototype.renderPopover=function(){var t=this;this.footer.footercontainer&&this.metadata.addComponent("ObjectModelPopover",this.footer.footercontainer).subscribe(function(e){e.instance.popovermodule=t.module,e.instance.popoverid=t.id,e.instance.parentElementRef=t.elementRef,t.popoverCmp=e.instance})},e.prototype.ngOnInit=function(){!this.module&&this.model&&(this.module=this.model.module),!this.id&&this.model&&(this.id=this.model.id)},e.prototype.ngOnDestroy=function(){this.showPopoverTimeout&&window.clearTimeout(this.showPopoverTimeout),this.popoverCmp&&this.popoverCmp.closePopover(!0)},__decorate([core_1.Input(),__metadata("design:type",String)],e.prototype,"module",void 0),__decorate([core_1.Input(),__metadata("design:type",String)],e.prototype,"id",void 0),__decorate([core_1.Input(),__metadata("design:type",Boolean)],e.prototype,"enablelink",void 0),__decorate([core_1.Input("system-model-popover"),__metadata("design:type",Boolean)],e.prototype,"modelPopOver",void 0),__decorate([core_1.HostListener("mouseenter"),__metadata("design:type",Function),__metadata("design:paramtypes",[]),__metadata("design:returntype",void 0)],e.prototype,"onMouseOver",null),__decorate([core_1.HostListener("mouseleave"),__metadata("design:type",Function),__metadata("design:paramtypes",[]),__metadata("design:returntype",void 0)],e.prototype,"onMouseOut",null),__decorate([core_1.HostListener("click"),__metadata("design:type",Function),__metadata("design:paramtypes",[]),__metadata("design:returntype",void 0)],e.prototype,"goRelated",null),__decorate([core_1.Directive({selector:"[system-model-popover]",host:{"[class.slds-text-link_faux]":"enablelink"},providers:[services_1.model]}),__param(2,core_1.Optional()),__param(2,core_1.SkipSelf()),__param(3,core_1.Optional()),__metadata("design:paramtypes",[services_1.metadata,services_1.footer,services_1.model,services_1.navigationtab,services_1.model,core_1.ElementRef,router_1.Router])],e)}();exports.SystemModelPopOverDirective=SystemModelPopOverDirective;var SystemPopOverDirective=function(){function e(e,t,r){this.metadata=e,this.footer=t,this.elementRef=r,this.popoverCmp=null,this.showPopoverTimeout={},this._popoverSettings={injector:{},componentset:{},component:""}}return Object.defineProperty(e.prototype,"popoverSettings",{set:function(e){this._popoverSettings.injector=e.injector,this._popoverSettings.componentset=e.componentset,this._popoverSettings.component=e.component},enumerable:!1,configurable:!0}),e.prototype.onMouseOver=function(){var e=this;this.showPopoverTimeout=window.setTimeout(function(){return e.renderPopover()},500)},e.prototype.onMouseOut=function(){this.showPopoverTimeout&&window.clearTimeout(this.showPopoverTimeout),this.popoverCmp&&this.popoverCmp.closePopover()},e.prototype.renderPopover=function(){var t=this;this.metadata.addComponent("SystemPopover",this.footer.footercontainer,this._popoverSettings.injector).subscribe(function(e){e.instance.parentElementRef=t.elementRef,e.instance.componentset=t._popoverSettings.componentset,t.popoverCmp=e.instance})},e.prototype.ngOnDestroy=function(){this.popoverCmp&&this.popoverCmp.closePopover(!0)},__decorate([core_1.Input("system-pop-over"),__metadata("design:type",Object),__metadata("design:paramtypes",[Object])],e.prototype,"popoverSettings",null),__decorate([core_1.HostListener("mouseenter"),__metadata("design:type",Function),__metadata("design:paramtypes",[]),__metadata("design:returntype",void 0)],e.prototype,"onMouseOver",null),__decorate([core_1.HostListener("mouseleave"),__metadata("design:type",Function),__metadata("design:paramtypes",[]),__metadata("design:returntype",void 0)],e.prototype,"onMouseOut",null),__decorate([core_1.Directive({selector:"[system-pop-over]"}),__metadata("design:paramtypes",[services_1.metadata,services_1.footer,core_1.ElementRef])],e)}();exports.SystemPopOverDirective=SystemPopOverDirective;var SystemModelProviderDirective=function(){function e(e){this.model=e,this.model.isLoading=!0}return Object.defineProperty(e.prototype,"provided_model",{set:function(e){this.model.module=e.module,e.id?this.model.id=e.id:e.data&&(this.model.id=e.data.id),e.data?(this.model.data=this.model.utils.backendModel2spice(e.module,e.data),this.model.isLoading=!1,this.model.data$.next(this.model.data),e.data.acl&&this.model.initializeFieldsStati()):this.model.id&&this.model.getData()},enumerable:!1,configurable:!0}),__decorate([core_1.Input("system-model-provider"),__metadata("design:type",Object),__metadata("design:paramtypes",[Object])],e.prototype,"provided_model",null),__decorate([core_1.Directive({selector:"[system-model-provider]",providers:[services_1.model]}),__metadata("design:paramtypes",[services_1.model])],e)}();exports.SystemModelProviderDirective=SystemModelProviderDirective;var SystemAutofocusDirective=function(){function e(e){this.elementRef=e}return e.prototype.ngAfterViewInit=function(){var e=this;setTimeout(function(){e.elementRef.nativeElement.tabIndex||(e.elementRef.nativeElement.tabIndex="-1"),e.elementRef.nativeElement.focus()})},__decorate([core_1.Directive({selector:"[system-autofocus]"}),__metadata("design:paramtypes",[core_1.ElementRef])],e)}();exports.SystemAutofocusDirective=SystemAutofocusDirective;var SystemDropdownTriggerDirective=function(){function e(e,t,r,o){this.renderer=e,this.elementRef=t,this.footer=r,this.cdRef=o,this.dropDownOpen=!1,this.dropdowntriggerdisabled=!1}return e.prototype.ngAfterViewChecked=function(){this.dropDownOpen&&this.dropdownElement&&this.setDropdownElementPosition()},e.prototype.ngOnDestroy=function(){this.removeDropdownFromFooter(),this.clickListener&&this.clickListener()},e.prototype.openDropdown=function(e){var t=this;this.setDropdownElement(),this.dropdownElement&&(this.moveDropdownToFooter(),this.resetDropdownStyles(),this.setDropdownElementPosition()),this.dropdowntriggerdisabled||(this.toggleOpenDropdown(),this.dropDownOpen?(e.preventDefault(),this.clickListener=this.renderer.listen("document","click",function(e){return t.onClick(e)})):(this.removeDropdownFromFooter(),this.clickListener()))},e.prototype.moveDropdownToFooter=function(){this.renderer.removeChild(this.elementRef.nativeElement,this.dropdownElement),this.renderer.appendChild(this.footer.footercontainer.element.nativeElement,this.dropdownElement)},e.prototype.removeDropdownFromFooter=function(){this.dropdownElement&&this.footer.footercontainer.element.nativeElement.contains(this.dropdownElement)&&this.renderer.removeChild(this.footer.footercontainer.element.nativeElement,this.dropdownElement)},e.prototype.resetDropdownStyles=function(){this.renderer.setStyle(this.dropdownElement,"transform","initial"),this.renderer.setStyle(this.dropdownElement,"right","initial"),this.renderer.setStyle(this.dropdownElement,"z-index","999999")},e.prototype.setDropdownElement=function(){if(!this.dropdownElement)for(var e=0,t=this.elementRef.nativeElement.children;e<t.length;e++){var r=t[e];if(r.classList.contains("slds-dropdown")){this.dropdownElement=r;break}}},e.prototype.toggleOpenDropdown=function(){this.dropDownOpen=!this.dropDownOpen},e.prototype.setDropdownElementPosition=function(){var e=this.elementRef.nativeElement.getBoundingClientRect(),t=this.dropdownElement.getBoundingClientRect();this.previousTriggerRect&&this.previousTriggerRect.bottom==e.bottom&&this.previousTriggerRect.right==e.right||(this.previousTriggerRect=e,this.renderer.setStyle(this.dropdownElement,"top",window.innerHeight-e.bottom<100?Math.abs(e.bottom-t.height)+"px":e.bottom+"px"),this.renderer.setStyle(this.dropdownElement,"left",Math.abs(e.right-t.width)+"px"),this.cdRef.markForCheck())},e.prototype.onClick=function(e){this.elementRef.nativeElement.contains(e.target)||(this.dropDownOpen=!1,this.removeDropdownFromFooter(),this.renderer.appendChild(this.elementRef.nativeElement,this.dropdownElement),this.clickListener(),this.cdRef.markForCheck())},__decorate([core_1.HostBinding("class.slds-is-open"),__metadata("design:type",Boolean)],e.prototype,"dropDownOpen",void 0),__decorate([core_1.Input("system-dropdown-trigger"),__metadata("design:type",Boolean)],e.prototype,"dropdowntriggerdisabled",void 0),__decorate([core_1.HostListener("click",["$event"]),__metadata("design:type",Function),__metadata("design:paramtypes",[Object]),__metadata("design:returntype",void 0)],e.prototype,"openDropdown",null),__decorate([core_1.Directive({selector:"[system-dropdown-trigger]"}),__metadata("design:paramtypes",[core_1.Renderer2,core_1.ElementRef,services_1.footer,core_1.ChangeDetectorRef])],e)}();exports.SystemDropdownTriggerDirective=SystemDropdownTriggerDirective;var SystemDropdownTriggerSimpleDirective=function(){function e(e,t,r){this.renderer=e,this.cdRef=t,this.elementRef=r,this.dropdowntriggerdisabled=!1,this.dropDownOpen=!1}return e.prototype.openDropdown=function(e){var t=this;this.dropdowntriggerdisabled||(this.dropDownOpen=!this.dropDownOpen,this.dropDownOpen?(e.preventDefault(),this.clickListener=this.renderer.listen("document","click",function(e){return t.onClick(e)})):this.clickListener())},e.prototype.onClick=function(e){this.elementRef.nativeElement.contains(e.target)||(this.dropDownOpen=!1,this.cdRef.detectChanges(),this.clickListener())},e.prototype.ngOnDestroy=function(){this.clickListener&&this.clickListener()},__decorate([core_1.Input("system-dropdown-trigger-simple"),__metadata("design:type",Boolean)],e.prototype,"dropdowntriggerdisabled",void 0),__decorate([core_1.HostBinding("class.slds-is-open"),__metadata("design:type",Boolean)],e.prototype,"dropDownOpen",void 0),__decorate([core_1.HostListener("click",["$event"]),__metadata("design:type",Function),__metadata("design:paramtypes",[Object]),__metadata("design:returntype",void 0)],e.prototype,"openDropdown",null),__decorate([core_1.Directive({selector:"[system-dropdown-trigger-simple]"}),__metadata("design:paramtypes",[core_1.Renderer2,core_1.ChangeDetectorRef,core_1.ElementRef])],e)}();exports.SystemDropdownTriggerSimpleDirective=SystemDropdownTriggerSimpleDirective;var SystemToBottomDirective=function(){function e(e,t,r){this.element=e,this.renderer=t,this.footer=r,this.more=new core_1.EventEmitter,this.marginBottom=0,this.elementClass=!0}return e.prototype.ngDoCheck=function(){var e=this.element.nativeElement.getBoundingClientRect(),e=Math.floor(window.innerHeight-e.top-this.marginBottom-parseInt(getComputedStyle(this.element.nativeElement).marginBottom,10)-parseInt(getComputedStyle(this.element.nativeElement).paddingBottom,10)-this.footer.visibleFooterHeight);this.renderer.setStyle(this.element.nativeElement,"height",e+"px")},e.prototype.onScroll=function(e){var t=this.element.nativeElement;t.scrollTop+t.clientHeight+50>t.scrollHeight&&this.more.emit(!0)},__decorate([core_1.Output("system-to-bottom"),__metadata("design:type",core_1.EventEmitter)],e.prototype,"more",void 0),__decorate([core_1.Input(),__metadata("design:type",Object)],e.prototype,"marginBottom",void 0),__decorate([core_1.HostBinding("class.slds-scrollable--y"),__metadata("design:type",Object)],e.prototype,"elementClass",void 0),__decorate([core_1.HostListener("scroll",["$event"]),__metadata("design:type",Function),__metadata("design:paramtypes",[Object]),__metadata("design:returntype",void 0)],e.prototype,"onScroll",null),__decorate([core_1.Directive({selector:"[system-to-bottom]"}),__metadata("design:paramtypes",[core_1.ElementRef,core_1.Renderer2,services_1.footer])],e)}();exports.SystemToBottomDirective=SystemToBottomDirective;var SystemToBottomNoScrollDirective=function(){function e(e,t,r){this.element=e,this.renderer=t,this.footer=r,this.toBottomNoScroll=!0}return e.prototype.ngDoCheck=function(){var e;!1!==this.toBottomNoScroll&&(e=this.element.nativeElement.getBoundingClientRect(),e=Math.floor(window.innerHeight-e.top-parseInt(getComputedStyle(this.element.nativeElement).marginBottom,10)-parseInt(getComputedStyle(this.element.nativeElement).paddingBottom,10)-this.footer.visibleFooterHeight),this.renderer.setStyle(this.element.nativeElement,"height",e+"px"))},__decorate([core_1.Input("system-to-bottom-noscroll"),__metadata("design:type",Boolean)],e.prototype,"toBottomNoScroll",void 0),__decorate([core_1.Directive({selector:"[system-to-bottom-noscroll]"}),__metadata("design:paramtypes",[core_1.ElementRef,core_1.Renderer2,services_1.footer])],e)}();exports.SystemToBottomNoScrollDirective=SystemToBottomNoScrollDirective;var SystemTrimInputDirective=function(){function e(){}return e.prototype.getCaret=function(e){return{start:e.selectionStart,end:e.selectionEnd}},e.prototype.setCaret=function(e,t,r){e.selectionStart=t,e.selectionEnd=r,e.focus()},e.prototype.dispatchEvent=function(e,t){var r=document.createEvent("Event");r.initEvent(t,!1,!1),e.dispatchEvent(r)},e.prototype.trimValue=function(e,t){e.value=t.trim(),this.dispatchEvent(e,"input")},e.prototype.onBlur=function(e,t){this.trim&&"blur"!==this.trim||"function"!=typeof t.trim||t.trim()===t||(this.trimValue(e,t),this.dispatchEvent(e,"blur"))},e.prototype.onInput=function(e,t){var r,o;this.trim||"function"!=typeof t.trim||t.trim()===t||(r=(o=this.getCaret(e)).start,o=o.end," "===t[0]&&1===r&&1===o&&(o=r=0),this.trimValue(e,t),this.setCaret(e,r,o))},__decorate([core_1.Input("system-trim-input"),__metadata("design:type",String)],e.prototype,"trim",void 0),__decorate([core_1.HostListener("blur",["$event.target","$event.target.value"]),__metadata("design:type",Function),__metadata("design:paramtypes",[Object,String]),__metadata("design:returntype",void 0)],e.prototype,"onBlur",null),__decorate([core_1.HostListener("input",["$event.target","$event.target.value"]),__metadata("design:type",Function),__metadata("design:paramtypes",[Object,String]),__metadata("design:returntype",void 0)],e.prototype,"onInput",null),__decorate([core_1.Directive({selector:"input[system-trim-input], textarea[system-trim-input]"})],e)}();exports.SystemTrimInputDirective=SystemTrimInputDirective;var SystemViewProviderDirective=function(){function e(e,t,r){this.renderer=e,this.elementRef=t,this.view=r}return Object.defineProperty(e.prototype,"viewSettings",{set:function(e){e.editable&&(this.view.isEditable=!0),!1===e.displayLabels&&(this.view.displayLabels=!1)},enumerable:!1,configurable:!0}),e.prototype.ngAfterViewInit=function(){var e=this;this.setviewSize(),this.resizeHandler=this.renderer.listen("window","resize",function(){return e.setviewSize()})},e.prototype.ngOnDestroy=function(){this.resizeHandler&&this.resizeHandler()},e.prototype.setviewSize=function(){this.elementRef.nativeElement.getBoundingClientRect().width<500?this.view.size="small":this.view.size="regular"},__decorate([core_1.Input("system-view-provider"),__metadata("design:type",Object),__metadata("design:paramtypes",[Object])],e.prototype,"viewSettings",null),__decorate([core_1.Directive({selector:"[system-view-provider]",providers:[services_1.view]}),__metadata("design:paramtypes",[core_1.Renderer2,core_1.ElementRef,services_1.view])],e)}();exports.SystemViewProviderDirective=SystemViewProviderDirective;var SystemDropFile=function(){function e(e,t,r){this.renderer=e,this.elementRef=t,this.language=r,this.filesDrop=new core_1.EventEmitter,this.dragDepth=0,this.defineOverlayElement(),this.listenWindowEvents()}return e.prototype.ngOnChanges=function(){this.renderer.setProperty(this.overlayElement,"textContent",this.dropMessage)},e.prototype.ngOnDestroy=function(){this.dragStartListener(),this.dragEnterListener(),this.dragOverListener(),this.dragLeaveListener(),this.dragEndListener(),this.dragDropListener(),this.dragGlobalDropListener()},e.prototype.defineOverlayElement=function(){this.overlayElement=this.renderer.createElement("div"),this.renderer.setStyle(this.overlayElement,"height","100%"),this.renderer.setStyle(this.overlayElement,"width","100%"),this.renderer.setStyle(this.overlayElement,"top","0"),this.renderer.setStyle(this.overlayElement,"left","0"),this.renderer.setStyle(this.overlayElement,"position","absolute"),this.renderer.setStyle(this.overlayElement,"background","rgba(135,135,135,0.8)"),this.renderer.setStyle(this.overlayElement,"color","#fff"),this.renderer.setStyle(this.overlayElement,"border","dashed 2px #fff"),this.renderer.setProperty(this.overlayElement,"textContent",this.language.getLabel("LBL_DROP_FILES")),this.renderer.addClass(this.overlayElement,"slds-align--absolute-center"),this.renderer.addClass(this.elementRef.nativeElement,"slds-is-relative")},e.prototype.listenWindowEvents=function(){var t=this;this.dragStartListener=this.renderer.listen("window","dragstart",function(){t.dragDepth=-10}),this.dragEnterListener=this.renderer.listen("window","dragenter",function(){t.dragDepth++,1==t.dragDepth&&t.renderer.appendChild(t.elementRef.nativeElement,t.overlayElement)}),this.dragOverListener=this.renderer.listen(this.overlayElement,"dragover",function(e){e.preventDefault(),e.stopPropagation(),e.dataTransfer.dropEffect="copy"}),this.dragLeaveListener=this.renderer.listen("window","dragleave",function(){t.dragDepth--,0==t.dragDepth&&t.renderer.removeChild(t.elementRef.nativeElement,t.overlayElement)}),this.dragEndListener=this.renderer.listen("window","dragend",function(){t.dragDepth=0,t.renderer.removeChild(t.elementRef.nativeElement,t.overlayElement)}),this.dragDropListener=this.renderer.listen(this.overlayElement,"drop",function(e){(t.dragDepth=0)<e.dataTransfer.files.length&&t.filesDrop.emit(e.dataTransfer.files),t.renderer.removeChild(t.elementRef.nativeElement,t.overlayElement)}),this.dragGlobalDropListener=this.renderer.listen("window","drop",function(e){t.dragDepth=0,t.renderer.removeChild(t.elementRef.nativeElement,t.overlayElement)})},e.prototype.hasOneItemsFile=function(e){for(var t=0,r=e;t<r.length;t++)if("file"==r[t].kind)return!0;return!1},__decorate([core_1.Output("system-drop-file"),__metadata("design:type",core_1.EventEmitter)],e.prototype,"filesDrop",void 0),__decorate([core_1.Input(),__metadata("design:type",String)],e.prototype,"dropMessage",void 0),__decorate([core_1.Directive({selector:"[system-drop-file]"}),__metadata("design:paramtypes",[core_1.Renderer2,core_1.ElementRef,services_1.language])],e)}();exports.SystemDropFile=SystemDropFile;var SystemOverlayLoadingSpinnerDirective=function(){function e(e,t){this.renderer=e,this.elementRef=t,this.defineOverlayElement()}return Object.defineProperty(e.prototype,"isLoading",{set:function(e){e?this.renderer.appendChild(this.elementRef.nativeElement,this.overlayElement):this.renderer.removeChild(this.elementRef.nativeElement,this.overlayElement)},enumerable:!1,configurable:!0}),e.prototype.defineOverlayElement=function(){this.overlayElement=this.renderer.createElement("div"),this.renderer.setStyle(this.overlayElement,"position","absolute"),this.renderer.addClass(this.overlayElement,"slds-align--absolute-center"),this.renderer.setStyle(this.overlayElement,"height","100%"),this.renderer.setStyle(this.overlayElement,"width","100%"),this.renderer.setStyle(this.overlayElement,"z-index","999"),this.renderer.setStyle(this.overlayElement,"top","0"),this.renderer.setStyle(this.overlayElement,"left","0");var e=this.renderer.createElement("div");this.renderer.setProperty(this.overlayElement,"innerHTML",'\n            <div style="border-radius: 50%; box-shadow: 0 0 5px 0 #555; padding:.75rem; background-color:#fff; color:#080707">\n                <div class="cssload-container">\n                    <div class="cssload-double-torus"></div>\n                </div>\n            </div>\n        '),this.renderer.appendChild(this.elementRef.nativeElement,e),this.renderer.addClass(this.elementRef.nativeElement,"slds-is-relative")},__decorate([core_1.Input("system-overlay-loading-spinner"),__metadata("design:type",Object),__metadata("design:paramtypes",[Object])],e.prototype,"isLoading",null),__decorate([core_1.Directive({selector:"[system-overlay-loading-spinner]"}),__metadata("design:paramtypes",[core_1.Renderer2,core_1.ElementRef])],e)}();exports.SystemOverlayLoadingSpinnerDirective=SystemOverlayLoadingSpinnerDirective;var SystemResizeDirective=function(){function e(e,t){this.elementRef=e,this.renderer=t,this.resizeemitter=new core_1.EventEmitter}return e.prototype.ngOnDestroy=function(){this.mouseListener&&this.mouseListener()},e.prototype.onMouseDown=function(e){var t=this,r=this.elementRef.nativeElement.getClientRects()[0];this.elementWidth=r.width,this.elementHeight=r.height,this.mouseListener=this.renderer.listen("document","mouseup",function(e){t.onMouseup()})},e.prototype.onMouseup=function(){var e;this.elementWidth&&this.elementWidth&&(e=this.elementRef.nativeElement.getClientRects()[0],(this.elementWidth&&e.width!=this.elementWidth||this.elementHeight&&e.height!=this.elementHeight)&&this.resizeemitter.emit({width:e.width,height:e.height,id:this.resizeid}),this.elementWidth=void 0,this.elementHeight=void 0,this.mouseListener(),this.mouseListener=void 0)},e.prototype.getElementWidth=function(){return this.elementRef.nativeElement.getClientRects()[0].width},__decorate([core_1.Input(),__metadata("design:type",Object)],e.prototype,"resizeid",void 0),__decorate([core_1.Output("system-resize"),__metadata("design:type",core_1.EventEmitter)],e.prototype,"resizeemitter",void 0),__decorate([core_1.HostListener("mousedown",["$event"]),__metadata("design:type",Function),__metadata("design:paramtypes",[Object]),__metadata("design:returntype",void 0)],e.prototype,"onMouseDown",null),__decorate([core_1.Directive({selector:"[system-resize]"}),__metadata("design:paramtypes",[core_1.ElementRef,core_1.Renderer2])],e)}();exports.SystemResizeDirective=SystemResizeDirective;var SystemTitleDirective=function(){function e(e,t){this.language=e,this.elementRef=t,this.subscription=new rxjs_1.Subscription,this.subscribeToCurrentLanguageChange()}return e.prototype.ngOnDestroy=function(){this.subscription.unsubscribe()},e.prototype.ngOnChanges=function(e){e.label.previousValue!==e.label.currentValue&&e.label.currentValue&&this.setElementTitleAttribute()},e.prototype.subscribeToCurrentLanguageChange=function(){var e=this;this.subscription=this.language.currentlanguage$.subscribe(function(){return e.setElementTitleAttribute()})},e.prototype.setElementTitleAttribute=function(){this.elementRef.nativeElement.setAttribute("title",this.language.getLabel(this.label))},__decorate([core_1.Input("system-title"),__metadata("design:type",String)],e.prototype,"label",void 0),__decorate([core_1.Directive({selector:"[system-title]"}),__metadata("design:paramtypes",[services_1.language,core_1.ElementRef])],e)}();exports.SystemTitleDirective=SystemTitleDirective;var SystemPlaceholderDirective=function(){function e(e,t){this.language=e,this.elementRef=t,this.subscription=new rxjs_1.Subscription,this.subscribeToCurrentLanguageChange()}return e.prototype.ngOnDestroy=function(){this.subscription.unsubscribe()},e.prototype.ngOnChanges=function(e){e.label.previousValue!==e.label.currentValue&&e.label.currentValue&&this.setElementTitleAttribute()},e.prototype.subscribeToCurrentLanguageChange=function(){var e=this;this.subscription=this.language.currentlanguage$.subscribe(function(){return e.setElementTitleAttribute()})},e.prototype.setElementTitleAttribute=function(){this.label?this.elementRef.nativeElement.setAttribute("placeholder",this.language.getLabel(this.label)):this.elementRef.nativeElement.setAttribute("placeholder","")},__decorate([core_1.Input("system-placeholder"),__metadata("design:type",String)],e.prototype,"label",void 0),__decorate([core_1.Directive({selector:"[system-placeholder]"}),__metadata("design:paramtypes",[services_1.language,core_1.ElementRef])],e)}();exports.SystemPlaceholderDirective=SystemPlaceholderDirective;var DirectivesModule=function(){function e(){}return __decorate([core_1.NgModule({imports:[common_1.CommonModule],declarations:[SystemModelPopOverDirective,SystemPopOverDirective,SystemModelProviderDirective,SystemAutofocusDirective,SystemDropdownTriggerDirective,SystemDropdownTriggerSimpleDirective,SystemToBottomDirective,SystemToBottomNoScrollDirective,SystemTrimInputDirective,SystemViewProviderDirective,SystemDropFile,SystemOverlayLoadingSpinnerDirective,SystemResizeDirective,SystemPlaceholderDirective,SystemTitleDirective],exports:[SystemModelPopOverDirective,SystemPopOverDirective,SystemModelProviderDirective,SystemAutofocusDirective,SystemDropdownTriggerDirective,SystemDropdownTriggerSimpleDirective,SystemToBottomDirective,SystemToBottomNoScrollDirective,SystemTrimInputDirective,SystemViewProviderDirective,SystemDropFile,SystemOverlayLoadingSpinnerDirective,SystemResizeDirective,SystemPlaceholderDirective,SystemTitleDirective]})],e)}();exports.DirectivesModule=DirectivesModule;