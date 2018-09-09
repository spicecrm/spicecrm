import {
    Component,
    Input,
    AfterViewInit,
    OnInit,
    ViewChild,
    ViewContainerRef,
    OnDestroy,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import {model} from '../../services/model.service';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {view} from '../../services/view.service';

import {Subject} from 'rxjs';

@Component({
    selector: 'fieldsetmanager-field-details',
    templateUrl: './app/workbench/templates/fieldsetmanagerfielddetails.html',
    providers: [view]
})
export class FieldsetManagerFieldDetails implements OnChanges{

    @Input() field: any = {};
    currentField: any = {};
    currentFieldConfig: any = {};
    fieldtypes: Array<string> = [];

    constructor(private backend: backend, private metadata: metadata, private language: language, private view: view) {
        this.fieldtypes = this.metadata.getFieldTypes();
        this.fieldtypes.sort();
        this.fieldtypes.unshift('');
    }

    ngOnChanges(changes: SimpleChanges){

        if(this.field.isViewMode) {
            this.view.setViewMode();
        }else{
            this.view.setEditMode();
        }

        try {
            let currentFieldsetItem;
            this.metadata.getFieldSetFields(this.field.fieldset).some(field => {
                if(field.id == this.field.id){
                    this.currentField = field;
                    this.currentFieldConfig = field.fieldconfig;
                    return true;
                }
            })

        } catch(e){
            this.currentField = {};
        }
    }

    getFieldConfig(){
        if(this.currentFieldConfig.fieldtype) {
            // console.log("this.currentFieldConfig.fieldtype", this.currentFieldConfig.fieldtype);
            let fieldComponent = this.metadata.getFieldTypeComponent(this.currentFieldConfig.fieldtype);
            // console.log("fieldComponent", fieldComponent);
            let configOptions = this.metadata.getComponentConfigOptions(fieldComponent);
            // console.log("configOptions", configOptions);

            let optionsArray = [];
            for(let option in configOptions) {
                optionsArray.push(option);
            }
            // console.log("optionsArray", optionsArray);
            return optionsArray;
        } else
            return [];
    }


    selectFieldType(){
        this.currentField = Object.assign({}, this.currentField);
    }

}
