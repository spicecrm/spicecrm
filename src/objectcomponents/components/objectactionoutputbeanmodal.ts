import {Component, EventEmitter, Input, Output} from '@angular/core';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {modal} from "../../services/modal.service";
import {view} from "../../services/view.service";
import {backend} from "../../services/backend.service";
import {DomSanitizer} from '@angular/platform-browser';
import {SystemLoadingModal} from "../../systemcomponents/components/systemloadingmodal";

@Component({
    selector: 'object-action-output-bean-modal',
    templateUrl: './app/objectcomponents/templates/objectactionoutputbeanmodal.html',
    providers: [model, view],
})
export class ObjectActionOutputBeanModal {

    self: any = undefined;
    templates = [];
    private _selected_template = null;
    compiled_selected_template: string = '';

    loading_output: boolean = false;

    constructor(
        private language: language,
        private model: model,
        private modal: modal,
        private view: view,
        private backend: backend,
        private sanitizer: DomSanitizer
    ) {

    }

    ngOnInit() {
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
        this.loading_output = true;
        this._selected_template = val;
        // compile the template to show the user...
        this.backend.getRequest(`OutputTemplates/${this.selected_template.id}/compile/${this.model.id}`).subscribe(
            res => {
                this.compiled_selected_template = res.content;
                this.loading_output = false;
            },
            err => {
                this.loading_output = true;
            }
        );
    }

    get selected_template() {
        return this._selected_template;
    }

    get sanitizedTemplated() {
        return this.sanitizer.bypassSecurityTrustHtml(this.compiled_selected_template)
    }

    close() {
        this.self.destroy();
    }

    download() {
        let fileName = this.model.module + '_' + this.model.data.summary_text + '.pdf';
        this.modal.openModal('SystemLoadingModal').subscribe(loadingCompRef => {
            loadingCompRef.instance.messagelabel = 'MSG_GENERATING_PDF';
            this.backend.downloadFile(
                {
                    route: `OutputTemplates/${this.selected_template.id}/convert/${this.model.id}/to/pdf`
                }, fileName
            ).subscribe(
                next => {
                    loadingCompRef.instance.self.destroy();
                },
                err =>{
                    loadingCompRef.instance.self.destroy();
                }
            );

        })
    }
}