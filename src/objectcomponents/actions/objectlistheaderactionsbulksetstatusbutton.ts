import {Component, OnInit} from '@angular/core';
import {ActionSetItemI} from "../interfaces/objectcomponents.interfaces";
import {metadata} from "../../services/metadata.service";
import {modal} from "../../services/modal.service";
import {toast} from "../../services/toast.service";
import {modellist} from "../../services/modellist.service";
import {backend} from "../../services/backend.service";

@Component({
    selector: 'object-list-header-actions-bulk-set-status-button',
    templateUrl: '../templates/objectlistheaderactionsbulksetstatusbutton.html'
})

export class ObjectListHeaderActionsBulkSetStatusButton implements ActionSetItemI, OnInit {
    /**
     * hidden flag read by the parent
     */
    public hidden: boolean = false;
    /**
     * holds the status network data
     */
    public statusNetworkData: { statusField: string, statusNetwork: any[] };

    constructor(private metadata: metadata,
                private modal: modal,
                private toast: toast,
                private modelList: modellist,
                private backend: backend) {
    }

    get selectedCount() {
        return this.modelList.getSelectedCount();
    }

    /**
     * disabled flag read by the parent
     */
    get disabled() {
        return this.modelList.getSelectedItems().length == 0 || !this.metadata.checkModuleAcl(this.modelList.module, 'edit');
    }

    public ngOnInit() {
        this.statusNetworkData = this.metadata.checkStatusManaged(this.modelList.module) as any;
        if (!this.statusNetworkData) this.hidden = true;
    }

    /**
     * bulk set status
     */
    public execute() {

        const selectedItemsStatus = this.modelList.getSelectedItems().map(item => item[this.statusNetworkData.statusField]);

        // check if the current status matches the status_from
        if (selectedItemsStatus.some(status => !this.statusNetworkData.statusNetwork.some(a => a.status_from == status))) {
            return this.toast.sendToast('MSG_BULK_SET_STATUS_FROM_VALUE_MISMATCH', 'error');
        }

        const availableActions = this.statusNetworkData.statusNetwork.filter(item => selectedItemsStatus.includes(item.status_from));

        const options = [];
        availableActions.forEach(a => {
            if (options.some(o => o.status_to == a.status_to)) return;
            options.push({value: a.id, display: a.action_label, status_to: a.status_to});
        });

        this.modal.prompt('input', 'LBL_MAKE_SELECTION', 'LBL_STATUS', 'default', null, options).subscribe(answer => {
            if (!answer) return;
            this.confirmChange(this.statusNetworkData.statusNetwork.find(a => a.id == answer));
        });
    }

    /**
     * if the action has a prompt open confirm modal and process
     * @param action
     */
    public confirmChange(action) {
        if (action.prompt_label) {
            this.modal.confirm(action.prompt_label, action.prompt_label).subscribe(response => {
                if (!response) return;
                this.setStatus(action);
            });
        } else {
            this.setStatus(action);
        }
    }

    /**
     * set the status
     * @param action
     */
    public setStatus(action: { status_component: string; status_to: string; }) {

        const body = this.modelList.getSelectedItems().map(item => ({
            id: item.id,
            [this.statusNetworkData.statusField]: action.status_to
        }));

        const saveModal = this.modal.await('LBL_SAVING');

        this.backend.postRequest(`module/${this.modelList.module}`, null, body).subscribe({
            next: () => {
                saveModal.next(true);
                saveModal.complete();
            },
            error: () => {
                saveModal.next(true);
                saveModal.complete();
                this.toast.sendToast('MSG_ERROR_SETTING_STATUS', 'error');
            }
        });
    }
}