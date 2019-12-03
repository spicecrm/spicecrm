import {Component, OnInit, Injector} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from '../../../services/modal.service';

/**
 * creates mailing
 */
@Component({
    selector: 'send-mailing-button',
    templateUrl: './src/include/cleverreach/templates/sendmailingbutton.html',
})
export class SendMailingButton {

    public disabled: boolean = false;

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private modal: modal,
        private injector: Injector
    ) {
    }

    public execute() {
        if (this.model.getFieldValue('mailing_id')) {
            this.disabled = true;
            return;
        } else {
            this.modal.openModal('SendMailingModal', true, this.injector);
        }

    }

}
