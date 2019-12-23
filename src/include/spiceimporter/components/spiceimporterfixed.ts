/**
 * @module SpiceImporterModule
 */
import {Component, Input} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {view} from '../../../services/view.service';

import {SpiceImporterService} from '../services/spiceimporter.service';

/**
 * @ignore
 */
declare var _: any;

@Component({
    selector: 'spice-importer-fixed',
    templateUrl: './src/include/spiceimporter/templates/spiceimporterfixed.html',
    providers: [view]
})


export class SpiceImporterFixed {

    @Input('requiredmodelfields')
    private requiredModelFields: any[];
    public filteredModuleFileds: any[];
    private modelfields: any[];

    constructor(
        private spiceImport: SpiceImporterService,
        private language: language,
        private metadata: metadata,
        private model: model,
        private view: view
    ) {
        // set the vie to editable and edit mode
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    @Input('currentimportstep')
    set currentImportStep(value: number) {
        if (value == 2) {
            this.getFilteredModuleFields();
        }
    }

    get modelFields() {
        return this.modelfields;
    }

    @Input('modelfields')
    set modelFields(value: any[]) {
        this.modelfields = value;
        this.filteredModuleFileds = value;
    }

    private getFilteredModuleFields() {
        let invertedFileMapping = _.invert(this.spiceImport.fileMapping);
        this.filteredModuleFileds = this.modelFields.filter(field => {
            return !invertedFileMapping.hasOwnProperty(field.name);
        });

    }

    private setFixedField(index, value) {
        this.spiceImport.setFixedField(index, value);
    }

    private getFixed(row) {
        return this.spiceImport.getFixed(row);

    }

    private removeFixed(index) {
        this.model.data = _.omit(this.model.data, this.spiceImport.fixedFields[index].field);
        this.spiceImport.removeFixed(index);
    }

    private checkRequired(fieldName) {

        let invertedFileMapping = _.invert(this.spiceImport.fileMapping),
            mappedFieldChecked = invertedFileMapping.hasOwnProperty(fieldName),
            fixedFieldChecked = this.spiceImport.fixedFields.some(field => field.field == fieldName);

        return mappedFieldChecked || fixedFieldChecked;


    }

    private isChosen(fieldName) {
        let invertedFileMapping = _.invert(this.spiceImport.fileMapping);
        return !!invertedFileMapping[fieldName];

    }

}
