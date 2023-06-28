import {Component, Output, EventEmitter} from '@angular/core';

import {modal} from '../../../services/modal.service';
import {metadata} from '../../../services/metadata.service';
import {backend} from '../../../services/backend.service';
import {language} from "../../../services/language.service";
import {toast} from "../../../services/toast.service";
import {SpiceBeanGuidesI} from "../interfaces/kanbanmanager.interfaces";
import {KanbanManagerService} from "../services/kanbanmanager.service";
import {modelutilities} from "../../../services/modelutilities.service";


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

    /**
     * emit selected bean guide
     */
    @Output() emitSelectedBeanGuide = new EventEmitter<SpiceBeanGuidesI>();

    public isEditing: boolean = false;

    constructor(
        public modal: modal,
        public metadata: metadata,
        public backend: backend,
        public language: language,
        public toast: toast,
        public modelUtilities: modelutilities,
        public kanbanManagerService: KanbanManagerService
    ) {
    }

    /**
     * Save Kan Ban in table spicebeanguides and Kan Ban Stages in spicebeanguidestages
     */
    public save() {
        let spinner = this.modal.await('LBL_SAVING');

        this.backend.postRequest(`configuration/configurator/spicebeanguides`, null, {config: [this.selectedBeanGuide]}).subscribe({
            next: () => {
                spinner.emit(true);
                this.toast.sendToast('LBL_SPICEBEANGUIDE_SAVED', "success");

                // emit selected bean guide
                this.emitSelectedBeanGuide.emit(this.selectedBeanGuide);

                this.close();
            },
            error: (err) => {
                spinner.emit(true);
                this.toast.sendToast('LBL_ERROR_SAVING_SPICEBEANGUIDE', "error", err);
            }
        });

        if(!this.isEditing) {
            const optionsKey = this.metadata.getFieldOptions(this.selectedBeanGuide.module, this.selectedBeanGuide.status_field);
            const fieldValidation = this.kanbanManagerService.domainFieldValidations.find(val => val.name == optionsKey);
            const fieldValidationValue = this.kanbanManagerService.domainFieldValidationsValues.filter(val => val.sysdomainfieldvalidation_id == fieldValidation.id).map(res => {
                return {
                    id: this.modelUtilities.generateGuid(),
                    spicebeanguide_id: this.selectedBeanGuide.id,
                    stage: res.enumvalue,
                    stage_sequence: res.sequence,
                    stage_label: res.label
                }
            });

            this.backend.postRequest(`configuration/configurator/spicebeanguidestages`, null, {config: fieldValidationValue}).subscribe({
                next: () => {
                    spinner.emit(true);
                    this.toast.sendToast('LBL_SPICEBEANGUIDESTAGES_SAVED', "success");
                    this.close();
                },
                error: (err) => {
                    spinner.emit(true);
                    this.toast.sendToast('LBL_ERROR_SAVING_SPICEBEANGUIDESTAGES', "error", err);
                }
            });
        }
    }


    /**
     * closes the modal
     */
    public close() {
        this.self.destroy();
    }
}

