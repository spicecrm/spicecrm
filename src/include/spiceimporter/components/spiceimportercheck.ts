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
    templateUrl: './src/include/spiceimporter/templates/spiceimportercheck.html',
})

export class SpiceImporterCheck {
    @Input() private currentImportStep;

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private spiceImporter: SpiceImporterService,
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

    private setCheckFields(action) {

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
