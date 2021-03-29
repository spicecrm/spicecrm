/**
 * @module EvalancheModule
 */

import {Component, Injector} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from '../../../services/modal.service';
import {backend} from "../../../services/backend.service";

/**
 * creates mailing
 */

@Component({
    templateUrl: './src/include/evalanche/templates/evalanchemailingbutton.html',
})
export class EvalancheMailingButton {

    private disabled: boolean = false;
    private templates: any = [];
    private targetlists: any = [];
    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private modal: modal,
        private injector: Injector,
        private backend: backend
    ) {
        this.model.data$.subscribe(data => {
            this.disableButton();
        });
    }

    /**
     * turns disable attribute to true if there is a mailing ID already
     */

    public disableButton() {
        if (this.model.data.mailing_id) {
            this.disabled = true;
            return;
        }
    }

    /**
     * opens the modal component and passes the templates and targetlists
     */
    public execute() {
        let await = this.modal.await(this.language.getLabel('LBL_LOADING'));
        this.backend.getRequest(`channels/emarketing/evalanche/${this.model.module}/${this.model.id}/templates`).subscribe(response => {
            if(response) {
                await.emit(true);
                this.templates = response.templates;
                this.targetlists = response.targetlists;
                this.modal.openModal('EvalancheMailingModal', true, this.injector).subscribe(
                    modal => {
                        modal.instance.templates = this.templates;
                        modal.instance.targetlists = this.targetlists;
                    }
                );
            }
        });
    }


}
