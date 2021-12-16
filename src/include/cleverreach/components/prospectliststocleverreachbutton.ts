/**
 * @module CleverReachModule
 */

import {Component,Injector} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from '../../../services/modal.service';

/**
 * exports targetlist to Clever Reach
 */
@Component({
    selector: 'prospectlists-to-cleverreach-button',
    templateUrl: '../templates/prospectliststocleverreachbutton.html',
})
export class ProspectListsToCleverReachButton {

    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        public modal: modal,
        public injector: Injector
    ) {}

    public execute() {
        this.modal.openModal('ProspectListsToCleverReachModal', true, this.injector);
    }
}
