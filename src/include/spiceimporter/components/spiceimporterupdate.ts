/**
 * @module SpiceImporterModule
 */
import {Component, Input} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {SpiceImporterService} from '../services/spiceimporter.service';

@Component({
    selector: 'spice-importer-update',
    templateUrl: './src/include/spiceimporter/templates/spiceimporterupdate.html',
})

export class SpiceImporterUpdate {
    @Input() private currentImportStep;
    public checkFields: any[] = [];

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private spiceImport: SpiceImporterService
    ) {
    }

    get fileMapping() {
        return this.spiceImport.fileMapping;
    }

    private setCheckedField(mappedField, moduleField, isChecked) {

        if (isChecked.target.checked) {
            this.spiceImport.checkFields = this.spiceImport.checkFields.filter(field => field.mappedField !== mappedField);
            this.spiceImport.checkFields.push({mappedField: mappedField, moduleField: moduleField});
        } else {
            this.spiceImport.checkFields = this.spiceImport.checkFields.filter(field => field.mappedField !== mappedField);
        }
    }

    private getCheckedField(mappedField) {
        return this.spiceImport.checkFields.some(field => field.mappedField == mappedField);
    }
}









