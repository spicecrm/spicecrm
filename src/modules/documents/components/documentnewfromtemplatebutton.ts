/**
 * @module ModuleDocuments
 */
import {Component, EventEmitter, OnDestroy, ViewContainerRef} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from "../../../services/modal.service";
import {backend} from "../../../services/backend.service";
import {configurationService} from "../../../services/configuration.service";
import {Subscription} from "rxjs";
import {relatedmodels} from "../../../services/relatedmodels.service";
import {view} from "../../../services/view.service";

@Component({
    selector: 'document-new-from-template-button',
    templateUrl: '../templates/documentnewfromtemplatebutton.html',
    providers: [model]
})
export class DocumentNewFromTemplateButton {

    public templates: any[] = [];
    public forcedFormat: 'html'|'pdf';
    public modalTitle: string;
    public noDownload: boolean;
    public handBack: EventEmitter<string>;
    public buttonText: string;
    public subscriptions = new Subscription();

    /**
     * holds the action config
     */
    public actionconfig: any = {};

    constructor(
        public language: language,
        public model: model,
        public modal: modal,
        public backend: backend
    ) {
        this.model.module = 'Documents';
    }

    public execute() {
        this.modal.openModal('ObjectModalModuleLookup').subscribe(selectModal => {
            selectModal.instance.module = this.model.module;
            selectModal.instance.multiselect = false;
            selectModal.instance.modulefilter = this.actionconfig.modulefilter;

            selectModal.instance.selectedItems.subscribe(items => {
                this.model.id = this.model.utils.generateGuid();
                this.model.initialize();
                let presets = {
                    file_name: items[0].file_name,
                    file_mime_type: items[0].file_mime_type,
                    file_md5: items[0].file_md5,
                    file_pdf_name: items[0].file_pdf_name,
                    file_pdf_mime_type: items[0].file_pdf_mime_type,
                    file_pdf_md5: items[0].file_pdf_md5
                }
                this.model.addModel(null, null, presets, false, {componentset: this.actionconfig.componentset, actionset: this.actionconfig.actionset});
            });
        });

    }
}
