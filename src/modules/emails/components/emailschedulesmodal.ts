/**
 * @module ModuleEmails
 */
import {Component, Injector} from '@angular/core';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {modellist} from '../../../services/modellist.service';
import {language} from '../../../services/language.service';
import {view} from "../../../services/view.service";
import {backend} from "../../../services/backend.service";
import {metadata} from "../../../services/metadata.service";
import {toast} from "../../../services/toast.service";

@Component({
    selector: "email-schedules-modal",
    templateUrl: "./src/modules/emails/templates/emailschedulesmodal.html",
    providers: [model, view],
})
export class EmailSchedulesModal {
    private self: any = {};

    constructor(private language: language,
                private model: model,
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
        this.model.module = 'EmailSchedules';
        this.model.initialize();
    }

    /**
     * destroy modal instance
     */
    private close() {
        this.self.destroy();
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
                ids: selectedIds,
                data: this.model.data,
                modulefilter: this.modellist.modulefilter,
                searchterm: this.modellist.searchTerm,
                aggregates: this.modellist.selectedAggregates
            };
            this.backend.postRequest('/modules/EmailSchedules/saveSchedule', {}, body).subscribe(result => {
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


