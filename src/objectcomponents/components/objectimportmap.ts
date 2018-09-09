import {Component, Input} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';

import {objectimport} from '../services/objectimport.service';

declare var _: any;

@Component({
    selector: 'object-import-map',
    templateUrl: './src/objectcomponents/templates/objectimportmap.html',
})
export class ObjectImportMap {

    @Input('modelfields') modelFields: Array<any> = undefined;
    @Input('requiredmodelfields') requiredModelFields: Array<any> = undefined;

    constructor(private objectimport: objectimport, private language: language, private metadata: metadata, private model: model) {
    }

    get idFieldAction() {
        return this.objectimport.idFieldAction;
    }

    set idFieldAction(action) {
        this.objectimport.idFieldAction = action;
        if (action == 'auto')
            this.objectimport.idField = '';
    }

    get description() {
        return this.objectimport.stepLongText;
    }

    getMapping(row) {
        return this.objectimport.getMapping(row);
    }

    setMapping(row, event) {
        this.objectimport.setMapping(row, event.srcElement.value);
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