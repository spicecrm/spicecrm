import {Component, ChangeDetectorRef, Optional} from "@angular/core";
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {modal} from '../../../services/modal.service';
import {model} from '../../../services/model.service';
import {backend} from "../../../services/backend.service";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {helper} from "../../../services/helper.service";
import {relatedmodels} from "../../../services/relatedmodels.service";


@Component({
    selector: 'object-action-related-outputpdf-modal',
    templateUrl: '../templates/objectactionrelatedoutpudpdfmodal.html',
})
export class ObjectActionRelatedOutputPdfModal {

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
     * Offsetting the number of items sent in the request
     */
    public offset :number = 0;

    /**
     * loading state
     */
    public isLoading :boolean = false;

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

    public close() :void {
        this.self.destroy();
    }

    ngOnInit() :void {
        this.backend.getRequest('module/OutputTemplates/formodule/' + this.relatedmodels.relatedModule, {}).subscribe(res => {
            this.outputTemplates = res;
            this._selectedTemplate = res[0].id
            this.getTranslatedPdfContent();
        })
    }

    public downloadBulk() :void {

        let fileName = `${this.relatedmodels.relatedModule} PDF Export - ${this.numberOfItems} ${this.language.getLabel('LBL_OF')} ${this.totalItems}`;
        this.helper.downloadFileInBrowser(this.base64content, 'application/pdf', fileName)
    }

    get selectedTemplate(): string {
        return this._selectedTemplate;
    }

    set selectedTemplate(value: string) {
        this._selectedTemplate = value;
        this.getTranslatedPdfContent();
    }

    public getTranslatedPdfContent() {
        this.isLoading = true;

        const params: any = {
            module: this.relatedmodels.relatedModule,
            modulefilter: this.relatedmodels.modulefilter,
            fieldfilters: this.relatedmodels.fieldfilters,
            offset: this.offset,
            getcount: true,
            limit: this.bucketMaxItems
        };

        if (this.relatedmodels.sortfield) {
            params.sort = JSON.stringify(this.relatedmodels.sortfield);
        }

        this.backend.putRequest(`module/OutputTemplates/${this.selectedTemplate}/formodule/${this.relatedmodels.module}/${this.relatedmodels.id}/related/${this.relatedmodels._linkName}/generateBulkPDF`, params).subscribe(res => {
            this.base64content = res.content;
            this.renderPreview()

            this.isLoading = false;
        })
    }

    public renderPreview() {
        let blob = this.helper.datatoBlob(atob(this.base64content), 'application/pdf')
        this.blobUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob))
    }

    public reload() {
        this.getTranslatedPdfContent();
    }

    public previousPage() {
        if(this.offset <= 0) return;

        this.offset -= this.bucketMaxItems;
        this.getTranslatedPdfContent();
    }

    public nextPage() {
        if (this.offset > this.relatedmodels.count) return;
        this.offset += this.bucketMaxItems;

        this.getTranslatedPdfContent();
    }

    get previousDisabled() {
        return this.offset <= 0;
    }

    get nextDisabled() {
        return this.numberOfItems == this.totalItems;
    }

    get totalItems() {
        return this.relatedmodels.count;
    }

    get numberOfItems() {
        let currentNumberOfItems = this.offset + this.bucketMaxItems;
        return currentNumberOfItems > this.relatedmodels.count ? this.relatedmodels.count : currentNumberOfItems;
    }
}