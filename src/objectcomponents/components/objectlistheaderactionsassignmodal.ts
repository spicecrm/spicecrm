/**
 * @module ObjectComponents
 */


import {
    Component, OnInit
} from '@angular/core';
import {modellist} from '../../services/modellist.service';
import {modal} from '../../services/modal.service';
import {model} from '../../services/model.service';
import {backend} from '../../services/backend.service';
import {toast} from "../../services/toast.service";
import {broadcast} from "../../services/broadcast.service";
import {view} from "../../services/view.service";

/**
 * renders in the list header action menu and offers the user the option to reassign a set of records
 */
@Component({
    selector: 'object-list-header-actions-assign-modal',
    templateUrl: './src/objectcomponents/templates/objectlistheaderactionsassignmodal.html',
    providers: [model, view]
})
export class ObjectListHeaderActionsAssignModal implements OnInit {

    /**
     * reference to the modal self
     * @private
     */
    private self: any = {};

    /**
     * indicator if we are submitting data
     *
     * @private
     */
    private submitting: boolean = false;


    constructor(private view: view, private broadcast: broadcast, private backend: backend, private toast: toast, private modal: modal, private model: model, private modellist: modellist) {
    }

    public ngOnInit() {
        this.model.module = this.modellist.module;
        this.model.initialize();

        this.view.isEditable = true;
        this.view.setEditMode();
    }

    /**
     * closes the modal
     *
     * @private
     */
    private close() {
        this.self.destroy();
    }

    /**
     * returns if we can submit
     */
    get canSubmit() {
        return !this.submitting && this.model.getField('assigned_user_id');
    }

    /**
     * execute the reassign
     *
     * @private
     */
    private reassign() {
        this.submitting = true;
        let selectedIds = this.modellist.getSelectedIDs();

        let body = {
            assigned_user_id: this.model.getField('assigned_user_id'),
            ids: selectedIds
        };
        let waiting = this.modal.await('updating');
        this.backend.postRequest(`module/${this.model.module}/massupdate/assign`, {}, body).subscribe(
            res => {
                if (res.success) {
                    for (let record of res.data) {
                        this.broadcast.broadcastMessage('model.save', {
                            id: record.id,
                            module: this.model.module,
                            data: record
                        });
                    }
                    this.close();
                } else {
                    this.toast.sendToast('ERROR reassigning records', 'error');
                    this.submitting = false;
                }
                waiting.emit(true);
            },
            err => {
                this.toast.sendToast('ERROR reassigning records', 'error');
                this.submitting = false;
                waiting.emit(true);
            });

    }
}
