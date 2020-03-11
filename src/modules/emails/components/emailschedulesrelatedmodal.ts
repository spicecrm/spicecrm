/**
 * @module ModuleEmails
 */
import {Component, Injector} from '@angular/core';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {view} from "../../../services/view.service";
import {backend} from "../../../services/backend.service";
import {metadata} from "../../../services/metadata.service";
import {toast} from "../../../services/toast.service";

@Component({
    selector: "email-schedules-related-modal",
    templateUrl: "./src/modules/emails/templates/emailschedulesrelatedmodal.html",
    providers: [model, view],
})
export class EmailSchedulesRelatedModal {
    private self: any = {};
    private activetab: string = 'recipients';
    private prospects: any[] = [];
    private listId: string;
    constructor(private language: language,
                private model: model,
                private injector: Injector,
                private view: view,
                private modal: modal,
                private metadata: metadata,
                private backend: backend,
                private toast: toast) {

        this.view.isEditable = true;
        this.view.setEditMode();

    }

    public ngOnInit() {
        this.model.module = "EmailSchedules";
        this.model.initialize();
        this.fiilterProspects();
    }

    /**
     * check if the each module of prospects has an email link, if not, it will be disabled and unselectable
     */
    private fiilterProspects() {
        this.prospects = this.prospects.map(prospect => {
            prospect.disabled = !this.metadata.getFieldDefs(prospect.module, 'emails');
            prospect.selected = false;
            return prospect;
        });
    }

    /**
     * destroy modal instance
     */
    private close() {
        this.self.destroy();
    }

    /**
     * filter the prospect by selection
     */
    private saveSchedule() {
        this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {
            loadingRef.instance.messagelabel = 'LBL_LOADING';
            const selectedProspects = this.prospects.filter(prospect => prospect.selected).map(prospect => prospect.module);
            let body = {
                listId: this.listId,
                modules: selectedProspects,
                data: this.model.data
            };
            this.backend.postRequest('/modules/EmailSchedules/saveScheduleFromProspectList', {}, body).subscribe(result => {
                loadingRef.instance.self.destroy();
                if (result.status == 'success') {
                    this.toast.sendToast(result.status, 'success');
                    this.close();
                } else {
                    this.toast.sendToast(result.msg, 'error');
                }
            });
        });
    }

}


