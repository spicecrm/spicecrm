import {Component, ChangeDetectorRef} from "@angular/core";
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {modellist} from '../../../services/modellist.service';
import {modal} from '../../../services/modal.service';
import {model} from '../../../services/model.service';
import {backend} from "../../../services/backend.service";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {helper} from "../../../services/helper.service";
import {tap} from "rxjs/operators";
import {Observable} from "rxjs";


@Component({
    selector: 'object-action-output-pdf-modal',
    templateUrl: '../templates/objectactionoutputpdfmodal.html',
})
export class ObjectActionOutputPdfModal {

    public self :any = {};

    /**
     * Available output templates corresponding to the module
     */
    public outputTemplates :any[] = [];

    /**
     * Selected template
     */
    public _selectedTemplate :string = '';

    /**
     * Template ID needed for the request
     */
    public templateId :string = '';

    /**
     * Array of selected items (ID's) from the list view
     */
    public selectedItems: string[] = []

    /**
     * Url in charge of displaying the PDF in the UI
     */
    public blobUrl :any;

    /**
     * Base64 string required when downloading the file from the UI
     */
    public base64content : string;

    /**
     * Number of items displayed per page, configurable in the 'config' table
     */
    public bucketMaxItems :number;

    /**
     * Array of arrays holding IDs. Each array's size is limited by bucketMaxItems.
     * Used when sending separate requests based on the currentIndex i.e. page we're on
     */
    public splitArray :any[] = [];

    /**
     * current index of the splitArray
     */
    public currentIndex :number = 0;

    /**
     * loading state
     */
    public isLoading :boolean = false;

    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        public modellist: modellist,
        public modal: modal,
        public backend: backend,
        public cdRef: ChangeDetectorRef,
        public sanitizer: DomSanitizer,
        public helper: helper,
    ) {
        this.bucketMaxItems = +(this.model.configuration.getCapabilityConfig('outputtemplates')?.bucketMaxItems ?? 5);
        this.selectedItems = this.modellist.getSelectedIDs();
    }

    public close() :void {
        this.self.destroy();
    }

    ngOnInit() :void {
        this.backend.getRequest('module/OutputTemplates/formodule/' + this.modellist.module, {}).subscribe(res => {
            this.outputTemplates = res;
            this._selectedTemplate = res[0].id
            this.getTranslatedPdfContent();
        })

        this.splitArrayBasedOnbucketMaxItems();
    }

    /**
     * splitting the array according to the maximum items allowed per page
     */
    public splitArrayBasedOnbucketMaxItems() {
        for (let i = 0; i < this.selectedItems.length; i += this.bucketMaxItems) {
            this.splitArray.push(this.selectedItems.slice(i, i + this.bucketMaxItems));
        }
    }

    /**
     * download all pages
     */
    public downloadBulk() :void {
        this.getPdfContent({beanIds: this.selectedItems}).subscribe(pdf => {
            let fileName = `${this.modellist.module} PDF Export - ${this.numberOfItems} ${this.language.getLabel('LBL_OF')} ${this.totalItems}`;
            this.helper.downloadFileInBrowser(pdf.content, 'application/pdf', fileName);
        });
    }

    get selectedTemplate(): string {
        return this._selectedTemplate;
    }

    set selectedTemplate(value: string) {
        this._selectedTemplate = value;
        this.getTranslatedPdfContent();
    }

    public getTranslatedPdfContent() {

        let body = {
            beanIds: this.splitArray[this.currentIndex]
        }

        this.getPdfContent(body).subscribe({
            next: pdf => {
                this.base64content = pdf.content;
                this.renderPreview();
            }
        });

    }

    /**
     * get the pdf content in base64 format
     * @param body
     * @private
     */
    private getPdfContent(body: {beanIds: string[]}): Observable<{content: string}> {

        this.isLoading = true;

        return this.backend.putRequest(`module/OutputTemplates/${this.selectedTemplate}/formodule/${this.modellist.module}/generateBulkPDF`, {}, body).pipe(tap({
            next: () => {
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
                this.model.toast.sendToast('ERR_FAILED_TO_EXECUTE', 'error');
            }
        }));
    }

    public renderPreview() {
        let blob = this.helper.datatoBlob(atob(this.base64content), 'application/pdf')
        this.blobUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob))
    }

    public reload() {
        this.getTranslatedPdfContent();
    }

    public previousPage() {
        if(this.currentIndex == 0) return;

        this.currentIndex--;

        this.getTranslatedPdfContent();
    }

    get previousDisabled() {
       return this.currentIndex == 0;
    }

    public nextPage() {
        this.currentIndex += 1;
        this.getTranslatedPdfContent();
    }

    get nextDisabled() {
        return this.numberOfItems == this.totalItems;
    }

    get numberOfItems() {
        let currentNumberOfDisplayedItems = (this.currentIndex + 1) * this.bucketMaxItems
        return currentNumberOfDisplayedItems > this.selectedItems.length ? this.selectedItems.length : currentNumberOfDisplayedItems;
    }

    get totalItems() {
        return this.selectedItems.length;
    }
}