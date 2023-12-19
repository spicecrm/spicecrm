import {Component, Output, EventEmitter, OnInit} from '@angular/core';

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

export class SpiceKanbanManagerAddModal implements OnInit{

    public loading = false;

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

    /**
     * the available enum fields
     */
    public enumFields: any[] = [];

    public isEditing: boolean = false;

    /**
     *  scope global | custom
     */
    public scope: string = 'global';

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

    public ngOnInit() {
        this.getEnumFields();
    }

    /**
     * Get enum fields
     */
    public getEnumFields() {
        let fields = this.metadata.getModuleFields(this.selectedBeanGuide.module);

        for (let field in fields) {
            let value = fields[field]
            if(value.type == 'enum'){
                this.enumFields.push(field);
            }
        }
    }

    /**
     * Save Kan Ban in table spicebeanguides and Kan Ban Stages in spicebeanguidestages
     */
    public save() {

        this.loading = true;
        this.selectedBeanGuide.systextid = `kanban_${this.selectedBeanGuide.module.toLowerCase()}_${this.sysTextIDName}`;

        let table = this.scope == 'global' ? 'spicebeanguides' : 'spicebeancustomguides';
        let spinner = this.modal.await('LBL_SAVING');

        delete this.selectedBeanGuide.scope;

        this.backend.postRequest(`configuration/configurator/${table}`, null, {config: [this.selectedBeanGuide]}).subscribe({
            next: () => {
                spinner.emit(true);
                this.toast.sendToast('LBL_SPICEBEANGUIDE_SAVED', "success");

                // emit selected bean guide
                this.emitSelectedBeanGuide.emit(this.selectedBeanGuide);

                this.loading = false;

                this.close();
            },
            error: (err) => {
                spinner.emit(true);
                this.toast.sendToast('LBL_ERROR_SAVING_SPICEBEANGUIDE', "error", err);
                this.loading = false;
            }
        });

        if(!this.isEditing) {
            this.selectedBeanGuide.scope = this.scope;

            const optionsKey = this.metadata.getFieldOptions(this.selectedBeanGuide.module, this.selectedBeanGuide.status_field);
            const fieldValidation = this.kanbanManagerService.domainFieldValidations.find(val => val.name == optionsKey);
            const fieldValidationValue = this.kanbanManagerService.domainFieldValidationsValues.filter(val => val.sysdomainfieldvalidation_id == fieldValidation.id).map(res => {
                return {
                    id: this.modelUtilities.generateGuid(),
                    spicebeanguide_id: this.selectedBeanGuide.id,
                    stage: res.enumvalue,
                    stage_sequence: res.sequence,
                    stage_label: res.label,
                }
            });

            this.backend.postRequest(`configuration/configurator/spicebeanguidestages`, null, {config: fieldValidationValue}).subscribe({
                next: () => {
                    spinner.emit(true);
                    this.toast.sendToast('LBL_SPICEBEANGUIDESTAGES_SAVED', "success");
                    this.loading = false;
                    this.close();
                },
                error: (err) => {
                    spinner.emit(true);
                    this.toast.sendToast('LBL_ERROR_SAVING_SPICEBEANGUIDESTAGES', "error", err);
                    this.loading = false;
                }
            });

            // sysTextId Object
            const sysTextId = {
                id: this.modelUtilities.generateGuid(),
                text_id : this.selectedBeanGuide.systextid,
                name : this.sysTextIDName,
            }

            // Save systextid in table systextids
            this.backend.postRequest(`configuration/configurator/systextids`, null, {config: [sysTextId]}).subscribe({
                next: () => {
                    spinner.emit(true);
                    this.close();
                },
                error: (err) => {
                    spinner.emit(true);
                    this.close();
                }
            });

        }
    }

    /**
     * cleanup field name
     */
    get sysTextIDName() {
        const noSpecialChars = this.selectedBeanGuide.name.trim().toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '');
        return noSpecialChars.replace(/\s/g, "_");
    }

    /**
     * check if you can save
     */
    get canSave() {
        return this.selectedBeanGuide.name.length != 0 && this.selectedBeanGuide.status_field != '';
    }

    /**
     * closes the modal
     */
    public close() {
        this.self.destroy();
    }

}

