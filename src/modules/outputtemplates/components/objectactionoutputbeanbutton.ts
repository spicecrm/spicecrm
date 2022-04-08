/**
 * @module ObjectComponents
 */
import { Component, EventEmitter, ViewContainerRef } from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from "../../../services/modal.service";
import {backend} from "../../../services/backend.service";
import {configurationService} from "../../../services/configuration.service";

@Component({
    selector: 'object-action-output-bean-button',
    templateUrl: '../templates/objectactionoutputbeanbutton.html'
})
export class ObjectActionOutputBeanButton {

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

        let outPutTemplates = this.configuration.getData('OutputTemplates');
        if (outPutTemplates && outPutTemplates[this.model.module]) {
            this.templates = outPutTemplates[this.model.module];
            this.openOutput();
        } else {
            outPutTemplates = {};
            this.modal.openModal('SystemLoadingModal', false).subscribe(waitingModal => {
                waitingModal.instance.messagelabel = 'Loading Templates';
                this.backend.getRequest('module/OutputTemplates/formodule/'+this.model.module, {}).subscribe(
                    (data: any) => {
                        // kill the watign modal
                        waitingModal.instance.self.destroy();
                        // set the templates
                        this.configuration.setData('OutputTemplates', data);

                        // set the templates internally
                        this.templates = data;

                        // open the output
                        this.openOutput();
                    },
                    (error: any) => {
                        waitingModal.instance.self.destroy();
                    }
                );
            });
        }
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
