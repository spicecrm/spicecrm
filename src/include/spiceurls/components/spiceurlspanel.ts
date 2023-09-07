/**
 * @module ModuleSpiceUrls
 */
import {Component, Output, EventEmitter, ViewChild, ViewContainerRef, Renderer2, Injector, Optional, SkipSelf, AfterViewInit} from '@angular/core';
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {modal} from "../../../services/modal.service";
import {language} from "../../../services/language.service";
import {toast} from "../../../services/toast.service";
import {modelurls} from "../../../services/modelurls.service";

/**
 * renders a panel for the urls. The modelurls service can be provided by the component or by the parent
 * if the parent provides the service the parent is also responsible for the loading of urls
 */
@Component({
    selector: 'spice-urls-panel',
    templateUrl: '../templates/spiceurlspanel.html',
    providers: [modelurls]
})
export class SpiceUrlsPanel implements AfterViewInit {

    /**
     * the url upload element
     */
    @ViewChild("urlupload", {read: ViewContainerRef, static: false}) public urlUpload: ViewContainerRef;

    /**
     * an object array with base64 urls that shoudl be loaded when the panel initializes itself
     */
    public uploadurls: any[] = [];

    /**
     * emits when the urls are loaded
     */
    @Output() public urlsLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * @ignore
     *
     * passed in component config
     */
    public componentconfig: {
        systemCateogryId?: string,
        requiredmodelstate?: string,
        disableupload?: boolean
    } = {};

    /**
     * contructor sets the module and id for the laoder
     * @param _modelurls
     * @param parentmodelurls
     * @param language
     * @param modal
     * @param model
     * @param view
     * @param renderer
     * @param toast
     * @param metadata
     * @param modalservice
     * @param injector
     */
    constructor(
        public _modelurls: modelurls,
        @Optional() @SkipSelf() public parentmodelurls: modelurls,
        public language: language,
        public modal: modal,
        public model: model,
        @Optional() public view: view,
        public renderer: Renderer2,
        public toast: toast,
        public metadata: metadata,
        public modalservice: modal,
        public injector: Injector
    ) {
        this._modelurls.module = this.model.module;
        this._modelurls.id = this.model.id;
    }

    /**
     * @return matchedModelState: boolean
     */
    get isHidden() {
        return (!!this.componentconfig.requiredmodelstate && !this.model.checkModelState(this.componentconfig.requiredmodelstate));
    }

    /**
     * returns the proper modelurls instance .. wither from the component or provided by the parent
     */
    get modelurls(): modelurls {
        return this.parentmodelurls && this.parentmodelurls.module == this.model.module && this.parentmodelurls.id == this.model.id ? this.parentmodelurls : this._modelurls;
    }

    /**
     * returns if the model is editing
     */
    get editing() {
        return this.model.isEditing && (!this.view || this.view.isEditable);
    }

    /**
     * initializes the model urls service and loads the urls
     */
    public loadUrl() {
/*        this.modelurls.getUrls(this.componentconfig.systemCateogryId).subscribe(loaded => {
            this.urlsLoaded.emit(true);
        });*/
    }


    /**
     * sets new uploadurls, removes any urls that have been in the upload file before and are changed
     *
     * @param newUploadUrl
     */
    public setUploadUrl(newUploadUrl) {

        // remove current upload urls
/*        for (let f of this.uploadurls) {
            let ff = this._modelurls.urls.find(af => af.filename == f.name);
            if (ff) {
                this._modelurls.deleteUrl(ff.id);
            }
        }

        // set the new upload urls
        this.uploadurls = newUploadUrl;*/
    }

    /**
     * load the urls .. unless the service is provided from teh parent .. then the parent is responsible for the load
     */
    public ngAfterViewInit() {
        if (!this.parentmodelurls) {
            setTimeout(() => this.loadUrl(), 10);
        }
    }

    /**
     * handler for the dragover event.- Checks if we only have urls dragged over the div
     *
     * @param event
     */
    public preventdefault(event: any) {
        if ((event.dataTransfer.items.length >= 1 && this.hasOneItemsFile(event.dataTransfer.items)) || (event.dataTransfer.urls.length > 0)) {
            event.preventDefault();
            event.stopPropagation();

            // ensure we are copying the element
            event.dataTransfer.dropEffect = 'copy';
        }
    }

    /**
     * helper to check if all elements of the drag over event are urls
     *
     * @param items the items from the event
     */
    public hasOneItemsFile(items) {
        for (let item of items) {
            if (item.kind == 'url') {
                return true;
            }
        }
        return false;
    }

    /**
     * handle the drop and upload the urls
     *
     * @param event the drop event
     */
    public onDrop(event: any) {
        this.preventdefault(event);
        let urls = event.dataTransfer.urls;
        if (urls && urls.length >= 1) {
            this.doUpload(urls);
        }
    }

    /**
     * handle the drop and upload the urls
     *
     * @param event the drop event
     */
    public fileDrop(urls) {
        if (urls && urls.length >= 1) {
            this.doUpload(urls);
        }
    }
    /**
     * does the upload oif the urls
     */
    public uploadUrl() {
        let urls = this.urlUpload.element.nativeElement.urls;
        this.doUpload(urls);
    }

    /**
     * the upload itself
     *
     * @param urls an array with urls
     */
    public doUpload(urls) {
        // this.modelurls.uploadUrlsBase64(urls, this.componentconfig.systemCateogryId);
    }

}
