import {Component, Input} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {view} from '../../services/view.service';

import {objectimport} from '../services/objectimport.service';

declare var _: any;

@Component({
    selector: 'object-import-fixed',
    templateUrl: './app/objectcomponents/templates/objectimportfixed.html',
    providers: [view]
})


export class ObjectImportFixed {

    @Input('modelfields')
    set modelFields(value: Array<any>) {
        this.modelfields = value;
        this.filteredModuleFileds = value;
    }

    @Input('currentimportstep')
    set currentImportStep(value: number) {
        if (value == 2)
            this.getFilteredModuleFields();
    }

    @Input('requiredmodelfields')
    requiredModelFields: Array<any> = undefined;


    filteredModuleFileds: Array<any> = undefined;
    modelfields: Array<any> = undefined;

    constructor(
        private objectimport: objectimport,
        private language: language,
        private metadata: metadata,
        private model: model,
        private view: view
    ) {
        // set the vie to editable and edit mode
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    get modelFields() {
        return this.modelfields;
    }

    getFilteredModuleFields() {
        let invertedFileMapping = _.invert(this.objectimport.fileMapping);
        this.filteredModuleFileds = this.modelFields.filter(field => {
            return !invertedFileMapping.hasOwnProperty(field.name);
        });

    }

    setFixedField(index, value) {
        this.objectimport.setFixedField(index, value);
    }

    getFixed(row) {
        return this.objectimport.getFixed(row);

    }

    removeFixed(index) {
        this.model.data = _.omit(this.model.data, this.objectimport.fixedFields[index].field);
        this.objectimport.removeFixed(index);
    }

    checkRequired(fieldName) {

        let invertedFileMapping = _.invert(this.objectimport.fileMapping),
            mappedFieldChecked = invertedFileMapping.hasOwnProperty(fieldName),
            fixedFieldChecked = this.objectimport.fixedFields.some(field => field.field == fieldName);

        if (mappedFieldChecked || fixedFieldChecked)
            return true;

        return false;
    }

    isChosen(fieldName) {
        let invertedFileMapping = _.invert(this.objectimport.fileMapping);
        if(invertedFileMapping[fieldName])
            return true;
        return false;
    }

}