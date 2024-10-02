import {Component, ChangeDetectorRef, Optional} from "@angular/core";
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {modal} from '../../../services/modal.service';
import {model} from '../../../services/model.service';
import {backend} from "../../../services/backend.service";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {helper} from "../../../services/helper.service";
import {relatedmodels} from "../../../services/relatedmodels.service";
import {Observable, Subject} from "rxjs";
import {tap} from "rxjs/operators";

@Component({
    selector: 'object-action-related-outputpdf-modal',
    templateUrl: '../templates/objectactionrelatedoutpudpdfmodal.html',
})

export class ObjectActionRelatedOutputPdfModal {

    public self: any = {};

    /**
     * Available output templates corresponding to the module
     */
    public outputTemplates: any[] = [];

    /**
     * Selected template
     */
    public _selectedTemplate: string = '';

    /**
     * Template ID needed for the request
     */
    public templateId: string = '';

    /**
     * Url in charge of displaying the PDF in the UI
     */
    public blobUrl: any;

    /**
     * Base64 string required when downloading the file from the UI
     */
    public base64content: string;

    /**
     * Number of items displayed per page, configurable in the 'config' table
     */
    public bucketMaxItems: number;

    /**
     * Offsetting the number of items sent in the request
     */
    public offset: number = 0;

    /**
     * loading state
     */
    public isLoading: boolean = false;

    /**
     * download all related items
     */
    public downloadAll: boolean = true;

    /**
     * defining from which item should the bulk download begin
     */
    public from: number;

    /**
     * defining the last item for the download
     */
    public to: number;

    public fromValid: boolean = false;

    public toValid: boolean = false;

    /**
     * params for the request
     */
    public params: {
        module?: string;
        modulefilter?: string;
        fieldfilters?: string;
        getcount?: boolean;
        offset?: number;
        limit?: number;
        sort?: string;
    } = {}

    public testing: Promise<any>;

    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        public modal: modal,
        public backend: backend,
        public cdRef: ChangeDetectorRef,
        public sanitizer: DomSanitizer,
        public helper: helper,
        public relatedmodels: relatedmodels
    ) {
        this.bucketMaxItems = +(this.model.configuration.getCapabilityConfig('outputtemplates')?.bucketMaxItems ?? 5);

    }

    public close(): void {
        this.self.destroy();
    }

    ngOnInit(): void {
        this.backend.getRequest('module/OutputTemplates/formodule/' + this.relatedmodels.relatedModule, {}).subscribe(res => {
            this.outputTemplates = res;
            this._selectedTemplate = res[0].id
            this.getTranslatedPdfContent();
        })
    }

    /**
     * download the selected amount of items
     */
    public downloadBulk(): void {

        this.params = {
            ...this.params,
            offset: this.offset,
            limit: -99
        }

        let fileName = `${this.relatedmodels.relatedModule}_PDF_Export_${this.language.getLabel('LBL_ALL')}_${this.language.getLabel('LBL_PAGES')}`;

        if (!this.downloadAll) {
            // validates the inputs and generates a new file name
            fileName = this.validateOnDownload();
        }

        this.getPdfContent(this.params).subscribe({
            next: () => {
                this.helper.downloadFileInBrowser(this.base64content, 'application/pdf', fileName);
            }
        });
    }

    /**
     * Validate inputs on each keystroke and disables/enables the download
     */
    public validateOnInput() {
        this.fromValid = this.from < 0 || this.from > this.relatedmodels.count;
        this.toValid = this.to > this.relatedmodels.count || this.to < 0;
    }

    /**
     * Validate inputs when the download button is clicked
     * If one of the inputs is missing, it populates the missing one
     * generates the new file name based on the inputs
     */
    public validateOnDownload() {
        let calculatedLimit: number;
        let calculatedOffset: number = 0;  // default to 0
        let fileName: string;

        if (!this.to) {
            this.to = this.relatedmodels.count;
        }

        if (!this.from) {
            this.from = 1;
        }

        if (this.from === this.to) {
            calculatedLimit = 1;
        } else if (this.from < this.to) {
            calculatedLimit = (this.to - this.from) + 1;
        } else if (this.from > this.to) {
            this.from = 1;
            this.to = this.relatedmodels.count;
        }

        this.params = {
            ...this.params,
            offset: calculatedOffset,
            limit: calculatedLimit
        };

        fileName = `${this.relatedmodels.relatedModule}_PDF_Export_${this.language.getLabel('LBL_PAGES')}_${this.from}-${this.to}`;

        return fileName;
    }

    get selectedTemplate(): string {
        return this._selectedTemplate;
    }

    set selectedTemplate(value: string) {
        this._selectedTemplate = value;
        this.getTranslatedPdfContent();
    }

    /**
     * translate the html content to base64 and present it in the modal
     */
    public getTranslatedPdfContent() {

        this.params = {
            module: this.relatedmodels.relatedModule,
            modulefilter: this.relatedmodels.modulefilter,
            fieldfilters: this.relatedmodels.fieldfilters,
            getcount: true,
            offset: this.offset,
            limit: this.bucketMaxItems
        };

        if (this.relatedmodels.sortfield) {
            this.params.sort = JSON.stringify(this.relatedmodels.sortfield);
        }

        this.getPdfContent(this.params).subscribe({
            next: () => {
                this.renderPreview()
            }
        });
    }

    /**
     * Generates a PDF for the selected related items and returns the content as a base64 string.
     * @param params - Parameters for generating the bulk PDF.
     * @returns An observable containing the base64 content of the generated PDF.
     */
    public getPdfContent(params): Observable<{ content: string }> {
        this.isLoading = true;

        return this.backend.putRequest(`module/OutputTemplates/${this.selectedTemplate}/formodule/${this.relatedmodels.module}/${this.relatedmodels.id}/related/${this.relatedmodels._linkName}/generateBulkPDF`, params).pipe(tap({
            next: (res) => {
                this.isLoading = false;
                this.base64content = res.content;
            },
            error: () => {
                this.isLoading = false;
                this.model.toast.sendToast('ERR_FAILED_TO_EXECUTE', 'error');
            }
        }));
    }

    /**
     * render the preview of the selected items
     */
    public renderPreview() {
        let blob = this.helper.datatoBlob(atob(this.base64content), 'application/pdf')
        this.blobUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob))
    }

    public reload() {
        this.getTranslatedPdfContent();
    }

    /**
     * display navigation
     */
    public previousPage() {
        if (this.offset <= 0) return;

        this.offset -= this.bucketMaxItems;
        this.getTranslatedPdfContent();
    }

    public nextPage() {
        if (this.offset > this.relatedmodels.count) return;
        this.offset += this.bucketMaxItems;

        this.getTranslatedPdfContent();
    }

    /**
     * determining the disabled state based on the page position
     */
    get previousDisabled() {
        return this.offset <= 0;
    }

    get nextDisabled() {
        return this.numberOfItems == this.totalItems;
    }

    get totalItems() {
        return this.relatedmodels.count;
    }

    /**
     * number of items based on the page count
     */
    get numberOfItems() {
        let currentNumberOfItems = this.offset + this.bucketMaxItems;
        return currentNumberOfItems > this.relatedmodels.count ? this.relatedmodels.count : currentNumberOfItems;
    }

    /**
     * check the validation of the inputs and enables/disables the download
     */
    public canDownload() {
        if (this.downloadAll) return false;

        if ((!this.from && !this.to) || (this.fromValid || this.toValid)) return true;

        return this.from && this.to && this.from > this.to;
    }

}