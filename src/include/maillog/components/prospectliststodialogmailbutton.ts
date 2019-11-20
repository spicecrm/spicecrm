/**
 * @module MailLogModule
 */

import {Component, OnInit, Injector} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from '../../../services/modal.service';

/**
 * exports targetlist to dialogMail
 */
@Component({
    selector: 'prospectlists-to-dialogmail-button',
    templateUrl: './src/include/maillog/templates/prospectliststodialogmailbutton.html',
})
export class ProspectListsToDialogMailButton {

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private modal: modal,
        private injector: Injector
    ) {}

    public execute() {
        this.modal.openModal('ProspectListsToDialogMailModal', true, this.injector);
    }
}
