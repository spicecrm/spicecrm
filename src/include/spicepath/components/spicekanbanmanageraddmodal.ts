import {Component, Injector} from '@angular/core';

import {modal} from '../../../services/modal.service';
import {metadata} from '../../../services/metadata.service';
import {backend} from '../../../services/backend.service';
import {toast} from "../../../services/toast.service";
import {modelutilities} from '../../../services/modelutilities.service';


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
     * module name
     */
    public moduleName: string = '';

    /**
     * module fields array
     */
    public moduleFields: any[] = [];

    /**
     *  selected field
     */
    public fieldName: string = '';

    /**
     * Kan Ban name field
     */
    public kanbanName: string = '';

    constructor(
        public modal: modal,
        public metadata: metadata,
        public backend: backend,
        public toast: toast,
        public modelutilities: modelutilities
    ) {
    }


    public ngOnInit() {
        if (this.moduleName && this.moduleName != '*') {
            this.moduleFields = this.metadata.getModuleFields(this.moduleName);
        }
    }


    /**
     * Get fields from module
     */
    public getFieldNames() {
        let fieldnames = [];

        for (let fieldname in this.moduleFields) {
            fieldnames.push(fieldname);
        }

        fieldnames.sort();
        return fieldnames;
    }

    /**
     * Add new Kan Ban in table spicebeanguides
     */
    public addKanban() {

        let spinner = this.modal.await('LBL_SAVING');

        let data = [{
            id : this.modelutilities.generateGuid(),
            module : this.moduleName,
            status_field : this.fieldName,
            name : this.kanbanName,
        }];

        this.backend.postRequest(`configuration/configurator/spicebeanguides`, null, {config: data}).subscribe({
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

