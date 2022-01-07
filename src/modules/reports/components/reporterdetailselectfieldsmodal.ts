/**
 * @module ModuleReports
 */
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {BehaviorSubject} from "rxjs";

/**
 * a modal that allows the user to choose from fields for a report
 */
@Component({
    templateUrl: '../templates/reporterdetailselectfieldsmodal.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReporterDetailSelectFieldsModal implements OnInit {

    public dataChanged$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    /**
     * the report fields .. passed in from the view
     */
    public presentationFields: any[] = [];
    /**
     * reference to self to be able to close the modal
     */
    public self: any = {};
    /**
     * the remaining available fields
     */
    public availableFields: any[] = [];
    /**
     * the display fields
     */
    public displayFields: any[] = [];

    constructor(public metadata: metadata, public language: language) {
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

        this.displayFields.sort((a, b) => !!a.sequence && !!b.sequence ? parseInt(a.sequence, 10) > parseInt(b.sequence, 10) ? 1 : -1 : 0);
    }

    /**
     * sorts the available fields
     */
    public sortAvailableFields() {
        this.availableFields = this.availableFields.sort((a, b) => {
            return this.language.getLabel(a.name).toLowerCase() > this.language.getLabel(b.name).toLowerCase() ? 1 : -1;
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
        return this.displayFields.length > 0;
    }

    /**
     * save the fieldsettings
     */
    public set(): void {
        if (this.canSet()) {
            let sequence = 1;
            for (let displayField of this.displayFields) {
                displayField.display = 'yes';
                displayField.sequence = sequence;
                if (!displayField.width) displayField.width = 25;
                sequence++;
            }
            for (let availableField of this.availableFields) {
                availableField.display = 'no';
                availableField.sequence = sequence;
                sequence++;
            }
            this.presentationFields.sort((a, b) => !!a.sequence && !!b.sequence ? parseInt(a.sequence, 10) > parseInt(b.sequence, 10) ? 1 : -1 : 0);

            this.dataChanged$.next(true);
            this.dataChanged$.complete();
            this.close();
        }
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
}
