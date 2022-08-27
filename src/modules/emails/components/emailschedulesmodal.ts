/**
 * @module ModuleEmails
 */
import {Component, Injector, SkipSelf} from '@angular/core';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {modellist} from '../../../services/modellist.service';
import {language} from '../../../services/language.service';
import {view} from "../../../services/view.service";
import {backend} from "../../../services/backend.service";
import {metadata} from "../../../services/metadata.service";
import {toast} from "../../../services/toast.service";

/**
 * renders a modal to create a scheduled email
 */
@Component({
    selector: "email-schedules-modal",
    templateUrl: "../templates/emailschedulesmodal.html",
    providers: [model, view],
})
export class EmailSchedulesModal {

    /**
     * reference to the modal itself
     *
     * @private
     */
    public self: any = {};

    constructor(public language: language,
                public model: model,
                @SkipSelf() public parentModel: model,
                public injector: Injector,
                public view: view,
                public modal: modal,
                public metadata: metadata,
                public modellist: modellist,
                public backend: backend,
                public toast: toast) {

        this.view.isEditable = true;
        this.view.setEditMode();

    }

    /**
     * initialize EmailSchedules
     */
    public ngOnInit() {
        // set the module
        this.model.module = 'EmailSchedules';
        // initialize the model
        this.model.initialize(this.parentModel);
        this.model.setFields({
            parent_id: this.parentModel.id,
            parent_type: this.parentModel.module
        });
        // start editing
        this.model.startEdit(false);
    }

    /**
     * destroy modal instance
     */
    public close() {
        this.self.destroy();
    }

    get canSave() {
        return this.model.getField('mailbox_id') && this.model.getField('email_subject') && this.model.getField('email_body');
    }

    /**
     * save selected ids of modellist, module, model data and send object to backend
     */
    public saveSchedule() {
        this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {
            loadingRef.instance.messagelabel = 'LBL_LOADING';
            let selectedIds = this.modellist.getSelectedIDs();
            let body = {
                module: this.modellist.module,
                ids: selectedIds,
                data: this.model.data,
                modulefilter: this.modellist.modulefilter,
                searchterm: this.modellist.searchTerm,
                aggregates: this.modellist.selectedAggregates
            };
            this.backend.postRequest(`module/EmailSchedules/${this.model.id}`, {}, body).subscribe(result => {
                loadingRef.instance.self.destroy();
                if (result.status) {
                    this.toast.sendToast(this.language.getLabel('MSG_SUCCESSFULLY_EXECUTED'), 'success');
                    this.close();
                } else {
                    this.toast.sendToast(this.language.getLabel('LBL_ERROR'), 'error');
                }
            });
        });
    }

    /**
     * sends a test email to current user
     */
    public sendTestEmail() {
        this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {
            loadingRef.instance.messagelabel = 'LBL_LOADING';
            let body = {
                parent_id: this.model.data.parent_id,
                email_subject: this.model.data.email_subject,
                email_body: this.model.data.email_body,
                mailbox_id: this.model.data.mailbox_id,
            };
            this.backend.postRequest(`module/EmailSchedules/${this.model.id}/sendtest`, {}, body).subscribe(result => {
                loadingRef.instance.self.destroy();
                if (result.success) {
                    this.toast.sendToast(this.language.getLabel('MSG_SUCCESSFULLY_EXECUTED'), 'success');
                } else {
                    this.toast.sendToast(this.language.getLabel('LBL_ERROR'), 'error');
                }
            });
        });
    }
}

