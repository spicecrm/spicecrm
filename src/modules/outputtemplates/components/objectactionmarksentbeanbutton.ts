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
    templateUrl: '../templates/objectactionmarksentbeanbutton.html'
})
export class ObjectActionMarkSentBeanButton extends ObjectActionOutputBeanButton {

    /**
     * emit the action to the container
     */
    @Output() public actionemitter = new EventEmitter<{close: boolean, name: string}>();

    constructor(
        public language: language,
        public model: model,
        public modal: modal,
        public backend: backend,
        public configuration: configurationService,
        public toast: toast,
        public outputModalService: outputModalService,
        public viewContainerRef: ViewContainerRef
    ) {
        super(language, model, modal, backend, configuration, viewContainerRef);
    }

    public execute() {

        if (!this.outputModalService.selectedTemplate) return;

        const templateId = this.outputModalService.selectedTemplate.id;

        let modelData = this.model.utils.spiceModel2backend('Letters', this.model.data);

        this.backend.postRequest(`module/Letters/${this.model.id}/marksent/${templateId}`, null, modelData).subscribe(res => {

            this.actionemitter.emit({close: true, name: 'marksent'});

            if (res?.success) {
                this.toast.sendToast(this.language.getLabel('LETTER_MARKED_AS_SENT'), 'success');
                this.model.setField('letter_status', 'sent');
            } else {
                this.toast.sendToast(this.language.getLabel('ERR_FAILED_TO_EXECUTE'), 'error');
            }
        });
    }
}
