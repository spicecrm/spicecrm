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

    public disableButton() {
        if (this.model.data.mailing_id) {
            this.disabled = true;
            window.console.log(this.disabled);
            return;
        }
    }

    public execute() {
        this.modal.openModal('SendMailingModal', true, this.injector);
    }

}
