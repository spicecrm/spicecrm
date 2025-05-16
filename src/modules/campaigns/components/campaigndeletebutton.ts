import {Component, OnInit} from '@angular/core';
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {navigationtab} from "../../../services/navigationtab.service";
import {Router} from "@angular/router";

@Component({
    selector: 'campaign-delete-button',
    templateUrl: '../templates/campaigndeletebutton.html'
})

export class CampaignDeleteButton {
    constructor(public model: model,
                public modal: modal,
                public backend: backend,
                public toast: toast,
                public navigationtab: navigationtab,
                public router: Router) {
    }

    /**
     * if set to true didpslay teh button as icon
     */
    public displayasicon: boolean = false;

    /**
     * holds the action config
     */
    public actionconfig: any = {};

    get disabled() {
        return !this.canDelete;
    }

    get canDelete() {
        try {
            return this.model.checkAccess('delete') && !this.model.isEditing;
        } catch (e) {
            return false;
        }
    }

    public execute() {
        this.modal.confirm('MSG_DELETE_RECORD', 'MSG_DELETE_RECORD')
            .subscribe(answer => {
                if (answer) {
                    let awaitModal = this.modal.await('LBL_DELETING');
                    this.backend.deleteRequest(`module/${this.model.module}/${this.model.id}/delete`).subscribe({
                            next: () => {
                                awaitModal.emit(true);
                                this.completeAction();
                            },
                            error: () => {
                                awaitModal.emit(true);
                                this.toast.sendToast('LBL_ERROR_DELETING_RECORD', "error");
                            }
                        }
                    );
                }
            });
    }

    /**
     * completes and redirects to the list except other set in the config
     */
    public completeAction() {
        // if no redirect is supposed to happen return true
        if (this.actionconfig.noredirectoncomplete == true) return;

        // close the tab if we have one
        if (this.navigationtab && this.navigationtab.tabid != 'main') {
            this.navigationtab.closeTab();
        } else {
            this.router.navigate(['/module/' + this.model.module]);
        }
    }

}