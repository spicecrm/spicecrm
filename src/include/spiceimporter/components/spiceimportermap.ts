/**
 * @module SpiceImporterModule
 */
import {Component, Input} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';

import {SpiceImporterService} from '../services/spiceimporter.service';

/**
 * @ignore
 */
declare var _: any;

@Component({
    selector: 'spice-importer-map',
    templateUrl: './src/include/spiceimporter/templates/spiceimportermap.html',
})
export class SpiceImporterMap {

    @Input('modelfields') public modelFields: any[] = undefined;
    @Input('requiredmodelfields') public requiredModelFields: any[] = undefined;

    constructor(private spiceImport: SpiceImporterService, private language: language, private metadata: metadata, private model: model) {
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

    private getMapping(row) {
        return this.spiceImport.getMapping(row);
    }

    private setMapping(row, event) {
        this.spiceImport.setMapping(row, event.srcElement.value);
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

    private trackByFn(index, item) {
        return index;
    }
}
