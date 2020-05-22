/**
 * @module CleverReachModule
 */

import {Component, Injector} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from '../../../services/modal.service';

/**
 * creates mailing
 */

@Component({
    templateUrl: './src/include/cleverreach/templates/createmailingbutton.html',
})
export class CreateMailingButton {

    private disabled: boolean = false;

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private modal: modal,
        private injector: Injector
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
     * opens the modal component with the injector token
     */

    public execute() {
        this.modal.openModal('CreateMailingModal', true, this.injector);
    }

}
