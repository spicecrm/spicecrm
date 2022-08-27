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
    templateUrl: "../templates/emailschedulesbutton.html",
})
export class EmailSchedulesButton implements OnInit {

    /**
     * the hidden property hiding the button if the user does not have the proper access rights
     */
    public hidden: boolean = true;

    /**
     * the max number of count to be allowed to send emails to
     */
    public maxCount: number = 50;

    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        public modellist: modellist,
        public modal: modal,
        public injector: Injector,
        public toast: toast
    ) {
    }

    public ngOnInit(): void {
        this.findEmailsLink();
    }

    /**
     * checks the acl rights for the user to export and that we have some items selected
     */
    get disabled() {
        return  this.modellist.getSelectedCount() == 0 || this.modellist.getSelectedCount() > this.maxCount;
    }
    
    /**
     * get the count of the selected objects
     */
    get exportcount() {
        let selectedCount = this.modellist.getSelectedCount();
        return selectedCount ? selectedCount : this.modellist.listData.totalcount;
    }

    public findEmailsLink() {
        // check that the user has the right to create email schedules
        if(!this.metadata.checkModuleAcl('EmailSchedules', 'create')) return;

        // check if there is an emails link field on the current module
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
