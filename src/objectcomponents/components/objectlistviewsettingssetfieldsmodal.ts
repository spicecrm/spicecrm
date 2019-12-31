/**
 * @module ObjectComponents
 */
import {Component, OnInit} from '@angular/core';

import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {modellist} from '../../services/modellist.service';

@Component({
    selector: 'object-listview-settings-setfields-modal',
    templateUrl: './src/objectcomponents/templates/objectlistviewsettingssetfieldsmodal.html'
})
export class ObjectListViewSettingsSetfieldsModal {

    private listFields: any[] = [];
    private availableFields: any[] = [];

    private selectedAvailableFields: any[] = [];
    private selectedListFields: any[] = [];

    private self: any = {};


    constructor(private metadata: metadata, private language: language, private modellist: modellist) {

        // check if we have fielddefs
        let fielddefs = this.modellist.getFieldDefs();

        // get the default fields
        let componentconfig = this.metadata.getComponentConfig('ObjectList', this.modellist.module);
        let listFields = this.metadata.getFieldSetFields(componentconfig.fieldset);
        for (let listField of listFields) {
            if ((fielddefs.length > 0 && fielddefs.indexOf(listField.field) >= 0) || (fielddefs.length == 0 && listField.fieldconfig.default !== false)) {
                this.listFields.push(listField.field);
            } else {
                this.availableFields.push(listField.field);
            }
        }

        // sort listfields by fielddefs
        this.listFields.sort((a, b) => fielddefs.indexOf(a) > fielddefs.indexOf(b) ? 1 : -1)

        this.sortAvailableFields();
    }

    /**
     * dos ome checks fi the field can be exported
     *
     * no links, .. check on other fields tbd.
     *
     * @param field the fieldmetadata
     */
    private canDisplay(field) {
        return field.type != 'link';
    }


    private sortAvailableFields() {
        this.availableFields = this.availableFields.sort((a, b) => {
            return this.language.getFieldDisplayName(this.modellist.module, a).toLowerCase() > this.language.getFieldDisplayName(this.modellist.module, b).toLowerCase() ? 1 : -1;
        });
    }

    private close(): void {
        this.self.destroy();
    }

    private canSave(): boolean {
        return this.listFields.length > 0;
    }

    private save(): void {
        if (this.canSave()) {
            this.modellist.updateListType({fielddefs: btoa(JSON.stringify(this.listFields))}).subscribe(ret => this.close());
        }
    }

    private onFieldDrop(event) {
        let previousItem = event.previousContainer.data.splice(event.previousIndex, 1);
        event.container.data.splice(event.currentIndex, 0, previousItem[0]);
    }

    /*
     select the field whenc lciked int he container
     */
    private selectField(container, field) {
        switch (container) {
            case 'available':
                this.selectedAvailableFields = [field];
                break;
            case 'list':
                this.selectedListFields = [field];
                break;
        }
    }

    /*
     function to set the aria-selected attr on a field
     */
    private isSelected(container, field) {
        switch (container) {
            case 'available':
                if (this.selectedAvailableFields.indexOf(field) >= 0) {
                    return true;
                } else {
                    return false;
                }
            case 'list':
                if (this.selectedListFields.indexOf(field) >= 0) {
                    return true;
                } else {
                    return false;
                }
        }
    }

    /*
     move selected field to the othe container
     */
    private moveFields(fromContainer) {
        switch (fromContainer) {
            case 'available':
                this.selectedAvailableFields.forEach((item) => {
                    this.availableFields.some((targetitem, targetindex) => {
                        if (item == targetitem.field) {
                            this.listFields.push(this.availableFields.splice(targetindex, 1)[0]);
                            return true;
                        }
                    });
                })
                this.selectedAvailableFields = [];
                break;
            case 'list':
                this.selectedListFields.forEach((item) => {
                    this.listFields.some((targetitem, targetindex) => {
                        if (item == targetitem.field) {
                            this.availableFields.push(this.listFields.splice(targetindex, 1)[0]);
                            return true;
                        }
                    });
                });
                this.selectedListFields = [];
                this.sortAvailableFields();
                break;
        }
    }
}
