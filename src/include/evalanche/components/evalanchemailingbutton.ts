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
    templateUrl: '../templates/evalanchemailingbutton.html',
})
export class EvalancheMailingButton {

    public disabled: boolean = false;
    public templates: any = [];
    public targetlists: any = [];
    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        public modal: modal,
        public injector: Injector,
        public backend: backend
    ) {
        this.model.data$.subscribe(data => {
            this.disableButton();
        });
    }

    /**
     * turns disable attribute to true if there is a mailing ID already
     */

    public disableButton() {
        if (this.model.getField('mailing_id')) {
            this.disabled = true;
            return;
        }
    }

    /**
     * opens the modal component and passes the templates and targetlists
     */
    public execute() {
        let loading = this.modal.await(this.language.getLabel('LBL_LOADING'));
        this.backend.getRequest(`channels/emarketing/evalanche/${this.model.module}/${this.model.id}/templates`).subscribe(response => {
            if(response) {
                loading.emit(true);
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
