/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ModuleSpiceAttachments
 */
import {
    Component,
    OnInit,
    Input,
    NgZone,
    Output,
    EventEmitter,
    ViewChild,
    ViewContainerRef,
    Renderer2,
    Injector,
    Optional,
    SkipSelf,
    AfterViewInit, OnChanges, SimpleChanges
} from '@angular/core';
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {language} from "../../../services/language.service";
import {toast} from "../../../services/toast.service";
import {modelattachments} from "../../../services/modelattachments.service";

/**
 * @ignore
 */
declare var moment: any;

/**
 * renders a panel for the attachments. The modelatatchment service can be provided by the component or by the parent
 * if the parent provides the service the parent is also responsible for the laoding of atatchments
 */
@Component({
    templateUrl: './src/include/spiceattachments/templates/spiceattachmentspanel.html',
    providers: [modelattachments]
})
export class SpiceAttachmentsPanel implements AfterViewInit {

    /**
     * the fileupload elelent
     */
    @ViewChild("fileupload", {read: ViewContainerRef, static: false}) private fileupload: ViewContainerRef;

    /**
     * an object array with base64 files that shoudl be loaded when the panel initializes itself
     */
    public uploadfiles: any[] = [];

    /**
     * emits when the attachments are loaded
     */
    @Output() private attachmentsLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * @ignore
     *
     * passed in component config
     */
    private componentconfig: {
        systemCateogryId?: string,
        requiredmodelstate?: string,
        disableupload?: boolean
    } = {};

    /**
     * contructor sets the module and id for the laoder
     * @param modelattachments
     * @param parentmodelattachments
     * @param language
     * @param model
     * @param renderer
     * @param toast
     * @param metadata
     * @param modalservice
     */
    constructor(private _modelattachments: modelattachments, @Optional() @SkipSelf() private parentmodelattachments: modelattachments, private language: language, private modal: modal, private model: model, private renderer: Renderer2, private toast: toast, private metadata: metadata, private modalservice: modal, private injector: Injector) {
        this._modelattachments.module = this.model.module;
        this._modelattachments.id = this.model.id;
    }

    /**
     * @return matchedModelState: boolean
     */
    get isHidden() {
        return (!!this.componentconfig.requiredmodelstate && !this.model.checkModelState(this.componentconfig.requiredmodelstate));
    }

    /**
     * returns the proper modelattachments instance .. wither from the component or provided by the parent
     */
    get modelattachments(): modelattachments {
        return this.parentmodelattachments && this.parentmodelattachments.module == this.model.module && this.parentmodelattachments.id == this.model.id ? this.parentmodelattachments : this._modelattachments;
    }

    /**
     * returns if the model is editing
     */
    get editing() {
        return this.model.isEditing;
    }

    /**
     * initializes the model attachments service and loads the attachments
     */
    private loadFiles() {
        this.modelattachments.getAttachments(this.componentconfig.systemCateogryId).subscribe(loaded => {
            this.attachmentsLoaded.emit(true);
            this.loadInputFiles();
        });
    }

    /**
     * loads files that are to be added dynamically in the call from a compoinent adding a base64 file
     */
    private loadInputFiles() {
        this.modelattachments.uploadAttachmentsBase64FromArray(this.uploadfiles);
    }

    /**
     * sets new uploadfiles, removes any files that have been in the upload file before and are changed
     *
     * @param newUploadFiles
     */
    public setUploadFiles(newUploadFiles) {

        // remove current upload files
        for (let f of this.uploadfiles) {
            let ff = this._modelattachments.files.find(af => af.filename == f.name);
            if (ff) {
                this._modelattachments.deleteAttachment(ff.id);
            }
        }

        // set the new upload files
        this.uploadfiles = newUploadFiles;
        this.loadInputFiles();
    }

    /**
     * load the attachments .. unless the service is provided from teh parent .. then the parent is responsible for the load
     */
    public ngAfterViewInit() {
        if (!this.parentmodelattachments) {
            setTimeout(() => this.loadFiles(), 10);
        }
    }

    /**
     * handler for the dragover event.- Checks if we only have files dragged over the div
     *
     * @param event
     */
    private preventdefault(event: any) {
        if ((event.dataTransfer.items.length >= 1 && this.hasOneItemsFile(event.dataTransfer.items)) || (event.dataTransfer.files.length > 0)) {
            event.preventDefault();
            event.stopPropagation();

            // ensure we are copying the element
            event.dataTransfer.dropEffect = 'copy';
        }
    }

    /**
     * helper to check if all elements of the drag over event are files
     *
     * @param items the items from the event
     */
    private hasOneItemsFile(items) {
        for (let item of items) {
            if (item.kind == 'file') {
                return true;
            }
        }

        return false;
    }

    /**
     * handle the drop and upload the files
     *
     * @param event the drop event
     */
    private onDrop(event: any) {
        this.preventdefault(event);
        let files = event.dataTransfer.files;
        if (files && files.length >= 1) {
            this.doupload(files);
        }
    }

    /**
     * handle the drop and upload the files
     *
     * @param event the drop event
     */
    private fileDrop(files) {
        if (files && files.length >= 1) {
            this.doupload(files);
        }
    }

    /**
     * triggers a file upload. From the select button firing the hidden file upload input
     */
    private selectFile() {
        let event = new MouseEvent("click", {bubbles: true});
        this.fileupload.element.nativeElement.dispatchEvent(event);
    }

    /**
     * does the upload oif the files
     */
    private uploadFile() {
        let files = this.fileupload.element.nativeElement.files;
        this.doupload(files);
    }

    /**
     * the upload itself
     *
     * @param files an array with files
     */
    private doupload(files) {
        this.modelattachments.uploadAttachmentsBase64(files, this.componentconfig.systemCateogryId);
    }

    /**
     * opens the add Image modal
     */
    private addImage() {
        this.modal.openModal('SpiceAttachmentAddImageModal', true, this.injector);
    }

}
