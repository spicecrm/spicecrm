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
 * @module ModuleOutputTenmplates
 */
import {ChangeDetectionStrategy, Component, ChangeDetectorRef} from "@angular/core";
import {DomSanitizer} from '@angular/platform-browser';
import {backend} from "../../../services/backend.service";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {toast} from "../../../services/toast.service";
import {Subscription} from "rxjs";

declare var moment: any;

/**
 * renders a tabbed view for body, header and footer of a template
 */
@Component({
    selector: 'output-templates-preview',
    templateUrl: "./src/modules/outputtemplates/templates/outputtemplatespreview.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutputTemplatesPreview {

    /**
     * the output format
     */
    private _outputformat: 'html' | 'pdf' = 'pdf';

    /**
     * indicates that the system is rendering the preview
     */
    private loading_output: boolean = false;

    /**
     * any susbcriptions we might have
     */
    private subscriptions: Subscription = new Subscription();

    /**
     * the selected item
     */
    private selectedItem: any;

    /**
     * the response of the compiler
     */
    private compiled_selected_template: string = '';

    /**
     * the blobURL. This is handled internally. When the data is sent this is created so the object can be rendered in the modal
     */
    private blobUrl: any;

    constructor(private language: language, private backend: backend, private metadata: metadata, private model: model, private modal: modal, private sanitizer: DomSanitizer, private cdRef: ChangeDetectorRef, private toast: toast ) {
        this.model.data$.subscribe(data => {
            this.checkModelChanges();
        });
    }

    /**
     * destroy the subscriptions
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    /**
     * returns the sanitized template for the iframe of the HTML preview
     */
    get sanitizedTemplated() {
        return this.sanitizer.bypassSecurityTrustHtml(this.compiled_selected_template);
    }

    /**
     * getter for the format
     */
    get outputformat() {
        return this._outputformat;
    }

    /**
     * sets the format and removes the file
     *
     * @param format
     */
    set outputformat(format: 'html' | 'pdf') {
        this._outputformat = format;
        this.rendertemplate();
    }

    /**
     * subscribe to model changes and reset the selecteditem if th emodulke changed in the template
     */
    private checkModelChanges() {
        if (this.selectedItem && this.selectedItem.module != this.module) {
            this.clearField();
        }
    }

    /**
     * getter for the active module from teh outpout template model
     */
    get module() {
        return this.model.getField('module_name');
    }

    /**
     * the search placeholder
     */
    get placeholder() {
        // return default placeholder
        return this.module ? this.language.getModuleCombinedLabel('LBL_SEARCH', this.module) : this.language.getLabel('LBL_SEARCH');
    }

    /**
     * opens a model search modal
     */
    private searchWithModal() {
        this.modal.openModal('ObjectModalModuleLookup').subscribe(selectModal => {
            selectModal.instance.module = this.module;
            selectModal.instance.multiselect = false;
            this.subscriptions.add(
                selectModal.instance.selectedItems.subscribe(items => {
                    if (items.length) {
                        this.selectedItem = {
                            id: items[0].id,
                            summary_text: items[0].summary_text,
                            module: this.module,
                            data: items[0]
                        };
                        // reset the current loaded template
                        this.blobUrl = null;
                        this.compiled_selected_template = null;

                        // trigger change detection and render the template
                        this.rendertemplate();
                    }
                })
            );
        });
    }

    /**
     * clears the field with the selected parent
     */
    private clearField() {
        this.selectedItem = undefined;
        this.blobUrl = null;
        this.compiled_selected_template = null;

        // trigger change detection
        this.cdRef.detectChanges();
    }

    /**
     * renders the preview
     */
    private rendertemplate() {
        this.loading_output = true;

        this.blobUrl = null;
        this.compiled_selected_template = null;

        this.cdRef.detectChanges();

        let postBody: any = {
            parentype: this.module,
            parentid: this.selectedItem.id,
            body: this.model.getField('body'),
            header: this.model.getField('header'),
            footer: this.model.getField('footer'),
            stylesheet_id: this.model.getField('stylesheet_id'),
            page_orientation: this.model.getField('page_orientation'),
            page_size: this.model.getField('page_size'),
            margin_left: this.model.getField('margin_left'),
            margin_top: this.model.getField('margin_top'),
            margin_right: this.model.getField('margin_right'),
            margin_bottom: this.model.getField('margin_bottom'),
            id: this.model.id
        };

        switch (this.outputformat) {
            case 'pdf':
                this.backend.postRequest(`module/OutputTemplates/previewpdf`, {}, postBody).subscribe(
                    pdf => {
                        let blob = this.datatoBlob(atob(pdf.content));
                        this.blobUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
                        this.loading_output = false;
                        this.cdRef.detectChanges();
                    },
                    err => {
                        this.toast.sendToast(this.language.getLabel('ERR_PROCESSING_OUTPUT_TEMPLATE'), 'error', err.error.error.message );
                        this.loading_output = false;
                        this.cdRef.detectChanges();
                    }
                );
                break;
            case 'html':

                // compile the template to show the user...
                this.backend.postRequest(`module/OutputTemplates/previewhtml`, {}, postBody).subscribe(
                    res => {
                        this.compiled_selected_template = res.content;
                        this.loading_output = false;
                        this.cdRef.detectChanges();
                    },
                    err => {
                        this.toast.sendToast(this.language.getLabel('ERR_PROCESSING_OUTPUT_TEMPLATE'), 'error', err.error.error.message );
                        this.loading_output = false;
                        this.cdRef.detectChanges();
                    }
                );
                break;
        }
    }

    /**
     * internal function to translate the data to a BLOL URL
     *
     * @param byteCharacters the file data
     * @param contentType the type
     * @param sliceSize optional parameter to change performance
     */
    private datatoBlob(byteCharacters, contentType = '', sliceSize = 512) {
        let byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            let slice = byteCharacters.slice(offset, offset + sliceSize);

            let byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            let byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        let blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }

}
