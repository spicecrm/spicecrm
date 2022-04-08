/**
 * @module ObjectComponents
 */

/**
 * @ignore
 */
declare var moment: any;

import {Component} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {modellist} from '../../services/modellist.service';
import {modal} from '../../services/modal.service';

/**
 * renders a modal dialog to let the user choose the fields to be exported. By default it is the fields in the view
 *
 * per componentconfig also all fields can be enabled or a specific fieldset
 */
@Component({
    templateUrl: '../templates/objectlistheaderactionsexportcsvselectfields.html',
})
export class ObjectListHeaderActionsExportCSVSelectFields {

    /**
     * reference to the modal itself
     */
    public self: any;

    public multiselect: boolean = true;
    public selectedAvailableFields: any[] = [];
    public selectedListFields: any[] = [];
    public availableFields: any[] = [];
    public exportFields: any[] = [];

    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        public modellist: modellist,
        public modal: modal
    ) {

        // get the current last fields
        // this.exportFields = [...this.modellist.lastFields];
        this.exportFields = [];
        for(let field of this.modellist.listfields){
            this.exportFields.push(field.field);
        }


        // get all module fields
        let componentConfig = this.metadata.getComponentConfig('ObjectListHeaderActionsExportCSVSelectFields', this.model.module);
        if (componentConfig.enableall) {
            let fields = this.metadata.getModuleFields(this.model.module);
            for (let field in fields) {
                if (this.isExportable(fields[field]) && this.exportFields.indexOf(field) == -1) this.availableFields.push(field);
            }
        } else if (componentConfig.fieldset) {
            let fields = this.metadata.getFieldSetFields(componentConfig.fieldset);
            for (let field of fields) {
                if (this.isExportable(field) && this.exportFields.indexOf(field.field) == -1) this.availableFields.push(field.field);
            }
        } else {
            // get the default fields
            let componentconfig = this.metadata.getComponentConfig('ObjectList', this.modellist.module);
            let fields = this.metadata.getFieldSetFields(componentconfig.fieldset);
            for (let field of fields) {
                if (this.isExportable(field) && this.exportFields.indexOf(field.field) == -1) this.availableFields.push(field.field);
            }
        }
        this.sortAvailableFields();
    }

    /**
     * dos ome checks fi the field can be exported
     *
     * no links, .. check on other fields tbd.
     *
     * @param field the fieldmetadata
     */
    public isExportable(field) {
        return field.type != 'link';
    }

    /**
     * handle thje drop event
     *
     * @param event
     */
    public onFieldDrop(event) {
        let previousItem = event.previousContainer.data.splice(event.previousIndex, 1);
        event.container.data.splice(event.currentIndex, 0, previousItem[0]);
    }

    /*
     select the field whenc lciked int he container
     */
    public selectField(container, field) {
        switch (container) {
            case 'available':
                if (this.multiselect === false) {
                    this.selectedAvailableFields = [field];
                } else {
                    if (this.selectedAvailableFields.indexOf(field) >= 0) {
                        this.selectedAvailableFields.splice(this.selectedAvailableFields.indexOf(field), 1);
                    } else {
                        this.selectedAvailableFields.push(field);
                    }
                }
                break;
            case 'list':
                if (this.multiselect === false) {
                    this.selectedListFields = [field];
                } else {
                    if (this.selectedListFields.indexOf(field) >= 0) {
                        this.selectedListFields.splice(this.selectedListFields.indexOf(field), 1);
                    } else {
                        this.selectedListFields.push(field);
                    }
                }
                break;
        }
    }

    /*
     function to set the aria-selected attr on a field
     */
    public isSelected(container, field) {
        switch (container) {
            case 'available':
                return this.selectedAvailableFields.indexOf(field) >= 0;
            case 'list':
                return this.selectedListFields.indexOf(field) >= 0;
        }
    }

    /*
     move selected field to the othe container
     */
    public moveFields(fromContainer) {
        switch (fromContainer) {
            case 'available':
                this.selectedAvailableFields.forEach((item) => {
                    this.availableFields.some((targetitem, targetindex) => {
                        if (item == targetitem) {
                            this.exportFields.push(this.availableFields.splice(targetindex, 1)[0]);
                            return true;
                        }
                    });
                });
                this.selectedAvailableFields = [];
                break;
            case 'list':
                this.selectedListFields.forEach((item) => {
                    this.exportFields.some((targetitem, targetindex) => {
                        if (item == targetitem) {
                            this.availableFields.push(this.exportFields.splice(targetindex, 1)[0]);
                            return true;
                        }
                    });
                });
                this.selectedListFields = [];
                this.sortAvailableFields();
                break;
        }
    }

    public sortAvailableFields() {
        this.availableFields = this.availableFields.sort((a, b) => {
            return this.language.getFieldDisplayName(this.model.module, a).toLowerCase() > this.language.getFieldDisplayName(this.model.module, b).toLowerCase() ? 1 : -1;
        });
    }

    /**
     * cancel and close the dialog
     */
    public cancel() {
        this.self.destroy();
    }

    public export() {
        this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {
            loadingRef.instance.messagelabel = 'LBL_EXPORTING';
            this.modellist.exportList(this.exportFields).subscribe(downloadurl => {
                loadingRef.instance.self.destroy();

                // handle the download
                let a: any = document.createElement("a");
                document.body.appendChild(a);
                a.href = downloadurl;
                a.download = this.model.module + '_' + new moment().format('YYYY_MM_DD_HH_mm') + '.csv';
                a.click();
                a.remove();

                // destroy the modal itself
                this.self.destroy();

            });
        });
    }

}

