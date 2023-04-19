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

    public showModuleFieldDropdown = false;

    public modelfields: any = [];

    constructor(
        public metadata: metadata,
        public model: model,
        public spiceImporter: SpiceImporterService,
    ) {
        // get all module fields (vardefs)
        const moduleFields = this.metadata.getModuleFields(this.model._module);

        // Step 1: Set all the vardef fields into a new array
        for (let field in moduleFields) {
            if (moduleFields[field].source != 'non-db' || moduleFields[field].type == 'name' || moduleFields[field].type == 'vchar' || moduleFields[field].type == 'char' || moduleFields[field].type == 'id') {
                this.modelfields.push({
                    name: moduleFields[field].name,
                    vname: moduleFields[field].vname
                });
            }
        }
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

    public setCSVRejectExistingKey(csvField) {
        this.spiceImporter.rejectExistingKey = csvField + '::';
        if (!this.spiceImporter.fileMapping[csvField]) {
            this.showModuleFieldDropdown = true;
        } else {
            this.spiceImporter.rejectExistingKey += this.spiceImporter.fileMapping[csvField];
        }
    }

    public csvRejectExistingKey;
    public moduleRejectExistingKey;

    setModuleRejectExistingKey (value) {
        const fields = this.spiceImporter.rejectExistingKey.split('::');
        fields[1] = value;
        this.spiceImporter.rejectExistingKey = fields.join('::');
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

    public trackByFn(index, item) {
        return index;
    }
}
