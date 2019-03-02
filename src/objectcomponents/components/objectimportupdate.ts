/**
 * @module ObjectComponents
 */
import {Component, Input} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {objectimport} from '../services/objectimport.service';

@Component({
    selector: 'object-import-update',
    templateUrl: './src/objectcomponents/templates/objectimportupdate.html',
})

export class ObjectImportUpdate {
    @Input() currentImportStep;
    checkFields: Array<any> = [];

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private objectimport: objectimport
    ) {
    }

    get fileMapping() {
        return this.objectimport.fileMapping;
    }

    setCheckedField(mappedField, moduleField, isChecked) {

        if (isChecked) {
            this.objectimport.checkFields = this.objectimport.checkFields.filter(field => field.mappedField !== mappedField);
            this.objectimport.checkFields.push({'mappedField': mappedField, 'moduleField': moduleField});
        } else {
            this.objectimport.checkFields = this.objectimport.checkFields.filter(field => field.mappedField !== mappedField);
        }
    }

    getCheckedField(mappedField) {
        return this.objectimport.checkFields.some(field => field['mappedField'] == mappedField);
    }
}









