import {Component} from '@angular/core';
import {backend} from "../../../services/backend.service";
import {model} from "../../../services/model.service";
import {toast} from "../../../services/toast.service";
import {broadcast} from "../../../services/broadcast.service";

@Component({
    selector: 'reporter-integration-process-workflow-button',
    template: `
        <li class="slds-dropdown__item" role="presentation" (click)="process()">
            <a href="javascript:void(0);" role="menuitem" tabindex="0">
                <span class="slds-truncate"><system-label label="LBL_PROCESS_WORKFLOW"></system-label></span>
            </a>
        </li>`
})

export class ReporterIntegrationProcessWorkflowButton {

    constructor(private backend: backend,
                private toast: toast,
                private broadcast: broadcast,
                private model: model) {
    }

    /**
     * send process workflow request to the backend
     */
    public process() {

        const processing = this.backend.modalservice.await('LBL_PROCESSING');

        this.backend.postRequest(`module/KReports/${this.model.id}/plugins/kprocessworkflow/now`).subscribe({
            next: res => {
                processing.next(true);
                processing.complete();
                this.toast.sendToast('MSG_SUCCESSFULLY_EXECUTED', 'success');
                this.broadcast.broadcastMessage('workflows.reload');
            },
            error: () => {
                processing.next(false);
                processing.complete();
                this.toast.sendToast('ERR_FAILED_TO_EXECUTE', 'error');
            }
        })
    }
}