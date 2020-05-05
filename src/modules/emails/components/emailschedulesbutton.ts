/**
 * @module ModuleEmails
 */
import {Component, Injector, OnInit} from '@angular/core';
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
export class EmailSchedulesButton implements OnInit {

    public disabled: boolean = false;
    public hidden: boolean = true;

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

    public ngOnInit(): void {
        this.findEmailsLink();
    }

    /**
     * get the count of the selected objects
     */
    get exportcount() {
        let selectedCount = this.modellist.getSelectedCount();
        return selectedCount ? selectedCount : this.modellist.listData.totalcount;
    }

    private findEmailsLink() {
        let moduleFields = this.metadata.getModuleFields(this.model.module);
        for (let fieldname in moduleFields) {
            let field = moduleFields[fieldname];
            // also check by name to be sure we catch the field
            // ToDo: with vardef manager cleanup and rely on module alone
            if (fieldname == 'emails' || (field.type == 'link' && field.module == 'Emails')) {
                this.hidden = false;
            }
        }
    }

    /**
     * throw error if the field emails doesnt exist
     */
    public execute() {
        if (this.model.fields.hasOwnProperty('emails')) {
            this.modal.openModal('EmailSchedulesModal', true, this.injector);
        } else {
            this.toast.sendToast(this.language.getLabel('LBL_ERROR'), 'error');
        }
    }

}
