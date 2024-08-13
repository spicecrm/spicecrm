import {Component, ChangeDetectorRef} from "@angular/core";
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {modellist} from '../../../services/modellist.service';
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

    public outputTemplates :any[] = [];

    public _selectedTemplate :string = '';

    public templateId :string = '';

    public selectedItems :any[] = []

    public blobUrl :any;

    public base64string :string = '';

    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        // public modellist: modellist,
        public modal: modal,
        public backend: backend,
        public cdRef: ChangeDetectorRef,
        public sanitizer: DomSanitizer,
        public helper: helper,
        public relatedmodels: relatedmodels
    ) {
        this.relatedmodels.getData();
    }

    public close() :void {
        this.self.destroy();
    }

    ngOnInit() :void {
        // this.backend.getRequest('module/OutputTemplates/formodule/' + this.modellist.module, {}).subscribe(res => {
        //     this.outputTemplates = res;
        //     this._selectedTemplate = res[0].id
        //     this.renderPreview();
        // })
    }

    public downloadBulk() :void {
        this.helper.downloadFileInBrowser(this.base64string, 'application/pdf', 'testing')
    }

    get selectedTemplate(): string {
        return this._selectedTemplate;
    }

    set selectedTemplate(value: string) {
        this._selectedTemplate = value;
        this.renderPreview();
    }

    public renderPreview() {

        let body = {
            beanIds: this.selectedItems,
        }

        // this.backend.putRequest(`/module/OutputTemplates/${this.selectedTemplate}/formodule/${this.modellist.module}/generateBulkPDF`, {}, body).subscribe(pdf => {
        //     this.base64string = pdf.content;
        //
        //     let blob = this.helper.datatoBlob(atob(pdf.content), 'application/pdf')
        //     this.blobUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob))
        //     this.cdRef.detectChanges();
        // })
    }
}