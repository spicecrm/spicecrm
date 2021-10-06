/**
 * @module ObjectComponents
 */
import {Component, EventEmitter, ViewContainerRef} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";

import {ObjectActionOutputBeanButton} from "./objectactionoutputbeanbutton";
import {modelattachments} from "../../../services/modelattachments.service";
import {modal} from "../../../services/modal.service";
import {configurationService} from "../../../services/configuration.service";
import {toast} from "../../../services/toast.service";
import {broadcast} from "../../../services/broadcast.service";

@Component({
    selector: 'object-action-mark-sent-bean-button',
    templateUrl: './src/modules/outputtemplates/templates/objectactionmarksentbeanbutton.html',
    providers: [modelattachments]
})
export class ObjectActionMarkSentBeanButton extends ObjectActionOutputBeanButton {

    private selectedTemplate: {id: string, name: string};

    constructor(
        protected language: language,
        protected model: model,
        protected modal: modal,
        protected backend: backend,
        protected configuration: configurationService,
        protected toast: toast,
        protected broadcast: broadcast,
        protected viewContainerRef: ViewContainerRef

    ) {
        super(language, model, modal, backend, configuration, viewContainerRef);
        this.subscribeToTemplateIdChange();
    }

    private subscribeToTemplateIdChange() {
        this.broadcast.message$.subscribe(res => {
            if (res.messagetype != 'outputtemplate.selected.change') return;

            this.selectedTemplate = res.messagedata;
        });
    }


    public execute() {

        if (!this.selectedTemplate) return;

        this.backend.postRequest(`module/Letters/${this.model.id}/marksent/${this.selectedTemplate.id}`, null, this.model.data).subscribe(res => {
            if (res?.success) {
                this.toast.sendToast('');
            } else {
                this.toast.sendToast('');
            }
        });
    }
}
