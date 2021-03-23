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
    templateUrl: "./src/modules/emails/templates/emailschedulesmodal.html",
    providers: [model, view],
})
export class EmailSchedulesModal {

    /**
     * reference to the modal itself
     *
     * @private
     */
    private self: any = {};

    constructor(private language: language,
                private model: model,
                @SkipSelf() private parentModel: model,
                private injector: Injector,
                private view: view,
                private modal: modal,
                private metadata: metadata,
                private modellist: modellist,
                private backend: backend,
                private toast: toast) {

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
        this.model.data.parent_id = this.parentModel.id;
        this.model.data.parent_type = this.parentModel.module;
        // start editing
        this.model.startEdit(false);
    }

    /**
     * destroy modal instance
     */
    private close() {
        this.self.destroy();
    }

    get canSave() {
        return this.model.getField('mailbox_id') && this.model.getField('email_subject') && this.model.getField('email_body');
    }

    /**
     * save selected ids of modellist, module, model data and send object to backend
     */
    private saveSchedule() {
        this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {
            loadingRef.instance.messagelabel = 'LBL_LOADING';
            let selectedIds = this.modellist.getSelectedIDs();
            let body = {
                module: this.modellist.module,
                id: this.model.id,
                ids: selectedIds,
                data: this.model.data,
                modulefilter: this.modellist.modulefilter,
                searchterm: this.modellist.searchTerm,
                aggregates: this.modellist.selectedAggregates
            };
            this.backend.postRequest('modules/EmailSchedules/saveSchedule', {}, body).subscribe(result => {
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
}


