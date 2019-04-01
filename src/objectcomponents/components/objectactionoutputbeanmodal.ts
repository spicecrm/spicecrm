/**
 * @module ObjectComponents
 */
import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {modal} from "../../services/modal.service";
import {view} from "../../services/view.service";
import {backend} from "../../services/backend.service";
import {DomSanitizer} from '@angular/platform-browser';
import {SystemLoadingModal} from "../../systemcomponents/components/systemloadingmodal";

@Component({
    selector: 'object-action-output-bean-modal',
    templateUrl: './src/objectcomponents/templates/objectactionoutputbeanmodal.html',
    providers: [view],
})
export class ObjectActionOutputBeanModal {

    public self: any = undefined;
    private templates = [];

    private _selected_template = null;
    private _selected_format: 'html' | 'pdf' = 'pdf';

    private compiled_selected_template: string = '';
    private loading_output: boolean = false;


    /**
     * the blobURL. This is handled internally. When the data is sent this is created so the object can be rendered in the modal
     */
    private blobUrl: any;

    constructor(
        private language: language,
        private model: model,
        private modal: modal,
        private view: view,
        private backend: backend,
        private sanitizer: DomSanitizer
    ) {

    }

    public ngOnInit() {
        let params = {
            searchfields:
                {
                    join: 'AND',
                    conditions: [
                        {field: 'module_name', operator: '=', value: this.model.module}
                    ]
                }
        };

        this.backend.all('OutputTemplates', params).subscribe(
            (data: any) => {
                this.templates = data;
            }
        );
    }

    set selected_template(val) {
        this._selected_template = val;
        this.rendertemplate();
    }

    get selected_template() {
        return this._selected_template;
    }

    get selected_format(): 'pdf' | 'html' {
        return this._selected_format;
    }

    set selected_format(format) {
        this._selected_format = format;
        this.rendertemplate();
    }

    get sanitizedTemplated() {
        return this.sanitizer.bypassSecurityTrustHtml(this.compiled_selected_template);
    }

    private rendertemplate() {
        this.loading_output = true;

        this.blobUrl = null;
        this.compiled_selected_template = null;

        switch (this.selected_format) {
            case 'pdf':
                this.backend.getRequest(`OutputTemplates/${this.selected_template.id}/convert/${this.model.id}/to/pdf/base64`).subscribe(
                    pdf => {
                        let blob = this.datatoBlob(atob(pdf.content));
                        this.blobUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
                        this.loading_output = false;
                    },
                    err => {
                        this.loading_output = false;
                    }
                );
                break;
            case 'html':
                // compile the template to show the user...
                this.backend.getRequest(`OutputTemplates/${this.selected_template.id}/compile/${this.model.id}`).subscribe(
                    res => {
                        this.compiled_selected_template = res.content;
                        this.loading_output = false;
                    },
                    err => {
                        this.loading_output = false;
                    }
                );
                break;
        }
    }

    private close() {
        this.self.destroy();
    }

    private download() {
        let fileName = this.model.module + '_' + this.model.data.summary_text + '.pdf';
        this.modal.openModal('SystemLoadingModal').subscribe(loadingCompRef => {
            loadingCompRef.instance.messagelabel = 'MSG_GENERATING_PDF';
            this.backend.downloadFile(
                {
                    route: `OutputTemplates/${this.selected_template.id}/convert/${this.model.id}/to/pdf`
                }, fileName, 'application/pdf'
            ).subscribe(
                next => {
                    loadingCompRef.instance.self.destroy();
                },
                err => {
                    loadingCompRef.instance.self.destroy();
                }
            );
        });
    }

    /**
     * a setter for the data
     *
     * @param data the raw data of the object being passed in. When the data is pased in the bloburl is created
     */
    set data(data) {
        let blob = this.datatoBlob(data);
        this.blobUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
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
