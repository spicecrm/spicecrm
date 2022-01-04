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
    templateUrl: '../templates/createmailingbutton.html',
})
export class CreateMailingButton {

    public disabled: boolean = false;

    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        public modal: modal,
        public injector: Injector
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
     * opens the modal component with the injector token
     */

    public execute() {
        this.modal.openModal('CreateMailingModal', true, this.injector);
    }

}
