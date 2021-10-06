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

@Component({
    selector: 'object-action-mark-sent-bean-button',
    templateUrl: './src/modules/outputtemplates/templates/objectactionmarksentbeanbutton.html',
    providers: [modelattachments]
})
export class ObjectActionMarkSentBeanButton extends ObjectActionOutputBeanButton {

    constructor(
        protected language: language,
        protected model: model,
        protected modal: modal,
        protected backend: backend,
        protected configuration: configurationService,
        protected viewContainerRef: ViewContainerRef

    ) {
        super(language, model, modal, backend, configuration, viewContainerRef);
    }


    public execute() {
        this.backend.postRequest('module/Letters/'+this.model.id, null, [this.model.data]);

    }
}
