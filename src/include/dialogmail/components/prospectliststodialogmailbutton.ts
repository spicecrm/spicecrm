/**
 * @module DialogMailModule
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
    templateUrl: '../templates/prospectliststodialogmailbutton.html',
})
export class ProspectListsToDialogMailButton {

    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        public modal: modal,
        public injector: Injector
    ) {}

    public execute() {
        this.modal.openModal('ProspectListsToDialogMailModal', true, this.injector);
    }
}
