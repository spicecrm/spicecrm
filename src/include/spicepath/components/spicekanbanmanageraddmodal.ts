import {Component} from '@angular/core';

import {modal} from '../../../services/modal.service';
import {metadata} from '../../../services/metadata.service';
import {backend} from '../../../services/backend.service';
import {toast} from "../../../services/toast.service";
import {SpiceBeanGuidesI} from "../interfaces/kanbanmanager.interfaces";


@Component({
    selector: 'spice-kanban-manager-add-modal',
    templateUrl: '../templates/spicekanbanmanageraddmodal.html'
})

export class SpiceKanbanManagerAddModal {

    /**
     * reference to the modal to close it
     */
    public self: any;

    /**
     * Selected bean guide
     */
    public selectedBeanGuide: SpiceBeanGuidesI;

    public isEditing: boolean = false;

    constructor(
        public modal: modal,
        public metadata: metadata,
        public backend: backend,
        public toast: toast,
    ) {
    }

    /**
     * Edit Kan Ban in table spicebeanguides
     */
    public save() {
        let spinner = this.modal.await('LBL_SAVING');

        this.backend.postRequest(`configuration/configurator/spicebeanguides`, null, {config: [this.selectedBeanGuide]}).subscribe({
            next: () => {
                spinner.emit(true);
                this.toast.sendToast('LBL_SPICEBEANGUIDE_SAVED', "success");
                this.close();
            },
            error: (err) => {
                spinner.emit(true);
                this.toast.sendToast('LBL_ERROR_SAVING_SPICEBEANGUIDE', "error", err);
            }
        });
    }


    /**
     * closes the modal
     */
    public close() {
        this.self.destroy();
    }
}

