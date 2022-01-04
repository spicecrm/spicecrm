/**
 * @module SpiceImporterModule
 */
import {Component, Input} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {SpiceImporterService} from '../services/spiceimporter.service';

@Component({
    selector: 'spice-importer-check',
    templateUrl: '../templates/spiceimportercheck.html',
})

export class SpiceImporterCheck {
    @Input() public currentImportStep;

    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        public spiceImporter: SpiceImporterService,
    ) {
    }

    get fileMapping() {
        return this.spiceImporter.fileMapping;
    }

    get importDuplicateAction() {
        return this.spiceImporter.importDuplicateAction;
    }

    set importDuplicateAction(action) {
        this.spiceImporter.importDuplicateAction = action;
        this.setCheckFields(action);
    }

    public setCheckFields(action) {

        if (action == 'log') {
            this.spiceImporter.checkFields = [];
            for (let key in this.fileMapping) {
                if (this.fileMapping.hasOwnProperty(key)) {
                    this.spiceImporter.checkFields.push({mappedField: key, moduleField: this.fileMapping[key]});
                }
            }
        } else {
            this.spiceImporter.checkFields = [];
        }
    }

}
