/**
 * @module ModuleSalesDocs
 */
import { Component, EventEmitter, ViewContainerRef } from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from "../../../services/modal.service";
import {backend} from "../../../services/backend.service";
import {configurationService} from "../../../services/configuration.service";

@Component({
    selector: 'salesdocs-action-output-bean-button',
    templateUrl: '../templates/salesdocsactionoutputbeanbutton.html'
})
export class SalesDocsActionOutputBeanButton {

    public templates: any[] = [];
    public forcedFormat: 'html'|'pdf';
    public modalTitle: string;
    public noDownload: boolean;
    public handBack: EventEmitter<string>;
    public buttonText: string;
    /**
     * holds the action config
     */
    public actionconfig: {modal_actionset: string};

    constructor(
        public language: language,
        public model: model,
        public modal: modal,
        public backend: backend,
        public configuration: configurationService,
        public viewContainerRef: ViewContainerRef
    ) {

    }

    public execute() {
        let waitingModal: any;


            let loadingModal = this.modal.await('LBL_LOADING');
            this.backend.getRequest(`module/SalesDocs/${this.model.id}/oututtemplates`, {}).subscribe({
                next: (data: any) => {

                    // set the templates internally
                    this.templates = data;

                    loadingModal.emit(true);

                    // open the output
                    this.openOutput();
                },
                error: (error: any) => {
                    loadingModal.emit(true);
                }
            });

    }

    public openOutput() {
        if (this.templates.length > 0) {
            // sort the templates
            this.templates.sort((a, b) => a.name > b.name ? 1 : -1);

            // open the modal
            this.modal.openModal('ObjectActionOutputBeanModal', true, this.viewContainerRef.injector).subscribe(outputModal => {
                outputModal.instance.templates = this.templates;
                outputModal.instance.modalTitle = this.modalTitle;
                outputModal.instance.noDownload = this.noDownload;
                outputModal.instance.handBack = this.handBack;
                outputModal.instance.customActionsetId = this.actionconfig.modal_actionset;
                outputModal.instance.buttonText = this.buttonText;
            });
        } else {
            this.modal.info('No Templates Found', 'there are no Output templates defined for the Module');
        }
    }
}
