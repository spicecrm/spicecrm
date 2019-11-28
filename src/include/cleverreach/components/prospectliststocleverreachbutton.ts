import {Component, OnInit, Injector} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from '../../../services/modal.service';

/**
 * exports targetlist to Clever Reach
 */
@Component({
    selector: 'prospectlists-to-cleverreach-button',
    templateUrl: './src/include/cleverreach/templates/prospectliststocleverreachbutton.html',
})
export class ProspectListsToCleverReachButton {

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private modal: modal,
        private injector: Injector
    ) {}

    public execute() {
        this.modal.openModal('ProspectListsToCleverReachModal', true, this.injector);
    }
}
