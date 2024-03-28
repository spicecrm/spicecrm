/**
 * @module SpiceImporterModule
 */
import {Component, Input} from '@angular/core';
import {model} from '../../../services/model.service';
import {SpiceImporterService} from '../services/spiceimporter.service';

@Component({
    selector: 'spice-importer-update',
    templateUrl: '../templates/spiceimporterupdate.html',
})

export class SpiceImporterUpdate {
    @Input() public currentImportStep;
    public checkFields: any[] = [];

    constructor(
        public model: model,
        public spiceImport: SpiceImporterService
    ) {
    }

    get fileMapping() {
        return this.spiceImport.fileMapping;
    }

    /**
     * disable checkbox
     * if the mapped field is a non-db field
     * @param mappedFieldName
     */
    public disableCheckbox(mappedFieldName): boolean {
        return this.spiceImport.nonDBFields.some(field => field.name == mappedFieldName);
    }

    public setCheckedField(mappedField, moduleField, isChecked) {

        if (isChecked.target.checked) {
            this.spiceImport.checkFields = this.spiceImport.checkFields.filter(field => field.mappedField !== mappedField);
            this.spiceImport.checkFields.push({mappedField: mappedField, moduleField: moduleField});
        } else {
            this.spiceImport.checkFields = this.spiceImport.checkFields.filter(field => field.mappedField !== mappedField);
        }
    }

    public getCheckedField(mappedField) {
        return this.spiceImport.checkFields.some(field => field.mappedField == mappedField);
    }
}









