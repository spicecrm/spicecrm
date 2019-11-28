import {Component, OnInit, Injector} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from '../../../services/modal.service';

/**
 * sends mailing
 */
@Component({
    selector: 'send-mailing-button',
    templateUrl: './src/include/cleverreach/templates/sendmailingbutton.html',
})
export class SendMailingButton {

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private modal: modal,
        private injector: Injector
    ) {}

    public execute() {
        this.modal.openModal('SendMailingModal', true, this.injector);
    }
}
