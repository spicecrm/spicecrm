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
    templateUrl: "../templates/outputtemplatespreview.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutputTemplatesPreview {

    /**
     * the output format
     */
    public _outputformat: 'html' | 'pdf' = 'pdf';

    /**
     * indicates that the system is rendering the preview
     */
    public loading_output: boolean = false;

    /**
     * any susbcriptions we might have
     */
    public subscriptions: Subscription = new Subscription();

    /**
     * the selected item
     */
    public selectedItem: any;

    /**
     * the response of the compiler
     */
    public compiled_selected_template: string = '';

    /**
     * the blobURL. This is handled internally. When the data is sent this is created so the object can be rendered in the modal
     */
    public blobUrl: any;

    constructor(public language: language, public backend: backend, public metadata: metadata, public model: model, public modal: modal, public sanitizer: DomSanitizer, public cdRef: ChangeDetectorRef, public toast: toast ) {
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
    public checkModelChanges() {
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
    public searchWithModal() {
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
    public clearField() {
        this.selectedItem = undefined;
        this.blobUrl = null;
        this.compiled_selected_template = null;

        // trigger change detection
        this.cdRef.detectChanges();
    }

    /**
     * renders the preview
     */
    public rendertemplate() {
        this.loading_output = true;

        this.blobUrl = null;
        this.compiled_selected_template = null;

        this.cdRef.detectChanges();

        let postBody: any = {
            language: this.model.getField('language'),
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
    public datatoBlob(byteCharacters, contentType = '', sliceSize = 512) {
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
