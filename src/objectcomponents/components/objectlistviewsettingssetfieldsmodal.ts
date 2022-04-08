/**
 * @module ObjectComponents
 */
import {Component, OnInit} from '@angular/core';

import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {modellist} from '../../services/modellist.service';

declare var _: any;

/**
 * a modal that allows the user to choose from fields for the listview
 */
@Component({
    selector: 'object-listview-settings-setfields-modal',
    templateUrl: '../templates/objectlistviewsettingssetfieldsmodal.html'
})
export class ObjectListViewSettingsSetfieldsModal {

    /**
     * reference to self to be able to close the modal
     */
    public self: any = {};

    /**
     * the listfields that are currently selected
     * cloned from the modellist service
     */
    public listFields: any[] = [];

    /**
     * the remaining available fields
     */
    public availableFields: any[] = [];

    /**
     * the list fo selected fields
     */
    public selectedAvailableFields: any[] = [];
    public selectedListFields: any[] = [];

    /**
     * load the modal and initlaize the fields from the modellist vs the ones available
     *
     * @param metadata
     * @param language
     * @param modellist
     */
    constructor(public metadata: metadata, public language: language, public modellist: modellist) {

        // get the listfields from the service
        this.listFields = _.clone(this.modellist.listfields);

        // get the default fields
        let componentconfig = this.metadata.getComponentConfig('ObjectList', this.modellist.module);
        let listFields = this.metadata.getFieldSetFields(componentconfig.fieldset);
        for (let listField of listFields) {
            if(!this.listFields.find(field => field.id == listField.id)) {
                this.availableFields.push({
                    id: listField.id,
                    field: listField.field,
                    fieldconfig:listField.fieldconfig
                });
            }
        }

        // sort the availabel fields if we have any
        if (this.availableFields.length > 0) {
            this.sortAvailableFields();
        }
    }

    /**
     * sorts the available fields
     */
    public sortAvailableFields() {
        this.availableFields = this.availableFields.sort((a, b) => {
            return this.language.getFieldDisplayName(this.modellist.module, a.field, a.fieldconfig).toLowerCase() > this.language.getFieldDisplayName(this.modellist.module, b.field, b.fieldconfig).toLowerCase() ? 1 : -1;
        });
    }

    /**
     * close the modal
     */
    public close(): void {
        this.self.destroy();
    }

    /**
     * check if we can save (at least one fields needs to be selected
     */
    public canSet(): boolean {
        return this.listFields.length > 0;
    }

    /**
     * save the fieldsettings
     */
    public set(): void {
        if (this.canSet()) {
            this.modellist.listfields = this.listFields;
            this.close();
        }
    }

    public saveAndSet() {
        if (!this.canSet()) return;
        this.modellist.listfields = this.listFields;
        this.modellist.updateListType().subscribe(() =>
            this.close()
        );
    }

    /**
     * for the drop of the field
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
    public selectField(container, fieldid) {
        switch (container) {
            case 'available':
                this.selectedAvailableFields = [fieldid];
                break;
            case 'list':
                this.selectedListFields = [fieldid];
                break;
        }
    }

    /*
     function to set the aria-selected attr on a field
     */
    public isSelected(container, field) {
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
    public moveFields(fromContainer) {
        switch (fromContainer) {
            case 'available':
                this.selectedAvailableFields.forEach((item) => {
                    this.availableFields.some((targetitem, targetindex) => {
                        if (item == targetitem.field) {
                            this.listFields.push(this.availableFields.splice(targetindex, 1)[0]);
                            return true;
                        }
                    });
                });
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
