/**
 * @module ObjectComponents
 */
import { Component, EventEmitter, ViewContainerRef } from '@angular/core';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {modal} from "../../services/modal.service";
import {backend} from "../../services/backend.service";
import {configurationService} from "../../services/configuration.service";

@Component({
    selector: 'object-action-output-bean-button',
    templateUrl: './src/objectcomponents/templates/objectactionoutputbeanbutton.html'
})
export class ObjectActionOutputBeanButton {

    private templates: any[] = [];
    public forcedFormat: 'html'|'pdf';
    public modalTitle: string;
    public noDownload: boolean;
    public handBack: EventEmitter<string>;
    public buttonText: string;

    constructor(
        protected language: language,
        protected model: model,
        protected modal: modal,
        protected backend: backend,
        protected configuration: configurationService,
        protected viewContainerRef: ViewContainerRef
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
                let params = {
                    limit: '-99',
                    fields: ['id', 'name', 'language'],
                    searchfields:
                        {
                            join: 'AND',
                            conditions: [
                                {field: 'module_name', operator: '=', value: this.model.module}
                            ]
                        }
                };

                this.backend.getRequest('module/OutputTemplates', params).subscribe(
                    (data: any) => {
                        waitingModal.instance.self.destroy();

                        let list = data.list;
                        for (let template of list) {
                            this.templates.push({
                                id: template.id,
                                name: template.name,
                                language: template.language,
                            });
                        }

                        // write back to the config service for faster load the next time
                        outPutTemplates[this.model.module] = this.templates;
                        this.configuration.setData('OutputTemplates', outPutTemplates)

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


    private openOutput() {
        if (this.templates.length > 0) {
            // sort the templates
            this.templates.sort((a, b) => a.name > b.name ? 1 : -1);

            // open the modal
            this.modal.openModal('ObjectActionOutputBeanModal', true, this.viewContainerRef.injector).subscribe(outputModal => {
                outputModal.instance.templates = this.templates;
                outputModal.instance.modalTitle = this.modalTitle;
                outputModal.instance.noDownload = this.noDownload;
                outputModal.instance.handBack = this.handBack;
                outputModal.instance.buttonText = this.buttonText;
            });
        } else {
            this.modal.info('No Templates Found', 'there are no Output templates defined for the Module');
        }
    }
}
