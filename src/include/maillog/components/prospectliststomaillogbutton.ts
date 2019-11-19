/**
 * @module MailLogModule
 */

import {Component, OnInit, Injector} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from '../../../services/modal.service';

/**
 * exports targetlist to maillog
 */
@Component({
    selector: 'prospectlists-to-maillog-button',
    templateUrl: './src/include/maillog/templates/prospectliststomaillogbutton.html',
})
export class ProspectListsToMailLogButton {

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private modal: modal
    ) {}

    /* how many contacts in the prospect list have an online profile with type "Maillog"?
       >> execute rest call to Mailog >> create group in dmail
    */

    public execute() {
        this.modal.openModal('ProspectListsToMailLogModal', true);
    }
}
