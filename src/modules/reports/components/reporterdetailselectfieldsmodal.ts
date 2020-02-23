/**
 * @module ModuleReports
 */
import {Component, OnInit} from '@angular/core';

import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';

/**
 * a modal that allows the user to choose from fields for a report
 */
@Component({
    templateUrl: './src/modules/reports/templates/reporterdetailselectfieldsmodal.html'
})
export class ReporterDetailSelectFieldsModal implements OnInit {

    /**
     * reference to self to be able to close the modal
     */
    private self: any = {};

    /**
     * the report fields .. passed in from the view
     */
    private presentationFields: any[] = [];

    /**
     * the remaining available fields
     */
    private availableFields: any[] = [];

    /**
     * the display fields
     */
    private displayFields: any[] = [];

    /**
     * the list fo selected fields
     */
    private selectedAvailableFields: any[] = [];
    private selectedListFields: any[] = [];

    /**
     * load the modal and initlaize the fields from the modellist vs the ones available
     *
     * @param metadata
     * @param language
     * @param modellist
     */
    constructor(private metadata: metadata, private language: language, private model: model) {
    }

    /**
     * builds the field arrays
     */
    public ngOnInit(): void {
        this.availableFields = this.presentationFields.filter((field => field.display == 'no'));
        this.displayFields = this.presentationFields.filter((field => field.display == 'yes'));

        // sort the availabel fields if we have any
        if (this.availableFields.length > 0) {
            this.sortAvailableFields();
        }

        this.displayFields.sort((a, b) => parseInt(a.sequence, 10) > parseInt(b.sequence, 10) ? -1 : 1);
    }

    /**
     * sorts the available fields
     */
    private sortAvailableFields() {
        this.availableFields = this.availableFields.sort((a, b) => {
            return this.language.getLabel(a.name).toLowerCase() > this.language.getLabel(b.name).toLowerCase() ? 1 : -1;
        });
    }

    /**
     * close the modal
     */
    private close(): void {
        this.self.destroy();
    }

    /**
     * check if we can save (at least one fields needs to be selected
     */
    private canSet(): boolean {
        return this.displayFields.length > 0;
    }

    /**
     * save the fieldsettings
     */
    private set(): void {
        if (this.canSet()) {
            let sequence = 1;
            for (let displayField of this.displayFields) {
                displayField.display = 'yes';
                displayField.sequence = sequence;
                if(!displayField.width) displayField.width = 25;
                sequence++;
            }
            for (let availableField of this.availableFields) {
                availableField.display = 'no';
                availableField.sequence = sequence;
                sequence++;
            }
            this.presentationFields.sort((a, b) => parseInt(a.sequence, 10) > parseInt(b.sequence, 10) ? 1 : -1);
            this.close();
        }
    }

    /**
     * for the drop of the field
     *
     * @param event
     */
    private onFieldDrop(event) {
        let previousItem = event.previousContainer.data.splice(event.previousIndex, 1);
        event.container.data.splice(event.currentIndex, 0, previousItem[0]);
    }

    /*
     select the field when clicked int he container
     */
    private selectField(container, fieldid) {
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
                            this.displayFields.push(this.availableFields.splice(targetindex, 1)[0]);
                            return true;
                        }
                    });
                });
                this.selectedAvailableFields = [];
                break;
            case 'list':
                this.selectedListFields.forEach((item) => {
                    this.displayFields.some((targetitem, targetindex) => {
                        if (item == targetitem.field) {
                            this.availableFields.push(this.displayFields.splice(targetindex, 1)[0]);
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
