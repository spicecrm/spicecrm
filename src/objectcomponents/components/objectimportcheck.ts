import {Component, Input } from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {objectimport} from '../services/objectimport.service';

@Component({
    selector: 'object-import-check',
    templateUrl: './app/objectcomponents/templates/objectimportcheck.html',
})

export class ObjectImportCheck {
    @Input() currentImportStep;

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private objectimport: objectimport,
    ) {
    }

    get fileMapping() {
        return this.objectimport.fileMapping;
    }

    get importDuplicateAction() {
        return this.objectimport.importDuplicateAction;
    }

    set importDuplicateAction(action) {
        this.objectimport.importDuplicateAction = action;
        this.setCheckFields(action);
    }

    setCheckFields(action) {

        if (action == 'log') {
            this.objectimport.checkFields = [];
            for (let key in this.fileMapping) {
                if (this.fileMapping.hasOwnProperty(key)) {
                    this.objectimport.checkFields.push({'mappedField': key, 'moduleField': this.fileMapping[key]});
                }
            }
        } else {
            this.objectimport.checkFields = [];
        }
    }

}