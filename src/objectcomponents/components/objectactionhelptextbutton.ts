/**
 * @module ObjectComponents
 */

import {Component, Injector} from '@angular/core';
import {modal} from "../../services/modal.service";
import {language} from "../../services/language.service";
import {toast} from "../../services/toast.service";

@Component({
    selector: 'object-action-help-button',
    templateUrl: '../templates/objectactionhelptextbutton.html'
})

/**
 * renders the button for the help dialogue
 */

export class ObjectActionHelpTextButton {

    /**
     * holds help label declared in the actionset config
     */
    public actionconfig: any = '';

    constructor (
        public modal: modal,
        public injector: Injector,
        public language: language,
        public toast: toast){
    }

    /**
     * open modal
     */
    public execute() {
        if (this.actionconfig.helpLabel) {
            this.modal.openModal('ObjectHelpTextModal', true, this.injector).subscribe(modalRef => {
                if (this.actionconfig != '') {
                    modalRef.instance.helpLabel = this.actionconfig.helpLabel;
                }
            });
        } else {
            this.toast.sendToast('LBL_HELP_LABEL_MISSING', 'error');
        }
    }
}