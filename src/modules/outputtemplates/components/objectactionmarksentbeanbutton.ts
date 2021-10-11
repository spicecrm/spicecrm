/**
 * @module ObjectComponents
 */
import {Component, EventEmitter, Output, ViewContainerRef} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";

import {ObjectActionOutputBeanButton} from "./objectactionoutputbeanbutton";
import {modal} from "../../../services/modal.service";
import {configurationService} from "../../../services/configuration.service";
import {toast} from "../../../services/toast.service";
import {outputModalService} from "../services/outputmodal.service";

@Component({
    selector: 'object-action-mark-sent-bean-button',
    templateUrl: './src/modules/outputtemplates/templates/objectactionmarksentbeanbutton.html'
})
export class ObjectActionMarkSentBeanButton extends ObjectActionOutputBeanButton {

    /**
     * emit the action to the container
     */
    @Output() public actionemitter = new EventEmitter<{close: boolean, name: string}>();

    constructor(
        protected language: language,
        protected model: model,
        protected modal: modal,
        protected backend: backend,
        protected configuration: configurationService,
        protected toast: toast,
        protected outputModalService: outputModalService,
        protected viewContainerRef: ViewContainerRef
    ) {
        super(language, model, modal, backend, configuration, viewContainerRef);
    }

    public execute() {

        if (!this.outputModalService.selectedTemplate) return;

        const templateId = this.outputModalService.selectedTemplate.id;

        this.backend.postRequest(`module/Letters/${this.model.id}/marksent/${templateId}`, null, this.model.data).subscribe(res => {

            this.actionemitter.emit({close: true, name: 'marksent'});

            if (res?.success) {
                this.toast.sendToast(this.language.getLabel('LETTER_MARKED_AS_SENT'), 'success');
            } else {
                this.toast.sendToast(this.language.getLabel('ERR_FAILED_TO_EXECUTE'), 'error');
            }
        });
    }
}
