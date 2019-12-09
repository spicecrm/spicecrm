import {Component, OnInit, Injector} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from '../../../services/modal.service';

/**
 * exports targetlist to Mail Chimp
 */
@Component({
    selector: 'prospectlists-to-mailchimp-button',
    templateUrl: './src/include/mailchimp/templates/prospectliststomailchimpbutton.html',
})
export class ProspectListsToMailChimpButton {

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private modal: modal,
        private injector: Injector
    ) {}

    public execute() {
        this.modal.openModal('ProspectListsToMailChimpModal', true, this.injector);
    }
}
