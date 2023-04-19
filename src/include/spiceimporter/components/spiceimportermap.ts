/**
 * @module SpiceImporterModule
 */
import {Component, Input} from '@angular/core';
import {model} from '../../../services/model.service';

import {SpiceImporterService} from '../services/spiceimporter.service';

/**
 * @ignore
 */
declare var _: any;

@Component({
    selector: 'spice-importer-map',
    templateUrl: '../templates/spiceimportermap.html',
})
export class SpiceImporterMap {

    @Input('modelfields') public modelFields: any[] = undefined;
    @Input('requiredmodelfields') public requiredModelFields: any[] = undefined;

    constructor(
        public spiceImport: SpiceImporterService,
        public model: model) {
    }

    get idFieldAction() {
        return this.spiceImport.idFieldAction;
    }

    set idFieldAction(action) {
        this.spiceImport.idFieldAction = action;
        if (action == 'auto') {
            this.spiceImport.idField = '';
        }
    }

    get description() {
        return this.spiceImport.stepLongText;
    }

    public getMapping(row) {
        return this.spiceImport.getMapping(row);
    }

    public setMapping(row, event) {
        this.spiceImport.setMapping(row, event.target.value);
    }

    public checkRequired(fieldName) {

        let invertedFileMapping = _.invert(this.spiceImport.fileMapping),
            mappedFieldChecked = invertedFileMapping.hasOwnProperty(fieldName),
            fixedFieldChecked = this.spiceImport.fixedFields.some(field => field.field == fieldName);

        return mappedFieldChecked || fixedFieldChecked;


    }

    public isChosen(fieldName) {
        let invertedFileMapping = _.invert(this.spiceImport.fileMapping);
        return !!invertedFileMapping[fieldName];

    }

    public trackByFn(index, item) {
        return index;
    }
}
