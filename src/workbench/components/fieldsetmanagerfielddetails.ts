/**
 * @module WorkbenchModule
 */
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

    @Input() public field: any = {};
    private currentField: any = {};
    private fieldtypes: string[] = [];

    private component: string = "";
    public configValues: any = {};


    constructor(private backend: backend, private metadata: metadata, private language: language, private view: view) {
        this.fieldtypes = this.metadata.getFieldTypes();
        this.fieldtypes.sort();
        this.fieldtypes.unshift('');
    }

    public ngOnChanges(changes: SimpleChanges) {

        if (this.field.isViewMode) {
            this.view.setViewMode();
        } else {
            this.view.setEditMode();
        }

        try {
            let currentFieldsetItem;
            this.metadata.getFieldSetItems(this.field.fieldset).some(field => {
                if (field.id == this.field.id) {
                    this.currentField = field;
                    this.component = this.metadata.getFieldTypeComponent(field.fieldconfig.fieldtype);
                    this.configValues = field.fieldconfig;

                    return true;
                }
            });

        } catch (e) {
            this.currentField = {};
        }
    }

    get configValuesLabel() {
        // let ret: any = {};
        // ret = this.configValues;
        let ret = null;
        if ("label" in this.configValues) {
            if (this.configValues.label != null) {
                ret = {name: this.configValues.label};
            }
        }

        // this.configValues.name = this.configValues.label
        return ret;
    }

    set configValuesLabel(val) {
        if (val != null) {
            this.configValues.label = val.name;
        } else {
            this.configValues.label = null;
        }

    }

    public configValuesLabelEmit(val) {
        this.configValuesLabel = val;
    }


    get InputConfig() {
        let ret = {option: "name", type: "label", description: ""};
        // ret.option = this.language.getAppLanglabel('LBL_LABEL');
        return ret;
    }

    private getFieldConfig() {
        if (this.configValues.fieldtype) {
            let fieldComponent = this.metadata.getFieldTypeComponent(this.configValues.fieldtype);
            let configOptions = this.metadata.getComponentConfigOptions(fieldComponent);

            let optionsArray = [];
            for (let option in configOptions) {
                optionsArray.push(option);
            }
            return optionsArray;
        } else {
            return [];
        }
    }

    private selectFieldType() {
        this.component = this.metadata.getFieldTypeComponent(this.configValues.fieldtype);
        // this.configValues = Object.assign({}, this.configValues);
    }
}
