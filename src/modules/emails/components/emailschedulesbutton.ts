/**
 * @module ModuleEmails
 */
import {Component, Injector} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modellist} from '../../../services/modellist.service';
import {modal} from '../../../services/modal.service';
import {toast} from "../../../services/toast.service";


@Component({
    selector: "email-schedules-button",
    templateUrl: "./src/modules/emails/templates/emailschedulesbutton.html",
})
export class EmailSchedulesButton {
    public disabled: boolean = false;

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private modellist: modellist,
        private modal: modal,
        private injector: Injector,
        private toast: toast
    ) {
    }

    /**
     * get the count of the selected objects
     */
    get exportcount() {
        let selectedCount = this.modellist.getSelectedCount();
        return selectedCount ? selectedCount : this.modellist.listData.totalcount;
    }

    /**
     * throw error if the field emails doesnt exist
     */
    public execute() {
        if(this.model.fields.hasOwnProperty('emails')) {
            this.modal.openModal('EmailSchedulesModal', true, this.injector);
        } else {
            this.toast.sendToast(this.language.getLabel('LBL_ERROR'), 'error');
        }
    }

}
