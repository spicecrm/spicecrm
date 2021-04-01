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
 * @module ObjectComponents
 */
import {AfterViewInit, Component, Input, Renderer2, ViewChild, ViewContainerRef} from "@angular/core";
import {animate, state, style, transition, trigger} from '@angular/animations';
import {model} from "../../services/model.service";
import {language} from "../../services/language.service";
import {toast} from "../../services/toast.service";
import {modelattachments} from "../../services/modelattachments.service";
import {metadata} from "../../services/metadata.service";
import {footer} from "../../services/footer.service";
import {modal} from "../../services/modal.service";
import {configurationService} from "../../services/configuration.service";
import {backend} from "../../services/backend.service";

/**
 * a generic component that renders a panel in teh contect of a model. This allows uploading files and also has a drag and drop functionality to cimply drop files over the component and upload the file
 */
@Component({
    selector: "object-relatedlist-files",
    templateUrl: "./src/objectcomponents/templates/objectrelatedlistfiles.html",
    providers: [modelattachments],
    animations: [
        trigger('animateicon', [
            state('open', style({transform: 'scale(1, 1)'})),
            state('closed', style({transform: 'scale(1, -1)'})),
            transition('open => closed', [
                animate('.5s'),
            ]),
            transition('closed => open', [
                animate('.5s'),
            ])
        ]),
        trigger('displaycard', [
            transition(':enter', [
                style({opacity: 0, height: '0px', overflow: 'hidden'}),
                animate('.5s', style({height: '*', opacity: 1})),
                style({overflow: 'unset'})
            ]),
            transition(':leave', [
                style({overflow: 'hidden'}),
                animate('.5s', style({height: '0px', opacity: 0}))
            ])
        ])
    ]
})
export class ObjectRelatedlistFiles implements AfterViewInit {

    /**
     * an object array with base64 files
     */
    @Input() public files: any[] = [];
    /**
     * holds the filtered files list
     * @private
     */
    protected filteredFiles: any[] = [];
    /**
     * the fileupload elelent
     */
    @ViewChild("fileupload", {read: ViewContainerRef, static: true}) private fileupload: ViewContainerRef;
    /**
     * @ignore
     *
     * passed in component config
     */
    private componentconfig: any = {};
    /**
     * @ignore
     *
     * keeps if the modal is open or not
     */
    private isopen: boolean = true;
    /**
     * holds the selected category value
     * @private
     */
    private selectedCategoryId: string = '';
    /**
     * holds the filter term for files
     * @private
     */
    private filterTerm: string = '';
    /**
     * holds the available categories
     * @private
     */
    protected categories: any[] = [];
    /**
     * holds the search timeout
     * @private
     */
    private filterTimeout: number;
    /**
     * contructor sets the module and id for the laoder
     * @param modelattachments
     * @param language
     * @param model
     * @param renderer
     * @param toast
     * @param footer
     * @param metadata
     * @param backend
     * @param configurationService
     * @param modalservice
     */
    constructor(private modelattachments: modelattachments,
                private language: language,
                private model: model,
                private renderer: Renderer2,
                private toast: toast,
                private footer: footer,
                private metadata: metadata,
                private backend: backend,
                private configurationService: configurationService,
                private modalservice: modal) {
    }

    /**
     * @ignore
     */
    public ngAfterViewInit() {
        this.setModelData();
        setTimeout(() => this.loadFiles(), 10);
    }

    /**
     * load categories from backend or from configuration data
      * @private
     */
    private loadCategories() {
        if (!!this.configurationService.getData('spiceattachments_categories')) {
            return this.categories = this.configurationService.getData('spiceattachments_categories');
        }
        this.backend.getRequest('spiceAttachments/categories/' + this.model.module).subscribe(res => {
            if (!res || !Array.isArray(res)) return;
            this.categories = res;
            this.configurationService.setData('spiceattachments_categories', res);
        });
    }

    /**
     * initializes the model attachments service and loads the attachments
     */
    private loadFiles() {
        // set input base64 files
        if (this.files.length > 0) {
            this.doupload(this.files);
        }
        this.modelattachments.getAttachments().subscribe(res => {
            this.filteredFiles = res;
            this.loadCategories();
        });
    }

    private setModelData() {
        this.modelattachments.module = this.model.module;
        this.modelattachments.id = this.model.id;
    }

    /**
     * toggle open and closed .. called from teh template button
     */
    private toggleOpen(e: MouseEvent) {
        e.stopPropagation();
        this.isopen = !this.isopen;
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
        this.modelattachments.uploadAttachmentsBase64(files);
    }

    /**
     * @deprecated
     *
     * helper function to take a foto
     */
    private takeFoto() {
        this.modalservice.openModal("SystemCaptureImage").subscribe(modal => {
            modal.instance.model = this.model;
            modal.instance.response$.subscribe(file => {
                this.modelattachments.files.push(file);
            });
        });
    }

    /**
     * set filtered files by action
     * @param action
     * @param value
     * @private
     */
    private setFilteredFiles(action: string, value: string) {
        switch (action) {
            case 'category':
                this.selectedCategoryId = value;
                this.filteredFiles = value == '*' ? this.modelattachments.files : this.modelattachments.files
                    .filter(file => !!file.category_ids && file.category_ids.includes(value));
                break;
            case 'input':
                const term = value.toLowerCase();
                this.filterTerm = value;

                window.clearTimeout(this.filterTimeout);
                this.filterTimeout = window.setTimeout(() => {
                    this.filteredFiles = value.length == 0 ? this.modelattachments.files : this.modelattachments.files
                        .filter(file => file.filename.toLowerCase().includes(term) || (!!file.display_name && file.display_name.toLowerCase().includes(term)) || (!!file.text && file.text.toLowerCase().includes(term)));
                }, 600);
        }
    }

    /**
     * toggle big thumbnail value
     */
    public toggleBigThumbnail() {
        if (!this.componentconfig) {
            this.componentconfig = {};
        }
        this.componentconfig.bigThumbnail = !this.componentconfig.bigThumbnail;
    }
}
