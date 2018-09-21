import {
    Component,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {view} from '../../services/view.service';


@Component({
    selector: 'fieldsetmanager-field-details',
    templateUrl: './src/workbench/templates/fieldsetmanagerfielddetails.html',
    providers: [view]
})
export class FieldsetManagerFieldDetails implements OnChanges {

    @Input() field: any = {};
    currentField: any = {};
    fieldtypes: Array<string> = [];

    component: string = "";
    configValues: any = {};


    constructor(private backend: backend, private metadata: metadata, private language: language, private view: view) {
        this.fieldtypes = this.metadata.getFieldTypes();
        this.fieldtypes.sort();
        this.fieldtypes.unshift('');
    }

    ngOnChanges(changes: SimpleChanges) {

        if (this.field.isViewMode) {
            this.view.setViewMode();
        } else {
            this.view.setEditMode();
        }

        try {
            let currentFieldsetItem;
            this.metadata.getFieldSetFields(this.field.fieldset).some(field => {
                if (field.id == this.field.id) {
                    this.currentField = field;
                    this.component = this.metadata.getFieldTypeComponent(field.fieldconfig.fieldtype);
                    this.configValues = field.fieldconfig;

                    return true;
                }
            })

        } catch (e) {
            this.currentField = {};
        }
    }


    getFieldConfig() {
        if (this.configValues.fieldtype) {
            let fieldComponent = this.metadata.getFieldTypeComponent(this.configValues.fieldtype);
            let configOptions = this.metadata.getComponentConfigOptions(fieldComponent);

            let optionsArray = [];
            for (let option in configOptions) {
                optionsArray.push(option);
            }
            return optionsArray;
        } else
            return [];
    }

    selectFieldType() {
        this.component = this.metadata.getFieldTypeComponent(this.configValues.fieldtype);
        this.configValues = Object.assign({}, this.configValues);
    }

}
